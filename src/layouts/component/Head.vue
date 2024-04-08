<template>
    <div style="display: block">
        <div style="width: calc(100% - 300px);">
        </div>
        <div class="header" style="width: 300px">
            <slot></slot>
            <span class="mL20">服务平台</span>
			<div class="message">
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
export default {
    name: "Head",
    methods:{
		confirm(){
			this.$util.link(this).get("login");
		}
    }
}
</script>

<style scoped>
.header {
	display: flex;
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
</style>
