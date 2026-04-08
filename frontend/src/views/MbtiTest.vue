<template>
  <div class="page mbti-test-page">
    <div class="header">
      <h1 class="title">MBTI测试</h1>
      <p class="subtitle">40道题，了解真实的自己</p>
    </div>

    <!-- 进度 -->
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <p class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</p>

    <!-- 问题 -->
    <div class="question-card" v-if="currentQuestion">
      <h2 class="question-title">{{ currentQuestion.text }}</h2>
      
      <div class="options">
        <button 
          v-for="(option, idx) in currentQuestion.options" 
          :key="idx"
          :class="['option-btn', answers[currentIndex] === idx + 1 && 'selected']"
          @click="selectOption(idx + 1)"
        >
          <span class="option-label">{{ idx + 1 }}</span>
          <span class="option-text">{{ idx === 0 ? '完全不同意' : (idx === 6 ? '完全同意' : (idx < 3 ? '不太同意' : '同意')) }}</span>
        </button>
      </div>

      <!-- 量表说明 -->
      <p class="scale-hint">1=完全不同意 | 4=中立 | 7=完全同意</p>
    </div>

    <!-- 按钮 -->
    <div class="btn-group">
      <button class="btn btn-secondary" @click="prev" :disabled="currentIndex === 0">
        上一题
      </button>
      <button class="btn btn-primary" @click="next" :disabled="!canNext">
        {{ currentIndex === questions.length - 1 ? '提交' : '下一题' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mbtiAPI } from '../utils/api.js'

const router = useRouter()

// 40道MBTI测试题
const questions = [
  { text: "在聚会中，你通常", options: ["主动与陌生人交谈", "等待别人来与你交谈"] },
  { text: "你更倾向于", options: ["思考后再行动", "先行动后思考"] },
  { text: "你更喜欢", options: ["务实的事实", "创新的想法"] },
  { text: "在做决定时，你更看重", options: ["逻辑和分析", "情感和价值观"] },
  { text: "你更喜欢", options: ["确定性和稳定性", "灵活性和可能性"] },
  { text: "在工作中，你更喜欢", options: ["独立完成", "团队合作"] },
  { text: "你更容易被", options: ["理性分析吸引", "情感表达吸引"] },
  { text: "你更喜欢的学习方式是", options: ["动手实践", "观看和聆听"] },
  { text: "在社交场合，你通常", options: ["主导谈话", "倾听为主"] },
  { text: "你更容易相信", options: ["亲眼所见", "内心所感"] },
  { text: "你更喜欢", options: ["按计划行事", "随机应变"] },
  { text: "在解决问题时，你更倾向于", options: ["采用熟悉的方法", "尝试新方法"] },
  { text: "你更容易被", options: ["实际结果吸引", "潜在可能吸引"] },
  { text: "你更看重", options: ["公平和正义", "仁慈和宽容"] },
  { text: "在压力下，你倾向于", options: ["保持冷静分析", "情绪化反应"] },
  { text: "你更喜欢", options: ["有条理的表达", "自由流畅的表达"] },
  { text: "在空闲时间，你更喜欢", options: ["阅读或学习", "运动或社交"] },
  { text: "你更容易被", options: ["事实和数据说服", "直觉和第六感说服"] },
  { text: "你更喜欢", options: ["按部就班的工作", "充满变化的工作"] },
  { text: "在团队中，你通常", options: ["提出新想法", "执行和完善想法"] },
  { text: "你更容易关注", options: ["当前具体问题", "未来可能性"] },
  { text: "你更看重", options: ["效率和成果", "过程和体验"] },
  { text: "在做决定时，你更容易", options: ["快速果断", "犹豫不决"] },
  { text: "你更喜欢", options: ["独自工作", "与他人合作"] },
  { text: "你更容易被", options: ["逻辑思维强的人吸引", "情感丰富的人吸引"] },
  { text: "你更喜欢的沟通方式是", options: ["直接了当", "委婉含蓄"] },
  { text: "在处理信息时，你更倾向于", options: ["关注细节", "关注整体"] },
  { text: "你更容易相信", options: ["传统和经验", "创新和变化"] },
  { text: "你更喜欢", options: ["稳定的工作环境", "充满挑战的环境"] },
  { text: "在冲突中，你倾向于", options: ["坚持立场", "寻求妥协"] },
  { text: "你更容易被", options: ["客观事实吸引", "主观感受吸引"] },
  { text: "你更喜欢", options: ["提前计划", "临时决定"] },
  { text: "在社交中，你通常", options: ["先认识新朋友", "与老朋友相处"] },
  { text: "你更看重", options: ["能力和效率", "关系和和谐"] },
  { text: "你更容易感到", options: ["自信和果断", "敏感和犹豫"] },
  { text: "你更喜欢", options: ["遵守规则", "打破常规"] },
  { text: "在工作中，你更看重", options: ["完成任务", "与人相处"] },
  { text: "你更容易被", options: ["实际成果吸引", "创意想法吸引"] },
  { text: "你更喜欢的学习方式是", options: ["独立学习", "讨论交流"] },
  { text: "在空闲时，你更喜欢", options: ["有目的的活动", "随意的活动"] }
]

const currentIndex = ref(0)
const answers = ref(new Array(questions.length).fill(null))

const currentQuestion = computed(() => questions[currentIndex.value])
const progress = computed(() => ((currentIndex.value + 1) / questions.length) * 100)
const canNext = computed(() => answers.value[currentIndex.value] !== null)

const selectOption = (value) => {
  answers.value[currentIndex.value] = value
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const next = async () => {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  } else {
    // 提交
    try {
      const result = await mbtiAPI.submitTest('current', answers.value)
      router.push({
        path: '/mbti-result',
        query: { data: JSON.stringify(result.data.mbti) }
      })
    } catch (error) {
      alert('提交失败: ' + error.message)
    }
  }
}
</script>

<style scoped>
.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 0 20px;
}

.progress {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 12px 0 24px;
}

.question-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin: 0 20px;
}

.question-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.option-btn.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.2);
}

.option-label {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.option-text {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
}

.scale-hint {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 16px;
}

.btn-group {
  display: flex;
  gap: 12px;
  padding: 20px;
}

.btn-group .btn {
  flex: 1;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>