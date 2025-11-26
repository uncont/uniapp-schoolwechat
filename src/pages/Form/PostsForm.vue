<template>
  <view class="nav">
    <wd-navbar placeholder safeAreaInsetTop custom-class="custom-nav" title="发布" />
  </view>
  <view class="form">
    <wd-form ref="form" :model="model">
      <wd-cell-group border>
        <wd-input
          label="用户名"
          label-width="100px"
          prop="value1"
          clearable
          v-model="model.value1"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <wd-input
          label="密码"
          label-width="100px"
          prop="value2"
          show-password
          clearable
          v-model="model.value2"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </wd-cell-group>
      <view class="footer">
        <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>
  </view>
  <view class="posts-form">
    <CustomTabbar></CustomTabbar>
  </view>
</template>
<script setup>
import CustomTabbar from '@/components/CustomTabbar.vue'
import { reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
const { success: showSuccess } = useToast()

const model = reactive({
  value1: '',
  value2: ''
})

const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        showSuccess({
          msg: '校验通过'
        })
      }
    })
    .catch(error => {
      console.log(error, 'error')
    })
}
</script>
<style lang="scss" scoped>
.footer {
  padding: 12px;
}
</style>
