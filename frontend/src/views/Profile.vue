<template>
  <div class="page profile-page">
    <div class="header">
      <h1 class="title">我的</h1>
    </div>

    <!-- 当前角色 -->
    <div class="current-role" v-if="currentRole">
      <div class="role-card">
        <div class="role-avatar">{{ currentRole.nickname?.slice(0, 1) }}</div>
        <div class="role-info">
          <h2>{{ currentRole.nickname }}</h2>
          <p>{{ currentRole.sun_sign }} | {{ currentRole.zodiac }}</p>
          <p>{{ currentRole.year_element }}年</p>
        </div>
        <div class="role-badge" v-if="currentRole.is_active">当前</div>
      </div>
    </div>

    <!-- 角色列表 -->
    <div class="roles-section" v-if="roles.length > 1">
      <h3 class="section-title">切换角色</h3>
      <div class="role-list">
        <div 
          v-for="role in roles" 
          :key="role._id"
          :class="['role-item', role.is_active && 'active']"
          @click="switchRole(role._id)"
        >
          <div class="role-avatar-small">{{ role.nickname?.slice(0, 1) }}</div>
          <div class="role-item-info">
            <span class="role-item-name">{{ role.nickname }}</span>
            <span class="role-item-sign">{{ role.sun_sign }}</span>
          </div>
          <span class="check-icon" v-if="role.is_active">✓</span>
        </div>
      </div>
    </div>

    <!-- 添加角色按钮 -->
    <div class="add-role">
      <button class="btn btn-secondary" @click="$router.push('/create-role')">
        + 添加新角色
      </button>
    </div>

    <!-- 菜单 -->
    <div class="menu-section">
      <div class="menu-item" @click="handleDelete" v-if="roles.length > 1">
        <span class="menu-icon">🗑️</span>
        <span>删除当前角色</span>
      </div>
      <div class="menu-item" @click="about">
        <span class="menu-icon">ℹ️</span>
        <span>关于</span>
      </div>
    </div>

    <!-- 返回 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoleStore } from '../stores/role.js'

const router = useRouter()
const roleStore = useRoleStore()

const roles = computed(() => roleStore.roles || [])
const currentRole = computed(() => roleStore.currentRole)

onMounted(() => {
  roleStore.fetchRoles()
})

const switchRole = async (roleId) => {
  if (roleId === currentRole.value?._id) return
  try {
    await roleStore.setActiveRole(roleId)
  } catch (e) {
    console.error('切换角色失败:', e)
  }
}

const handleDelete = async () => {
  if (!currentRole.value?._id || roles.value.length <= 1) return
  
  if (confirm('确定要删除这个角色吗？')) {
    try {
      await roleStore.deleteRole(currentRole.value._id)
      router.push('/')
    } catch (e) {
      console.error('删除角色失败:', e)
    }
  }
}

const about = () => {
  alert('AI运势小程序 v1.0\n基于AI的个性化运势分析')
}
</script>

<style scoped>
.current-role {
  padding: 20px;
}

.role-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  position: relative;
}

.role-avatar {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
}

.role-info h2 {
  font-size: 20px;
  margin-bottom: 4px;
}

.role-info p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.role-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  font-size: 12px;
}

.roles-section {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  margin-bottom: 16px;
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.role-item.active {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.5);
}

.role-avatar-small {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.role-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.role-item-name {
  font-size: 16px;
}

.role-item-sign {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.check-icon {
  color: #667eea;
  font-size: 18px;
}

.add-role {
  padding: 20px;
}

.menu-section {
  padding: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
}

.menu-icon {
  font-size: 20px;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
}
</style>