import request from '@/utils/request'

/**
 * 用户使用微信登陆
 * @returns
 */
export async function userLogin() {
  const loginRes = await uni.login({
    provider: 'weixin'
  })
  const { code } = loginRes
  return request({
    url: '/login/auth/wechat',
    method: 'POST',
    data: { code },
    needToken: false
  })
}

/**
 * 获取用户信息
 * @param {*} userId
 * @returns
 */
export function fetchUserProfile(userId) {
  return request({
    url: `/users/getUserInfo/${userId}`,
    method: 'GET',
    needToken: true
  })
}
