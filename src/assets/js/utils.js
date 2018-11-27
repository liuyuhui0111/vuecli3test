
let utils = {
	trim: function(str){
		if(!str) return '';
		return str.replace(/^\s+|\s+$/gm,'');
	},
	moblieFormat: function (mobile) {
		if(!mobile || this.trim(mobile).length === 0){
			return '';
		}
		mobile = mobile.replace(/\s+/g,'');
		let reg = /(\d{3})(\d{0,4})(\d{0,4})/;
		let m = mobile.match(reg);
		if(m == null){
			return mobile;
		}
		let res = m[1];
		m[2] && (res += ' '+ m[2])
		m[3] && (res += ' '+ m[3])
		return res;
	},
	startClock: function(vueInstance, options) {
		// 倒计时
		let _config = {
		statusKey: 'smsDisabled',
		lbCodeKey: 'lbSmsCode'
		}
		_config = Object.assign({}, _config, options);
		let time = 60;
		let timer = setInterval(function () {
		time--;
		if (time <= 0) {
		  clearInterval(timer);
		  vueInstance[_config.lbCodeKey] = '重新发送验证码';
		  vueInstance[_config.statusKey] = false;
		  return;
		}

		vueInstance[_config.lbCodeKey] = time + 's后重新获取';
		vueInstance[_config.statusKey] = true;
		}, 1000);
	},
	isWeiXin: function(){ 
		// 是否是微信环境
		var ua = window.navigator.userAgent.toLowerCase(); 
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		return true; 
		}else{ 
		return false; 
		} 
	}, 
	hmtPush: function(eventName,eventType,data){
		// 百度埋点push自定义事件
		window._hmt.push(['_trackEvent', eventName, eventType,data]);
	},
	isPoneAvailable: function(pone) {
		// 校验手机号
		var myreg = /^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/;
		if (!myreg.test(pone)) {
		return false;
		} else {
		return true;
		}
	},
	isCode: function(code) {
		// 校验验证码
		var myreg = /^\d{6}$/;
		if (!myreg.test(code)) {
		return false;
		} else {
		return true;
		}
	},

	isApp: function(){
		var ua = navigator.userAgent;
		return ua.indexOf('sudaixiong_android') != -1 || ua.indexOf('sudaixiong_ios') != -1;
	},

	wxConfig: function(data,fn){
		/*
		*
		*微信config配置
		*window.CONFIG.DEV
		*/

		if(window.wx){
			window.wx.config({
				debug:false,
				appId:data.appId,
				timestamp:data.timestamp,
				nonceStr:data.nonceStr,
				signature:data.signature,
				jsApiList:[
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone',
					'hideMenuItems',
					'chooseImage',
					'getLocalImgData'
				]
			});
			window.wx.ready(()=>{
				// 批量隐藏功能按钮接口
				window.wx.hideMenuItems({
					menuList: [
						"menuItem:copyUrl",	//复制链接
						"menuItem:originPage",	//原网页
						"menuItem:openWithQQBrowser",	//qq浏览器打开
						"menuItem:openWithSafari",		//safari浏览器打开
						"menuItem:share:email",				//邮件
						"menuItem:share:QZone",				//分享QQ空间
						"menuItem:share:facebook",			//分享到fb
						"menuItem:share:weiboApp",			//分享到微博
						"menuItem:share:qq",				//分享到QQ

					] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
				});
				if(fn){
					fn()
				}
			});
			window.wx.error((res)=>{
				alert(JSON.stringify(res))
	        	console.log(res);
	      	});
		}
	},

	download: function () {
		// 下载
		var Global =
			{ 
				downUrl: JSON.parse('{"android":"http://dl.huaruiyisheng.com/app/download/hsqb.apk","ios":"itms-apps://itunes.apple.com/us/app/huo-shan-qian-bao/id1357532883?l=zh&ls=1&mt=8","ymb":"http://a.app.qq.com/o/simple.jsp?pkgname=com.zgf.huoshan","openIos":"huoshanqianbao://","openAndroid":"huoshanqianbao://open_android_app"}')
       		}
        console.log('download');
        Global.downUrl = Global.downUrl || {};
        var userAgent = window.navigator.userAgent;
        var open_android = Global.downUrl.openAndroid,
            open_ios = Global.downUrl.openIos,
            download_android = Global.downUrl.android,
            download_ymb = Global.downUrl.ymb,
            download_ios = Global.downUrl.ios;

        if (userAgent.match(/MicroMessenger/i) == "MicroMessenger") {
            if(!download_ymb){
                Global.utility.showDLTips();
                return;
            }

            window.location.href = download_ymb;
            return;
        }
        if (userAgent.match(/Android/i) == "Android") {
            if(!download_android) return;

            var  t = 1000, hasApp = true;
            setTimeout(function () {
                if (hasApp) {
                    location.href = open_android;
                } else {
                    location.href = download_android;
                }
                document.body.removeChild(ifr);
            }, 2000);

            var t1 = Date.now();
            var ifr = document.createElement("iframe");
            ifr.setAttribute('src', open_android);
            ifr.setAttribute('style', 'display:none');
            document.body.appendChild(ifr);
            setTimeout(function () {
                var t2 = Date.now();
                if (!t1 || t2 - t1 < t + 100) {
                  hasApp = false;
                }
            }, t);
            return;
        }
        if (userAgent.match(/iPhone/i) == "iPhone") {
            if(!open_ios) return;
            location.href = open_ios;
            setTimeout(function () {
                window.location.href = download_ios;
            }, 2000);
            return;
        }
    },

    getQueryString: function(name) {
    	// 获取query
	  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	  var r = window.location.search.substr(1).match(reg);
	  if (r === null) {
	    var reg2 = /^.*?[?]/;
	    var r2 = window.location.hash.replace(reg2, "")
	    r = r2.match(reg);
	  }

	  if (r != null) return r[2];
	  return null;
	},

	setCookie: function(name, value, day) {
		// 写cookies
	  if(!value){
	    return;
	  }
	  try {
	    var Days = day || 30;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	    if (typeof (value) != "string") {
	      value = JSON.stringify(value)
	    }
	    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	  } catch (e) {
	    return null
	  }
	},

	getCookie: function(name) {
		// 读cookie
	  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	  if (arr = document.cookie.match(reg))
	    return unescape(arr[2]);
	  else
	    return null;
	},

	delCookie: function(name) {
		// 删除cookie
	  var exp = new Date();
	  exp.setTime(exp.getTime() - 1);
	  var cval = utils.getCookie(name);
	  if (cval != null)
	    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}

export default utils;