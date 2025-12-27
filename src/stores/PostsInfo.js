import {defineStore, storeToRefs} from 'pinia'
import { ref } from 'vue'
import { getFollowPosts, getHomePostsList } from '@/api/posts'
import {useUserStore} from "./user";

const userStore = useUserStore()
const { userId } = storeToRefs(userStore)
export const usePostsStore = defineStore('posts', () => {
  // 首页推荐帖子列表
  const recommendPostList = ref([])
  // 关注帖子列表
  const FollowPostsList = ref([])

  const getRecommendPost = async data => {
    const params = {
      pageNum: data?.pageNum || '1',
      pageSize: data?.pageSize || '10',
      userId: userId.value
    }
    const result = await getHomePostsList(params)
    recommendPostList.value = result
    return recommendPostList.value
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
    getRecommendPost
  }
})
