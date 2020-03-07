# Git Reporter 1.0.0

## Getting started

1. Clone this repository somewhere to the parent folder of inspected projects and then open it

```bash
$ git clone git@github.com:adolgoff/Git-reporter.git
$ cd git-reporter
```

2. Install dependencies

```bash
$ yarn
```

3. Launch the dev mode

```bash
$ yarn dev
```

4. Check out the `config` const to see posible configurable variables: project name, branch to be inspected, author to be filtered and dates frames

## Scripts

- `yarn dev`. Runs the project in dev mode, which means that it won't check types and will restart with every change you make.
- `yarn build`. Compiles the project to the `./dist` folder.
- `yarn typecheck`. Checks the typings of the project. Gets executed before trying to create a new commit but you can also run it manually.
- `yarn start`. Runs the compiled program. Remember to execute `yarn build` before attempting to launch the program.
- `yarn lint`. Runs ESLint. You can append `--fix` in order to fix autofixable issues.

## What to do next

Adapt the configuration to your needs and start the application!
