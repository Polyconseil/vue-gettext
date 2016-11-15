<template>
  <div>
    <p>
      <translate>Select your language:</translate>
    </p>
    <p>
      <select name="language" v-model="$language.current">
        <option v-for="(language, key) in $language.available" :value="key">{{ language }}</option>
      </select>
    </p>
  </div>
</template>
