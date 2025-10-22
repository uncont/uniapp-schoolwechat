<template>
  <view class="posts-card">
    <wd-card
      custom-class="custom-card"
      custom-title-class="custom-title"
      type="rectangle"
      custom-content-class="custom-cotent"
    >
      <template #title>
        <wd-row custom-class="title-row">
          <wd-col :span="2">
            <view class="avatar">
              <wd-img
                :width="36"
                :height="36"
                round
                mode="aspectFill"
                src="https://wot-ui.cn/assets/redpanda.jpg"
              />
            </view>
          </wd-col>
          <wd-col :span="8" :offset="1" custom-class="id-col">
            <view>
              <wd-text text="手游研究社" bold custom-class="custom-text"></wd-text>
            </view>
          </wd-col>
        </wd-row>
      </template>
      一般的，检举内容由承办的党的委员会或纪律检查委员会将处理意见或复议、复查结论同申诉人见面，听取其意见。复议、复查的结论和决定，应交给申诉人一份。
      <template #footer>
        <wd-button size="small" plain @click="PushDetail">查看详情</wd-button>
      </template>
    </wd-card>
  </view>
</template>
<script setup>
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
function PushDetail() {
  uni.navigateTo({
    url: '/pages/PostDetails/PostDetails'
  })
}
</script>
<style scoped lang="scss">
.posts-card {
  :deep(.title-row) {
    display: flex;
    align-items: center;
  }
  :deep(.custom-cotent)::after {
    display: none !important;
  }
}
</style>
