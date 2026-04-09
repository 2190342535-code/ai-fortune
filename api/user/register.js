// 注册API - Vercel Serverless Function
import { connectDB, usersCollection } from '../../utils/db.js'

// 调试日志
console.log('=== register.js 被调用 ===')

// 注册处理
async function handleRegister(username, password) {
  try {
    const collection = usersCollection()
    
    // 检查用户名是否已存在
    const existing = await collection.findOne({ username })
    if (existing) {
      return { success: false, message: '用户名已存在' }
    }
    
    // 创建新用户
    const result = await collection.insertOne({
      username,
      password,
      created_at: new Date(),
      updated_at: new Date()
    })
    
    return { success: true, data: { userId: result.insertedId.toString() } }
  } catch (err) {
    console.error('注册失败:', err)
    return { success: false, message: '注册失败' }
  }
}

// Vercel Handler
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 只处理POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '只支持POST' })
  }

  try {
    console.log('开始处理注册请求')
    
    // 连接数据库
    await connectDB()
    console.log('数据库连接成功')
    
    // 解析body
    let body = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    } catch (e) {
      console.error('body解析失败:', e)
    }
    console.log('请求body:', body)
    
    const { username, password } = body || {}
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' })
    }
    
    const result = await handleRegister(username, password)
    console.log('注册结果:', result)
    
    return res.status(result.success ? 200 : 400).json(result)
    
  } catch (err) {
    console.error('注册异常:', err)
    return res.status(500).json({ success: false, message: '服务器错误' })
  }
}