<template>
  <!-- 课表日期选择器 -->
  <view class="all-course-info">
    <!-- 导航栏 -->
    <CustomNavbar>
      <template>
        <view class="title">
          <wd-text text="课表" color="#333" blod />
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
              :text="option.weeks"
              :color="isActive(option.value) ? '#fff' : '#333'"
              size="12px"
              lineHeight="2"
            />
            <wd-text
              :text="option.date"
              :color="isActive(option.value) ? '#fff' : '#333'"
              size="16px"
              lineHeight="2"
            />
          </view>
        </template>
      </wd-segmented>
    </view>

    <!-- 课表内容 -->
    <view class="schedule-content">
      <wd-table
        :data="processedScheduleData"
        custom-class="schedule-table"
        :stripe="false"
        :border="false"
      >
        <!-- 时间轴 -->
        <wd-table-col prop="time" label="时间" custom-class="time-col">
          <template #value="{ row }">
            <view class="time-slot">
              <wd-text color="#333" :text="row.period" />
              <wd-text color="#333" :text="row.timeRange" />
            </view>
          </template>
        </wd-table-col>
        <!-- 课表信息 -->
        <wd-table-col
          v-for="(weekday, index) in weekdays"
          :key="index"
          :prop="weekday.prop"
          :label="weekday.label"
        >
          <template #value="{ row, index }">
            <view
              class="course"
              v-if="
                row[weekday.prop] &&
                row[weekday.prop].visible !== false &&
                !row[weekday.prop].hidden
              "
              :style="
                row[weekday.prop].rowSpan > 1
                  ? {
                      height: 120 * row[weekday.prop].rowSpan + 'px'
                    }
                  : {}
              "
            >
              <wd-card custom-class="card">
                <template #default>
                  <wd-text :text="row[weekday.prop].name" bold color="#e9805b" size="10px">
                  </wd-text>
                </template>
                <template #footer>
                  <view class="other-info">
                    <wd-text :text="row[weekday.prop].teacher || '张萌'" size="8px" />
                    <wd-text :text="row[weekday.prop].location || '春晗楼404'" size="8px" />
                  </view>
                </template>
              </wd-card>
            </view>
          </template>
        </wd-table-col>
      </wd-table>
      <wd-fab position="right-bottom" :expandable="false">
        <template #trigger>
          <wd-button icon="refresh" @click="pushRefreshCourseInfo"> 刷新课表</wd-button>
        </template>
      </wd-fab>
    </view>
  </view>
</template>
<script setup>
import CustomNavbar from '../../components/CustomNavbar.vue'

import { ref, computed } from 'vue'
// 跳转刷新课表页面
function pushRefreshCourseInfo() {
  uni.navigateTo({
    url: '/pages/Schedule/RefreshCourseInfo'
  })
}

// 定义星期几的数据
const weekdays = ref([
  { prop: 'monday', label: '周一' },
  { prop: 'tuesday', label: '周二' },
  { prop: 'wednesday', label: '周三' },
  { prop: 'thursday', label: '周四' },
  { prop: 'friday', label: '周五' }
])

// 计算本周周一到周五的日期
const getWeekDates = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0是周日，1是周一，...，6是周六
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // 计算距离周一的天数

  const dates = []
  for (let i = 0; i < 5; i++) {
    // 周一到周五
    const date = new Date(today)
    date.setDate(today.getDate() + daysToMonday + i)

    const weekNames = ['周一', '周二', '周三', '周四', '周五']
    const month = date.getMonth() + 1
    const day = date.getDate()

    dates.push({
      value: i,
      weeks: weekNames[i],
      date: `${month}/${day}`
    })
  }

  return dates
}

// 获取当天是周几（0是周日，1是周一，...，6是周六）
const getTodayIndex = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  // 转换为数组索引（0=周一，1=周二，...，4=周五）
  // 如果是周日（0），则返回4（周五）
  return dayOfWeek === 0 ? 4 : dayOfWeek - 1
}

const list = ref(getWeekDates())
const current = ref(getTodayIndex())

// 判断当前项是否为激活状态
const isActive = index => {
  return current.value === index
}

// 课表数据
const scheduleData = ref([
  {
    period: '1',
    timeRange: '08:30\n10:00',
    monday: {
      name: '思想与政治教育',
      color: '#ffd700'
    },
    tuesday: {
      name: '产品设计工作坊',
      teacher: '梁建丽',
      location: '10-4101',
      color: '#87ceeb'
    },
    wednesday: {
      name: '雅思听说',
      teacher: '梁建丽',
      location: '10-4101',
      color: '#ffb6c1'
    },
    thursday: null,
    friday: null
  },
  {
    period: '2',
    timeRange: '10:15\n11:45',
    monday: {
      name: '思想与政治教育',
      color: '#ffd700'
    },
    tuesday: null,
    wednesday: null,
    thursday: {
      name: '思想与政治教育',
      teacher: '梁建丽',
      location: '10-4101',
      color: '#87ceeb'
    },
    friday: {
      name: '思想与政治教育',
      teacher: '梁建丽',
      location: '10-4101',
      color: '#90ee90'
    }
  },
  {
    period: '3',
    timeRange: '14:00\n15:30',
    monday: {
      name: '思想与政治教育',
      teacher: '梁建丽',
      location: '10-4101',
      color: '#ffb6c1'
    },
    tuesday: {
      name: '思想与政治教育',
      teacher: '梁建丽',
      location: '10-4101',
      color: '#dda0dd'
    },
    wednesday: null,
    thursday: null,
    friday: null
  },
  {
    period: '4',
    timeRange: '15:45\n17:15',
    monday: null,
    tuesday: {
      name: '大学体育',
      color: '#ffd700'
    },
    wednesday: null,
    thursday: {
      name: '高等数学',
      color: '#dda0dd'
    },
    friday: null
  }
])

// 处理课表数据，合并连续相同的课程（上午和下午分别处理）
const processedScheduleData = computed(() => {
  // 深拷贝原始数据
  const data = JSON.parse(JSON.stringify(scheduleData.value))

  // 定义星期几的字段
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

  // 找到上午和下午的分界点
  // 根据时间范围判断是上午还是下午课
  const isMorningClass = timeRange => {
    // 上午课的时间范围应该早于12:00
    const endTime = timeRange.split('\n')[1] // 获取结束时间
    if (!endTime) return false
    const hour = parseInt(endTime.split(':')[0])
    return hour < 12
  }

  // 遍历每一天
  weekdays.forEach(day => {
    // 分别处理上午和下午的课程
    let morningProcessed = false
    let afternoonProcessed = false

    // 先处理上午的课程（第1、2节）
    let i = 0
    // 找到上午课程的范围（假设前几节是上午课）
    const morningEndIndex = data.findIndex(item => !isMorningClass(item.timeRange))
    const endIndex = morningEndIndex === -1 ? data.length : morningEndIndex

    while (i < endIndex) {
      const currentSlot = data[i][day]

      // 如果当前时间段没有课程，继续下一个
      if (!currentSlot || currentSlot.visible === false) {
        i++
        continue
      }

      // 查找连续相同的课程（只在上午范围内查找）
      let j = i + 1
      let count = 1

      while (j < endIndex && data[j][day] && data[j][day].name === currentSlot.name) {
        count++
        j++
      }

      // 如果找到连续相同的课程
      if (count > 1) {
        // 设置第一个课程的rowSpan
        currentSlot.rowSpan = count

        // 隐藏后续相同的课程
        for (let k = i + 1; k < i + count; k++) {
          data[k][day].hidden = true
        }

        // 跳过已处理的课程
        i = j
      } else {
        // 单节课设置rowSpan为1
        currentSlot.rowSpan = 1
        i++
      }
    }

    // 再处理下午的课程
    let k = endIndex
    while (k < data.length) {
      const currentSlot = data[k][day]

      // 如果当前时间段没有课程，继续下一个
      if (!currentSlot || currentSlot.visible === false) {
        k++
        continue
      }

      // 查找连续相同的课程（只在下午范围内查找）
      let l = k + 1
      let count = 1

      while (l < data.length && data[l][day] && data[l][day].name === currentSlot.name) {
        count++
        l++
      }

      // 如果找到连续相同的课程
      if (count > 1) {
        // 设置第一个课程的rowSpan
        currentSlot.rowSpan = count

        // 隐藏后续相同的课程
        for (let m = k + 1; m < k + count; m++) {
          data[m][day].hidden = true
        }

        // 跳过已处理的课程
        k = l
      } else {
        // 单节课设置rowSpan为1
        currentSlot.rowSpan = 1
        k++
      }
    }
  })

  return data
})
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

//课表样式
.schedule-content {
  padding-top: 10px;
  :deep(.schedule-table) {
    background: none;
    .wd-table__header {
      display: none;
    }
    .wd-table-col {
      width: 20% !important;
      &:first-child {
        width: 60px !important;
        min-width: 60px !important;
        max-width: 60px !important;
        border-radius: 0 12px 12px 0;
        background: #fff;
      }
      .wd-table__cell {
        height: 120px !important;
        padding: 0;
        background: none;
        view {
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
      }
    }
  }
}
// 时间轴插槽样式
.time-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
// 课程卡片样式
.course {
  padding: 4px 2px 0 2px;
  :deep(.card) {
    width: 100%;
    margin: 0;
    padding: 3px 5px;
    display: flex;
    flex-direction: column;
    .wd-card__content {
      line-height: 1;
    }
    .wd-card__footer {
      line-height: 2;
      padding: 0;
    }
  }
  .other-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
}
</style>
