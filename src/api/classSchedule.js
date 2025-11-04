import request from '@/utils/request'

export function getQRCode() {
  return request({
    url: `/ClassSchedule/getQRCode`,
    method: 'GET',
    needToken: true
  })
}
