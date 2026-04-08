<template>
  <div class="page fortune-page">
    <div class="header">
      <h1 class="title">抽签</h1>
      <p class="subtitle">诚心许愿，抽取你的运势</p>
    </div>

    <!-- 选择类型 -->
    <div class="type-selector" v-if="!fortune">
      <h3>选择求什么</h3>
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
    </div>

    <!-- 抽签按钮 -->
    <div class="draw-section" v-if="!fortune">
      <button class="btn btn-primary draw-btn" @click="draw" :disabled="loading">
        {{ loading ? '抽取中...' : '诚心许愿，开始抽签' }}
      </button>
    </div>

    <!-- 签运结果 -->
    <div class="result" v-else>
      <div class="fortune-card">
        <div class="sign" :class="getSignClass(fortune.sign)">{{ fortune.sign }}</div>
        <div class="poem">"{{ fortune.poem }}"</div>
      </div>

      <!-- AI解读 -->
      <div class="interpretation-card" v-if="fortune.interpretation">
        <h3 class="card-title">📖 签诗解读</h3>
        <div class="interpretation" v-html="formatContent(fortune.interpretation.personalized)"></div>
      </div>

      <!-- 建议 -->
      <div class="advice-card">
        <h3 class="card-title">✨ 解签建议</h3>
        <p>{{ fortune.interpretation?.advice }}</p>
      </div>

      <!-- 历史典故 -->
      <div class="history-card" v-if="fortune.interpretation?.history_link">
        <h3 class="card-title">📜 历史典故</h3>
        <p>{{ fortune.interpretation.history_link }}</p>
      </div>

      <!-- 重新抽签 -->
      <button class="btn btn-secondary" @click="reset">重新抽签</button>
    </div>

    <!-- 返回 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fortuneAPI } from '../utils/api.js'
import { useRoleStore } from '../stores/role.js'

const roleStore = useRoleStore()
const loading = ref(false)
const fortune = ref(null)
const selectedType = ref('运')

const types = [
  { value: '运', label: '整体运势' },
  { value: '事业', label: '事业发展' },
  { value: '爱情', label: '爱情运势' },
  { value: '财运', label: '财运亨通' }
]

const draw = async () => {
  const role = roleStore.currentRole
  if (!role?._id) return
  
  loading.value = true
  try {
    const result = await fortuneAPI.draw(role._id, selectedType.value)
    if (result.data?.fortune) {
      fortune.value = result.data.fortune
    }
  } catch (e) {
    console.error('抽签失败:', e)
  } finally {
    loading.value = false
  }
}

const reset = () => {
  fortune.value = null
}

const getSignClass = (sign) => {
  if (sign.includes('上上')) return 'sign-best'
  if (sign.includes('上')) return 'sign-good'
  if (sign.includes('中')) return 'sign-mid'
  return 'sign-bad'
}

const formatContent = (content) => {
  if (!content) return '暂无解读'
  if (typeof content === 'string') return content.replace(/\n/g, '<br>')
  return JSON.stringify(content)
}
</script>

<style scoped>
.type-selector {
  padding: 20px;
}

.type-selector h3 {
  text-align: center;
  margin-bottom: 16px;
  font-size: 16px;
}

.types {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.type-btn {
  padding: 12px 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s;
}

.type-btn.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

.draw-section {
  padding: 40px 20px;
  text-align: center;
}

.draw-btn {
  padding: 20px 60px;
  font-size: 18px;
}

.fortune-card {
  text-align: center;
  padding: 40px 20px;
}

.sign {
  font-size: 28px;
  font-weight: 700;
  padding: 12px 32px;
  border-radius: 24px;
  display: inline-block;
  margin-bottom: 20px;
}

.sign-best { background: linear-gradient(135deg, #FFD700, #FFA500); color: #333; }
.sign-good { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
.sign-mid { background: rgba(255, 255, 255, 0.2); color: #fff; }
.sign-bad { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.6); }

.poem {
  font-size: 18px;
  font-style: italic;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.interpretation-card, .advice-card, .history-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 12px;
}

.interpretation, .advice-card p, .history-card p {
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