/**
 * 通用方法
 */
const FuncPublic = {
	name:"FuncPublic",
	methods: {
		//跳转
		linkPost(name, params) {
			this.$router.push({ name: name, params: params });
		},
		linkGet(name, params) {
			this.$router.push({ name: name, query: params });
		},
		back(){
			this.$router.go(-1);
		},
		linkSub(sub, name, query){
			this.$router.push({ name: sub, query: query, params:{path:name} });
		},
	}
};
export default FuncPublic
