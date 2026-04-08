<template>
  <div class="page daily-page">
    <div class="header">
      <h1 class="title">今日运势</h1>
      <p class="subtitle">{{ today }}</p>
    </div>

    <!-- 加载中 -->
    <div class="loading" v-if="loading">
      <div class="spinner"></div>
      <p>解读中...</p>
    </div>

    <!-- 运势结果 -->
    <div class="result" v-else-if="daily">
      <!-- 幸运元素 -->
      <div class="lucky-card">
        <h3 class="card-title">🎁 今日幸运</h3>
        <div class="lucky-grid">
          <div class="lucky-item">
            <span class="lucky-label">方位</span>
            <span class="lucky-value">{{ daily.lucky?.direction }}</span>
          </div>
          <div class="lucky-item">
            <span class="lucky-label">颜色</span>
            <span class="lucky-value">{{ daily.lucky?.color?.[0] }}</span>
          </div>
          <div class="lucky-item">
            <span class="lucky-label">数字</span>
            <span class="lucky-value">{{ daily.lucky?.number?.[0] }}</span>
          </div>
          <div class="lucky-item">
            <span class="lucky-label">五行</span>
            <span class="lucky-value">{{ daily.key_insights?.keyElement }}</span>
          </div>
        </div>
      </div>

      <!-- 关键洞察 -->
      <div class="insight-card">
        <h3 class="card-title">💡 关键洞察</h3>
        <div class="insight-content">
          <p v-if="daily.key_insights?.elementRelation">
            你的{{ role.year_element }}年属性与今日{{ daily.key_insights.keyElement }}属性的关系：<strong>{{ daily.key_insights.elementRelation }}</strong>
          </p>
        </div>
      </div>

      <!-- AI分析 -->
      <div class="analysis-card" v-if="daily.detailed">
        <h3 class="card-title">🔮 深度解读</h3>
        <div class="analysis-content" v-html="formatContent(daily.detailed)"></div>
      </div>

      <!-- 建议 -->
      <div class="advice-card">
        <h3 class="card-title">✨ 今日建议</h3>
        <p class="advice-text">{{ daily.advice }}</p>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty" v-else>
      <p>还没有今日运势</p>
      <button class="btn btn-primary" @click="generate">查看运势</button>
    </div>

    <!-- 返回 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoleStore } from '../stores/role.js'
import { dailyAPI } from '../utils/api.js'

const roleStore = useRoleStore()
const loading = ref(false)
const daily = ref(null)
const today = ref(new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }))

const role = ref({})

onMounted(async () => {
  role.value = roleStore.currentRole || {}
  if (role.value._id) {
    try {
      const result = await dailyAPI.getDaily(role.value._id)
      if (result.data?.daily) {
        daily.value = result.data.daily.luck_data
      }
    } catch (e) {
      console.error('获取运势失败:', e)
    }
  }
})

const generate = async () => {
  if (!role.value._id) return
  
  loading.value = true
  try {
    const result = await fetch(`/api/daily/${role.value._id}`, { method: 'POST' }).then(r => r.json())
    if (result.data?.daily?.luck_data) {
      daily.value = result.data.daily.luck_data
    }
  } catch (e) {
    console.error('生成运势失败:', e)
  } finally {
    loading.value = false
  }
}

const formatContent = (content) => {
  if (!content) return '暂无内容'
  if (typeof content === 'string') return content.replace(/\n/g, '<br>')
  return JSON.stringify(content)
}
</script>

<style scoped>
.lucky-card, .insight-card, .analysis-card, .advice-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 16px;
}

.lucky-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.lucky-item {
  text-align: center;
  padding: 12px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 12px;
}

.lucky-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.lucky-value {
  font-size: 18px;
  font-weight: 600;
}

.insight-content, .analysis-content {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.advice-text {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.95);
}

.loading, .empty {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
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