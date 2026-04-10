<template>
  <div class="header">
    <!-- 左侧：折叠按钮 + 面包屑 -->
    <div class="header-left">
      <div class="collapse-btn" @click="toggleSidebar">
        <el-icon :size="20">
          <Fold v-if="!appStore.sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：功能区 -->
    <div class="header-right">
      <!-- 全屏按钮 -->
      <div class="header-action" @click="toggleFullscreen">
        <el-tooltip content="全屏" placement="bottom">
          <el-icon :size="18"><FullScreen /></el-icon>
        </el-tooltip>
      </div>

      <!-- 用户下拉菜单 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-dropdown">
          <el-avatar :size="32" :src="userStore.userInfo?.avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="user-name">{{ userStore.userInfo?.nickname || '用户' }}</span>
          <el-icon class="arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useUserStore } from '@/stores'
import { ElMessageBox, ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 面包屑
const breadcrumbs = computed(() => {
  return route.matched.filter(item => 
    item.meta.title && item.path !== '/'
  )
})

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/system/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 取消操作
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: #6b7280;

    &:hover {
      background: #f3f4f6;
      color: #667eea;
    }
  }

  :deep(.el-breadcrumb) {
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        color: #6b7280;
        font-weight: 400;

        &.is-link:hover {
          color: #667eea;
        }
      }

      &:last-child .el-breadcrumb__inner {
        color: #1f2937;
        font-weight: 500;
      }
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
    color: #667eea;
  }

  :deep(.el-badge__content) {
    background: #ef4444;
  }
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  .user-name {
    font-size: 14px;
    color: #1f2937;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .arrow {
    color: #9ca3af;
    font-size: 12px;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
