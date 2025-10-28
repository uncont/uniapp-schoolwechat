<template>
  <view class="tabbar">
    <wd-tabbar
      v-model="tabbar"
      shape="round"
      fixed
      :safeAreaInsetBottom="true"
      bordered
      placeholder
      @change="changeTabbar"
    >
      <wd-tabbar-item title="首页" icon="home"></wd-tabbar-item>
      <wd-tabbar-item title="消息" icon="chat"></wd-tabbar-item>
      <wd-tabbar-item title="订单" icon="cart"></wd-tabbar-item>
      <wd-tabbar-item title="我的" icon="user"></wd-tabbar-item>
    </wd-tabbar>
  </view>
</template>
<script setup>
import { ref } from 'vue'
const tabbar = ref(0)
function changeTabbar(value) {
  const index = value.value
  switch (index) {
    case 0:
      uni.switchTab({
        url: '/pages/index/index'
      })
      break
    case 1:
      console.log(index)

      break
    case 2:
      console.log(index)

      break
    case 3:
      uni.switchTab({
        url: '/pages/Mine/MineIndex'
      })
      break
    default:
      break
  }
}
</script>
