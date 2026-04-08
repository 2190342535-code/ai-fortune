<template>
  <div class="page login-page">
    <div class="header">
      <h1 class="title">欢迎使用AI运势</h1>
      <p class="subtitle">登录后开始探索</p>
    </div>

    <div class="card login-card">
      <div class="form-group">
        <label>用户名</label>
        <input 
          type="text" 
          v-model="username" 
          placeholder="请输入用户名"
        />
      </div>
      
      <div class="form-group">
        <label>密码</label>
        <input 
          type="password" 
          v-model="password" 
          placeholder="请输入密码"
        />
      </div>

      <div class="options">
        <label class="checkbox">
          <input type="checkbox" v-model="rememberUsername" />
          <span>记住用户名</span>
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="rememberPassword" />
          <span>记住密码</span>
        </label>
      </div>
      
      <button 
        class="btn btn-primary btn-block" 
        @click="handleLogin"
        :disabled="!username || !password || loading"
      >
        {{ loading ? '登录中...' : (isRegister ? '注册' : '登录') }}
      </button>

      <div class="switch-mode">
        <span>{{ isRegister ? '已有账号？' : '没有账号？' }}</span>
        <a @click="isRegister = !isRegister">{{ isRegister ? '登录' : '注册' }}</a>
      </div>
      
      <p class="hint">{{ isRegister ? '创建账号后即可使用' : '登录后开始探索你的命运' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { useRoleStore } from '../stores/role.js'

const router = useRouter()
const userStore = useUserStore()
const roleStore = useRoleStore()

const username = ref('')
const password = ref('')
const rememberUsername = ref(true)
const rememberPassword = ref(false)
const loading = ref(false)
const isRegister = ref(false)

onMounted(() => {
  // 读取保存的用户名
  const savedUsername = localStorage.getItem('savedUsername')
  if (savedUsername) {
    username.value = savedUsername
  }
  
  // 读取记住的密码
  const savedPassword = localStorage.getItem('savedPassword')
  if (savedPassword) {
    password.value = savedPassword
    rememberPassword.value = true
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码')
    return
  }
  
  loading.value = true
  try {
    // 记住用户名（默认）
    if (rememberUsername.value) {
      localStorage.setItem('savedUsername', username.value)
    } else {
      localStorage.removeItem('savedUsername')
    }
    
    // 记住密码（可选）
    if (rememberPassword.value) {
      localStorage.setItem('savedPassword', password.value)
    } else {
      localStorage.removeItem('savedPassword')
    }
    
    // 调用登录/注册API
    const result = await userStore.login(username.value, password.value, isRegister.value)
    
    if (result.success) {
      // 获取角色列表
      await roleStore.fetchRoles()
      // 跳转到首页
      router.replace('/')
    } else {
      alert(result.message || '登录失败，请重试')
    }
  } catch (error) {
    alert('登录失败，请重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  padding: 20px;
}

.header {
  text-align: center;
  padding: 40px 20px;
}

.title {
  font-size: 28px;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
}

.login-card {
  padding: 30px 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.checkbox input {
  width: 16px;
  height: 16px;
}

.btn-block {
  width: 100%;
  padding: 14px;
  font-size: 16px;
}

.switch-mode {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.switch-mode span {
  color: #999;
}

.switch-mode a {
  color: #667eea;
  margin-left: 8px;
  cursor: pointer;
}

.hint {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 16px;
}
</style>