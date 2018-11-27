import Vue from 'vue';

const Loading = Vue.extend(require('./loading.vue').default);
let instance;
let timer;

export default {
  open() {
    if (!instance) {
		instance = new Loading();
    }
    if (instance.visible) return;
    let tpl = instance.$mount().$el;
    document.body.appendChild(tpl);
    if (timer) {
      clearTimeout(timer);
    }

    Vue.nextTick(() => {
      instance.visible = true;
    });
  },

  close() {
    if (instance) {
      instance.visible = false;
      timer = setTimeout(() => {
        if (instance.$el) {
          document.body.removeChild(instance.$el);
        }
      }, 400);
    }
  }
}