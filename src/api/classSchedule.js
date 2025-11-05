import request from '@/utils/request'

export function getQRCode() {
  return request({
    url: `/ClassSchedule/getQRCode`,
    method: 'GET',
    needToken: true
  })
}
// 爬取课表信息
export function scrapeClassSchedule(data) {
  return request({
    url: `/ClassSchedule/scrapeClassSchedule`,
    method: 'GET',
    data: data,
    needToken: true
  })
}
export function getClassSchedule(userId) {
  return request({
    url: `/ClassSchedule/getClassSchedule`,
    method: 'GET',
    data: userId,
    needToken: true
  })
}
