<template>
    <div class="container">
        <div class="screen" ref="screen">
            <div class="top">
                <Top/>
            </div>
            <div class="bottom">
                <div class="left">
                    <Tourist class="tourist"></Tourist>
                    <Age class="age"></Age>
                    <Sex class="sex"></Sex>
                </div>
                <div class="center">
                    <Map class="map"></Map>
                    <Line class="line"></Line>
                </div>
                <div class="right">
                    <Rank class="rank"></Rank>
                    <Year class="year"></Year>
                    <Couter class="couter"></Couter>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Top from './components/Top/index.vue'
import Age from './components/age/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Couter from './components/couter/index.vue'
let screen = ref()
onMounted(() => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
//定义缩放比例
function getScale(w = 1920, h = 1080) {
    const ww = window.innerWidth / w
    const hh = window.innerHeight / h
    return ww < hh ? ww : hh
}
window.onresize=()=>{
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    background: url(./images/bg.png) no-repeat;
    background-size: cover;

    .screen {
        position: fixed;
        left: 50%;
        top: 50%;
        width: 1920px;
        height: 1080px;

        transform-origin: left top;
        .top{
            width: 100%;
            height: 40px;

        }
        .bottom{
            display: flex;
            .left{
                flex: 1;
                height: 1040px;

                display: flex;
                flex-direction: column;
                .tourist{
                    flex: 1.5;
                }
                .age{
                    flex: 1;
                }
                .sex{
                    flex:1
                }
            }
            .center{
                flex:2;
                display: flex;
                flex-direction: column;
                .map{
                    flex: 4;
                }
                .line{
                    flex: 1;
                }
            }
            .right{
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-left: 40px;
                .rank{
                    flex: 1.5;
                }
                .year{
                    flex: 1;
                }
                .couter{
                    flex: 1;
                }
            }
        }
        
    }
}
</style>