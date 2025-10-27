<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

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
})

onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
.warp {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(115deg, #6eb1ff 0%, #a3cdff 20%, #e49ade 100%);
}
</style>
