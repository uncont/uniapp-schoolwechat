<template>
  <view class="tabbar">
    <wd-tabbar v-model="tabbar" shape="round" fixed :safeAreaInsetBottom="true" bordered>
      <wd-tabbar-item title="首页" icon="home"></wd-tabbar-item>
      <wd-tabbar-item title="分类" icon="cart"></wd-tabbar-item>
      <wd-tabbar-item title="我的" icon="user"></wd-tabbar-item>
    </wd-tabbar>
  </view>
</template>
<script setup>
import { ref } from 'vue'
const tabbar = ref(1)
</script>
