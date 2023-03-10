export const constantRouterMap = [
	{
		path:"/",
		name:"index",
		props:true,
		redirect:"/home",
		component: () => import('@/layouts/base'),
		children:[
			// 首页
			{
				path: "home",
				name: "home",
				component: () => import('@/views/page/home/home'),
			},
			// 数据统计
			{
				path: "census",
				name: "census",
				props:true,
				component: () => import('@/views/page/census/index'),
			},
			// 微信访客
			{
				path: "visitor",
				name: "visitor",
				props:true,
				component: () => import('@/views/page/wechat/visitor/index'),
			},
			// 日志
			{
				path: "logging",
				name: "logging",
				props:true,
				component: () => import('@/views/page/wechat/logging/index'),
			},
		]
	}
]