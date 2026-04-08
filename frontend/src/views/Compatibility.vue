<template>
  <div class="page compat-page">
    <div class="header">
      <h1 class="title">合盘分析</h1>
      <p class="subtitle">看看你们有多契合</p>
    </div>

    <!-- 选择合盘类型 -->
    <div class="type-section" v-if="!result">
      <h3>选择分析类型</h3>
      <div class="types">
        <button 
          v-for="t in types" 
          :key="t.value"
          :class="['type-btn', selectedType === t.value && 'selected']"
          @click="selectedType = t.value"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- 选择角色B -->
      <div class="role-select" v-if="roles.length > 1">
        <h3>选择合盘对象</h3>
        <div class="roles">
          <button 
            v-for="r in roles" 
            :key="r._id"
            :class="['role-btn', selectedRoleId === r._id && 'selected']"
            @click="selectedRoleId = r._id"
          >
            {{ r.nickname }}
          </button>
        </div>
      </div>

      <button class="btn btn-primary" @click="analyze" :disabled="!selectedRoleId || loading">
        {{ loading ? '分析中...' : '开始分析' }}
      </button>
    </div>

    <!-- 结果 -->
    <div class="result" v-else>
      <!-- 契合度 -->
      <div class="score-card">
        <div class="score">{{ result.overall?.score }}</div>
        <div class="level">{{ result.overall?.level }}</div>
      </div>

      <!-- 角色信息 -->
      <div class="roles-card">
        <div class="role-item">
          <div class="role-avatar">{{ result.roleA?.slice(0, 1) }}</div>
          <div class="role-name">{{ result.roleA }}</div>
        </div>
        <div class="vs">VS</div>
        <div class="role-item">
          <div class="role-avatar">{{ result.roleB?.slice(0, 1) }}</div>
          <div class="role-name">{{ result.roleB }}</div>
        </div>
      </div>

      <!-- 详细分析 -->
      <div class="detail-card" v-if="result.detailed">
        <h3 class="card-title">📊 详细分析</h3>
        <div class="detail-content" v-html="formatContent(result.detailed)"></div>
      </div>

      <!-- 建议 -->
      <div class="advice-card">
        <h3 class="card-title">✨ 相处建议</h3>
        <p>{{ result.advice }}</p>
      </div>

      <!-- 重新分析 -->
      <button class="btn btn-secondary" @click="reset">重新分析</button>
    </div>

    <!-- 返回 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoleStore } from '../stores/role.js'
import { compatAPI } from '../utils/api.js'

const roleStore = useRoleStore()
const loading = ref(false)
const selectedType = ref('星座')
const selectedRoleId = ref('')
const result = ref(null)

const types = [
  { value: '星座', label: '星座合盘' },
  { value: '灵魂', label: '灵魂契合' },
  { value: '事业', label: '事业合作' },
  { value: '财运', label: '财运搭配' }
]

const roles = computed(() => roleStore.roles || [])
const currentRole = computed(() => roleStore.currentRole)

onMounted(() => {
  roleStore.fetchRoles()
})

const analyze = async () => {
  const roleA = currentRole.value
  if (!roleA?._id || !selectedRoleId.value) return
  
  loading.value = true
  try {
    const res = await compatAPI.analyze(roleA._id, selectedRoleId.value, selectedType.value)
    if (res.data?.compat) {
      result.value = res.data.compat
    }
  } catch (e) {
    console.error('合盘分析失败:', e)
  } finally {
    loading.value = false
  }
}

const reset = () => {
  selectedRoleId.value = ''
  result.value = null
}

const formatContent = (content) => {
  if (!content) return '暂无内容'
  if (typeof content === 'string') return content.replace(/\n/g, '<br>')
  return JSON.stringify(content)
}
</script>

<style scoped>
.type-section {
  padding: 20px;
}

.type-section h3, .role-select h3 {
  text-align: center;
  margin-bottom: 16px;
  font-size: 16px;
}

.types, .roles {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.type-btn, .role-btn {
  padding: 12px 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s;
}

.type-btn.selected, .role-btn.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

.score-card {
  text-align: center;
  padding: 40px 20px;
}

.score {
  font-size: 72px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.level {
  font-size: 24px;
  margin-top: 8px;
}

.roles-card {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 20px;
}

.role-item {
  text-align: center;
}

.role-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 8px;
}

.vs {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.6);
}

.detail-card, .advice-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 12px;
}

.detail-content, .advice-card p {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
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