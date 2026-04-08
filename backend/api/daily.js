// 每日运势API
import { dailyCollection, rolesCollection, toObjectId } from '../../utils/db.js'
import { success, error } from '../../utils/response.js'
import { analyzeDaily } from '../services/ai.js'
import { getDailyBaseData } from '../services/date.js'

// 获取今日运势
export async function getDaily(roleId) {
  try {
    const collection = dailyCollection()
    const today = new Date().toISOString().split('T')[0]
    
    const daily = await collection.findOne({ 
      role_id: toObjectId(roleId),
      date: today
    })
    
    if (!daily) {
      // 如果今天还没有，生成一个
      return generateDaily(roleId)
    }
    
    return success({ 
      daily: {
        ...daily,
        _id: daily._id.toString()
      }
    })
  } catch (err) {
    console.error('获取每日运势失败:', err)
    return error('获取每日运势失败')
  }
}

// 生成每日运势
export async function generateDaily(roleId) {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存在')
    }
    
    const today = new Date().toISOString().split('T')[0]
    const baseData = getDailyBaseData(role)
    
    // 调用AI分析
    let aiAnalysis = null
    try {
      aiAnalysis = await analyzeDaily(role)
    } catch (e) {
      console.error('AI分析失败:', e)
    }
    
    const luckData = {
      key_insights: baseData,
      detailed: aiAnalysis || {},
      advice: getDailyAdvice(baseData.keyElement),
      lucky: {
        direction: baseData.lucky_directions,
        color: baseData.lucky_colors,
        number: baseData.lucky_numbers
      },
      element: baseData
    }
    
    // 存储
    const collection = dailyCollection()
    const result = await collection.insertOne({
      role_id: toObjectId(roleId),
      date: today,
      luck_data: luckData,
      created_at: new Date()
    })
    
    return success({ 
      daily: {
        _id: result.insertedId.toString(),
        role_id: roleId,
        date: today,
        luck_data: luckData
      }
    })
  } catch (err) {
    console.error('生成每日运势失败:', err)
    return error('生成每日运势失败')
  }
}

// 每日建议
function getDailyAdvice(element) {
  const advice = {
    '木': '今天适合开展新项目，做决定要果断',
    '火': '今天适合社交活动，表达想法要直接',
    '土': '今天适合稳定求进，重要事项要稳妥',
    '金': '今天适合谈判交易，注意细节要严谨',
    '水': '今天适合反思规划，内心的声音要倾听'
  }
  return advice[element] || '今天保持平衡心态，顺势而为'
}