<template>
  <div class="system-settings">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">系统配置</h1>
      <p class="page-desc">配置系统的基本参数和功能设置</p>
    </div>

    <div class="settings-grid">
      <!-- 基本设置 -->
      <div class="settings-card card">
        <div class="card-header">
          <el-icon :size="20" color="#667eea"><Setting /></el-icon>
          <h3>基本设置</h3>
        </div>
        <el-form label-width="120px" label-position="left">
          <el-form-item label="系统名称">
            <el-input v-model="settings.siteName" placeholder="请输入系统名称" />
          </el-form-item>
          <el-form-item label="系统Logo">
            <el-input v-model="settings.logo" placeholder="请输入Logo URL" />
          </el-form-item>
          <el-form-item label="版权信息">
            <el-input v-model="settings.copyright" placeholder="请输入版权信息" />
          </el-form-item>
          <el-form-item label="备案号">
            <el-input v-model="settings.icp" placeholder="请输入ICP备案号" />
          </el-form-item>
        </el-form>
      </div>

      <!-- 功能开关 -->
      <div class="settings-card card">
        <div class="card-header">
          <el-icon :size="20" color="#10b981"><Operation /></el-icon>
          <h3>功能开关</h3>
        </div>
        <div class="switch-list">
          <div class="switch-item">
            <div class="switch-info">
              <span class="switch-name">用户注册</span>
              <span class="switch-desc">允许新用户注册账号</span>
            </div>
            <el-switch v-model="settings.enableRegister" />
          </div>
          <div class="switch-item">
            <div class="switch-info">
              <span class="switch-name">验证码</span>
              <span class="switch-desc">登录时需要输入验证码</span>
            </div>
            <el-switch v-model="settings.enableCaptcha" />
          </div>
          <div class="switch-item">
            <div class="switch-info">
              <span class="switch-name">邮件通知</span>
              <span class="switch-desc">发送订单状态变更通知</span>
            </div>
            <el-switch v-model="settings.enableEmail" />
          </div>
          <div class="switch-item">
            <div class="switch-info">
              <span class="switch-name">短信通知</span>
              <span class="switch-desc">发送短信验证码和通知</span>
            </div>
            <el-switch v-model="settings.enableSms" />
          </div>
        </div>
      </div>

      <!-- 存储设置 -->
      <div class="settings-card card">
        <div class="card-header">
          <el-icon :size="20" color="#f59e0b"><FolderOpened /></el-icon>
          <h3>存储设置</h3>
        </div>
        <el-form label-width="120px" label-position="left">
          <el-form-item label="存储方式">
            <el-radio-group v-model="settings.storageType">
              <el-radio value="local">本地存储</el-radio>
              <el-radio value="oss">阿里云OSS</el-radio>
              <el-radio value="cos">腾讯云COS</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="最大上传大小">
            <el-input-number v-model="settings.maxUploadSize" :min="1" :max="100" />
            <span style="margin-left: 8px;">MB</span>
          </el-form-item>
          <el-form-item label="允许的文件类型">
            <el-input v-model="settings.allowedTypes" placeholder="jpg,png,gif,pdf" />
          </el-form-item>
        </el-form>
      </div>

      <!-- 缓存管理 -->
      <div class="settings-card card">
        <div class="card-header">
          <el-icon :size="20" color="#8b5cf6"><Cpu /></el-icon>
          <h3>缓存管理</h3>
        </div>
        <div class="cache-info">
          <div class="cache-item">
            <span class="cache-label">系统缓存</span>
            <span class="cache-value">{{ cacheInfo.system }}</span>
          </div>
          <div class="cache-item">
            <span class="cache-label">数据缓存</span>
            <span class="cache-value">{{ cacheInfo.data }}</span>
          </div>
          <div class="cache-item">
            <span class="cache-label">静态资源</span>
            <span class="cache-value">{{ cacheInfo.static }}</span>
          </div>
        </div>
        <div class="cache-actions">
          <el-button type="warning" @click="clearCache">
            <el-icon><Delete /></el-icon>
            清除所有缓存
          </el-button>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="save-bar">
      <el-button @click="resetSettings">重置</el-button>
      <el-button type="primary" :loading="saving" @click="saveSettings">保存设置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const saving = ref(false)

// 系统设置
const settings = reactive({
  siteName: '商品管理平台',
  logo: '',
  copyright: '© 2024 商品管理平台',
  icp: '',
  enableRegister: true,
  enableCaptcha: false,
  enableEmail: true,
  enableSms: false,
  storageType: 'local',
  maxUploadSize: 10,
  allowedTypes: 'jpg,png,gif,webp,pdf'
})

// 缓存信息
const cacheInfo = reactive({
  system: '2.3 MB',
  data: '5.8 MB',
  static: '12.6 MB'
})

// 加载设置
const loadSettings = () => {
  const stored = localStorage.getItem('system_settings')
  if (stored) {
    Object.assign(settings, JSON.parse(stored))
  }
}

// 保存设置
const saveSettings = () => {
  saving.value = true
  setTimeout(() => {
    localStorage.setItem('system_settings', JSON.stringify(settings))
    ElMessage.success('设置保存成功')
    saving.value = false
  }, 500)
}

// 重置设置
const resetSettings = () => {
  settings.siteName = '商品管理平台'
  settings.logo = ''
  settings.copyright = '© 2024 商品管理平台'
  settings.icp = ''
  settings.enableRegister = true
  settings.enableCaptcha = false
  settings.enableEmail = true
  settings.enableSms = false
  settings.storageType = 'local'
  settings.maxUploadSize = 10
  settings.allowedTypes = 'jpg,png,gif,webp,pdf'
  ElMessage.info('设置已重置')
}

// 清除缓存
const clearCache = () => {
  ElMessage.success('缓存清除成功')
  cacheInfo.system = '0 MB'
  cacheInfo.data = '0 MB'
  cacheInfo.static = '0 MB'
}

onMounted(() => {
  loadSettings()
})
</script>

<style lang="scss" scoped>
.system-settings {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.settings-card {
  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .switch-list {
    .switch-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .switch-info {
        .switch-name {
          display: block;
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .switch-desc {
          font-size: 13px;
          color: #6b7280;
        }
      }
    }
  }

  .cache-info {
    margin-bottom: 20px;

    .cache-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .cache-label {
        color: #6b7280;
      }

      .cache-value {
        font-weight: 500;
        color: #1f2937;
      }
    }
  }

  .cache-actions {
    padding-top: 12px;
  }
}

.save-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}
</style>
