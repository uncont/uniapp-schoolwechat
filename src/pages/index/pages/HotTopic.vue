<template>
  <view class="hot-topic">
    <view class="hot-card">
      <wd-card custom-class="card">
        <template #default>
          <wd-grid custom-class="grid" :column="2" bg-color="transparent">
            <wd-grid-item v-for="value in 4" :key="value">
              <view class="content">
                <wd-img custom-class="topic-img" :width="48" :height="48" :src="joy" />
                <view class="text">
                  <wd-text text="#热门话题" />
                  <wd-text :text="`${111}人讨论`" />
                </view>
              </view>
            </wd-grid-item>
          </wd-grid>
        </template>
        <template #footer>
          <div class="footer">
            <view class="title">
              <wd-text text="热门话题" bold color="#333" />
            </view>
            <view class="bg-text">
              <wd-text text="HOT TOPIC" bold color="#fff" size="24px" />
            </view>
          </div>
        </template>
      </wd-card>
    </view>
    <view class="tabs">
      <wd-tabs v-model="tab" custom-class="topic-tab" @change="handleChange">
        <block v-for="(value, index) in postsCategories" :key="index">
          <wd-tab :title="value.name" />
        </block>
      </wd-tabs>
    </view>
    <view class="content">
      <ul>
        <li v-for="(value, index) in CategoriesPosts" :key="index">
          <PostsCard
            :posts="value"
            @updateLikeStatus="handleUpdateLikeStatus"
            @rollbackLikeStatus="handleRollbackLikeStatus"
          />
        </li>
      </ul>
    </view>
  </view>
  <wd-gap safe-area-bottom height="120rpx"></wd-gap>
</template>
<script setup>
import PostsCard from '../components/PostsCard.vue'
import { computed, onMounted, ref } from 'vue'
import { usePostsStore } from '@/stores/PostsInfo'

const postsStore = usePostsStore()

// 分类列表
const postsCategories = computed(() => postsStore.postsCategories)
// 分类动态列表
const CategoriesPosts = ref([])
const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
const tab = ref(0)

// 处理点赞状态更新
function handleUpdateLikeStatus({ postsId, newLikeStatus, changeCount }) {
  const postIndex = CategoriesPosts.value.findIndex(post => post.postsId === postsId)
  if (postIndex !== -1) {
    // 更新帖子的点赞状态
    CategoriesPosts.value[postIndex].isLiked = newLikeStatus
    // 更新点赞数
    if (CategoriesPosts.value[postIndex].likeCount !== undefined) {
      CategoriesPosts.value[postIndex].likeCount += changeCount
    }
  }
}

// 处理点赞状态回滚
function handleRollbackLikeStatus({ postsId, originalLikeStatus, changeCount }) {
  const postIndex = CategoriesPosts.value.findIndex(post => post.postsId === postsId)
  if (postIndex !== -1) {
    // 恢复帖子的点赞状态
    CategoriesPosts.value[postIndex].isLiked = originalLikeStatus
    // 恢复点赞数
    if (CategoriesPosts.value[postIndex].likeCount !== undefined) {
      CategoriesPosts.value[postIndex].likeCount += changeCount
    }
  }
}

//  切换分类
async function handleChange(value) {
  const categoriesId = postsCategories.value[value.index].categoriesId
  await fetchCategoriesOfPosts(categoriesId)
}
// 获取分类动态列表
async function fetchCategoriesOfPosts(id) {
  // 获取分类动态列表
  const getCategoriesOfPostsData = {
    pageNum: '1',
    pageSize: '10',
    // 默认分类id为1
    categoriesId: id ? id : '1'
  }
  CategoriesPosts.value = await postsStore.getCategoriesOfPosts(getCategoriesOfPostsData)
}

onMounted(async () => {
  // 获取分类列表
  const getPostCategoriesData = {
    pageNum: '1',
    pageSize: '10'
  }
  await postsStore.getPostCategories(getPostCategoriesData)
  await fetchCategoriesOfPosts()
})

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
</script>
<style scoped lang="scss">
// 热门话题卡片
.hot-card {
  :deep(.card) {
    padding-top: 10px;
    background: #abd6f2ff;
  }
  :deep(.grid) {
    border-radius: 6px;
    background: #fff;
  }
  .content {
    display: flex;
    justify-content: space-around;
    :deep(.wd-img__image) {
      border-radius: 6px;
    }
    .text {
      padding-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 2;
      box-sizing: border-box;
    }
  }
  .footer {
    position: relative;
    padding-bottom: 20px;
    text-align: left;
    .title {
      position: absolute;
      bottom: 0;
      z-index: 999;
    }
    .bg-text {
      position: absolute;
      bottom: 0;
      font-style: italic;
      z-index: 1;
    }
  }
}
// 帖子标签分类
:deep(.topic-tab) {
  background: transparent !important;
  .wd-tabs__nav {
    background: transparent;
  }
}
</style>
