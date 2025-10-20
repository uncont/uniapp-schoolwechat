<template>
  <view class="warp">
    <!-- 顶部导航栏 -->
    <view class="nav">
      <wd-navbar
        fixed
        placeholder
        safeAreaInsetTop
        custom-class="custom-nav"
        :style="{ paddingTop: statusBarHeight + 'px' }"
      >
        <!-- 用户头像 -->
        <template #left>
          <view class="avatar">
            <wd-img :width="36" :height="36" :round="true" :src="joy" />
          </view>
        </template>
        <!-- 搜索框 -->
        <template #title>
          <view class="search-box" :style="getMenuButtonAlignedStyle()">
            <wd-search
              v-model="keyword"
              hide-cancel
              placeholder-left
              custom-class="nav-search"
            ></wd-search>
          </view>
        </template>
      </wd-navbar>
    </view>
    <view class="index">
      <view class="top">
        <!-- 分段器 -->
        <view class="segmented">
          <wd-segmented
            :options="list"
            v-model:value="active"
            custom-class="index-segmented"
          ></wd-segmented>
        </view>
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
          <wd-grid clickable>
            <wd-grid-item icon="picture" text="文字" />
            <wd-grid-item icon="picture" text="文字" />
            <wd-grid-item icon="picture" text="文字" />
          </wd-grid>
        </view>
      </view>
      <!-- 推荐内容 -->
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
import PostsCard from './components/PostsCard.vue'

import { testApi } from '../../api/test'

import { ref, onMounted } from 'vue'

// 系统信息相关数据
const menuButtonBounding = ref(null)
const statusBarHeight = ref(0)

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')

onMounted(() => {
  testApi()

  // 获取系统信息
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight

  // 仅在微信小程序中获取胶囊按钮位置信息
  // #ifdef MP-WEIXIN
  menuButtonBounding.value = uni.getMenuButtonBoundingClientRect()
  // #endif
})

const current = ref(0)
const keyword = ref('')
const active = ref('点赞')

const swiperList = ref([
  'https://wot-ui.cn/assets/redpanda.jpg',
  'https://wot-ui.cn/assets/capybara.jpg',
  'https://wot-ui.cn/assets/panda.jpg',
  'https://wot-ui.cn/assets/moon.jpg',
  'https://wot-ui.cn/assets/meng.jpg'
])

const list = ref(['社区', '推荐', '热门校园'])

function handleClick(e) {
  console.log(e)
}

function onChange(e) {
  console.log(e)
}

// 获取与胶囊按钮对齐的样式
function getMenuButtonAlignedStyle() {
  // #ifdef MP-WEIXIN
  if (menuButtonBounding.value) {
    return {
      height: `${menuButtonBounding.value.height}px`,
      marginTop: `${menuButtonBounding.value.top - statusBarHeight.value}px`
    }
  }
  // #endif

  // 默认样式
  return {
    height: '32px',
    marginTop: '0px'
  }
}
</script>

<style scoped lang="scss">
.nav {
  margin-bottom: 10px;
  .avatar {
    margin-left: 20px;
    height: 36px;
    width: 36px;
  }
  :deep(.custom-nav) {
    background: transparent;

    &::after {
      display: none;
    }
  }

  :deep(.nav-search) {
    margin-right: 12px;
    background: transparent;
  }

  .search-box {
    display: flex;
    align-items: center;
  }
}
.segmented {
  :deep(.index-segmented) {
    background: transparent;
    position: relative;
  }
  :deep(.is-active) {
    transform: scale(1.3);
  }
  :deep(.wd-segmented__item--active) {
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: pink;
    width: 20% !important;
    margin-left: 6.5%;
  }
}
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
