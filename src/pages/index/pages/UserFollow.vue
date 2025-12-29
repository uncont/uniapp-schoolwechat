<template>
  <view class="user-follow">
    <ul>
      <li v-for="(posts, index) in postsList" :key="index">
        <PostsCard :posts="posts" @updateLikeStatus="updatePostLikeStatus" />
      </li>
    </ul>
  </view>
  <wd-gap safe-area-bottom height="120rpx"></wd-gap>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import PostsCard from '../components/PostsCard.vue'
import { usePostsStore } from '@/stores/PostsInfo'
const postsStore = usePostsStore()

const postsList = computed(() => {
  return postsStore.FollowPostsList
})

// 处理点赞状态更新
function updatePostLikeStatus({ postsId, isLike, likeCount }) {
  // 找到对应的帖子并更新其点赞状态和数量
  const postIndex = postsStore.FollowPostsList.findIndex(post => post.postsId === postsId)
  if (postIndex !== -1) {
    postsStore.FollowPostsList[postIndex].isLike = isLike
    postsStore.FollowPostsList[postIndex].likeCount = likeCount
  }
}

onMounted(async () => {
  const params = {
    userId: '1',
    pageNum: '1',
    pageSize: '10'
  }
  await postsStore.fetchFollowPosts(params)
})
</script>
