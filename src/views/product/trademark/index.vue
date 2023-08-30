<template>
  <div>
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary" size="default" @click="addTrademark">添加品牌</el-button>
      <!-- 表格展示数据 -->
      <el-table style="margin-top: 10px;" border :data="trademarkArr">
        <el-table-column label="序号" align="center" width="80px" type="index"></el-table-column>
        <el-table-column label="品牌名称·">
          <template #="{ row, $index }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="default" icon="Edit" @click="updateTrademark(row)"> </el-button>
            <el-popconfirm :title="`你确定要删除${row.tmName}吗？`" width="250px" icon="Delete"
              @confirm="removeTradeMark(row.id)">
              <template #reference>
                <el-button type="primary" size="default" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="sizeChange" @current-change="getHasTrademark" v-model:current-page="pageNo"
        v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
        layout="prev, pager, next, jumper, ->, sizes,total" :total="total" />
    </el-card>

    <!-- 对话框组件 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称：" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'
import { UploadProps, ElMessage } from 'element-plus';
// 分页当前页数
let pageNo = ref<number>(1)
// 每页显示条数
let limit = ref<number>(3)
let total = ref<number>(0)
//存储已有品牌数据
let trademarkArr = ref<Records>([])
//弹窗
let dialogFormVisible = ref<boolean>(false)
//收集弹窗的品牌表单数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
let formRef = ref()


//获取已有品牌函数
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (res.code == 200) {
    total.value = res.data.total
    trademarkArr.value = res.data.records
    console.log(res);
  }

}
//分页展示几条
const sizeChange = () => {
  pageNo.value = 1
  getHasTrademark()
}
//添加表单
const addTrademark = () => {
  dialogFormVisible.value = true
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}
// 弹窗  
// 取消
const cancel = () => {
  dialogFormVisible.value = false
  trademarkParams.tmName = '',
    trademarkParams.logoUrl = ''
}
//确认
const confirm = async () => {
  await formRef.value.validate()

  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  //添加|修改已有品牌
  if (result.code == 200) {
    //关闭对话框
    dialogFormVisible.value = false
    //弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    //再次发请求获取已有全部的品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    trademarkParams.tmName = '',
      trademarkParams.logoUrl = ''
  } else {
    //添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    //关闭对话框
    dialogFormVisible.value = false
  }
}
//修改
const updateTrademark = (row: TradeMark) => {
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  dialogFormVisible.value = true
  trademarkParams.id = row.id
  trademarkParams.tmName = row.tmName
  trademarkParams.logoUrl = row.logoUrl
  Object.assign(trademarkParams, row)

}
//上传文件
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}
//上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response
) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
// 自定义校验
const validatorTmName = (value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于2位'))
  }
}
const validatorLogoUrl = (value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片上传失败'))
  }
}
//表单验证规则
const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }]
}
//删除
const removeTradeMark = async (id: number) => {
  //点击确定按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    //删除成功提示信息
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    //再次获取已有的品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
onMounted(() => {
  getHasTrademark()
})

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>