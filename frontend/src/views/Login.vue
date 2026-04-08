<template>
  <div class="page login-page">
    <div class="header">
      <h1 class="title">欢迎使用AI运势</h1>
      <p class="subtitle">登录后开始探索</p>
    </div>

    <div class="card login-card">
      <div class="form-group">
        <label>手机号</label>
        <input 
          type="tel" 
          v-model="phone" 
          placeholder="请输入手机号"
          maxlength="11"
        />
      </div>
      
      <button 
        class="btn btn-primary btn-block" 
        @click="handleLogin"
        :disabled="!phone || loading"
      >
        {{ loading ? '登录中...' : '登录/注册' }}
      </button>
      
      <p class="hint">使用手机号登录，新用户会自动注册</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { useRoleStore } from '../stores/role.js'

const router = useRouter()
const userStore = useUserStore()
const roleStore = useRoleStore()

const phone = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!phone.value || phone.value.length !== 11) {
    alert('请输入正确的11位手机号')
    return
  }
  
  loading.value = true
  try {
    await userStore.login(phone.value)
    // 获取角色列表
    await roleStore.fetchRoles()
    
    // 跳转到首页
    router.replace('/')
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
  margin-bottom: 20px;
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

.btn-block {
  width: 100%;
  padding: 14px;
  font-size: 16px;
}

.hint {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 16px;
}
</style>