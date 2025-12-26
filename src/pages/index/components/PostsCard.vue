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
          <!-- 头像、用户名 -->
          <view class="user">
            <view class="avatar">
              <wd-img :width="36" :height="36" round mode="aspectFill" :src="posts.authorAvatar" />
            </view>
            <view class="userName">
              <wd-text :text="posts.authorName" bold custom-class="custom-text" color="#333" />
            </view>
          </view>
          <!-- 关注按钮 -->
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
          <!-- 点赞 -->
          <wd-button
            custom-class="button"
            classPrefix="iconfont"
            :icon="likeIconName"
            @click="setPostsLike()"
            >{{ likeCountDisplay }}</wd-button
          >
          <!-- 评论 -->
          <wd-button
            custom-class="button"
            classPrefix="iconfont"
            icon="message"
            @click="PushDetail()"
            >{{ posts.commentCount }}</wd-button
          >
          <!-- 收藏 -->
          <wd-button custom-class="button" classPrefix="iconfont" icon="star">{{
            posts.favoriteCount
          }}</wd-button>
        </view>
      </template>
    </wd-card>
    <wd-toast />
  </view>
</template>
<script setup>
import { ref, computed } from 'vue'
import { usePostsStore } from '@/stores/PostsInfo'
import { useToast } from 'wot-design-uni'

// 获取toast实例
const { error: showErrorToast } = useToast()

// 动态仓库
const postsStore = usePostsStore()

const props = defineProps({
  posts: {
    type: Object,
    required: true
  }
})

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')

// 点赞相关状态
const isLiked = computed(() => props.posts?.isLiked || false)

// 计算点赞图标名称
const likeIconName = computed(() => (isLiked.value ? 'fill_good' : 'good'))

// 计算点赞显示数量
const likeCountDisplay = computed(() => {
  if (props.posts.likeCount === undefined) return ''
  let count = props.posts.likeCount
  if (isLiked.value !== props.posts.isLiked) {
    // 如果本地状态与props状态不一致，说明正在乐观更新，需要调整计数
    count = isLiked.value ? count - 1 : count + 1
  }
  return count
})

// 跳转到帖子详情页
function PushDetail() {
  uni.navigateTo({
    url: `/pages/PostDetails/PostDetails?postsId=${props.posts.postsId}`
  })
}

//给动态点赞
async function setPostsLike() {
  if (!props.posts) return

  const data = {
    postsId: props.posts.postsId
  }

  // 本地先更新状态（乐观更新）
  const previousLikeStatus = props.posts.isLiked
  // 通过emit事件通知父组件更新状态
  emit('updateLikeStatus', {
    postsId: props.posts.postsId,
    newLikeStatus: !previousLikeStatus, // 新的点赞状态
    changeCount: previousLikeStatus ? -1 : 1 // 点赞数变化
  })

  try {
    await postsStore.PostsLike(data)
    // 如果后端请求成功，保持当前状态
  } catch (error) {
    console.error('点赞失败:', error)
    // 使用wot-ui的轻提示
    showErrorToast('点赞失败，请重试')
    // 请求失败时，通知父组件回滚状态
    emit('rollbackLikeStatus', {
      postsId: props.posts.postsId,
      originalLikeStatus: previousLikeStatus, // 原始的点赞状态
      changeCount: previousLikeStatus ? 1 : -1 // 回滚时的计数变化
    })
  }
}

// 定义emit
const emit = defineEmits(['updateLikeStatus', 'rollbackLikeStatus'])

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
  :deep(.button) {
    background: transparent !important;
    color: #0083ff !important;
  }
}
</style>
