<template>
    <div>
        <el-card>
            <el-form :inline="true">
            <el-form-item label="一级分类">
                <el-select v-model="categoryStore.c1Id" @change="getC2" :disabled="sence==0?false:true">
                    <el-option  v-for="(item,index) in categoryStore.c1Arr" :value="item.id" :key="item.id" :label="item.name" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类" >
                <el-select v-model="categoryStore.c2Id" @change="getC3" :disabled="sence==0?false:true">
                    <el-option v-for="(item,index) in categoryStore.c2Arr" :value="item.id" :label="item.name" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="categoryStore.c3Id" :disabled="sence==0?false:true">
                    <el-option v-for="(item,index) in categoryStore.c3Arr" :value="item.id" :label="item.name" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import {onMounted} from 'vue'
defineProps(['sence'])
let categoryStore=useCategoryStore()
//存储一级标签
onMounted(()=>{
    getC1()
})
//获取一级分类
const getC1=()=>{

    categoryStore.getC1()
}
//获取二级分类
const getC2=()=>{
    categoryStore.c2Id=''
    categoryStore.c3Id=''
    categoryStore.c3Arr=[]

    categoryStore.getC2()

}
//获取三级分类
const getC3=()=>{
    categoryStore.c3Id=''
    categoryStore.getC3()
}
</script>

<style scoped>

</style>