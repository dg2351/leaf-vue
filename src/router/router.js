export const constantRouterMap = [
	{
		path:"/login",
		name:"login",
		props:true,
		meta: {
			title: '登录',
		},
		component: ()=> import('@/views/login')
	}
	// BUG:刷新场合页面无法加载
	// {
	// 	path: '/:appKey',
	// 	name: 'index',
	// 	props: true,
	// 	component: () => import( '@/layouts/base')
	// },
]
