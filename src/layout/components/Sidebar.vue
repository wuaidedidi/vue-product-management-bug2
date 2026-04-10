<template>
  <div class="sidebar">
    <!-- Logo 区域 -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <el-icon :size="28"><Goods /></el-icon>
      </div>
      <transition name="fade">
        <span v-show="!collapsed" class="logo-text">商品管理平台</span>
      </transition>
    </div>

    <!-- 菜单 -->
    <el-scrollbar class="sidebar-menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :collapse-transition="false"
        background-color="transparent"
        text-color="rgba(255,255,255,0.75)"
        active-text-color="#ffffff"
        router
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="route.children && route.children.length > 1" :index="'/' + route.path">
            <template #title>
              <el-icon><component :is="route.meta.icon" /></el-icon>
              <span>{{ route.meta.title }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="`/${route.path}/${child.path}`"
            >
              {{ child.meta.title }}
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单或只有一个子菜单 -->
          <el-menu-item
            v-else
            :index="route.children ? `/${route.path}/${route.children[0].path}` : '/' + route.path"
          >
            <el-icon><component :is="route.meta.icon" /></el-icon>
            <template #title>{{ route.meta.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>

    <!-- 底部用户信息 -->
    <div class="sidebar-footer">
      <div class="user-mini" @click="goToProfile">
        <el-avatar :size="32" :src="userStore.userInfo?.avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
        <transition name="fade">
          <span v-show="!collapsed" class="user-name">
            {{ userStore.userInfo?.nickname || '用户' }}
          </span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const collapsed = computed(() => appStore.sidebarCollapsed)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 获取菜单路由（过滤隐藏的和需要权限的）
const menuRoutes = computed(() => {
  const mainRoute = router.options.routes.find(r => r.path === '/')
  if (!mainRoute || !mainRoute.children) return []

  return mainRoute.children.filter(child => {
    // 过滤隐藏的菜单
    if (child.meta?.hidden) return false
    // 检查角色权限
    if (child.meta?.roles) {
      return child.meta.roles.includes(userStore.userInfo?.role)
    }
    return true
  })
})

const goToProfile = () => {
  router.push('/profile')
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .logo-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #fff;
    flex-shrink: 0;
  }

  .logo-text {
    margin-left: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
  }
}

.sidebar-menu-wrapper {
  flex: 1;
  overflow: hidden;

  :deep(.el-menu) {
    border-right: none;
    padding: 8px;

    .el-menu-item,
    .el-sub-menu__title {
      height: 44px;
      line-height: 44px;
      margin: 4px 0;
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.15) !important;
      }

      .el-icon {
        font-size: 18px;
      }
    }

    .el-menu-item.is-active {
      background: rgba(255, 255, 255, 0.25) !important;
      font-weight: 500;
    }

    .el-sub-menu .el-menu-item {
      padding-left: 52px !important;
      min-width: auto;
    }
  }

  :deep(.el-menu--collapse) {
    .el-menu-item,
    .el-sub-menu__title {
      padding: 0 !important;
      justify-content: center;
    }
  }
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .user-mini {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .user-name {
      margin-left: 10px;
      color: #fff;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
