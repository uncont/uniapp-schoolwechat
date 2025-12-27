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
        :commentList="postsInfo.commentList || []"
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
import { usePostsStore } from '../../stores/PostsInfo'
import { useToast } from 'wot-design-uni'

// 获取toast实例
const { error: showErrorToast } = useToast()

// 动态仓库
const postsStore = usePostsStore()

//动态信息
const postsInfo = ref(null)

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
// 查询参数
const postsId = ref()

// 点赞相关状态
const isLiked = computed(() => postsInfo.value?.isLiked || false)

// 评论内容
const commentContent = ref('')

onLoad(options => {
  postsId.value = options.postsId
})

onMounted(async () => {
  // 获取动态详细信息
  const data = {
    postsId: postsId.value
  }
  postsInfo.value = await postsStore.getPostsInfo(data)
})

//给动态点赞
async function setPostsLike() {
  if (!postsInfo.value) return

  const data = {
    postsId: postsId.value
  }

  // 本地先更新状态（乐观更新）
  const previousLikeStatus = postsInfo.value.isLiked
  postsInfo.value.isLiked = !previousLikeStatus

  try {
    await postsStore.PostsLike(data)
    // 如果后端返回成功，保持当前状态
    // 更新点赞计数（如果后端有返回点赞数的话）
    if (postsInfo.value.likeCount !== undefined) {
      postsInfo.value.likeCount = previousLikeStatus
        ? postsInfo.value.likeCount - 1
        : postsInfo.value.likeCount + 1
    }
  } catch (error) {
    // 如果后端返回失败，恢复到之前的状态
    postsInfo.value.isLiked = previousLikeStatus
    console.error('点赞失败:', error)
    // 使用wot-ui的轻提示
    showErrorToast('点赞失败，请重试')
  }
}

// 给评论点赞
async function setCommentLike(comment) {
  if (!comment) return

  // 保存原始状态，用于回滚
  const previousLikeStatus = comment.isLiked
  const previousLikeCount = comment.likeCount || 0

  // 本地先更新状态（乐观更新）
  comment.isLiked = !previousLikeStatus
  comment.likeCount = previousLikeStatus ? previousLikeCount - 1 : previousLikeCount + 1

  try {
    await postsStore.commentLike({ commentsId: comment.commentsId })
    // 如果后端返回成功，保持当前状态
  } catch (error) {
    // 如果后端返回失败，恢复到之前的状态
    comment.isLiked = previousLikeStatus
    comment.likeCount = previousLikeCount
    console.error('评论点赞失败:', error)
    // 使用wot-ui的轻提示
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

  // 保存当前评论内容，用于失败时恢复
  const originalContent = content

  try {
    // 发送评论
    await postsStore.PostComments(data)

    // 重新获取评论数据，更新评论列表
    postsInfo.value = await postsStore.getPostsInfo({ postsId: postsId.value })

    // 更新评论计数
    if (postsInfo.value.commentCount !== undefined) {
      postsInfo.value.commentCount += 1
    }
  } catch (error) {
    console.error('发送评论失败:', error)
    // 恢复评论内容
    commentContent.value = originalContent
    // 聚焦到输入框
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
