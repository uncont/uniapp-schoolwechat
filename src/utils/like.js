// 全局定时器存储
const likeTimers = {}

/**
 * 点赞功能的防抖封装
 * @param {Function} apiCall - 调用API的函数
 * @param {Object} params - API调用参数
 * @param {Boolean} initialState - 初始点赞状态
 * @param {Function} updateLocalState - 更新本地状态的函数
 * @param {Function} onError - 错误处理回调
 * @param {Number} delay - 防抖延迟时间，默认500ms
 * @param {String} timerId - 定时器唯一标识，默认为'default'
 * @param {Function} onSuccess - 成功后的回调函数，用于更新响应式数据
 * @returns {Promise} API调用结果
 */
export function debounceLike(
  apiCall,
  params,
  initialState,
  updateLocalState,
  onError,
  delay = 500,
  timerId = 'default',
  onSuccess = null
) {
  return new Promise((resolve, reject) => {
    // 清除之前的定时器
    if (likeTimers[timerId]) {
      clearTimeout(likeTimers[timerId])
    }

    // 设置新的定时器
    likeTimers[timerId] = setTimeout(async () => {
      try {
        if (updateLocalState() !== initialState) {
          const result = await apiCall(params)
          
          // 成功后执行更新响应式数据的回调
          if (onSuccess) {
            onSuccess()
          }
          
          resolve(result)
        } else {
          // 状态未变化，不发送请求
          resolve(null)
        }
      } catch (error) {
        if (onError) {
          onError(error)
        }
        reject(error)
      } finally {
        likeTimers[timerId] = null
      }
    }, delay)
  })
}

/**
 * 计算点赞显示数量
 * @param {Object} data - 帖子对象
 * @param {Boolean} isLiked - 当前点赞状态
 * @returns {Number} 显示的点赞数
 */
export function calculateLikeCount(data, isLiked) {
  if (!data) return 0
  let count = data.likeCount
  // 如果当前状态与原始状态不同，则调整显示数量
  if (isLiked && !data.isLike) {
    count = data.likeCount + 1
  } else if (!isLiked && data.isLike) {
    count = data.likeCount - 1
  }

  return count
}