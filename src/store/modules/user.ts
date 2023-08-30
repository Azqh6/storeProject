import {defineStore} from 'pinia'
import { reqLogin, reqUserInfo ,reqLogout} from '@/api/user';
import type{UserState} from './types/type'
import { SET_TOKEN,GET_TOKEN } from '@/utils/token';
import {constantRoute,asyncRoute,anyRoute} from '@/router/routes'

import type { loginFormData ,loginResponseData,userInfoReponseData} from "@/api/user/type";
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router';
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
    return asyncRoute.filter((item: any) => {
      if (routes.includes(item.name)) {
        if (item.children && item.children.length > 0) {
          //硅谷333账号:product\trademark\attr\sku
          item.children = filterAsyncRoute(item.children, routes)
        }
        return true
      }
    })
  }
//创建用户的小仓库
let useUserStore=defineStore('User',{
    //仓库存储数据
    state:():UserState =>{
        return{
            token: GET_TOKEN(),
            menuRoutes:constantRoute,//仓库存储生成菜单所需要数组（路由）
            username:'',
            avatar:'',
            buttons:[]
        }
    }, 
    //异步|处理逻辑
    actions:{
        //用户登录
      async  userLogin(data:loginFormData){
          let res:loginResponseData=  await reqLogin(data)
            if(res.code==200){
                this.token=(res.data as string)
                //本地存储持久化存储一份
                SET_TOKEN((res.data as string))   
                return 'ok'                           
            }else{
                return Promise.reject(new Error(res.data))
            }
            
        },
        //获取用户信息
       async userInfo(){
            let res:userInfoReponseData = await reqUserInfo()
            console.log(res);
                if(res.code==200){
                this.username=res.data.name
                this.avatar=res.data.avatar
                let userAsyncRoute = filterAsyncRoute(
                  cloneDeep(asyncRoute),
                    res.data.routes,
                  )
                  //菜单需要的数据整理完毕
                this.menuRoutes=[...constantRoute,...userAsyncRoute,...anyRoute];
              [...userAsyncRoute,...anyRoute].forEach((route:any)=>{
                router.addRoute(route)
              })
                return 'ok'
            }else{
                return Promise.reject(new Error(res.message))
            }
     
            
        },
        //退出登录
        async userLogout(){
           let res:any= await reqLogout()
           if(res.code==200){
            this.token='',
            this.username='',
            this.avatar='',
            localStorage.removeItem('TOKEN')
            return 'ok'
           }else{
                return Promise.reject(new Error(res.message))
           }
        }
    },
    //计算属性
    getters:{


    }
})
export default useUserStore;