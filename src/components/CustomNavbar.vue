<template>
  <view class="navbar">
    <wd-navbar custom-class="custom-nav" fixed :bordered="false" placeholder safeAreaInsetTop>
      <template #title>
        <view class="title">
          <wd-text text="导航条" color="#333" blod></wd-text>
        </view>
      </template>
    </wd-navbar>
  </view>
</template>
<script setup>
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
</script>
<style scoped lang="scss">
.navbar {
  :deep(.custom-nav) {
    background: transparent;
  }
}
</style>
