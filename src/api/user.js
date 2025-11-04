import request from '@/utils/request'

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

// 从后端获取用户资料
export function fetchUserProfile(userName) {
  return request({
    url: `/users/getUserInfo/${userName}`,
    method: 'GET',
    needToken: true
  })
}
