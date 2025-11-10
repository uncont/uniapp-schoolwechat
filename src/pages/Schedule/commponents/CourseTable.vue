<template>
  <view class="schedule-content">
    <wd-table
      :data="processedScheduleData"
      custom-class="schedule-table"
      :stripe="false"
      :border="false"
    >
      <wd-table-col prop="time" label="时间" custom-class="time-col" align="center">
        <template #value="{ row }">
          <view class="time-slot">
            <wd-text color="#333" :text="`${row.period}\n${row.timeRange}`" />
          </view>
        </template>
      </wd-table-col>
      <wd-table-col
        v-for="(weekday, index) in weekdays"
        :key="index"
        :prop="weekday.prop"
        :label="weekday.label"
      >
        <template #value="{ row }">
          <view class="course" v-if="row[weekday.prop]">
            <wd-card
              custom-class="card"
              :custom-style="`height: ${row[weekday.prop]?.rowspan ? '200px' : '100px'}; background-color: ${getCourseColor(row[weekday.prop], 'background')};`"
            >
              <template #default>
                <!-- 根据节次分组规则显示标签 -->
                <wd-text
                  :text="row[weekday.prop].courseName"
                  bold
                  size="10px"
                  :custom-style="`color: ${getCourseColor(row[weekday.prop], 'text')}`"
                />
              </template>
              <template #footer>
                <view class="other-info">
                  <wd-text
                    :text="`${row[weekday.prop].teacher}\n${row[weekday.prop].location}`"
                    size="8px"
                    :custom-style="`color: ${getCourseColor(row[weekday.prop], 'text')}`"
                  />
                </view>
              </template>
            </wd-card>
          </view>
        </template>
      </wd-table-col>
    </wd-table>
  </view>
</template>
<script setup>
import { useCourseStore } from '@/stores/CourseInfo'
import { computed } from 'vue'
import {
  buildWeekdays,
  buildScheduleTableData,
  generateCourseId,
  getCourseColors
} from '@/utils/schedule'

// 课表仓库
const courseStore = useCourseStore()

// 初始化课表数据
const courseInfo = computed(() => {
  return courseStore.courseInfo
})
const weekdays = computed(() => {
  return buildWeekdays()
})

// 存储课程颜色数据的Map
const courseColorsMap = new Map()

const processedScheduleData = computed(() => {
  const Data = buildScheduleTableData(courseInfo.value)

  // 过滤掉晚上没有课程的时间行（period 6, 7, 8）
  return Data.filter(row => {
    // 对于晚上节次（period 6, 7, 8），只有当至少有一天有课程时才保留
    if (['6', '7', '8'].includes(row.period)) {
      // 检查周一到周五是否有任何课程
      return weekdays.value.some(weekday => row[weekday.prop])
    }
    // 其他行保持不变
    return true
  })
})

/**
 * 获取课程颜色
 * @param {Object} course - 课程对象
 * @param {string} type - 颜色类型 ('background' 或 'text')
 * @returns {string} 颜色值
 */
const getCourseColor = (course, type) => {
  // 构造与CourseTimeline.vue中一致的课程对象结构
  const courseObj = {
    courseName: course.courseName,
    teacher: course.teacher,
    classroom: course.location
  }

  const courseId = generateCourseId(courseObj)

  // 如果已缓存该课程颜色，则直接返回
  if (courseColorsMap.has(courseId)) {
    return type === 'background'
      ? courseColorsMap.get(courseId).backgroundColor
      : courseColorsMap.get(courseId).textColor
  }

  // 否则计算并缓存颜色
  const colors = getCourseColors(courseObj, { withOpacity: true, opacity: '36' })
  courseColorsMap.set(courseId, colors)

  return type === 'background' ? colors.backgroundColor : colors.textColor
}

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
</script>
<style scoped lang="scss">
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
        height: 100px !important;
        padding: 0;
        background: none;
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
  height: 100px;
  :deep(.card) {
    width: 100%;
    margin: 0;
    padding: 3px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
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
