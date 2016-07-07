import translate from './translate'

/**
 * Translate the component content according to the current language
 *
 * Built to work with easygettext https://github.com/Polyconseil/easygettext
 *
 * Usage:
 *
 *   Singular:
 *   <get-text>Foo</get-text>
 *
 *   Interpolation support:
 *   <get-text>Hello {{ name }}</get-text>
 *
 *   Plurals:
 *   <get-text :translate-n="count" translate-plural="{{ count }} cars">{{ count }} car</get-text>
 *
 *   Context:
 *   <get-text translate-context="Verb">Foo</get-text>
 *
 *   Comment:
 *   <get-text translate-comment="My comment for translators">Foo</get-text>
 */
export default {
  name: 'get-text',
  created: function () {
    this.msgid = this.$options.el.innerHTML.trim()  // Stores the raw uninterpolated string to translate.
    this.isPlural = this.translateN !== undefined && this.translatePlural !== undefined
    if (!this.isPlural && (this.translateN || this.translatePlural)) {
      throw new Error(`\`translate-n\` and \`translate-plural\` attributes must be used together: ${this.msgid}.`)
    }
  },
  props: [
    // Always use v-bind for dynamically binding the `translateN` prop to data on the parent,
    // i.e.: `:translate-n`
    'translateN',
    'translatePlural',
    'translateContext',
    'translateComment',
  ],
  computed: {
    translation: function () {
      let n = this.isPlural ? this.translateN : 1
      let translation = translate.getTranslation(this.msgid, n, this.translateContext, this.$language.current)
      return this.$parent.$interpolate(translation)
    },
  },
  template: '{{ translation }}',
}
