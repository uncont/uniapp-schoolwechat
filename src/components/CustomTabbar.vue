<template>
  <view class="tabbar">
    <wd-tabbar
      v-model="tabbar"
      shape="round"
      fixed
      :safeAreaInsetBottom="true"
      bordered
      @change="changeTabbar"
    >
      <wd-tabbar-item title="首页" icon="home"></wd-tabbar-item>
      <wd-tabbar-item title="消息" icon="chat" :value="200"></wd-tabbar-item>
      <wd-tabbar-item>
        <template #icon>
          <view class="add">
            <wd-button type="icon" icon="add" custom-class="add-button"></wd-button>
          </view>
        </template>
      </wd-tabbar-item>
      <wd-tabbar-item title="订单" icon="cart"></wd-tabbar-item>
      <wd-tabbar-item title="我的" icon="user"></wd-tabbar-item>
    </wd-tabbar>
  </view>
</template>
<script setup>
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
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
      uni.switchTab({
        url: '/pages/Message/MessageList'
      })

      break
    case 2:
      uni.switchTab({
        url: '/pages/Form/PostsForm'
      })

      break
    case 3:
      console.log(index)

      break
    case 4:
      uni.switchTab({
        url: '/pages/Mine/MineIndex'
      })
      break
    default:
      break
  }
}
</script>
<style scoped lang="scss">
.add {
  :deep(.add-button) {
    background: #4d80f0;
    color: #fff !important;
  }
}
</style>
