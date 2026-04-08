// 星座分析API
import { astroCollection, rolesCollection, toObjectId } from '../utils/db.js'
import { success, error } from '../utils/response.js'
import { analyzeAstro } from '../services/ai.js'

// 获取星座分析
export async function getAnalysis(roleId) {
  try {
    const collection = astroCollection()
    
    const analysis = await collection.findOne({ role_id: toObjectId(roleId) })
    if (!analysis) {
      return error('未完成星座分�?)
    }
    
    return success({ 
      analysis: {
        ...analysis,
        _id: analysis._id.toString()
      }
    })
  } catch (err) {
    console.error('获取星座分析失败:', err)
    return error('获取星座分析失败')
  }
}

// 生成星座分析
export async function generateAnalysis(roleId) {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存�?)
    }
    
    // 调用AI分析
    let aiAnalysis = null
    try {
      aiAnalysis = await analyzeAstro(role)
    } catch (e) {
      console.error('AI分析失败:', e)
      return error('AI分析调用失败')
    }
    
    // 存储结果
    const collection = astroCollection()
    const result = await collection.insertOne({
      role_id: toObjectId(roleId),
      analysis: aiAnalysis,
      created_at: new Date()
    })
    
    return success({ 
      analysis: {
        _id: result.insertedId.toString(),
        role_id: roleId,
        analysis: aiAnalysis
      }
    })
  } catch (err) {
    console.error('生成星座分析失败:', err)
    return error('生成星座分析失败')
  }
}
