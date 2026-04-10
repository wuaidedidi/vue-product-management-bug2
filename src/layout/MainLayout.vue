<template>
  <el-container class="main-layout">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarWidth" class="sidebar-container">
      <Sidebar />
    </el-aside>

    <!-- 主区域 -->
    <el-container class="main-container">
      <!-- 头部 -->
      <el-header class="header-container">
        <Header />
      </el-header>

      <!-- 内容区 -->
      <el-main class="content-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const appStore = useAppStore()

const sidebarWidth = computed(() => 
  appStore.sidebarCollapsed ? '64px' : '240px'
)
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

.sidebar-container {
  transition: width 0.3s ease;
  overflow: hidden;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header-container {
  height: 60px;
  padding: 0;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

.content-container {
  flex: 1;
  padding: 24px;
  background: #f8fafc;
  overflow-y: auto;
  overflow-x: hidden;
}

// 路由切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
