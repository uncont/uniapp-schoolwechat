<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="navbar-wrapper">
      <wd-navbar custom-class="custom-nav" fixed :bordered="false" placeholder safeAreaInsetTop>
        <template #title>
          <slot>
            <view class="title">
              <wd-text text="消息列表" color="#000" blod />
            </view>
          </slot>
        </template>
      </wd-navbar>
    </view>
    <scroll-view
      class="message-scroll"
      scroll-y
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="message-list">
        <wd-card type="rectangle" custom-class="message-card" v-for="value in 10" :key="value">
          <view class="message-info" @click="pushMessageInfo">
            <view class="left">
              <wd-img :width="40" :height="40" round :src="joy" />
            </view>
            <view class="middle">
              <wd-text text="用户名" color="#000" blod />
              <view class="ellipsis-text">
                <wd-text text="我是一段消息" color="#333" />
              </view>
            </view>
            <view class="right">
              <wd-text text="13:11" color="#333" />
              <wd-badge :modelValue="200" :max="99" custom-class="message-badge" />
            </view>
          </view>
        </wd-card>
      </view>
      <wd-gap safe-area-bottom height="100"></wd-gap>
    </scroll-view>

    <CustomTabbar />
  </view>
</template>
<script setup>
import CustomTabbar from '@/components/CustomTabbar.vue'
import { ref } from 'vue'

const joy = ref(
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.SWWmUtJk_k7PS8U6DyrxQQAAAA?w=209&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1'
)

// 下拉刷新相关
const isRefreshing = ref(false)

// 下拉刷新处理函数
const onRefresh = () => {
  isRefreshing.value = true

  // 模拟刷新数据的操作
  setTimeout(() => {
    isRefreshing.value = false
    // 这里可以添加实际的数据刷新逻辑
    uni.showToast({
      title: '刷新成功',
      icon: 'success'
    })
  }, 1500)
}
// 跳转聊天信息页
function pushMessageInfo() {
  console.log('hello')
  uni.navigateTo({
    url: '/pages/Message/page/MessageInfo'
  })
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar-wrapper {
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.message-scroll {
  flex: 1;
  overflow: hidden;
}

.message-list {
  min-height: 100%;
  :deep(.message-card) {
    margin-bottom: 0;
  }
  :deep(.wd-card__content) {
    padding: 0 !important;
  }
  .message-info {
    display: flex;
    padding: var(--wot-card-rectangle-content-padding, 16px 0);
    .left {
      flex-shrink: 0;
      margin-right: 20rpx;
    }

    .middle {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .right {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-left: 20rpx;
      :deep(.message-badge) {
        position: none;
        .wd-badge__content {
          position: none;
          transform: none;
        }
      }
    }
  }
}

.ellipsis-text {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  :deep(.wd-text) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
