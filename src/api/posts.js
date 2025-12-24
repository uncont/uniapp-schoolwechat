import request from '@/utils/request'
/**
 * 获取首页推荐动态
 * @param {*} data
 * @returns
 */
export function getHomePostsList(data) {
  return request({
    url: `/posts/getHomePostsList`,
    method: 'GET',
    needToken: true,
    data: data
  })
}
/**
 * 获取文章分类列表
 * @param {*} data
 * @returns
 */
export function getCategories(data) {
  return request({
    url: `/postsCategories/getCategories`,
    method: 'GET',
    needToken: true,
    data: data
  })
}
/**
 *  获取用户关注动态
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
 * 获取动态详细数据
 * @param {*} data
 * @returns
 */
export function getClickPosts(data) {
  return request({
    url: `/posts/getClickPosts`,
    method: 'GET',
    needToken: true,
    data: data
  })
}
