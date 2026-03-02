# my-vue3-project

基于 UniApp 框架构建的跨平台前端应用，使用 Vue 3 技术栈实现现代化用户界面，支持多端（如微信小程序、H5、支付宝等）统一开发。

## 项目简介

这是一个专为高校学生或校园社区用户打造的应用，旨在解决校园生活场景下的信息聚合与交互需求，提升移动端多平台兼容性与开发效率。主要功能包括课程表管理、二手交易、租房信息、社交发帖、私信互动等。

## 功能特性

- **首页动态流**: 展示热门话题、用户关注内容和帖子卡片
- **课程表管理**: 查看、刷新、编辑课表信息，集成天气显示
- **社交发帖系统**: 发布/查看帖子、评论、点赞
- **消息中心**: 私信列表与详情查看
- **个人中心**: 用户个人信息与设置管理
- **二手市场 & 租房市场**: 商品/房源浏览与详情查看

## 技术栈

- **前端框架**: Vue 3.5.11
- **工程框架**: UniApp 3.0.0-4060420250429001
- **状态管理**: Pinia ^3.0.3
- **国际化**: vue-i18n ^9.1.9
- **UI 库**: wot-design-uni ^1.12.4（UniApp 兼容组件库）
- **构建工具**: Vite 5.2.8 + `@dcloudio/vite-plugin-uni`
- **样式处理**: Sass ^1.78.0
- **代码规范**: ESLint ^9.35.0 + Prettier ^3.6.2

## 目录结构

```
src/
├── api/                    # 接口定义
│   ├── classSchedule.js
│   ├── posts.js
│   ├── privateMessage.js
│   └── user.js
├── assets/                 # 静态资源
│   └── iconfont/           # 字体图标
├── components/             # 公共组件
├── pages/                  # 页面模块
│   ├── Form/               # 表单相关页面
│   ├── Message/            # 消息相关页面
│   ├── Mine/               # 个人中心
│   ├── PostDetails/        # 帖子详情
│   ├── Rent/               # 租房模块
│   ├── Schedule/           # 课程表模块
│   ├── SecondHand/         # 二手市场
│   ├── ShoppingCat/        # 购物车
│   └── index/              # 首页相关
├── stores/                 # 状态管理 (Pinia)
├── utils/                  # 工具函数
│   ├── comments.js
│   ├── like.js
│   ├── oss.js
│   ├── request.js
│   ├── schedule.js
│   └── websocket.js
├── App.vue                 # 根组件
├── main.js                 # 主入口文件
├── pages.json              # 页面路由配置
└── manifest.json           # 应用配置文件
```

## 安装与运行

### 环境准备

- Node.js >= 16.0
- npm / yarn / pnpm
- Vue 3 兼容的 IDE（如 VSCode）

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 运行项目

```bash
# 本地开发 H5
npm run dev:h5

# 开发微信小程序
npm run dev:mp-weixin

# 开发其他平台 (如支付宝、百度等)
npm run dev:mp-alipay  # 支付宝小程序
npm run dev:mp-baidu   # 百度小程序
# 更多平台请参考 package.json 中的 scripts 配置

# 构建 H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin

# 代码格式化
npm run format

# 代码检查与修复
npm run lint
```

## 项目特色

- **多端适配**: 通过 UniApp 支持微信小程序、H5、快应用等多个平台
- **状态管理**: 使用 Pinia 进行全局状态管理（如用户、消息、课程信息）
- **组件复用**: 封装通用组件如导航栏、标签栏、加载动画等
- **API 分层**: 接口请求独立在 `api/` 目录，便于维护
- **优化体验**: 包含防重复提交、节流、乐观更新等优化措施

## 注意事项

- UniApp 对 Vue 3 的部分 Composition API 支持可能存在差异（尤其在小程序端）
- 多端行为一致性需手动测试验证
- 小程序包大小控制在 2MB 以内（主包）
- 图片资源建议使用 CDN 或 OSS 加载（见 `utils/oss.js`）
