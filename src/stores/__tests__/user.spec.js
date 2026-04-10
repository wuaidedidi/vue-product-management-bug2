import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('updateUserInfo', () => {
    it('应该合并更新用户信息，而不是覆盖整个对象', () => {
      const store = useUserStore()
      
      // 初始化用户信息
      store.login({
        username: 'admin',
        nickname: '管理员',
        role: 'admin',
        email: 'admin@example.com'
      }, 'token123')

      // 只更新昵称和邮箱
      store.updateUserInfo({
        nickname: '新昵称',
        email: 'new@example.com'
      })

      // 验证：role 和 username 应该保留
      expect(store.userInfo).toEqual({
        username: 'admin',
        nickname: '新昵称',
        role: 'admin',
        email: 'new@example.com'
      })
      expect(store.isAdmin).toBe(true)
    })

    it('更新信息后 isAdmin 计算属性应该仍然有效', () => {
      const store = useUserStore()
      
      store.login({
        username: 'admin',
        nickname: '管理员',
        role: 'admin'
      }, 'token123')

      store.updateUserInfo({
        nickname: '新昵称'
      })

      expect(store.isAdmin).toBe(true)
    })
  })

  describe('login/logout', () => {
    it('登录后应该正确设置用户信息和token', () => {
      const store = useUserStore()
      
      store.login({
        username: 'test',
        nickname: '测试用户',
        role: 'user'
      }, 'token123')

      expect(store.userInfo).toEqual({
        username: 'test',
        nickname: '测试用户',
        role: 'user'
      })
      expect(store.token).toBe('token123')
      expect(store.isLoggedIn).toBe(true)
      expect(store.isAdmin).toBe(false)
    })

    it('登出后应该清空用户信息和token', () => {
      const store = useUserStore()
      
      store.login({
        username: 'test',
        nickname: '测试用户',
        role: 'user'
      }, 'token123')
      
      store.logout()

      expect(store.userInfo).toBeNull()
      expect(store.token).toBe('')
      expect(store.isLoggedIn).toBe(false)
    })
  })
})
