<template>
  <view class="loading">
    <CustomNavbar>
      <template>
        <wd-text text="正在加载..." color="#333"></wd-text>
      </template>
    </CustomNavbar>
    <wd-status-tip tip="正在加载动态数据">
      <template #image>
        <wd-loading type="outline" />
      </template>
    </wd-status-tip>
  </view>
</template>

<script setup>
import CustomNavbar from './CustomNavbar.vue'
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>