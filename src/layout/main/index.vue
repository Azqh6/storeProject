<template>
    <router-view v-slot="{Component}"> 
        <transition name="fade">
            <component :is="Component" v-if="flag"></component>
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import {watch,ref,nextTick} from 'vue'

import useLayOutSettingStore from '@/store/modules/settings.ts'
let layOutStore=useLayOutSettingStore()
let flag=ref(true)
//监听
watch(()=>layOutStore.refresh,()=>{
    flag.value=false
    nextTick(()=>{
        flag.value=true
    })
})
</script>

<style scoped>
.fade-enter-from{
    opacity: 0;
    transform:scale(0)
}
.fade-enter-active{
    transition: all 1s;
}
.fade-enter-to{

    opacity: 1;
   transform: scale(1)
}
</style>