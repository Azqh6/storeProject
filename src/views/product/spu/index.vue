<template>
    <div>
        <Category :sence="sence"></Category>
        <el-card style="margin: 10px 0px;">
            <div v-show="sence == 0">
                <el-button type="primary" icon="Plus" style="margin: 10px 0px;"
                    :disabled="categoryStore.c3Id ? false : true" @click="addSpu">添加属性</el-button>
                <el-table border :data="records">
                    <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Plus" @click="addSku(row)"></el-button>
                            <el-button type="primary" size="small" icon="Edit" @click="updateSpu(row)"></el-button>
                            <el-button type="primary" size="small" icon="View" @click="findSku(row)"></el-button>
                            <el-button type="primary" size="small" icon="Delete" @click="deleteSku(row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                    :background="true" layout="prev, pager, next, jumper, ->, sizes,total" :total=total
                    @current-change="getHasSup" @size-change="changeSize" />
            </div>
            <SpuForm ref="spu" v-show="sence == 1" @changeSences="changeSence"></SpuForm>
            <SkuForm ref="sku" v-show="sence == 2" @changeSences="changeSence"></SkuForm>
            <el-dialog v-model="show" title="SKU列表">
                <el-table border :data="skuArr">
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column label="SKU价格" prop="price"></el-table-column>
                    <el-table-column label="SKU重量" prop="weight"></el-table-column>
                    <el-table-column label="SKU图片">
                        <template #="{ row, $index }">
                            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, shallowReactive } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList,reqRemoveSpu } from '@/api/product/spu/index'
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
//@ts-ignore
import SpuForm from './spuForm.vue'
import SkuForm from './skuFrom.vue'
import { ElMessage } from 'element-plus'
let sence = ref<number>(0) // 0显示展示  1显示添加spu  2 sku
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let categoryStore = useCategoryStore()
let records = ref<Records>([])
let spu = ref<any>()
let sku = ref<any>()
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>()
onBeforeMount(() => {
    categoryStore.$reset()
})
//监听三级下拉的变化，发送请求
watch(() => categoryStore.c3Id, () => {
    if (!categoryStore.c3Id) return
    getHasSup()
})
//获取以后得sup
const getHasSup = async (pager = 1) => {
    pageNo.value = pager
    let res: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    records.value = res.data.records
    total.value = res.data.total
}
//分页展示
const changeSize = () => {
    getHasSup()
}
//添加spu
const addSpu = () => {
    sence.value = 1
    spu.value.initAddSpu(categoryStore.c3Id)
}
//修改spu
const updateSpu = (row: SpuData) => {
    sence.value = 1
    spu.value.initHasSpuData(row)

}
//自定义事件
const changeSence = (obj: any) => {
    sence.value = obj.flag
    if (obj.params == 'update') {
        getHasSup(pageNo.value)
    } else {
        getHasSup()
    }
}
//添加sku
const addSku = (row: SpuData) => {

    sence.value = 2
    sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
//获取sku
const findSku = async (row: SpuData) => {
    let res: SkuInfoData = await reqSkuList((row.id as number))
    if (res.code == 200) {
        skuArr.value = res.data
        show.value = true
    }

}
//删除sku
const deleteSku=async (row:SpuData)=>{
    let res = await reqRemoveSpu((row.id as number))
    if(res.code==200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getHasSup(records.value.length>1?pageNo.value:pageNo.value-1)
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}
</script>

<style scoped></style>