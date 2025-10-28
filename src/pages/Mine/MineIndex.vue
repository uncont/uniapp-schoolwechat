<template>
  <view class="mine-page">
    <view class="user-header" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <view class="navbar-wrapper">
        <CustomNavbar></CustomNavbar>
      </view>
      <wd-row custom-class="user-profile">
        <wd-col :span="6" :offset="2">
          <wd-img :width="72" :height="72" round :src="joy" mode="aspecFill" />
        </wd-col>
        <wd-col :span="16">
          <view class="user-info">
            <wd-text text="用户名称" bold color="#333" size="20px" />
            <wd-text text="还没有填写个性签名，待填写" />
          </view>
        </wd-col>
      </wd-row>
      <view class="edit-button-wrapper">
        <wd-button custom-class="profile-edit-button" icon="edit-1" size="small">编辑 </wd-button>
      </view>
    </view>
    <view class="user-statistics">
      <wd-grid clickable custom-class="statistics-grid">
        <wd-grid-item v-for="item in userData" :key="item.id">
          <template #default>
            <view class="statistic-item">
              <wd-text :text="item.count.toString()" size="18px" bold color="#333" />
              <wd-text :text="item.label" size="14px" color="#666" />
            </view>
          </template>
        </wd-grid-item>
      </wd-grid>
    </view>
    <view class="transaction-section">
      <wd-card custom-class="transaction-card">
        <template #title>
          <view class="section-title">
            <wd-text text="我的交易" color="#333" bold />
            <wd-button type="text">查看更多></wd-button>
          </view>
        </template>
        <template #default>
          <wd-grid clickable :column="4" custom-class="transaction-actions-grid">
            <wd-grid-item
              v-for="item in transactionData"
              :key="item.id"
              icon="picture"
              :text="item.label"
            />
          </wd-grid>
        </template>
      </wd-card>
    </view>
    <view class="posts-section">
      <wd-card custom-class="posts-card">
        <template #title>
          <view class="section-title">
            <wd-text text="我的发布" color="#333" bold />
            <wd-button type="text">查看更多></wd-button>
          </view>
        </template>
        <template #default>
          <wd-grid clickable :column="4" custom-class="posts-actions-grid">
            <wd-grid-item
              v-for="item in postsData"
              :key="item.id"
              icon="picture"
              :text="item.label"
            />
          </wd-grid>
        </template>
      </wd-card>
    </view>
    <view class="utilities-section">
      <wd-card custom-class="utilities-card">
        <template #title>
          <view class="section-title">
            <wd-text text="常用功能" color="#333" bold />
          </view>
        </template>
        <template #default>
          <wd-grid clickable :column="4" custom-class="utilities-grid"> </wd-grid>
        </template>
      </wd-card>
    </view>
    <CustomTabbar />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import CustomNavbar from '../../components/CustomNavbar.vue'
import CustomTabbar from '../../components/CustomTabbar.vue'

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
const backgroundImage = ref(
  'https://s.panlai.com/zb_users/upload/2025/06/20250626132535175091553591779.jpg-arthumbs'
)

// 用户数据：收藏：4，关注：124，浏览数：847，粉丝：34，帖子：3
const userData = ref([
  { id: 1, label: '收藏', count: 4 },
  { id: 2, label: '关注', count: 124 },
  { id: 3, label: '浏览数', count: 847 },
  { id: 4, label: '粉丝', count: 34 },
  { id: 5, label: '帖子', count: 3 }
])

// 交易数据：购买、卖出、评价、收入
const transactionData = ref([
  { id: 1, label: '购买' },
  { id: 2, label: '卖出' },
  { id: 3, label: '评价' },
  { id: 4, label: '收入' }
])
const postsData = ref([
  { id: 1, label: '二手好物' },
  { id: 2, label: '出租' },
  { id: 3, label: '组队' },
  { id: 4, label: '拼车' }
])
</script>

<style scoped lang="scss">
.mine-page {
  min-height: 100vh;
  background: rgb(51, 51, 51, 0.1);
}
.user-header {
  position: relative;
  height: 240px;
  background-size: cover;
  background-position: center;
  :deep(.user-profile) {
    margin-top: 40px;
  }
  .user-info {
    display: flex;
    flex-direction: column;
    line-height: 2;
  }
  .edit-button-wrapper {
    position: absolute;
    bottom: 70px;
    right: -20px;
    :deep(.profile-edit-button) {
      padding-right: 30px;
    }
  }
}

.user-statistics {
  :deep(.statistics-grid) {
    margin: 20px 10px;
    border-radius: var(--wot-card-radius, 8px);
    box-shadow: var(--wot-card-shadow-color, 0px 4px 8px 0px rgba(0, 0, 0, 0.02));
  }
  .statistic-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 2;
  }
}

.transaction-section,
.posts-section,
.utilities-section {
  :deep(.transaction-card),
  :deep(.posts-card),
  :deep(.utilities-card) {
    margin: 20px 10px;
    .wd-card__title-content {
      padding: 10px 0 0 0;
    }
  }
  .section-title {
    display: flex;
    justify-content: space-between;
  }
}
</style>
