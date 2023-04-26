import {ACCESS_TOKEN} from "@/plugins/mutation-types";
import rxAjax from "@/assets/js/ajax";
import Vue from 'vue'

/**
 * 获取路由
 * @returns {Promise<any>}
 */
export const getRouters = (appKey) => {
	return new Promise((resolve, reject) => {
		getLeftMenus(appKey,function (res,allMenus) {
			let routers = [];

			let parentRouter = {
				name: "fwpt",
				path: "/",
				props: true,
				component: () => import( '@/layouts/base')
			};
			let ary = [];
			buildRouters(allMenus, ary);
			parentRouter.children = ary;

			routers.push(parentRouter);
			res.routers=routers;
			resolve(res);
		});

	})
}

//根据appKey获取菜单
function  getLeftMenus(appKey,callback) {
	//获取菜单与当前用户
	var url = "/system/menu/list";
	rxAjax.postJson(url, {appKey:appKey}).then(({success, data}) => {
		if (success) {
			let menuMap={};
			for(var i=0;i<data.length;i++){
				menuMap[data[i].id]=data[i];
			}
			let allMenus = buildMenu(data)
			let obj={
				user: {},
				menus: allMenus ?? [],
				menuMap: menuMap
			};
			callback(obj, allMenus);
		}
	});
}

/**
 * 构建菜单
 * @param rows
 * @returns {*[]}
 */
function buildMenu(rows) {
	let newRows = [];
	rows.forEach(item => {
		newRows.push(item);
	});
	const menus = [];
	buildTree(newRows, menus, '0');
	return menus;
}

/**
 * 将菜单构建成树状
 * @param list
 * @param arr
 * @param parentId
 */
function buildTree(list, arr, parentId) {
	list.forEach(item => {
		if (item.pid === parentId) {
			let child = {
				id: item.id,
				pid: parentId,
				label: item.name,
				key: item.key,
				icon: item.icon,
				settingType: item.settingType,
				component: item.component,
				params: item.params,
				showType: item.showType, //菜单是否展示
				children: [],
			}
			buildTree(list, child.children, item.id)
			if (child.children.length === 0) {
				delete child.children
			}
			arr.push(child)
		}
	})
}

/**
 * 构建路由
 * @param parent
 * @param routers
 */
function buildRouters(parent,routers) {
	if (!parent) {
		return;
	}
	for (let i = 0; i < parent.length; i++) {
		let menu = parent[i];
		let path = (parent.path || "")  + (parent.path ? "/": "") + menu.key;
		menu.path = path;
		let component = getComponent(menu);
		//判断是否需要拼接token url最后为&accessToken结尾则拼接token
		if (menu.params && typeof (menu.params) == 'string') {
			var str = menu.params.substring(menu.params.indexOf("&"));
			if (str == "&accessToken") {
				var accessToken = Vue.ls.get(ACCESS_TOKEN);
				if (accessToken) {
					menu.params = menu.params + "=" + accessToken;
				}
			}
		}
		let router = {
			name: menu.key,
			path: path,
			component: component,
			meta: {
				params: menu.params,
				id: menu.id
			}
		};
		routers.push(router);
		if (menu.children && menu.children.length > 0) {
			buildRouters(menu.children, routers)
		}
	}
}

export function getComponent(menu) {
	var component=null;
	if (menu.settingType == "custom") {
		component = loadView(menu.component);
	} else if (menu.settingType == "iframe") {
		// component = DialogView
	}
	return component;
}

function loadView(view){ // 路由懒加载
	return () => import(`@/views/${view}`)
}
