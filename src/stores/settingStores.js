import { defineStore } from 'pinia'

export const useSettingStores = defineStore('settingStores', {
  state: () => ({
    tabbarIndex: 0
  }),
  actions: {
    setTabbarIndex(index) {
      this.tabbarIndex = index
    },
    setTabbarIndexByRoute(routePath) {
      // Map route path to tab index for custom tabbar
      const routeToIndexMap = {
        '/pages/index/index': 0,
        '/pages/Mine/MineIndex': 3
      }
      if (routePath && routeToIndexMap.hasOwnProperty(routePath)) {
        this.tabbarIndex = routeToIndexMap[routePath]
      }
    }
  }
})


