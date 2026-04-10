<template>
  <div class="user-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
      <p class="page-desc">管理系统中的所有用户账号</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-bar">
      <el-input
        v-model="searchForm.keyword"
        placeholder="搜索用户名/昵称/手机号"
        prefix-icon="Search"
        clearable
        style="width: 240px"
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      />
      <el-select
        v-model="searchForm.role"
        placeholder="用户角色"
        clearable
        style="width: 130px"
        @change="handleSearch"
      >
        <el-option label="管理员" value="admin" />
        <el-option label="普通用户" value="user" />
      </el-select>
      <el-select
        v-model="searchForm.status"
        placeholder="用户状态"
        clearable
        style="width: 120px"
        @change="handleSearch"
      >
        <el-option label="正常" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
      <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
      <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
      <div style="flex: 1"></div>
      <el-button type="primary" :icon="Plus" @click="openDialog()">添加用户</el-button>
    </div>

    <!-- 用户表格 -->
    <div class="table-container card">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="avatar" label="头像" width="70">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="170" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
              <el-button
                :type="row.status === 1 ? 'warning' : 'success'"
                link
                :disabled="isCurrentAdmin(row)"
                @click="toggleStatus(row)"
              >
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-button>
              <el-button
                type="danger"
                link
                :disabled="isCurrentAdmin(row)"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </div>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingUser ? '编辑用户' : '添加用户'"
      width="550px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :disabled="!!editingUser"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item v-if="!editingUser" label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱（选填）" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号（选填）" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="form.role" :disabled="isEditingCurrentAdmin">
            <el-radio value="admin">管理员</el-radio>
            <el-radio value="user">普通用户</el-radio>
          </el-radio-group>
          <div v-if="isEditingCurrentAdmin" class="form-tip">
            <el-icon><Warning /></el-icon>
            管理员不能修改自己的角色
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status" :disabled="isEditingCurrentAdmin">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
          <div v-if="isEditingCurrentAdmin" class="form-tip">
            <el-icon><Warning /></el-icon>
            管理员不能禁用自己的账号
          </div>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const loading = ref(false)
const submitting = ref(false)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  role: null,
  status: null
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 表格数据
const tableData = ref([])

// 弹窗相关
const dialogVisible = ref(false)
const editingUser = ref(null)
const formRef = ref(null)

const form = reactive({
  username: '',
  nickname: '',
  password: '',
  email: '',
  phone: '',
  role: 'user',
  status: 1
})

// 是否正在编辑当前登录的管理员
const isEditingCurrentAdmin = computed(() => {
  return editingUser.value?.username === userStore.userInfo?.username &&
         userStore.userInfo?.role === 'admin'
})

// 是否是当前登录的管理员
const isCurrentAdmin = (user) => {
  return user.username === userStore.userInfo?.username && user.role === 'admin'
}

// 邮箱验证
const validateEmail = (rule, value, callback) => {
  if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
  } else {
    callback()
  }
}

// 手机号验证
const validatePhone = (rule, value, callback) => {
  if (value && !/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号格式'))
  } else {
    callback()
  }
}

const rules = computed(() => ({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '昵称不能超过20个字符', trigger: 'blur' }
  ],
  password: editingUser.value ? [] : [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}))

// 初始化用户数据
const initUsers = () => {
  const stored = localStorage.getItem('mock_users')
  if (stored) {
    return JSON.parse(stored)
  }

  const defaultUsers = [
    { id: 1, username: 'admin', nickname: '超级管理员', password: '123456', email: 'admin@example.com', phone: '13800138000', avatar: '', role: 'admin', status: 1, createTime: '2024-01-01 00:00:00' },
    { id: 2, username: 'user', nickname: '普通用户', password: '123456', email: 'user@example.com', phone: '13800138001', avatar: '', role: 'user', status: 1, createTime: '2024-01-01 00:00:00' },
    { id: 3, username: 'zhangsan', nickname: '张三', password: '123456', email: 'zhangsan@example.com', phone: '13800138002', avatar: '', role: 'user', status: 1, createTime: '2024-01-15 10:30:00' },
    { id: 4, username: 'lisi', nickname: '李四', password: '123456', email: 'lisi@example.com', phone: '13800138003', avatar: '', role: 'user', status: 1, createTime: '2024-01-20 14:20:00' },
    { id: 5, username: 'wangwu', nickname: '王五', password: '123456', email: 'wangwu@example.com', phone: '13800138004', avatar: '', role: 'user', status: 0, createTime: '2024-02-01 09:15:00' }
  ]

  localStorage.setItem('mock_users', JSON.stringify(defaultUsers))
  return defaultUsers
}

// 加载数据
const loadData = () => {
  loading.value = true

  setTimeout(() => {
    let users = initUsers()

    // 筛选
    if (searchForm.keyword) {
      const keyword = searchForm.keyword.toLowerCase()
      users = users.filter(u =>
        u.username.toLowerCase().includes(keyword) ||
        u.nickname.toLowerCase().includes(keyword) ||
        (u.phone && u.phone.includes(keyword))
      )
    }
    if (searchForm.role) {
      users = users.filter(u => u.role === searchForm.role)
    }
    if (searchForm.status !== null && searchForm.status !== '') {
      users = users.filter(u => u.status === searchForm.status)
    }

    pagination.total = users.length

    // 分页
    const start = (pagination.page - 1) * pagination.size
    tableData.value = users.slice(start, start + pagination.size)

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
  searchForm.keyword = ''
  searchForm.role = null
  searchForm.status = null
  handleSearch()
}

// 打开弹窗
const openDialog = (user = null) => {
  editingUser.value = user
  if (user) {
    Object.assign(form, {
      username: user.username,
      nickname: user.nickname,
      password: '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role,
      status: user.status
    })
  } else {
    form.username = ''
    form.nickname = ''
    form.password = ''
    form.email = ''
    form.phone = ''
    form.role = 'user'
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
    let users = initUsers()

    if (editingUser.value) {
      // 编辑用户
      const index = users.findIndex(u => u.id === editingUser.value.id)
      if (index > -1) {
        users[index] = {
          ...users[index],
          nickname: form.nickname,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: form.status
        }

        // 如果修改的是当前用户，同步更新 store
        if (users[index].username === userStore.userInfo?.username) {
          userStore.updateUserInfo({
            nickname: form.nickname,
            email: form.email,
            phone: form.phone,
            role: form.role
          })
        }
      }
      ElMessage.success('用户更新成功')
    } else {
      // 新增用户
      if (users.some(u => u.username === form.username)) {
        ElMessage.error('用户名已存在')
        submitting.value = false
        return
      }

      users.push({
        id: Date.now(),
        username: form.username,
        nickname: form.nickname,
        password: form.password,
        email: form.email,
        phone: form.phone,
        avatar: '',
        role: form.role,
        status: form.status,
        createTime: new Date().toLocaleString()
      })
      ElMessage.success('用户添加成功')
    }

    localStorage.setItem('mock_users', JSON.stringify(users))
    dialogVisible.value = false
    submitting.value = false
    loadData()
  }, 500)
}

// 切换状态
const toggleStatus = (user) => {
  const action = user.status === 1 ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}用户「${user.nickname}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const users = initUsers()
    const index = users.findIndex(u => u.id === user.id)
    if (index > -1) {
      users[index].status = user.status === 1 ? 1 : 0
      localStorage.setItem('mock_users', JSON.stringify(users))
      ElMessage.success(`${action}成功`)
      loadData()
    }
  }).catch(() => {})
}

// 删除
const handleDelete = (user) => {
  ElMessageBox.confirm(`确定要删除用户「${user.nickname}」吗？删除后不可恢复。`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let users = initUsers()
    users = users.filter(u => u.id !== user.id)
    localStorage.setItem('mock_users', JSON.stringify(users))
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.user-list {
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

.table-actions {
  display: flex;
  gap: 4px;
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #f59e0b;
  margin-top: 4px;
}
</style>
