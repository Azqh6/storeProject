import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//引入svg
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import {viteMockServe} from 'vite-plugin-mock'
import { loadEnv } from 'vite'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({command,mode})=>{
  let env=loadEnv(mode,process.cwd() )
  return {
    plugins: [vue(), createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // Specify symbolId format
      symbolId: 'icon-[dir]-[name]',
    }),
    viteMockServe({
      localEnabled: command === 'serve',
    }),],
    resolve: {
      alias: {
        "@": path.resolve("./src")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    //代理跨域
    server:{
      proxy:{
        [env.VITE_APP_BASE_API]:{
          target: env.VITE_SERVE,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  
        }
      }
    }
  }
})
