import {resolve} from 'path';
import {exec, execSync} from 'child_process';
import {get, upperFirst, last} from 'lodash';

const FILE_PREFIX = '+++ ';

export class Reporter {
  static makeReport(config: ReportConfig): Promise<GitRecord[] | Error> {
    const {project, branch, since, until, author} = config;
    const projectFolder = resolve(`${process.cwd()}/../${project}`);
    const authorFilter = (author && `--author="${author}"`) || '';
    const cmd = `git log ${branch} --oneline --since="${since}" --until="${until}" ${authorFilter}`;
    console.log(cmd);
    return new Promise((resolve, reject) => {
      exec(cmd, {cwd: projectFolder}, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          reject(error);
          console.log(`stderr: ${stderr}`);
        }

        const log = stdout
          .split('\n')
          .filter((line) => line.trim())
          .reduce((ac: GitRecord[], line) => {
            const hash: string = get(line.match(/^\S+/), '0');
            if (!hash) {
              console.warn(line);
              return ac;
            }
            ac = [
              ...ac,
              {
                hash: hash,
                header: upperFirst(line.replace(/^\S+\s/, '')),
                fileChanges: [],
              },
            ];
            return ac;
          }, []);

        log.forEach((record) => {
          const command = `git show ${record.hash} -- . ':!*.json' --no-ext-diff --unified=0 --exit-code -a --no-prefix | egrep "^\\+"`;
          let diff;
          try {
            diff = execSync(command, {
              maxBuffer: 1024 * 1024 * 512,
              cwd: projectFolder,
            })?.toString();
          } catch (e) {
            console.log(e);
            return;
          }
          const diffLines = diff?.split('\n');
          diffLines.forEach((line) => {
            if (line.startsWith(FILE_PREFIX) && !line.endsWith('/dev/null')) {
              record.fileChanges.push({
                filename: line.replace(FILE_PREFIX, ''),
                lineChanges: '',
              });
            } else if (!line.endsWith('/dev/null')) {
              const change: FileChanges | undefined = last(record.fileChanges);
              Object.assign(change || {}, {
                lineChanges: change?.lineChanges + `${line.substring(1)}\n`,
              });
            }
          });
          // console.log(diffLines);
        });
        resolve(log);
      });
    });
  }
}

export type ReportConfig = {
  project: string;
  branch: string;
  since: string;
  until: string;
  author: string;
};

export type GitRecord = {
  hash: string;
  header: string;
  fileChanges: FileChanges[];
};

export type FileChanges = {
  filename: string;
  lineChanges: string;
};
