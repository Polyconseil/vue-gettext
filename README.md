> Beta state, use at your own risk. Waiting for some feedback from the community and/or code review by experienced Vue.js developers :)

---

# vue-gettext

Translate your [Vue.js](http://vuejs.org) applications with [gettext](https://en.wikipedia.org/wiki/Gettext).

## Demo

[Live demo](https://polyconseil.github.io/vue-gettext/).

## Introduction

Here's how `vue-gettext` works at a high level:

1. Write your application as usual, in English.
2. Annotate the strings that should be translated.
3. Use [`easygettext`](https://github.com/Polyconseil/easygettext#gettext-extract) and some [GNU `gettext` utilities](https://www.gnu.org/software/gettext/manual/gettext.html) to extract those annotated strings to GetText Portable Object (`.po`) files.
4. Once translated, use [`easygettext`](https://github.com/Polyconseil/easygettext#gettext-compile) to embed the translations back into your application.
5. Let the magic of the `vue-gettext` plugin happens.

## Installation

```javascript
npm install vue-gettext
```

## Usage

With modules:

```javascript
// ES6
import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'
import translations from 'dist/translations.json'

Vue.use(GetTextPlugin, {translations: translations})
```

## Configuration

There are a number of options you can use to configure the `vue-gettext` plugin:

- `availableLanguages`: `{Object}` an object that represents the list of the available languages for the app:
    - whose keys are [**local names**](http://www.localeplanet.com/icu/), e.g. `en_US` (either a language specification of the form `ll` or a combined language and country specification of the form `ll_CC`)
    - and whose values are [**language names**](http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/languagenames.html), e.g. `English (United States)`
- `defaultLanguage`: `{String}` the [**local name**](http://www.localeplanet.com/icu/) of the current language, e.g. `en_US`
- `languageVmMixin`: `{Object}` a mixin that will be passed to the main `languageVm` instance that can be used, for example, to add custom computed properties
- `translations`: `{Object}` a JSON file of the application's translations

You can see a configuration example in the `example/index.js` file.

## Annotating strings

### 1) In templates (`.html` or `.vue` files)

Strings are marked as translatable in your templates using the `get-text` component:

```html
<get-text>Hello!</get-text>
```

This will automatically be translated. For instance, in French, it might read *Bonjour !*.

#### Singular

```html
<get-text>Hello!</get-text>
```

#### Interpolation support:

```html
<get-text>Hello {{ name }}</get-text>
```

#### Plurals:

```html
<get-text :translate-n="count" translate-plural="{{ count }} cars">{{ count }} car</get-text>
```

#### Context:

```html
<get-text translate-context="Verb">Foo</get-text>
```


#### Comment

```html
<get-text translate-comment="My comment for translators">Foo</get-text>
```

### 2) In JavaScript code (`.js` or `.vue` files)

Strings are marked as translatable in your Vue instances JavaScript code using methods attached to `Vue.prototype`:

- `$gettext`: `this.$gettext(msgid)`
- `$ngettext`: `this.$ngettext(msgid, plural, n)`
- `$pgettext`: `this.$pgettext(context, msgid)`
- `$npgettext`: `this.$npgettext(context, msgid, plural, n)`

## Extracting strings

This should be a step in your build process and this can be done in several ways.

Here are the things we must do:

1. extracting annotated strings from templates (`.html` and/or `.vue` files) via [`easygettext`](https://github.com/Polyconseil/easygettext#gettext-extract)
2. extracting annotated strings from JavaScript code (`.js` and/or `.vue` files) via [`xgettext`](https://www.gnu.org/savannah-checkouts/gnu/gettext/manual/html_node/xgettext-Invocation.html)
3. create a main `.pot` template based on the extracted strings
4. create editable [`.po` files](https://www.gnu.org/savannah-checkouts/gnu/gettext/manual/html_node/PO-Files.html) for each available language

To give you an example, I included a `makefile` with a `makemessages` target which is [the copy of a part](https://github.com/Polyconseil/systematic/blob/866d5a7b44b5926b7033271bbb2969d9d2a3dc9b/mk/main.mk#L167-L183) of Systematic (our ES6 toolchain).

It's built on the foundation of [`easygettext`](https://github.com/Polyconseil/easygettext#gettext-extract) and some [GNU `gettext` utilities](https://www.gnu.org/software/gettext/manual/gettext.html) (namely [`xgettext`](https://www.gnu.org/savannah-checkouts/gnu/gettext/manual/html_node/xgettext-Invocation.html), [`msgmerge`](https://www.gnu.org/software/gettext/manual/html_node/msgmerge-Invocation.html), [`msginit`](https://www.gnu.org/software/gettext/manual/html_node/msginit-Invocation.html) and [`msgattrib`](https://www.gnu.org/software/gettext/manual/html_node/msgattrib-Invocation.html)).

This will basically create a main `.pot` template, then create `.po` files for each available language.

You can see the result in the `example/locale/` directory.

## Translating your strings into different languages

The translator needs to fill out the translations of each `.po` files.

This can be done by you or outsourced to other firms or individuals since GetText Portable Object (`.po`) files are the industry standard for multilingual websites.

There is also a wide range of translation tools available in the gettext ecosystem. Some of them are listed on [Wikipedia](https://en.wikipedia.org/wiki/Gettext#See_also).

## Compiling translations

This step focuses on making the translated `.po` files usable in your Vue.js app.

Once translated, use [`gettext-compile`](https://github.com/Polyconseil/easygettext#gettext-compile) to embed the translated `.po` files back into your application.

This will basically merge all translated `.po` files into a unique `.json` translation file.

Again, this should be a step in your build process. To give you an example, I included a `makefile` with a `translations` target that is doing just that.

You can see the result in the `example/locale/translations.json`.

## Credits

This plugin was inspired by:

- [`systematic`](https://github.com/Polyconseil/systematic)
- [`angular-gettext`](https://angular-gettext.rocketeer.be)
- [`vue-i18n`](https://github.com/kazupon/vue-i18n)

## License

[MIT](http://opensource.org/licenses/MIT)
