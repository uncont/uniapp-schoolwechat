<template>
  <view class="schedule">
    <CustomNavbar></CustomNavbar>
    <view class="weater-info">
      <view class="content-text">
        <wd-row>
          <wd-col :span="4" :offset="2"
            ><wd-text custom-class="custom-text" text="22" color="#333" bold size="48px"
          /></wd-col>
          <wd-col :span="16" :offset="2">
            <view class="details">
              <wd-text text="/20℃" size="18px" />
              <wd-text text="多云转小雨" color="#333" blod size="18px" />
            </view>
          </wd-col>
        </wd-row>
        <wd-row>
          <wd-col :span="22" :offset="2"
            ><wd-text text="义乌工商职业技术学院" size="12px"></wd-text
            ><wd-text custom-class="date" text="05-18" color="#333" size="12px"
          /></wd-col>
        </wd-row>
      </view>
      <view class="content-img">
        <wd-img :width="100" :height="100" :src="joy" />
      </view>
    </view>
    <view class="today-schedule">
      <view class="title">
        <wd-text text="今日课程" /><wd-text text="2025年5月18日" /><wd-text text="周六"
      /></view>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
import CustomNavbar from '../../components/CustomNavbar.vue'

const joy = ref('/static/icon/weater.png')
</script>
<style lang="scss" scoped>
.schedule {
  background: linear-gradient(45deg, #dde9f8 40%, #c4d9f4 65%, #b3c5fe 100%);
}
.weater-info {
  padding-right: 24px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .content-text {
    flex: 1;
  }

  :deep(.custom-text) {
    line-height: 1;
  }
  .details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    line-height: 24px;
  }
  :deep(.date) {
    margin-left: 18px;
  }
}
.today-schedule {
  border-radius: 48px;
  background: #fff;
}
</style>
