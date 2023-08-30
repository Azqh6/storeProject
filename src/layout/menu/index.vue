<template>
    <template v-for="(item, index) in menuList" :key="item.path">
        <template v-if="!item.children">
            <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute" >
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>
                  <span> {{ item.meta.title }}</span> 
                </template>
            </el-menu-item>
        </template>
        <template v-if="item.children && item.children.length == 1">
            <el-menu-item v-if="!item.meta.hidden" :index="item.children[0].path" @click="goRoute">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>
                  <span> {{ item.children[0].meta.title }}</span> 
                </template>
            </el-menu-item>
        </template>

        <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
            <template #title>
                <el-icon>
                <component :is="item.meta.icon"></component>
                </el-icon>        
                <span>{{ item.meta.title }} </span> 
            </template>
            <Menu :menuList="item.children"></Menu>
        </el-sub-menu>
    </template>
</template>

<script lang="ts">
export default {
    name: 'Menu'
}
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps(['menuList'])
//@ts-ignore

let $router = useRouter()
//点击菜单
const goRoute = (vc: any) => {
    $router.push(vc.index)
}
</script>



<style scoped></style>