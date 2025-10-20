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
  background-color: rgba($color: #000000, $alpha: 0.2);
}
</style>
