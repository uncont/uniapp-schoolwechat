import { defineStore } from 'pinia'

export const useCounrseStore = defineStore('course', () => {
  const courseInfo = ref()
  return { courseInfo }
})
