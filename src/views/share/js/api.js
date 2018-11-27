import $http from '@/vue-axios.js'
export function getCode(params){
	// 获取验证码
	let url = "/apis/act/user/h5/sendValidCode"
	return $http.post(url, params || {});
}

export function login(params){
	// 登录
	let url = "/apis/act/user/h5/login"
	return $http.post(url, params || {});
}

export function reggetCode(params){
	// 获取验证码
	let url = "/apis/act/reg/sendSmsCaptcha"
	return $http.post(url, params || {});
}

export function reglogin(params){
	// 登录
	let url = "/apis/act/reg/register"
	return $http.post(url, params || {});
}

export function signature(params){
	// 获取微信配置
	let url = "/apis/act/wx/getSignature"
	return $http.post(url, params || {});
}


export function getByMobile(params){
	// 根据手机号获取用户信息
	let url = "/apis/act/user/getUserByMobile"
	return $http.post(url, params || {});
}

export function getShareUrlapi(params){
	// 根据手机号获取用户信息
	let url = "/apis/act/invite/shareurl"
	return $http.post(url, params || {});
}

export function inviteInfo(params){
	// 根据用户id获取邀请记录
	let url = "/apis/act/invite/inviteInfo"
	return $http.post(url, params || {});
}

