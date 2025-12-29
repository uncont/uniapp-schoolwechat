<template>
  <!-- 动态内容 -->
  <view class="postInfo" v-if="postsInfo">
    <!-- 导航栏 -->
    <view class="navbar">
      <CustomNavbar>
        <template>
          <wd-row custom-class="nav-row">
            <wd-col :span="4" custom-class="nav-col">
              <wd-img :width="36" :height="36" :round="true" :src="joy" />
            </wd-col>
            <wd-col :span="12" :offset="1">
              <view class="userName" custom-class="nav-col">
                <wd-text :text="postsInfo.authorName" color="#333"></wd-text>
                <wd-text :text="postsInfo.createTime" size="12px"></wd-text>
              </view>
            </wd-col>
          </wd-row>
        </template>
      </CustomNavbar>
    </view>
    <view class="content">
      <view class="card">
        <wd-card type="rectangle">
          <template #default>
            <wd-text :text="postsInfo.content" color="#333" mode="text" />
          </template>
        </wd-card>
      </view>
      <!-- 评论区组件 -->
      <CommentSection
        :postsInfo="postsInfo"
        :commentList="commentList"
        @commentLike="setCommentLike"
      />
      <!-- 底部回复框组件 -->
      <BottomReply :isLiked="isLiked" @sendComment="sendComment" @postsLike="setPostsLike" />
    </view>
    <wd-toast />
  </view>
  <!-- 加载动画 -->
  <CustomLoading v-else />
</template>

<script setup>
import CustomNavbar from '@/components/CustomNavbar'
import CustomLoading from '@/components/CustomLoading.vue'
import CommentSection from './components/CommentSection.vue'
import BottomReply from './components/BottomReply.vue'
import { computed, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { usePostsStore } from '@/stores/PostsInfo'
import { useToast } from 'wot-design-uni'
import { debounceLike, calculateLikeCount } from '@/utils/like'
// 获取toast实例
const { error: showErrorToast } = useToast()

// 动态仓库
const postsStore = usePostsStore()

//动态信息
const postsInfo = ref(null)

// 评论列表
const commentList = ref([])

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
// 查询参数
const postsId = ref()

// 动态点赞相关状态
const isLiked = ref(false)

// 评论内容
const commentContent = ref('')

// 接受帖子id
onLoad(options => {
  postsId.value = options.postsId
})

onMounted(async () => {
  // 获取动态详细信息
  const data = {
    postsId: postsId.value
  }
  postsInfo.value = await postsStore.getPostsInfo(data)
  isLiked.value = postsInfo.value.isLike
  // 获取评论列表并添加控制器
  commentList.value = postsInfo.value.commentList.map(comment => {
    return {
      ...comment,
      isLikeController: comment.isLike
    }
  })
})

//给动态点赞
async function setPostsLike() {
  const initialStatus = postsInfo.value.isLike
  isLiked.value = !isLiked.value
  const previousLikeCount = postsInfo.value.likeCount
  try {
    await debounceLike(
      postsStore.PostsLike, // API调用函数
      { postsId: postsInfo.value.postsId }, // API参数
      initialStatus, // 初始状态
      () => isLiked.value, // 更新本地状态的函数
      error => {
        isLiked.value = initialStatus
        showErrorToast('点赞失败，请重试')
      },
      500, // 防抖延迟时间
      `posts_like_${postsInfo.value.postsId}`, // 使用帖子ID作为定时器唯一标识
      // 成功回调：更新 postsInfo 中的 isLike 状态和点赞数
      () => {
        postsInfo.value.isLike = isLiked.value
        postsInfo.value.likeCount = isLiked.value 
          ? previousLikeCount + 1 
          : previousLikeCount - 1
      }
    )
  } catch (error) {
    showErrorToast('点赞失败，请重试')
  }
}

// 给评论点赞
async function setCommentLike(comment) {
  const initialStatus = comment.isLike
  comment.isLikeController = !comment.isLikeController
  try {
    await debounceLike(
      postsStore.commentLike, // API调用函数
      { commentsId: comment.commentsId }, // API参数
      initialStatus, // 初始状态
      () => comment.isLikeController, // 更新本地状态的函数
      error => {
        comment.isLikeController = initialStatus
        showErrorToast('点赞失败，请重试')
      },
      500, // 防抖延迟时间
      `posts_like_${comment.commentsId}`
    )
  } catch (error) {
    showErrorToast('评论点赞失败，请重试')
  }
}

// 发送评论
async function sendComment(content) {
  if (!content.trim()) {
    showErrorToast('请输入评论内容')
    return
  }
  if (!postsInfo.value) return
  const data = {
    content: content,
    postsId: postsId.value,
    parentId: 0 // 表示直接评论动态，不是回复别人的评论
  }
  const originalContent = content

  try {
    await postsStore.PostComments(data)
    postsInfo.value = await postsStore.getPostsInfo({ postsId: postsId.value })
  } catch (error) {
    console.error('发送评论失败:', error)
    commentContent.value = originalContent
    uni.$nextTick(() => {
      uni.createSelectorQuery().select('.custom-search >>> input').focus()
    })
    showErrorToast('发送评论失败，请重试')
  }
}
</script>

<style scoped lang="scss">
/* 导航栏相关样式 */
.navbar {
  :deep(.wd-navbar__title) {
    margin-left: 48px;
  }
  :deep(.nav-row) {
    height: 100%;
  }
  :deep(.nav-col) {
    padding-top: 4px;
    height: 100%;
  }
  /* 用户名区域样式 */
  .userName {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    line-height: 22px;
  }
}
</style>
