import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { scrapeClassSchedule, getClassSchedule } from '../api/classSchedule'
import { ref } from 'vue'

const userStore = useUserStore()
const { userId } = storeToRefs(userStore)

export const useCourseStore = defineStore('course', () => {
  const courseInfo = ref(uni.getStorageSync('courseInfo') || null)

  // 爬取课表信息
  async function scrapeCourseInfo(param) {
    param.userId = userId.value
    try {
      await scrapeClassSchedule(param)
    } catch (error) {
      console.error(error)
    }
  }
  // 获取课表信息
  async function getCourseInfo() {
    try {
      const params = {
        userId: userId.value
      }
      const data = await getClassSchedule(params)
      courseInfo.value = data.schedule_item
      if (courseInfo.value) {
        uni.setStorageSync('courseInfo', courseInfo.value)
      } else {
        uni.removeStorageSync('courseInfo')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    courseInfo,
    scrapeCourseInfo,
    getCourseInfo
  }
})
