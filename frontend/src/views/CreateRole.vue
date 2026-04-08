<template>
  <div class="page create-role-page">
    <div class="header">
      <h1 class="title">创建角色</h1>
      <p class="subtitle">输入你的基本信息，我来为你分析</p>
    </div>

    <div class="form-container">
      <!-- 昵称 -->
      <div class="form-group">
        <label class="form-label">昵称</label>
        <input 
          type="text" 
          class="input" 
          v-model="form.nickname" 
          placeholder="对外显示的名字"
        >
      </div>

      <!-- 真实姓名 -->
      <div class="form-group">
        <label class="form-label">真实姓名（用于八字计算）</label>
        <input 
          type="text" 
          class="input" 
          v-model="form.real_name" 
          placeholder="可选"
        >
      </div>

      <!-- 出生日期 -->
      <div class="form-group">
        <label class="form-label">出生日期</label>
        <div class="date-inputs">
          <select class="input" v-model="form.birthday.year">
            <option value="">年</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <select class="input" v-model="form.birthday.month">
            <option value="">月</option>
            <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
          </select>
          <select class="input" v-model="form.birthday.day">
            <option value="">日</option>
            <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
      </div>

      <!-- 出生时间 -->
      <div class="form-group">
        <label class="form-label">出生时辰（用于八字）</label>
        <select class="input" v-model="form.birthday.hour">
          <option value="">不确定</option>
          <option v-for="h in 24" :key="h" :value="h - 1">{{ h - 1 }}:00</option>
        </select>
      </div>

      <!-- 农历开关 -->
      <div class="form-group">
        <label class="form-label">出生日期类型</label>
        <div class="toggle-group">
          <button 
            :class="['toggle-btn', !form.birthday.is_lunar && 'active']"
            @click="form.birthday.is_lunar = false"
          >
            阳历
          </button>
          <button 
            :class="['toggle-btn', form.birthday.is_lunar && 'active']"
            @click="form.birthday.is_lunar = true"
          >
            农历
          </button>
        </div>
      </div>

      <!-- 计算结果预览 -->
      <div class="preview-card" v-if="previewData">
        <h3 class="preview-title">自动计算结果</h3>
        <div class="preview-items">
          <div class="preview-item">
            <span class="preview-label">生肖</span>
            <span class="preview-value">{{ previewData.zodiac }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">星座</span>
            <span class="preview-value">{{ previewData.sun_sign }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">年五行</span>
            <span class="preview-value">{{ previewData.year_element }}年</span>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button 
        class="btn btn-primary submit-btn" 
        @click="handleSubmit"
        :disabled="!canSubmit"
      >
        {{ loading ? '创建中...' : '创建角色' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoleStore } from '../stores/role.js'
import { getZodiac, getSunSign, getYearElement } from '../utils/date.js'

const router = useRouter()
const roleStore = useRoleStore()

// 生成年份选项（1950-2026）
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i)

// 表单数据
const form = ref({
  nickname: '',
  real_name: '',
  birthday: {
    year: '',
    month: '',
    day: '',
    hour: '',
    is_lunar: false
  }
})

const loading = ref(false)

// 计算是否可以提交
const canSubmit = computed(() => {
  const { nickname, birthday } = form.value
  return nickname && birthday.year && birthday.month && birthday.day
})

// 实时计算预览数据
const previewData = computed(() => {
  const { birthday } = form.value
  if (!birthday.year || !birthday.month || !birthday.day) return null
  
  return {
    zodiac: getZodiac(Number(birthday.year)),
    sun_sign: getSunSign(Number(birthday.month), Number(birthday.day)),
    year_element: getYearElement(Number(birthday.year))
  }
})

// 提交
const handleSubmit = async () => {
  if (!canSubmit.value) return
  
  loading.value = true
  try {
    await roleStore.createRole({
      nickname: form.value.nickname,
      real_name: form.value.real_name,
      birthday: {
        year: Number(form.value.birthday.year),
        month: Number(form.value.birthday.month),
        day: Number(form.value.birthday.day),
        hour: form.value.birthday.hour ? Number(form.value.birthday.hour) : undefined,
        is_lunar: form.value.birthday.is_lunar
      }
    })
    router.push('/')
  } catch (error) {
    alert('创建失败: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-container {
  padding: 20px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.date-inputs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.toggle-group {
  display: flex;
  gap: 12px;
}

.toggle-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

.preview-card {
  background: rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}

.preview-title {
  font-size: 16px;
  margin-bottom: 16px;
}

.preview-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.preview-item {
  text-align: center;
}

.preview-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.preview-value {
  font-size: 16px;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
}
</style>