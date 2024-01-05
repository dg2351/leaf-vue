// 列表生成
const FuncList = {
	data() {
		let self = this;
		return {
			loading: true,
			showColumns: ['action'],
			showColumnsTitle: [],
			widthColumns: {action:180},
			alignColumns: {action:'center'},
			fixedColumns: {},
			hiddenColumn: [],
			slotColumn: [],
			ellipsisColumn: [],
			sorterColumn: [],
			//不同状态的不同点
			statusMap: {},
			/**
			 * 分页
			 */
			paginationTotal: null,
			pagination: {
				total: 0, // 总数，必须先有
				defaultCurrent: 1, // 默认当前页数
				defaultPageSize: 10, // 默认当前页显示数据的大小
				showSizeChanger: true,
				showQuickJumper: true,
				pageSizeOptions: ["5", "10", "20", "50", "100"],
				showTotal: (total) => {
					let val = self.paginationTotal ? self.paginationTotal : total;
					return `共 ${val} 条`; // 显示总数
				},
				onShowSizeChange: (current, pageSize) => {
					this.pagination.defaultCurrent = current;
					this.pagination.defaultPageSize = pageSize;
					this.paginationLoadData(current); //显示列表的接口名称
				},
				// 改变每页数量时更新显示
				onChange: (current, size) => {
					this.pagination.defaultCurrent = current;
					this.pagination.defaultPageSize = size;
					this.paginationLoadData(current);
				},
			},
		};
	},
	// created() {
	// 	this.initStatusMap();
	// 	this.setColumnsByTab();
	// },
	methods: {
		paginationLoadData(pageIndex){},
		initStatusMap(){
			//初始化Tab
			Object.keys(this.statusMap).forEach(key => {
				this.tabTypes.push({key: key, tab: this.statusMap[key].title})
				if(this.activeTab==null || this.activeTab==='')
					this.activeTab = this.tabTypes[0].key
			})
		},
		setColumnsByTab(){
			Object.keys(this.statusMap).forEach(tabKey => {
				let resultColumns = []

				let widthColumns = JSON.parse(JSON.stringify(this.widthColumns))
				if(this.statusMap[tabKey].widthColumns)
					Object.assign(widthColumns, this.statusMap[tabKey].widthColumns)

				let fixedColumns = JSON.parse(JSON.stringify(this.fixedColumns))
				if(this.statusMap[tabKey].fixedColumns)
					Object.assign(fixedColumns, this.statusMap[tabKey].fixedColumns)

				let alignColumns = JSON.parse(JSON.stringify(this.alignColumns))
				if(this.statusMap[tabKey].alignColumns)
					Object.assign(alignColumns, this.statusMap[tabKey].alignColumns)

				let hiddenColumn = JSON.parse(JSON.stringify(this.hiddenColumn))
				if(this.statusMap[tabKey].hiddenColumn){
					this.statusMap[tabKey].hiddenColumn.forEach(item=>{hiddenColumn.push(item)})
				}

				let slotColumn = JSON.parse(JSON.stringify(this.slotColumn))
				if(this.statusMap[tabKey].slotColumn){
					this.statusMap[tabKey].slotColumn.forEach(item=>{slotColumn.push(item)})
				}

				let ellipsisColumn = JSON.parse(JSON.stringify(this.ellipsisColumn))
				if(this.statusMap[tabKey].ellipsisColumn){
					this.statusMap[tabKey].ellipsisColumn.forEach(item=>{ellipsisColumn.push(item)})
				}

				let sorterColumn = JSON.parse(JSON.stringify(this.sorterColumn))
				if(this.statusMap[tabKey].sorterColumn){
					this.statusMap[tabKey].sorterColumn.forEach(item=>{sorterColumn.push(item)})
				}

				this.showColumns.forEach((showColumnKey,index) => {
					//筛选显示的列
					//不存在或者存在但不在其中
					if(!hiddenColumn || !hiddenColumn.includes(showColumnKey)){
						let target = Object.assign({
							title:this.showColumnsTitle[index],
							key:showColumnKey,
							dataIndex:showColumnKey,
						});
						// 序号
						if(showColumnKey == 'xh'){
							target.customRender = (text, record, index)=>`${index + 1}`;
						}
						// 获取宽度
						let width = null
						Object.keys(widthColumns).filter(key=>key===showColumnKey).forEach(key=>{width = widthColumns[key]});
						if(width) Object.assign(target, {width: width});
						// 获取位置
						let align = null
						Object.keys(alignColumns).filter(key=>key===showColumnKey).forEach(key=>{align = alignColumns[key]});
						if(align) Object.assign(target, {align: align});
						// 获取fixed
						let fixed = null
						Object.keys(fixedColumns).filter(key=>key===showColumnKey).forEach(key=>{fixed = fixedColumns[key]});
						if(fixed) Object.assign(target, {fixed: fixed});
						// slotColumn
						if(slotColumn && slotColumn.includes(showColumnKey)){
							Object.assign(target, {scopedSlots: {customRender: showColumnKey}});
						}
						// ellipsisColumn
						if(ellipsisColumn && ellipsisColumn.includes(showColumnKey)){
							Object.assign(target, {ellipsis: true});
						}
						// sorterColumn
						if(sorterColumn && sorterColumn.includes(showColumnKey)){
							Object.assign(target, {sorter: (a, b) => a[showColumnKey] - b[showColumnKey]});
						}
						//确定列的名字
						resultColumns.push(target)
					}
				})
				//设置tab对应的表的列头信息
				this.statusMap[tabKey].columns = resultColumns
			})
		},
		/**
		 * 通用方法
		 * @param alias  表单方案别名
		 */
		funcListEvent(alias){
			let self_ = this;
			let ajax = {};
			/**
			 * 删除方法
			 * @param id  主键
			 * @param callback 回调方法
			 */
			ajax.delete = function (id, callback) {
				let confirm={content:'彻底删除后，数据不可恢复！请谨慎操作'};
				self_.$confirm({
					title: '操作提示',
					content: confirm.content,
					okText: '确认',
					cancelText: '取消',
					zIndex:2000,
					onOk() {
						console.log('删除操作')
					},
					onCancel() {}
				})
			}
			return ajax;
		}
	},
};

export default FuncList
