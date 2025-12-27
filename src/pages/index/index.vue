<template>
  <view class="fixed-bg" />
  <view class="warp">
    <!-- 顶部导航栏 -->
    <view class="nav">
      <wd-navbar placeholder safeAreaInsetTop custom-class="custom-nav">
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
    <view class="content">
      <scroll-view class="scroll-y" scroll-y @scroll="onScroll">
        <wd-tabs v-model="tab" custom-class="index-tab">
          <block>
            <wd-tab title="关注" :lazy="true">
              <UserFollow v-if="loadedTabs.includes(0)" />
            </wd-tab>
          </block>
          <block>
            <wd-tab title="推荐" :lazy="true">
              <IndexPage v-if="loadedTabs.includes(1)" />
            </wd-tab>
          </block>
          <block>
            <wd-tab title="热门校园" :lazy="true">
              <HotTopic v-if="loadedTabs.includes(2)" />
            </wd-tab>
          </block>
        </wd-tabs>
      </scroll-view>
    </view>
    <CustomTabbar></CustomTabbar>
  </view>
</template>

<script setup>
import CustomTabbar from '@/components/CustomTabbar.vue'
import { ref, onMounted, watch } from 'vue'

// 组件导入
import UserFollow from './pages/UserFollow.vue'
import IndexPage from './pages/IndexPage.vue'
import HotTopic from './pages/HotTopic.vue'

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
const keyword = ref('')
const tab = ref(1)
const loadedTabs = ref([1]) // 默认加载推荐页面

// 监听 tab 变化，实现懒加载
watch(tab, newTab => {
  if (!loadedTabs.value.includes(newTab)) {
    loadedTabs.value.push(newTab)
  }
})

// 系统信息相关数据
const menuButtonBounding = ref(null)
const statusBarHeight = ref(0)

onMounted(() => {
  // 仅在微信小程序中获取胶囊按钮位置信息
  menuButtonBounding.value = uni.getMenuButtonBoundingClientRect()

  // #ifdef MP-WEIXIN
  const systemInfo = uni.getWindowInfo()
  statusBarHeight.value = systemInfo.statusBarHeight
  // #endif
})

// 获取与胶囊按钮对齐的样式
function getMenuButtonAlignedStyle() {
  if (menuButtonBounding.value) {
    return {
      height: `${menuButtonBounding.value.height}px`,
      marginTop: `${menuButtonBounding.value.top - statusBarHeight.value}px`
    }
  }
  // 默认样式
  return {
    height: '32px',
    marginTop: '0px'
  }
}

// 滚动事件处理函数
function onScroll(e) {
  // 可以在这里处理滚动相关的逻辑
  // 例如显示返回顶部按钮等
}
</script>

<style scoped lang="scss">
.warp {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
// 导航
.nav {
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
.content {
  flex: 1;
  overflow: hidden;
  .scroll-y {
    height: 100%;
  }
  :deep(.index-tab) {
    background: transparent !important;
    .wd-tabs__nav {
      background: transparent;
    }
  }
}
</style>
