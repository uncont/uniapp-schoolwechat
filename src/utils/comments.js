/**
 * 评论列表排序功能
 * @param {Array} comments - 评论列表
 * @param {String} sortType - 排序类型: 'default', 'latest', 'hottest', 'author'
 * @returns {Array} 排序后的评论列表
 */
export function sortComments(comments, sortType) {
  if (!comments || !Array.isArray(comments)) {
    return []
  }

  // 使用副本以避免修改原始数据
  let sortedComments = [...comments]

  switch (sortType) {
    case 'latest': // 按时间排序（最新）
      return sortedComments.sort((a, b) => {
        const dateA = parseDate(a.createdTime)
        const dateB = parseDate(b.createdTime)
        return dateB - dateA
      })
    case 'hottest': // 按点赞量排序（最热）
      return sortedComments.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    case 'author': // 楼主优先（暂时不做处理，返回默认）
    case 'default': // 默认排序，返回原始顺序
    default:
      return sortedComments
  }
}

/**
 * 解析日期字符串，兼容iOS平台
 * @param {String} dateString - 日期字符串
 * @returns {Date} 解析后的Date对象
 */
export function parseDate(dateString) {
  if (!dateString) return new Date(0) // 返回最小日期

  // 检查是否为"yyyy-MM-dd HH:mm:ss"格式
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
    // 转换为"yyyy/MM/dd HH:mm:ss"格式，iOS支持
    dateString = dateString.replace(/-/g, '/')
  }
  // 检查是否为"yyyy-MM-ddTHH:mm:ss"格式
  else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateString)) {
    // 保持原格式，但替换T为空格，然后将-替换为/
    dateString = dateString.replace('T', ' ').replace(/-/g, '/')
  }
  // 检查是否为"yyyy-MM-dd"格式
  else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // 转换为"yyyy/MM/dd"格式，iOS支持
    dateString = dateString.replace(/-/g, '/')
  }

  return new Date(dateString)
}

/**
 * 评论时间格式化函数，兼容iOS平台
 * @param {String|Date} time - 时间字符串或Date对象
 * @returns {String} 格式化后的时间字符串
 */
export function formatCommentTime(time) {
  if (!time) return ''

  // 解析日期
  const date = typeof time === 'string' ? parseDate(time) : time

  // 验证日期是否有效
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', time)
    return ''
  }

  // 计算相对时间
  const now = new Date()
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) {
    return '刚刚'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 30) {
    return `${diffDays}天前`
  } else {
    // 显示具体日期
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
}
