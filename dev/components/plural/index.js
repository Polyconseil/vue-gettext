import styles from './styles.css'
import template from './template.html'


export default {
  created: function () {
    this.styles = styles
  },
  data: () => ({
    n: 0,
    countForUntranslated: 10,
  }),
  computed: {
    nComputed () {
      return this.n
    },
  },
  methods: {
    decrease () {
      if (this.n === 0) return
      this.n -= 1
    },
    increase () {
      this.n += 1
    },
  },
  template: template,
}
