<template>
    <div class="box">
        <Category :sence="sence"></Category>
        <el-card style="margin: 10px 0px;">
            <div v-show="sence == 0">
                <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                    @click="changeSence">添加属性</el-button>
                <el-table border style="margin: 10px 0px;" :data="attrArr">
                    <el-table-column label="属性" type="index" width="80px"></el-table-column>
                    <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row, $index }">
                            <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="item.id">
                                {{ item.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性操作" width="120px">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Edit" @click="updateAttrArr(row)"></el-button>
                            <el-button type="primary" size="small" icon="Delete" @click="deleteAttr(row.id)"></el-button>
                            
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="sence == 1">
                <el-form :inline="true">
                    <el-form-item label="属性名称" >
                        <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="addAttr" :disabled="attrParams.attrName?false:true" type="primary" size="default" icon="Plus">添加属性值</el-button>
                <el-button type="primary"  size="default"  @click="cancel">取消</el-button>
                <el-table border style="margin: 10px 0px;" :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80px" type="index">
                    </el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{row,$index}">
                            <el-input :ref="(vc:any)=>inputArr[$index]=vc" v-if="row.flag" @blur="changeFlag(row,$index)" placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
                            <div v-else @click="changeFlag2(row,$index)"> {{row.valueName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #="{row,index}">
                            <el-button  type="primary" size="default" @click="attrParams.attrValueList.splice(index,1)" icon="Delete"></el-button>
            
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" size="default" @click="save" :disabled="attrParams.attrValueList.length>0?false:true">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </div>
        </el-card>

    </div>
</template>

<script setup lang="ts">
import { reqAttr ,reqAddOrUpdateAttr,reqRemoveAttr} from '@/api/product/attr/index'
import { watch, ref,reactive,nextTick, onBeforeMount } from 'vue'
import { ElMessage, rowContextKey } from 'element-plus'
import useCategoryStore from '@/store/modules/category'
import type { AttrResponseData, Attr,AttrValue } from '@/api/product/attr/type'
let attrArr = ref<Attr[]>([])
let categoryStore = useCategoryStore()
let inputArr=ref<any>([])
//控制页面切换
let sence = ref<number>(0)
//控制输入？查看
let flag=ref<boolean>(true)
//获取新增属性
let attrParams=reactive<Attr>({
    attrName:'',
    attrValueList:[],
    categoryId:'',
    categoryLevel:3
})
watch(() => categoryStore.c3Id, async () => {
    attrArr.value = []
    if (!categoryStore.c3Id) return
    getAttr()

})
onBeforeMount(()=>{
    categoryStore.$reset()
})
//展示属性
const getAttr= async()=>{
    const { c1Id, c2Id, c3Id } = categoryStore
    let res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (res.code == 200) {
        attrArr.value = res.data
    }
}
// 切换页面
const changeSence = () => {
    sence.value = 1
    Object.assign(attrParams,{
    attrName:'',
    attrValueList:[],
    categoryId:categoryStore.c3Id,
    categoryLevel:3
})

}
//更新
const updateAttrArr = (row:Attr) => {
    sence.value = 1
    Object.assign(attrParams,JSON.parse(JSON.stringify(row)))
}
//取消
const cancel=()=>{
    sence.value=0
}
//添加属性
const addAttr=()=>{
    attrParams.attrValueList.push({
        valueName:'',
        flag:true
    })
    nextTick(()=>{
        inputArr.value[attrParams.attrValueList.length-1].focus()
    })
}
const save=async ()=>{
//@ts-ignore
 let res:any=  await reqAddOrUpdateAttr(attrParams)
 if (res.code == 200) {
    //切换场景
    sence.value=0
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }

 
}
const changeFlag=(row:AttrValue,$index:number)=>{
    //不为空
    if(row.valueName.trim()==''){
        attrParams.attrValueList.splice($index,1)
        ElMessage({
            type:'error',
            message:'属性值不能为空'
        })
        return
    }
    let res=attrParams.attrValueList.find((item)=>{
        if(item != row){
            return item.valueName===row.valueName
        }
    })
    if(res){
        attrParams.attrValueList.splice($index,1)
        ElMessage({
            type:'error',
            message:'属性值不能重复'
        })
        return
    }
    row.flag=false
}
const changeFlag2=(row:AttrValue,$index:number)=>{
    row.flag=true
    nextTick(()=>{
        inputArr.value[$index].focus()
    })
}
//删除
const deleteAttr=async (attrId:number)=>{
let res:any=    await reqRemoveAttr(attrId)
if(res.code==200){
    ElMessage({
        type:'success',
        message:'删除成功'
    })
    getAttr()
}else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}  
</script>

<style scoped>
.box {
    width: 100%;
}
</style>