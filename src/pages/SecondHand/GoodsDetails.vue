<template>
  <view class="goods-details">
    <CustomNavbar>
      <view>
        <wd-text text="我是商品名称" color="#333" />
      </view>
    </CustomNavbar>
    <view class="user-info-bar">
      <!-- 用户头像 -->
      <wd-img
        :width="36"
        :height="36"
        round
        mode="aspectFill"
        src="https://wot-ui.cn/assets/redpanda.jpg"
        class="avatar-img"
      />
      <!-- 用户名与标签 -->
      <view class="user-text">
        <wd-text text="小怡爱数码吖" color="#222" size="16px" bold />
      </view>
      <!-- 时间与地点信息 -->
      <view class="gray-info">1小时前 | 深圳</view>
    </view>
    <!-- 价格信息栏 -->
    <view class="goods-price-bar">
      <view class="left-part">
        <wd-text text="¥850" color="#ff3333" size="32px" bold custom-class="main-price" />
        <view class="meta-info">
          <wd-text text="原价: ¥850" color="#bbb" size="14px" />
          <wd-text text="1289人想要" color="#bbb" size="14px" style="margin-left: 10px" />
          <wd-text text="19.3万人浏览" color="#bbb" size="14px" style="margin-left: 10px" />
        </view>
      </view>
      <view class="right-part">
        <view class="tag-new">全新未拆封</view>
      </view>
    </view>
    <!-- 商品描述栏 -->
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
    <!-- 留言区域 -->
    <view class="comment-section">
      <view class="comment-title-bar">
        <wd-text text="留言(365)" bold size="17px" />
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
            placeholder="我有话要说..."
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
      <view class="comment-tips">—— 超过90天或涉违规的留言将被隐藏 ——</view>
    </view>
  </view>
  <!-- 底部操作条 -->
  <wd-tabbar fixed custom-class="goods-footer-bar" safeAreaInsetBottom placeholder>
    <wd-tabbar-item icon="chat1" :text="'365'" custom-class="footer-item">
      <template #icon>
        <wd-icon name="chat1" size="22px" color="#222" />
      </template>
      <template #text>
        <view class="footer-count">365</view>
      </template>
    </wd-tabbar-item>
    <wd-tabbar-item icon="star" :text="'800'" custom-class="footer-item">
      <template #icon>
        <wd-icon name="star" size="22px" color="#222" />
      </template>
      <template #text>
        <view class="footer-count">800</view>
      </template>
    </wd-tabbar-item>
    <view class="footer-op-btns">
      <wd-button type="warning" class="footer-chat-btn" shape="round">
        <wd-icon name="chat1" size="21px" style="margin-right: 4px" />聊一聊
      </wd-button>
    </view>
  </wd-tabbar>
</template>

<script setup>
import CustomNavbar from '../../components/CustomNavbar.vue'
import { ref } from 'vue'

const goodsDesc = ref(
  '全新未拆封未激活，需要的联系，着急卖，最近缺钱，iQOO Z9x 6000mAh 电池，4nm 第一代高通骁龙 6 处理器，自己备用或者给老人用完全没问题\n\n颜色：星芒白\n内存：8+128GB  ¥850'
)

const commentList = ref([
  {
    id: 1,
    avatar: 'https://wot-ui.cn/assets/redpanda.jpg',
    nick: '看我帖子',
    time: '8小时前',
    region: '河北',
    content: '免炮月付苹果17PM\n全新国行 非监管\n月付也和直接买价一样'
  },
  {
    id: 2,
    avatar: 'https://wot-ui.cn/assets/redpanda.jpg',
    nick: 'X***9',
    time: '17小时前',
    region: '湖南',
    content: '过几天拿下'
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

// 商品参数（使用 segmented 展示）
const paramList = ref([
  { label: '品牌', value: 'iQOO' },
  { label: '型号', value: 'IQOO Z9x' },
  { label: '存储容量', value: '128GB' },
  { label: '运行内存', value: '8GB' },
  { label: '版本', value: '大陆国行' }
])

// 修复：为 wd-segmented 组件添加 current 值
const current = ref(0)
</script>

<style scoped lang="scss">
// 定义常用颜色变量
$white: #fff;
$black: #222;
$gray-light: #bbb;
$gray-dark: #ccc;
$gray-bg: #f7f7f7;
$red-primary: #ff3333;
$yellow-primary: #ffe564;
$border-color: #f5f5f5;

// 商品详情页面主容器
.goods-details {
  // 用户信息栏样式
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

  // 商品价格信息栏样式
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

      .main-price {
        line-height: 36px;
        font-size: 32px !important;
      }

      .meta-info {
        display: flex;
        align-items: center;
        margin-top: 4px;

        wd-text {
          margin-left: 10px;

          &:first-child {
            margin-left: 0;
          }
        }
      }
    }

    .right-part {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      min-width: 112px;

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
  }

  // 商品描述区域样式
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

    // 商品属性 segmented 样式
    .goods-attr-table {
      margin-top: 18px;

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
  }

  // 评论区域样式
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

      .icon-arrow {
        margin-left: auto;
        font-size: 18px;
        color: $gray-light;
        font-weight: normal;
      }
    }

    .comment-input-bar {
      display: flex;
      align-items: center;
      padding: 9px 14px 9px 14px;
      border-bottom: 1px solid #f7f7f7;
      background: $white;
      gap: 10px;

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

        :deep(.cmt-input) {
          flex: 1;
        }

        :deep(.wd-input__control) {
          background: transparent;
          font-size: 15px;
        }
      }

      .send-btn {
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
        border-radius: 14px;
      }
    }

    .comment-list {
      padding: 0 14px;

      .comment-item {
        display: flex;
        align-items: flex-start;
        margin: 17px 0 0 0;

        .cmt-main {
          margin-left: 10px;
          flex: 1;
          min-width: 0;

          .cmt-user-bar {
            display: flex;
            align-items: baseline;

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
          }

          .cmt-content {
            color: $black;
            font-size: 15px;
            line-height: 21px;
            margin: 6px 0 0 0;
            word-break: break-all;
            white-space: pre-line;
          }
        }
      }
    }

    .comment-tips {
      margin: 11px 0 0 0;
      color: $gray-light;
      font-size: 13px;
      text-align: center;
    }
  }
}

// 商品底部操作栏样式
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

    .footer-count {
      color: $gray-light;
      font-size: 13px;
      margin-top: 0px;
    }
  }

  .footer-op-btns {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
    height: 100%;
    padding-right: 10px;

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
}
</style>
