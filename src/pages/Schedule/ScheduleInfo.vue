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
              <wd-text text="多云转小雨" color="#333" bold size="18px" />
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
        <view class="text">
          <wd-text text="今日课程" color="#333" bold size="18px" /><wd-text
            text="2025年5月18日 周六"
            size="12px"
          />
        </view>
        <wd-button custom-class="button" @click="PushAllCourseInfo()">全部课表 ></wd-button>
      </view>
      <view class="schedule-info">
        <wd-steps vertical>
          <wd-step>
            <template #icon>
              <view style="display: flex; align-items: center; justify-content: center">
                <wd-text text="8:30" color="#333" size="18px" bold></wd-text>
              </view>
            </template>
            <template #title></template>
            <template #description>
              <view class="course-card">
                <wd-card custom-class="card">
                  <template #default>
                    <wd-text text="大学生创业基础" size="18px" bold color="#e9805b"></wd-text>
                  </template>
                  <template #footer>
                    <view class="other-info">
                      <wd-text text="老师：" /><wd-text text="张萌" />
                      <wd-text text=" | 教室" /><wd-text text="春晗楼404" />
                    </view>
                  </template>
                </wd-card>
              </view>
            </template>
          </wd-step>
          <wd-step>
            <template #icon>
              <view style="display: flex; align-items: center; justify-content: center">
                <wd-text text="8:30" color="#333" size="18px" bold></wd-text>
              </view>
            </template>
            <template #title></template>
            <template #description>
              <view class="course-card">
                <wd-card custom-class="card">
                  <template #default>
                    <wd-text text="大学生创业基础" size="18px" bold color="#e9805b"></wd-text>
                  </template>
                  <template #footer>
                    <view class="other-info">
                      <wd-text text="老师：" /><wd-text text="张萌" />
                      <wd-text text=" | 教室" /><wd-text text="春晗楼404" />
                    </view>
                  </template>
                </wd-card>
              </view>
            </template>
          </wd-step>
        </wd-steps>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
import CustomNavbar from '../../components/CustomNavbar.vue'

const joy = ref('/static/icon/weater.png')

function PushAllCourseInfo() {
  uni.navigateTo({ url: '/pages/Schedule/AllCourseInfo' })
}
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
  border-radius: 24px 24px 0 0;
  background: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    line-height: 60px;
    :deep(text) {
      margin-left: 6px;
    }
    :deep(.button) {
      background: transparent;
      color: #333;
    }
  }
  .schedule-info {
    padding: 0 20px;
    .course-card {
      :deep(.card) {
        padding: 10px 20px;
        margin: 0 0 0 40px;
        background: #e9805b20;
      }
    }
    .other-info {
      display: flex;
      margin-top: 12px;
      :deep(.wd-text) {
        color: #e9805b;
      }
    }
  }
}
</style>
