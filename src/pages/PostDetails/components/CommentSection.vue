<template>
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
      <view class="comment-card" v-for="(comment, index) in sortedCommentList" :key="index">
        <!-- 评论卡片 -->
        <wd-card type="rectangle" custom-class="custom-card" custom-content-class="custom-content">
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
</template>

<script setup>
import { computed, ref } from 'vue'
import { sortComments, formatCommentTime } from '../../../utils/comments'

// 定义组件接收的props
const props = defineProps({
  postsInfo: {
    type: Object,
    required: true
  },
  commentList: {
    type: Array,
    default: () => []
  }
})

// 定义组件触发的事件
const emit = defineEmits(['commentLike'])

// 评论分段器
const list = ref([
  { label: '默认', value: 'default' },
  { label: '最新', value: 'latest' },
  { label: '最热', value: 'hottest' },
  { label: '楼主', value: 'author' }
])
const current = ref('default')

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')

// 根据当前选择的排序方式进行评论排序
const sortedCommentList = computed(() => {
  // 获取原始评论列表
  const comments = [...props.commentList] // 使用副本以避免修改原始数据

  // 根据当前分段器值进行排序
  return sortComments(comments, current.value)
})

// 给评论点赞
function setCommentLike(comment) {
  emit('commentLike', comment)
}
</script>

<style scoped lang="scss">
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
</style>
