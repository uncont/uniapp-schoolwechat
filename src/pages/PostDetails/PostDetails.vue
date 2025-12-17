<template>
  <!-- 导航栏 -->
  <view class="navbar">
    <CustomNavbar>
      <template>
        <wd-row custom-class="nav-row">
          <wd-col :span="4" custom-class="nav-col">
            <wd-img :width="36" :height="36" :round="true" :src="joy" />
          </wd-col>
          <wd-col :span="12" :offset="1">
            <view class="userName" custom-class="nav-col">
              <wd-text text="我是用户名称" color="#333"></wd-text>
              <wd-text text="1小时前" size="12px"></wd-text>
            </view>
          </wd-col>
        </wd-row>
      </template>
    </CustomNavbar>
  </view>
  <view class="content">
    <view class="card">
      <wd-card type="rectangle">
        <template #default> 我是卡片的内容 </template>
      </wd-card>
    </view>
    <!--评论区 -->
    <view class="comment">
      <view class="segmented">
        <wd-row>
          <wd-col :span="8" :offset="1">
            <wd-text prefix="共" text="256" suffix="条回复" size="16px" lineHeight="32px"></wd-text>
          </wd-col>
          <wd-col :span="9" :offset="5">
            <wd-segmented
              custom-class="custom-segmented"
              :options="list"
              v-model:value="current"
              size="small"
            ></wd-segmented>
          </wd-col>
        </wd-row>
      </view>
      <view class="comment">
        <wd-row>
          <wd-col :span="2">
            <wd-img :width="36" :height="36" :round="true" :src="joy" />
          </wd-col>
          <wd-col :span="18">
            <view class="comment-card">
              <wd-card
                type="rectangle"
                custom-class="custom-card"
                custom-title-class="custom-title"
                custom-content-class="custom-content"
                custom-footer-class="custom-footer"
              >
                <template #title>
                  <wd-text text="我是用户名"></wd-text>
                </template>
                <template #default>
                  <wd-text text="我是用户的一条评论"></wd-text>
                </template>
                <template #footer></template>
              </wd-card>
            </view>
          </wd-col>
        </wd-row>
      </view>
    </view>
    <view class="bottom">
      <wd-tabbar fixed bordered safeAreaInsetBottom placeholder>
        <wd-search placeholder-left placeholder="写回复..." custom-class="custom-search">
          <template #suffix>
            <view class="menu">
              <wd-grid clickable>
                <wd-grid-item icon="picture" />
                <wd-grid-item icon="picture" />
                <wd-grid-item icon="picture" />
                <wd-grid-item icon="picture" />
              </wd-grid>
            </view>
          </template>
        </wd-search>
      </wd-tabbar>
    </view>
  </view>
</template>
,
<script setup>
import CustomNavbar from '@/components/CustomNavbar'
import { ref } from 'vue'

const list = ref(['评论', '点赞', '贡献', '打赏'])
const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')

const current = ref('点赞')
</script>
<style scoped lang="scss"></style>

<style scoped lang="scss">
.navbar {
  :deep(.wd-navbar__title) {
    margin-left: 48px;
  }
  :deep(.nav-row) {
    height: 100%;
  }
  :deep(.nav-col) {
    padding-top: 4px;
    height: 100%;
  }
  .userName {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    line-height: 22px;
  }
}

.bottom {
  :deep(custom-search) {
    width: 100%;
  }
  :deep(.wd-search__search-left-icon::before) {
    content: '\e71e';
  }
}
.menu {
  width: 200px;
  :deep(.wd-grid-item__text) {
    margin: 0;
  }
}
.comment-card {
  :deep(.custom-title) {
    padding: 0;
  }
  :deep(.custom-content::after) {
    display: none !important;
    // content: '';
  }
}
</style>
