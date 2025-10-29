<template>
  <!-- 帖子卡片 -->
  <view class="posts-card">
    <wd-card
      custom-class="custom-card"
      custom-title-class="custom-title"
      custom-content-class="custom-cotent"
    >
      <!-- 帖子头部——展示用户名称，用户头像 -->
      <template #title>
        <view class="title">
          <view class="user">
            <view class="avatar">
              <wd-img
                :width="36"
                :height="36"
                round
                mode="aspectFill"
                src="https://wot-ui.cn/assets/redpanda.jpg"
              />
            </view>
            <view class="userName">
              <wd-text text="手游研究社" bold custom-class="custom-text" color="#333" />
            </view>
          </view>
          <view class="Follow">
            <wd-button type="warning" size="small">关注</wd-button>
          </view>
        </view>
      </template>
      <template #default>
        <view class="text-content">
          <wd-text
            text="一般的，检举内容由承办的党的委员会或纪律检查委员会将处理意见或复议、复查结论同申诉人见面，听取其意见。复议、复查的结论和决定，应交给申诉人一份。"
            color="#333"
          />
        </view>
        <view class="img-content">
          <wd-grid :column="3">
            <wd-grid-item v-for="value in 6" :key="value">
              <wd-img mode="aspectFill" custom-class="image" :src="joy" />
            </wd-grid-item>
          </wd-grid>
        </view>
      </template>
      <template #footer>
        <view class="function-button">
          <view><wd-button type="text" icon="thumb-up">点赞</wd-button></view>
          <view><wd-button type="text" icon="chat1" @click="PushDetail()">评论</wd-button></view>
          <view><wd-button type="text" icon="star">收藏</wd-button></view>
        </view>
      </template>
    </wd-card>
  </view>
</template>
<script setup>
import { ref } from 'vue'
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
function PushDetail() {
  uni.navigateTo({
    url: '/pages/PostDetails/PostDetails'
  })
}
</script>
<style scoped lang="scss">
//卡片样式
.posts-card {
  :deep(.custom-card) {
    .wd-card__footer {
      padding: 0;
    }
  }
}
// 标题样式
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .user {
    display: flex;
    align-items: center;
    .userName {
      margin-left: 10px;
    }
  }
}
// 图像组样式
.img-content {
  :deep(.wd-grid-item__content) {
    padding: 0;
  }
  :deep(.image) {
    padding: 4px;
    width: 100%;
    box-sizing: border-box;
    image {
      border-radius: 6px;
      height: auto;
      aspect-ratio: 5/6;
    }
  }
}
//底部样式
.function-button {
  display: flex;
  justify-content: space-around;
}
</style>
