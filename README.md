# vue-gettext

> This is vue-gettext 2 which works only with Vue 2.

Translate [Vue.js](http://vuejs.org) applications with
[gettext](https://en.wikipedia.org/wiki/Gettext).

[Live demo](https://polyconseil.github.io/vue-gettext/).

# How to upgrade from vue-gettext 1

- rename your `<get-text>` components to `<translate>`

- inside your `<translate>` components, change the "Mustache" syntax `{{ }}`
    to `%{` and `}`

# Introduction

`vue-gettext` is a plugin to translate Vue.js applications with
[`gettext`](http://www.labri.fr/perso/fleury/posts/programming/a-quick-gettext-tutorial.html).
It relies on the [GNU gettext toolset](https://www.gnu.org/software/gettext/manual/index.html)
and [`easygettext`](https://github.com/Polyconseil/easygettext).

## How does `vue-gettext` works at a high level?

1. **Annotating strings**: to make a Vue.js app translatable, you have to
    annotate the strings you want to translate in your JavaScript code and/or
    templates.

2. **Extracting strings**: once strings are annotated, you have to run
    extraction tools
    ([`gettext-extract`](https://github.com/Polyconseil/easygettext#gettext-extract)
    and some GNU gettext utilities) to run over a Vue.js app source tree and
    pulls out all strings marked for translation to create a message file. A
    message file is just a plain-text file with a `.po` file extension,
    representing a single language, that contains all available translation
    strings as keys and how they should be represented in the given language.

3. **Translating message files**: a translator needs to fill out the translations
    of each generated `.po` files.

4. **Compiling translations**: once all message files have been translated, use
    [`gettext-compile`](https://github.com/Polyconseil/easygettext#gettext-compile)
    to make the translated `.po` files usable in a Vue app. This will basically
    merge all translated `.po` files into a unique `.json` translation file.

5. **Dynamically render translated strings to the DOM**: `vue-gettext`
    currently uses a custom component for this.

## What does `vue-gettext` provide?

- a custom `component` to annotate strings (**without HTML support**) in
    templates and dynamically render translated strings to the DOM

- a custom `directive` to annotate strings (**with HTML support**) in
    templates and dynamically render translated strings to the DOM

- a set of methods to annotate strings in JavaScript code and translate them

- a `language` ViewModel exposed to every Vue instances that you can use to:

  - get all available languages (defined at configuration time)

  - get or set the current language (*initially* defined at configuration time)

  - access whatever you passed to the plugin mixin (defined at configuration time)

- a global and reactive `language` property added to `Vue.config` you can use
    to get or set the current language *outside* of Vue instances

## What does `vue-gettext` depend on?

- [`easygettext`](https://github.com/Polyconseil/easygettext)

    - [`gettext-extract`](https://github.com/Polyconseil/easygettext#gettext-extract)
        to extract annotated strings from template files and produce a `.pot`
        (Portable Object Template) file.

    - [`gettext-compile`](https://github.com/Polyconseil/easygettext#gettext-compile)
        to produce the sanitized JSON version of a `.po` file.

- Some GNU gettext utilities to extract annotated strings from JavaScript files and generate
    `.po` files

    - [`xgettext`](https://www.gnu.org/software/gettext/manual/html_node/xgettext-Invocation.html#xgettext-Invocation)

    - [`msgmerge`](https://www.gnu.org/software/gettext/manual/html_node/msgmerge-Invocation.html#msgmerge-Invocation)

    - [`msginit`](https://www.gnu.org/software/gettext/manual/html_node/msginit-Invocation.html#msginit-Invocation)

    - [`msgattrib`](https://www.gnu.org/software/gettext/manual/html_node/msgattrib-Invocation.html#msgattrib-Invocation)

Those tools should be integrated in your build process.
We'll show you examples later.

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

- `translations {Object}` - required:

    The JSON file of the application's translations (produced by
    `gettext-compile`)

    It's exposed as a Vue global property as `Vue.$translations`

- `availableLanguages {Object}` - optional:

    An object that represents the list of the available languages for the app:

    - whose keys are [**local names**](http://www.localeplanet.com/icu/), e.g. `en` or `en_US`:

        - either an
          [ISO 639](https://www.gnu.org/software/gettext/manual/html_node/Language-Codes.html#Language-Codes)
          two-letter language code lowercase of the form `ll`

        - or a combined ISO 639 two-letter language code lowercase and
          [ISO 3166](https://www.gnu.org/software/gettext/manual/html_node/Country-Codes.html#Country-Codes)
          two-letter country code uppercase of the form `ll_CC`

    - and whose values are
      [**language names**](http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/languagenames.html)
      used for the display in UI, e.g. `English (United States)`.

    It's exposed in all Vue instances via `vm.$language.available`

- `defaultLanguage {String}` - optional:

    The [**local name**](http://www.localeplanet.com/icu/) of the default
    language, e.g. `en_US`. This will be the current active language.

    It's exposed in all Vue instances via `vm.$language.current`

- `languageVmMixin {Object}` - optional:

    A [**mixin**](https://vuejs.org/v2/guide/mixins.html#Option-Merging)
    that will be passed to the main `languageVm` instance (exposed via
    `$language`) that can be used, for example, to add custom computed
    properties

- `silent {Boolean}` - optional (default value is [`Vue.config.silent`](https://vuejs.org/v2/api/#silent)):

    Enable or disable logs/warnings for missing translations
    and untranslated keys.

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
  silent: True,
})
```

## `vm.$language`

After the plugin initialization, a `languageVm` Vue instance is injected
into every component as `vm.$language`.

It exposes the following properties:

- `vm.$language.available`: an object that represents the list of the available
  languages (defined at configuration time)

- `vm.$language.current`: the current language (defined at configuration time)

- whatever you passed to the plugin mixin

You can use `vm.$language.current` and `vm.$language.available` to e.g. easily
build a language switch component with a single template:

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

After the plugin initialization, a global and reactive `language` property is
added to `Vue.config` that you can use to get or set the current language
outside of Vue instances.

```javascript
> Vue.config.language
'en_GB'
> Vue.config.language = 'fr_FR'
```

You can use `Vue.config.language` to e.g. configure a third party plugin in a
filter:

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

## 1) Annotating strings

### In templates (`.html` or `.vue` files)

Strings are marked as translatable in your templates using the `translate`
component or the `v-translate` directive:

```html
<translate>Hello!</translate>
<span v-translate>Hello!</span>
```

This will automatically be translated. For instance, in French, it might
read *Bonjour !*.

#### Custom HTML tag for the `translate` component

When rendered, the content of the `translate` component will be wrapped in
a `span` element by default. You can also use another tag:

```html
<translate tag="h1">Hello!</translate>
```

#### Singular

```html
<translate>Hello!</translate>
```

#### Interpolation support

Since [interpolation inside attributes are deprecated](https://vuejs.org/v2/guide/syntax.html#Attributes)
in Vue 2, we have to use another set of delimiters. Instead of the
"Mustache" syntax (double curly braces), we use `%{` and `}`:

```html
<translate>Hello %{ name }</translate>
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

#### HTML support

It is quite tricky to get raw HTML of a Vue component, so if you need
to include HTML content in the translations you may use the provided directive.

The directive has the same set of capabilities as the component.

```html
<p v-translate :translate-n="count" translate-plural="<strong>%{ count }</strong> cars" translate-comment="My comment for translators"><strong>%{ count }</strong> car</translate>
```

**Caveat when using v-translate with interpolation**

It's not possible (yet) to detect changes on the parent component's data,
so you have to add an expression to the directive to provide a changing
binding value. This is so that it can do a comparison on old and current
value before running the translation in its `update` hook.

It is described in the [official guide](https://vuejs.org/v2/guide/custom-directive.html#Hook-Functions):

> update: called after the containing component has updated, but possibly
before its children have updated. The directive's value may or may not have
changed, but you can skip unnecessary updates by comparing the binding's
current and old values...

```html
<p v-translate='count + brand' :translate-n="count" translate-plural="<strong>%{ count }</strong> %{brand} cars" translate-comment="My comment for translators"><strong>%{ count }</strong> %{brand} car</translate>
```

**Caveat when using v-translate with Vue components or Vue-specific attributes**

It's not possible (yet) to support components or attributes like `v-bind` and
`v-on`. So make sure that your HTML translations stay basic for now.

For example, this is *not supported*:

```html
<p v-translate>
  Please <button @click='doSomething'>click</button> here to view <my-account></my-account>
</p>
```

### In JavaScript code (`.js` or `.vue` files)

Strings are marked as translatable in your Vue instances JavaScript code using
methods attached to `Vue.prototype`.

#### Singular

```javascript
vm.$gettext(msgid)
```

#### Plural

```javascript
vm.$ngettext(msgid, plural, n)
```

#### Context

```javascript
vm.$pgettext(context, msgid)
```

#### Context + Plural

```javascript
vm.$npgettext(context, msgid, plural, n)
```
#### Interpolation support

You can use interpolation in your JavaScript using another method attached to
`Vue.prototype`: `vm.$gettextInterpolate`.

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

`vm.$gettextInterpolate` dynamically populates a translation string with a
given context object.

## 2) Extracting strings

This should be a step in your build process and this can be done in several
ways.

Here are the things we must do:

1. extracting annotated strings from templates (`.html` and/or `.vue` files),

2. extracting annotated strings from JavaScript code (`.js` and/or `.vue` files),

3. creating a main `.pot` template based on the extracted strings,

4. creating editable `.po` files for each available language.

You'll need to install [`easygettext`](https://github.com/Polyconseil/easygettext)
and use `gettext-extract` to extract annotated strings from template files and
produce a `.pot` file.

You'll also need some GNU gettext utilities, namely `xgettext`, `msgmerge`,
`msginit` and `msgattrib` to extract annotated strings from JavaScript files
and generate `.po` files.

We use a `Makefile` with a `makemessages` target to automate this step.
To give you an example, I included a `Makefile` with a `makemessages`
target in this project that you can include in your build process.

Extracting strings and generating `.po` files becomes as easy as running:

```shell
make makemessages
```

## 3) Translating message files

The translator needs to fill out the translations of each generated `.po`
files.

This can be done by you or outsourced to other firms or individuals since
`.po` files are the industry standard for multilingual websites.

There is also a wide range of translation tools available in the gettext
ecosystem. Some of them are listed on
[Wikipedia](https://en.wikipedia.org/wiki/Gettext#See_also).

## 4) Compiling translations

This step focuses on making the translated `.po` files usable in your
Vue.js app.

Once translated, install `easygettext` and use
[`gettext-compile`](https://github.com/Polyconseil/easygettext#gettext-compile)
to merge all translated `.po` files into a unique `.json` translation file.

Embed the `.json` translation file back into your application. This is
done only one time at `vue-gettext` configuration time.

We use a `Makefile` with a `translations` target to automate this step.

Compiling translations becomes as easy as running:

```shell
make translations
```

Look at the included `Makefile` for an example.

## Elsewhere

### Helper library for using template languages in Vue's Single File Component

If you are using a template language, i.e.
[Pug.js](https://pugjs.org/api/getting-started.html) in
[Single File Component](https://vuejs.org/v2/guide/single-file-components.html)
within a webpack setup (using vue-loader), have a look at [vue-webpack-gettext](https://github.com/kennyki/vue-webpack-gettext).

## Credits

This plugin was inspired by:

- [`systematic`](https://github.com/Polyconseil/systematic) for Makefile and
    extraction of translatable strings.
- [`angular-gettext`](https://angular-gettext.rocketeer.be)
- [`vue-i18n`](https://github.com/kazupon/vue-i18n)

## License

[MIT](http://opensource.org/licenses/MIT)
