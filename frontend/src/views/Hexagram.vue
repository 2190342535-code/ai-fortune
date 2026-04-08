<template>
  <div class="page hexagram-page">
    <div class="header">
      <h1 class="title">解卦</h1>
      <p class="subtitle">摇一摇，求问一卦</p>
    </div>

    <!-- 输入问题 -->
    <div class="input-section" v-if="!hexagram">
      <input 
        type="text" 
        class="input" 
        v-model="question" 
        placeholder="想问什么问题？比如：事业发展、财运..."
      >
      <button class="btn btn-primary" @click="cast" :disabled="loading">
        {{ loading ? '起卦中...' : '诚心摇卦' }}
      </button>
    </div>

    <!-- 卦象结果 -->
    <div class="result" v-else>
      <!-- 卦象展示 -->
      <div class="hexagram-card">
        <div class="hexagram-name">{{ hexagram.hexagram }}</div>
        <div class="hexagram-meaning" v-if="hexagram.interpretation?.basic">
          <p>代表：{{ hexagram.interpretation.basic.meaning }}</p>
          <p>方向：{{ hexagram.interpretation.basic.direction }}</p>
        </div>
      </div>

      <!-- 变卦 -->
      <div class="changed-card" v-if="hexagram.changed_hex">
        <h3 class="card-title">🔄 变卦</h3>
        <p>{{ hexagram.changed_hex }}</p>
      </div>

      <!-- 解读 -->
      <div class="interpretation-card">
        <h3 class="card-title">🔮 卦象解读</h3>
        <div v-if="hexagram.interpretation?.basic">
          <p><strong>基本含义：</strong>{{ hexagram.interpretation.basic.quality }}</p>
        </div>
        <div v-if="hexagram.interpretation?.question_related?.type">
          <p><strong>问题类型：</strong>{{ hexagram.interpretation.question_related.type }}</p>
        </div>
      </div>

      <!-- 建议 -->
      <div class="advice-card">
        <h3 class="card-title">✨ 解卦建议</h3>
        <p>{{ hexagram.interpretation?.advice }}</p>
      </div>

      <!-- 重新解卦 -->
      <button class="btn btn-secondary" @click="reset">重新解卦</button>
    </div>

    <!-- 返回 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { hexagramAPI } from '../utils/api.js'
import { useRoleStore } from '../stores/role.js'

const roleStore = useRoleStore()
const loading = ref(false)
const question = ref('')
const hexagram = ref(null)

const cast = async () => {
  const role = roleStore.currentRole
  if (!role?._id) return
  
  loading.value = true
  try {
    // 随机选择一个卦
    const hexagrams = ['乾', '坤', '震', '巽', '坎', '离', '艮', '兑']
    const hex = hexagrams[Math.floor(Math.random() * hexagrams.length)]
    
    const result = await hexagramAPI.cast(role._id, hex, question.value)
    if (result.data?.hexagram) {
      hexagram.value = result.data.hexagram
    }
  } catch (e) {
    console.error('解卦失败:', e)
  } finally {
    loading.value = false
  }
}

const reset = () => {
  question.value = ''
  hexagram.value = null
}
</script>

<style scoped>
.input-section {
  padding: 20px;
}

.input-section .input {
  margin-bottom: 16px;
}

.hexagram-card {
  text-align: center;
  padding: 40px 20px;
}

.hexagram-name {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.hexagram-meaning p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 8px 0;
}

.changed-card, .interpretation-card, .advice-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 12px;
}

.interpretation-card p, .advice-card p {
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