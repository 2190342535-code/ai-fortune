// MBTI相关API
import { mbtiCollection, rolesCollection, toObjectId } from '../utils/db.js'
import { success, error } from '../utils/response.js'
import { analyzeMBTI } from '../services/ai.js'

// 获取角色MBTI结果
export async function getMBTIResult(roleId) {
  try {
    const collection = mbtiCollection()
    
    const mbti = await collection.findOne({ role_id: toObjectId(roleId) })
    if (!mbti) {
      return error('未完成MBTI测试')
    }
    
    return success({ 
      mbti: {
        ...mbti,
        _id: mbti._id.toString()
      }
    })
  } catch (err) {
    console.error('获取MBTI结果失败:', err)
    return error('获取MBTI结果失败')
  }
}

// 提交MBTI测试答案
export async function submitTest(roleId, answers) {
  try {
    // 计算MBTI类型
    const mbtiType = calcMBTIType(answers)
    const dimensionScores = calcDimensionScores(answers)
    
    // 获取角色数据用于AI分析
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存在')
    }
    
    // 存储测试结果
    const collection = mbtiCollection()
    const result = await collection.insertOne({
      role_id: toObjectId(roleId),
      source: '测试',
      mbti_type: mbtiType,
      dimension_scores: dimensionScores,
      answers,
      created_at: new Date()
    })
    
    // 调用AI分析（可选，异步）
    let aiAnalysis = null
    try {
      aiAnalysis = await analyzeMBTI(role, {
        mbti_type: mbtiType,
        dimension_scores: dimensionScores
      })
    } catch (e) {
      console.error('AI分析失败:', e)
    }
    
    return success({ 
      mbti: {
        _id: result.insertedId.toString(),
        role_id: roleId,
        mbti_type: mbtiType,
        dimension_scores: dimensionScores,
        analysis: aiAnalysis
      }
    })
  } catch (err) {
    console.error('提交MBTI测试失败:', err)
    return error('提交MBTI测试失败')
  }
}

// 选择已有MBTI类型
export async function selectType(roleId, mbtiType) {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存在')
    }
    
    // 验证MBTI类型
    const validTypes = ['ENFJ', 'ENTJ', 'ENFP', 'ENTP', 'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
                    'INFJ', 'INFP', 'INTJ', 'INTJ', 'ISFJ', 'ISFP', 'ISTJ', 'ISTP']
    if (!validTypes.includes(mbtiType)) {
      return error('无效的MBTI类型')
    }
    
    // 存储
    const collection = mbtiCollection()
    const result = await collection.insertOne({
      role_id: toObjectId(roleId),
      source: '选择',
      mbti_type: mbtiType,
      dimension_scores: {},
      answers: [],
      created_at: new Date()
    })
    
    return success({ 
      mbti: {
        _id: result.insertedId.toString(),
        role_id: roleId,
        mbti_type: mbtiType
      }
    })
  } catch (err) {
    console.error('选择MBTI类型失败:', err)
    return error('选择MBTI类型失败')
  }
}

// 计算MBTI类型
function calcMBTIType(answers) {
  // 40道题，每8道一组
  // E/I, S/N, T/F, J/P
  const dimensions = [
    { E: 0, I: 1 },   // 1-8
    { S: 2, N: 3 },   // 9-16
    { T: 4, F: 5 },   // 17-24
    { J: 6, P: 7 }    // 25-32
  ]
  
  const scores = [0, 0, 0, 0]
  
  answers.forEach((answer, index) => {
    const dimIndex = Math.floor(index / 8)
    if (dimIndex < 4) {
      const dim = dimensions[dimIndex]
      const key = answer >= 4 ? Object.keys(dim)[0] : Object.keys(dim)[1]
      scores[dimIndex] += answer >= 4 ? answer - 3 : answer - 3
    }
  })
  
  const types = ['E', 'S', 'T', 'J']
  const opposite = ['I', 'N', 'F', 'P']
  
  let mbtiType = ''
  scores.forEach((score, index) => {
    mbtiType += score > 0 ? types[index] : opposite[index]
  })
  
  return mbtiType
}

// 计算维度分数
function calcDimensionScores(answers) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  
  answers.forEach((answer, index) => {
    const dimIndex = Math.floor(index / 8)
    const options = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
    const key = answer >= 4 ? options[dimIndex * 2] : options[dimIndex * 2 + 1]
    scores[key] += Math.abs(answer - 4)
  })
  
  return scores
}