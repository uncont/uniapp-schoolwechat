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
    'message': null,    // 普通消息处理器
    'notification': null, // 通知处理器
    'error': null,       // 错误处理器
    'heartbeat': null    // 心跳响应处理器
}

// 初始化WebSocket
function initWebSocket(userId) {
    if (userId === 0){
        console.log('用户未登录')
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

    console.log('正在连接WebSocket:', url)

    // 创建 WebSocket 连接
    socketTask = uni.connectSocket({
        url: url,
        header: headers,
        success: () => {
            console.log('连接创建成功')
        },
        fail: (err) => {
            console.error('连接创建失败:', err)
            handleReconnect()
        }
    })

    // 监听 WebSocket 连接打开事件
    socketTask.onOpen((res) => {
        console.log('WebSocket 连接已打开')
        reconnectAttempts = 0 // 重置重连次数

        // 启动心跳
        startHeartbeat()
    })

    // 监听 WebSocket 接收到服务器的消息事件
    socketTask.onMessage((res) => {
        console.log('收到服务器内容:', res.data)
        try {
            const data = JSON.parse(res.data)
            handleWebSocketMessage(data)
        } catch (error) {
            console.error('消息解析失败:', error)
        }
    })

    // 监听 WebSocket 错误事件
    socketTask.onError((err) => {
        console.error('WebSocket 错误:', err)
        uni.showToast({
            title: '连接错误',
            icon: 'error'
        })
        handleReconnect()
    })

    // 监听 WebSocket 连接关闭事件
    socketTask.onClose((res) => {
        console.log('WebSocket 连接关闭', res)
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
    if (socketTask && socketTask.readyState === 1) { // 1 表示 OPEN
        socketTask.send({
            data: JSON.stringify(message),
            success: () => {
                console.log('消息发送成功,类型:', message.type)
            },
            fail: (err) => {
                console.error('消息发送失败:', err)
                // 发送失败时可以考虑重试
                if (message.type === 'private') {
                    // 可以存储到本地，稍后重试
                    saveOfflineMessage(message)
                }
            }
        })
    } else {
        console.error('WebSocket 未连接')

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
    console.log('处理消息:', data)

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
            console.error(`${data.type} 消息处理器错误:`, error)
        }
    }

    // 默认处理逻辑
    switch (data.type) {
        case 'message':
            // 私聊消息
            console.log('收到私聊消息:', `来自 ${data.data.senderId}: ${data.data.content}`)
            // 启动聊天记录
            import("../stores/Message").then(({useMessageStore}) => {
                try {
                    const messageStore = useMessageStore()
                    messageStore.chatHistoryList.push(data.data)
                } catch (error) {
                    console.error('无法访问消息store:', error)
                }
            })
            break

        case 'notification':
            // 处理通知
            console.log('收到通知:', data.msg)
            showNotification(data.msg)
            break

        case 'heartbeat':
            // 心跳响应
            console.log('收到心跳响应')
            break

        case 'error':
            // 存储错误信息
            messageHandlers.error = data

            if (data.code === 401) {
                // 认证失败，重新登录
                handleAuthError()
            }
            break

        default:
            console.log('未知消息类型:', data)
    }
}

// 添加消息处理器
function addMessageHandler(type, handler) {
    if (messageHandlers[type]) {
        messageHandlers[type].push(handler)
    }
}

// 移除消息处理器
function removeMessageHandler(type, handler) {
    if (messageHandlers[type]) {
        const index = messageHandlers[type].indexOf(handler)
        if (index > -1) {
            messageHandlers[type].splice(index, 1)
        }
    }
}

// 启动心跳
function startHeartbeat() {
    stopHeartbeat() // 先停止已有的心跳

    // 每隔5分钟发送心跳
    heartbeatTimer = setInterval(() => {
        if (socketTask && socketTask.readyState === 1) {
            sendWebSocketMessage({
                type: 'HEARTBEAT',
                content: 'This is Heartbeat'
            })
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
        console.log('达到最大重连次数，停止重连')
        uni.showToast({
            title: '连接失败，请检查网络',
            icon: 'none'
        })
        return
    }

    // 指数退避策略
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
    reconnectAttempts++

    console.log(`第${reconnectAttempts}次重连，等待${delay}ms`)

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
        console.log('消息已保存到离线队列')
    } catch (error) {
        console.error('保存离线消息失败:', error)
    }
}

// 重发离线消息
function resendOfflineMessages() {
    try {
        const offlineMessages = uni.getStorageSync('offlineMessages') || []
        if (offlineMessages.length > 0 && socketTask && socketTask.readyState === 1) {
            console.log(`尝试重发 ${offlineMessages.length} 条离线消息`)

            // 按时间顺序发送离线消息
            offlineMessages.forEach(item => {
                setTimeout(() => {
                    sendWebSocketMessage(item.message)
                }, 100)
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
                console.log('连接关闭成功')
            },
            fail: (err) => {
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
    initWebSocket,           // 初始化（传入userId）
    connectWebSocket,        // 连接（内部使用）
    sendPrivateMessage,      // 发送私聊消息
    handleWebSocketMessage,  // 处理消息
    addMessageHandler,       // 添加自定义消息处理器
    removeMessageHandler,    // 移除消息处理器
    closeWebSocket,          // 关闭连接
    isConnected,             // 检查是否连接
    getCurrentUserId,        // 获取当前用户ID
    resendOfflineMessages, // 重发离线消息
    getError,                // 获取最后错误信息
    clearError,              // 清除错误信息
    getSocket: () => socketTask
}