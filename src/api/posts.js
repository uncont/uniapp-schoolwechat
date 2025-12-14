import request from '@/utils/request'

export function getHomePostsList(data) {
  return request({
    url: `/posts/getHomePostsList`,
    method: 'GET',
    needToken: true,
    data: data
  })
}

/**
 *  获取用户关注文章
 * @param {*} data
 * @returns
 */
export function getFollowPosts(data) {
  return request({
    url: `/posts/getFollowPosts`,
    method: 'GET',
    needToken: true,
    data: data
  })
}

/**
 * 发布新帖子
 * @param {Object} data - 帖子数据
 * @returns
 */
export function publishPost(data) {
  return request({
    url: '/posts/add',
    method: 'POST',
    needToken: true,
    data
  })
}
