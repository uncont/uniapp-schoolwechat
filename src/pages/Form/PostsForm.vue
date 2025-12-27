<template>
  <view class="nav">
    <wd-navbar placeholder safeAreaInsetTop custom-class="custom-nav" title="发布" />
    <wd-tabs v-model="tab">
      <block v-for="item in tabs" :key="item">
        <wd-tab :title="`${item}`" :name="item">
          <view v-if="tab == '动态'"> <DynamicForm /> </view>
        </wd-tab>
      </block>
    </wd-tabs>
  </view>
  <CustomTabbar></CustomTabbar>
</template>
<script setup>
import CustomTabbar from '@/components/CustomTabbar.vue'
import DynamicForm from './components/DynamicForm.vue'
import { ref } from 'vue'

// 标签数据
const tabs = ref(['动态', '好物', '租借', '组队', '拼车'])
const tab = ref('动态')
</script>
<style lang="scss" scoped>
.footer {
  padding: 12px;
}
</style>
