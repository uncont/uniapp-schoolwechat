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
      const routeToIndexMap = {
        '/pages/index/index': 0,
        '/pages/Message/MessageList': 1,
        '/pages/ShoppingCat/ShoppingCat': 3,
        '/pages/Mine/MineIndex': 4
      }
      if (routePath && routeToIndexMap.hasOwnProperty(routePath)) {
        this.tabbarIndex = routeToIndexMap[routePath]
      }
    }
  }
})
