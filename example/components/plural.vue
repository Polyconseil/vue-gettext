<template>
  <div>
    <h1>
      <get-text :translate-n="n" translate-plural="{{ n }} bars">{{ n }} bar</get-text>
    </h1>
    <p>
      <input v-model="n" type="text">
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      n: 1,
    }
  }
}
</script>
