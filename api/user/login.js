// 登录API - Vercel Serverless Function
import { connectDB, usersCollection } from '../../utils/db.js'

// 调试日志
console.log('=== login.js 被调用 ===')

// 登录处理
async function handleLogin(username, password) {
  try {
    const collection = usersCollection()
    
    // 查找用户
    const user = await collection.findOne({ username, password })
    if (!user) {
      return { success: false, message: '用户名或密码错误' }
    }
    
    return { success: true, data: { userId: user._id.toString() } }
  } catch (err) {
    console.error('登录失败:', err)
    return { success: false, message: '登录失败' }
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
    console.log('开始处理登录请求')
    
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
    
    const result = await handleLogin(username, password)
    console.log('登录结果:', result)
    
    return res.status(result.success ? 200 : 400).json(result)
    
  } catch (err) {
    console.error('登录异常:', err)
    return res.status(500).json({ success: false, message: '服务器错误' })
  }
}