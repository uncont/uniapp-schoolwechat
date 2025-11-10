<template>
  <view class="course-timeline">
    <wd-steps vertical>
      <wd-step v-for="(course, index) in props.courseInfo" :key="index">
        <!-- 时间 -->
        <template #icon>
          <view class="time">
            <wd-text
              :text="getTimeRange(course.classSections)"
              color="#333"
              size="18px"
              bold
            ></wd-text>
          </view>
        </template>
        <template #title />
        <!-- 课程卡片 -->
        <template #description>
          <view class="course-card">
            <wd-card
              custom-class="card"
              :custom-style="`background: ${getCourseColor(course, 'background')}`"
            >
              <template #default>
                <wd-text
                  :text="course.courseName"
                  size="18px"
                  bold
                  :color="getCourseColor(course, 'text')"
                ></wd-text>
              </template>
              <template #footer>
                <view class="other-info">
                  <wd-text
                    :text="`老师：${course.teacher} | 教室:${course.classroom}`"
                    :color="getCourseColor(course, 'text')"
                  />
                </view>
              </template>
            </wd-card>
          </view>
        </template>
      </wd-step>
    </wd-steps>
  </view>
</template>
<script setup>
import { buildTimeSchedule, generateCourseId, getCourseColors } from '@/utils/schedule'

// 生成时间表
const timeSchedule = buildTimeSchedule()

// 存储课程颜色数据的Map
const courseColorsMap = new Map()

const props = defineProps({
  courseInfo: {
    type: Array,
    required: true
  }
})

/**
 * 获取指定节次的时间范围
 * @param {number} section - 节次[]
 * @returns {string} 时间范围字符串
 */
const getTimeRange = section => {
  const startTime = timeSchedule[section[0]].split('\n')[0]
  const endTime = timeSchedule[section.at(-1)].split('\n')[1]
  return `${startTime}\n${endTime}`
}

/**
 * 获取课程颜色
 * @param {Object} course - 课程对象
 * @param {string} type - 颜色类型 ('background' 或 'text')
 * @returns {string} 颜色值
 */
const getCourseColor = (course, type) => {
  const courseId = generateCourseId(course)

  // 如果已缓存该课程颜色，则直接返回
  if (courseColorsMap.has(courseId)) {
    return type === 'background'
      ? courseColorsMap.get(courseId).backgroundColor
      : courseColorsMap.get(courseId).textColor
  }

  // 否则计算并缓存颜色
  const colors = getCourseColors(course, { withOpacity: true, opacity: '36' })
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
.course-timeline {
  padding: 0 20px;
  .time {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .course-card {
    :deep(.card) {
      padding: 10px 20px;
      margin: 0 0 0 40px;
    }
  }
  .other-info {
    display: flex;
    margin-top: 12px;
  }
}
</style>
