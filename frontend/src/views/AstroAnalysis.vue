<template>
  <div class="page astro-page">
    <div class="header">
      <h1 class="title">星座分析</h1>
      <p class="subtitle">结合MBTI的深度分析</p>
    </div>

    <!-- 加载中 -->
    <div class="loading" v-if="loading">
      <div class="spinner"></div>
      <p>分析中...</p>
    </div>

    <!-- 结果 -->
    <div class="result" v-else-if="analysis">
      <!-- 基本信息 -->
      <div class="info-card">
        <div class="astro-header">
          <div class="astro-icon">{{ role.sun_sign?.slice(0, 1) }}</div>
          <div class="astro-info">
            <h2>{{ role.sun_sign }}</h2>
            <p>{{ role.zodiac }} | {{ role.year_element }}年</p>
          </div>
        </div>
      </div>

      <!-- MBTI结合分析 -->
      <div class="analysis-card">
        <h3 class="card-title">♈ 星座+MBTI分析</h3>
        <div class="analysis-content" v-html="formatContent(analysis.basic)"></div>
      </div>

      <div class="analysis-card">
        <h3 class="card-title">🔥 五行分析</h3>
        <div class="analysis-content" v-html="formatContent(analysis.element_analysis)"></div>
      </div>

      <div class="analysis-card">
        <h3 class="card-title">💫 独特洞察</h3>
        <div class="analysis-content unique">{{ analysis.unique_insight }}</div>
      </div>
    </div>

    <!-- 未分析 -->
    <div class="empty" v-else>
      <p>还没有星座分析</p>
      <button class="btn btn-primary" @click="generate">生成分析</button>
    </div>

    <!-- 返回按钮 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoleStore } from '../stores/role.js'
import { astroAPI } from '../utils/api.js'

const roleStore = useRoleStore()
const loading = ref(false)
const analysis = ref(null)

const role = ref({})

onMounted(async () => {
  role.value = roleStore.currentRole || {}
  if (role.value._id) {
    try {
      const result = await astroAPI.getAnalysis(role.value._id)
      if (result.data?.analysis?.analysis) {
        analysis.value = result.data.analysis.analysis
      }
    } catch (e) {
      console.error('获取分析失败:', e)
    }
  }
})

const generate = async () => {
  if (!role.value._id) return
  
  loading.value = true
  try {
    const result = await fetch(`/api/astro/${role.value._id}`, { method: 'POST' }).then(r => r.json())
    if (result.data?.analysis?.analysis) {
      analysis.value = result.data.analysis.analysis
    }
  } catch (e) {
    console.error('生成分析失败:', e)
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
.info-card, .analysis-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px;
}

.astro-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.astro-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.astro-info h2 {
  font-size: 24px;
  margin-bottom: 4px;
}

.astro-info p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.card-title {
  font-size: 16px;
  margin-bottom: 12px;
}

.analysis-content {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.unique {
  padding: 16px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-style: italic;
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