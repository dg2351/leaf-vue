let key = 'fwpt'
export const ACCESS_TOKEN = `${key}-Token`;
export const ACCESS_USER = `${key}-User`;
//跳转的登录页面url
var path = process.env.VUE_APP_API_CTX_PATH;
//忽略TOKEN校验的地址
export const ignoreTokenPath = []

//应用的访问编码
export const BASE_URL = process.env.VUE_APP_API_BASE_URL;
export const CODE = process.env.VUE_APP_API_CTX_CODE;
export const PATH = process.env.VUE_APP_API_CTX_PATH;
export const TITLE = process.env.VUE_APP_API_CTX_TITLE;

export const LOGIN_URL = path + "/login";
