import { createApp } from 'vue'
import App from './App.vue'
//配制element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配制elementPlus国际化
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入模板的全局的样式
import '@/styles/index.scss'
//安装自定义插件
import gloalComponent from '@/components/index.ts'
//svg插件配置代码
import 'virtual:svg-icons-register'
//引入路由
import router from './router'
//引入仓库
import pinia from './store'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app=createApp(App)
app.use(gloalComponent)
app.use(router)
app.use(pinia)
app.use(ElementPlus,{
    locale:zhCn
})
//引入路由鉴权
import '@/router/permisstio'
app.mount('#app')


