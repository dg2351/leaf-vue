<template>
    <div style="display: block">
        <div style="width: calc(100% - 300px);">
        </div>
        <div class="header">
            <slot></slot>
            <span class="inline-block mL20">{{TITLE}}</span>
			<div class="inline-block message floatRight">
				<a-dropdown>
					<div class="flex alignC ">
						<span class="names">用户<a-icon type="down" class="mL10" style="font-size:12px;" /></span>
					</div>
					<a-menu slot="overlay">
						<a-menu-item key="1" @click="confirm">
							<a-icon class="logout" type="logout"/><span class="logout">退出登录</span>
						</a-menu-item>
					</a-menu>
				</a-dropdown>
			</div>
        </div>
    </div>
</template>

<script>
import LoginApi from "@/plugins/utils/login";
import {LOGIN_URL, TITLE} from "@/plugins/mutation-types";

export default {
    name: "Head",
	data(){
    	return{
			TITLE,
		}
	},
    methods:{
		confirm(){
			LoginApi.logout().then(res=>{
				window.open(LOGIN_URL, '_self');
			})
		}
    }
}
</script>

<style scoped>
.header {
	color: #3A94EF;
}
.inline-block{
	display: inline-block;
}
.names{
	padding-left: 6px;
	font-size: 16px;
}
.logout{
	vertical-align: middle;
}
.message i {
	font-size: 18px;
	margin-right: 18px;
}
.message i:hover {
	cursor: pointer;
}
.flex{
	display: flex;
}
.alignC {
	align-items: center;
}
.floatRight{
	float:right;
}
</style>
