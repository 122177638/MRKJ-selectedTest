import Vue from 'vue'
import app from './app'
import '@config/common'
import '@server/http'
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  mounted: () => {
  },
  template: '<app/>',
  components: {
    app
  }
})
