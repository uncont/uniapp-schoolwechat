<template>
  <view class="warp">
    <CustomNavbar></CustomNavbar>
    <view class="index">
      <view class="top">
        <view class="segmented">
          <wd-segmented :options="list" v-model:value="active"></wd-segmented>
        </view>
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
        <view class="function-buttons">
          <wd-grid clickable>
            <wd-grid-item icon="picture" text="文字" />
            <wd-grid-item icon="picture" text="文字" />
            <wd-grid-item icon="picture" text="文字" />
          </wd-grid>
        </view>
      </view>
      <view class="content">
        <view class="title"> </view>
        <view class="posts">
          <wd-row>
            <wd-col :span="8" :offset="2"><view class="bg-dark1">更多为你推荐</view></wd-col>
            <wd-col :span="2" :offset="8"
              ><view class="bg-dark1"><wd-button>更多></wd-button></view></wd-col
            >
          </wd-row>
          <ul>
            <li>
              <PostsCard></PostsCard>
            </li>
          </ul>
        </view>
      </view>
    </view>
    <CustomTabbar></CustomTabbar>
  </view>
</template>

<script setup>
import CustomTabbar from '../../components/CustomTabbar.vue'
import CustomNavbar from '../../components/CustomNavbar.vue'
import PostsCard from './components/PostsCard.vue'

import { testApi } from '../../api/test'

import { ref, onMounted } from 'vue'
onMounted(() => {
  testApi()
})
const current = ref(0)

const swiperList = ref([
  'https://wot-ui.cn/assets/redpanda.jpg',
  'https://wot-ui.cn/assets/capybara.jpg',
  'https://wot-ui.cn/assets/panda.jpg',
  'https://wot-ui.cn/assets/moon.jpg',
  'https://wot-ui.cn/assets/meng.jpg'
])
function handleClick(e) {
  console.log(e)
}
function onChange(e) {
  console.log(e)
}
const list = ref(['评论', '点赞', '贡献', '打赏'])

const active = ref('点赞')
</script>
<style scoped lang="scss">
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
</style>
