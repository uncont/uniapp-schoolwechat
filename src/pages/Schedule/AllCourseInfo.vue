<template>
  <!-- 课表日期 -->
  <view class="all-course-info">
    <!-- 导航栏 -->
    <CustomNavbar>
      <template>
        <view class="title">
          <wd-text :text="`第${currentWeekNumber}周课表`" color="#333" blod />
        </view>
      </template>
    </CustomNavbar>
    <view class="date">
      <wd-segmented
        :options="list"
        v-model:value="current"
        size="large"
        custom-class="date-segmented"
        :disabled="true"
      >
        <template #label="{ option }">
          <view class="week">
            <wd-text
              :text="`${option.label}\n${option.date}`"
              :color="isActive(option.value) ? '#fff' : '#333'"
              size="12px"
              lineHeight="2"
            />
          </view>
        </template>
      </wd-segmented>
    </view>

    <CourseTable />

    <wd-fab position="right-bottom" :expandable="false">
      <template #trigger>
        <wd-button icon="refresh" @click="pushRefreshCourseInfo"> 刷新课表</wd-button>
      </template>
    </wd-fab>
  </view>
</template>
<script setup>
import CustomNavbar from '@/components/CustomNavbar.vue'
import CourseTable from './commponents/CourseTable.vue'
import { buildWeekdays, getCurrentWeekNumber, calculateDatesForWeek } from '@/utils/schedule'
import { computed } from 'vue'
// 跳转刷新课表页面
function pushRefreshCourseInfo() {
  uni.navigateTo({
    url: '/pages/Schedule/RefreshCourseInfo'
  })
}
// 当前周
const currentWeekNumber = getCurrentWeekNumber()

// 定义星期几的数据
const list = computed(() => {
  // 0是周日，1是周一，...，6是周六
  const weeks = buildWeekdays()
  const monthDay = calculateDatesForWeek(currentWeekNumber)
  return weeks.slice(0, 5).map((weekName, index) => {
    return {
      ...weekName,
      date: monthDay[index]
    }
  })
})

const current = computed(() => {
  const today = new Date()
  const week = [7, 1, 2, 3, 4, 5, 6]
  const dayOfWeek = week[today.getDay()]
  return dayOfWeek > 5 ? 5 : dayOfWeek
})

// 判断当前项是否为激活状态
const isActive = index => {
  return current.value === index
}
</script>
<style scoped lang="scss">
.all-course-info {
  background: rgb(51, 51, 51, 0.1);
  min-height: 100vh;
}

.date {
  background: #fff;
  padding-left: 60px;
  :deep(.date-segmented) {
    background: transparent;
  }

  :deep(.wd-segmented__item) {
    padding: 0 !important;
  }
  :deep(.wd-segmented__item.is-large.is-active) {
    color: #fff !important;
  }
  :deep(.wd-segmented__item--active) {
    background: #3d6cff;

    .week {
      :deep(.wd-text) {
        color: #fff !important;
      }
    }
  }

  // 日期样式
  .week {
    display: flex;
    flex-direction: column;
  }
}
</style>
