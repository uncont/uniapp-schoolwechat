export function testApi() {
  uni.request({
    url: '/captchaImage',
    method: 'GET',
    success: res => {
      console.log(res.data)
    },
    fail: err => {
      console.error(err)
    }
  })
}
