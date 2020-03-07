import {Reporter} from './reporter/reporter';
import express from 'express';
import path from 'path';

const config = {
  project: 'project',
  branch: 'origin/master',
  since: '01.02.2020',
  until: '01.03.2020',
  author: 'author',
};

const app = express();
const port = 8080; // default port to listen

// Configure Express to use EJS
app.use(express.static(path.join(__dirname, 'views/assets')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// define a route handler for the default home page
app.get('/', (req, res) => {
  // render the index template
  res.render('index');
});

// define a route handler for the default home page
app.get('/report', (req, res) => {
  // render the index template

  Reporter.makeReport(config).then((log) =>
    // console.log(`stdout: \n${JSON.stringify(log, null, 2)}`),
    res.render('report', {log, meta: config}),
  );
});

// start the express server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
