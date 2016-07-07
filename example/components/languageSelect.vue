<template>
  <p>
    <get-text>Select your language:</get-text>
  </p>
  <p>
    <select name="language" v-model="$language.current">
      <option v-for="language in $language.available" value="{{ $key }}">{{ language }}</option>
    </select>
  </p>
</template>
