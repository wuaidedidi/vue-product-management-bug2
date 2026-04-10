# 商品管理平台后台系统

一个基于 Vue 3 + Element Plus 的现代化商品管理后台系统，采用纯前端架构，使用 localStorage 模拟数据存储。

## 🛠 技术栈

- **Frontend**: Vue 3 + Element Plus + Vite
- **Backend**: None（纯前端）
- **Database**: None（使用 localStorage 模拟）

## ✨ 功能特性

### 用户认证
- 🔐 登录/注册系统（含表单验证）
- 🎭 演示账号快速填充
- 🛡️ 路由守卫（未登录自动跳转）
- 👥 角色权限控制（管理员/普通用户）

### 仪表盘
- 📊 数据统计卡片（销售额、订单、商品、用户）
- 📈 销售趋势图表（支持周/月/年切换）
- 🥧 商品分类占比图
- ⚡ 快捷操作入口
- 📋 最近订单列表

### 商品管理
- 📦 商品列表（分页、搜索、筛选）
- 🏷️ 分类管理（含统计图表）
- ✏️ 商品增删改查
- 🔄 上下架操作

### 订单管理
- 📑 订单列表（状态筛选、日期筛选）
- 👁️ 订单详情弹窗（状态时间线）
- 🚚 订单发货/取消

### 用户管理
- 👤 用户列表（搜索、筛选）
- 🎖️ 角色权限管理（单选）
- 🔒 用户启用/禁用
- 🛡️ 管理员保护逻辑

### 个人中心
- 📝 个人信息编辑
- 🔑 修改密码

### 系统设置
- 📋 操作日志

## 🚀 快速启动

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 服务地址
- **Frontend**: http://localhost:3000

### 构建生产版本
```bash
npm run build
```

## 🧪 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | 123456 |
| 普通用户 | user | 123456 |

> 管理员可访问所有功能，普通用户无法访问用户管理和系统设置

## 📁 项目结构

```
src/
├── assets/styles/       # 全局样式
├── layout/              # 布局组件
│   ├── MainLayout.vue
│   └── components/
│       ├── Sidebar.vue
│       └── Header.vue
├── router/              # 路由配置
├── stores/              # Pinia 状态管理
├── views/               # 页面组件
│   ├── auth/            # 登录/注册
│   ├── dashboard/       # 仪表盘
│   ├── product/         # 商品管理
│   ├── order/           # 订单管理
│   ├── user/            # 用户管理
│   ├── profile/         # 个人中心
│   ├── system/          # 系统设置
│   └── error/           # 错误页面
├── mock/                # Mock数据初始化
├── App.vue
└── main.js
```

## 📝 数据存储

项目使用 `localStorage` 模拟后端数据存储：
- `admin_token` - 用户登录Token
- `admin_user` - 用户信息
- `mock_products` - 商品数据
- `mock_categories` - 分类数据
- `mock_orders` - 订单数据
- `mock_users` - 用户数据
- `mock_logs` - 操作日志

## 📄 License

MIT License
