// 1. 定义基础URL（通常根据环境变量切换）
const baseURL = 'http://116.62.187.21:8080' // 替换为你的API基础地址

// 2. 定义请求拦截器对象
const requestInterceptor = {
  // invoke 会在请求发起前调用
  invoke(options) {
    // options 即为调用 uni.request 时传入的参数
    // 统一拼接请求URL（如果不是绝对地址）
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }

    // 配置统一请求超时（单位ms）
    options.timeout = options.timeout || 15000

    // 设置统一请求头
    options.header = {
      'Content-Type': 'application/json', // 默认 Content-Type
      'source-client': 'mini-program', // 自定义标识，按需修改
      ...options.header // 合并调用时传入的特定header
    }

    // 自动携带 Token（如果存在）
    const token = uni.getStorageSync('token') // 或其他获取Token的方式
    if (token) {
      options.header.Authorization = `Bearer ${token}`
    }

    // 请求开始，可以显示Loading（可根据需要开启）
    // uni.showLoading({ title: '加载中...', mask: true })

    console.log(`[Request] ${options.method || 'GET'} ${options.url}`, options.data || '')
  },

  // success 会在请求成功返回后调用
  success(res) {
    // 这里可以对成功的响应进行统一处理
    console.log(`[Response] ${res.statusCode} ${res.errMsg || ''}`, res.data)

    // 可以根据后端约定的一致性状态码进行进一步处理
    // 例如，假设你的后端成功状态码为 200，并且业务码在 data.code 中
    if (res.statusCode === 200) {
      // 如果业务逻辑成功，直接返回 data
      // 如果业务逻辑有错误，可以在这里统一 toast 提示并抛出错误
      // if (res.data.code !== 200) {
      //   uni.showToast({ icon: 'none', title: res.data.message || 'Error' })
      //   throw new Error(res.data.message) // 或返回一个 rejected promise
      // }
    }

    // 请求结束，隐藏Loading
    // uni.hideLoading()
  },

  // fail 会在请求失败时调用
  fail(err) {
    console.error('[Request Fail]', err)
    uni.showToast({
      icon: 'none',
      title: '网络请求失败，请检查网络'
    })
    // 隐藏Loading
    // uni.hideLoading()
  },

  // complete 会在请求完成时调用（无论成功失败）
  complete(res) {
    // 常用于执行一些清理工作，如确保Loading关闭
    // uni.hideLoading()
  }
}

// 3. 添加拦截器
uni.addInterceptor('request', requestInterceptor)

// 4. （可选）在需要时移除拦截器
// uni.removeInterceptor('request')
