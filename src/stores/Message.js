import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { getAllUnreadCount, getChatHistory, getMessageList } from '../api/privateMessage'
import { useUserStore } from './user'
import websocket from '@/utils/websocket'

export const useMessageStore = defineStore('message', () => {
  // 私信用户列表
  const messageList = ref([])
  // 聊天记录列表
  const chatHistoryList = ref([])
  // 获得总未读信息数
  const totalUnreadCount = ref(0)

  // 按时间分组的消息
  const messageGroups = computed(() => {
    // 对消息按时间排序，确保最新消息在最后
    const sortedMessages = [...chatHistoryList.value].sort((a, b) => {
      // 确保sendTime存在，如果不存在则使用当前时间
      // 修复iOS兼容性问题：将日期字符串格式转换为iOS支持的格式
      const timeA = a.sendTime ? new Date(a.sendTime.replace(/-/g, '/')).getTime() : Date.now()
      const timeB = b.sendTime ? new Date(b.sendTime.replace(/-/g, '/')).getTime() : Date.now()
      return timeA - timeB
    })

    if (sortedMessages.length === 0) return []

    const groups = []
    let currentGroup = {
      time: sortedMessages[0].sendTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
      messages: [sortedMessages[0]],
      showTimeTip: true // 第一组总是显示时间
    }

    const TIME_THRESHOLD = 5 * 60 * 1000 // 5分钟内消息不显示时间提示

    for (let i = 1; i < sortedMessages.length; i++) {
      const prevMessage = sortedMessages[i - 1]
      const currentMessage = sortedMessages[i]

      const prevTime = prevMessage.sendTime ? new Date(prevMessage.sendTime.replace(/-/g, '/')).getTime() : Date.now()
      const currentTime = currentMessage.sendTime
        ? new Date(currentMessage.sendTime.replace(/-/g, '/')).getTime()
        : Date.now()
      const timeDiff = currentTime - prevTime

      if (timeDiff > TIME_THRESHOLD) {
        // 时间间隔超过阈值，结束当前组并开始新组
        groups.push(currentGroup)
        currentGroup = {
          time: currentMessage.sendTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
          messages: [currentMessage],
          showTimeTip: true
        }
      } else {
        // 时间间隔在阈值内，加入当前组
        currentGroup.messages.push(currentMessage)
      }
    }

    // 添加最后一组
    groups.push(currentGroup)

    return groups
  })

  /**
   * 获取私信用户列表
   * @returns
   */
  const fetchMessageList = async () => {
    const userStore = useUserStore()
    const { userId } = storeToRefs(userStore)
    const params = {
      userId: userId.value
    }
    // 调用接口获取用户信息列表
    messageList.value = await getMessageList(params)
    return messageList.value
  }

  /**
   * 获取用户聊天记录
   * @param followingId
   */
  const fetchChatHistoryList = async followingId => {
    const userStore = useUserStore()
    const { userId } = storeToRefs(userStore)
    const params = {
      pageNum: 1,
      pageSize: 10,
      userId: userId.value,
      followingId: followingId
    }
    // 获取聊天记录并按时间排序
    const response = await getChatHistory(params)
    // 按sendTime字段排序，确保最新消息在最后
    // 修复iOS兼容性问题：将日期字符串格式转换为iOS支持的格式
    chatHistoryList.value = response.sort((a, b) => {
      const dateA = new Date(a.sendTime.replace(/-/g, '/'));
      const dateB = new Date(b.sendTime.replace(/-/g, '/'));
      return dateA.getTime() - dateB.getTime();
    })
    return chatHistoryList.value
  }

  /**
   * 获取总未读信息数
   */
  const fetchTotalUnreadCount = async () => {
    const userStore = useUserStore()
    const { userId } = storeToRefs(userStore)
    const params = {
      userId: userId.value
    }
    getAllUnreadCount(params)
      .then(res => {
        totalUnreadCount.value = res
      })
      .catch(error => {
        console.error('获取总未读信息数失败:', error)
      })

    return totalUnreadCount.value
  }

  /**
   * 发送私信消息
   * @param {Object} data - 消息对象，包含以下属性：
   * @param {string} data.content - 消息内容
   * @param {string} data.receiverId - 接收者ID
   */
  const sendPrivateMessage = async data => {
    const userStore = useUserStore()
    const { userId } = storeToRefs(userStore)
    try {
      let message = {
        type: 'text',
        content: data.content,
        senderId: userId.value,
        receiverId: data.receiverId,
        status: 'sending',
        sendTime: new Date().toISOString().slice(0, 19).replace('T', ' ') // 添加当前时间
      }
      websocket.clearError()
      message.status = 'sending'
      chatHistoryList.value.push(message)
      // 重新排序以确保消息按时间顺序 - 修复iOS兼容性问题
      chatHistoryList.value.sort((a, b) => {
        const dateA = new Date(a.sendTime.replace(/-/g, '/'));
        const dateB = new Date(b.sendTime.replace(/-/g, '/'));
        return dateA.getTime() - dateB.getTime();
      })
      await websocket.sendPrivateMessage(message)

      setTimeout(() => {
        const lastError = websocket.getError()
        if (lastError) {
          const error = lastError.data
          chatHistoryList.value.pop()
          uni.showToast({
            title: `发送失败:` + error,
            icon: 'error',
            duration: 3000
          })
          websocket.clearError()
        } else {
          chatHistoryList.value[chatHistoryList.value.length - 1].status = 'sent'
        }
      }, 3000)
    } catch (e) {
      uni.showToast({
        title: '发送消息失败',
        icon: 'error',
        duration: 2000
      })
      console.error('发送消息异常:', e)
    }
  }

  return {
    messageList,
    fetchMessageList,
    chatHistoryList,
    fetchChatHistoryList,
    totalUnreadCount,
    fetchTotalUnreadCount,
    sendPrivateMessage,
    messageGroups
  }
})