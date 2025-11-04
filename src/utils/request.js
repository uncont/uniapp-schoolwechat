// 1. 定义基础URL（通常根据环境变量切换）
const baseURL = import.meta.env.VITE_API_BASE_URL || '默认地址'

// 2. 定义通用请求方法
function request(options) {
  return new Promise((resolve, reject) => {
    // 处理URL
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }

    // 配置超时时间
    options.timeout = options.timeout || 15000

    // 设置请求头
    options.header = {
      'source-client': 'mini-program',
      ...options.header
    }

    // 处理token
    const needToken = options.needToken !== false
    const token = uni.getStorageSync('token')
    if (needToken && token) {
      options.header.Authorization = `Bearer ${token}`
    }

    // 调用uni.request
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 检查业务逻辑是否成功
          if (res.data.code === 200) {
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