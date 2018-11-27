module.exports = {
   // 基本路径
  // baseUrl: '/abtest/',
  devServer: {
    proxy: {
      '/apis': {
        target: 'http://test-activity.huaruiyisheng.com',
        changeOrigin: true,
        pathRewrite: {
            '^/apis': '/apis'   //需要rewrite重写的,
        } 
      },
      '/port': {
        target: 'http://10.3.101.168:8094/port/',
        changeOrigin: true
      },
      '/api/v2/risk': {
        target: 'http://test-activity.iqianjindai.com/',
        changeOrigin: true,
        pathRewrite:{
            '^/api/v2/risk':'/risk'
        }
      },
    }
  }
}
//http://test-activity.iqianjindai.com/
//http://test-activity.iqianjindai.com
//http://10.3.101.177:8080/