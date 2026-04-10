// Mock 数据入口
// 实际数据已在各组件中通过 localStorage 初始化
// 这里统一导出初始化函数供需要时调用

export function initMockData() {
  // 初始化分类数据
  if (!localStorage.getItem('mock_categories')) {
    const categories = [
      { id: 1, name: '电子产品', icon: 'Monitor', color: '#667eea', sort: 1, status: 1, productCount: 15 },
      { id: 2, name: '服装鞋包', icon: 'ShoppingBag', color: '#10b981', sort: 2, status: 1, productCount: 28 },
      { id: 3, name: '食品饮料', icon: 'Food', color: '#f59e0b', sort: 3, status: 1, productCount: 42 },
      { id: 4, name: '家居用品', icon: 'House', color: '#8b5cf6', sort: 4, status: 1, productCount: 19 },
      { id: 5, name: '美妆护肤', icon: 'Brush', color: '#ec4899', sort: 5, status: 1, productCount: 33 }
    ]
    localStorage.setItem('mock_categories', JSON.stringify(categories))
  }

  // 初始化商品数据
  if (!localStorage.getItem('mock_products')) {
    const products = [
      { id: 1, name: 'iPhone 15 Pro Max', code: 'IPHONE15PM', categoryId: 1, categoryName: '电子产品', price: 9999, stock: 100, sales: 256, image: '', description: '苹果最新旗舰手机', status: 1, createTime: '2024-01-15 10:00:00' },
      { id: 2, name: 'MacBook Pro 14"', code: 'MBP14', categoryId: 1, categoryName: '电子产品', price: 14999, stock: 50, sales: 128, image: '', description: 'M3 Pro芯片，强劲性能', status: 1, createTime: '2024-01-15 10:00:00' },
      { id: 3, name: 'AirPods Pro 2', code: 'AIRPODSPRO2', categoryId: 1, categoryName: '电子产品', price: 1899, stock: 200, sales: 512, image: '', description: '主动降噪，空间音频', status: 1, createTime: '2024-01-15 10:00:00' },
      { id: 4, name: '男士休闲夹克', code: 'JACKET001', categoryId: 2, categoryName: '服装鞋包', price: 399, stock: 150, sales: 89, image: '', description: '时尚简约，舒适百搭', status: 1, createTime: '2024-01-15 10:00:00' },
      { id: 5, name: '女士连衣裙', code: 'DRESS001', categoryId: 2, categoryName: '服装鞋包', price: 299, stock: 80, sales: 156, image: '', description: '优雅气质，修身显瘦', status: 1, createTime: '2024-01-15 10:00:00' }
    ]
    localStorage.setItem('mock_products', JSON.stringify(products))
  }

  // 初始化订单数据
  if (!localStorage.getItem('mock_orders')) {
    const orders = [
      { id: 1, orderNo: '20240201001', productName: 'iPhone 15 Pro Max', price: 9999, quantity: 1, totalAmount: 9999, receiver: '张三', phone: '13800138001', address: '北京市朝阳区建国路88号', status: 'completed', payMethod: '微信支付', createTime: '2024-02-01 10:30:00', payTime: '2024-02-01 10:35:00', shipTime: '2024-02-02 09:00:00', completeTime: '2024-02-05 14:20:00', remark: '' },
      { id: 2, orderNo: '20240201002', productName: 'MacBook Pro 14"', price: 14999, quantity: 1, totalAmount: 14999, receiver: '李四', phone: '13800138002', address: '上海市浦东新区陆家嘴金融中心', status: 'shipped', payMethod: '支付宝', createTime: '2024-02-01 11:20:00', payTime: '2024-02-01 11:25:00', shipTime: '2024-02-02 10:00:00', completeTime: '', remark: '请尽快发货' },
      { id: 3, orderNo: '20240201003', productName: 'AirPods Pro 2', price: 1899, quantity: 2, totalAmount: 3798, receiver: '王五', phone: '13800138003', address: '广州市天河区珠江新城', status: 'paid', payMethod: '微信支付', createTime: '2024-02-01 14:15:00', payTime: '2024-02-01 14:18:00', shipTime: '', completeTime: '', remark: '' }
    ]
    localStorage.setItem('mock_orders', JSON.stringify(orders))
  }

  // 初始化用户数据
  if (!localStorage.getItem('mock_users')) {
    const users = [
      { id: 1, username: 'admin', nickname: '超级管理员', password: '123456', email: 'admin@example.com', phone: '13800138000', avatar: '', role: 'admin', status: 1, createTime: '2024-01-01 00:00:00' },
      { id: 2, username: 'user', nickname: '普通用户', password: '123456', email: 'user@example.com', phone: '13800138001', avatar: '', role: 'user', status: 1, createTime: '2024-01-01 00:00:00' }
    ]
    localStorage.setItem('mock_users', JSON.stringify(users))
  }

  // 初始化日志数据
  if (!localStorage.getItem('mock_logs')) {
    const logs = [
      { id: 1, type: 'login', content: '用户登录系统', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 09:00:00' },
      { id: 2, type: 'create', content: '新增商品：iPhone 15 Pro Max', operator: 'admin', ip: '192.168.1.100', createTime: '2024-02-07 09:15:00' }
    ]
    localStorage.setItem('mock_logs', JSON.stringify(logs))
  }
}

// 自动初始化
initMockData()
