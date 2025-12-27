<template>
  <view class="user-follow">
    <ul>
      <li v-for="(posts, index) in postsList" :key="index">
        <PostsCard :posts="posts" />
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

onMounted(async () => {
  const params = {
    userId: '1',
    pageNum: '1',
    pageSize: '10'
  }
  await postsStore.fetchFollowPosts(params)
})
</script>
