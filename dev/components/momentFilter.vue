<template>
  <p>
    {{ dateNow | dateFormat }}
  </p>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'


const dateFormat = function (value, formatString) {
  moment.locale(Vue.config.language)
  return moment(value).format(arguments.length > 1 ? formatString : 'dddd D MMMM HH:mm:ss')
}

Vue.filter('dateFormat', dateFormat)

export default {
  data: () => ({
    dateNow: new Date(),
  }),
}
</script>
