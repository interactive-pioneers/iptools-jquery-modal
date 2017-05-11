# Contributing

## Important notes
Please don't edit files in the `dist` subdirectory as they are generated via Grunt. You'll find source code in the `src` subdirectory!

### Code style
See [JavaScript coding conventions](http://conventions.interactive-pioneers.com/JavaScript) of Interactive Pioneers.

## Modifying the code
First, ensure that you have [Node.js](http://nodejs.org/) 6.2.0 or greater installed.

1. Fork and clone the repo.
1. Run `npm install` to install all build dependencies (including Grunt).
1. Run `npm run grunt watch` to watch this project for changes and QA automatically as code is changed.

## Submitting pull requests

1. Create a new branch, please don't work in your `master` branch directly.
1. Add failing tests for the change you want to make. Run `npm run grunt mocha` to see the tests fail.
1. Fix stuff.
1. Run `npm test` to see if the tests pass. Repeat steps 2-4 until done.
1. Update the documentation to reflect any changes.
1. Push to your fork and submit a pull request.

## Bug reports, suggestions

- File all your issues, feature requests [here](https://github.com/interactive-pioneers/iptools-jquery-modal/issues)
- If filing a bug report, follow the convention of _Steps to reproduce_ / _What happens?_ / _What should happen?_
- __If you're a developer, write a failing test instead of a bug report__ and send a Pull Request. See [Submitting pull requests](#submitting-pull-requests).

## Tips

Following tasks are there to help with development:

- `npm start` listen to tests and source, rerun tests
- `npm test` run QA task that includes tests, JSHint, and JSCion
- `npm run grunt build` build and minify source to dist/
- `npm run server` run server to test distribution on page
