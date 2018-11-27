<template>
	<div class="page">
		<div class="content">
			<div class="loginbox">
				<input v-model="tel" class="tel" type="tel" placeholder="请输入手机号">
				<div class="inp">
					<input v-model="code" class="code" type="tel" placeholder="请输入验证码">
					<span class="code_btn" 
					@click="getImageCaptcha"
					:class={on:smsDisabled} v-text="lbSmsCode">
					</span>
				</div>
				<div class="xybox">
					注册即表示同意
					<a @click="goxy">《注册协议》</a>
				</div>
				
				<div class="btn" @click="loginFn">立即注册</div>
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
	                <span @click="isShowMask=false;isShowConfirmBox=false;" class="cancel">取消</span>
	                <span @click="subImgCodeFn" class="sub">确认</span>
	            </div>
	        </div>
        </div>
		<!-- 遮罩层 -->
		<div class="mask" @click="hideMask" v-show="isShowMask"></div>
		<!-- toast提示 -->
  		<div class="toast" v-show="isShowToast" v-text="toastStr"></div>
		
		<img src="./imgs/footbg.png" alt="" class="footbg">
	</div>
</template>
<script>
import utils from '@/assets/js/utils.js'
import { reggetCode, reglogin} from './js/api.js'
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
				tel: sessionStorage.getItem("tel") || "",
			    code: sessionStorage.getItem("code") || "",
			    codeimg: sessionStorage.getItem("codeimg") || "",
				shareid:"",				//分享人唯一标识
				isShowConfirmBox: false,
				src:"",
				channelNo:"",
				sourceChannelNo:"",
				actUserId:"",
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
				this.channelNo = utils.getQueryString("utm_medium") || "";
				this.sourceChannelNo = utils.getQueryString("sourceChannelNo") || "";
				this.actUserId = utils.getQueryString("actUserId") || "";
				console.log(this.actUserId)
				this.$http.defaults.headers.channelNo =this.channelNo;
				// utils.download()
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

			goxy(){
				// 跳转到注册协议
				sessionStorage.setItem("tel",this.tel)
				sessionStorage.setItem("code",this.code)
				sessionStorage.setItem("codeimg",this.codeimg)
				window.location.href = "http://activity.huaruiyisheng.com/contract/14/157ad315d0754afa8ae820257abc2d6d.html"
			},

			getImageCaptcha(){
				this.codeimg = "";
		       let url = "/apis/act/reg/getImageCaptcha";
		       
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
		       setTimeout(()=>{
		       		this.isShowConfirmBox = true
		       		this.isShowMask = true
		       },40)
		       
		    },

		    subImgCodeFn() {
		      // 确认图片验证码
		      let codeimg = this.codeimg.trim();
		      if (!codeimg) {
		        this.$toast("请输入图片验证码");
		      } else {
		        this.startClock();
		        this.isShowConfirmBox = false;
		        this.isShowMask = false;
		      }
		    },
			
			startClock(){
				let tel = this.tel.trim();
				let codeimg = this.codeimg.trim();
				let _this = this;

				if(!tel){
					this.toast("请输入手机号");
					return;
				}

				if(!utils.isPoneAvailable(tel)){
					this.toast("请输入正确的手机号");
					return;
				}

				if(this.smsDisabled){
					return;
				}

				// utils.startClock(_this);

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

				reggetCode(params).then((res)=>{
					this.isCanRequest = true
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
					this.toast("请输入手机号");
					return;
				}

				if(!utils.isPoneAvailable(tel)){
					this.toast("请输入正确的手机号");
					return;
				}

				if(!code){
					this.toast("请输入验证码");
					return;
				}

				if(!utils.isCode(code)){
					this.toast("请输入正确的验证码");
					return;
				}

				let params = {
					"mobile": tel,
					"smsVerifyCode": code,
					"channelNo":this.channelNo,
					"sourceChannelNo":this.sourceChannelNo,
					"actUserId":this.actUserId,
				}
				// 防止连续请求
				if(!this.isCanRequest){
					return;
				}else{
					this.isCanRequest = false
				}

				reglogin(params).then((res)=>{
					this.isCanRequest = true
					if(res.data.code == 200){
						this.$toast("注册成功");
						setTimeout(()=>{
							utils.download()
						},2000)
						
					}else{
						this.$toast(res.data.message)
					}
					
					console.log(res);
				}).catch((err)=>{
					this.isCanRequest = true
					console.log(err);
				})


			},

			

		}
	}
</script>
<style scoped>
	.re{
		position: relative;
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
		padding-top: 375px;
		padding-bottom: 110px;
		box-sizing:border-box;
		background: url("./imgs/regbg.png") no-repeat top left;
		background-size: 100% auto;
		background-color: #fcfae6;
	}
	.footbg{
		position: absolute;
		bottom: 0;
		width: 100%;
		height: auto;
		display: block;
	}
	.page img{
		display: block;
		width: 100%;
		height: auto;
	}
	.content{
		display: block;
		position: relative;
	}
	.gz{
		position: relative;
		width: 355px;
		margin: 0 auto;
		box-sizing:border-box;
		padding: 5px 14px;
		color: #fff;
		background: #D44D4C;
		-webkit-box-shadow:0 3px 6px 0 rgba(159,38,38,0.91);
		box-shadow: 0 3px 6px 0 rgba(159,38,38,0.91);
	}
	.xybox{
		font-size: 14px;
		color: #C16622;
		letter-spacing: 0;
		text-align: left;
		display: block;
	    width: 312px;
	    margin: 0 auto;
	}
	.xybox a{
		color: #C16622;
		text-decoration: none;
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
		position: relative;
		width: 100%;
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

	.share{
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