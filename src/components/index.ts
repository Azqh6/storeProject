import SvgIcon from  '@/components/SvgIcon/index.vue'
import Pubg from '@/components/pubg/index.vue'
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGlobalComponent:any={SvgIcon,Pubg,Category}
//@ts-ignore
export default{
    install(app:any){
        Object.keys(allGlobalComponent).forEach(key=>{
            app.component(key,allGlobalComponent[key])
        });
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
          }
    }
}