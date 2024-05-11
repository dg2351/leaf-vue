import rxAjax from '@/assets/js/ajax.js';
//表单权限配置 api接口
export const LoginApi = {};

//登录
LoginApi.login = (parameter) => rxAjax.postForm('/oauth/user/token/login', parameter,{token:false})
//退出登录
LoginApi.logout = () => rxAjax.postUrl('/oauth/user/token/remove')
//获取用户信息
LoginApi.getUserInfo = () => rxAjax.get('/user/org/osUser/current')
//获取验证码
LoginApi.imgcode = (uuid) => rxAjax.getBlob('/validata/code/'+uuid)

export  default LoginApi;
