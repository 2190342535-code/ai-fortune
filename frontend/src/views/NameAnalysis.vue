<template>
  <div class="page name-page">
    <div class="header">
      <h1 class="title">名字解析</h1>
      <p class="subtitle">解读名字中的五行秘密</p>
    </div>

    <!-- 输入名字 -->
    <div class="input-section" v-if="!analysis">
      <input 
        type="text" 
        class="input" 
        v-model="name" 
        placeholder="输入要解析的名字"
      >
      <button class="btn btn-primary" @click="analyze" :disabled="!name || loading">
        {{ loading ? '解析中...' : '开始解析' }}
      </button>
    </div>

    <!-- 结果 -->
    <div class="result" v-else>
      <!-- 基础信息 -->
      <div class="basic-card">
        <h2 class="name-title">{{ name }}</h2>
        <div class="basic-info">
          <div class="info-item">
            <span class="info-label">总笔画</span>
            <span class="info-value">{{ analysis.basic?.totalStrokes }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">主五行</span>
            <span class="info-value">{{ analysis.basic?.element }}</span>
          </div>
        </div>
      </div>

      <!-- 笔画详情 -->
      <div class="strokes-card">
        <h3 class="card-title">✍️ 笔画分布</h3>
        <div class="strokes">
          <span class="stroke" v-for="(s, idx) in analysis.basic?.strokes" :key="idx">
            {{ analysis.basic?.characters?.[idx] }}: {{ s }}画
          </span>
        </div>
      </div>

      <!-- AI解读 -->
      <div class="analysis-card" v-if="analysis.personalized">
        <h3 class="card-title">🔮 深度解读</h3>
        <div class="analysis" v-html="formatContent(analysis.personalized)"></div>
      </div>

      <!-- 建议 -->
      <div class="advice-card">
        <h3 class="card-title">✨ 解析建议</h3>
        <p>{{ analysis.advice }}</p>
      </div>

      <!-- 重新解析 -->
      <button class="btn btn-secondary" @click="reset">重新解析</button>
    </div>

    <!-- 返回 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { nameAPI } from '../utils/api.js'
import { useRoleStore } from '../stores/role.js'

const roleStore = useRoleStore()
const loading = ref(false)
const name = ref('')
const analysis = ref(null)

const analyze = async () => {
  const role = roleStore.currentRole
  if (!role?._id || !name.value) return
  
  loading.value = true
  try {
    const result = await nameAPI.analyze(role._id, name.value)
    if (result.data?.analysis) {
      analysis.value = result.data.analysis
    }
  } catch (e) {
    console.error('名字解析失败:', e)
  } finally {
    loading.value = false
  }
}

const reset = () => {
  name.value = ''
  analysis.value = null
}

const formatContent = (content) => {
  if (!content) return '暂无解读'
  if (typeof content === 'string') return content.replace(/\n/g, '<br>')
  return JSON.stringify(content)
}
</script>

<style scoped>
.input-section {
  padding: 20px;
}

.input-section .input {
  margin-bottom: 16px;
}

.basic-card, .strokes-card, .analysis-card, .advice-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px;
}

.name-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 20px;
}

.basic-info {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.info-item {
  text-align: center;
}

.info-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.info-value {
  font-size: 20px;
  font-weight: 600;
}

.card-title {
  font-size: 16px;
  margin-bottom: 12px;
}

.strokes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stroke {
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 14px;
}

.analysis p, .advice-card p {
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