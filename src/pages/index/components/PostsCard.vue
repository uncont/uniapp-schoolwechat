<template>
  <!-- 帖子卡片 -->
  <view class="posts-card">
    <wd-card
      custom-class="custom-card"
      custom-title-class="custom-title"
      custom-content-class="custom-cotent"
    >
      <!-- 帖子头部——展示用户名称，用户头像 -->
      <template #title>
        <view class="title">
          <view class="user">
            <view class="avatar">
              <wd-img :width="36" :height="36" round mode="aspectFill" :src="posts.authorAvatar" />
            </view>
            <view class="userName">
              <wd-text :text="posts.authorName" bold custom-class="custom-text" color="#333" />
            </view>
          </view>
          <view class="Follow">
            <wd-button type="warning" size="small">关注</wd-button>
          </view>
        </view>
      </template>
      <!-- 帖子内容——展示帖子文本内容，图片组 -->
      <template #default>
        <view class="content" @click="PushDetail()">
          <!-- 文本内容 -->
          <view class="text-content">
            <wd-text :text="posts.excerpt" color="#333" />
          </view>
          <!-- 图片组 -->
          <view class="img-content">
            <wd-grid :column="3">
              <wd-grid-item v-for="value in 6" :key="value">
                <view class="image" @click.stop>
                  <wd-img mode="aspectFill" custom-class="img" :src="joy" :enable-preview="true" />
                </view>
              </wd-grid-item>
            </wd-grid>
          </view>
        </view>
      </template>
      <!-- 帖子底部——功能按钮：点赞，评论，收藏 -->
      <template #footer>
        <view class="function-button">
          <wd-button type="text" icon="thumb-up">{{ posts.likeCount }}</wd-button>
          <wd-button type="text" icon="chat1" @click="PushDetail()">{{
            posts.commentCount
          }}</wd-button>
          <wd-button type="text" icon="star">{{ posts.favoriteCount }}</wd-button>
        </view>
      </template>
    </wd-card>
  </view>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  posts: {
    type: Object,
    required: true
  }
})

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
// 跳转到帖子详情页
function PushDetail() {
  uni.navigateTo({
    url: '/pages/PostDetails/PostDetails'
  })
}
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
</script>
<style scoped lang="scss">
//卡片样式
.posts-card {
  :deep(.custom-card) {
    .wd-card__footer {
      padding: 0;
    }
  }
}
// 标题样式
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .user {
    display: flex;
    align-items: center;
    .userName {
      margin-left: 10px;
    }
  }
}
.img-content {
  :deep(.wd-grid-item__content) {
    padding: 0;
  }
}
// 图片样式
.image {
  :deep(.img) {
    box-sizing: border-box;
    padding: 1px;
    width: 100%;
    aspect-ratio: 5/6;
    .wd-img__image {
      border-radius: 6px;
    }
  }
}

// 底部样式
.function-button {
  display: flex;
  justify-content: space-around;
}
</style>
