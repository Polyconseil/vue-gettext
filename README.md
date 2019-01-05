# vue-gettext

Translate [Vue.js](http://vuejs.org) applications with [gettext](https://en.wikipedia.org/wiki/Gettext).

[Live demo](https://polyconseil.github.io/vue-gettext/).

# Contribution

Please make sure to read the [Pull request guidelines](https://github.com/Polyconseil/vue-gettext/blob/master/README_DEV.md#pull-request-guidelines) before making a pull request.

# Known issues

Any help is greatly appreciated:

- It could be tricky to parse some `.vue` files, see [#28](https://github.com/Polyconseil/vue-gettext/issues/28)
- Translations in attributes is not supported yet, see [#9](https://github.com/Polyconseil/vue-gettext/issues/9)
- `vue-gettext` is not SSR compliant, see [#51](https://github.com/Polyconseil/vue-gettext/issues/51)

# Introduction

`vue-gettext` is a plugin to translate Vue.js applications with [`gettext`](http://www.labri.fr/perso/fleury/posts/programming/a-quick-gettext-tutorial.html). It relies on the [GNU gettext toolset](https://www.gnu.org/software/gettext/manual/index.html) and [`easygettext`](https://github.com/Polyconseil/easygettext).

## How does `vue-gettext` work at a high level?

1. **Annotating strings**: to make a Vue.js app translatable, you have to annotate the strings you want to translate in your JavaScript code and/or templates.

2. **Extracting strings**: once strings are annotated, you have to run extraction tools ([`gettext-extract`](https://github.com/Polyconseil/easygettext#gettext-extract) and some GNU gettext utilities) to run over a Vue.js app source tree and pulls out all strings marked for translation to create a message file. A message file is just a plain-text file with a `.po` file extension, representing a single language, that contains all available translation strings as keys and how they should be represented in the given language.

3. **Translating message files**: a translator needs to fill out the translations of each generated `.po` files.

4. **Compiling translations**: once all message files have been translated, use [`gettext-compile`](https://github.com/Polyconseil/easygettext#gettext-compile) to make the translated `.po` files usable in a Vue app. This will basically merge all translated `.po` files into a unique `.json` translation file.

5. **Dynamically render translated strings to the DOM**: `vue-gettext` currently uses a custom component for this.

## What does `vue-gettext` provide?

- a custom `component` and a custom `directive` to annotate strings in templates and dynamically render translated strings to the DOM

- a set of methods to annotate strings in JavaScript code and translate them

- a `language` ViewModel exposed to every Vue instances that you can use to:

  - get all available languages (defined at configuration time)

  - get or set the current language (*initially* defined at configuration time)

  - access whatever you passed to the plugin mixin (defined at configuration time)

- a global and reactive `language` property added to `Vue.config` you can use to get or set the current language *outside* of Vue instances

## What does `vue-gettext` depend on?

- [`easygettext`](https://github.com/Polyconseil/easygettext)

    - [`gettext-extract`](https://github.com/Polyconseil/easygettext#gettext-extract) to extract annotated strings from template files and produce a `.pot` (Portable Object Template) file.

    - [`gettext-compile`](https://github.com/Polyconseil/easygettext#gettext-compile) to produce the sanitized JSON version of a `.po` file.

- Some GNU gettext utilities to extract annotated strings from JavaScript files and generate `.po` files

    - [`msgmerge`](https://www.gnu.org/software/gettext/manual/html_node/msgmerge-Invocation.html#msgmerge-Invocation)

    - [`msginit`](https://www.gnu.org/software/gettext/manual/html_node/msginit-Invocation.html#msginit-Invocation)

    - [`msgattrib`](https://www.gnu.org/software/gettext/manual/html_node/msgattrib-Invocation.html#msgattrib-Invocation)

Those tools should be integrated in your build process. We'll show you an example later.

# Installation

## NPM

```javascript
npm install vue-gettext
```

## Basic installation

Basic installation with ES6 modules:

```javascript
// ES6
import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'
import translations from './path/to/translations.json'

Vue.use(GetTextPlugin, {translations: translations})
```

## Configuration

There are a number of options you can use to configure the `vue-gettext` plugin:

| Option | Type | Requirement | Description |
| ------------- | ------------- | ------------- | ------------- |
| `autoAddKeyAttributes` | `{Boolean}` | optional | If `true`, key attributes are auto-generated if not present in your code. See the [`key` documentation](https://vuejs.org/v2/api/#key) and issues [#29](https://github.com/Polyconseil/vue-gettext/issues/29) and [#66](https://github.com/Polyconseil/vue-gettext/issues/66). Default value is `false`. Enable this option only if you know what you're doing. |
| `availableLanguages` | `{Object}` | optional | An object that represents the list of the available languages for the app whose keys are [**local names**](http://www.localeplanet.com/icu/) (e.g. [`en`](https://www.gnu.org/software/gettext/manual/html_node/Language-Codes.html#Language-Codes) or [`en_US`](https://www.gnu.org/software/gettext/manual/html_node/Country-Codes.html#Country-Codes)) and whose values are [**language names**](http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/languagenames.html) used for the display in UI, e.g. `English (United States)`. It's exposed in all Vue instances via `vm.$language.available` |
| `defaultLanguage` | `{String}` | optional | The [**local name**](http://www.localeplanet.com/icu/) of the default language, e.g. `en_US`. This will be the current active language. It's exposed in all Vue instances via `vm.$language.current` |
| `muteLanguages` | `{Array}` | optional | Discard warnings for missing translations for all languages of the list. This is useful to avoid messages from the language used in source code. |
| `languageVmMixin` | `{Object}` | optional | A [**mixin**](https://vuejs.org/v2/guide/mixins.html#Option-Merging) that will be passed to the main `languageVm` instance (exposed via `$language`) that can be used, for example, to add custom computed properties |
| `silent` | `{Boolean}` | optional | Enable or disable logs/warnings for missing translations and untranslated keys. Default value is [`Vue.config.silent`](https://vuejs.org/v2/api/#silent). |
| `translations` | `{Object}` | required | The JSON file of the application's translations (produced by `gettext-compile`). It's exposed as a Vue global property as `Vue.$translations` |

The key special attribute is primarily used as a hint for Vue's virtual DOM algorithm to identify VNodes when diffing ... Vue uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible.



Example:

```javascript
// ES6
import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'
import translations from './path/to/translations.json'

Vue.use(GetTextPlugin, {
  availableLanguages: {
    en_GB: 'British English',
    en_US: 'American English',
    es_US: 'Español',
    fr_FR: 'Français',
    it_IT: 'Italiano',
  },
  defaultLanguage: 'fr_FR',
  languageVmMixin: {
    computed: {
      currentKebabCase: function () {
        return this.current.toLowerCase().replace('_', '-')
      },
    },
  },
  translations: translations,
  silent: true,
})
```

## `vm.$language`

After the plugin initialization, a `languageVm` Vue instance is injected
into every component as `vm.$language`.

It exposes the following properties:

- `vm.$language.available`: an object that represents the list of the available languages (defined at configuration time)

- `vm.$language.current`: the current language (defined at configuration time)

- whatever you passed to the plugin mixin

You can use `vm.$language.current` and `vm.$language.available` to e.g. easily build a language switch component with a single template:

```html
<template>
  <div>
    <select name="language" v-model="$language.current">
      <option v-for="(language, key) in $language.available" :value="key">{{ language }}</option>
    </select>
  </div>
</template>
```

## `Vue.config.language`

After the plugin initialization, a global and reactive `language` property is added to `Vue.config` that you can use to get or set the current language outside of Vue instances.

```javascript
> Vue.config.language
'en_GB'
> Vue.config.language = 'fr_FR'
```

You can use `Vue.config.language` to e.g. configure a third party plugin in a filter:

```javascript
import moment from 'moment'
import Vue from 'vue'

const dateFormat = function (value, formatString) {
  moment.locale(Vue.config.language)
  return moment(value).format(arguments.length > 1 ? formatString : 'dddd D MMMM HH:mm:ss')
}
```

# Workflow

1. Annotate your strings

2. Extract translations (`make makemessages`)

3. Translate message files

4. Compile translations (`make translations`)

```
   Annotate    |       Extract        |              Translate                 |        Compile
--------------------------------------------------------------------------------------------------------
component.js
component.vue ---> /tmp/template.pot ---> app/locale/fr_FR/LC_MESSAGES/app.po ---> app/translations.json
template.html
```

## 1a) Annotating strings in templates (`.html` or `.vue` files)

### Use the component or the directive

Strings are marked as translatable in your templates using either the `translate` component or the `v-translate` directive:

```html
<translate>Hello!</translate>
<span v-translate>Hello!</span>
```

This will automatically be translated. For instance, in French, it might read *Bonjour !*.

#### Singular

```html
<translate>Hello!</translate>
```

#### Plural

```html
<translate :translate-n="count" translate-plural="%{ count } cars">%{ count } car</translate>
```

#### Context

```html
<translate translate-context="Verb">Foo</translate>
```

#### Comment

```html
<translate translate-comment="My comment for translators">Foo</translate>
```

#### Custom parameters

You can set up translation strings that are agnostic to how your app state is structured. This way you can change variable names within your app, it won't break your translation strings.

```html
<translate :translate-params="{name: userFullName}">Foo %{name}</translate>
```

### HTML support: difference between the component and the directive

It proves to be tricky to support interpolation with HTML content in Vue.js **components** because it's hard to access the raw content of the component itself.

So if you need to include HTML content in your translations you may use the **directive**.

The directive has the same set of capabilities as the component, **except for translate-params** which should be passed in as an expression.

```html
<p
  v-translate='{count: carNumbers}'
  :translate-n="carNumbers"
  translate-plural="<strong>%{ count }</strong> cars"
  translate-comment="My comment for translators"
  >
  <strong>%{ count }</strong> car
</p>
```

### Custom HTML tag for the `translate` component

When rendered, the content of the `translate` component will be wrapped in a `span` element by default. You can also use another tag:

```html
<translate tag="h1">Hello!</translate>
```

### Interpolation support

Since [interpolation inside attributes are deprecated](https://vuejs.org/v2/guide/syntax.html#Attributes) in Vue 2, we have to use another set of delimiters. Instead of the "Mustache" syntax (double curly braces), we use `%{` and `}`:

```html
<translate>Hello %{ name }</translate>
```

### Directive, interpolation and raw HTML in data

Raw HTML in data is interpreted as plain text, not HTML. In order to output real HTML, you will need to use the `render-html` attribute and set it to `true`.

```html
<p
  v-translate
  render-html="true"
  >
  Hello %{ openingTag }%{ name }%{ closingTag }
</p>
```

Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to XSS vulnerabilities. Only use HTML `render-html="true"` on trusted content and never on user-provided content.

### Caveats

#### Caveat when using `v-translate` with interpolation

It's not possible (yet) to detect changes on the parent component's data, so you have to add an expression to the directive to provide a changing binding value. This is so that it can do a comparison on old and current value before running the translation in its `update` hook.

It is described in the [official guide](https://vuejs.org/v2/guide/custom-directive.html#Hook-Functions):

> update: called after the containing component has updated, but possibly before its children have updated. The directive's value may or may not have changed, but you can skip unnecessary updates by comparing the binding's current and old values...

```html
<p
  v-translate='{count: count, brand: brand}'
  :translate-n="count"
  translate-plural="<strong>%{ count }</strong> %{brand} cars"
  translate-comment="My comment for translators"
  >
  <strong>%{ count }</strong> %{brand} car
</p>
```

#### Caveat when using either the component `<translate>` or directive `v-translate` with interpolation inside `v-for`

It's not possible (yet) to access the scope within `v-for`, example:

```html
<p>
  <translate v-for='name in names'>Hello %{name}</translate>
  <span v-for='name in names' v-translate>Hello %{name}</span>
</p>
```

Will result in all `Hello %{name}` being rendered as `Hello name`.

You need to pass in custom parameters for it to work:

```html
<p>
  <translate v-for='name in names' :translate-params='{name: name}'>Hello %{name}</translate>
  <span v-for='name in names' v-translate='{name: name}'>Hello %{name}</span>
</p>
```

#### Caveat when using `v-translate` with Vue components or Vue specific attributes

It's not possible (yet) to support components or attributes like `v-bind` and `v-on`. So make sure that your HTML translations stay basic for now.

For example, this is *not supported*:

```html
<p v-translate>
  Please <button @click='doSomething'>click</button> here to view <my-account></my-account>
</p>
```

## 1b) Annotating strings in JavaScript code (`.js` or `.vue` files)

Strings are marked as translatable in your Vue instances JavaScript code using methods attached to `Vue.prototype`.

### Singular

```javascript
vm.$gettext(msgid)
```

### Plural

```javascript
vm.$ngettext(msgid, plural, n)
```

### Context

```javascript
vm.$pgettext(context, msgid)
```

### Context + Plural

```javascript
vm.$npgettext(context, msgid, plural, n)
```

### Interpolation support

You can use interpolation in your JavaScript using another method attached to `Vue.prototype`: `vm.$gettextInterpolate`.

```javascript
...
methods: {
  alertPlural (n) {
    let translated = this.$ngettext('%{ n } foo', '%{ n } foos', n)
    let interpolated = this.$gettextInterpolate(translated, {n: n})
    return window.alert(interpolated)
  },
},
...
```

`vm.$gettextInterpolate` dynamically populates a translation string with a given context object.

## 2) Extracting strings

This should be a step in your build process and this can be done in several ways.

Here are the things we must do:

1. extracting annotated strings from templates (`.html` and/or `.vue` files),

2. extracting annotated strings from JavaScript code (`.js` and/or `.vue` files),

3. creating a main `.pot` template based on the extracted strings,

4. creating editable `.po` files for each available language.

You'll need to install [`easygettext`](https://github.com/Polyconseil/easygettext) and use `gettext-extract` to extract annotated strings from template files and produce a `.pot` file.

You'll also need some GNU gettext utilities, namely `msgmerge`, `msginit` and `msgattrib` to generate `.po` files from the `.pot` dictionary file.

We use a `Makefile` with a `makemessages` target to automate this step. To give you an example, I included a `Makefile` with a `makemessages` target in this project that you can include in your build process.

Extracting strings and generating `.po` files becomes as easy as running:

```shell
make makemessages
```

## 3) Translating message files

The translator needs to fill out the translations of each generated `.po` files.

This can be done by you or outsourced to other firms or individuals since `.po` files are the industry standard for multilingual websites.

There is also a wide range of translation tools available in the gettext ecosystem. Some of them are listed on [Wikipedia](https://en.wikipedia.org/wiki/Gettext#See_also).

## 4) Compiling translations

This step focuses on making the translated `.po` files usable in your Vue.js app.

Once translated, install `easygettext` and use [`gettext-compile`](https://github.com/Polyconseil/easygettext#gettext-compile) to merge all translated `.po` files into a unique `.json` translation file.

Embed the `.json` translation file back into your application. This is done only one time at `vue-gettext` configuration time.

We use a `Makefile` with a `translations` target to automate this step.

Compiling translations becomes as easy as running:

```shell
make translations
```

Look at the included `Makefile` for an example.

## Elsewhere

### Support for Pug templates

If you are using a template language, i.e. [Pug.js](https://pugjs.org/api/getting-started.html) in [Single File Component](https://vuejs.org/v2/guide/single-file-components.html) within a webpack setup (using vue-loader), have a look at [vue-webpack-gettext](https://github.com/kennyki/vue-webpack-gettext).

## Credits

This plugin was inspired by:

- [`systematic`](https://github.com/Polyconseil/systematic) for Makefile and
    extraction of translatable strings.
- [`angular-gettext`](https://angular-gettext.rocketeer.be)
- [`vue-i18n`](https://github.com/kazupon/vue-i18n)

## License

[MIT](http://opensource.org/licenses/MIT)
