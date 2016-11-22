<template>
  <div>
    <p>
      <!-- Test $gettext in JavaScript code. -->
      <button @click="alert">gettext in JavaScript</button>
    </p>
    <p>
      <!-- Test $ngettext in JavaScript code with interpolation. -->
      <button @click="decrease()">-</button>
      {{ n }}
      <button @click="increase()">+</button>
      <button @click="alertPlural(n)">ngettext in JavaScript</button>
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    n: 2,
  }),
  methods: {
    alert () {
      const msg = this.$gettext('Good bye!')
      return window.alert(msg)
    },
    decrease () {
      if (this.n === 0) return
      this.n -= 1
    },
    increase () {
      this.n += 1
    },
    alertPlural (n) {
      let msg = this.$ngettext('%{ n } car', '%{ n } cars', n)
      msg = this.$gettextInterpolate(msg, {n: n})
      return window.alert(msg)
    },
  },
}
</script>
