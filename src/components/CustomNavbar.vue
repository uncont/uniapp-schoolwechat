<template>
  <view class="navbar">
    <wd-navbar
      custom-class="custom-nav"
      fixed
      :bordered="false"
      placeholder
      safeAreaInsetTop
      left-arrow
      @click-left="handleClickLeft"
    >
      <template #title>
        <slot>
          <view class="title">
            <wd-text text="导航条" color="#333" blod />
          </view>
        </slot>
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
function handleClickLeft() {
  uni.navigateBack()
}
</script>
<style scoped lang="scss"></style>
