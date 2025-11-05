<template>
  <view class="course-timeline">
    <wd-steps vertical>
      <wd-step v-for="(course, index) in courses" :key="index">
        <!-- 时间 -->
        <template #icon>
          <view class="time">
            <wd-text :text="course.time" color="#333" size="18px" bold></wd-text>
          </view>
        </template>
        <template #title />
        <!-- 课程卡片 -->
        <template #description>
          <view class="course-card">
            <wd-card custom-class="card" :custom-style="`background: ${course.color}` + '36'">
              <template #default>
                <wd-text :text="course.name" size="18px" bold :color="course.color"></wd-text>
              </template>
              <template #footer>
                <view class="other-info">
                  <wd-text
                    :text="`老师：${course.teacher} | 教室:${course.classroom}`"
                    :color="course.color"
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
import { ref } from 'vue'

// 课表颜色方案 - 使用8位十六进制格式表示透明度
const courseColors = [
  '#e9805b',
  '#a6c3ad',
  '#8aabd6',
  '#d4a2c9',
  '#9acbd6',
  '#e6b8a2',
  '#b39ddb',
  '#a5d6a7',
  '#ffcc80',
  '#f48fb1'
]

// 课表背景色方案 - 使用8位十六进制格式表示透明度（20%透明度）
const courseBackgroundColors = [
  '#e9805b20',
  '#a6c3ad20',
  '#8aabd620',
  '#d4a2c920',
  '#9acbd620',
  '#e6b8a220',
  '#b39ddb20',
  '#a5d6a720',
  '#ffcc8020',
  '#f48fb120'
]
// 课程信息数据
const courses = ref([
  {
    time: '8:30',
    name: '大学生创业基础',
    color: courseColors[0],
    backgroundColor: courseBackgroundColors[0],
    teacher: '张萌',
    classroom: '春晗楼404'
  },
  {
    time: '10:30',
    name: '高等数学',
    color: courseColors[1],
    backgroundColor: courseBackgroundColors[1],
    teacher: '李老师',
    classroom: '春晗楼302'
  },
  {
    time: '14:00',
    name: '大学英语',
    color: courseColors[2],
    backgroundColor: courseBackgroundColors[2],
    teacher: '王老师',
    classroom: '春晗楼201'
  },
  {
    time: '16:00',
    name: '计算机基础',
    color: courseColors[3],
    backgroundColor: courseBackgroundColors[3],
    teacher: '陈老师',
    classroom: '实验楼A101'
  },
  {
    time: '19:00',
    name: '体育课',
    color: courseColors[4],
    backgroundColor: courseBackgroundColors[4],
    teacher: '张教练',
    classroom: '操场'
  }
])
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
