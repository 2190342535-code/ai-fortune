<template>
  <div class="page home-page">
    <!-- 头部 -->
    <div class="header">
      <h1 class="title">AI运势</h1>
      <p class="subtitle">你的私人定制分析</p>
    </div>

    <!-- 角色卡片 -->
    <div v-if="roleStore.currentRole" class="card role-card">
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
    </div>

    <!-- 添加角色按钮 -->
    <div class="add-role-section" v-if="!roleStore.currentRole">
      <button class="btn btn-primary" @click="$router.push('/create-role')">
        + 创建角色
      </button>
    </div>

    <!-- 底部导航 -->
    <div class="tab-bar">
      <div class="tab-item active">
        <span class="tab-icon">🏠</span>
        <span>首页</span>
      </div>
      <div class="tab-item">
        <span class="tab-icon">🔮</span>
        <span>运势</span>
      </div>
      <div class="tab-item">
        <span class="tab-icon">👤</span>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoleStore } from '../stores/role.js'

const roleStore = useRoleStore()

onMounted(async () => {
  await roleStore.fetchRoles()
})
</script>

<style scoped>
.header {
  text-align: center;
  padding: 40px 20px;
}

.role-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.role-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.role-name {
  font-size: 20px;
  margin-bottom: 8px;
}

.role-tags {
  display: flex;
  gap: 8px;
}

.tag {
  background: rgba(102, 126, 234, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.feature-item:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.1);
}

.feature-icon {
  font-size: 28px;
}

.feature-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.add-role-section {
  padding: 20px;
  text-align: center;
}
</style>