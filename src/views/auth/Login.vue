<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <el-icon :size="40" color="#667eea"><Goods /></el-icon>
        </div>
        <h1 class="title">商品管理平台</h1>
        <p class="subtitle">欢迎回来，请登录您的账号</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <a href="javascript:void(0)" class="forgot-link">忘记密码？</a>
        </div>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          还没有账号？
          <router-link to="/register" class="register-link">立即注册</router-link>
        </div>
      </el-form>

      <!-- 演示账号提示 -->
      <div class="demo-hint">
        <el-divider>演示账号</el-divider>
        <div class="demo-accounts">
          <el-tag @click="fillDemo('admin')" class="demo-tag">管理员: admin / 123456</el-tag>
          <el-tag type="success" @click="fillDemo('user')" class="demo-tag">用户: user / 123456</el-tag>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      © 2024 商品管理平台 · 技术支持
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 填充演示账号
const fillDemo = (type) => {
  if (type === 'admin') {
    form.username = 'user'
    form.password = '123456'
  } else {
    form.username = 'admin'
    form.password = '123456'
  }
}

// 登录处理
const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 800))

    // 从 Mock 数据获取用户信息
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]')
    let user = users.find(u => u.username === form.username && u.password === form.password)

    // 预设账号检查
    if (!user) {
      if (form.username === 'admin' && form.password === '123456') {
        user = {
          id: 1,
          username: 'admin',
          nickname: '超级管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          avatar: '',
          role: 'admin',
          status: 1,
          createTime: '2024-01-01 00:00:00'
        }
      } else if (form.username === 'user' && form.password === '123456') {
        user = {
          id: 2,
          username: 'user',
          nickname: '普通用户',
          email: 'user@example.com',
          phone: '13800138001',
          avatar: '',
          role: 'user',
          status: 1,
          createTime: '2024-01-01 00:00:00'
        }
      }
    }

    if (!user) {
      ElMessage.error('用户名或密码错误')
      return
    }

    if (user.status === 0) {
      ElMessage.error('账号已被禁用，请联系管理员')
      return
    }

    // 生成 Token
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 保存登录状态
    userStore.login(user, token)

    ElMessage.success('登录成功')

    // 跳转到目标页面
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (error) {
    ElMessage.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  .circle-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    left: -100px;
  }

  .circle-2 {
    width: 300px;
    height: 300px;
    bottom: -50px;
    right: -50px;
  }

  .circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
  }
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .logo {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .title {
    font-size: 26px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px;
    color: #6b7280;
  }
}

.login-form {
  :deep(.el-input__wrapper) {
    padding: 8px 16px;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #e5e7eb;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 0 0 1px #667eea;
    }

    &.is-focus {
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .forgot-link {
    color: #667eea;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
      color: #764ba2;
    }
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
}

.login-footer {
  text-align: center;
  color: #6b7280;
  font-size: 14px;

  .register-link {
    color: #667eea;
    font-weight: 500;
    margin-left: 4px;

    &:hover {
      color: #764ba2;
    }
  }
}

.demo-hint {
  margin-top: 24px;

  :deep(.el-divider__text) {
    font-size: 12px;
    color: #9ca3af;
    background: #fff;
  }

  .demo-accounts {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .demo-tag {
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.copyright {
  margin-top: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
}

// 响应式
@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 30px 24px;
  }
}
</style>
