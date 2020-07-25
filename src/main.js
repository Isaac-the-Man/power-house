import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import utils from "@/mixins/utils"

Vue.config.productionTip = false

Vue.mixin(utils);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
