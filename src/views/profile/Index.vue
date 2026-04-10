<template>
  <div class="profile-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">个人中心</h1>
      <p class="page-desc">管理您的个人信息和账号设置</p>
    </div>

    <div class="profile-content">
      <!-- 左侧：用户信息卡片 -->
      <div class="profile-card card">
        <div class="avatar-section">
          <el-avatar :size="100" :src="userStore.userInfo?.avatar">
            <el-icon :size="40"><User /></el-icon>
          </el-avatar>
          <div class="user-info">
            <h2 class="user-name">{{ userStore.userInfo?.nickname }}</h2>
            <el-tag :type="userStore.isAdmin ? 'danger' : 'primary'" size="small">
              {{ userStore.isAdmin ? '管理员' : '普通用户' }}
            </el-tag>
          </div>
        </div>

        <div class="info-list">
          <div class="info-item">
            <el-icon><User /></el-icon>
            <span class="info-label">用户名：</span>
            <span class="info-value">{{ userStore.userInfo?.username }}</span>
          </div>
          <div class="info-item">
            <el-icon><Message /></el-icon>
            <span class="info-label">邮箱：</span>
            <span class="info-value">{{ userStore.userInfo?.email || '未设置' }}</span>
          </div>
          <div class="info-item">
            <el-icon><Phone /></el-icon>
            <span class="info-label">手机号：</span>
            <span class="info-value">{{ userStore.userInfo?.phone || '未设置' }}</span>
          </div>
          <div class="info-item">
            <el-icon><Calendar /></el-icon>
            <span class="info-label">注册时间：</span>
            <span class="info-value">{{ userStore.userInfo?.createTime || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧：设置区域 -->
      <div class="settings-area">
        <!-- 基本信息 -->
        <div class="settings-card card">
          <div class="card-header">
            <h3>基本信息</h3>
            <el-button v-if="!editingProfile" type="primary" link @click="editingProfile = true">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </div>

          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="80px"
            :disabled="!editingProfile"
          >
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱（选填）" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="profileForm.phone" placeholder="请输入手机号（选填）" />
            </el-form-item>
          </el-form>

          <div v-if="editingProfile" class="card-footer">
            <el-button @click="cancelEditProfile">取消</el-button>
            <el-button type="primary" :loading="savingProfile" @click="saveProfile">保存</el-button>
          </div>
        </div>

        <!-- 修改密码 -->
        <div class="settings-card card">
          <div class="card-header">
            <h3>修改密码</h3>
          </div>

          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
          >
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入当前密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
          </el-form>

          <div class="card-footer">
            <el-button type="primary" :loading="savingPassword" @click="changePassword">
              修改密码
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 编辑状态
const editingProfile = ref(false)
const savingProfile = ref(false)
const savingPassword = ref(false)

// 表单引用
const profileFormRef = ref(null)
const passwordFormRef = ref(null)

// 基本信息表单
const profileForm = reactive({
  nickname: '',
  email: '',
  phone: ''
})

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

const profileRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '昵称不能超过20个字符', trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ]
}

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 确认密码验证
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}



// 初始化表单数据
const initFormData = () => {
  profileForm.nickname = userStore.userInfo?.nickname || ''
  profileForm.email = userStore.userInfo?.email || ''
  profileForm.phone = userStore.userInfo?.phone || ''
}

// 取消编辑
const cancelEditProfile = () => {
  editingProfile.value = false
  initFormData()
}

// 保存个人信息
const saveProfile = async () => {
  const valid = await profileFormRef.value.validate().catch(() => false)
  if (!valid) return

  savingProfile.value = true

  setTimeout(() => {
    // 更新本地存储
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]')
    const index = users.findIndex(u => u.username === userStore.userInfo?.username)
    
    if (index > -1) {
      users[index].nickname = profileForm.nickname
      users[index].email = profileForm.email
      users[index].phone = profileForm.phone
      localStorage.setItem('mock_users', JSON.stringify(users))
    }

    // 更新 Store
    userStore.updateUserInfo({
      nickname: profileForm.nickname,
      email: profileForm.email,
      phone: profileForm.phone
    })

    ElMessage.success('个人信息更新成功')
    editingProfile.value = false
    savingProfile.value = false
  }, 500)
}

// 修改密码
const changePassword = async () => {
  const valid = await passwordFormRef.value.validate().catch(() => false)
  if (!valid) return

  savingPassword.value = true

  setTimeout(() => {
    // 验证当前密码
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]')
    const user = users.find(u => u.username === userStore.userInfo?.username)

    // 检查预设账户或存储的用户
    let currentPassword = user?.password
    if (!currentPassword) {
      // 预设账户的默认密码
      if (userStore.userInfo?.username === 'admin' || userStore.userInfo?.username === 'user') {
        currentPassword = '123456'
      }
    }

    if (passwordForm.newPassword !== currentPassword) {
      ElMessage.error('当前密码错误')
      savingPassword.value = false
      return
    }

    // 更新密码
    if (user) {
      user.password = passwordForm.newPassword
      localStorage.setItem('mock_users', JSON.stringify(users))
    } else {
      // 预设账户首次修改密码时添加到存储
      users.push({
        ...userStore.userInfo,
        password: passwordForm.newPassword
      })
      localStorage.setItem('mock_users', JSON.stringify(users))
    }

    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordFormRef.value.resetFields()
    savingPassword.value = false
  }, 500)
}

onMounted(() => {
  initFormData()
})
</script>

<style lang="scss" scoped>
.profile-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.profile-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;

    .user-info {
      margin-top: 16px;
      text-align: center;

      .user-name {
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
      }
    }
  }

  .info-list {
    padding-top: 20px;

    .info-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .el-icon {
        color: #6b7280;
        margin-right: 10px;
      }

      .info-label {
        color: #6b7280;
        min-width: 70px;
      }

      .info-value {
        color: #1f2937;
        flex: 1;
      }
    }
  }
}

.settings-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
  }

  .security-list {
    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .security-info {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #1f2937;
      }
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item.is-disabled .el-input__wrapper) {
  background: #f8fafc;
}
</style>
