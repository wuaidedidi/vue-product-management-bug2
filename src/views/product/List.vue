<template>
  <div class="product-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">商品列表</h1>
      <p class="page-desc">管理平台中的所有商品信息</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-bar">
      <el-input
        v-model="searchForm.keyword"
        placeholder="搜索商品名称/编码"
        prefix-icon="Search"
        clearable
        style="width: 240px"
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      />
      <el-select
        v-model="searchForm.categoryId"
        placeholder="选择分类"
        clearable
        style="width: 160px"
        @change="handleSearch"
      >
        <el-option
          v-for="cat in categories"
          :key="cat.id"
          :label="cat.name"
          :value="cat.id"
        />
      </el-select>
      <el-select
        v-model="searchForm.status"
        placeholder="商品状态"
        clearable
        style="width: 120px"
        @change="handleSearch"
      >
        <el-option label="上架" :value="1" />
        <el-option label="下架" :value="0" />
      </el-select>
      <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
      <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
      <div style="flex: 1"></div>
      <el-button type="primary" :icon="Plus" @click="openDialog()">添加商品</el-button>
    </div>

    <!-- 商品表格 -->
    <div class="table-container card">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="code" label="商品编码" width="120" />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
              <el-button
                :type="row.status === 1 ? 'warning' : 'success'"
                link
                @click="toggleStatus(row)"
              >
                {{ row.status === 1 ? '下架' : '上架' }}
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </div>

    <!-- 添加/编辑商品弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingProduct ? '编辑商品' : '添加商品'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="1"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 200px" />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">上架</el-radio>
            <el-radio :value="0">下架</el-radio>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'


// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  categoryId: null,
  status: null
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 分类数据
const categories = ref([
  { id: 1, name: '电子产品' },
  { id: 2, name: '服装鞋包' },
  { id: 3, name: '食品饮料' },
  { id: 4, name: '家居用品' },
  { id: 5, name: '美妆护肤' }
])

// 表格数据
const tableData = ref([])

// 弹窗相关
const dialogVisible = ref(false)
const editingProduct = ref(null)
const formRef = ref(null)

const form = reactive({
  name: '',
  code: '',
  categoryId: null,
  price: 0,
  stock: 0,
  image: '',
  description: '',
  status: 1
})

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { max: 100, message: '商品名称不能超过100个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入商品编码', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' }
  ]
}

// 初始化商品数据
const initProducts = () => {
  const stored = localStorage.getItem('mock_products')
  if (stored) {
    return JSON.parse(stored)
  }

  // 默认商品数据
  const defaultProducts = [
    { id: 1, name: 'iPhone 15 Pro Max', code: 'IPHONE15PM', categoryId: 1, categoryName: '电子产品', price: 9999, stock: 100, sales: 256, image: '', description: '苹果最新旗舰手机', status: 1, createTime: '2024-01-15 10:00:00' },
    { id: 2, name: 'MacBook Pro 14"', code: 'MBP14', categoryId: 1, categoryName: '电子产品', price: 14999, stock: 50, sales: 128, image: '', description: 'M3 Pro芯片，强劲性能', status: 1, createTime: '2024-01-15 10:00:00' },
    { id: 3, name: 'AirPods Pro 2', code: 'AIRPODSPRO2', categoryId: 1, categoryName: '电子产品', price: 1899, stock: 200, sales: 512, image: '', description: '主动降噪，空间音频', status: 1, createTime: '2024-01-15 10:00:00' },
    { id: 4, name: '男士休闲夹克', code: 'JACKET001', categoryId: 2, categoryName: '服装鞋包', price: 399, stock: 150, sales: 89, image: '', description: '时尚简约，舒适百搭', status: 1, createTime: '2024-01-15 10:00:00' },
    { id: 5, name: '女士连衣裙', code: 'DRESS001', categoryId: 2, categoryName: '服装鞋包', price: 299, stock: 80, sales: 156, image: '', description: '优雅气质，修身显瘦', status: 1, createTime: '2024-01-15 10:00:00' },
    { id: 6, name: '进口红酒礼盒', code: 'WINE001', categoryId: 3, categoryName: '食品饮料', price: 599, stock: 30, sales: 45, image: '', description: '法国原装进口', status: 1, createTime: '2024-01-15 10:00:00' },
    { id: 7, name: '有机坚果礼盒', code: 'NUTS001', categoryId: 3, categoryName: '食品饮料', price: 168, stock: 200, sales: 320, image: '', description: '精选优质坚果', status: 0, createTime: '2024-01-15 10:00:00' },
    { id: 8, name: '北欧风格沙发', code: 'SOFA001', categoryId: 4, categoryName: '家居用品', price: 2999, stock: 20, sales: 18, image: '', description: '简约设计，舒适体验', status: 1, createTime: '2024-01-15 10:00:00' },
    { id: 9, name: '智能台灯', code: 'LAMP001', categoryId: 4, categoryName: '家居用品', price: 199, stock: 300, sales: 450, image: '', description: '护眼调光，智能控制', status: 1, createTime: '2024-01-15 10:00:00' },
    { id: 10, name: '精华液套装', code: 'SERUM001', categoryId: 5, categoryName: '美妆护肤', price: 799, stock: 60, sales: 230, image: '', description: '深层补水，焕亮肌肤', status: 1, createTime: '2024-01-15 10:00:00' }
  ]

  localStorage.setItem('mock_products', JSON.stringify(defaultProducts))
  return defaultProducts
}

// 加载数据
const loadData = () => {
  loading.value = true

  setTimeout(() => {
    let products = initProducts()

    // 筛选
    if (searchForm.keyword) {
      const keyword = searchForm.keyword.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.code.toLowerCase().includes(keyword)
      )
    }
    if (searchForm.categoryId) {
      products = products.filter(p => p.categoryId === searchForm.categoryId)
    }
    if (searchForm.status !== null && searchForm.status !== '') {
      products = products.filter(p => p.status === searchForm.status)
    }

    pagination.total = products.length

    // 分页
    const start = (pagination.page - 1) * pagination.size
    tableData.value = products.slice(start, start + pagination.size)

    loading.value = false
  }, 300)
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.categoryId = null
  searchForm.status = null
  handleSearch()
}

// 打开弹窗
const openDialog = (product = null) => {
  editingProduct.value = product
  if (product) {
    Object.assign(form, product)
  } else {
    form.name = ''
    form.code = ''
    form.price = 0
    form.stock = 0
    form.image = ''
    form.description = ''
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
    const products = initProducts()
    const category = categories.value.find(c => c.id === form.categoryId)

    if (editingProduct.value) {
      // 编辑
      const index = products.findIndex(p => p.id === editingProduct.value.id)
      if (index > -1) {
        products[index] = {
          ...products[index],
          ...form,
          categoryName: category?.name || ''
        }
      }
      ElMessage.success('商品更新成功')
    } else {
      // 新增
      const newProduct = {
        id: Date.now(),
        ...form,
        categoryName: '',
        sales: 0,
        createTime: new Date().toLocaleString()
      }
      products.unshift(newProduct)
      ElMessage.success('商品添加成功')
    }

    localStorage.setItem('mock_products', JSON.stringify(products))
    dialogVisible.value = false
    submitting.value = false
    loadData()
  }, 500)
}

// 切换状态
const toggleStatus = (product) => {
  const action = product.status === 1 ? '下架' : '上架'
  ElMessageBox.confirm(`确定要${action}「${product.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const products = initProducts()
    const index = products.findIndex(p => p.id === product.id)
    if (index > -1) {
      products[index].status = product.status === 1 ? 0 : 1
      localStorage.setItem('mock_products', JSON.stringify(products))
      ElMessage.success(`${action}成功`)
      loadData()
    }
  }).catch(() => {})
}

// 删除
const handleDelete = (product) => {
  ElMessageBox.confirm(`确定要删除「${product.name}」吗？删除后不可恢复。`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let products = initProducts()
    products = products.filter(p => p.id !== product.id)
    localStorage.setItem('mock_products', JSON.stringify(products))
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.product-list {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.table-container {
  margin-top: 0;
}

.price {
  font-weight: 600;
  color: #ef4444;
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

:deep(.el-dialog__body) {
  padding-top: 16px;
}
</style>
