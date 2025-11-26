import request from '@/utils/request'

export function getFollowPosts(data) {
  return request({
    url: `/posts/getFollowPosts`,
    method: 'GET',
    needToken: true,
    data: data
  })
}
