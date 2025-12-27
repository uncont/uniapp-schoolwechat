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
        :on-error="handleUploadError"
        :preview-full="true"
      >
      </wd-upload>
    </wd-cell-group>
    <view class="footer">
      <wd-button type="primary" size="large" @click="handleSubmit" :loading="isSubmitting" block>
        提交
      </wd-button>
    </view>
  </wd-form>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useToast } from 'wot-design-uni'
import { uploadMultipleToOSS } from '@/utils/oss'
import { usePostsStore } from '@/stores/PostsInfo'

// 动态仓库
const postsStore = usePostsStore()
// 解构轻提示
const {
  success: showSuccess,
  warning: showWarning,
  loading: showLoading,
  close: closeToast
} = useToast()
const errorType = ref('toast')
const isSubmitting = ref(false)

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

// 处理上传错误，这里我们不显示错误，因为选择图片时可能触发组件内部错误
function handleUploadError(error, file) {
  console.log('上传组件捕获到错误，但将忽略:', error, file)
  // 不显示错误提示，因为我们使用手动上传
}

// 处理表单提交
async function handleSubmit() {
  if (isSubmitting.value) return

  const validateResult = await form.value.validate().catch(error => {
    console.log(error, 'error')
    return { valid: false }
  })

  if (validateResult?.valid) {
    isSubmitting.value = true

    try {
      showLoading('正在提交...')

      // 如果有图片需要上传，则先上传图片
      let uploadedImageUrls = []
      if (content.image && content.image.length > 0) {
        // 过滤出本地文件（未上传的文件status为'ready'或undefined或临时路径）
        const localFiles = content.image.filter(
          file =>
            !file.url ||
            file.url.startsWith('file://') ||
            file.url.startsWith('wxfile://') ||
            file.url.startsWith('https://tmp/') ||
            file.url.startsWith('http://tmp/')
        )

        if (localFiles.length > 0) {
          // 上传本地文件到OSS
          const uploadFiles = localFiles.map(file => ({
            name: file.name || `image_${Date.now()}.jpg`,
            path: file.url || file.thumb
          }))

          uploadedImageUrls = await uploadMultipleToOSS(uploadFiles)
        }

        // 合并已有的URL和新上传的URL
        const existingUrls = content.image
          .filter(
            file =>
              file.url &&
              !file.url.startsWith('file://') &&
              !file.url.startsWith('wxfile://') &&
              !file.url.startsWith('https://tmp/')
          )
          .map(file => file.url)

        uploadedImageUrls = [...existingUrls, ...uploadedImageUrls]
      }

      // 准备提交数据
      const submitData = {
        title: '默认标题',
        content: content.text,
        coverImage: uploadedImageUrls.length > 0 ? JSON.stringify(uploadedImageUrls) : '', // 将图片URL作为coverImage字段发送
        categoryId: 0 // 如果有分类ID需求，可以根据实际情况调整
      }

      console.log('提交数据:', submitData)

      // 使用postsStore中的releasePost方法发送数据到后端
      await postsStore.releasePost(submitData)
      showSuccess('发布成功')

      // 提交成功后重置表单
      content.text = ''
      content.image = []
    } catch (error) {
      console.error('提交失败:', error)
      showWarning('提交失败')
    } finally {
      closeToast()
      isSubmitting.value = false
    }
  }
}
</script>
<style scoped>
.preview-image {
  width: 100%;
  height: 100%;
}

.footer {
  padding: 20rpx;
}
</style>
