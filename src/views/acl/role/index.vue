<template>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索">
          <el-input
            placeholder="请你输入搜索职位关键字"
            v-model="keyword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            :disabled="keyword.length>0?false:true"
            @click="search"
          >
            搜索
          </el-button>
          <el-button type="primary" size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" icon="Plus" @click="addRole">
        添加职位
      </el-button>
      <el-table border style="margin: 10px 0px" :data="allRole">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="职位名称"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建世间"
          align="center"
          show-overflow-tooltip
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          show-overflow-tooltip
          prop="updateTime"
        ></el-table-column>
        <el-table-column label="操作" width="280px" align="center">
          <!-- row:已有的职位对象 -->
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
            @click="setPermisstion(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.roleName}?`"
              width="260px"
             @confirm="remove(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3,5,7,9]"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
    </el-card>
    <!-- 添加职位与更新已有职位的结构:对话框 -->
  <el-dialog
    v-model="dialogVisite"
    :title="RoleParams.id ? '更新职位' : '添加职位'"
  >
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          placeholder="请你输入职位名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisite = false">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
<!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
<el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
  </template>

<script setup lang="ts">
import {ref,onMounted, reactive,nextTick} from 'vue'
import {reqAllRoleList,reqAddOrUpdateRole,reqAllMenuList,reqSetPermisstion,reqRemoveRole } from '@/api/acl/role/index'
import type {RoleResponseData,Records,MenuResponseData} from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/settings'
import { RoleData } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
let pageNo=ref<number>(1)
let pageSize=ref<number>(3)
let keyword=ref<string>('')
let allRole=ref<Records>([])
let total=ref<number>(0)
let useStore=useLayOutSettingStore()
let dialogVisite=ref<boolean>(false)
let RoleParams = reactive<any>({
  roleName: '',
})
let form=ref()
let drawer=ref<boolean>(false)
let menuArr=ref<any>([])
let selectArr=ref<any>([])
let tree=ref<any>()
onMounted(()=>{
    getHasRole()
})
//获取全部role
const getHasRole=async (pager=1)=>{
    pageNo.value=pager
    let res:RoleResponseData=await reqAllRoleList(pageNo.value,pageSize.value,keyword.value)
    if(res.code==200){
        total.value=res.data.total
        allRole.value=res.data.records
    }
}
const sizeChange=()=>{
    getHasRole()
}
//搜索
const search=()=>{
    getHasRole()
    keyword.value=''
}
const reset=()=>{
    useStore.refresh=!useStore.refresh
}
//添加
const addRole=()=>{
    dialogVisite.value=true
    Object.assign(RoleParams,{
        roleName:'',
        id:0
    })
     nextTick(() => {
        form.value.clearValidate('roleName')
     })
}
//更新
const updateRole=(row:RoleData)=>{
    dialogVisite.value=true
    Object.assign(RoleParams,row)
}
//自定义校验规则的回调
//@ts-ignore
const validatorRoleName = (rules:any,value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}
//确定
const save=async()=>{
   await form.value.validate()
   let res=await reqAddOrUpdateRole(RoleParams)
   if(res.code==200){
    ElMessage({
        type:'success',
        message:RoleParams.id?'更新成功':'添加成功'
    })
    dialogVisite.value=false
    getHasRole(RoleParams.id?pageNo.value:1)
   }
}
//分配权限
const defaultProps = {
  children: 'children',
  label: 'name',
}
const setPermisstion=async(row:RoleData)=>{
    drawer.value=true
    Object.assign(RoleParams,row)
  let res:MenuResponseData =await  reqAllMenuList((RoleParams.id as number))
  if(res.code==200){
    menuArr.value=res.data
    selectArr.value=filterSelectArr(menuArr.value,[])
  }

}
const filterSelectArr=(allData:any,initArr:any)=>{
    allData.forEach((item:any)=>{
        if(item.select && item.level==4){
            initArr.push(item.id)
        }
        if(item.children && item.children.length>0){
            filterSelectArr(item.children,initArr)
        }
    })
}
const handler=async ()=>{
    const roleId=(RoleParams.id as number)
    let arr=tree.value.getCheckedKeys()
    let arr1=tree.value.getHalfCheckedKeys()
    let permissionId=arr.concat(arr1)
    let res:any= await reqSetPermisstion(roleId,permissionId)
    if(res.code==200){
    drawer.value=false
    ElMessage({type:'success',message:'分配权限成功'})
    window.location.reload()
}

}
const remove=async(id:number)=>{
    let res:any=await reqRemoveRole(id)
    if(res.code==200){
        ElMessage(
            {
                type:'success',
                message:'删除成功'
            }
        )
        getHasRole(allRole.value.length>1?pageNo.value:pageNo.value-1)
    }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>