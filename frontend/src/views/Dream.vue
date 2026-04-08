<template>
  <div class="page dream-page">
    <div class="header">
      <h1 class="title">解梦</h1>
      <p class="subtitle">记录你的梦境，解读潜意识</p>
    </div>

    <!-- 输入梦境 -->
    <div class="input-section" v-if="!dream">
      <textarea 
        class="dream-input" 
        v-model="content" 
        placeholder="描述你的梦境...&#10;&#10;比如：我梦到在水里游泳，水很清澈，突然变成了大海..."
        rows="6"
      ></textarea>
      <button class="btn btn-primary" @click="interpret" :disabled="!content || loading">
        {{ loading ? '解读中...' : '开始解梦' }}
      </button>
    </div>

    <!-- 解梦结果 -->
    <div class="result" v-else>
      <!-- 梦境内容 -->
      <div class="dream-card">
        <h3 class="card-title">💭 梦境记录</h3>
        <p class="dream-content">{{ dream.content }}</p>
      </div>

      <!-- 关键元素 -->
      <div class="elements-card" v-if="dream.elements">
        <h3 class="card-title">🔑 梦境元素</h3>
        <div class="elements">
          <span class="element" v-for="el in dream.elements" :key="el">{{ el }}</span>
        </div>
      </div>

      <!-- 解读 -->
      <div class="interpretation-card">
        <h3 class="card-title">🔮 潜意识解读</h3>
        <div class="interpretation" v-html="formatContent(dream.interpretation?.personalized)"></div>
      </div>

      <!-- 建议 -->
      <div class="advice-card">
        <h3 class="card-title">✨ 心灵建议</h3>
        <p>{{ dream.interpretation?.advice }}</p>
      </div>

      <!-- 重新解梦 -->
      <button class="btn btn-secondary" @click="reset">重新解梦</button>
    </div>

    <!-- 返回 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { dreamAPI } from '../utils/api.js'
import { useRoleStore } from '../stores/role.js'

const roleStore = useRoleStore()
const loading = ref(false)
const content = ref('')
const dream = ref(null)

const interpret = async () => {
  const role = roleStore.currentRole
  if (!role?._id || !content.value) return
  
  loading.value = true
  try {
    const result = await dreamAPI.interpret(role._id, content.value)
    if (result.data?.dream) {
      dream.value = result.data.dream
    }
  } catch (e) {
    console.error('解梦失败:', e)
  } finally {
    loading.value = false
  }
}

const reset = () => {
  content.value = ''
  dream.value = null
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

.dream-input {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  margin-bottom: 16px;
}

.dream-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.dream-card, .elements-card, .interpretation-card, .advice-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 12px;
}

.dream-content {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.elements {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.element {
  padding: 6px 14px;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 14px;
  font-size: 14px;
}

.interpretation, .advice-card p {
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