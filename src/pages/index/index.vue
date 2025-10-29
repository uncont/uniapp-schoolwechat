<template>
  <view class="fixed-bg" />
  <view class="warp">
    <!-- 顶部导航栏 -->
    <view class="nav">
      <wd-navbar
        placeholder
        safeAreaInsetTop
        custom-class="custom-nav"
        :style="{ paddingTop: statusBarHeight + 'px' }"
      >
        <!-- 用户头像 -->
        <template #left>
          <view class="avatar">
            <wd-img :width="36" :height="36" :round="true" :src="joy" />
          </view>
        </template>
        <!-- 搜索框 -->
        <template #title>
          <view class="search-box" :style="getMenuButtonAlignedStyle()">
            <wd-search
              v-model="keyword"
              hide-cancel
              placeholder-left
              custom-class="nav-search"
            ></wd-search>
          </view>
        </template>
      </wd-navbar>
    </view>
    <wd-tabs v-model="tab" custom-class="index-tab" swipeable>
      <block>
        <wd-tab title="关注">
          <view> <UserFollow /></view>
        </wd-tab>
      </block>
      <block>
        <wd-tab title="推荐">
          <IndexPage />
        </wd-tab>
      </block>
      <block>
        <wd-tab title="热门校园"> <HotTopic /> </wd-tab>
      </block>
    </wd-tabs>

    <CustomTabbar></CustomTabbar>
  </view>
</template>

<script setup>
import CustomTabbar from '../../components/CustomTabbar.vue'
import IndexPage from './pages/IndexPage.vue'
import HotTopic from './pages/HotTopic.vue'
import UserFollow from './pages/UserFollow.vue'

import { testApi } from '../../api/test'

import { ref, onMounted } from 'vue'

const tab = ref(1)

// 系统信息相关数据
const menuButtonBounding = ref(null)
const statusBarHeight = ref(0)

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')

onMounted(() => {
  testApi()

  // 获取系统信息
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight

  // 仅在微信小程序中获取胶囊按钮位置信息
  // #ifdef MP-WEIXIN
  menuButtonBounding.value = uni.getMenuButtonBoundingClientRect()
  // #endif
})

const keyword = ref('')

// 获取与胶囊按钮对齐的样式
function getMenuButtonAlignedStyle() {
  // #ifdef MP-WEIXIN
  if (menuButtonBounding.value) {
    return {
      height: `${menuButtonBounding.value.height}px`,
      marginTop: `${menuButtonBounding.value.top - statusBarHeight.value}px`
    }
  }
  // #endif

  // 默认样式
  return {
    height: '32px',
    marginTop: '0px'
  }
}
</script>

<style scoped lang="scss">
// 导航
.nav {
  margin-bottom: 10px;
  .avatar {
    margin-left: 20px;
    height: 36px;
    width: 36px;
  }
  :deep(.custom-nav) {
    background: transparent;

    &::after {
      display: none;
    }
  }

  :deep(.nav-search) {
    margin-right: 12px;
    background: transparent;
  }

  .search-box {
    display: flex;
    align-items: center;
  }
}
// 首页分段器
:deep(.index-tab) {
  background: transparent !important;
  .wd-tabs__nav {
    background: transparent;
    margin-bottom: 15px;
  }
}
</style>
