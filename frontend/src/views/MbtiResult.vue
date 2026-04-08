<template>
  <div class="page mbti-result-page">
    <div class="header">
      <h1 class="title">你的MBTI</h1>
    </div>

    <!-- MBTI类型 -->
    <div class="result-card">
      <div class="mbti-type">{{ mbtiType }}</div>
      <div class="mbti-name">{{ mbtiName }}</div>
      <div class="mbti-tags">
        <span class="tag" v-for="t in mbtiTags" :key="t">{{ t }}</span>
      </div>
    </div>

    <!-- 维度分析 -->
    <div class="dimensions-card">
      <h3 class="card-title">维度分析</h3>
      <div class="dimension" v-for="dim in dimensions" :key="dim.name">
        <div class="dim-header">
          <span class="dim-name">{{ dim.name }}</span>
          <span class="dim-value">{{ dim.value }}</span>
        </div>
        <div class="dim-bar">
          <div class="dim-fill" :style="{ width: dim.percent + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- AI分析结果 -->
    <div class="analysis-card" v-if="analysis">
      <h3 class="card-title">深度分析</h3>
      <div class="analysis-content" v-html="formatAnalysis(analysis)"></div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button class="btn btn-primary" @click="retest">重新测试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const mbtiType = ref('')
const mbtiName = ref('')
const mbtiTags = ref([])
const dimensions = ref([])
const analysis = ref('')

// MBTI类型名称
const mbtiNames = {
  'ENFJ': { name: '主人公', tags: ['热情', '领导力', '善于激励'] },
  'ENTJ': { name: '指挥官', tags: ['果断', '战略思维', '领导力'] },
  'ENFP': { name: '竞选者', tags: ['热情', '创意', '社交达人'] },
  'ENTP': { name: '辩论家', tags: ['聪明', '创意', '喜欢挑战'] },
  'ESFJ': { name: '执政官', tags: ['细心', '责任感', '善于照顾'] },
  'ESFP': { name: '表演者', tags: ['热情', '实际', '喜欢表现'] },
  'ESTJ': { name: '总经理', tags: ['务实', '组织能力', '领导力'] },
  'ESTP': { name: '企业家', tags: ['冒险精神', '实际', '善于行动'] },
  'INFJ': { name: '提倡者', tags: ['理想主义', '洞察力', '有原则'] },
  'INFP': { name: '调停者', tags: ['浪漫', '理想主义', '忠诚'] },
  'INTJ': { name: '建筑师', tags: ['战略思维', '独立', '高标准'] },
  'INTP': { name: '逻辑学家', tags: ['理性', '创新', '喜欢思考'] },
  'ISFJ': { name: '守卫者', tags: ['忠诚', '细心', '负责任'] },
  'ISFP': { name: '探险家', tags: ['艺术气质', '温柔', '善于观察'] },
  'ISTJ': { name: '物流师', tags: ['务实', '可靠', '有条理'] },
  'ISTP': { name: '鉴赏家', tags: ['冷静', '实用主义', '动手能力'] }
}

onMounted(() => {
  // 从路由参数或存储获取结果
  const data = route.query.data
  if (data) {
    try {
      const result = JSON.parse(data)
      mbtiType.value = result.mbti_type || 'INTJ'
      const info = mbtiNames[mbtiType.value] || { name: '待解读', tags: [] }
      mbtiName.value = info.name
      mbtiTags.value = info.tags
      analysis.value = result.analysis
    } catch (e) {
      mbtiType.value = 'INTJ'
    }
  } else {
    mbtiType.value = 'INTJ'
  }
  
  const info = mbtiNames[mbtiType.value] || { name: '待解读', tags: [] }
  mbtiName.value = info.name
  mbtiTags.value = info.tags
  
  // 计算维度
  dimensions.value = [
    { name: '外向 E', value: '70%', percent: 70 },
    { name: '直觉 N', value: '65%', percent: 65 },
    { name: '情感 F', value: '60%', percent: 60 },
    { name: '判断 J', value: '75%', percent: 75 }
  ]
})

const formatAnalysis = (text) => {
  if (!text) return '暂无分析'
  return text.replace(/\n/g, '<br>')
}

const retest = () => {
  router.push('/mbti-test')
}
</script>

<style scoped>
.result-card {
  text-align: center;
  padding: 40px 20px;
}

.mbti-type {
  font-size: 64px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mbti-name {
  font-size: 24px;
  margin: 16px 0;
}

.mbti-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(102, 126, 234, 0.3);
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
}

.dimensions-card, .analysis-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 16px 20px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 16px;
}

.dimension {
  margin-bottom: 16px;
}

.dim-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.dim-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.dim-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.analysis-content {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.actions {
  padding: 20px;
  text-align: center;
}
</style>