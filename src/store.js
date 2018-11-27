import Vue from 'vue'
import Vuex from 'vuex'
import utils from '@/assets/js/utils.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:utils.getCookie("token") || "",
    userid:utils.getCookie("userid") || "",
  	shareUrl:utils.getCookie("shareUrl") || "",
  },

  mutations: {
  	setUserid(state,userid){
  		utils.setCookie("userid",userid,7)
  		state.userid = userid
  	},
    setToken(state,token){
      utils.setCookie("token",token,7)
      state.token = token
    },
    setShareUrl(state,shareUrl){
      utils.setCookie("shareUrl",shareUrl,7)
      state.shareUrl = shareUrl
    },
  },

  actions: {

  },

  getters: {
  	getUserid(state){
  		return state.userid
  	},
    getToken(state){
      return state.token
    },
    getShareUrl(state){
      return state.shareUrl
    },
  }
})
