import template from './template.html'


export default {
  data: () => ({
    show: true,
    obj: {
      name: 'Group1',
    },
  }),
  methods: {
    toggleShow () {
      this.show = !this.show
    },
    setName1 () {
      this.obj.name = 'Group1'
    },
    setName2 () {
      this.obj.name = 'Group2'
    },
    setName3 () {
      this.obj.name = 'Group3'
    },
  },
  template: template,
}
