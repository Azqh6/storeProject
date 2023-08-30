<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Hello</h1>
                    <h2>欢迎来到甄选运营平台</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username" style="width: 500px;" ></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button :loading="loading" type="primary" size="default" class="login_btn" style="width: 500px;" @click="login">登录</el-button>
                    </el-form-item>
                    
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import {User,Lock} from '@element-plus/icons-vue'
import {reactive ,ref,onMounted} from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter,useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';
//引入时间函数
import  {getTime}  from '@/utils/time';
let useStore=useUserStore()
let $router =useRouter()
let $route=useRoute()
//控制登录加载
let loading=ref(false)
//收集账号与密码的数据
let loginForm=reactive({username:'admin',password:'atguigu123'})
//获取表单
let loginForms=ref()
//挂载
//登录方法
const login=async ()=>{
    await loginForms.value.validate()
    loading.value=true
    try {
      await  useStore.userLogin(loginForm)
      await useStore.userInfo()
       let redirect:any=$route.query.redirect
      $router.push({path:redirect || '/'})
      ElNotification({
        type:'success',
        message:'欢迎回来',
        title:`Hi! ${useStore.username} ,${getTime()}好`
      })
      loading.value=false
    } catch (error) {
        loading.value=false
        ElNotification({
        type:'error',
        message:(error as Error).message
      })
    }
    
}
//表单校验
const rules={
    username:[
        {required:true,message:'用户名不能为空',trigger:'blur'},
        {required:true,min:5,max:10,message:'长度 至少为五到十位',trigger:'change'}
    ],
    password:[
    {required:true,message:'密码不能为空',trigger:'blur'},
    {required:true,min:6,max:16,message:'长度至少为六到十六位',trigger:'change'}
    ]
}
</script>

<style scoped lang="scss">
.login_container{
    width: 100%;
    height: 100vh;
    background: url(../../assets/images/background.jpg) no-repeat;
    background-size: cover;
    .login_form{
        position: relative;
        width: 80%;
        top: 40vh;
        background:url("../../assets/images/login_form.png") no-repeat;
        background-size:cover;
        padding: 40px;
        h1{
            color: #fff;
            font-size: 40px;
        }
        h2{
            color: #fff;
            font-size: 20px;
            margin: 20px 0px;
        }

    }
    .login_btn{
        width: 100%;
    }
}
</style>