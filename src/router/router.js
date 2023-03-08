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
				path:"home",
				name:"home",
				props:true,
				component: () => import('@/views/page/home/home'),
			},
			// 数据统计
			{
				path:"census",
				name:"census",
				props:true,
				component: () => import('@/views/page/home/home'),
			},
		]
	}
]