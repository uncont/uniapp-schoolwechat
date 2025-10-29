<template>
  <view class="user-follow">
    <ul>
      <li v-for="value in 10" :key="value"><PostsCard /></li>
    </ul>
  </view>
</template>
<script setup>
import PostsCard from '../components/PostsCard.vue'
</script>
