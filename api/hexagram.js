// 解卦API
import { hexagramCollection, rolesCollection, toObjectId } from '../utils/db.js'
import { success, error } from '../utils/response.js'
import { interpretHexagram } from '../services/ai.js'

// 八卦基础数据
const hexagrams = {
  '�?: { name: '乾卦', meaning: '�?, direction: '西北', quality: '刚健' },
  '�?: { name: '坤卦', meaning: '�?, direction: '西南', quality: '柔顺' },
  '�?: { name: '震卦', meaning: '�?, direction: '�?, quality: '震动' },
  '�?: { name: '巽卦', meaning: '�?, direction: '东南', quality: '进入' },
  '�?: { name: '坎卦', meaning: '�?, direction: '�?, quality: '险陷' },
  '�?: { name: '离卦', meaning: '�?, direction: '�?, quality: '附丽' },
  '�?: { name: '�卦', meaning: '�?, direction: '东北', quality: '静止' },
  '�?: { name: '兑卦', meaning: '�?, direction: '�?, quality: '喜悦' }
}

// 解卦
export async function cast(roleId, hexagram, question) {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存�?)
    }
    
    const hex = hexagrams[hexagram] || hexagrams['�?]
    const changedHex = getChangedHex(hexagram)
    const changed = changedHex ? hexagrams[changedHex] : null
    
    // AI解读
    let aiInterpretation = null
    try {
      aiInterpretation = await interpretHexagram(role, {
        hexagram: hex,
        changed,
        question
      })
    } catch (e) {
      console.error('AI解卦失败:', e)
    }
    
    const interpretation = {
      basic: { ...hex, changed: changed?.name },
      personalized: aiInterpretation?.personalized || {},
      question_related: question ? getQuestionRelated(question, hex) : {},
      advice: getHexagramAdvice(hexagram)
    }
    
    // 存储
    const collection = hexagramCollection()
    const result = await collection.insertOne({
      role_id: toObjectId(roleId),
      hexagram: hex.name,
      changed_hex: changed?.name,
      question: question || '',
      interpretation,
      created_at: new Date()
    })
    
    return success({ 
      hexagram: {
        _id: result.insertedId.toString(),
        role_id: roleId,
        hexagram: hex.name,
        changed_hex: changed?.name,
        question,
        interpretation
      }
    })
  } catch (err) {
    console.error('解卦失败:', err)
    return error('解卦失败')
  }
}

// 变卦（简化版�?
function getChangedHex(hexagram) {
  const keys = Object.keys(hexagrams)
  return keys[Math.floor(Math.random() * keys.length)]
}

// 问题相关解读
function getQuestionRelated(question, hex) {
  const lowerQ = question?.toLowerCase() || ''
  let type = 'general'
  
  if (lowerQ.includes('事业') || lowerQ.includes('工作')) type = 'career'
  else if (lowerQ.includes('爱情') || lowerQ.includes('感情')) type = 'love'
  else if (lowerQ.includes('财运') || lowerQ.includes('�?)) type = 'money'
  
  return { type, question }
}

// 卦象建议
function getHexagramAdvice(hexagram) {
  const advice = {
    '�?: '刚健有力，但需刚柔并济，不可过于强�?,
    '�?: '柔顺包容，大地养物，需有容人之�?,
    '�?: '震动生变，危机也是转机，勇敢面对',
    '�?: '随风进入，适合学习新事物，把握时机',
    '�?: '险陷重重，需谨慎前行，不可冒�?,
    '�?: '光明附丽，前景明亮，保持热情',
    '�?: '停止静止，需冷静思考，适时休息',
    '�?: '喜悦祥和，与人为善，保持愉悦'
  }
  return advice[hexagram] || '保持平常心，顺势而为'
}
