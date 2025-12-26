<template>
  <view class="index">
    <view class="top">
      <!-- 轮播图 -->
      <view class="card-swiper">
        <wd-swiper
          autoplay
          v-model:current="current"
          custom-indicator-class="custom-indicator-class"
          custom-image-class="custom-image"
          custom-next-image-class="custom-image-prev"
          custom-prev-image-class="custom-image-prev"
          :indicator="{ type: 'dots' }"
          :list="swiperList"
          previousMargin="42px"
          nextMargin="42px"
        ></wd-swiper>
      </view>
      <!-- 分区功能栏 -->
      <view class="function-buttons">
        <wd-grid square :gutter="18" clickable custom-class="custom-grid" :column="4">
          <wd-grid-item text="二手好物" custom-class="custom-item" @itemclick="PushSecondHand">
            <template #icon>
              <wd-img :width="48" :height="48" :src="icon1" />
            </template>
          </wd-grid-item>
          <wd-grid-item text="课表信息" custom-class="custom-item" @itemclick="PushSchedule">
            <template #icon>
              <wd-img :width="48" :height="48" :src="icon2" />
            </template>
          </wd-grid-item>
          <wd-grid-item text="校内点餐" custom-class="custom-item">
            <template #icon>
              <wd-img :width="48" :height="48" :src="icon3" />
            </template>
          </wd-grid-item>
          <wd-grid-item text="成绩查询" custom-class="custom-item">
            <template #icon>
              <wd-img :width="48" :height="48" :src="icon3" />
            </template>
          </wd-grid-item>
          <wd-grid-item text="宝贝租借" custom-class="custom-item" @itemclick="PushRentMarket">
            <template #icon>
              <wd-img :width="48" :height="48" :src="icon1" />
            </template>
          </wd-grid-item>
          <wd-grid-item text="游戏组队" custom-class="custom-item">
            <template #icon>
              <wd-img :width="48" :height="48" :src="icon2" />
            </template>
          </wd-grid-item>
          <wd-grid-item text="一起拼车" custom-class="custom-item">
            <template #icon>
              <wd-img :width="48" :height="48" :src="icon3" />
            </template>
          </wd-grid-item>
          <wd-grid-item text="活动" custom-class="custom-item">
            <template #icon>
              <wd-img :width="48" :height="48" :src="icon3" />
            </template>
          </wd-grid-item>
        </wd-grid>
      </view>
    </view>
    <!-- 推荐内容 -->
    <view class="content">
      <view class="title">
        <wd-row>
          <wd-col :span="24"><view>更多为你推荐</view></wd-col>
        </wd-row>
      </view>
      <view class="posts">
        <ul>
          <li v-for="(posts, index) in postsList" :key="index">
            <PostsCard
              :posts="posts"
              @updateLikeStatus="handleUpdateLikeStatus"
              @rollbackLikeStatus="handleRollbackLikeStatus"
            ></PostsCard>
          </li>
        </ul>
      </view>
    </view>
  </view>
  <wd-gap safe-area-bottom height="120rpx"></wd-gap>
</template>
<script setup>
import PostsCard from '../components/PostsCard.vue'
import { ref, onMounted, computed } from 'vue'
import { usePostsStore } from '@/stores/PostsInfo'
// 帖子
const postsStore = usePostsStore()
const postsList = computed(() => {
  return postsStore.recommendPostList
})

// 处理点赞状态更新
function handleUpdateLikeStatus({ postsId, newLikeStatus, changeCount }) {
  const postIndex = postsStore.recommendPostList.findIndex(post => post.postsId === postsId)
  if (postIndex !== -1) {
    // 更新帖子的点赞状态
    postsStore.recommendPostList[postIndex].isLiked = newLikeStatus
    // 更新点赞数
    if (postsStore.recommendPostList[postIndex].likeCount !== undefined) {
      postsStore.recommendPostList[postIndex].likeCount += changeCount
    }
  }
}

// 处理点赞状态回滚
function handleRollbackLikeStatus({ postsId, originalLikeStatus, changeCount }) {
  const postIndex = postsStore.recommendPostList.findIndex(post => post.postsId === postsId)
  if (postIndex !== -1) {
    // 恢复帖子的点赞状态
    postsStore.recommendPostList[postIndex].isLiked = originalLikeStatus
    // 恢复点赞数
    if (postsStore.recommendPostList[postIndex].likeCount !== undefined) {
      postsStore.recommendPostList[postIndex].likeCount += changeCount
    }
  }
}

onMounted(async () => {
  const params = {
    pageNum: '1',
    pageSize: '10'
  }
  await postsStore.getRecommendPost(params)
})
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
const icon1 = ref('/static/icon/shopping.png')
const icon2 = ref('/static/icon/schedule.png')
const icon3 = ref('/static/icon/catering.png')

const swiperList = ref([
  'https://wot-ui.cn/assets/redpanda.jpg',
  'https://wot-ui.cn/assets/capybara.jpg',
  'https://wot-ui.cn/assets/panda.jpg',
  'https://wot-ui.cn/assets/moon.jpg',
  'https://wot-ui.cn/assets/meng.jpg'
])

const current = ref(2)
//  路由跳转
function PushSchedule() {
  uni.navigateTo({
    url: '/pages/Schedule/ScheduleInfo'
  })
}
function PushSecondHand() {
  uni.navigateTo({
    url: '/pages/SecondHand/SecondHandMarket'
  })
}
function PushRentMarket() {
  uni.navigateTo({ url: '/pages/Rent/RentMarket' })
}
</script>
<style scoped lang="scss">
// 轮播图
.card-swiper {
  --wot-swiper-radius: 0;
  :deep(.custom-indicator-class) {
    bottom: 16px;
  }
  :deep(.custom-image) {
    border-radius: 12rpx;
    transform: scale(0.9);
  }
  :deep(.custom-image-prev) {
    height: 168px !important;
  }
}
// 模块跳转按钮
.function-buttons {
  :deep(.custom-grid) {
    padding-bottom: 0 !important;
  }
  :deep(.custom-item .wd-grid-item__content) {
    border-radius: 12px;
    .wd-grid-item__text {
      margin: 0;
    }
  }
}
// 推荐内容
.content {
  .title {
    margin: 0 20px 10px;
  }
}
</style>
