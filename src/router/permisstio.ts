//路由鉴权
import router from '@/router/index.ts'
//@ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({showSpinner:false})
//获取token
import useUserStore from '@/store/modules/user'
import pinia from '@/store'
let userStore=useUserStore(pinia)

//全局前置守卫
router.beforeEach(async (to:any,from:any,next:any)=>{
    document.title='甄选-'+to.meta.title
    nprogress.start()
    const token =userStore.token
    const username=userStore.username
    if(token){
        if(to.path=='/login'){
            next({path:'/'})
        }else{
            if(username){
                next()
            }else{
             try {
                await userStore.userInfo()
                next({...to})
             } catch (error) {
               await userStore.userLogout()
                next({path:'/login'})
             }
            }
        }
    }else{
        if(to.path=='/login'){
            next()
        }else{
            next({path:'/login'})
        }
    }
})
//全局后置守卫
router.afterEach((to:any,from:any)=>{
    nprogress.done()
})