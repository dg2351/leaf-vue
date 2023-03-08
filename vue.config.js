// Vue.config.js 配置选项
const path = require('path')
var baseURL = process.env.VUE_APP_API_CTX_PATH;

function resolve (dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	publicPath: baseURL,
	outputDir: "dist",
	assetsDir: "static",
	devServer: {
		port: 18082,
		headers: {
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "*",
			"Access-Control-Allow-Origin": "*" // 开启应用间的跨域访问
		},
	},
	lintOnSave: false,
	pluginOptions: {},
	runtimeCompiler: true,
	productionSourceMap: false,
	chainWebpack: config => {
		config.resolve.alias
			.set('@public', resolve('public'))
			.set('@static', resolve('static'))
			.set('@image', resolve('static/image'))
			.set('vue$','vue/dist/vue.esm.js');
	},
	css: {
		extract: false,
		loaderOptions: {
			less: {
				lessOptions: {
					javascriptEnabled: true
				}

			}
		}
	},
}
