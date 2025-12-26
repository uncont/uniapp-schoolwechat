<template>
  <view class="user-follow">
    <ul>
      <li v-for="(posts, index) in postsList" :key="index">
        <PostsCard 
          :posts="posts" 
          @updateLikeStatus="handleUpdateLikeStatus"
          @rollbackLikeStatus="handleRollbackLikeStatus"
        />
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
function handleUpdateLikeStatus({ postsId, newLikeStatus, changeCount }) {
  const postIndex = postsStore.FollowPostsList.findIndex(post => post.postsId === postsId);
  if (postIndex !== -1) {
    // 更新帖子的点赞状态
    postsStore.FollowPostsList[postIndex].isLiked = newLikeStatus;
    // 更新点赞数
    if (postsStore.FollowPostsList[postIndex].likeCount !== undefined) {
      postsStore.FollowPostsList[postIndex].likeCount += changeCount;
    }
  }
}

// 处理点赞状态回滚
function handleRollbackLikeStatus({ postsId, originalLikeStatus, changeCount }) {
  const postIndex = postsStore.FollowPostsList.findIndex(post => post.postsId === postsId);
  if (postIndex !== -1) {
    // 恢复帖子的点赞状态
    postsStore.FollowPostsList[postIndex].isLiked = originalLikeStatus;
    // 恢复点赞数
    if (postsStore.FollowPostsList[postIndex].likeCount !== undefined) {
      postsStore.FollowPostsList[postIndex].likeCount += changeCount;
    }
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