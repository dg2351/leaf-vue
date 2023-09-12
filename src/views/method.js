export function test(){
	let xhr = new XMLHttpRequest(),
	okStatus = document.location.protocol === "file:" ? 0 : 200;
	xhr.open('GET', './文本.txt', false);// 文件路径
	xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
	xhr.send(null);
	console.log(xhr.responseText); //打印文件信息

	let text = xhr.responseText.split("===================================================================")

	let objList = text[0];
	let dataList = text[1];
	let keyList = (objList.replaceAll("\ufffc", "")).replaceAll("\n", "").split("选中").filter(p=>p!='');
	let tableList = [];
	let list = dataList.split("\n").filter(p=>p != "");
	let column = {name:"",object:[]};
	let object = {name:"",remark:""};
	list.forEach(value => {
		if(value.indexOf('队伍') != -1){
			column.object.push(object);
			tableList.push(column);
			column = JSON.parse(JSON.stringify({name:"", object:[]}))
			object = {name:""};
			column["name"] = value;
		} else{
			let d = keyList.filter(p=>p.indexOf(value) != -1)
			if(d.length > 0){
				column.object.push(object);
				object = JSON.parse(JSON.stringify({name:"",remark:""}));
				object["name"] = value;
			} else{
				object["remark"] = value
			}
		}
	})
	tableList.push(column);


	tableList = tableList.filter(p=>p.name != '').map(item =>{
		item.object = item.object.filter(p=>p.name != '')
		return item
	})
	let result = {};
	let config = [];
	let cmdDefualt = {key:{type:"",value:""}};
	{
		var cmd = JSON.parse(JSON.stringify(cmdDefualt));
		cmd.key.type="场景";
		cmd.key.value="等待|进入战斗";
		config.push(cmd);
	}
	{
		var cmd = JSON.parse(JSON.stringify(cmdDefualt));
		cmd.key.type="保存变量";
		cmd.key.value="首发|1";
		config.push(cmd);
	}
	{
		var cmd = JSON.parse(JSON.stringify(cmdDefualt));
		cmd.key.type="文本判定";
		cmd.key.value="对方精灵|返回文本";
		config.push(cmd);
	}
	// 第一层处理
	tableList.forEach(m=>{
		m.object.forEach(item=>{
			let name = item.name;
			let v = config.filter(p=>p.key.value.indexOf(name) != -1)
			if(v.length > 0){
				v[0].key.remark.push(item.remark);
				let i = v[0].key.remark.length;
				let key = "if"+i;
				v[0].key[key] = {
					config: []
				}
				{
					if(item.remark.indexOf("鬼灯5+4") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|水晶灯火灵,战斗|冥想,战斗|冥想,战斗|冥想,战斗道具|特攻强化,战斗道具|速度强化,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("地鼠4+4") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|剑舞,战斗|剑舞,战斗道具|速度强化,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("🐹2+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|剑舞,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("🐹📌6+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|隐形岩,战斗|剑舞,战斗|剑舞,战斗|剑舞,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("戏法") == 0){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="战斗|戏法";
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("🐸6+2") != -1 || item.remark.indexOf("青蛙6+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|蚊香泳士,战斗|腹鼓,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("🐹📌💡2+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|隐形岩,切换|水晶灯火灵,战斗|冥想,战斗|冥想,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("鬼灯4+2+2（防御）") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|水晶灯火灵,战斗|冥想,战斗|冥想,战斗道具|特攻强化,战斗道具|速度强化,战斗道具|防御强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("地鼠钉+4") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|隐形岩,战斗|剑舞,战斗|剑舞"
						v[0].key.if1.config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key.if1.config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("灯4+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|水晶灯火灵,战斗|冥想,战斗|冥想,战斗道具|特攻强化,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("地鼠钉4+2") != -1 || item.remark.indexOf("🐹📌4+2") != -1 || item.remark.indexOf("🐹📌4+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|隐形岩,战斗|剑舞,战斗|剑舞,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("地鼠6+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|剑舞,战斗|剑舞,战斗|剑舞,战斗道具|速度强化"
						v[0].key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						v[0].key[key].config.push(cmdChildren);
					}
				}
			}  else{
				let cmd = JSON.parse(JSON.stringify(cmdDefualt))
				cmd.key.condition="首发|1";
				cmd.key.type="变量比较";
				cmd.key.value="对方精灵|包含|"+item.name;
				cmd.key.remark = [];
				cmd.key.remark.push(item.remark);
				let key = "if1";
				cmd.key.if1 = {
					"config":[]
				};
				{
					var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
					cmdChildren.key.type="保存变量";
					cmdChildren.key.value="首发|0";
					cmd.key.if1.config.push(cmdChildren);
				}
				{
					if(item.remark.indexOf("戏法") == 0){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="战斗|戏法";
						cmd.key.if1.config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("灯4+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|水晶灯火灵,战斗|冥想,战斗|冥想,战斗道具|特攻强化,战斗道具|速度强化"
						cmd.key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("鬼灯4+2+2（防御）") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|水晶灯火灵,战斗|冥想,战斗|冥想,战斗道具|特攻强化,战斗道具|速度强化,战斗道具|防御强化"
						cmd.key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("鬼灯5+4") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|水晶灯火灵,战斗|冥想,战斗|冥想,战斗|冥想,战斗道具|特攻强化,战斗道具|速度强化,战斗道具|速度强化"
						cmd.key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("地鼠4+4") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|剑舞,战斗|剑舞,战斗道具|速度强化,战斗道具|速度强化"
						cmd.key[key].config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key[key].config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("地鼠钉+4") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|隐形岩,战斗|剑舞,战斗|剑舞"
						cmd.key.if1.config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key.if1.config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("🐹2+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|剑舞,战斗道具|速度强化"
						cmd.key.if1.config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key.if1.config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("青蛙6+2") != -1 || item.remark.indexOf("🐸6+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|蚊香泳士,战斗|腹鼓,战斗道具|速度强化"
						cmd.key.if1.config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key.if1.config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("🐹📌💡2+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|隐形岩,切换|水晶灯火灵,战斗|冥想,战斗|冥想,战斗道具|速度强化"
						cmd.key.if1.config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key.if1.config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("地鼠钉4+2") != -1 || item.remark.indexOf("🐹📌4+2") != -1 || item.remark.indexOf("🐹📌4+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|隐形岩,战斗|剑舞,战斗|剑舞,战斗道具|速度强化"
						cmd.key.if1.config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key.if1.config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("🐹📌6+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|隐形岩,战斗|剑舞,战斗|剑舞,战斗|剑舞,战斗道具|速度强化"
						cmd.key.if1.config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key.if1.config.push(cmdChildren);
					}
				}
				{
					if(item.remark.indexOf("地鼠6+2") != -1){
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="操作";
						cmdChildren.key.value="切换|龙头地鼠,战斗|剑舞,战斗|剑舞,战斗|剑舞,战斗道具|速度强化"
						cmd.key.if1.config.push(cmdChildren);
						var cmdChildren = JSON.parse(JSON.stringify(cmdDefualt));
						cmdChildren.key.type="自定义";
						cmdChildren.key.value="自动战斗"
						cmd.key.if1.config.push(cmdChildren);
					}
				}
				config.push(cmd);
			}
		})
	})
	result.config=config
	console.log(JSON.stringify(result));
}
