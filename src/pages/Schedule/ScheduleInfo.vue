<template>
  <view class="schedule">
    <!-- 导航栏 -->
    <CustomNavbar>
      <template>
        <view class="title">
          <wd-text text="今日课程" color="#333" blod />
        </view>
      </template>
    </CustomNavbar>
    <!-- 天气信息 -->
    <WeatherInfo />
    <!-- 今日课表 -->
    <view class="today-schedule">
      <!-- 分割栏 -->
      <view class="title">
        <view class="text">
          <wd-text text="今日课程" color="#333" bold size="18px" /><wd-text
            text="2025年5月18日 周六"
            size="12px"
          />
        </view>
        <wd-button custom-class="button" @click="PushAllCourseInfo()">全部课表 ></wd-button>
      </view>
      <!-- 课程时间轴 -->
      <CourseTimeline />
    </view>
  </view>
</template>
<script setup>
import CustomNavbar from '@/components/CustomNavbar.vue'
import CourseTimeline from './commponents/CourseTimeline.vue'
import WeatherInfo from './commponents/WeatherInfo.vue'
import { onMounted, computed } from 'vue'
import { useCourseStore } from '../../stores/CourseInfo'

const courseStore = useCourseStore()

const courseInfo = computed(() => {
  return courseStore.courseInfo
})

function PushAllCourseInfo() {
  uni.navigateTo({ url: '/pages/Schedule/AllCourseInfo' })
}

onMounted(async () => {
  await courseStore.getCourseInfo()
  console.log(courseInfo.value)
})
</script>
<style lang="scss" scoped>
.schedule {
  background: linear-gradient(45deg, #f0f7fe 40%, #c4d9f4 75%, #b3c5fe 100%);
  :deep(.custom-nav) {
    background: transparent;
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
}
</style>
