<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
            </el-form-item>
            <el-form-item label="SPU品牌" size="default">
                <el-select placeholder="请选择" v-model="SpuParams.tmId">
                    <el-option v-for="(item, index) in AllTradeMark" :label="item.tmName" :value="item.id"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input placeholder="请输入SPU描述" type="textarea" v-model="SpuParams.description">
                </el-input>
            </el-form-item>
            <el-form-item label="SPU图标">
                <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="preview" style="width: 100% ;height: 100%;" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="SPU销售属性">
                <el-select placeholder="请选择" v-model="saleAttrIdAndValueName">
                    <el-option :value="`${item.id}:${item.name}`"  v-for="(item,index) in unSelectSaleAttr" :key="item.id" :label="item.name"></el-option>
                </el-select>
                <el-button :background="true" style="margin: 0px 10px;" type="primary" icon="Plus" @click="addSaleAttr">添加属性值</el-button>
                <el-table border style="margin: 10px 0px;" :data="saleAttr">
                    <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                    <el-table-column label="属性名" width="150px" prop="saleAttrName"></el-table-column>
                    <el-table-column label="属性值">
                        <template #="{ row, $index }">
                            <el-tag style="margin: 0px 5px;" v-for="(tag,index) in row.spuSaleAttrValueList" @close="row.spuSaleAttrValueList.splice(index,1)" :key="tag.id" class="mx-1" closable :type="tag.type">
                                {{ tag.saleAttrValueName }}
                            </el-tag>
                            <el-input @blur="changeLook(row)" v-model="row.saleAttrValue" v-if="row.flag==true" size="small" style="width: 100px;"></el-input>
                            <el-button v-else @click="changeEdit(row)" type="primary" size="small" icon="Plus"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                       <template #="{row,$index}">
                        <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index,1)"></el-button>
                    </template>
                        
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button  type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import { ref,computed } from 'vue'
import type { AllTradeMark, Trademark, SpuData, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, SpuImg, SaleAttr, HasSaleAttr } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus';
let $emit = defineEmits(['changeSences'])
let AllTradeMark = ref<Trademark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')
//已有的spu
let SpuParams = ref<SpuData>({
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
})
//将来收集还未选择的销售属性的id和属性值的名字
let saleAttrIdAndValueName=ref<string>('')
const cancel = () => {
    $emit('changeSences', {flag:0,params:'update'})
}
//照片点击查看图片
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true

}
//照片删除
const handleRemove = () => { }
const initHasSpuData = async (spu: SpuData) => {
    SpuParams.value = spu
    //获取全部的品牌
    let res: AllTradeMark = await reqAllTradeMark()
    //获取某一个品牌旗下全部售卖商品的图片
    let res1: SpuHasImg = await reqSpuImageList((spu.id as number))
    //获取已有的spu销售属性的数据
    let res2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number))
    //获取所有sp销售属性
    let res3: HasSaleAttrResponseData = await reqAllSaleAttr()
    AllTradeMark.value = res.data
    imgList.value = res1.data.map((item) => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    saleAttr.value = res2.data
    allSaleAttr.value = res3.data
}
//计算出当前spu未拥有的属性
const unSelectSaleAttr=computed(()=>{
    let unSelectArr=allSaleAttr.value.filter(item=>{
        return saleAttr.value.every(v=>{
            return item.name!=v.saleAttrName
        })
    })
    return unSelectArr
})
//添加销售属性的方法
const addSaleAttr = () => {
  /*
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList
    */
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  //准备一个新的销售属性对象:将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  //追加到数组当中
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAttrIdAndValueName.value = ''
}
//切换添加属性值
const changeEdit=(row:SaleAttr)=>{
   row.flag=true
   row.saleAttrValue=''
}
//表单失焦
const changeLook=(row:SaleAttr)=>{
    const {baseSaleAttrId,saleAttrValue}=row
    let newSaleAttrValue:any={
        baseSaleAttrId,
        saleAttrValueName:saleAttrValue
    }
    if(saleAttrValue?.trim()==''){
        ElMessage({
            type:'error',
            message:'属性值不能为空'
        })
        return
    }
    let repeat = row.spuSaleAttrValueList.find(item=>{
        return item.saleAttrValueName==saleAttrValue
    })
    if(repeat){
        ElMessage({
            type:'error',
            message:'属性值重复'
        })
        return
    }
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    row.flag=false
}
//保存
const save= async ()=>{
    SpuParams.value.spuImageList=imgList.value.map((item:any)=>{
        return {
            imgName:item.name,
            imgUrl:(item.response&&item.response.data) || item.url
        }
    })
    SpuParams.value.spuSaleAttrList=saleAttr.value
    let res=await reqAddOrUpdateSpu(SpuParams.value)
    if(res.code==200){
        ElMessage({
            type:'success',
            message:SpuParams.value.id?'更新成功':'添加成功'
        })
        $emit('changeSences',{flag:0,params:SpuParams.value.id?'update':'add'})
    }else{
        ElMessage({
            type:'error',
            message:SpuParams.value.id?'更新失败':'添加失败'
        })
    }
}
//添加spu初始化
const initAddSpu= async (C3id:number|string)=>{
    Object.assign(SpuParams.value, {
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  //清空照片
  imgList.value = []
  //清空销售属性
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
    SpuParams.value.category3Id=C3id
    let res: AllTradeMark = await reqAllTradeMark()
    let res1: HasSaleAttrResponseData = await reqAllSaleAttr()
    AllTradeMark.value=res.data
    allSaleAttr.value=res1.data
}
defineExpose({ initHasSpuData ,initAddSpu})
</script>

<style scoped></style>