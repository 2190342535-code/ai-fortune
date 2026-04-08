// MongoDB数据库连接
import { MongoClient, ObjectId } from 'mongodb'

// 获取环境变量
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const MONGODB_DB = process.env.MONGODB_DB || 'ai-fortune'

let client = null
let db = null

// 连接数据库
export async function connectDB() {
  if (db) return db
  
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db(MONGODB_DB)
    console.log('MongoDB连接成功')
    return db
  } catch (error) {
    console.error('MongoDB连接失败:', error)
    throw error
  }
}

// 获取集合
export function getCollection(name) {
  return db.collection(name)
}

// ObjectId转换
export function toObjectId(id) {
  return new ObjectId(id)
}

// 关闭连接
export async function closeDB() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

// 用户集合
export const usersCollection = () => getCollection('users')
// 角色集合
export const rolesCollection = () => getCollection('roles')
// MBTI测试集合
export const mbtiCollection = () => getCollection('mbti_tests')
// 星座分析集合
export const astroCollection = () => getCollection('astro_analyses')
// 每日运势集合
export const dailyCollection = () => getCollection('daily_luck')
// 抽签记录集合
export const fortuneCollection = () => getCollection('fortunes')
// 解梦记录集合
export const dreamCollection = () => getCollection('dreams')
// 解卦记录集合
export const hexagramCollection = () => getCollection('hexagrams')
// AI聊天记录集合
export const chatCollection = () => getCollection('chats')
// 生日密码集合
export const lifeCollection = () => getCollection('life_numbers')
// 名字解析集合
export const nameCollection = () => getCollection('name_analyses')
// 合盘记录集合
export const compatCollection = () => getCollection('compatibility')