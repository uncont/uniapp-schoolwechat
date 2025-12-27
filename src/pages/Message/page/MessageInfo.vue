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
            <wd-text :text="friendData.friendName" color="#000" />
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
        <wd-text :text="friendData.lastMessageTime" color="#999" />
      </view>

      <view
        v-for="(value, index) in messages"
        :key="index"
        :id="index"
        class="message-row"
      >
        <!-- 对方头像 -->
        <view v-if="value.senderId === friendData.friendId" class="avatar">
          <wd-img :width="40" :height="40" round :src="friendData?.friendAvatar ? '':friendAvatar" />
        </view>

        <!-- 气泡 -->
        <view class="bubble-wrapper">
          <view class="bubble" :class="value.messageType ? 'text' : 'other'">
            <text class="bubble-text">{{ value.content }}</text>
          </view>
        </view>

        <!-- 自己头像 -->
        <view v-if="value.receiverId === friendData.friendId" class="avatar">
          <wd-img :width="40" :height="40" round :src="userInfo?.avatarUrl ? '':selfAvatar" />
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
import { computed, ref , onMounted} from 'vue'
import {onLoad} from "@dcloudio/uni-app";
import {useMessageStore} from "../../../stores/Message";
import websocket from '../../../utils/websocket'
import {useUserStore} from "../../../stores/user";

// 启动用户
const userStore = useUserStore()

// 用户信息
const userInfo = ref({})
// 用户id
const userId = ref('')

// 启动聊天记录
const messageStore = useMessageStore()

// 模拟头像
const friendAvatar = ref(
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.SWWmUtJk_k7PS8U6DyrxQQAAAA?w=211&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1'
)
const selfAvatar = ref(
  'https://ts1.tc.mm.bing.net/th/id/OIP-C.z8hLJ-r4jBsa1dYRotjnYgAAAA?w=205&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1'
)
// 聊天对象信息
const friendData = ref({
  // 聊天标题（可以根据路由参数动态传入）
  friendName : '',
  // 聊天对象id
  friendId:'',
  // 聊天对象头像
  friendAvatar:'',
  // 最后聊天记录时间
  lastMessageTime:''
})

// 聊天记录
const messages = ref([])

// 发送信息
const newMessage = ref('')

// 让滚动视图始终滚到底部
const lastMessageId = computed(() => (messages.value.length ? messages.value[messages.value.length - 1].privateMessageId : ''))

// 底部安全距离（微信小程序里可以用 getSystemInfo 获取，这里简单写死一个）
const safeBottom = ref(10)

// 返回按钮点击处理
const handleBack = () => {
  uni.navigateBack()
}

// 发送按钮点击处理
const handleSend = () => {
  // 获取输入框内容
  const text = newMessage.value.trim()
  if (!text) return

  // 获取当前最后一个消息的Id作为父消息Id
  let parentMessageId = getLastMessageId()

  // 判断parentMessageId是否为空，如果为空则报错
  if (parentMessageId === null) {
    uni.showToast({
      title: '获取消息ID失败',
      icon: 'error',
      duration: 2000
    })
    console.error('parentMessageId为空，无法发送消息')
    return // 阻止消息发送
  }

  // 如果parentMessageId为0，则将其设置为null
  if(parentMessageId === 0){
    parentMessageId = null
  }

  // 创建消息对象
  let message = {
    type: 'text',
    content: text,
    senderId: userId.value,
    receiverId: friendData.value.friendId,
    parentMessageId: parentMessageId,
    status: 'sending',
  }

  try {
    // 清空可能的错误信息
    websocket.clearError()

    // 先添加到消息列表中，显示为"发送中"状态
    message.status = 'sending'
    messages.value.push(message)

    // 发送消息
    websocket.sendPrivateMessage(message)

    // 清空输入框
    newMessage.value = ''

    // 设置一个定时器检查是否发送成功
    setTimeout(() => {
      // 检查是否有错误返回
      const lastError = websocket.getError()
      if (lastError) {
        const error = lastError.data
        // 发送失败，删除消息
        messages.value.splice(-1, 1)
        // 提示错误信息，发送失败
        uni.showToast({
          title: `发送失败:` + error,
          icon: 'error',
          duration: 3000
        })
        // 清除错误信息
        websocket.clearError()
      } else {
        // 如果没有错误，更新消息状态为已发送
        messages.value[index].status = 'sent'
      }
    }, 3000) // 3秒后检查发送状态

  } catch (e) {
    uni.showToast({
      title: '发送消息失败',
      icon: 'error',
      duration: 2000
    })
    console.error('发送消息异常:', e)
  }
}

// 获取最后一个消息的ID
const getLastMessageId = () => {
  if (messages.value.length === 0) {
    return 0
  }
  return messages.value[messages.value.length - 1].privateMessageId
}

// 页面加载时获取路由参数
onLoad((options) => {
  const params = JSON.parse(decodeURIComponent(options.params))
  friendData.value.friendId = decodeURIComponent(params.followingId)
  friendData.value.friendAvatar = decodeURIComponent(params.avatar)
  friendData.value.friendName = decodeURIComponent(params.username)
  friendData.value.lastMessageTime = decodeURIComponent(params.lastMessageTime)
})

// 在组件挂载前执行
onMounted(async () =>{
  await messageStore.fetchChatHistoryList(friendData.value.friendId)
  messages.value = messageStore.chatHistoryList
  userInfo.value = userStore.userInfo
  userId.value = userStore.userId
})
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
