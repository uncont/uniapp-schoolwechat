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
import { computed, onMounted } from 'vue'
import { useSettingStores } from '../stores/settingStores.js'

const settingStores = useSettingStores()
const tabbar = computed({
  get() {
    return settingStores.tabbarIndex
  },
  set(val) {
    settingStores.setTabbarIndex(val)
  }
})

onMounted(() => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const routePath = current?.route ? `/${current.route}` : ''
  settingStores.setTabbarIndexByRoute(routePath)
})
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
