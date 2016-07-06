<template>
  <div>
    <p>
      <button @click="alertSingular"><get-text>Singular</get-text></button>
    </p>
    <p>
      <input v-model="n" type="text">
      <button @click="alertPlural(n)"><get-text>Plural</get-text></button>
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      n: 2,
    }
  },
  methods: {
    alertSingular () {
      const msg = this.$gettext('Good bye!')
      return window.alert(msg)
    },
    alertPlural (n) {
      let msg = this.$ngettext('{{ n }} foo', '{{ n }} foos', n)
      msg = this.$interpolate(msg)
      return window.alert(msg)
    },
  },
}
</script>
