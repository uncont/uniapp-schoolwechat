import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  getFollowPosts,
  getHomePostsList,
  getClickPosts,
  getCategories,
  getClickCategoriesOfPosts
} from '@/api/posts'

const userStore = useUserStore()
const { userId } = storeToRefs(userStore)

export const usePostsStore = defineStore('posts', () => {
  // 首页推荐动态列表
  const recommendPostList = ref([])
  // 关注动态列表
  const FollowPostsList = ref([])
  // 动态分类列表
  const postsCategories = ref([])

  /**
   * 获取推荐动态
   * @param {Object} data 分页参数 {pageNum:'1', pageSize:'10'}
   * @returns
   */
  const getRecommendPost = async data => {
    const params = {
      pageNum: data?.pageNum || '1',
      pageSize: data?.pageSize || '10'
    }
    const result = await getHomePostsList(params)
    recommendPostList.value = result
    return recommendPostList.value
  }

  /**
   * 获取动态分类列表
   * @param {*} data 分页参数 {pageNum:'1', pageSize:'10'}
   * @returns
   */
  const getPostCategories = async data => {
    const param = {
      pageNum: data.pageNum,
      pageSize: data.pageSize
    }
    const result = await getCategories(param)
    postsCategories.value = result
    return postsCategories.value
  }
  /**
   * 获取用户点击的分类下的文章列表
   * @param {*} data { pageNum:'1', pageSize:'10',categoriesId:'1',userId;'1' }
   * @returns
   */
  const getCategoriesOfPosts = async data => {
    const param = {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      categoriesId: data.categoriesId,
      userId: userId.value
    }
    const result = await getClickCategoriesOfPosts(param)
    return result
  }
  /**
   *获取动态完整数据
   * @param {*} data 动态id { postsId:'3' }
   * @returns
   */
  const getPostsInfo = async data => {
    const params = {
      userId: userId.value,
      postsId: data.postsId
    }

    const result = await getClickPosts(params)

    return result
  }
  /**
   * 获取用户关注文章
   * @param {*} data
   * @returns
   */
  const fetchFollowPosts = async data => {
    const params = {
      userId: data.userId,
      pageNum: data.pageNum,
      pageSize: data.pageSize
    }
    const result = await getFollowPosts(params)

    FollowPostsList.value = result
    return FollowPostsList.value
  }

  return {
    FollowPostsList,
    fetchFollowPosts,
    recommendPostList,
    getRecommendPost,
    getPostsInfo,
    postsCategories,
    getPostCategories,
    getCategoriesOfPosts
  }
})
