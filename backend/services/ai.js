// MiniMax AI 服务
import fetch from 'node-fetch'

// 获取环境变量（MiniMax）
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || ''
const MINIMAX_BASE_URL = 'https://api.minimax.chat/v1'

// 调用MiniMax API
export async function chatCompletion(messages, options = {}) {
  const { model = 'MiniMax-M2.1', temperature = 0.7, max_tokens = 2000 } = options
  
  try {
    // MiniMax需要把前一条system消息和user消息合并
    let systemContent = ''
    let userContent = ''
    
    messages.forEach(msg => {
      if (msg.role === 'system') {
        systemContent = msg.content
      } else if (msg.role === 'user') {
        userContent = msg.content
      }
    })
    
    const response = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: userContent }
        ],
        temperature,
        max_tokens
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.base_resp?.status_msg || 'AI调用失败')
    }
    
    return data.choices[0].message.content
  } catch (error) {
    console.error('MiniMax API调用失败:', error)
    throw error
  }
}

// 根据Prompt生成内容
export async function generate(prompt, context = {}, options = {}) {
  const systemMessage = `你是${prompt.role}。${prompt.description}`
  
  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: prompt.template(context) }
  ]
  
  return chatCompletion(messages, options)
}

// 加载Prompt文件
export async function loadPrompt(name) {
  try {
    const module = await import(`../../prompts/${name}.js`)
    return module.default
  } catch (error) {
    console.error(`加载Prompt失败: ${name}`, error)
    throw error
  }
}

// MBTI分析
export async function analyzeMBTI(roleData, mbtiData) {
  const prompt = await loadPrompt('mbti')
  return generate(prompt, { role: roleData, mbti: mbtiData })
}

// 星座分析
export async function analyzeAstro(roleData) {
  const prompt = await loadPrompt('astro')
  return generate(prompt, { role: roleData })
}

// 每日运势
export async function analyzeDaily(roleData) {
  const prompt = await loadPrompt('daily')
  return generate(prompt, { role: roleData })
}

// 抽签解读
export async function interpretFortune(roleData, fortuneData) {
  const prompt = await loadPrompt('fortune')
  return generate(prompt, { role: roleData, fortune: fortuneData })
}

// 解梦
export async function interpretDream(roleData, dreamContent) {
  const prompt = await loadPrompt('dream')
  return generate(prompt, { role: roleData, dream: dreamContent })
}

// 解卦
export async function interpretHexagram(roleData, hexagramData) {
  const prompt = await loadPrompt('hexagram')
  return generate(prompt, { role: roleData, hexagram: hexagramData })
}

// AI聊天
export async function chat(roleData, message, history = []) {
  const prompt = await loadPrompt('chat')
  
  const messages = [
    { role: 'system', content: `${prompt.role}: ${prompt.description}` }
  ]
  
  // 添加历史记录
  history.forEach(msg => {
    messages.push({ role: msg.role, content: msg.content })
  })
  
  // 添加当前消息
  messages.push({ role: 'user', content: message })
  
  return chatCompletion(messages)
}

// 生日密码
export async function analyzeLifeNumber(roleData) {
  const prompt = await loadPrompt('life_number')
  return generate(prompt, { role: roleData })
}

// 名字解析
export async function analyzeName(roleData, name) {
  const prompt = await loadPrompt('name')
  return generate(prompt, { role: roleData, name })
}

// 合盘分析
export async function analyzeCompatibility(roleA, roleB, type) {
  const prompt = await loadPrompt('compat')
  return generate(prompt, { roleA, roleB, type })
}