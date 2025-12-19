<template>
  <view class="chat-page">
    <!-- 顶部导航栏 -->
    <view class="navbar-wrapper">
      <wd-navbar
        custom-class="custom-nav"
        fixed
        :bordered="false"
        placeholder
        safeAreaInsetTop
        left-arrow
        @click-left="handleBack"
      >
        <template #title>
          <view class="title">
            <wd-text :text="chatTitle" color="#000" />
          </view>
        </template>
      </wd-navbar>
    </view>

    <!-- 聊天内容 -->
    <scroll-view
      class="chat-scroll"
      scroll-y
      :scroll-into-view="lastMessageId"
      :scroll-with-animation="true"
    >
      <view class="time-tip">
        <wd-text text="下午7:30" color="#999" />
      </view>

      <view
        v-for="item in messages"
        :key="item.id"
        :id="item.id"
        class="message-row"
        :class="item.isSelf ? 'self' : 'other'"
      >
        <!-- 对方头像 -->
        <view v-if="!item.isSelf" class="avatar">
          <wd-img :width="40" :height="40" round :src="friendAvatar" />
        </view>

        <!-- 气泡 -->
        <view class="bubble-wrapper">
          <view class="bubble" :class="item.isSelf ? 'bubble-self' : 'bubble-other'">
            <text class="bubble-text">{{ item.content }}</text>
          </view>
        </view>

        <!-- 自己头像 -->
        <view v-if="item.isSelf" class="avatar">
          <wd-img :width="40" :height="40" round :src="selfAvatar" />
        </view>
      </view>

      <!-- 预留底部安全区，避免被输入框遮挡 -->
      <wd-gap safe-area-bottom height="120" />
    </scroll-view>

    <!-- 底部输入区 -->
    <view class="input-bar" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="input-inner">
        <wd-input
          v-model="newMessage"
          placeholder="发送消息..."
          clearable
          :border="false"
          confirm-type="send"
          @confirm="handleSend"
        />
      </view>
      <wd-button
        type="success"
        size="small"
        custom-class="send-btn"
        :disabled="!newMessage.trim()"
        @click="handleSend"
      >
        发送
      </wd-button>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

// 模拟头像
const friendAvatar = ref(
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.SWWmUtJk_k7PS8U6DyrxQQAAAA?w=211&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1'
)
const selfAvatar = ref(
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.z8hLJ-r4jBsa1dYRotjnYgAAAA?w=205&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1'
)

// 聊天标题（可以根据路由参数动态传入）
const chatTitle = ref('小明')

// 聊天记录
const messages = reactive([
  {
    id: 'msg-1',
    isSelf: false,
    content: '你好！今天晚上有空一起吃饭吗？'
  },
  {
    id: 'msg-2',
    isSelf: true,
    content: '可以啊，几点见？'
  }
])

const newMessage = ref('')

// 让滚动视图始终滚到底部
const lastMessageId = computed(() => (messages.length ? messages[messages.length - 1].id : ''))

// 底部安全距离（微信小程序里可以用 getSystemInfo 获取，这里简单写死一个）
const safeBottom = ref(10)

const handleBack = () => {
  uni.navigateBack()
}

const handleSend = () => {
  const text = newMessage.value.trim()
  if (!text) return

  messages.push({
    id: `msg-${Date.now()}`,
    isSelf: true,
    content: text
  })

  newMessage.value = ''
}
</script>

<style lang="scss" scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.navbar-wrapper {
  background-color: #ededed;
}

.chat-scroll {
  flex: 1;
  padding: 20rpx 24rpx 0;
  box-sizing: border-box;
}

.time-tip {
  text-align: center;
  margin-bottom: 24rpx;
  font-size: 24rpx;
}

.message-row {
  display: flex;
  margin-bottom: 20rpx;
  align-items: flex-end;

  &.other {
    justify-content: flex-start;
  }

  &.self {
    justify-content: flex-end;
  }
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
}

.bubble-wrapper {
  max-width: 70%;
}

.bubble {
  padding: 16rpx 20rpx;
  border-radius: 8px;
  font-size: 28rpx;
  line-height: 1.4;
  word-break: break-word;
}

.bubble-other {
  background-color: #ffffff;
  border-radius: 8px 8px 8px 0;
}

.bubble-self {
  background-color: #a0e75a;
  border-radius: 8px 8px 0 8px;
}

.bubble-text {
  color: #111;
}

.input-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  background-color: #f7f7f7;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.input-inner {
  flex: 1;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  margin-right: 12rpx;

  :deep(.wd-input) {
    width: 100%;
  }
}

.send-btn {
  min-width: 120rpx;
}
</style>
