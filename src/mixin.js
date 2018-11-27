/*
 *2018年6月1日14:45:52---刘宇辉
 *全局mixins  存放vuex操作
 */
import {
  mapGetters,
  mapMutations
} from 'vuex'
export default {
  install(Vue, options) {
    Vue.mixin({
      data(){
        return{
          options:options,
          toastStr:"",
          isShowToast:false,
          timer:null,
          isCanRequest:true,
          userid:"",
          wxShareTitle:"好友邀请您加入火山钱包",
          wxShareUrl:window.location.origin+"/reg",
          wxShareImage:window.location.origin+"/logo.png",
          wxShareDesc:"好友邀请您加入火山钱包"
        }
      },
       computed: {
        ...mapGetters([
          // 映射 this.count 为 store.state.count
          'getShareUrl', //登录跳转URL  
          'getUserid', //用户id  
          'getToken', //token  
        ]),
      },
      methods: {
        toast(str,time){
          let t = time || 2000;
          this.toastStr = str;
          this.isShowToast = true;
          clearTimeout(this.timer);
          this.timer = setTimeout(()=>{
            this.isShowToast = false;
          }, t);
        },

        ...mapMutations([
          'setUserid', //设置用户ID
          'setShareUrl', //分享链接
          'setToken', //token
        ]),

      }
    })
  }
}