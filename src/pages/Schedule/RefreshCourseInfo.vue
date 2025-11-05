<template>
  <view class="refresh-courseInfo">
    <CustomNavbar>
      <template>
        <view class="title">
          <wd-text text="获取课表" color="#333" />
        </view>
      </template>
    </CustomNavbar>
    <!-- 账号表单 -->
    <view class="form">
      <wd-img
        width="100%"
        height="200px"
        src="https://portal.ywicc.edu.cn/Img/Beautiful.png"
        custom-class="bg-image"
      />
      <wd-gap bg-color="transparent" height="160px"></wd-gap>
      <wd-card>
        <template #title>
          <view class="title">
            <wd-text text="长按保存二维码，打开微信扫一扫" color="#333" bold size="18px" />
          </view>
        </template>
        <template #default>
          <view class="QRCode">
            <wd-img width="260px " height="260px" :src="QRCode" show-menu-by-longpress>
              <template #error>
                <view class="error-wrap">
                  <wd-button>点击重新获取二维码</wd-button>
                </view>
              </template>
              <template #loading>
                <view class="loading-wrap">
                  <wd-loading />
                </view>
              </template>
            </wd-img>
          </view>
        </template>
        <template #footer>
          <view class="button">
            <wd-button @click="scrapeCourseInfo">获取课表</wd-button>
          </view>
        </template>
      </wd-card>
    </view>
  </view>
</template>
<script setup>
import CustomNavbar from '@/components/CustomNavbar.vue'
import { ref, onMounted, reactive } from 'vue'
import { getQRCode } from '@/api/classSchedule'
import { useCourseStore } from '@/stores/CourseInfo'

const courseStore = useCourseStore()
const QRCode = ref('')
const param = reactive({
  ticket: '',
  userId: ''
})

const scrapeCourseInfo = async () => {
  try {
    await courseStore.scrapeCourseInfo(param)
  } catch (error) {}
}

onMounted(async () => {
  const res = await getQRCode()
  QRCode.value = res.base64Image || ''
  param.ticket = res.ticket
})
</script>
<style lang="scss" scoped>
.refresh-courseInfo {
  background: rgb(51, 51, 51, 0.1);
  min-height: 100vh;
}
.form {
  :deep(.bg-image) {
    position: fixed;
    top: 91;
    left: 0;
    z-index: -1;
  }
  .QRCode,
  .loading-wrap,
  .error-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
