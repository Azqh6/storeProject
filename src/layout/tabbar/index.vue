<template>
    <div class="tabbar">
        <div class="tabbar_left">
            
            <el-icon style="margin-right: 20px;" @click="changeIcon">
                <component :is="layOutStore.fold?'Fold':'Expand'"></component>
            </el-icon>
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" v-show="item.meta.title">
                    <el-icon style="margin: 0 5px;">
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{item.meta.title}}</span> 
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tabbar_right">
            <el-button size="default" icon="Refresh" circle @click="Refresh"></el-button>
            <el-button  size="default" icon="FullScreen" circle @click="fullScreen"></el-button>
            <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
                <el-form>
                    <el-form-item label="主题颜色" >
                        <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors" />
                        
                    </el-form-item>
                    <el-form-item label="暗黑模式" >
                        <el-switch @change="changeDark" v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny">
                        </el-switch>
                        
                    </el-form-item>
                </el-form>
                <template #reference>
                    <el-button  size="default" icon="Setting" circle></el-button>
                </template>
            </el-popover>
            
            <img :src="userStore.avatar" style="width: 32px; height: 32px;margin: 0px 10px;border-radius: 50%;">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{userStore.username}}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import {useRouter,useRoute} from 'vue-router'
//@ts-ignore
import useUserStore from '@/store/modules/user.ts'
//@ts-ignore
import useLayOutSettingStore from '@/store/modules/settings.ts'
let $router=useRouter()
let $route=useRoute()
let layOutStore=useLayOutSettingStore()
let userStore=useUserStore()
let dark=ref<boolean>(false)
// 改变切换图标
const changeIcon=()=>{
    layOutStore.fold= !layOutStore.fold
}
//刷新
const Refresh=()=>{
    layOutStore.refresh=!layOutStore.refresh
}
//全屏切换
const fullScreen=()=>{
    let full=document.fullscreenElement
    if(!full){
        document.documentElement.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
}
//退出登录
const logout= async ()=>{
   await userStore.userLogout()
    $router.push({path:'/login',query:{redirect:$route.path}})
}
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const changeDark=()=>{
    let html=document.documentElement
    dark.value?html.className='dark':html.className=''
}
const setColor=()=>{
    const html=document.documentElement
    html.style.setProperty('--el-color-primary',color.value)
}
</script>

<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .tabbar_left {

        display: flex;
        align-items: center;
        margin-left: 20px;
    }
    .tabbar_right{
        display: flex;
        align-items: center;
    }
}
</style>