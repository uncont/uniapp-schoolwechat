import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  addPost,
  getFollowPosts,
  getHomePostsList,
  getClickPosts,
  getCategories,
  getClickCategoriesOfPosts,
  setPostsLike,
  setComments,
  setCommentsLike
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
   * 
   * @param {*} data {
      title: '标题', 动态标题
      content: '帖子内容',文本内容
      categoryId: 1,分类id
      coverImage: '' 图片内容
    }
   */
  const releasePost = async data => {
    const body = {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      coverImage: data.coverImage
    }
    await addPost(body)
  }
  /**
   * 获取推荐动态
   * @param {Object} data 分页参数 {pageNum:'1', pageSize:'10'}
   * @returns
   */
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
  /**
   * 给动态点赞
   * @param {Object} data data:{postsId: '1',userId:'1'}
   */
  const PostsLike = async data => {
    const body = {
      postsId: data.postsId,
      userId: userId.value
    }
    await setPostsLike(body)
  }
  /**
   *发送评论
   * @param {*} data {
      content: data.content, 评论内容
      postsId: data.postsId, 动态id
      authorId: userId.value, 用户id
      parentId: data.parentId 父级id 若不是回复别人评论则是0
    }
   */
  const PostComments = async data => {
    const body = {
      content: data.content,
      postsId: data.postsId,
      authorId: userId.value,
      parentId: data.parentId
    }
    await setComments(body)
  }

  const commentLike = async data => {
    const body = {
      commentsId: data.commentsId,
      userId: userId.value
    }
    await setCommentsLike(body)
  }

  return {
    releasePost,
    FollowPostsList,
    fetchFollowPosts,
    recommendPostList,
    getRecommendPost,
    getPostsInfo,
    postsCategories,
    getPostCategories,
    getCategoriesOfPosts,
    PostsLike,
    PostComments,
    commentLike
  }
})
