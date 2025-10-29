<template>
  <view class="refresh-courseInfo">
    <CustomNavbar>
      <template>
        <view class="title">
          <wd-text text="获取课表" color="#333" blod />
        </view>
      </template>
    </CustomNavbar>
    <!-- 账号表单 -->
    <view class="form">
      <wd-tabs v-model="tab" swipeable lazy>
        <block>
          <wd-tab title="账号登入">
            <view class="content"> 使用账号登入校园网 </view>
          </wd-tab>
        </block>
        <block>
          <wd-tab title="扫码登入">
            <view class="content"> 使用账号登入校园网 </view>
          </wd-tab>
        </block>
      </wd-tabs>
    </view>
  </view>
</template>
<script setup>
import CustomNavbar from '../../components/CustomNavbar.vue'
import { ref } from 'vue'
const tab = ref(0)
</script>
<style lang="scss" scoped></style>
