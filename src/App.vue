<script>
export default {
  options: {
    virtualHost: true
  },
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>
<style lang="scss">
.warp {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(115deg, #6eb1ff 0%, #a3cdff 20%, #e49ade 100%);
}
</style>
