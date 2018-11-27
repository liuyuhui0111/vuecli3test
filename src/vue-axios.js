import Vue from 'vue'
import Axios from 'axios'


let axios = Axios.create({
    timeout: 1000 * 5,
    // baseURL: '',
    withCredentials: true // 跨域请求时，允许其他域设置自身站点下的cookie
});

axios.interceptors.request.use( 
    config => {
        // 添加headers
        config.headers.Authorization = 'testToken'
        return config;
        
    }, error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

axios.interceptors.response.use(
  response => {
    // var resData = response.data;

    // switch(response.status){
    //   case 400: 
    //     var errs = [];
    //     for (var i = 0; i < resData.length; i++) {
    //       var err = resData[i];
    //       errs.push(err.message);
    //     }
    //     Vue.prototype.$message.error(errs.join('<br/>'));
    //     break;

    //   case 401: 
    //     var code = resData.code;
    //     if(code == 'NO_SIGNIN'){
    //       Vue.prototype.$message.error({
    //         message: resData.msg,
    //         type:'warning'
    //       });
    //       Vue.prototype.$router.push({ path: '/login'});
    //       return;
    //     }
    //     Vue.prototype.$message({
    //       message:'对不起！您没有权限操作',
    //       type:'warning'
    //     });
    //     break;

    //   case 500:// 服务器出错
    //     Vue.prototype.$message.error( resData.msg || '服务器出错');
    //     break;
    //   default:
    //     break;
    // }
    return response
  },
  error => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                // 401 清除token信息并跳转到登录页面
        }
    }
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios
// window.$http = axios
export default axios