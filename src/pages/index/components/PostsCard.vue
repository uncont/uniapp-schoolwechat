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
import { debounceLike, calculateLikeCount } from '@/utils/like'

// 获取toast实例
const { error: showErrorToast } = useToast()

// 动态仓库
const postsStore = usePostsStore()

// 传输动态数据
const props = defineProps({
  posts: {
    type: Object,
    required: true
  }
})

// 定义 emits
const emit = defineEmits(['updateLikeStatus'])

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')

// 点赞相关状态
const isLiked = ref(false)
isLiked.value = props.posts.isLike

// 计算点赞图标名称
const likeIconName = computed(() => (isLiked.value ? 'fill_good' : 'good'))

// 计算点赞显示数量 -
const likeCountDisplay = computed(() => {
  return calculateLikeCount(props.posts, isLiked.value)
})

// 跳转到帖子详情页
function PushDetail() {
  uni.navigateTo({
    url: `/pages/PostDetails/PostDetails?postsId=${props.posts.postsId}`
  })
}

// 添加节流功能的点赞函数
async function setPostsLike() {
  // 保存初始状态
  const initialStatus = props.posts.isLike
  isLiked.value = !isLiked.value
  try {
    await debounceLike(
      postsStore.PostsLike, // API调用函数
      { postsId: props.posts.postsId }, // API参数
      initialStatus, // 初始状态
      () => isLiked.value, // 更新本地状态的函数
      error => {
        isLiked.value = initialStatus
        showErrorToast('点赞失败，请重试')
      },
      500, // 防抖延迟时间
      `posts_like_${props.posts.postsId}`,
      // 成功回调：通过 emit 通知父组件更新数据
      () => {
        emit('updateLikeStatus', {
          postsId: props.posts.postsId,
          isLike: isLiked.value,
          likeCount: isLiked.value 
            ? (props.posts.likeCount || 0) + 1 
            : Math.max(0, (props.posts.likeCount || 0) - 1)
        })
      }
    )
  } catch (error) {
    // 错误已在工具函数中处理
    console.error('点赞请求失败:', error)
  }
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
  :deep(.button) {
    background: transparent !important;
    color: #0083ff !important;
  }
}
</style>