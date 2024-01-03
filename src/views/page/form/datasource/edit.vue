<template>
    <a-spin :spinning="loading">
        <div class="inner_head mB10">
            <h1>数据源定义</h1>
        </div>
        <div class="p10 bor_a">
            <form_model ref="formModel" :sourceData="sourceData" :form-config="formConfig"/>
			<div class="p10 bor_a">
				<a-table class="table_a mB20" rowKey="serial" :scroll="{y:300}"
						 :columns="columns" :data-source="data[sourceData.dbType]" :pagination="false">
					<template slot="val" slot-scope="text, record">
						<editable-cell :record="record" type="input" itemKey="val"/>
					</template>
				</a-table>
			</div>
        </div>
        <div class="textCenter mB20">
            <a-button type="primary" class="mR15" @click="onSubmit(true)">提交</a-button>
            <a-button class="mR15"  @click="back('list')">返回</a-button>
        </div>
    </a-spin>
</template>

<script>
import form_model from "@/component/form/form_model";
import rxAjax from "@/assets/js/ajax";

const EditableCell = {
	template: `
      <div class="editable-cell">
          <div v-if="editable" class="editable-cell-input-wrapper">
              <a-input ref="ipt" v-if="type=='input'" style="width: calc(100% - 0px)" v-model="record[itemKey]"
                       @pressEnter="check" @blur="check"/>
              <a-icon type="check" v-if="false" class="editable-cell-icon-check" @click="check"/>
          </div>
          <div v-else class="editable-cell-text-wrapper" @click="edit">
              <a-icon v-if="type=='input'" type="edit" class="editable-cell-icon" @click="edit" />
			  {{ record[itemKey] }}
          </div>
      </div>
    `,
	props: {
		record: Object,
		itemKey:String,
		type: String,
	},
	data() {
		return {
			editable: false,
		};
	},
	methods: {
		check() {
			this.editable = false;
		},
		edit() {
			this.editable = true;
			if(this.type == 'input'){
				this.$nextTick(() => {
					this.$refs.ipt.focus();
				})
			}
		},
	},
};
export default {
    name: "edit",
    props: {
        params: Object,
    },
    components: {form_model,EditableCell},
    computed: {
        routerParams() {
            return this.$route.query;
        },
    },
    data() {
        return {
            loading:false,
			// 默认mysql
            sourceData:{dbType:'MySQL'},
            formConfig: {
                visible: false,
                loading: true,
                disabled: false,
                data: [
                    {
                        label: "数据源名称",
                        type: "input",
                        vModel: "name",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "别名",
                        type: "input",
                        vModel: "alias",
                        maxLength: 20,
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
                    },
                    {
                        label: "数据库类型",
                        type: "select",
                        vModel: "dbType",
                        rule: [
                            {required: true, message: '该输入项不能为空', trigger: 'change'},
                        ],
						options:[
                            {label: 'MySQL', value: 'MySQL'},
							{label: 'SQLServer', value: 'SQLServer'},
                            {label: 'Oracle', value: 'Oracle'},
                            {label: 'PostgreSQL', value: 'PostgreSQL'},
                        ],
                    },
                    // {
                    //     label: "库名",
                    //     type: "input",
                    //     vModel: "schema",
                    //     maxLength: 12,
                    //     rule: [
                    //         {required: true, message: '该输入项不能为空', trigger: 'change'},
                    //     ],
                    // },
                    // {
                    //     label: "地址",
                    //     type: "input",
                    //     vModel: "host",
                    //     maxLength: 20,
                    //     rule: [
                    //         {required: true, message: '该输入项不能为空', trigger: 'change'},
                    //     ],
                    // },
                    // {
                    //     label: "端口",
                    //     type: "input",
                    //     vModel: "port",
                    //     maxLength: 6,
                    //     rule: [
                    //         {required: true, message: '该输入项不能为空', trigger: 'change'},
                    //     ],
                    // },
                    // {
                    //     label: "用户",
                    //     type: "input",
                    //     vModel: "username",
                    //     maxLength: 12,
                    //     rule: [
                    //         {required: true, message: '该输入项不能为空', trigger: 'change'},
                    //     ],
                    // },
                    // {
                    //     label: "密码",
                    //     type: "input",
                    //     vModel: "password",
                    //     maxLength: 12,
                    //     rule: [
                    //         {required: true, message: '该输入项不能为空', trigger: 'change'},
                    //     ],
                    // },
                    // {
                    //     label: "编码",
                    //     type: "select",
                    //     vModel: "encoding",
                    //     initFunction: function (item) {
                    //         item.data = [
                    //             {label: 'utf8', value: 'utf8'},
                    //             {label: 'gb2312', value: 'gb2312'},
                    //             {label: 'gbk', value: 'gbk'},
                    //         ]
                    //     },
                    //     data:[],
                    //     rule: [
                    //         {required: true, message: '该输入项不能为空', trigger: 'change'},
                    //     ],
                    // },
                ],
            },
			//
			columns:[
				{dataIndex: 'name',key: 'name',width: '15%',title:'参数名'},
				{dataIndex: 'comment',key: 'comment',width: '15%',title:'参数说明'},
				{dataIndex: 'type',key: 'type',width: '8%',title:'参数类型'},
				{dataIndex: 'val',key: 'val',width: '62%',title:'参数值',scopedSlots: { customRender: 'val' }},
			],
			data:{
				MySQL:[
					{serial:1,name:"url",comment:"连接字符串",type:"String",val:"jdbc:mysql://localhost:3306/dbName?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&zeroDateTimeBehavior=convertToNull&serverTimezone=GMT%2B8"},
					{serial:2,name:"username",comment:"用户名",type:"String",val:""},
					{serial:3,name:"password",comment:"密码",type:"String",val:""},
					{serial:4,name:"driver-class-name",comment:"驱动类",type:"String",val:"com.mysql.cj.jdbc.Driver"},
					{serial:5,name:"connection-init-sqls",comment:"初始执行sql",type:"String",val:""},
					{serial:6,name:"initialSize",comment:"初始大小",type:"int",val:"5"},
					{serial:7,name:"minIdle",comment:"最小空闲连接数",type:"int",val:"5"},
					{serial:8,name:"maxActive",comment:"连接池最大数",type:"int",val:"10"},
					{serial:9,name:"maxWait",comment:"获取连接超时的时间(毫秒)",type:"long",val:"60000"},
					{serial:10,name:"timeBetweenEvictionRunsMillis",comment:"检测间隔时间(毫秒)",type:"long",val:"60000"},
					{serial:11,name:"minEvictableIdleTimeMillis",comment:"连接最小生存时间(毫秒)",type:"long",val:"300000"},
					{serial:12,name:"validationQuery",comment:"连接校验语句",type:"String",val:"SELECT 1 "},
					{serial:13,name:"testWhileIdle",comment:"空闲时检测连接",type:"boolean",val:"true"},
					{serial:14,name:"testOnBorrow",comment:"获取连接时检测连接",type:"boolean",val:"false"},
					{serial:15,name:"testOnReturn",comment:"连接返回连接池时检测连接",type:"boolean",val:"false"},
					{serial:16,name:"poolPreparedStatements",comment:"打开PSCACHE",type:"boolean",val:"true"},
					{serial:17,name:"maxPoolPreparedStatementPerConnectionSize",comment:"PSCACHE大小",type:"int",val:"20"},
					{serial:18,name:"filters",comment:"插件",type:"String",val:"stat"}],
				SQLServer:[
					{serial:1,name:"url",comment:"连接字符串",type:"String",val:"jdbc:sqlserver://localhost:1433;DatabaseName=dbname;integratedSecurity=false"},
					{serial:2,name:"username",comment:"用户名",type:"String",val:""},
					{serial:3,name:"password",comment:"密码",type:"String",val:""},
					{serial:4,name:"driver-class-name",comment:"驱动类",type:"String",val:"com.microsoft.sqlserver.jdbc.SQLServerDriver"},
					{serial:5,name:"connection-init-sqls",comment:"初始执行sql",type:"String",val:""},
					{serial:6,name:"initialSize",comment:"初始大小",type:"int",val:"5"},
					{serial:7,name:"minIdle",comment:"最小空闲连接数",type:"int",val:"5"},
					{serial:8,name:"maxActive",comment:"连接池最大数",type:"int",val:"10"},
					{serial:9,name:"maxWait",comment:"获取连接超时的时间(毫秒)",type:"long",val:"60000"},
					{serial:10,name:"timeBetweenEvictionRunsMillis",comment:"检测间隔时间(毫秒)",type:"long",val:"60000"},
					{serial:11,name:"minEvictableIdleTimeMillis",comment:"连接最小生存时间(毫秒)",type:"long",val:"300000"},
					{serial:12,name:"validationQuery",comment:"连接校验语句",type:"String",val:"SELECT 1 "},
					{serial:13,name:"testWhileIdle",comment:"空闲时检测连接",type:"boolean",val:"true"},
					{serial:14,name:"testOnBorrow",comment:"获取连接时检测连接",type:"boolean",val:"false"},
					{serial:15,name:"testOnReturn",comment:"连接返回连接池时检测连接",type:"boolean",val:"false"},
					{serial:16,name:"poolPreparedStatements",comment:"打开PSCACHE",type:"boolean",val:"true"},
					{serial:17,name:"maxPoolPreparedStatementPerConnectionSize",comment:"PSCACHE大小",type:"int",val:"20"},
					{serial:18,name:"filters",comment:"插件",type:"String",val:"stat"}],
				Oracle:[
					{serial:1,name:"url",comment:"连接字符串",type:"String",val:"jdbc:oracle:thin:@localhost:1521:orcl"},
					{serial:2,name:"username",comment:"用户名",type:"String",val:""},
					{serial:3,name:"password",comment:"密码",type:"String",val:""},
					{serial:4,name:"driver-class-name",comment:"驱动类",type:"String",val:"oracle.jdbc.driver.OracleDriver"},
					{serial:5,name:"connection-init-sqls",comment:"初始执行sql",type:"String",val:""},
					{serial:6,name:"initialSize",comment:"初始大小",type:"int",val:"5"},
					{serial:7,name:"minIdle",comment:"最小空闲连接数",type:"int",val:"5"},
					{serial:8,name:"maxActive",comment:"连接池最大数",type:"int",val:"10"},
					{serial:9,name:"maxWait",comment:"获取连接超时的时间(毫秒)",type:"long",val:"60000"},
					{serial:10,name:"timeBetweenEvictionRunsMillis",comment:"检测间隔时间(毫秒)",type:"long",val:"60000"},
					{serial:11,name:"minEvictableIdleTimeMillis",comment:"连接最小生存时间(毫秒)",type:"long",val:"300000"},
					{serial:12,name:"validationQuery",comment:"连接校验语句",type:"String",val:"SELECT 1 FROM dual "},
					{serial:13,name:"testWhileIdle",comment:"空闲时检测连接",type:"boolean",val:"true"},
					{serial:14,name:"testOnBorrow",comment:"获取连接时检测连接",type:"boolean",val:"false"},
					{serial:15,name:"testOnReturn",comment:"连接返回连接池时检测连接",type:"boolean",val:"false"},
					{serial:16,name:"poolPreparedStatements",comment:"打开PSCACHE",type:"boolean",val:"true"},
					{serial:17,name:"maxPoolPreparedStatementPerConnectionSize",comment:"PSCACHE大小",type:"int",val:"20"},
					{serial:18,name:"filters",comment:"插件",type:"String",val:"stat"}],
				PostgreSQL:[
					{serial:1,name:"url",comment:"连接字符串",type:"String",val:"jdbc:postgresql://localhost:5432/dbName"},
					{serial:2,name:"username",comment:"用户名",type:"String",val:""},
					{serial:3,name:"password",comment:"密码",type:"String",val:""},
					{serial:4,name:"driver-class-name",comment:"驱动类",type:"String",val:"org.postgresql.Driver"},
					{serial:5,name:"connection-init-sqls",comment:"初始执行sql",type:"String",val:""},
					{serial:6,name:"initialSize",comment:"初始大小",type:"int",val:"5"},
					{serial:7,name:"minIdle",comment:"最小空闲连接数",type:"int",val:"5"},
					{serial:8,name:"maxActive",comment:"连接池最大数",type:"int",val:"10"},
					{serial:9,name:"maxWait",comment:"获取连接超时的时间(毫秒)",type:"long",val:"60000"},
					{serial:10,name:"timeBetweenEvictionRunsMillis",comment:"检测间隔时间(毫秒)",type:"long",val:"60000"},
					{serial:11,name:"minEvictableIdleTimeMillis",comment:"连接最小生存时间(毫秒)",type:"long",val:"300000"},
					{serial:12,name:"validationQuery",comment:"连接校验语句",type:"String",val:"SELECT 1 "},
					{serial:13,name:"testWhileIdle",comment:"空闲时检测连接",type:"boolean",val:"true"},
					{serial:14,name:"testOnBorrow",comment:"获取连接时检测连接",type:"boolean",val:"false"},
					{serial:15,name:"testOnReturn",comment:"连接返回连接池时检测连接",type:"boolean",val:"false"},
					{serial:16,name:"poolPreparedStatements",comment:"打开PSCACHE",type:"boolean",val:"true"},
					{serial:17,name:"maxPoolPreparedStatementPerConnectionSize",comment:"PSCACHE大小",type:"int",val:"20"},
					{serial:18,name:"filters",comment:"插件",type:"String",val:"stat"}],
			},
		};
    },
    created() {
        this.loadData(this.params.id);
    },
    methods:{
        loadData(id){
            let that = this;
            if(id){
                let api = "/form/datasource/def/info";
                let params = Object.assign({id:id});
                rxAjax.get(api, params).then(({success,data})=>{
                    that.sourceData = data;
					let setting = JSON.parse(data.setting??[])
					if(setting.length > 0)
						that.data[data.dbType] = setting
                    that.formConfig.loading = false
                })
            } else{
                that.formConfig.loading = false
            }
        },
        // 提交
        onSubmit(validate){
            let self_ = this;
            if(self_.loading) return;
            self_.loading = true;
            let data = this.$refs['formModel'].formMethods().getData(validate);
            if(!(data.validate)){
                return self_.loading = false;
            }
            let formData = data.formData;
            formData.setting = JSON.stringify(this.data[formData.dbType]);
            // 调用保存表单
            let api = "/form/datasource/def/save";
            rxAjax.postJson(api, formData).then(({success,data})=>{
                self_.loading = false;
                if(success){
                    self_.$message.success("保存成功");
					if(validate) self_.back();
                }
            }).catch(err=>{
				self_.loading = false;
				self_.$message.error("网络错误");
			});
        },
        back(){
            this.$util.component(this).event('list');
        }
    }
}
</script>

<style scoped>

</style>
