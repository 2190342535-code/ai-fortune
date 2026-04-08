// 解梦API
import { dreamCollection, rolesCollection, toObjectId } from '../../utils/db.js'
import { success, error } from '../../utils/response.js'
import { interpretDream } from '../services/ai.js'

// 解梦
export async function interpret(roleId, content) {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存在')
    }
    
    // 提取梦境关键元素
    const elements = extractDreamElements(content)
    
    // AI解读
    let aiInterpretation = null
    try {
      aiInterpretation = await interpretDream(role, content)
    } catch (e) {
      console.error('AI解梦失败:', e)
      aiInterpretation = getDefaultInterpretation(elements)
    }
    
    const interpretation = {
      surface: content,
      personalized: aiInterpretation?.personalized || {},
      advice: aiInterpretation?.advice || getDreamAdvice(elements)
    }
    
    // 存储
    const collection = dreamCollection()
    const result = await collection.insertOne({
      role_id: toObjectId(roleId),
      content,
      elements,
      interpretation,
      created_at: new Date()
    })
    
    return success({ 
      dream: {
        _id: result.insertedId.toString(),
        role_id: roleId,
        content,
        elements,
        interpretation
      }
    })
  } catch (err) {
    console.error('解梦失败:', err)
    return error('解梦失败')
  }
}

// 提取梦境关键元素
function extractDreamElements(content) {
  const commonElements = ['水', '火', '房子', '人', '动物', '天空', '大地', '逃跑', '飞行', '死亡']
  const elements = []
  
  commonElements.forEach(el => {
    if (content.includes(el)) {
      elements.push(el)
    }
  })
  
  return elements.length > 0 ? elements : ['一般梦境']
}

// 默认解读
function getDefaultInterpretation(elements) {
  const interpretations = {
    '水': '水象征情感和潜意识，流水的方向代表情感流向',
    '火': '火象征激情或变革，需要注意情绪控制',
    '房子': '房子代表内心世界，不同房间代表不同方面',
    '人': '梦中的人物往往代表自我的某一部分',
    '死亡': '死亡通常象征转变和新开始'
  }
  
  for (const el of elements) {
    if (interpretations[el]) {
      return interpretations[el]
    }
  }
  return '梦境是潜意识的表达，反映内心深处的想法'
}

function getDreamAdvice(elements) {
  return '梦中出现的事物往往是内心状态的投射，静心感受梦中的情绪，它会告诉你真实的内心想法。'
}