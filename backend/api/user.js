// 用户API
import { usersCollection, toObjectId } from '../../utils/db.js'
import { success, error } from '../../utils/response.js'

// 注册
export async function register(phone) {
  try {
    const collection = usersCollection()
    
    // 检查是否已存在
    const existing = await collection.findOne({ phone })
    if (existing) {
      return success({ userId: existing._id.toString() })
    }
    
    // 创建新用户
    const result = await collection.insertOne({
      phone,
      created_at: new Date(),
      updated_at: new Date()
    })
    
    return success({ userId: result.insertedId.toString() })
  } catch (err) {
    console.error('注册失败:', err)
    return error('注册失败')
  }
}

// 登录
export async function login(phone) {
  try {
    const collection = usersCollection()
    
    const user = await collection.findOne({ phone })
    if (!user) {
      return register(phone)
    }
    
    return success({ userId: user._id.toString() })
  } catch (err) {
    console.error('登录失败:', err)
    return error('登录失败')
  }
}

// 获取用户信息
export async function getProfile(userId) {
  try {
    const collection = usersCollection()
    
    const user = await collection.findOne({ _id: toObjectId(userId) })
    if (!user) {
      return error('用户不存在')
    }
    
    return success({
      userId: user._id.toString(),
      phone: user.phone,
      created_at: user.created_at
    })
  } catch (err) {
    console.error('获取用户信息失败:', err)
    return error('获取用户信息失败')
  }
}