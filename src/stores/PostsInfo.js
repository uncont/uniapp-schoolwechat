import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFollowPosts } from '@/api/posts'

export const usePostsStore = defineStore('posts', () => {
  const FollowPostsList = ref([])
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
    fetchFollowPosts
  }
})
