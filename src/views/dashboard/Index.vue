<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎回来，{{ userStore.userInfo?.nickname || '用户' }}！</h1>
        <p class="welcome-desc">今天是 {{ currentDate }}，祝您工作愉快</p>
      </div>
      <div class="welcome-illustration">
        <el-icon :size="80" color="rgba(102, 126, 234, 0.2)"><DataAnalysis /></el-icon>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in statsData" :key="stat.title">
        <div class="stat-icon" :style="{ background: stat.bgColor }">
          <el-icon :size="24" :color="stat.iconColor">
            <component :is="stat.icon" />
          </el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-title">{{ stat.title }}</div>
        </div>
        <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
          <el-icon><component :is="stat.trend > 0 ? 'Top' : 'Bottom'" /></el-icon>
          {{ Math.abs(stat.trend) }}%
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">销售趋势</h3>
          <el-radio-group v-model="salesPeriod" size="small">
            <el-radio-button label="week">本周</el-radio-button>
            <el-radio-button label="month">本月</el-radio-button>
            <el-radio-button label="year">本年</el-radio-button>
          </el-radio-group>
        </div>
        <div ref="salesChartRef" class="chart-container"></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">商品分类占比</h3>
        </div>
        <div ref="categoryChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 快捷操作和最近订单 -->
    <div class="bottom-section">
      <!-- 快捷操作 -->
      <div class="quick-actions card">
        <h3 class="section-title">快捷操作</h3>
        <div class="actions-grid">
          <div class="action-item" @click="$router.push('/product/list')">
            <div class="action-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <el-icon :size="24"><Goods /></el-icon>
            </div>
            <span class="action-text">商品管理</span>
          </div>
          <div class="action-item" @click="$router.push('/order/list')">
            <div class="action-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <el-icon :size="24"><List /></el-icon>
            </div>
            <span class="action-text">订单管理</span>
          </div>
          <div class="action-item" @click="$router.push('/user/list')" v-if="userStore.isAdmin">
            <div class="action-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
              <el-icon :size="24"><User /></el-icon>
            </div>
            <span class="action-text">用户管理</span>
          </div>
          <div class="action-item" @click="$router.push('/profile')">
            <div class="action-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
              <el-icon :size="24"><UserFilled /></el-icon>
            </div>
            <span class="action-text">个人中心</span>
          </div>
        </div>
      </div>

      <!-- 最近订单 -->
      <div class="recent-orders card">
        <div class="section-header">
          <h3 class="section-title">最近订单</h3>
          <el-button text type="primary" @click="$router.push('/order/list')">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <el-table :data="recentOrders" style="width: 100%" :show-header="false">
          <el-table-column prop="orderNo" width="180">
            <template #default="{ row }">
              <span class="order-no">#{{ row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productName" />
          <el-table-column prop="amount" width="100">
            <template #default="{ row }">
              <span class="order-amount">¥{{ row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" width="100">
            <template #default="{ row }">
              <el-tag :type="getOrderStatusType(row.status)" size="small">
                {{ getOrderStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const userStore = useUserStore()

// 当前日期
const currentDate = computed(() => dayjs().format('YYYY年MM月DD日 dddd'))

// 销售周期
const salesPeriod = ref('week')

// 统计数据
const statsData = ref([
  {
    title: '今日销售额',
    value: '¥28,456',
    icon: 'Wallet',
    bgColor: 'rgba(102, 126, 234, 0.1)',
    iconColor: '#667eea',
    trend: 12.5
  },
  {
    title: '今日订单',
    value: '156',
    icon: 'ShoppingCart',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    iconColor: '#10b981',
    trend: 8.2
  },
  {
    title: '商品总数',
    value: '1,234',
    icon: 'Goods',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    iconColor: '#f59e0b',
    trend: 3.1
  },
  {
    title: '用户数量',
    value: '8,567',
    icon: 'User',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    iconColor: '#8b5cf6',
    trend: -2.4
  }
])

// 最近订单
const recentOrders = ref([
  { orderNo: '20240201001', productName: 'iPhone 15 Pro Max', amount: 9999, status: 'paid' },
  { orderNo: '20240201002', productName: 'MacBook Pro 14"', amount: 14999, status: 'shipped' },
  { orderNo: '20240201003', productName: 'AirPods Pro 2', amount: 1899, status: 'completed' },
  { orderNo: '20240201004', productName: 'iPad Air 5', amount: 4799, status: 'pending' },
  { orderNo: '20240201005', productName: 'Apple Watch S9', amount: 3299, status: 'cancelled' }
])

// 订单状态
const getOrderStatusType = (status) => {
  const types = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'info',
    completed: 'success',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

const getOrderStatusText = (status) => {
  const texts = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || status
}

// 图表实例
const salesChartRef = ref(null)
const categoryChartRef = ref(null)
let salesChart = null
let categoryChart = null

// 初始化销售趋势图表
const initSalesChart = () => {
  if (!salesChartRef.value) return

  salesChart = echarts.init(salesChartRef.value)

  const weekData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const monthData = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
  const yearData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  const xAxisData = {
    week: weekData,
    month: monthData,
    year: yearData
  }

  const salesDataMap = {
    week: [12000, 15000, 18000, 14000, 22000, 28000, 25000],
    month: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20000) + 10000),
    year: [180000, 220000, 195000, 280000, 310000, 290000, 350000, 380000, 420000, 390000, 450000, 480000]
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#1f2937' },
      formatter: (params) => {
        return `${params[0].name}<br/>销售额: ¥${params[0].value.toLocaleString()}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData[salesPeriod.value],
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: {
        color: '#6b7280',
        formatter: (value) => (value >= 10000 ? (value / 10000) + '万' : value)
      }
    },
    series: [{
      data: salesDataMap[salesPeriod.value],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ])
      },
      itemStyle: {
        color: '#667eea',
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
        ])
      }
    }]
  }

  salesChart.setOption(option)
}

// 初始化分类占比图表
const initCategoryChart = () => {
  if (!categoryChartRef.value) return

  categoryChart = echarts.init(categoryChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#1f2937' },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: { color: '#6b7280' }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: false },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      data: [
        { value: 335, name: '电子产品', itemStyle: { color: '#667eea' } },
        { value: 280, name: '服装鞋包', itemStyle: { color: '#10b981' } },
        { value: 234, name: '食品饮料', itemStyle: { color: '#f59e0b' } },
        { value: 185, name: '家居用品', itemStyle: { color: '#8b5cf6' } },
        { value: 148, name: '美妆护肤', itemStyle: { color: '#ec4899' } }
      ]
    }]
  }

  categoryChart.setOption(option)
}

// 窗口大小变化时重新调整图表
const handleResize = () => {
  salesChart?.resize()
  categoryChart?.resize()
}

// 监听销售周期变化
watch(salesPeriod, () => {
  // initSalesChart()
})

onMounted(() => {
  initSalesChart()
  initCategoryChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesChart?.dispose()
  categoryChart?.dispose()
})
</script>

<style lang="scss" scoped>
.dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  color: #fff;

  .welcome-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .welcome-desc {
    font-size: 14px;
    opacity: 0.85;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .stat-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-info {
    flex: 1;
    min-width: 0;

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .stat-title {
      font-size: 13px;
      color: #6b7280;
    }
  }

  .stat-trend {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 2px;

    &.up {
      color: #10b981;
    }

    &.down {
      color: #ef4444;
    }
  }
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .chart-container {
    height: 280px;
  }
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .section-title {
    margin-bottom: 0;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }

  .action-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-bottom: 8px;
  }

  .action-text {
    font-size: 13px;
    color: #6b7280;
  }
}

.recent-orders {
  .order-no {
    font-size: 13px;
    color: #6b7280;
    font-family: monospace;
  }

  .order-amount {
    font-weight: 600;
    color: #1f2937;
  }

  :deep(.el-table) {
    --el-table-border-color: transparent;
    --el-table-row-hover-bg-color: #f8fafc;
  }
}
</style>
