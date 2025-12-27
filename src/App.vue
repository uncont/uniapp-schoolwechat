<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import websocket from "./utils/websocket";
import {useUserStore} from "./stores/user";

// 获取用户信息
const userStore = useUserStore()

// 用户Id
const userId = userStore?.userId || 0

// 配置选项
const options = {
  virtualHost: true
}

// 应用生命周期
onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
  // 延迟启动 WebSocket，确保 store 已初始化
  setTimeout(() => {
    const userId = userStore?.userId || 0
    websocket.initWebSocket(userId)
  }, 1000) // 延迟1000ms启动
})

onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
.fixed-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(115deg, #6eb1ff 0%, #a3cdff 20%, #e49ade 100%);
  z-index: -1;
}

.warp {
  width: 100vw;
  min-height: 100vh;
}
</style>
