import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { userLogin, fetchUserProfile } from '@/api/user.js'

export const useUserStore = defineStore('user', () => {
  const userName = ref()
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref(uni.getStorageSync('userInfo') || null)

  const isLoggedIn = computed(() => !!token.value)

  // 设置token
  function setToken(nextToken) {
    token.value = nextToken || ''
    if (token.value) {
      uni.setStorageSync('token', token.value)
    } else {
      uni.removeStorageSync('token')
    }
  }
  // 设置用户信息
  function setUserInfo(info) {
    userInfo.value = info || null
    if (userInfo.value) {
      uni.setStorageSync('userInfo', userInfo.value)
    } else {
      uni.removeStorageSync('userInfo')
    }
  }
  // 用户登录
  async function login() {
    const data = await userLogin()
    const receivedToken = data?.token
    const receivedUser = data?.userInfo
    userName.value = data?.username
    if (!receivedToken) {
      console.error('未能从以下数据中提取token:', data)
      throw new Error('登录失败：未获取到token')
    }
    setToken(receivedToken)
    if (receivedUser) {
      setUserInfo(receivedUser)
    } else {
      await fetchUserInfo()
    }
    return true
  }
  // 获取用户信息
  async function fetchUserInfo() {
    if (!token.value) return null
    try {
      const info = await fetchUserProfile(userName.value)
      setUserInfo(info)
      return info
    } catch (err) {
      if (err && err.statusCode === 401) {
        logout()
      }
      throw err
    }
  }
  // 用户登出
  function logout(options = { redirect: false }) {
    setToken('')
    setUserInfo(null)
    if (options.redirect) {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    login,
    fetchUserInfo,
    logout
  }
})
