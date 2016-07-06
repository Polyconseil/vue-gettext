<template>
  <div>
    <p>
      {{ creation | dateFormat }}
    </p>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'

const dateFormat = function (value, formatString) {
  moment.locale(Vue.config.language)
  return moment(value).format(arguments.length > 1 ? formatString : 'dddd D MMMM HH:mm:ss')
}

Vue.filter('dateFormat', dateFormat)

export default {
  data () {
    return {
      creation: '2016-06-02T15:03:00.029289Z',
    }
  }
}
</script>
