// 防止重复提交标识
let submitFlag = false

// 定义基础URL
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * 生成请求唯一标识
 * @param {Object} config - 请求配置
 */
function getRequestIdentify(config, key) {
  // 如果没有设置标识则默认生成一个
  if (!config[key]) {
    const url = config.url
    const data = config.data || config.params || {}
    const requestIdentify = `${url}_${JSON.stringify(data)}`
    config[key] = requestIdentify
  }
}

function request(options) {
  return new Promise((resolve, reject) => {
    // 处理URL
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }

    // 配置超时时间
    options.timeout = options.timeout || 15000

    // 设置请求头
    const header = {
      'Content-Type': 'application/json;charset=utf-8',
      'source-client': 'mini-program',
      ...options.header
    }

    // 处理token
    const needToken = options.needToken !== false
    const token = uni.getStorageSync('token')
    if (needToken && token) {
      header.Authorization = `Bearer ${token}`
    } else if (needToken && !token) {
      console.error('Token required but not found in storage')
    }

    // 对POST和PUT请求默认启用防重复提交
    if (!options.hasOwnProperty('preventReSubmit')) {
      if (options.method === 'POST' || options.method === 'PUT') {
        options.preventReSubmit = true
      }
    }

    // 防止重复提交
    if (options.preventReSubmit) {
      getRequestIdentify(options, 'requestKey')
      if (submitFlag) {
        console.warn(`[${options.url}]: ` + '请求正在处理中，请勿重复提交')
        return reject(new Error('数据正在处理，请勿重复提交'))
      } else {
        submitFlag = true
      }
    }

    // 调用uni.request
    uni.request({
      ...options,
      header, // 使用修改后的header
      success(res) {
        // 重置重复提交标识
        if (options.preventReSubmit) {
          submitFlag = false
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 检查业务逻辑是否成功
          if (res.data.code === 200 || res.data.code === 0) {
            // 直接返回实际数据
            resolve(res.data.data)
          } else {
            // 业务逻辑错误处理
            uni.showToast({
              icon: 'none',
              title: res.data.msg || '请求失败'
            })
            reject(new Error(res.data.msg || '请求失败'))
          }
        } else {
          uni.showToast({
            icon: 'none',
            title: '网络请求失败，请检查网络'
          })
          reject(new Error('网络请求失败'))
        }
      },
      fail(err) {
        // 重置重复提交标识
        if (options.preventReSubmit) {
          submitFlag = false
        }

        console.error('[Request Fail]', err)
        uni.showToast({
          icon: 'none',
          title: '网络请求失败，请检查网络'
        })
        reject(err)
      }
    })
  })
}

// 导出request方法供其他模块使用
export default request
