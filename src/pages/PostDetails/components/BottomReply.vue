<template>
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
</template>

<script setup>
import { ref, computed } from 'vue'

// 定义组件接收的props
const props = defineProps({
  isLiked: {
    type: Boolean,
    default: false
  }
})

// 定义组件触发的事件
const emit = defineEmits(['sendComment', 'postsLike'])

// 评论内容
const commentContent = ref('')

// 计算点赞图标名称
const likeIconName = computed(() => (props.isLiked ? 'fill_good' : 'good'))

// 计算点赞图标颜色
const likeIconColor = computed(() => (props.isLiked ? '#ff6b6b' : '#0083ff'))

// 发送评论
function sendComment() {
  emit('sendComment', commentContent.value)
  // 清空评论框
  commentContent.value = ''
}

// 点赞动态
function setPostsLike() {
  emit('postsLike')
}
</script>

<style scoped lang="scss">
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
