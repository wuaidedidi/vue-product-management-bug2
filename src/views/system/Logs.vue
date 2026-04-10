<template>
  <div class="system-logs">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">操作日志</h1>
      <p class="page-desc">查看系统操作记录</p>
    </div>

    <!-- 搜索 -->
    <div class="search-bar">
      <el-select
        v-model="searchForm.type"
        placeholder="操作类型"
        clearable
        style="width: 140px"
        @change="handleSearch"
      >
        <el-option label="登录" value="login" />
        <el-option label="登出" value="logout" />
        <el-option label="新增" value="create" />
        <el-option label="编辑" value="update" />
        <el-option label="删除" value="delete" />
      </el-select>
      <el-date-picker
        v-model="searchForm.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 260px"
        @change="handleSearch"
      />
      <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
      <div style="flex: 1"></div>
      <el-button type="danger" :icon="Delete" @click="clearLogs">清空日志</el-button>
    </div>

    <!-- 日志表格 -->
    <div class="table-container card">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="type" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容" min-width="250" show-overflow-tooltip />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column prop="createTime" label="操作时间" width="180" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Delete } from '@element-plus/icons-vue'

const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  type: null,
  dateRange: null
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 表格数据
const tableData = ref([])

// 类型配置
const getTypeTag = (type) => {
  const tags = {
    login: 'success',
    logout: 'info',
    create: 'primary',
    update: 'warning',
    delete: 'danger'
  }
  return tags[type] || 'info'
}

const getTypeText = (type) => {
  const texts = {
    login: '登录',
    logout: '登出',
    create: '新增',
    update: '编辑',
    delete: '删除'
  }
  return texts[type] || type
}

// 初始化日志数据
const initLogs = () => {
  const stored = localStorage.getItem('mock_logs')
  if (stored) {
    return JSON.parse(stored)
  }

  const defaultLogs = [
    { id: 1, type: 'login', content: '用户登录系统', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 09:00:00' },
    { id: 2, type: 'create', content: '新增商品：iPhone 15 Pro Max', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 09:15:00' },
    { id: 3, type: 'update', content: '编辑商品信息：MacBook Pro 14"', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 09:30:00' },
    { id: 4, type: 'delete', content: '删除商品：测试商品A', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 10:00:00' },
    { id: 5, type: 'update', content: '订单发货：#20240201002', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 10:30:00' },
    { id: 6, type: 'create', content: '新增用户：zhangsan', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 11:00:00' },
    { id: 7, type: 'update', content: '修改用户状态：禁用 wangwu', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 11:30:00' },
    { id: 8, type: 'logout', content: '用户退出系统', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 12:00:00' },
    { id: 9, type: 'login', content: '用户登录系统', operator: 'user', ip: '192.168.1.101', createTime: '2024-02-07 13:00:00' },
    { id: 10, type: 'update', content: '修改个人信息', operator: 'user', ip: '192.168.1.101', createTime: '2024-02-07 13:30:00' }
  ]

  localStorage.setItem('mock_logs', JSON.stringify(defaultLogs))
  return defaultLogs
}

// 加载数据
const loadData = () => {
  loading.value = true

  setTimeout(() => {
    let logs = initLogs()

    // 筛选
    if (searchForm.type) {
      logs = logs.filter(l => l.type === searchForm.type)
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const [start, end] = searchForm.dateRange
      logs = logs.filter(l => {
        const date = l.createTime.split(' ')[0]
        return date >= start && date <= end
      })
    }

    // 按时间倒序
    logs.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

    pagination.total = logs.length

    // 分页
    const start = (pagination.page - 1) * pagination.size
    tableData.value = logs.slice(start, start + pagination.size)

    loading.value = false
  }, 300)
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const resetSearch = () => {
  searchForm.type = null
  searchForm.dateRange = null
  handleSearch()
}

// 清空日志
const clearLogs = () => {
  ElMessageBox.confirm('确定要清空所有操作日志吗？此操作不可恢复。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.setItem('mock_logs', JSON.stringify([]))
    ElMessage.success('日志已清空')
    loadData()
  }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.system-logs {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>
