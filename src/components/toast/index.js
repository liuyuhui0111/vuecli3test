import Vue from 'vue'

const Toast = Vue.extend(require('./toast.vue').default);

let toastPool = [];

let getInstance = () => {
  if (toastPool.length > 0) {
    let instance = toastPool[0];
    toastPool.splice(0, 1);
    return instance;
  }
  return new Toast();
}

let toast = (options = {}) => {
	let duration = options.duration || 2000;
	let instance = getInstance();
	instance.closed = false;
	clearTimeout(instance.timer);

	instance.message = typeof options === 'string' ? options : options.message;
	let tpl = instance.$mount().$el;
	document.body.appendChild(tpl);
	Vue.nextTick(() => {
		instance.visible = true;
		instance.timer = setTimeout(() => {
			if(instance.closed) return;
			
			instance.visible = false;
			instance.closed = true;
			toastPool.push(instance);
			instance.$el.parentNode.removeChild(instance.$el);
		}, duration);

	});
}
export default toast;