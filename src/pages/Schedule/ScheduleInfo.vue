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
            :text="date"
            size="12px"
          />
        </view>
        <wd-button custom-class="button" @click="PushAllCourseInfo()">全部课表 ></wd-button>
      </view>
      <!-- 课程时间轴 -->
      <CourseTimeline v-if="todayCourses.length > 0" :courseInfo="todayCourses" />
      <wd-status-tip v-else image="content" tip="今日课程已结束，好好休息吧" />
    </view>
  </view>
</template>
<script setup>
import CustomNavbar from '@/components/CustomNavbar.vue'
import CourseTimeline from './commponents/CourseTimeline.vue'
import WeatherInfo from './commponents/WeatherInfo.vue'
import { ref, onMounted, computed } from 'vue'
import { useCourseStore } from '@/stores/CourseInfo'
import { getTodayInfo, getTodayCourses } from '@/utils/schedule'
// 课表仓库
const courseStore = useCourseStore()
// 日期
const date = computed(() => {
  return getTodayInfo({
    format: 'yearDateWeekday'
  })
})

// 初始化课表数据
const courseInfo = computed(() => {
  return courseStore.courseInfo
})
const todayCourses = computed(() => {
  return getTodayCourses(courseInfo.value)
})

// 跳转到全部课表页面
function PushAllCourseInfo() {
  uni.navigateTo({ url: '/pages/Schedule/AllCourseInfo' })
}

onMounted(async () => {
  await courseStore.getCourseInfo()
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
