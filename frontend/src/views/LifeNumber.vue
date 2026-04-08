<template>
  <div class="page life-page">
    <div class="header">
      <h1 class="title">生日密码</h1>
      <p class="subtitle">生命灵数的秘密</p>
    </div>

    <!-- 加载中 -->
    <div class="loading" v-if="loading">
      <div class="spinner"></div>
    </div>

    <!-- 结果 -->
    <div class="result" v-else-if="numbers">
      <!-- 数字展示 -->
      <div class="numbers-card">
        <div class="number-item">
          <div class="num">{{ numbers.life }}</div>
          <div class="num-label">生命数</div>
        </div>
        <div class="number-item">
          <div class="num">{{ numbers.talent }}</div>
          <div class="num-label">天赋数</div>
        </div>
        <div class="number-item">
          <div class="num">{{ numbers.personality }}</div>
          <div class="num-label">性格数</div>
        </div>
        <div class="number-item">
          <div class="num">{{ numbers.destiny }}</div>
          <div class="num-label">使命数</div>
        </div>
      </div>

      <!-- 数字含义 -->
      <div class="meaning-card">
        <h3 class="card-title">🔢 数字含义</h3>
        <div class="meanings">
          <div class="meaning-item">
            <span class="m-label">生命数：</span>
            <span class="m-value">{{ meaning?.life }}</span>
          </div>
          <div class="meaning-item">
            <span class="m-label">天赋数：</span>
            <span class="m-value">{{ meaning?.talent }}</span>
          </div>
          <div class="meaning-item">
            <span class="m-label">性格数：</span>
            <span class="m-value">{{ meaning?.personality }}</span>
          </div>
          <div class="meaning-item">
            <span class="m-label">使命数：</span>
            <span class="m-value">{{ meaning?.destiny }}</span>
          </div>
        </div>
      </div>

      <!-- AI解读 -->
      <div class="analysis-card" v-if="interpretation?.personalized">
        <h3 class="card-title">🔮 深度解读</h3>
        <div class="analysis" v-html="formatContent(interpretation.personalized)"></div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty" v-else>
      <p>还没有生日密码</p>
      <button class="btn btn-primary" @click="generate">查看密码</button>
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
import { lifeAPI } from '../utils/api.js'

const roleStore = useRoleStore()
const loading = ref(false)
const numbers = ref(null)
const meaning = ref(null)
const interpretation = ref(null)

onMounted(async () => {
  const role = roleStore.currentRole
  if (role?._id) {
    try {
      const result = await lifeAPI.getLifeNumber(role._id)
      if (result.data) {
        numbers.value = result.data.numbers
        meaning.value = result.data.interpretation?.meaning
        interpretation.value = result.data.interpretation
      }
    } catch (e) {
      console.error('获取生日密码失败:', e)
    }
  }
})

const generate = async () => {
  const role = roleStore.currentRole
  if (!role?._id) return
  
  loading.value = true
  try {
    const result = await fetch(`/api/life/${role._id}`).then(r => r.json())
    if (result.data) {
      numbers.value = result.data.numbers
      meaning.value = result.data.interpretation?.meaning
      interpretation.value = result.data.interpretation
    }
  } catch (e) {
    console.error('获取生日密码失败:', e)
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
.numbers-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px;
}

.number-item {
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.num {
  font-size: 40px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.num-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
}

.meaning-card, .analysis-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 16px;
}

.meanings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meaning-item {
  font-size: 14px;
}

.m-label {
  color: rgba(255, 255, 255, 0.6);
}

.m-value {
  color: rgba(255, 255, 255, 0.9);
}

.analysis {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
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