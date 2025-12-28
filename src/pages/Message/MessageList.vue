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
      <!-- 消息列表 -->
      <view class="message-list">
        <!-- 消息卡片 -->
        <wd-card
          type="rectangle"
          custom-class="message-card"
          v-for="(value, index) in messageList"
          :key="index"
        >
          <view class="message-info" @click="pushMessageInfo(value)">
            <!-- 用户头像 -->
            <view class="left">
              <wd-img :width="40" :height="40" round :src="value.followingAvatar" />
            </view>
            <!-- 用户信息 -->
            <view class="middle">
              <wd-text :text="value.followingName" color="#000" blod />
              <view class="ellipsis-text">
                <wd-text :text="value.lastMessageContent" color="#333" />
              </view>
            </view>
            <!-- 时间，未读数量 -->
            <view class="right">
              <wd-text :text="formatCommentTime(value.lastMessageTime)" color="#333" />
              <wd-badge :modelValue="value.unreadCount" :max="99" custom-class="message-badge" />
            </view>
          </view>
        </wd-card>
      </view>
      <!-- 安全间隔 -->
      <wd-gap safe-area-bottom height="100"></wd-gap>
    </scroll-view>

    <CustomTabbar />
  </view>
</template>
<script setup>
import CustomTabbar from '@/components/CustomTabbar.vue'
import { ref, onMounted, computed } from 'vue'
import { useMessageStore } from '@/stores/Message'
import { formatCommentTime } from '@/utils/comments.js'

// 获取用户信息列表
const messageStore = useMessageStore()

// 私信用户列表
const messageList = computed(() => messageStore.messageList)

// 下拉刷新相关
const isRefreshing = ref(false)

// 下拉刷新处理函数
const onRefresh = async () => {
  isRefreshing.value = true
  await messageStore.fetchMessageList()
  isRefreshing.value = false
}

// 跳转聊天信息页
function pushMessageInfo(value) {
  uni.setStorageSync('followingAvatar', value.followingAvatar)
  uni.navigateTo({
    url: `/pages/Message/page/MessageInfo?followingId=${value.followingId}`
  })
}

// 在组件挂载前执行
onMounted(async () => {
  //获取消息列表
  await messageStore.fetchMessageList()
})
</script>
<style lang="scss" scoped>
// 消息滚动区域样式
.message-scroll {
  flex: 1;
  overflow: hidden;
}

// 消息列表样式
.message-list {
  min-height: 100%;

  // 消息卡片样式
  :deep(.message-card) {
    margin-bottom: 0;
  }

  // 卡片内容区域样式
  :deep(.wd-card__content) {
    padding: 0 !important;
  }

  // 消息信息区域样式（包含头像、用户信息和时间）
  .message-info {
    display: flex;
    padding: var(--wot-card-rectangle-content-padding, 16px 0);

    // 左侧头像区域样式
    .left {
      flex-shrink: 0;
      margin-right: 20rpx;
    }

    // 中间用户信息区域样式
    .middle {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    // 右侧时间/未读数区域样式
    .right {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-left: 20rpx;

      // 消息徽章样式
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

// 文本溢出省略样式
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
