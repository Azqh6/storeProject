<template>
    <el-card style="height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="用户名">
                <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" :disabled="keyword?false:true" @click="search">搜索</el-button>
                <el-button type="primary" size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
        <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
        <el-button type="primary" size="default" :disabled="selectIdArr.length>0?false:true" @click="deleteSelectUser">批量删除</el-button>
        <el-table border @selection-change="selectChange " style="margin:10px 0px" :data="userArr">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="cneter" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作"  align="center" width="300px">
                <template #="{row,$index}">
                    <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
                    <el-button type="primary" size="small" icon="Delete" @click="deleteUser(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :page-sizes="[5,7,9,11]"
            :background="true"
            layout=" prev, pager, next, jumper,->,total, sizes"
            :total="total"
            @current-change="getHasUser"
            @size-change="handler"
    />
    </el-card>
     <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题:将来文字内容应该动态的 -->
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 身体部分 -->
    <template #default>
      <el-form :model="userParams" ref="formRef" :rules="rules">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请您输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请您输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>

   <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
   <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            @change="handleCheckAllChange"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
          >
            全选
          </el-checkbox>
          <!-- 显示职位的的复选框 -->
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref,onMounted,reactive,nextTick } from 'vue';
import { reqUserInfo ,reqAddOrUpdateUser,reqAllRole,reqSetUserRole, reqRemoveUser, reqSelectUser} from '@/api/acl/user';
import type {UserResponseData,Records,User,AllRole,SetRoleData} from '@/api/acl/user/type'
import { ElMessage, rowContextKey } from 'element-plus';
import useLayOutSettingStore from '@/store/modules/settings'
let pageNo=ref<number>(1)
let pageSize=ref<number>(5)
let total=ref<number>(1)
let userArr=ref<Records>([])
let drawer=ref<boolean>(false)
let userParams=reactive<User>({
    username:'',
    name:'',
    password:''
})
let formRef=ref<any>()
let drawer1=ref<boolean>(false)
let allRole=ref<AllRole>([])
let userRole=ref<AllRole>([])
let selectIdArr=ref<User[]>([])
let keyword=ref<string>('')
let userStore=useLayOutSettingStore()
onMounted(()=>{
    getHasUser()
})
//获取全部已有的用户信息
const getHasUser=async (pager=1)=>{
    pageNo.value=pager
    let res:UserResponseData=await reqUserInfo(pageNo.value,pageSize.value,keyword.value)
    if(res.code==200){
        total.value=res.data.total
        userArr.value=res.data.records
    }
    
}
const handler=()=>{
    getHasUser()
}
//添加用户
const addUser=()=>{
    drawer.value=true
    Object.assign(userParams,{
        id:0,
        username:'',
        name:'',
        password:''
    })
    nextTick(()=>{
      formRef.value.clearValidate('username')
      formRef.value.clearValidate('name')
      formRef.value.clearValidate('password')
    })
}
//编辑用户
const updateUser=(row:User)=>{
    drawer.value=true
    Object.assign(userParams,row)
    nextTick(()=>{
      formRef.value.clearValidate('username')
      formRef.value.clearValidate('name')
    
    })
}
//保存
const save=async()=>{
  await formRef.value.validate()
   let res=await reqAddOrUpdateUser(userParams)
   if(res.code==200){
    drawer.value=false
    ElMessage({
        type:'success',
        message:userParams.id?'更新成功':'添加成功'
    })
    getHasUser(userParams.id?pageNo.value:1)
    window.location.reload()
   }else{
    ElMessage({
        type:'error',
        message:userParams.id?'更新失败':'添加失败'
    })
   }
}
//取消
const cancel=()=>{
    drawer.value=false
}
//校验用户名字回调函数
//@ts-ignore
const validatorUsername = (rules:any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//校验用户名字回调函数
//@ts-ignore
const validatorname = (rules:any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
//@ts-ignore
const validatorPassword = (rules:any,value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验的规则对象
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
//分配角色
const setRole=async(row:User)=>{
  drawer1.value=true
  Object.assign(userParams,row)
  let res:any=await reqAllRole((userParams.id as number))
  if(res.code==200){
    allRole.value=res.data.allRolesList
    userRole.value=res.data.assignRoles
    drawer1.value=true
  }
}
const checkAll=ref<boolean>(false)
const isIndeterminate=ref<boolean>(true)
const handleCheckAllChange=(val:boolean)=>{
 userRole.value= val?allRole.value:[]
 isIndeterminate.value=false
}
const handleCheckedCitiesChange=(value:string[])=>{
  checkAll.value=value.length===allRole.value.length
}
const confirmClick=async()=>{
  let data:SetRoleData={
    userId:(userParams.id as number),
    roleIdList:userRole.value.map(item=>{
      return (item.id as number)
    })
  }
let res= await reqSetUserRole(data)
if(res.code==200){
  ElMessage({
    type:'success',
    message:'分配职务成功'
  })
  drawer1.value=false
  getHasUser(pageNo.value)
}
}
//删除
const deleteUser=async (userId:number)=>{
    let res:any=await reqRemoveUser(userId)
    if(res.code==200){
      ElMessage({type:'success',message:'删除成功'})
      getHasUser(userArr.value.length>1?pageNo.value:pageNo.value-1)
    }
}
//批量删除
const selectChange=async (value:any)=>{
  selectIdArr.value=value
}
const deleteSelectUser=async()=>{
  let idsList:any=selectIdArr.value.map(item=>{
    return item.id
  })
 let res:any= await reqSelectUser(idsList)
 if(res.code==200){
      ElMessage({type:'success',message:'删除成功'})
      getHasUser(userArr.value.length>1?pageNo.value:pageNo.value-1)
    }
}
//搜索
const search=()=>{
  getHasUser()
  keyword.value=''
}
//重置
const reset=()=>{
  userStore.refresh=!userStore.refresh
}
</script>

<style scoped>
.form{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>