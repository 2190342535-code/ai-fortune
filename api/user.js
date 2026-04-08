// 用户API - Vercel Serverless Function格式
import { connectDB, usersCollection, toObjectId } from '../utils/db.js'

// 注册
async function register(phone) {
  try {
    const collection = usersCollection()
    
    // 检查是否已存在
    const existing = await collection.findOne({ phone })
    if (existing) {
      return { success: true, data: { userId: existing._id.toString() } }
    }
    
    // 创建新用户
    const result = await collection.insertOne({
      phone,
      created_at: new Date(),
      updated_at: new Date()
    })
    
    return { success: true, data: { userId: result.insertedId.toString() } }
  } catch (err) {
    console.error('注册失败:', err)
    return { success: false, message: '注册失败' }
  }
}

// 登录
async function login(phone) {
  try {
    const collection = usersCollection()
    
    const user = await collection.findOne({ phone })
    if (!user) {
      return await register(phone)
    }
    
    return { success: true, data: { userId: user._id.toString() } }
  } catch (err) {
    console.error('登录失败:', err)
    return { success: false, message: '登录失败' }
  }
}

// 获取用户信息
async function getProfile(userId) {
  try {
    const collection = usersCollection()
    
    const user = await collection.findOne({ _id: toObjectId(userId) })
    if (!user) {
      return { success: false, message: '用户不存在' }
    }
    
    return { 
      success: true, 
      data: {
        userId: user._id.toString(),
        phone: user.phone,
        created_at: user.created_at
      }
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
    return { success: false, message: '获取用户信息失败' }
  }
}

// Vercel Handler - 处理所有请求
export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // 确保数据库连接
    await connectDB()
    
    // 解析JSON请求体
    let body = {}
    if (req.method === 'POST' && req.body) {
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      } catch {
        body = {}
      }
    }
    
    const url = req.url || ''
    const pathname = url.split('?')[0]
    
    // 根据路径和方法分发请求
    // 注意：Vercel会保留完整路径 /api/user/register
    const apiPath = pathname.replace('^/api', '') || '/'
    
    if (apiPath === '/user/register' && req.method === 'POST') {
      const { phone } = body || {}
      if (!phone) {
        return res.status(400).json({ success: false, message: '手机号不能为空' })
      }
      const result = await register(phone)
      return res.status(result.success ? 200 : 400).json(result)
    }
    
    if (apiPath === '/user/login' && req.method === 'POST') {
      const { phone } = body || {}
      if (!phone) {
        return res.status(400).json({ success: false, message: '手机号不能为空' })
      }
      const result = await login(phone)
      return res.status(result.success ? 200 : 400).json(result)
    }
    
    if (apiPath === '/user/profile' && req.method === 'GET') {
      const userId = req.query.userId || req.headers['x-user-id']
      if (!userId) {
        return res.status(400).json({ success: false, message: '缺少用户ID' })
      }
      const result = await getProfile(userId)
      return res.status(result.success ? 200 : 400).json(result)
    }
    
    // 未匹配的路由
    return res.status(404).json({ success: false, message: '接口不存在' })
    
  } catch (err) {
    console.error('API错误:', err)
    return res.status(500).json({ success: false, message: '服务器错误' })
  }
}