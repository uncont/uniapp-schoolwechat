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
            <wd-steps :active="active" align-center>
              <wd-step title="步骤1" description="保存二维码" />
              <wd-step title="步骤2" description="打开微信扫码登录" />
              <wd-step title="步骤3" description="爬取课表信息" />
            </wd-steps>
          </view>
        </template>
        <template #default>
          <view class="QRCode">
            <wd-img
              width="260px "
              height="260px"
              :src="QRCode"
              show-menu-by-longpress
              @load="active = 1"
            >
              <template #error>
                <view class="error-wrap">
                  <wd-button @click="reGetQRCode" icon="refresh" type="text"
                    >点击重新获取二维码</wd-button
                  >
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
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { getQRCode } from '@/api/classSchedule'
import { useCourseStore } from '@/stores/CourseInfo'

const courseStore = useCourseStore()
const QRCode = ref('')
const active = ref(0)
const param = reactive({
  ticket: '',
  userId: ''
})
// 声明定时器变量
let errorTimer = null
const scrapeCourseInfo = async () => {
  try {
    await courseStore.scrapeCourseInfo(param)
  } catch (error) {}
}

async function reGetQRCode() {
  const res = await getQRCode()
  QRCode.value = res.base64Image || ''
  param.ticket = res.ticket
}

onMounted(() => {
  reGetQRCode()
  // 设置定时器，让用户重新获取二维码
  errorTimer = setTimeout(() => {
    QRCode.value = 'data:image/png;base64,invalid_base64_string'
  }, 20000)
})

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (errorTimer) {
    clearTimeout(errorTimer)
    errorTimer = null
  }
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
  .loading-wrap,
  .error-wrap {
    background: rgb(51, 51, 51, 0.1);
  }
}
</style>
