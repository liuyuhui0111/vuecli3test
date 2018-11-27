<template>
	<div class="page">
		<div class="content">
			<div class="tab">
				<span @click="navtab=0" :class='{"on":navtab==0}'>邀请活动</span>
				<span @click="navtab=1" :class='{"on":navtab==1}'>我的邀请</span>
			</div>
			<div v-show="navtab==0" class="gz">
				<h4 @click="clearCookie">活动规则</h4>
				
				<p>1.	活动期间，分享专属链接给好友，好友成功注册成功即可获得<span class="tip">免息券</span>，有效期7天；</p>
				<p>2.	好友注册成功，您即可获得<span class="tip">免息券</span>，有效期60天；邀请越多，奖励越多；</p>
				<p>3.	奖励的免息券可在 <span class="tip">火山钱包APP-我的-我的优惠劵</span>  中查看；</p>
				<p>4.	本活动最终解释权在法律范围内归火山钱包所有。</p>
				<p>活动有效期：<span class="tip">2018-12-01 至 2019-01-30</span></p>
				
			</div>
			
			<div v-show="navtab==1" class="gz">
				<div  v-show="getUserid">
					<ul v-if="userlist.length>0" class="userlist">
						<li v-for="(item,index) in userlist" :key="index">被邀请人手机号：{{item.inviteMobile}}</li>
					</ul>
					<span @click="shareFn" class="nologin" v-else>
						您还没有成功邀请好友，去邀请
					</span>
				</div>
				<span class="nologin" @click="goLogin" v-show="!getUserid && isShowUserList">您尚未登录，去登录</span>

				<span @click="loadmore" v-show="!nomore && userlist.length>=pageSize" class="loadmore">加载更多</span>
			</div>

			<div @click="shareFn" class="btn">
				立即分享
			</div>
			
			<div class="loginbox" v-show="isShowLogin">
				<div class="title">
					登 录 
					<span @click="close" class="close">×</span>
				</div>
				<input v-model="tel" class="tel" type="tel" placeholder="请输入手机号">
				<div class="inp">
					<input v-model="code" class="code" type="tel" placeholder="请输入验证码">
					<span class="code_btn" 
					@click="getImageCaptcha"
					:class={on:smsDisabled} v-text="lbSmsCode">
					</span>
				</div>

				<div class="btn" @click="loginFn">免注册登录</div>
			</div>
		</div>
		<!-- 图形验证码弹窗 -->
		<div class="confirmbox" v-show="isShowConfirmBox">
			<div class="re">
	            <p> 请输入图形验证码</p>
	            <div class="item">
	                <input v-model="codeimg" type="text" placeholder="请输入图片中字符">
	                <div @click="getImageCaptcha" class="imgbox">
	                    <img :src="src" alt="验证码">
	                    <span>看不清？换一张</span>
	                </div>
	            </div>
	            <div class="btns">
	                <span @click="isShowConfirmBox=false;isShowLogin=true" class="cancel">取消</span>
	                <span @click="subImgCodeFn" class="sub">确认</span>
	            </div>
	        </div>
        </div>
		<!-- 微信引导分享图 -->
		<img v-show="isShowShare" src="./imgs/share.png" alt="" class="share">
		<!-- 遮罩层 -->
		<div class="mask" @click="hideMask" v-show="isShowMask"></div>

	</div>
</template>
<script>
import utils from '@/assets/js/utils.js'
import { getCode, login, signature, getShareUrlapi, getByMobile, inviteInfo } from './js/api.js'
	export default {
	//路由进入之前
		beforeRouteEnter (to, from, next) {
			next(vm=>{
				console.log(vm.name)
			}) 
		},

		data(){
			return {
				name: "分享有礼",
				lbSmsCode: "发送验证码",
				smsDisabled: false,
				isShowLogin: false,		//是否显示登录框
				isShowMask: false,		//是否显示遮罩
				isShowShare: false,
				navtab:0,				//tab切换
				pageNum:1,				//最多加载条数
				pageSize:10,			//每页条数
				nomore:false,			//是否还有更多数据
				tel: "",
			    code: "",
			    codeimg: "",
				shareid:"",				//分享人唯一标识
				isShowConfirmBox: false,
				src:"", 
				isShowPage: true,
				userlist: [],
				channelNo: "",			//活动渠道
				token:"",
				waitLoginStata:false,		//等待登录状态
				isShowUserList:false,
			}
		},
		mounted(){
			this.init();
		},

		methods:{
			clearCookie(){
				// 测试方便清理cookie
				utils.delCookie("userid");
				utils.delCookie("token");
				utils.delCookie("shareUrl");
				window.location.reload();
			},

			init(){
				// 初始化列表
				this.waitLoginStata = false;
				this.channelNo = utils.getQueryString("utm_medium") || "";
				this.$http.defaults.headers.channelNo =this.channelNo;
				this.pageNum = 1;
				
				if(utils.isWeiXin()){
					// 在微信浏览器  初始化微信配置
					this.signatureInit()
				}

				if(this.getUserid){
					this.isShowUserList = false;
					// 如果有用户信息
					this.inviteInfoFn(this.getUserid)
					this.getShareUrlFn(this.getUserid)
				}else{
					this.isShowUserList = true;
					if(utils.isApp()){
					// 在APP里  直接获取用户手机号
					if(window.bridge.getUserId()){
						// 如果存在  获取手机号并获取用户信息以及列表
						let tel = window.bridge.getUserId()
						this.getByMobileFn(tel)
					}
				}
				}

				
			},


			signatureInit(){
	          signature({}).then((res)=>{
	            if(res.data.code == 200){
	              	utils.wxConfig(res.data.data)
	            }else{
	            	this.$toast(res.data.message)
	            }
	          },(err)=>{
	          	console.log(err);
	          })
	        },

			close(){
				this.isShowLogin = false;
				this.isShowMask = false;
			},

			hideMask(){
				if(this.isShowShare){
					this.isShowShare = false;
					this.isShowMask = false;
				}
			},

			getImageCaptcha(){
				this.codeimg = "";
		       let url = "/apis/act/user/h5/getImageCaptcha";
		       
		       let tel = this.tel.trim();

		      if (!tel) {
		        this.$toast("请输入手机号");
		        return;
		      }
		      if (!utils.isPoneAvailable(tel)) {
		        this.$toast("请输入正确的手机号");
		        return;
		      }
		       this.src = url + "?mobile="+tel+"&channelNo="+this.channelNo+"&t="+new Date().getTime()
		       this.isShowConfirmBox = true
		       this.isShowLogin = false
		    },

		    subImgCodeFn() {
		      // 确认图片验证码
		      let codeimg = this.codeimg.trim();
		      if (!codeimg) {
		        this.$toast("请输入图片验证码");
		      } else {
		        this.startClock();
		        this.isShowConfirmBox = false;
		        this.isShowLogin = true
		      }
		    },
			
			startClock(){
				let tel = this.tel.trim();
				let codeimg = this.codeimg.trim();
				let _this = this;
				if(this.smsDisabled){
					return;
				}
				if(!tel){
					this.$toast("请输入手机号");
					return;
				}

				if(!utils.isPoneAvailable(tel)){
					this.$toast("请输入正确的手机号");
					return;
				}


			    if (!codeimg) {
			    	this.$toast("请输入图片验证码");
			    	return;
			    }

				let params = {
					mobile: tel,
					channelNo:this.channelNo,
					imgVerifyCode:codeimg
				}

				// 防止连续请求
				if(!this.isCanRequest){
					return;
				}else{
					this.isCanRequest = false
				}

				getCode(params).then((res)=>{
					this.isCanRequest = true
					console.log(res);
					if(res.data.code == 200){
						utils.startClock(_this);
						this.$toast("验证码发送成功");
					}else{
						this.$toast(res.data.message);
					}
				}).catch((err)=>{
					this.isCanRequest = true
					console.log(err);
				})
			},

			loginFn(){
				// 登录
				utils.hmtPush("login","click","点击登录");
				let tel = this.tel.trim();
				let code = this.code.trim();

				if(!tel){
					this.$toast("请输入手机号");
					return;
				}

				if(!utils.isPoneAvailable(tel)){
					this.$toast("请输入正确的手机号");
					return;
				}

				if(!code){
					this.$toast("请输入验证码");
					return;
				}

				if(!utils.isCode(code)){
					this.$toast("请输入正确的验证码");
					return;
				}

				let params = {
					"mobile": tel,
					"validCode": code
				}
				// 防止连续请求
				if(!this.isCanRequest){
					return;
				}else{
					this.isCanRequest = false;
				}

				login(params).then((res)=>{
					this.isCanRequest = true;
					if(res.data.code == 200){
						this.setToken(res.data.data)
						this.getByMobileFn(tel)
					}
					
					console.log(res);
				}).catch((err)=>{
					this.isCanRequest = true
					console.log(err);
				})


			},

			getByMobileFn(tel){
				//根据手机号获取用户信息

				getByMobile({mobile:tel}).then((res)=>{
					if(res.data.code == 200){
						this.setUserid(res.data.data.id)
						this.getShareUrlFn(res.data.data.id)
						this.inviteInfoFn(res.data.data.id)
					}
				},(err)=>{
					console.log(err)
				})
			},

			getShareUrlFn(id){
				getShareUrlapi({userId:id}).then((res)=>{
					if(res.data.code == 200){
						if(utils.isApp()){
							this.setShareUrl(res.data.data.app)
						}else{
							this.setShareUrl(res.data.data.wx)
						}
						
						this.goShare()
						this.close()
					}
				},(err)=>{
					console.log(err)
				})

				
			},

			inviteInfoFn(id){
				// 根据用户id获取我的邀请列表
				inviteInfo({userId:id,pageNum:this.pageNum,channelNo:this.channelNo,pageSize:this.pageSize}).then((res)=>{
					this.isShowUserList = true;
					let arr = []

					if(res.data.code == 200){
						if(res.data.data.list){
							arr = res.data.data.list
						}
						if(this.pageNum >= res.data.data.totalPage){
							// 如果当前页码大于等于总页码 则表示没有更多了
							this.nomore = true
						}else{
							this.nomore = false
						}
						// console.log(this.pageNum,res.data.data.totalPage);
					}
					
					this.userlist = this.userlist.concat(arr)
				},(err)=>{
					console.log(err);
				})
			},

			loadmore(){
				// 加载更多
				if(this.nomore){
					return;
				}
				this.pageNum += 1;
				this.inviteInfoFn(this.getUserid)
			},

			shareFn(){
				// 分享
				this.waitLoginStata = true;
				utils.hmtPush("share","click","点击分享");
				// console.log(this.getShareUrl);
				if(utils.isWeiXin() || utils.isApp()){
					if(this.getShareUrl){
						// 如果已经生成分享url、去分享
						this.goShare();
					}else{
						// 未登录 去登录
						
						this.goLogin();
					}
				}else{
					//如果不是微信或者APP环境
					this.$toast("此活动仅支持微信客户端、火山钱包客户端用户参与")
				}
				
				// window.appToh5("setUserid","333")
			},

			goShare(){
				// 去分享
				// alert("wxShareUrl:==="+this.getShareUrl);
				this.wxShareUrl = this.getShareUrl;
				if(utils.isWeiXin()){
					// 如果是微信环境 显示遮罩层 引导分享
					
					if(this.waitLoginStata){
						// 如果是点击分享走的登录就自动调用分享
						this.waitLoginStata = false;
						this.wxShare();
						setTimeout(()=>{
							this.isShowMask = true;
							this.isShowShare = true;
						},20)	
					}
					
					
				}else if(utils.isApp()){
					// 如果是APP环境 调用APP分享 
					if(this.waitLoginStata){
						window.bridge.h5Share(this.wxShareUrl, this.wxShareTitle, this.wxShareDesc, this.wxShareImage)
					}
				}
			},

			goLogin(){
				
				if(utils.isApp()){
					// 如果不是微信环境 调用APP登录  登录成功返回当前页并刷新
					window.location.href = 'native://login?goBackAfterLogin=true';
				}else{
					this.isShowLogin = true;
					this.isShowMask = true;
				}
			},

			wxShare() {
	          //设置分享页

	            window.wx.onMenuShareTimeline({
	              title: this.wxShareDesc, // 分享标题
	              link: this.wxShareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	              imgUrl:this.wxShareImage, // 分享图标
	              success: function (res) {
	                // 用户确认分享后执行的回调函数
	                console.log(res);
	              },
	              cancel: function (res) {
	                // 用户取消分享后执行的回调函数
	                console.log(res);
	              }
	            });
	            //分享给朋友
	            window.wx.onMenuShareAppMessage({
	              title: this.wxShareTitle, // 分享标题
	              link: this.wxShareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	              imgUrl: this.wxShareImage, // 分享图标
	              desc: this.wxShareDesc, // 分享描述
	              success: function (res) {
	                // 用户确认分享后执行的回调函数
	                console.log(res);
	              },
	              cancel: function (res) {
	                // 用户取消分享后执行的回调函数
	                console.log(res);
	              }

	            });
	        },

		}
	}
</script>
<style scoped>
	.re{
		position: relative;
	}
	li{
		list-style: none;
	}
	.userlist li{
		line-height: 30px;
		height: 30px;
		text-align: left;
	}
	.nologin{
		line-height: 60px;
	}
	.tab{
		display: block;
		width: 100%;
		overflow: hidden;
		height: 40px;
		line-height: 40px;
		font-size: 18px;
		text-align: center;
		color: #fff;
	}

	.tab span{
		display: block;
		width: 50%;
		float: left;
		position: relative;
	}
	.tab span.on:after{
		content: "";
	    display: block;
	    width: 60%;
	    left: 20%;
	    bottom: 0px;
	    height: 2px;
	    background: #fff;
	    position: absolute;
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		display: block;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #000;
		opacity: 0.85;
		z-index: 10;
	}
	.page{
		position: relative;
		min-height: 100%;
		font-family: "PingFangHK-Semibold";
		padding-top: 334px;
		box-sizing:border-box;
		background: url("./imgs/sharebg.png") no-repeat top left;
		background-size: 100% auto;
		background-color:#cf3a38; 
	}
	.page img{
		display: block;
		width: 100%;
		height: auto;
	}
	.page img.logo{
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		z-index: -100;
		top: -100px;
	}
	.content{
		display: block;
		position: relative;
	}
	.gz{
		position: relative;
		width: 355px;
		height: 284px;
		overflow-y: auto;
		margin: 0 auto;
		box-sizing:border-box;
		padding: 5px 14px;
		color: #fff;
		background: #D44D4C;
		-webkit-box-shadow:0 3px 6px 0 rgba(159,38,38,0.91);
		box-shadow: 0 3px 6px 0 rgba(159,38,38,0.91);
	}
	h4{
		font-weight: bold;
		text-decoration: underline;
		text-align: center;
		padding: 10px 0;
		font-size: 20px;
		color: #FFFFFF;
		letter-spacing: 0;
		line-height: 30px;
	}
	.tip{
		color: #faeb07;
	}
	.underline{
		text-decoration: underline;
	}
	.gz p{
		text-align: left;
		padding-left: 15px;
		position: relative;
		font-size: 16px;
		line-height: 22px;
		padding-bottom: 5px;
	}
	.gz p:before{
		content: "";
		position: absolute;
		display: block;
		width: 11px;
		height: 11px;
		background: #FFEA01;
		border-radius: 6px;
		left: 0;
		top: 5px;
	}
	.btn{
		background: url('./imgs/btn.png') no-repeat center center;
		background-size: 312px 50px;
		width: 312px;
		height: 50px;
		line-height: 50px;
		margin: 20px auto;
		font-size: 24px;
		color: #C16622;
		letter-spacing: 0;
		text-align: center;
	}


	.loginbox{
		position: fixed;
		width: 100%;
		z-index: 11;
		background: #fcfae6;
		top: 50%;
		-webkit-transform: translate(0,-50%);
		-ms-transform: translate(0,-50%);
		-o-transform: translate(0,-50%);
		transform: translate(0,-50%);
		/*padding:0 0px 20px 0px;*/
		box-sizing:border-box;
	}
	.tel{
		background: #FFFFFF;
		border: 1px solid #FFAF94;
		border-radius: 4px;
		display: block;
		width: 312px;
		height: 43px;
		line-height: 22px;
		font-size: 16px;
		box-sizing:border-box;
		padding: 12px;
		margin:0 auto 20px auto;
	}
	.inp{
		width: 312px;
		height: 43px;
		margin:0 auto 20px auto;
		overflow: hidden;
	}
	.inp .code{
		display: block;
		float: left;
		width: 203px;
		height: 43px;
		line-height: 22px;
		font-size: 16px;
		box-sizing:border-box;
		padding: 12px;
		background: #FFFFFF;
		border: 1px solid #FFAF94;
		border-radius: 4px;
	}
	.code_btn{
		background: #FCD475;
		border-radius: 4px;
		width: 102px;
		height: 43px;
		line-height: 43px;
		display: block;
		float: right;
		font-size: 14px;
		color: #C16622;
		letter-spacing: 0;
		text-align: center;
	}
	.code_btn.on{
		background: #ccc;
		color: #fff;
	}
	.title{
		display: block;
		width: 100%;
		text-align: center;
		line-height: 40px;
		height: 40px;
		font-size: 18px;
		font-weight: bold;
		position: relative;
	}
	.close{
		position: absolute;
		right: 0;
		width: 40px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 22px;
	}

	.page img.share{
		pointer-events: none;
		position: fixed;
		top: 30px;
		right: 10%;
		display: block;
		width: 80%;
		z-index: 11;
	}

	.confirmbox,
	.alertbox {
	  position: absolute;
	  display: block;
	  background: #fff;
	  width: 300px;
	  height: auto;
	  top: 50%;
	  left: 50%;
	  -webkit-transform: translate(-50%, -50%);
	  -ms-transform: translate(-50%, -50%);
	  -o-transform: translate(-50%, -50%);
	  transform: translate(-50%, -50%);
	  z-index: 11;
	  border-radius: 20px;
	  padding-top: 30px;
	}
	.confirmbox {
	  padding-top: 21px;
	}

	.confirmbox p {
	  padding-bottom: 21px;
	  font-size: 17px;
	  color: #333333;
	  text-align: center;
	}
	.confirmbox .item {
	  overflow: hidden;
	  position: relative;
	  padding: 0 22px 18px 22px;
	}
	.confirmbox .item input {
	  display: block;
	  width: 136px;
	  height: 40px;
	  line-height: 20px;
	  padding: 10px 0;
	  box-sizing: border-box;
	  border: 1px solid #979797;
	  border-radius: 8px;
	  font-size: 14px;
	  text-align: center;
	  float: left;
	}
	.confirmbox .item .imgbox {
	  float: right;
	  width: 100px;
	  text-align: center;
	  font-size: 12px;
	  color: #999999;
	}
	.confirmbox .item .imgbox img {
	  display: block;
	  width: 100%;
	  height: auto;
	}

	.confirmbox .btns {
	  height: 44px;
	  line-height: 44px;
	  display: block;
	  font-size: 16px;
	  color: #888888;
	  overflow: hidden;
	  border-top: 1px solid #ddd;
	}
	.confirmbox .btns span {
	  display: block;
	  float: left;
	  width: 50%;
	  height: 100%;
	  position: relative;
	  text-align: center;
	}
	.confirmbox .btns .cancel:after {
	  content: "";
	  position: absolute;
	  width: 1px;
	  height: 100%;
	  right: 0;
	  top: 0;
	  background: #ddd;
	}
	.confirmbox .btns .sub {
	  font-size: 16px;
	  color: #3453e5;
	}
</style>