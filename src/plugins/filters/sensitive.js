import filterData from './sensitive.json'//引入需要被过滤掉的词

export const filter = function (value) {
	//定义方法
	if (value) {
		//如果传入值不为空则进入
		value = JSON.parse(JSON.stringify(value))
		//将value进行深拷贝
		filterData.map(item => {//对过滤的词汇进行遍历
			if (value.includes(item)) {//如果过滤的词汇在传入值中
				let l = "*";//定义一个*
				for (let i = 1; i < item.length; i++) {//遍历过滤词汇长度
					l += '*'//让替换的长度等于被替换的长度
				}
				value = value?.replaceAll(item, l)//进行替换
			}
		})
		return value//如果不为空就返回处理后的值
	}
	return value//没处理也需要返回
}