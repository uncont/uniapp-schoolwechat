<template>
  <view class="course-timeline">
    <wd-steps vertical>
      <wd-step v-for="(course, index) in courses" :key="index">
        <template #icon>
          <view style="display: flex; align-items: center; justify-content: center">
            <wd-text :text="course.time" color="#333" size="18px" bold></wd-text>
          </view>
        </template>
        <template #title></template>
        <template #description>
          <view class="course-card">
            <wd-card custom-class="card" :custom-style="`background: ${course.color}` + '36'">
              <template #default>
                <wd-text :text="course.name" size="18px" bold :color="course.color"></wd-text>
              </template>
              <template #footer>
                <view class="other-info">
                  <wd-text text="老师：" :color="course.color" />
                  <wd-text :text="course.teacher" :color="course.color" />
                  <wd-text text=" | 教室" :color="course.color" />
                  <wd-text :text="course.classroom" :color="course.color" />
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
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
import { ref } from 'vue'

// 课表颜色方案 - 使用8位十六进制格式表示透明度
const courseColors = [
  '#e9805b', // 橙色
  '#a6c3ad', // 绿色
  '#8aabd6', // 蓝色
  '#d4a2c9', // 粉色
  '#9acbd6', // 青色
  '#e6b8a2', // 浅橙色
  '#b39ddb', // 紫色
  '#a5d6a7', // 浅绿色
  '#ffcc80', // 浅黄色
  '#f48fb1' // 浅粉色
]

// 课表背景色方案 - 使用8位十六进制格式表示透明度（20%透明度）
const courseBackgroundColors = [
  '#e9805b20', // 橙色背景
  '#a6c3ad20', // 绿色背景
  '#8aabd620', // 蓝色背景
  '#d4a2c920', // 粉色背景
  '#9acbd620', // 青色背景
  '#e6b8a220', // 浅橙色背景
  '#b39ddb20', // 紫色背景
  '#a5d6a720', // 浅绿色背景
  '#ffcc8020', // 浅黄色背景
  '#f48fb120' // 浅粉色背景
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
</script>
<style scoped lang="scss">
.course-timeline {
  padding: 0 20px;
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
