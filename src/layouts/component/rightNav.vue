<template>
	<div>
		<!--消息盒子-->
		<chatbox ref="chatbox"/>
		<!---->
		<ul class="rightNav" style="z-index: 1000">
			<li @click="scrollToTop"><i class="zd"></i></li>
			<li @click="$refs.chatbox.openModal()"><i class="back"></i></li>
		</ul>
	</div>
</template>

<script>
import chatbox from "@/layouts/component/chatbox";

export default {
	name: "rightNav",
	components:{
		chatbox,
	},
	methods:{
		scrollToTop(){
			this.$util.scrollToTop()
		},
	}
}
</script>

<style scoped>

</style>
