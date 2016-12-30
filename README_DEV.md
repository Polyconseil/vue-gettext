# vue-gettext

## Table of contents

- [Project Structure](#project-structure)
- [Dev setup](#dev-setup)
- [Pull request guidelines](#pull-request-guidelines)
- [Implementation notes](#implementation-notes)
- [Dev setup notes](#dev-setup-notes)

## Project structure

```
.
├── build/            # Build and environment config files.
├── dev/              # Files used for the development of the plugin.
├── dist/             # The production version of the plugin.
├── src/              # Source code of the plugin.
├── test/             # Unit tests.
├── .babelrc          # Babel config
├── .eslintrc.js      # Eslint config
├── Makefile          # A Makefile to extract translations and generate .po files
└── package.json      # Build scripts and dependencies
```

## Dev setup

```shell
# install deps
npm install

# serve examples at localhost:8080
npm run dev

# lint & run all tests
npm run test
```

## Pull request guidelines

[Inspired by Vue](https://github.com/vuejs/vue/blob/299ecfc19fa0f59effef71d24686bd7eb70ecbab/.github/CONTRIBUTING.md#pull-request-guidelines).

- explain why/what you are doing in the PR description, so that anybody can quickly understand what you want
- all development should be done in dedicated branches
- do not touch files in `dist` because they are automatically generated at release time
- add accompanying test case(s)
- make sure `npm test` passes

## Implementation notes

### Version number

I changed the plugin version number to 2.x to match Vue.js 2.0 version.

### New component tag name

By popular demand, `<get-text>` has been renamed `<translate>`.

### Interpolation in the `<translate>` component

Interpolation inside attributes are deprecated in Vue 2. See my question on
the Vue.js forum:

> [What is the Vue 2 vm.$interpolate alternative?](https://forum.vuejs.org/t/what-is-the-vue-2-vm-interpolate-alternative/2866)

This breaks the old `vue-gettext 1` component.

The solution I have reached is to use a set of custom delimiters for
placeholders in component templates together with a custom interpolation
function, e.g.:

```
<translate>Hello %{name}, I am the translation key!</translate>
                    ↓
Hello %{name}, I am the translation key!
                    ↓
Hello John, I am the translation key!
```

Drawbacks:

- `vue-gettext 2` works only with Vue 2.0
- it add a minimal hook to your templates code

But it works very well while waiting for something better. Practicality beats
purity I guess.

## Dev setup notes

My notes about the plugin setup.

I wanted to explore the Webpack ecosystem and some choices made in
[the Webpack template](https://github.com/vuejs-templates/webpack/)
for [vue-cli](https://github.com/vuejs/vue-cli).

`npm`'s `package.json`:

- [package.json](https://docs.npmjs.com/files/package.json)
- [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)

### 1) Webpack and HMR (Hot Module Replacement)

```
express
html-webpack-plugin
webpack
webpack-dev-middleware
webpack-hot-middleware
```

```
npm install --save-dev express html-webpack-plugin webpack webpack-dev-middleware webpack-hot-middleware
```

Webpack [is a module bundler](https://webpack.github.io/docs/what-is-webpack.html).
It takes a bunch of files (JS, CSS, Images, HTML etc.), treating each as a
module, figuring out the dependencies between them, and bundle them into
static assets that are ready for deployment.

["Hot Module Replacement" (HMR)](https://webpack.github.io/docs/hot-module-replacement.html)
is a Webpack **development** feature to inject updated modules into the active
runtime.

There are [3 ways to set up HMR](http://andrewhfarmer.com/3-ways-webpack-hmr/).
We use [`webpack-hot-middleware`](https://github.com/glenjamin/webpack-hot-middleware/)
to run a Webpack dev server with HMR inside an [`express`](https://expressjs.com)
server. Compilation should be faster because the packaged files are written
to memory rather than to disk.

[In Express, a middleware](http://expressjs.com/en/guide/writing-middleware.html)
is a function that receives the request and response objects of an HTTP
request/response cycle. It may modify (transform) these objects before passing
them to the next middleware function in the chain. It may decide to write to
the response; it may also end the response without continuing the chain.

[The Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware/blob/04f953/README.md#how-it-works)
installs itself as a Webpack plugin, and listens for compiler events.
Each connected client gets a
[Server Sent Events](https://www.html5rocks.com/en/tutorials/eventsource/basics/)
connection, the server will publish notifications to connected clients on
compiler events. When the client receives a message, it will check to see
if the local code is up to date. If it isn't up to date, it will trigger
Webpack Hot Module Replacement.

HMR is opt-in, so we also need to put some code at chosen points of our
application. This had not yet been done since we have to dive into the
HMR JavaScript API (but state preserving hot-reload is implemented in
[`vue-webpack-boilerplate`](https://github.com/vuejs-templates/webpack/)).

The [HTML Webpack Plugin](https://github.com/ampedandwired/html-webpack-plugin)
will generate an `index.html` entry point to our application, and auto inject
our Webpack bundles. This is especially useful for multiple environment builds,
to stop the HTML getting out of sync between environments, avoiding
hard-written paths and simplifying the cache busting process. Here's how the
entry point is automatically added: in Webpack there is a `make` plugin hook
on the compilation in which entry points can be added ; see
[this](https://github.com/webpack/webpack/issues/536#issuecomment-121316002),
[this](https://github.com/webpack/webpack/blob/fb7958/lib/SingleEntryPlugin.js#L19-L21)
and [this](https://github.com/ampedandwired/html-webpack-plugin/blob/62c9e7/lib/compiler.js#L52).

Note: the Webpack template
[serves static files with Express](http://expressjs.com/en/starter/static-files.html).

- [Webpack — Concepts](https://webpack.js.org/concepts/)
- [Webpack — Configuration](https://webpack.js.org/configuration/)
- [Webpack — The Missing Tutorial](https://github.com/shekhargulati/52-technologies-in-2016/blob/master/36-webpack/README.md)
- [Webpack — The Confusing Parts](https://medium.com/@rajaraodv/webpack-the-confusing-parts-58712f8fcad9)
- [Webpack + Express — The simplest Webpack and Express setup](https://alejandronapoles.com/2016/03/12/the-simplest-webpack-and-express-setup/)
- [HMR — Hot Module Replacement with Webpack](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html)
- [HMR — Understanding Webpack HMR](http://andrewhfarmer.com/understanding-hmr/)
- [HMR — Webpack HMR Tutorial](http://andrewhfarmer.com/webpack-hmr-tutorial/)
- [HMR — Webpack Middleware and Hot Module Replacement](https://alejandronapoles.com/2016/03/12/webpack-middleware-and-hot-module-replacement/)

### 2) Splitting the Webpack configuration for multiple environments

There are several ways of splitting the Webpack configuration for multiple
environments.

Some people prefer maintaining configuration
[within a single file and branch there](http://survivejs.com/webpack/developing-with-webpack/splitting-configuration/),
other prefer [partial configurations files](https://github.com/vuejs-templates/webpack/tree/94e921/template/build)
that then can be merged together using specialized tools like
[`webpack-merge`](https://github.com/survivejs/webpack-merge).

We took a different approach here: one file per environment, because we don't
provide production environment so we just have one file for the development
environment. The distribution build is made with Rollup (cf section 11 of this
file).

The current environment is set in an environment variable. Node.js provides the
[`process.env` property](https://nodejs.org/api/process.html#process_process_env)
containing the user environment and [`NODE_ENV`](https://stackoverflow.com/a/16979503)
is an environment variable made popular by the Express webserver framework.

If `NODE_ENV` is not set explicitly, it will be undefined. So we explicitly set
it in JavaScript for the Express application, e.g.:
`process.env.NODE_ENV = 'development'`.

Sometimes we also need to use environment variables (or other constants) in the
client code. They can be exposed as global constants via
[`webpack.DefinePlugin`](https://webpack.github.io/docs/list-of-plugins.html#defineplugin).

- [NodeJs Best Practices: Environment-Specific Configuration](http://eng.datafox.co/nodejs/2014/09/28/nodejs-config-best-practices/)
- [Simple production environment with Webpack and Express](https://alejandronapoles.com/2016/09/29/simple-production-environment-with-webpack-and-express/)
- [How to load different .env.json files into the app depending on environment](https://forum-archive.vuejs.org/topic/3838/how-to-load-different-env-json-files-into-the-app-depending-on-environment)
- [Why does Webpack's DefinePlugin require us to wrap everything in JSON.stringify?](https://stackoverflow.com/q/39564802)

### 3) Linting with ESLint

```
eslint
eslint-config-standard
eslint-plugin-promise        // Required by `eslint-config-standard`.
eslint-plugin-standard       // Required by `eslint-config-standard`.
```

```
npm install --save-dev eslint eslint-config-standard eslint-plugin-promise eslint-plugin-standard
```

We use the Standard preset with some small customizations, see rules
in `.eslintrc.js`.

Note: I'm using the
[JavaScript ESLint TextMate Bundle](https://github.com/natesilva/javascript-eslint.tmbundle),
in a personal capacity.

- [ESLint](http://eslint.org)
- [Configuring ESLint](http://eslint.org/docs/user-guide/configuring)
- [JavaScript Standard Style](http://standardjs.com)
- [`eslint-config-standard` - ESLint Shareable Config](https://github.com/feross/eslint-config-standard/blob/c879df/README.md)

### 4) Linting with Webpack

```
eslint-loader
eslint-friendly-formatter
```

```
npm install --save-dev eslint-loader eslint-friendly-formatter
```

- [Linting in Webpack](http://survivejs.com/webpack/advanced-techniques/linting/)
- [`eslint-loader`](https://github.com/MoOx/eslint-loader/blob/81d743/README.md)
- [`eslint-friendly-formatter`](https://github.com/royriojas/eslint-friendly-formatter/blob/f83e20/README.md)

### 5) Babel

```
babel-core                      // Babel compiler core.
babel-loader                    // Allows transpiling JavaScript files using Babel and Webpack.
babel-preset-es2015             // ES6/ES2015 support.
babel-plugin-transform-runtime  // Avoid repeated inclusion of Babel's helper functions.
```

```
npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-plugin-transform-runtime
```

See the Babel configuration in
[`.babelrc`](https://babeljs.io/docs/usage/babelrc/).

- [Setting up ES6](https://leanpub.com/setting-up-es6/read)
- [Babel](https://babeljs.io)
- [Clearing up the Babel 6 Ecosystem](https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3#.4d6dujqy6)
- [Using ES6 and ES7 in the Browser, with Babel 6 and Webpack](http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/)
- [The Six Things You Need To Know About Babel 6](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/)

### 6) Vue.js

```
vue
```

```
npm install --save-dev vue
```

We use [the standalone build](https://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build)
which includes the compiler and supports the template option.

### 7) Vue loader

```
vue-loader
vue-template-compiler
eslint-plugin-html
```

```
npm install --save-dev vue-loader vue-template-compiler eslint-plugin-html
```

`vue-loader` is a loader for Webpack that can transform Vue components into a
plain JavaScript module.

Since [Vue 2.1.0](https://github.com/vuejs/vue/releases/tag/v2.1.0), `vue-template-compiler` is a peer dependency of `vue-loader` instead of a direct dependency.

We also need the [`eslint-html-plugin`](https://github.com/BenoitZugmeyer/eslint-plugin-html)
with supports extracting and linting the JavaScript inside `*.vue` files and
[enable it](https://github.com/BenoitZugmeyer/eslint-plugin-html/tree/40c728#usage)
in the `.eslintrc.js` config file.

- [`vue-loader`](https://github.com/vuejs/vue-loader/)
- [Vue Loader doc](https://vue-loader.vuejs.org/en/index.html)

### 8) Common loaders

```
html-loader
json-loader
```

```
npm install --save-dev html-loader json-loader
```

### 9) CSS

```
style-loader            // Adds CSS to the DOM by injecting a style tag.
css-loader
postcss-loader
postcss-cssnext
postcss-import
```

```
npm install --save-dev css-loader style-loader postcss-loader postcss-cssnext postcss-import
```

This is how I use scoped CSS in components for the development of the plugin:

Component's styles are locally scoped in each of them to avoid class name
conflicts. This is done via
[`css-loader`'s *Local scope*](https://github.com/webpack/css-loader/tree/22f662#local-scope).

The [`PostCSS-cssnext`](http://cssnext.io) syntax is used across components:
it's a [PostCSS](https://github.com/postcss/postcss#readme) plugin that let us
use the latest CSS syntax today.

[`postcss-import`](https://github.com/postcss/postcss-import) lets us import
CSS variables like this: `@import './styles/variables.css';`.

There are other way to scope CSS:

- [The End of Global CSS](https://medium.com/seek-developers/the-end-of-global-css-90d2a4a06284#.p75rvxr1x)
- [Local Scope in CSS](http://mattfairbrass.com/2015/08/17/css-achieving-encapsulation-scope/)
- [CSS Modules in vue-loader](https://vue-loader.vuejs.org/en/features/css-modules.html)

Note: CSS are buried inside our Javascript bundles by default. We can use the
`ExtractTextPlugin` to extracts them into external `.css` files in a
production environment.

### 10) Unit tests

```
karma
mocha
karma-mocha
karma-phantomjs-launcher
chai                         // Required by `karma-sinon-chai`.
sinon                        // Required by `karma-sinon-chai`.
sinon-chai                   // Required by `karma-sinon-chai`.
karma-sinon-chai
karma-webpack
```

```
npm install --save-dev karma mocha karma-mocha karma-phantomjs-launcher chai sinon sinon-chai karma-sinon-chai karma-webpack
```

[Karma](https://karma-runner.github.io/1.0/intro/installation.html) is a
JavaScript command line tool that can be used to spawn a web server which
loads application's source code, executes tests and reports the results.
It runs on Node.js and is available as an NPM package.

[Mocha](https://mochajs.org) is the test framework that we write test specs
with. `karma-mocha` lets Karma use Mocha as the test framework.

`karma-phantomjs-launcher` lets Karma run tests with
[PhantomJS](http://phantomjs.org). PhantomJS is a headless WebKit scriptable
with a JavaScript API.

[Chai](http://chaijs.com) and [Sinon](http://sinonjs.org)
([Sinon-Chai](https://github.com/domenic/sinon-chai)) are integrated using
[`karma-sinon-chai`](https://github.com/kmees/karma-sinon-chai), so all Chai
interfaces (`should`, `expect`, `assert`) and `sinon` are globally available
in test files. Just let `.eslintrc` know about them.

[`karma-webpack`](https://github.com/webpack/karma-webpack) uses Webpack to
preprocess files in Karma.

- Cheatsheets: [mocha](http://ricostacruz.com/cheatsheets/mocha.html) [chai](http://ricostacruz.com/cheatsheets/chai.html) [sinon](http://ricostacruz.com/cheatsheets/sinon.html) [sinon-chai](http://ricostacruz.com/cheatsheets/sinon-chai.html)
- [The Ultimate Unit Testing Cheat-sheet](https://gist.github.com/yoavniran/1e3b0162e1545055429e)

TODO: reporters and coverage.

### 11) Using `rollup` for packaging

```
rollup
buble
rollup-plugin-buble
rollup-plugin-commonjs
rollup-plugin-node-resolve
rollup-watch
uglify-js
```

```
npm install --save-dev rollup buble rollup-plugin-buble rollup-plugin-commonjs rollup-plugin-node-resolve rollup-watch
```

Using [Rollup](https://github.com/rollup/rollup) for packaging
[seems fast](https://twitter.com/vuejs/status/666316850863714304).

[Rollup plugins](https://github.com/rollup/rollup/wiki/Plugins) change the
behaviour of Rollup at key points in the bundling process.

- [rollup-plugin-buble](https://gitlab.com/Rich-Harris/rollup-plugin-buble) for [buble](https://gitlab.com/Rich-Harris/buble)
- [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs)
- [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)
- [rollup-watch](https://github.com/rollup/rollup-watch)
