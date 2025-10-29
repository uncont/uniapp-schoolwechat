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
    <view class="weater-info">
      <!-- 天气文本信息 -->
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
      <!-- 天气图标 -->
      <view class="content-img">
        <wd-img :width="100" :height="100" :src="joy" />
      </view>
    </view>
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
      <view class="schedule-info">
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
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
import CustomNavbar from '../../components/CustomNavbar.vue'

const joy = ref('/static/icon/weater.png')

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

function PushAllCourseInfo() {
  uni.navigateTo({ url: '/pages/Schedule/AllCourseInfo' })
}
</script>
<style lang="scss" scoped>
.schedule {
  background: linear-gradient(45deg, #f0f7fe 40%, #c4d9f4 75%, #b3c5fe 100%);
  :deep(.custom-nav) {
    background: transparent;
  }
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
      }
    }
    .other-info {
      display: flex;
      margin-top: 12px;
    }
  }
}
</style>
