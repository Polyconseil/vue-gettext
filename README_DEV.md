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

Node v10+ is required for development.

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

> [What is the Vue 2 vm.\$interpolate alternative?](https://forum.vuejs.org/t/what-is-the-vue-2-vm-interpolate-alternative/2866)

This breaks the old `vue-gettext 1` component.

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

- `vue-gettext 2` works only with Vue 2.0
- it add a minimal hook to your templates code

But it works very well while waiting for something better. Practicality beats
purity I guess.

## Dev setup notes

My notes about the plugin setup.

`npm`'s `package.json`:

- [package.json](https://docs.npmjs.com/files/package.json)
- [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)

### 1) Linting with ESLint

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
