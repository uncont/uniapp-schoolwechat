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
      <!--评论区 -->
      <view class="comment">
        <view class="segmented">
          <wd-row>
            <!-- 评论数据展示 -->
            <wd-col :span="8" :offset="1">
              <wd-text
                prefix="共"
                :text="postsInfo.commentCount"
                suffix="条回复"
                size="16px"
                lineHeight="32px"
              ></wd-text>
            </wd-col>
            <!-- 分段器——切换评论显示顺序 -->
            <wd-col :span="10" :offset="4">
              <wd-segmented
                custom-class="custom-segregated"
                :options="list"
                v-model:value="current"
                size="small"
              >
                <template #label="{ option }">
                  {{ option.label }}
                </template>
              </wd-segmented>
            </wd-col>
          </wd-row>
        </view>
        <!-- 评论区 -->
        <view class="comment">
          <view class="comment-card" v-for="(comment, index) in commentList" :key="index">
            <!-- 评论卡片 -->
            <wd-card
              type="rectangle"
              custom-class="custom-card"
              custom-content-class="custom-content"
            >
              <template #default>
                <!-- 评论信息 -->
                <view class="comment-info">
                  <wd-img :width="40" :height="40" :round="true" :src="joy" />
                  <view class="text-container">
                    <view class="user-info">
                      <!-- 用户名 -->
                      <wd-text :text="comment.authorName" size="14px" color="#333" weight="500" />
                      <!-- 评论时间 -->
                      <wd-text
                        :text="formatCommentTime(comment.createdTime)"
                        size="12px"
                        color="#999"
                      />
                    </view>
                    <view class="comment-content">
                      <!-- 评论内容 -->
                      <wd-text :text="comment.content" color="#666" lineHeight="20px" />
                      <!-- 评论点赞按钮 -->
                      <view class="comment-like" @click="setCommentLike(comment)">
                        <wd-icon
                          :name="comment.isLiked ? 'fill_good' : 'good'"
                          class-prefix="iconfont"
                          :color="comment.isLiked ? '#ff6b6b' : '#0083ff'"
                          size="16px"
                        />
                        <text class="like-count">{{ comment.likeCount || 0 }}</text>
                      </view>
                    </view>
                  </view>
                </view>
              </template>
            </wd-card>
          </view>
        </view>
      </view>
      <!-- 底部回复框 -->
      <view class="bottom">
        <wd-tabbar fixed bordered safeAreaInsetBottom placeholder>
          <wd-search
            placeholder-left
            placeholder="写回复..."
            custom-class="custom-search"
            v-model="commentContent"
          >
            <template #suffix>
              <view class="menu">
                <wd-grid clickable>
                  <!-- 发送评论 -->
                  <wd-grid-item @itemclick="sendComment">
                    <wd-icon name="message" class-prefix="iconfont" color="#0083ff" />
                  </wd-grid-item>
                  <!-- 点赞 -->
                  <wd-grid-item @itemclick="setPostsLike">
                    <wd-icon :name="likeIconName" class-prefix="iconfont" :color="likeIconColor" />
                  </wd-grid-item>
                  <!-- 收藏 -->
                  <wd-grid-item>
                    <wd-icon name="star" class-prefix="iconfont" color="#0083ff" />
                  </wd-grid-item>
                </wd-grid>
              </view>
            </template>
          </wd-search>
        </wd-tabbar>
      </view>
    </view>
    <wd-toast />
  </view>
  <!-- 加载动画 -->
  <view class="loading" v-else>
    <CustomNavbar>
      <template>
        <wd-text text="正在加载..." color="#333"></wd-text>
      </template>
    </CustomNavbar>
    <wd-status-tip tip="正在加载动态数据">
      <template #image>
        <wd-loading type="outline" />
      </template>
    </wd-status-tip>
  </view>
</template>

<script setup>
import CustomNavbar from '@/components/CustomNavbar'
import { computed, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { usePostsStore } from '../../stores/PostsInfo'
import { useToast } from 'wot-design-uni'
import { sortComments, formatCommentTime } from '../../utils/comments'

// 获取toast实例
const { error: showErrorToast } = useToast()

// 动态仓库
const postsStore = usePostsStore()

// 评论分段器
const list = ref([
  { label: '默认', value: 'default' },
  { label: '最新', value: 'latest' },
  { label: '最热', value: 'hottest' },
  { label: '楼主', value: 'author' }
])
const current = ref('default')
//动态信息
const postsInfo = ref(null)
// 原始评论列表（保持初始状态）
const originalCommentList = computed(() => postsInfo.value?.commentList || [])

// 评论列表
const commentList = computed({
  get: () => {
    // 获取原始评论列表
    const comments = [...(originalCommentList.value || [])] // 使用副本以避免修改原始数据

    // 根据当前分段器值进行排序
    return sortComments(comments, current.value)
  }
})

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
// 查询参数
const postsId = ref()

// 点赞相关状态
const isLiked = computed(() => postsInfo.value?.isLiked || false)

// 计算点赞图标名称
const likeIconName = computed(() => (isLiked.value ? 'fill_good' : 'good'))

// 计算点赞图标颜色
const likeIconColor = computed(() => (isLiked.value ? '#ff6b6b' : '#0083ff'))

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
async function sendComment() {
  if (!commentContent.value.trim()) {
    showErrorToast('请输入评论内容')
    return
  }

  if (!postsInfo.value) return

  const data = {
    content: commentContent.value,
    postsId: postsId.value,
    parentId: 0 // 表示直接评论动态，不是回复别人的评论
  }

  // 保存当前评论内容，用于失败时恢复
  const originalContent = commentContent.value

  try {
    // 发送评论
    await postsStore.PostComments(data)

    // 清空评论框
    commentContent.value = ''

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

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
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

/* 评论卡片相关样式 */
.comment-card {
  :deep(.custom-title) {
    padding: 0;
  }
  :deep(.custom-content::after) {
    display: none !important;
  }
}

// 评论信息
.comment-info {
  display: flex;
  align-items: flex-start;
  .text-container {
    margin-left: 6px;
    flex: 1;
    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 6px;
    }
    .comment-content {
      display: flex;
      justify-content: space-between;
      /* 评论点赞按钮样式 */
      .comment-like {
        display: flex;
        align-items: center;
      }

      .like-count {
        margin-left: 4px;
        font-size: 12px;
        color: #999;
      }
    }
  }
}

/* 底部发送栏相关样式 */
.bottom {
  :deep(custom-search) {
    width: 100%;
  }
  :deep(.wd-search__search-left-icon::before) {
    content: '\e71e';
  }
}

/* 菜单网格相关样式 */
.menu {
  width: 160px;
  :deep(.wd-grid-item__text) {
    margin: 0;
  }
}
</style>
