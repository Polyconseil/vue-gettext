<template>
  <div>

    <!-- No binding: static interpolation. -->
    <p v-translate="name">A <b>random</b> number: <i>%{ random }</i></p>

    <!-- Singular with a dynamic binding. -->
    <p>
      <input type="text" v-model="name">
      <span v-translate="name">Hello <strong>%{ name }</strong></span>
    </p>

    <!-- Plural with a dynamic binding. -->
    <p>
      <button @click="decrease()">-</button>
      <span v-translate="count" :translate-n="count" translate-plural="<strong>%{ count }</strong> apples"><strong>%{ count }</strong> apple</span>
      <button @click="increase()">+</button>
    </p>

  </div>
</template>

<script>
export default {
  data: () => ({
    count: 0,
    name: 'Bryan',
    random: Math.random(),
  }),
  methods: {
    decrease () {
      if (this.count === 0) return
      this.count -= 1
    },
    increase () {
      this.count += 1
    },
  },
}
</script>
