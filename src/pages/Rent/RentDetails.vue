<template>
  <view class="goods-details">
    <CustomNavbar>
      <view>
        <wd-text text="我是租借物品" color="#333" />
      </view>
    </CustomNavbar>
    <view class="user-info-bar">
      <wd-img
        :width="36"
        :height="36"
        round
        mode="aspectFill"
        src="https://wot-ui.cn/assets/redpanda.jpg"
        class="avatar-img"
      />
      <view class="user-text">
        <wd-text text="租赁小店" color="#222" size="16px" bold />
      </view>
      <view class="gray-info">2小时前 | 深圳</view>
    </view>
    <!-- 价格信息栏：按天计费 -->
    <view class="goods-price-bar">
      <view class="left-part">
        <wd-text text="¥29" color="#ff3333" size="32px" bold custom-class="main-price">
          <template #suffix>
            <wd-text text="/天" size="16px" />
          </template>
        </wd-text>
        <view class="meta-info">
          <wd-text text="最短租期：1天" color="#bbb" size="14px" />
          <wd-text text="支持押金" color="#bbb" size="14px" style="margin-left: 10px" />
        </view>
      </view>
      <view class="right-part">
        <view class="tag-new">可送货上门</view>
      </view>
    </view>
    <!-- 描述与参数 -->
    <view class="goods-desc-bar">
      <wd-text :text="goodsDesc" color="#222" size="17px" custom-class="desc-main" />
      <view class="goods-attr-table">
        <wd-segmented :options="paramList" v-model:value="current">
          <template #label="{ option }">
            <view class="section-slot">
              <wd-text :text="option.label" />
              <wd-text :text="option.value" />
            </view>
          </template>
        </wd-segmented>
      </view>
    </view>
    <!-- 留言区域（复用） -->
    <view class="comment-section">
      <view class="comment-title-bar">
        <wd-text text="留言(23)" bold size="17px" />
        <view class="icon-arrow">&gt;</view>
      </view>
      <view class="comment-input-bar">
        <wd-img
          :width="30"
          :height="30"
          round
          src="https://wot-ui.cn/assets/redpanda.jpg"
          class="input-avatar"
        />
        <view class="input-wrap">
          <wd-input
            v-model="commentText"
            placeholder="对租借有疑问？来问问~"
            clearable
            confirm-type="send"
            @confirm="sendComment"
            custom-class="cmt-input"
          />
        </view>
        <wd-button
          size="small"
          type="info"
          class="send-btn"
          :disabled="!commentText.trim()"
          @click="sendComment"
          >发送</wd-button
        >
      </view>
      <view class="comment-list">
        <view class="comment-item" v-for="item in commentList" :key="item.id">
          <wd-img :width="28" :height="28" round :src="item.avatar" />
          <view class="cmt-main">
            <view class="cmt-user-bar">
              <span class="cmt-nick">{{ item.nick }}</span>
              <span class="cmt-meta">· {{ item.time }} {{ item.region }}</span>
            </view>
            <wd-text :text="item.content" custom-class="cmt-content" />
          </view>
        </view>
      </view>
      <view class="comment-tips">—— 平台建议线下验机、当面签约 ——</view>
    </view>
  </view>
  <!-- 底部操作条（租借场景） -->
  <wd-tabbar fixed custom-class="goods-footer-bar" safeAreaInsetBottom placeholder>
    <wd-tabbar-item icon="chat1" :text="'23'" custom-class="footer-item">
      <template #icon>
        <wd-icon name="chat1" size="22px" color="#222" />
      </template>
      <template #text>
        <view class="footer-count">23</view>
      </template>
    </wd-tabbar-item>
    <wd-tabbar-item icon="star" :text="'120'" custom-class="footer-item">
      <template #icon>
        <wd-icon name="star" size="22px" color="#222" />
      </template>
      <template #text>
        <view class="footer-count">120</view>
      </template>
    </wd-tabbar-item>
    <view class="footer-op-btns">
      <wd-button type="warning" class="footer-chat-btn" shape="round">
        <wd-icon name="chat1" size="21px" style="margin-right: 4px" />联系租主
      </wd-button>
    </view>
  </wd-tabbar>
</template>
<script setup>
import CustomNavbar from '../../components/CustomNavbar.vue'
import { ref } from 'vue'

const goodsDesc = ref(
  '投影仪出租，1080P 分辨率，支持 Wi-Fi 同屏，外观九成新，支持短租/长租，租期越长越优惠\n\n押金：300 元（归还即退）\n配送：可自提/同城配送'
)

const paramList = ref([
  { label: '品类', value: '投影仪' },
  { label: '分辨率', value: '1080P' },
  { label: '连接', value: 'Wi‑Fi/HDMI' },
  { label: '成色', value: '9成新' },
  { label: '租期', value: '1-30天' }
])
const current = ref(0)

const commentList = ref([
  {
    id: 1,
    avatar: 'https://wot-ui.cn/assets/redpanda.jpg',
    nick: '租客A',
    time: '1小时前',
    region: '深圳',
    content: '支持上门自提吗？'
  },
  {
    id: 2,
    avatar: 'https://wot-ui.cn/assets/redpanda.jpg',
    nick: '租客B',
    time: '3小时前',
    region: '深圳',
    content: '长租价格可以再优惠点吗？'
  }
])
const commentText = ref('')
function sendComment() {
  const text = commentText.value.trim()
  if (!text) return
  commentList.value.unshift({
    id: Date.now(),
    avatar: 'https://wot-ui.cn/assets/redpanda.jpg',
    nick: '我',
    time: '刚刚',
    region: '',
    content: text
  })
  commentText.value = ''
}
</script>
<style scoped lang="scss">
// 定义常用颜色变量（与二手详情保持一致）
$white: #fff;
$black: #222;
$gray-light: #bbb;
$gray-dark: #ccc;
$gray-bg: #f7f7f7;
$yellow-primary: #ffe564;
$border-color: #f5f5f5;

.goods-details {
  .user-info-bar {
    display: flex;
    align-items: center;
    background: $white;
    padding: 10px 0 10px 10px;
    .avatar-img {
      margin-right: 8px;
    }
    .user-text {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
    }
    .gray-info {
      margin-left: auto;
      color: $gray-dark;
      font-size: 13px;
      padding-right: 10px;
    }
  }
  .goods-price-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: $white;
    padding: 12px 10px 6px 10px;
    border-bottom: 1px solid $border-color;
    .left-part {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .main-price {
      line-height: 36px;
      font-size: 32px !important;
    }
    .meta-info {
      display: flex;
      align-items: center;
      margin-top: 4px;
    }
    .right-part {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      min-width: 112px;
    }
    .tag-new {
      background: $yellow-primary;
      color: $black;
      border-radius: 8px;
      padding: 3px 14px;
      font-size: 16px;
      font-weight: bold;
      margin-top: 4px;
    }
  }
  .goods-desc-bar {
    background: $white;
    padding: 18px 13px 10px 13px;
    border-bottom: 1px solid #f4f4f4;
    .desc-main {
      text-align: left;
      line-height: 26px;
      letter-spacing: 0.1px;
      font-size: 17px !important;
      white-space: pre-line;
    }
    .goods-attr-table {
      margin-top: 18px;
    }
    :deep(.wd-segmented__item) {
      padding: 6px 0;
    }
    :deep(.wd-segmented__item--active) {
      background: $white;
      border: 1px solid $border-color;
    }
    .section-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .comment-section {
    margin-top: 10px;
    background: $white;
    padding: 0 0 10px 0;
    .comment-title-bar {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 17px;
      padding: 16px 14px 0 14px;
    }
    .icon-arrow {
      margin-left: auto;
      font-size: 18px;
      color: $gray-light;
      font-weight: normal;
    }
    .comment-input-bar {
      display: flex;
      align-items: center;
      padding: 9px 14px;
      border-bottom: 1px solid #f7f7f7;
      background: $white;
      gap: 10px;
    }
    .input-avatar {
      margin-right: 8px;
    }
    .input-wrap {
      flex: 1;
      background: $gray-bg;
      border-radius: 16px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      min-height: 36px;
    }
    :deep(.cmt-input) {
      flex: 1;
    }
    :deep(.wd-input__control) {
      background: transparent;
      font-size: 15px;
    }
    .send-btn {
      height: 28px;
      line-height: 28px;
      padding: 0 10px;
      border-radius: 14px;
    }
    .comment-list {
      padding: 0 14px;
    }
    .comment-item {
      display: flex;
      align-items: flex-start;
      margin: 17px 0 0 0;
    }
    .cmt-main {
      margin-left: 10px;
      flex: 1;
      min-width: 0;
    }
    .cmt-user-bar {
      display: flex;
      align-items: baseline;
    }
    .cmt-nick {
      font-weight: 700;
      font-size: 15px;
      color: $black;
    }
    .cmt-meta {
      margin-left: 6px;
      color: $gray-light;
      font-size: 13px;
      font-weight: normal;
    }
    .cmt-content {
      color: $black;
      font-size: 15px;
      line-height: 21px;
      margin: 6px 0 0 0;
      word-break: break-all;
      white-space: pre-line;
    }
    .comment-tips {
      margin: 11px 0 0 0;
      color: $gray-light;
      font-size: 13px;
      text-align: center;
    }
  }
}
.goods-footer-bar {
  border-top: 1px solid #f3f3f3;
  background: $white;
  height: 57px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
  z-index: 998;
  .footer-item {
    flex: none;
    width: 80px;
    text-align: center;
    padding: 0;
    background: none !important;
    box-shadow: none;
  }
  .footer-count {
    color: $gray-light;
    font-size: 13px;
    margin-top: 0px;
  }
  .footer-op-btns {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
    height: 100%;
    padding-right: 10px;
  }
  .footer-chat-btn {
    background: $yellow-primary !important;
    color: $black !important;
    border-radius: 23px;
    font-weight: 700;
    font-size: 17px;
    padding: 0 26px;
    margin-left: 10px;
    margin-top: 0;
    height: 38px;
    line-height: 38px;
    box-shadow: none;
    border: none !important;
    display: flex;
    align-items: center;
  }
}
</style>
