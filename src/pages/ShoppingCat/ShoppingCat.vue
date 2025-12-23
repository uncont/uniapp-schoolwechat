<template>
  <view class="shopping-cart-page">
    <!-- 顶部导航栏 -->
    <view class="navbar-wrapper">
      <wd-navbar custom-class="custom-nav" fixed :bordered="false" placeholder safeAreaInsetTop>
        <template #title>
          <slot>
            <view class="title">
              <wd-text text="购物车" color="#000" bold />
            </view>
          </slot>
        </template>
      </wd-navbar>
    </view>

    <view class="page-body">
      <!-- 订单类型分段器 -->
      <view class="order-tabs">
        <wd-segmented
          :options="orderTabs"
          v-model:value="orderType"
          custom-class="order-segmented"
        />
      </view>
      <!-- 购物车商品列表 -->
      <scroll-view class="cart-scroll" scroll-y>
        <!-- 遍历当前类型的商品 -->
        <view v-for="item in filteredCartList" :key="item.id">
          <wd-card>
            <template #default>
              <view class="cart-item">
                <view class="left">
                  <!-- 商品选择框 -->
                  <view class="check-box">
                    <wd-checkbox v-model="value" @change="handleChange" />
                  </view>
                  <!-- 商品图片 -->
                  <wd-img :width="84" :height="84" radius="6px" :src="item.image" />
                </view>

                <!-- 商品详细信息 -->
                <view class="right">
                  <!-- 商品标题 -->
                  <view class="goods-title">
                    <wd-text :text="item.title" bold color="#333" />
                  </view>
                  <!-- 商品描述 -->
                  <view class="goods-sub">
                    <wd-text :text="item.desc" size="12px" color="#7f8c8d" />
                  </view>
                  <!-- 价格区域 -->
                  <view class="goods-price-row">
                    <view class="price-left">
                      <!-- 原价（如果有） -->
                      <view class="old-price" v-if="item.originPrice">
                        <text class="old-price-prefix">原价</text>
                        <text class="old-price-value">¥{{ item.originPrice }}</text>
                      </view>
                      <!-- 当前价格 -->
                      <view class="now-price">
                        <wd-text :text="`¥${item.price}`" color="#16a085" bold size="18px" />
                      </view>
                    </view>
                    <!-- 数量操作区 -->
                    <view>
                      <wd-input-number
                        v-model="InputNumberValue"
                        @change="InputNumberhandleChange"
                      />
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </wd-card>
        </view>

        <!-- 空购物车提示 -->
        <view v-if="!filteredCartList.length" class="empty">
          <wd-status-tip image="cart" text="购物车还是空的，去逛逛吧～" />
        </view>
      </scroll-view>

      <!-- 底部结算栏 -->
      <view class="cart-footer">
        <!-- 全选按钮 -->
        <view class="footer-left" @click="toggleAll">
          <view class="check-circle small" :class="{ 'check-circle--active': isAllChecked }">
            <wd-icon v-if="isAllChecked" name="check" size="14px" color="#10c469" />
          </view>
          <wd-text text="全选" color="#333" />
        </view>
        <!-- 总价显示 -->
        <view class="footer-center">
          <wd-text text="合计：" color="#333" size="14px" />
          <wd-text :text="`¥${totalPrice}`" color="#e74c3c" bold size="20px" />
        </view>
        <!-- 结算按钮 -->
        <view class="footer-right">
          <wd-button type="success" round custom-class="checkout-btn" :disabled="!selectedCount">
            去结算({{ selectedCount }})
          </wd-button>
        </view>
      </view>

      <wd-gap safe-area-bottom height="60"></wd-gap>
    </view>
  </view>
  <CustomTabbar />
</template>

<script setup>
import CustomTabbar from '@/components/CustomTabbar.vue'
import { computed, ref } from 'vue'

// 订单类型选项
const orderTabs = ref(['二手购物订单', '租借好物订单', '拼车订单'])
const orderType = ref('二手购物订单')

// 购物车商品数据
const cartList = [
  {
    id: 1,
    type: 0, // 0: 二手购物订单
    checked: true,
    title: '大疆 Mini 3 Pro 无人机',
    desc: '95新 · 无划痕 · 含遥控器',
    originPrice: 4599,
    price: 3800,
    tag: '企业租赁',
    count: 1,
    image: 'https://wot-ui.cn/assets/redpanda.jpg'
  },
  {
    id: 2,
    type: 0,
    checked: false,
    title: '任天堂 Switch OLED',
    desc: '98新 · 原装配件齐全',
    originPrice: 0,
    price: 1800,
    tag: '',
    count: 1,
    image: 'https://wot-ui.cn/assets/redpanda.jpg'
  },
  {
    id: 3,
    type: 1, // 1: 租借好物订单
    checked: true,
    title: '苹果 MacBook Pro 14英寸',
    desc: 'M2芯片 16GB+512GB 银色',
    originPrice: 15999,
    price: 13800,
    tag: '学生专享',
    count: 1,
    image: 'https://wot-ui.cn/assets/redpanda.jpg'
  },
  {
    id: 4,
    type: 1,
    checked: false,
    title: '索尼 WH-1000XM4 降噪耳机',
    desc: '99新 仅使用1个月 盒装齐全',
    originPrice: 2299,
    price: 1680,
    tag: '',
    count: 2,
    image: 'https://wot-ui.cn/assets/redpanda.jpg'
  },
  {
    id: 5,
    type: 2, // 2: 拼车订单
    checked: true,
    title: '周末拼车回家',
    desc: '周五晚6点从学校东门出发至市中心',
    originPrice: 50,
    price: 40,
    tag: '长途拼车',
    count: 4,
    image: 'https://wot-ui.cn/assets/redpanda.jpg'
  }
]

// 订单类型映射关系
const orderTypeMap = {
  二手购物订单: 0,
  租借好物订单: 1,
  拼车订单: 2
}

// 根据当前选中的订单类型过滤商品列表
const filteredCartList = computed(() => {
  const currentType = orderTypeMap[orderType.value]
  return cartList.filter(item => item.type === currentType)
})

// 判断是否全选
const isAllChecked = computed(() => {
  const list = filteredCartList.value
  if (!list.length) return false
  return list.every(item => item.checked)
})

// 计算已选商品总数
const selectedCount = computed(() =>
  filteredCartList.value.reduce((sum, item) => (item.checked ? sum + item.count : sum), 0)
)

// 计算已选商品总价格
const totalPrice = computed(() =>
  filteredCartList.value
    .reduce((sum, item) => (item.checked ? sum + item.price * item.count : sum), 0)
    .toFixed(2)
)

/**
 * 切换全选状态
 */
function toggleAll() {
  const target = !isAllChecked.value
  filteredCartList.value.forEach(item => {
    item.checked = target
  })
}

const value = ref(true)
// 复选框操作
function handleChange(value) {
  console.log(value)
}
//计数器操作
const InputNumberValue = ref(1)
function InputNumberhandleChange({ value }) {
  console.log(value)
}
</script>

<style scoped lang="scss">
.shopping-cart-page {
  position: relative;
  height: 100vh;
  background: #f5f7fb;
  display: flex;
  flex-direction: column;
}

.page-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

// 订单类型分段器样式
.order-tabs {
  padding: 8px;
  :deep(.order-segmented) {
    .wd-segmented {
      border-radius: 24px;
      background-color: #e9f5ff;
    }
  }
}

// 商品滚动区域
.cart-scroll {
  flex: 1;
  padding: 0 0px 20px;
  box-sizing: border-box;
}

.cart-item {
  display: flex;
  align-items: flex-start;
}

.check-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #d0d4dc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  // 选中状态样式
  &--active {
    border-color: #10c469;
    background-color: #e9f9f1;
  }

  // 小尺寸样式（用于底部全选按钮）
  &.small {
    width: 20px;
    height: 20px;
  }
}

.goods-title {
  margin-bottom: 4px;
}

.goods-sub {
  margin-bottom: 6px;
}

.goods-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.price-left {
  display: flex;
  flex-direction: column;
}

.old-price {
  font-size: 12px;
  color: #bdc3c7;
  text-decoration: line-through;
  margin-bottom: 2px;

  .old-price-prefix {
    margin-right: 4px;
  }
}

.num-display {
  margin: 0 6px;
  padding: 0 10px;
  height: 26px;
  border-radius: 13px;
  background-color: #1c1f23;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 空状态样式
.empty {
  padding-top: 40px;
}

// 底部结算栏
.cart-footer {
  padding: 10px 12px 12px;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-center {
  flex: 1;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.footer-right {
  margin-left: 8px;
}
</style>
