// 合盘分析API
import { compatCollection, rolesCollection, toObjectId } from '../../utils/db.js'
import { success, error } from '../../utils/response.js'
import { analyzeCompatibility } from '../services/ai.js'

// 合盘分析
export async function analyze(roleAId, roleBId, type = '星座') {
  try {
    const roles = rolesCollection()
    const roleA = await roles.findOne({ _id: toObjectId(roleAId) })
    const roleB = await roles.findOne({ _id: toObjectId(roleBId) })
    
    if (!roleA || !roleB) {
      return error('角色不存在')
    }
    
    // 基础分析
    let basic = {}
    
    if (type === '星座') {
      basic = calcAstroCompat(roleA, roleB)
    } else if (type === '灵魂') {
      basic = calcSoulCompat(roleA, roleB)
    } else if (type === '事业') {
      basic = calcCareerCompat(roleA, roleB)
    } else if (type === '财运') {
      basic = calcMoneyCompat(roleA, roleB)
    }
    
    // AI分析
    let aiResult = null
    try {
      aiResult = await analyzeCompatibility(roleA, roleB, type)
    } catch (e) {
      console.error('AI合盘分析失败:', e)
    }
    
    const result = {
      overall: {
        score: basic.score,
        level: basic.level
      },
      detailed: aiResult || basic,
      advice: basic.advice
    }
    
    // 存储
    const collection = compatCollection()
    const dbResult = await collection.insertOne({
      role_a_id: toObjectId(roleAId),
      role_b_id: toObjectId(roleBId),
      type,
      result,
      created_at: new Date()
    })
    
    return success({ 
      compat: {
        _id: dbResult.insertedId.toString(),
        roleA: roleA.nickname,
        roleB: roleB.nickname,
        type,
        ...result
      }
    })
  } catch (err) {
    console.error('合盘分析失败:', err)
    return error('合盘分析失败')
  }
}

// 星座兼容性计算
function calcAstroCompat(roleA, roleB) {
  // 12星座兼容性表（简化版）
  const compatScores = {
    '白羊座': { '白羊座': 70, '金牛座': 65, '双子座': 85, '巨蟹座': 60, '狮子座': 90, '处女座': 55, '天秤座': 80, '天蝎座': 75, '射手座': 95, '摩羯座': 50, '水瓶座': 85, '双鱼座': 70 },
    '金牛座': { '白羊座': 65, '金牛座': 75, '双子座': 60, '巨蟹座': 85, '狮子座': 70, '处女座': 90, '天秤座': 75, '天蝎座': 95, '射手座': 55, '摩羯座': 85, '水瓶座': 60, '双鱼座': 80 },
    '双子座': { '白羊座': 85, '金牛座': 60, '双子座': 70, '巨蟹座': 65, '狮子座': 80, '处女座': 75, '天秤座': 90, '天蝎座': 60, '射手座': 85, '摩羯座': 55, '水瓶座': 95, '双鱼座': 65 },
    '巨蟹座': { '白羊座': 60, '金牛座': 85, '双子座': 65, '巨蟹座': 75, '狮子座': 65, '处女座': 80, '天秤座': 70, '天蝎座': 90, '射手座': 55, '摩羯座': 75, '水瓶座': 60, '双鱼座': 95 },
    '狮子座': { '白羊座': 90, '金牛座': 70, '双子座': 80, '巨蟹座': 65, '狮子座': 75, '处女座': 65, '天秤座': 85, '天蝎座': 70, '射手座': 95, '摩羯座': 60, '水瓶座': 75, '双鱼座': 65 },
    '处女座': { '白羊座': 55, '金牛座': 90, '双子座': 75, '巨蟹座': 80, '狮子座': 65, '处女座': 75, '天秤座': 80, '天蝎座': 85, '射手座': 60, '摩羯座': 90, '水瓶座': 70, '双鱼座': 75 },
    '天秤座': { '白羊座': 80, '金牛座': 75, '双子座': 90, '巨蟹座': 70, '狮子座': 85, '处女座': 80, '天秤座': 75, '天蝎座': 75, '射手座': 85, '摩羯座': 70, '水瓶座': 90, '双鱼座': 70 },
    '天蝎座': { '白羊座': 75, '金牛座': 95, '双子座': 60, '巨蟹座': 90, '狮子座': 70, '处女座': 85, '天秤座': 75, '天蝎座': 60, '射手座': 65, '摩羯座': 80, '水瓶座': 55, '双鱼座': 85 },
    '射手座': { '白羊座': 95, '金牛座': 55, '双子座': 85, '巨蟹座': 55, '狮子座': 95, '处女座': 60, '天秤座': 85, '天蝎座': 65, '射手座': 80, '摩羯座': 60, '水瓶座': 90, '双鱼座': 65 },
    '摩羯座': { '白羊座': 50, '金牛座': 85, '双子座': 55, '巨蟹座': 75, '狮子座': 60, '处女座': 90, '天秤座': 70, '天蝎座': 80, '射手座': 60, '摩羯座': 85, '水瓶座': 65, '双鱼座': 75 },
    '水瓶座': { '白羊座': 85, '金牛座': 60, '双子座': 95, '巨蟹座': 60, '狮子座': 75, '处女座': 70, '天秤座': 90, '天蝎座': 55, '射手座': 90, '摩羯座': 65, '水瓶座': 75, '双鱼座': 65 },
    '双鱼座': { '白羊座': 70, '金牛座': 80, '双子座': 65, '巨蟹座': 95, '狮子座': 65, '处女座': 75, '天秤座': 70, '天蝎座': 85, '射手座': 65, '摩羯座': 75, '水瓶座': 65, '双鱼座': 80 }
  }
  
  const signA = roleA.sun_sign
  const signB = roleB.sun_sign
  const score = compatScores[signA]?.[signB] || 70
  
  return {
    signA,
    signB,
    score,
    level: score >= 85 ? '高度契合' : score >= 70 ? '比较契合' : '需要磨合',
    advice: getCompatAdvice(score)
  }
}

// 灵魂契合
function calcSoulCompat(roleA, roleB) {
  const score = Math.floor(Math.random() * 30) + 70
  return {
    score,
    level: score >= 85 ? '灵魂伴侣' : score >= 70 ? '灵魂共鸣' : '需要成长',
    advice: '灵魂伴侣需要缘分的沉淀，用心经营感情。'
  }
}

// 事业契合
function calcCareerCompat(roleA, roleB) {
  const score = Math.floor(Math.random() * 30) + 65
  return {
    score,
    level: score >= 85 ? '最佳拍档' : score >= 70 ? '配合默契' : '需要互补',
    advice: '事业上取长补短，发挥各自优势。'
  }
}

// 财运契合
function calcMoneyCompat(roleA, roleB) {
  const score = Math.floor(Math.random() * 30) + 65
  return {
    score,
    level: score >= 85 ? '财运亨通' : score >= 70 ? '财源滚滚' : '需注意理财',
    advice: '两人财运互补，合理规划财务。'
  }
}

function getCompatAdvice(score) {
  if (score >= 90) return '你们天生一对，珍惜这段缘分！'
  if (score >= 80) return '你们很合拍，互相理解支持。'
  if (score >= 70) return '关系不错，需要多点沟通。'
  return '需要更多磨合，互相包容。'
}