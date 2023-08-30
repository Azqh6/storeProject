<template>
    <el-card >
        <div class="box">
            <img :src="userStore.avatar" alt="" class="avatar">
        <div class="buttom">
            <h3 class="title">{{ getTime() }}好！{{ userStore.username }}</h3>
            <p class="title1">甄选运营平台</p>
        </div>
        </div>
        
    </el-card>
    <div class="imgs">
        <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
    </div>
   
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';
let userStore = useUserStore()

onMounted(() => {
    userStore.userInfo()
})
</script>

<style scoped lang="scss">
    .box{
        display: flex;

        .avatar{
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }
        .buttom{
            margin-top: 10px;
            margin-left: 30px;
            .title{
                
                font-weight: 900;
                font-size: 30px;
                margin-bottom: 30px;
            }
            .title1{
                font-style: italic;
                color: dimgrey;
            }
        }
    }
    .imgs{
        display: flex;
        justify-content: center;
    }
</style>