import { defineStore } from 'pinia'
import { scrapeClassSchedule } from '../api/classSchedule'
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  const courseInfo = ref()

  // 爬取课表信息
  async function scrapeCourseInfo(param) {
    try {
      await scrapeClassSchedule(param)
    } catch (error) {
      console.error(error)
    }
  }
  // 获取课表信息
  async function getCourseInfo(userId) {
    try {
      const data = await getClassSchedule(userId)
      console.log(data)
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
