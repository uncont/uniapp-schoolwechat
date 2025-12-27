<template>
  <wd-toast />
  <wd-form ref="form" :model="content" :errorType="errorType">
    <wd-cell-group border>
      <wd-textarea
        size="large"
        :maxlength="120"
        show-word-limit
        clearable
        prop="text"
        v-model="content.text"
        placeholder="请填写动态内容"
        :rules="[{ required: true, message: '请输入动态内容' }]"
      />
      <wd-upload
        v-model:file-list="content.image"
        multiple
        image-mode="aspectFill"
        :before-upload="beforeUpload"
        :auto-upload="false"
        :limit="9"
      >
      </wd-upload>
    </wd-cell-group>
    <view class="footer">
      <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
    </view>
  </wd-form>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useToast } from 'wot-design-uni'
const { success: showSuccess, warning: showWarning } = useToast()
const errorType = ref('toast')
const content = reactive({
  text: '',
  image: []
})

const form = ref()

// 阻止自动上传，并处理文件数据
function beforeUpload(fileObj) {
  // 检查是否有文件数据
  if (fileObj && fileObj.files && fileObj.files.length > 0) {
    // 手动将文件添加到 content.image 数组中
    const newFiles = fileObj.files.map(file => ({
      uid: Date.now() + Math.random(), // 生成唯一ID
      name: file.path.split('/').pop(), // 从路径中提取文件名
      status: 'ready', // 状态设置为准备上传
      url: file.path,
      thumb: file.thumb // 保留thumb属性用于预览
    }))

    // 添加到现有的文件列表中
    content.image = [...content.image, ...newFiles]
  }

  // 返回false阻止自动上传
  return false
}

// 处理表单提交
function handleSubmit() {
  form.value
    .validate()
    .then(async ({ valid }) => {
      if (valid) {
        console.log('表单数据:', content)
      }
    })
    .catch(error => {
      console.log(error, 'error')
    })
}
</script>
<style scoped>
.preview-image {
  width: 100%;
  height: 100%;
}
</style>
