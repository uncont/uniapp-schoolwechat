<template>
  <view class="fixed-bg" />
  <view class="Second-hand-market">
    <CustomNavBar>
      <view>
        <wd-text text="二手市场" color="#333" />
      </view>
    </CustomNavBar>
    <view class="hot-card">
      <wd-card custom-class="card">
        <template #default>
          <wd-grid custom-class="grid" :column="2" bg-color="transparent">
            <wd-grid-item v-for="value in 4" :key="value">
              <view class="content">
                <wd-img custom-class="topic-img" :width="48" :height="48" :src="joy" />
                <view class="text">
                  <wd-text text="#热门售卖" />
                  <wd-text :text="`${111}人讨论`" />
                </view>
              </view>
            </wd-grid-item>
          </wd-grid>
        </template>
        <template #footer>
          <div class="footer">
            <view class="title">
              <wd-text text="热门售卖" bold color="#333" />
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
    <!-- 商品卡片 -->
    <ul class="goods-list">
      <li class="goods-li" v-for="value in 10" :key="value">
        <wd-card custom-class="goods-card">
          <template #default>
            <view class="goods-des">
              <wd-img custom-class="goods-image" :src="joy" />
              <view class="text-des">
                <wd-text text="海尔洗衣机" bold size="18px" color="#333" lineHeight="2" />
                <wd-text text="买来之后用了三次，不包含运费" />
              </view>
            </view>
          </template>
          <template #footer>
            <view class="price">
              <wd-text text="60" color="#333" bold size="24px">
                <template #suffix>
                  <wd-text text="元" size="16px" />
                </template>
              </wd-text>
              <wd-button type="info" size="small">GO ></wd-button>
            </view>
          </template>
        </wd-card>
      </li>
    </ul>
  </view>
</template>
<script setup>
import CustomNavBar from '../../components/CustomNavbar.vue'

import { ref } from 'vue'
const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
const tab = ref(0)
</script>
<style lang="scss" scoped>
:deep(.custom-nav) {
  background: transparent;
}
// 热门售卖卡片
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
    :deep(.topic-img image) {
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
// 商品列表
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  .goods-li {
    width: 46%;
  }
  :deep(.goods-card) {
    padding: 0;
    margin: 12px 0 0 0;
  }

  // 商品描述
  .goods-des {
    :deep(.goods-image) {
      width: 100%;
      box-sizing: border-box;
      image {
        border-radius: 6px 6px 0 0;
        height: auto;
        aspect-ratio: 12/13;
      }
    }
    .text-des {
      padding: 0 12px;
      display: flex;
      flex-direction: column;
    }
  }
  // 价格
  .price {
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
