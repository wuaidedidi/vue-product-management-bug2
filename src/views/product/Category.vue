<template>
  <div class="category-manage">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">分类管理</h1>
      <p class="page-desc">管理商品分类信息</p>
    </div>

    <div class="content-wrapper">
      <!-- 左侧分类列表 -->
      <div class="category-list card">
        <div class="list-header">
          <span class="list-title">分类列表</span>
          <el-button type="primary" size="small" :icon="Plus" @click="openDialog()">
            添加分类
          </el-button>
        </div>

        <el-table :data="categories" v-loading="loading" stripe>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="icon" label="图标" width="60">
            <template #default="{ row }">
              <el-icon :size="20" :style="{ color: row.color || '#667eea' }">
                <component :is="row.icon || 'Folder'" />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="分类名称" />
          <el-table-column prop="productCount" label="商品数量" width="100">
            <template #default="{ row }">
              <el-tag type="info" size="small">{{ row.productCount || 0 }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <div class="table-actions">
                <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 右侧分类统计 -->
      <div class="category-stats card">
        <h3 class="stats-title">分类统计</h3>
        <div ref="chartRef" class="chart-container"></div>
        <div class="stats-list">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="stats-item"
          >
            <div class="stats-info">
              <el-icon :style="{ color: cat.color || '#667eea' }">
                <component :is="cat.icon || 'Folder'" />
              </el-icon>
              <span class="stats-name">{{ cat.name }}</span>
            </div>
            <span class="stats-count">{{ cat.productCount || 0 }} 件</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑分类弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingCategory ? '编辑分类' : '添加分类'"
      width="480px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select v-model="form.icon" placeholder="选择图标" style="width: 100%">
            <el-option
              v-for="icon in iconOptions"
              :key="icon"
              :label="icon"
              :value="icon"
            >
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-icon><component :is="icon" /></el-icon>
                <span>{{ icon }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="form.color" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" style="width: 150px" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const loading = ref(false)
const submitting = ref(false)

// 图标选项
const iconOptions = ['Goods', 'ShoppingBag', 'Food', 'House', 'Brush', 'Monitor', 'Phone', 'Watch', 'Camera', 'Headset']

// 分类数据
const categories = ref([])

// 弹窗相关
const dialogVisible = ref(false)
const editingCategory = ref(null)
const formRef = ref(null)

const form = reactive({
  name: '',
  icon: '',
  color: '#667eea',
  sort: 0,
  status: 1
})

const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { max: 20, message: '分类名称不能超过20个字符', trigger: 'blur' }
  ]
}

// 图表
const chartRef = ref(null)
let chartInstance = null

// 初始化分类数据
const initCategories = () => {
  const stored = localStorage.getItem('mock_categories')
  if (stored) {
    return JSON.parse(stored)
  }

  const defaultCategories = [
    { id: 1, name: '电子产品', icon: 'Monitor', color: '#667eea', sort: 1, status: 1, productCount: 15 },
    { id: 2, name: '服装鞋包', icon: 'ShoppingBag', color: '#10b981', sort: 2, status: 1, productCount: 28 },
    { id: 3, name: '食品饮料', icon: 'Food', color: '#f59e0b', sort: 3, status: 1, productCount: 42 },
    { id: 4, name: '家居用品', icon: 'House', color: '#8b5cf6', sort: 4, status: 1, productCount: 19 },
    { id: 5, name: '美妆护肤', icon: 'Brush', color: '#ec4899', sort: 5, status: 1, productCount: 33 }
  ]

  localStorage.setItem('mock_categories', JSON.stringify(defaultCategories))
  return defaultCategories
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    categories.value = initCategories().sort((a, b) => a.sort - b.sort)
    loading.value = false
    initChart()
  }, 300)
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      data: categories.value.map(cat => ({
        value: cat.productCount || 0,
        name: cat.name,
        itemStyle: { color: cat.color }
      }))
    }]
  }

  chartInstance.setOption(option)
}

// 打开弹窗
const openDialog = (category = null) => {
  editingCategory.value = category
  if (category) {
    Object.assign(form, category)
  } else {
    form.name = ''
    form.icon = ''
    form.color = '#667eea'
    form.sort = categories.value.length + 1
    form.status = 1
  }
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true

  setTimeout(() => {
    let cats = initCategories()

    if (editingCategory.value) {
      const index = cats.findIndex(c => c.id === editingCategory.value.id)
      if (index > -1) {
        cats[index] = { ...cats[index], ...form }
      }
      ElMessage.success('分类更新成功')
    } else {
      // 检查名称是否重复
      if (cats.some(c => c.name === form.name)) {
        ElMessage.error('分类名称已存在')
        submitting.value = false
        return
      }

      cats.push({
        id: Date.now(),
        ...form,
        productCount: 0
      })
      ElMessage.success('分类添加成功')
    }

    localStorage.setItem('mock_categories', JSON.stringify(cats))
    dialogVisible.value = false
    submitting.value = false
    loadData()
  }, 500)
}

// 删除
const handleDelete = (category) => {
  if (category.productCount > 0) {
    ElMessage.warning(`该分类下有 ${category.productCount} 个商品，无法删除`)
    return
  }

  ElMessageBox.confirm(`确定要删除「${category.name}」吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let cats = initCategories()
    cats = cats.filter(c => c.id !== category.id)
    localStorage.setItem('mock_categories', JSON.stringify(cats))
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

// 窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style lang="scss" scoped>
.category-manage {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.category-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .list-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
  }
}

.category-stats {
  .stats-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
  }

  .chart-container {
    height: 200px;
    margin-bottom: 20px;
  }

  .stats-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .stats-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: #f8fafc;
    border-radius: 8px;

    .stats-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stats-name {
      font-size: 14px;
      color: #1f2937;
    }

    .stats-count {
      font-size: 13px;
      color: #6b7280;
    }
  }
}

.table-actions {
  display: flex;
  gap: 4px;
}
</style>
