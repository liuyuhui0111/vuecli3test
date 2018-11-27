
import Vue from 'vue'
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

import store from './store'

import router from './router'
import './registerServiceWorker'
import './vue-axios'
import mixin from './mixin'

import components from './components/'
Vue.use(components)
Vue.use(mixin)

Vue.config.productionTip = false

import App from './App.vue'

window.vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


