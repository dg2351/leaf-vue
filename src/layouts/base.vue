<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
            <div class="logo"/>
            <Menu></Menu>
        </a-layout-sider>
        <a-layout id="components-layout-demo-custom-trigger">
            <a-layout-header>
                <Head>
                    <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)"/>
                </Head>
            </a-layout-header>
            <a-layout-content>
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
import Head from '@/layouts/component/Head.vue';
import Menu from "@/layouts/component/Menu.vue";

export default {
    components: {
        Head,Menu
    },
    data(){
        return{
            collapsed: false,
        }
    },
    created() {
    },
    methods:{

    }
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
}
.logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}
</style>
