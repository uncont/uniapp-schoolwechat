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
      <wd-tabs v-model="tab" custom-class="topic-tab">
        <block v-for="item in 9" :key="item">
          <wd-tab :title="`标签${item}`" />
        </block>
      </wd-tabs>
    </view>
    <view class="content">
      <ul>
        <li v-for="item in 10" :key="item">
          <PostsCard />
        </li>
      </ul>
    </view>
  </view>
</template>
<script setup>
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

import PostsCard from '../components/PostsCard.vue'
import { ref } from 'vue'
const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')

const tab = ref(0)
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
    :deep(.topic-img) {
      :deep(image) {
        border-radius: 6px;
      }
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
