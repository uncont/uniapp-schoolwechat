<template>
  <view class="chat-page">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <CustomNavbar>
        <template>
          <view class="title">
            <wd-text :text="friendData.friendName" color="#000" />
          </view>
        </template>
      </CustomNavbar>
    </view>

    <!-- 聊天内容区域 -->
    <view class="chat-content">
      <scroll-view
        class="chat-scroll"
        scroll-y
        :scroll-into-view="lastMessageId"
        :scroll-with-animation="false"
      >
        <view v-for="(group, groupIndex) in messageGroups" :key="group.time" class="message-group">
          <!-- 时间提示条 -->
          <view v-if="group.showTimeTip" class="time-tip">
            <wd-text :text="formatCommentTime(group.time)" color="#999" size="12px" />
          </view>

          <!-- 消息列表 -->
          <view
            v-for="(value, index) in group.messages"
            :key="`${groupIndex}-${index}`"
            :id="`msg-${value.privateMessageId || index}`"
            class="message-row"
            :class="value.senderId === Number(userInfo.userId) ? 'self' : 'other'"
          >
            <!-- 对方头像 -->
            <view v-if="value.senderId === Number(friendData.friendId)" class="avatar">
              <wd-img :width="40" :height="40" round :src="friendData.avatar" />
            </view>

            <!-- 气泡 -->
            <view class="bubble-wrapper">
              <view
                class="bubble"
                :class="value.senderId === Number(userInfo.userId) ? 'bubble-self' : 'bubble-other'"
              >
                <text class="bubble-text">{{ value.content }}</text>
              </view>
            </view>

            <!-- 自己头像 -->
            <view class="avatar" v-if="value.senderId === Number(userInfo.userId)">
              <wd-img :width="40" :height="40" round :src="userInfo.avatar" />
            </view>
          </view>
        </view>
        <wd-gap bg-color="#f5f5f5" height="20px"></wd-gap>
      </scroll-view>
    </view>

    <!-- 底部输入区 -->
    <view class="input-bar">
      <wd-tabbar fixed bordered safeAreaInsetBottom placeholder>
        <wd-search
          placeholder-left
          placeholder="发送消息..."
          custom-class="custom-search"
          v-model="newMessage"
        >
          <template #suffix>
            <view class="menu">
              <wd-grid clickable>
                <!-- 发送消息 -->
                <wd-grid-item @itemclick="handleSend" :disabled="isSendDisabled">
                  <wd-icon
                    name="message"
                    class-prefix="iconfont"
                    :color="isSendDisabled ? '#999999' : '#0083ff'"
                  />
                </wd-grid-item>
              </wd-grid>
            </view>
          </template>
        </wd-search>
      </wd-tabbar>
    </view>
  </view>
</template>

<script setup>
import CustomNavbar from '@/components/CustomNavbar'
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useMessageStore } from '@/stores/Message'
import { formatCommentTime } from '@/utils/comments.js'
import { useUserStore } from '@/stores/user'

// 获取用户信息
const { userInfo } = useUserStore()

// 页面加载时获取路由参数
onLoad(options => {
  friendData.value.friendId = options.followingId //好友id
  friendData.value.friendName = options.friendName || '好友' // 好友名称
  friendData.value.avatar = uni.getStorageSync('followingAvatar')
  uni.removeStorageSync('tempMessage')
})

// 启动聊天记录
const messageStore = useMessageStore()

// 按时间分组的消息，直接从store获取
const messageGroups = computed(() => messageStore.messageGroups)

// 聊天对象信息
const friendData = ref({
  // 聊天对象id
  friendId: '',
  friendName: '好友',
  avatar: ''
})

// 滚动到最新消息的ID
const lastMessageId = ref('')

// 发送信息
const newMessage = ref('')

// 返回按钮点击处理
const handleBack = () => {
  uni.navigateBack()
}

const isSendDisabled = computed(() => !newMessage.value.trim())

function handleSend() {
  const text = newMessage.value.trim()
  if (!text) return // 防止空消息发送

  const data = {
    content: text,
    receiverId: friendData.value.friendId
  }
  try {
    console.log('hello')

    // messageStore.sendPrivateMessage(data)
    newMessage.value = ''
    // 发送消息后滚动到底部
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  } catch (e) {
    uni.showToast({
      title: '发送消息失败',
      icon: 'error',
      duration: 2000
    })
    console.error('发送消息异常:', e)
  }
}

// 更新滚动到最新消息的函数
const scrollToBottom = async () => {
  if (messageStore.chatHistoryList.length > 0) {
    const lastMsg = messageStore.chatHistoryList[messageStore.chatHistoryList.length - 1]
    lastMessageId.value = `msg-${lastMsg.privateMessageId || messageStore.chatHistoryList.length - 1}`
    await nextTick()
  }
}

// 监听聊天历史列表的变化，当有新消息时自动滚动到底部
watch(
  () => messageStore.chatHistoryList.length,
  (newLength, oldLength) => {
    // 只有在消息数量增加时才滚动到底部
    if (newLength > oldLength) {
      // 延迟执行滚动，确保DOM已更新
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
)

// 在组件挂载前执行
onMounted(async () => {
  // 获取聊天记录
  await messageStore.fetchChatHistoryList(friendData.value.friendId)

  // 等待DOM更新后滚动到底部
  setTimeout(() => {
    scrollToBottom()
  }, 100)
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

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-scroll {
  flex: 1;
  padding: 20rpx 24rpx 0;
  box-sizing: border-box;
  height: 100%;
  /* 隐藏滚动条 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
}

.time-tip {
  text-align: center;
  margin: 24rpx 0;
  font-size: 24rpx;
}

.message-group {
  margin-bottom: 10rpx;
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

/* 底部发送栏相关样式 */
.input-bar {
  :deep(.custom-search) {
    padding: 0;
    width: 100%;
  }

  :deep(.wd-search__search-left-icon::before) {
    content: '\e71e';
  }
}

/* 菜单网格相关样式 */
.menu {
  width: 40px;
  :deep(.wd-grid-item__text) {
    margin: 0;
  }
}
</style>
