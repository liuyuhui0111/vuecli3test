/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

let routeConfs = [
  { title:'404', name:'home', path:'*', view:'404' },
  { title:'分享有礼', name:'share', path:'/share', view:'share/share' },
  { title:'注册有礼', name:'reg', path:'/reg', view:'share/reg' },
  // { title:'act1', name:'act1', path:'/act1', view:'act1/index' },
];


let routes = [];
routeConfs.forEach(item => {
  routes.push({ 
    path: item.path,
    name: item.name,
    meta: { title: item.title }, 
    component: resolve => { require([`./views/${item.view}.vue`], resolve) }
  })
});

let router = new Router({
  mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '加载中...'
  next();
  // if(Vue.cookie.get('cmsnodessid')){
  //   next();
  //   return;
  // }

  // localStorage.clear();
  // Vue.cookie.delete('cmsnodessid');

  // if(to.path == '/login'){
  //   next();
  //   return;
  // }
  // next({ path: '/login'});
})

router.afterEach((to, from) => {
  // ...
})

export default router