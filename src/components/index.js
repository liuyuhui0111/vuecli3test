import Toast from './toast/index.js'
import Loading from './loading/index.js'

const install = function(Vue) {
  if (install.installed) {
    return
  }
  install.installed = true;
  
  Vue.$loading = Vue.prototype.$loading = Loading
  Vue.$toast = Vue.prototype.$toast = Toast
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install