<template>
  <!-- 动态内容 -->
  <view class="postInfo" v-if="postsInfo">
    <!-- 导航栏 -->
    <view class="navbar">
      <CustomNavbar>
        <template>
          <wd-row custom-class="nav-row">
            <wd-col :span="4" custom-class="nav-col">
              <wd-img :width="36" :height="36" :round="true" :src="joy" />
            </wd-col>
            <wd-col :span="12" :offset="1">
              <view class="userName" custom-class="nav-col">
                <wd-text :text="postsInfo.authorName" color="#333"></wd-text>
                <wd-text :text="postsInfo.createTime" size="12px"></wd-text>
              </view>
            </wd-col>
          </wd-row>
        </template>
      </CustomNavbar>
    </view>
    <view class="content">
      <view class="card">
        <wd-card type="rectangle">
          <template #default>
            <wd-text :text="postsInfo.content" color="#333" mode="text" />
          </template>
        </wd-card>
      </view>
      <!--评论区 -->
      <view class="comment">
        <view class="segmented">
          <wd-row>
            <wd-col :span="8" :offset="1">
              <wd-text
                prefix="共"
                :text="postsInfo.commentCount"
                suffix="条回复"
                size="16px"
                lineHeight="32px"
              ></wd-text>
            </wd-col>
            <wd-col :span="10" :offset="4">
              <wd-segmented
                custom-class="custom-segmented"
                :options="list"
                v-model:value="current"
                size="small"
              />
            </wd-col>
          </wd-row>
        </view>
        <!-- 评论区 -->
        <view class="comment">
          <view class="comment-card" v-for="(comment, index) in commentList" :key="index">
            <wd-card
              type="rectangle"
              custom-class="custom-card"
              custom-title-class="custom-title"
              custom-content-class="custom-content"
              custom-footer-class="custom-footer"
            >
              <template #default>
                <view class="comment-info">
                  <wd-img :width="40" :height="40" :round="true" :src="joy" />
                  <view class="text-container">
                    <view class="user-info">
                      <wd-text :text="comment.authorName" size="14px" color="#333" weight="500" />
                      <wd-text :text="comment.createdTime" size="12px" color="#999" />
                    </view>
                    <wd-text :text="comment.content" color="#666" lineHeight="20px" />
                  </view>
                </view>
              </template>
              <template #footer></template>
            </wd-card>
          </view>
        </view>
      </view>
      <!-- 底部回复框 -->
      <view class="bottom">
        <wd-tabbar fixed bordered safeAreaInsetBottom placeholder>
          <wd-search placeholder-left placeholder="写回复..." custom-class="custom-search">
            <template #suffix>
              <view class="menu">
                <wd-grid clickable>
                  <wd-grid-item icon="picture" />
                  <wd-grid-item icon="picture" />
                  <wd-grid-item icon="picture" />
                  <wd-grid-item icon="picture" />
                </wd-grid>
              </view>
            </template>
          </wd-search>
        </wd-tabbar>
      </view>
    </view>
  </view>
  <!-- 加载动画 -->
  <view class="loading" v-else>
    <CustomNavbar>
      <template>
        <wd-text text="正在加载..." color="#333"></wd-text>
      </template>
    </CustomNavbar>
    <wd-status-tip tip="正在加载动态数据">
      <template #image>
        <wd-loading type="outline" />
      </template>
    </wd-status-tip>
  </view>
</template>
,
<script setup>
import CustomNavbar from '@/components/CustomNavbar'
import { computed, onMounted, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { usePostsStore } from '../../stores/PostsInfo'

const postsStore = usePostsStore()

// 评论分段器
const list = ref(['评论', '点赞', '贡献', '打赏'])
const current = ref('点赞')
//动态信息
const postsInfo = ref(null)
const commentList = computed({
  get: () => postsInfo.value.commentList
})

const joy = ref('https://wot-ui.cn/assets/redpanda.jpg')
// 查询参数
const postsId = ref()
onLoad(options => {
  postsId.value = options.postsId
})

onMounted(async () => {
  const data = {
    postsId: postsId.value
  }
  postsInfo.value = await postsStore.getPostsInfo(data)
  console.log(commentList.value)
})
defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
</script>

<style scoped lang="scss">
/* 导航栏相关样式 */
.navbar {
  :deep(.wd-navbar__title) {
    margin-left: 48px;
  }
  :deep(.nav-row) {
    height: 100%;
  }
  :deep(.nav-col) {
    padding-top: 4px;
    height: 100%;
  }
  /* 用户名区域样式 */
  .userName {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    line-height: 22px;
  }
}

/* 底部搜索栏相关样式 */
.bottom {
  :deep(custom-search) {
    width: 100%;
  }
  :deep(.wd-search__search-left-icon::before) {
    content: '\e71e';
  }
}

/* 菜单网格相关样式 */
.menu {
  width: 200px;
  :deep(.wd-grid-item__text) {
    margin: 0;
  }
}

/* 评论卡片相关样式 */
.comment-card {
  :deep(.custom-title) {
    padding: 0;
  }
  :deep(.custom-content::after) {
    display: none !important;
  }
}

.comment-info {
  display: flex;
  align-items: flex-start;
  .text-container {
    margin-left: 6px;
    flex: 1;
    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 6px;
    }
  }
}
</style>
