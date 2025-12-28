// 添加必要的导入
import { useMessageStore } from '../stores/Message'

// 创建连接
let socketTask = null
let heartbeatTimer = null
let reconnectTimer = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5 // 最大重连次数
const HEARTBEAT_INTERVAL = 60000 * 5 // 5分钟心跳

// 用户ID（应该从登录信息获取）
let currentUserId = null

// 消息处理器集合
const messageHandlers = {
  message: null, // 普通消息处理器
  notification: null, // 通知处理器
  error: null, // 错误处理器
  heartbeat: null // 心跳响应处理器
}

// 初始化WebSocket
function initWebSocket(userId) {
  if (userId === 0) {
    return
  }
  if (!userId) {
    console.error('初始化WebSocket需要userId')
    return
  }
  currentUserId = userId
  // 如果已有连接，先关闭
  if (socketTask) {
    closeWebSocket()
  }
  // 清除重连定时器
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  connectWebSocket()
}

// 创建连接
function connectWebSocket() {
  // 构建带userId的WebSocket URL
  const url = `ws://116.62.187.21:8080/ws/chat?userId=${currentUserId}`
  // 测试使用
  const headers = {
    Authorization: 'hth'
  }

  // 创建 WebSocket 连接
  socketTask = uni.connectSocket({
    url: url,
    header: headers,
    success: () => {},
    fail: err => {
      console.error('连接创建失败:', err)
      handleReconnect()
    }
  })

  // 监听 WebSocket 连接打开事件
  socketTask.onOpen(res => {
    reconnectAttempts = 0 // 重置重连次数

    // 启动心跳
    startHeartbeat()
  })

  // 监听 WebSocket 接收到服务器的消息事件
  socketTask.onMessage(res => {
    try {
      const data = JSON.parse(res.data)
      handleWebSocketMessage(data)
    } catch (error) {
      console.error('解析WebSocket消息失败:', error)
    }
  })

  // 监听 WebSocket 错误事件
  socketTask.onError(err => {
    console.error('WebSocket错误:', err)
    uni.showToast({
      title: '连接错误',
      icon: 'error'
    })
    handleReconnect()
  })

  // 监听 WebSocket 连接关闭事件
  socketTask.onClose(res => {
    console.log('WebSocket连接已关闭:', res)
    stopHeartbeat()

    if (res.code !== 1000) {
      // 非正常关闭，尝试重连
      handleReconnect()
    }
  })
}

// 发送私聊消息
function sendPrivateMessage(message) {
  sendWebSocketMessage(message)
}

// 发送消息
function sendWebSocketMessage(message) {
  if (socketTask && socketTask.readyState === 1) {
    // 1 表示 OPEN
    socketTask.send({
      data: JSON.stringify(message),
      success: () => {},
      fail: err => {
        console.error('消息发送失败:', err)
        // 发送失败时可以考虑重试
        if (message.type === 'private') {
          // 可以存储到本地，稍后重试
          saveOfflineMessage(message)
        }
      }
    })
  } else {
    // 如果是重要消息，存储到离线队列
    if (message.type === 'private') {
      saveOfflineMessage(message)
    }

    // 尝试重新连接
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      handleReconnect()
    } else {
      uni.showToast({
        title: '未连接服务器',
        icon: 'none'
      })
    }
  }
}

// 处理接收到的消息
function handleWebSocketMessage(data) {
  // 在这里输出接收到的消息到控制台
  console.log('接收到WebSocket消息:', data)

  // 首先调用特定类型的处理器
  if (data.type && messageHandlers[data.type]) {
    try {
      // 执行注册的处理器
      const shouldContinue = messageHandlers[data.type](data)
      // 如果处理器返回 false，跳过默认处理
      if (shouldContinue === false) {
        return
      }
    } catch (error) {
      console.error('执行消息处理器失败:', error)
    }
  }

  // 默认处理逻辑
  switch (data.type) {
    case 'message':
      // 私聊消息
      try {
        const messageStore = useMessageStore()
        // 添加新消息到消息列表
        messageStore.chatHistoryList.push(data.data)
      } catch (error) {
        console.error('处理消息store失败:', error)
      }
      break

    case 'notification':
      // 处理通知
      showNotification(data.msg)
      break

    case 'heartbeat':
      // 心跳响应处理
      if (messageHandlers.heartbeat) {
        messageHandlers.heartbeat(data)
      }
      break

    case 'error':
      // 存储错误信息
      console.error('收到错误消息:', data)
      if (messageHandlers.error) {
        messageHandlers.error(data)
      }

      if (data.code === 401) {
        // 认证失败，重新登录
        handleAuthError()
      }
      break

    default:
      console.warn('未知消息类型:', data.type)
  }
}

// 添加消息处理器
function addMessageHandler(type, handler) {
  if (typeof handler === 'function') {
    messageHandlers[type] = handler
  } else {
    console.error('消息处理器必须是函数类型')
  }
}

// 移除消息处理器
function removeMessageHandler(type) {
  if (messageHandlers[type]) {
    delete messageHandlers[type]
  }
}

// 启动心跳
function startHeartbeat() {
  stopHeartbeat() // 先停止已有的心跳

  // 每隔5分钟发送心跳
  heartbeatTimer = setInterval(() => {
    if (socketTask && socketTask.readyState === 1) {
      sendWebSocketMessage({
        type: 'heartbeat',
        content: 'heartbeat'
      })
    } else {
      console.log('WebSocket未连接，跳过发送心跳')
    }
  }, HEARTBEAT_INTERVAL)
}

// 停止心跳
function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

// 处理重连
function handleReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    uni.showToast({
      title: '连接失败，请检查网络',
      icon: 'none'
    })
    return
  }

  // 指数退避策略
  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
  reconnectAttempts++
  console.log(`尝试重连，第${reconnectAttempts}次，延迟${delay}ms`)
  reconnectTimer = setTimeout(() => {
    if (currentUserId) {
      connectWebSocket()
    }
  }, delay)
}

// 处理认证错误
function handleAuthError() {
  uni.showModal({
    title: '提示',
    content: '登录已过期，请重新登录',
    showCancel: false,
    success: () => {
      // 跳转到登录页面
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  })
}

// 保存离线消息（简化实现）
function saveOfflineMessage(message) {
  try {
    const offlineMessages = uni.getStorageSync('offlineMessages') || []
    offlineMessages.push({
      message: message,
      timestamp: Date.now()
    })
    uni.setStorageSync('offlineMessages', offlineMessages)
    console.log('已保存离线消息:', message)
  } catch (error) {
    console.error('保存离线消息失败:', error)
  }
}

// 重发离线消息
function resendOfflineMessages() {
  try {
    const offlineMessages = uni.getStorageSync('offlineMessages') || []
    if (offlineMessages.length > 0 && socketTask && socketTask.readyState === 1) {
      // 按时间顺序发送离线消息
      offlineMessages.forEach((item, index) => {
        setTimeout(() => {
          sendWebSocketMessage(item.message)
          console.log('重发离线消息:', item.message)
        }, 100 * index) // 错开发送时间避免冲突
      })

      // 清空离线消息
      uni.removeStorageSync('offlineMessages')
    }
  } catch (error) {
    console.error('重发离线消息失败:', error)
  }
}

// 显示通知
function showNotification(content) {
  uni.showToast({
    title: content,
    icon: 'none',
    duration: 3000
  })
}

// 关闭连接
function closeWebSocket() {
  if (socketTask) {
    stopHeartbeat()

    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    socketTask.close({
      code: 1000,
      reason: '用户主动关闭',
      success: () => {
        console.log('连接已成功关闭')
      },
      fail: err => {
        console.error('连接关闭失败:', err)
      }
    })

    socketTask = null
  }
}

// 检查连接状态
function isConnected() {
  return socketTask && socketTask.readyState === 1
}

// 获取当前用户ID
function getCurrentUserId() {
  return currentUserId
}

// 获取最后一条错误信息
function getError() {
  return messageHandlers.error
}

// 清除错误信息
function clearError() {
  messageHandlers.error = null
}

// 导出 WebSocket 相关方法
export default {
  initWebSocket,
  connectWebSocket,
  sendPrivateMessage,
  handleWebSocketMessage,
  addMessageHandler,
  removeMessageHandler,
  closeWebSocket,
  isConnected,
  getCurrentUserId,
  resendOfflineMessages,
  getError,
  clearError,
  getSocket: () => socketTask
}
