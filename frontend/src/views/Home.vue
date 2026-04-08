<template>
  <div class="page home-page">
    <!-- 头部 -->
    <div class="header">
      <h1 class="title">AI运势</h1>
      <p class="subtitle">你的私人定制分析</p>
    </div>

    <!-- 情况1: 未登录 → 显示登录按钮 -->
    <div v-if="!userStore.isLoggedIn" class="login-prompt">
      <p class="hint">登录后开始探索你的命运</p>
      <button class="btn btn-primary" @click="$router.push('/login')">
        登录 / 注册
      </button>
    </div>

    <!-- 情况2: 已登录但没有角色 → 显示创建角色 -->
    <div v-else-if="!roleStore.currentRole" class="create-role-prompt">
      <p class="hint">创建你的角色，开启运势之旅</p>
      <button class="btn btn-primary" @click="$router.push('/create-role')">
        + 创建角色
      </button>
    </div>

    <!-- 情况3: 已登录且有角色 → 显示角色卡片+功能网格 -->
    <div v-else>
      <!-- 角色卡片 -->
      <div class="card role-card">
        <div class="role-info">
          <div class="role-avatar">{{ roleStore.currentRole.nickname?.slice(0, 1) }}</div>
          <div class="role-details">
            <h2 class="role-name">{{ roleStore.currentRole.nickname }}</h2>
            <p class="role-tags">
              <span class="tag">{{ roleStore.currentRole.sun_sign }}</span>
              <span class="tag">{{ roleStore.currentRole.zodiac }}</span>
              <span class="tag">{{ roleStore.currentRole.year_element }}年</span>
            </p>
          </div>
        </div>
        <button class="btn btn-secondary" @click="$router.push('/profile')">管理角色</button>
      </div>

      <!-- 功能网格 -->
      <div class="feature-grid">
        <div class="feature-item" @click="$router.push('/mbti-test')">
          <div class="feature-icon">🎯</div>
          <div class="feature-name">MBTI测试</div>
        </div>
        <div class="feature-item" @click="$router.push('/astro')">
          <div class="feature-icon">🌟</div>
          <div class="feature-name">星座分析</div>
        </div>
        <div class="feature-item" @click="$router.push('/daily')">
          <div class="feature-icon">📅</div>
          <div class="feature-name">每日运势</div>
        </div>
        <div class="feature-item" @click="$router.push('/fortune')">
          <div class="feature-icon">🎴</div>
          <div class="feature-name">抽签</div>
        </div>
        <div class="feature-item" @click="$router.push('/dream')">
          <div class="feature-icon">💭</div>
          <div class="feature-name">解梦</div>
        </div>
        <div class="feature-item" @click="$router.push('/hexagram')">
          <div class="feature-icon">☯️</div>
          <div class="feature-name">解卦</div>
        </div>
        <div class="feature-item" @click="$router.push('/chat')">
          <div class="feature-icon">💬</div>
          <div class="feature-name">AI聊天</div>
        </div>
        <div class="feature-item" @click="$router.push('/life-number')">
          <div class="feature-icon">🔢</div>
          <div class="feature-name">生日密码</div>
        </div>
        <div class="feature-item" @click="$router.push('/name-analysis')">
          <div class="feature-icon">✍️</div>
          <div class="feature-name">姓名分析</div>
        </div>
        <div class="feature-item" @click="$router.push('/compatibility')">
          <div class="feature-icon">💕</div>
          <div class="feature-name">配对</div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="tab-bar">
      <div class="tab-item active">
        <span class="tab-icon">🏠</span>
        <span>首页</span>
      </div>
      <div class="tab-item" @click="$router.push('/daily')">
        <span class="tab-icon">🔮</span>
        <span>运势</span>
      </div>
      <div class="tab-item" @click="$router.push('/profile')">
        <span class="tab-icon">👤</span>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '../stores/user.js'
import { useRoleStore } from '../stores/role.js'

const userStore = useUserStore()
const roleStore = useRoleStore()

onMounted(async () => {
  // 检查登录状态
  const userId = localStorage.getItem('userId')
  if (userId) {
    userStore.userId = userId
    userStore.isLoggedIn = true
    await roleStore.fetchRoles()
  }
})
</script>

<style scoped>
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
  margin-bottom: 30px;
}

.login-prompt,
.create-role-prompt {
  text-align: center;
  padding: 40px 20px;
}

.hint {
  color: #666;
  margin-bottom: 20px;
}

.role-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 16px 20px;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.role-name {
  font-size: 18px;
  margin: 0 0 4px;
}

.role-tags {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.tag {
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 0 16px 80px;
}

.feature-item {
  background: white;
  border-radius: 12px;
  padding: 20px 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.feature-name {
  font-size: 14px;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: white;
  border-top: 1px solid #eee;
  padding: 10px 0;
}

.tab-item {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.tab-item.active {
  color: #667eea;
}

.tab-icon {
  display: block;
  font-size: 20px;
  margin-bottom: 4px;
}
</style>