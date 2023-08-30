<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{fold:layOutStore.fold?true:false}">
      <Logo></Logo>
      <!-- 菜单 -->
      <el-scrollbar class="scrollbar">
        <el-menu :default-active="$route.path" background-color="#001529" text-color="#fff" :collapse="layOutStore.fold?true:false" :collapse-transition="false">
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{fold:layOutStore.fold?true:false}">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示 -->
    <div class="layout_main" :class="{fold:layOutStore.fold?true:false}">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
//@ts-ignore
import Logo from './logo/index.vue'
//@ts-ignore
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
//获取用户相关的仓库
import useUserStore from '@/store/modules/user';
import useLayOutSettingStore from '@/store/modules/settings.ts'
let layOutStore=useLayOutSettingStore()

let userStore = useUserStore()
let $route=useRoute()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: #fff;
    transition: all 0.2s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - 50px);
      .el-menu{
        border-right: none;
      }
    }
    &.fold{
      width: 50px;
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width ;
    transition: all 0.2s;

    &.fold{
      width: calc(100% - 50px);
      left:50px ;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);

    left: $base-menu-width ;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.2s;

    &.fold{
      width: calc(100% - 50px);
      left: 50px;
    }
  }
}
</style>
