import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref(null)
  // Token
  const token = ref('')

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 计算属性：是否是管理员
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // 登录
  const login = (userData, userToken) => {
    userInfo.value = userData
    token.value = userToken
  }

  // 登出
  const logout = () => {
    userInfo.value = null
    token.value = ''
  }

  // 更新用户信息
  const updateUserInfo = (data) => {
    if (userInfo.value) {
      userInfo.value = { ...data }
    }
  }

  // 更新头像
  const updateAvatar = (avatar) => {
    if (userInfo.value) {
      userInfo.value.avatar = avatar
    }
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    updateUserInfo,
    updateAvatar
  }
}, {
  persist: {
    key: 'product-admin-user',
    storage: localStorage,
    paths: ['userInfo', 'token']
  }
})
