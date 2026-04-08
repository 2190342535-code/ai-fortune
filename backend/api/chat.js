// AI聊天API
import { chatCollection, rolesCollection, toObjectId } from '../../utils/db.js'
import { success, error } from '../../utils/response.js'
import { chat } from '../services/ai.js'

// 发送消息
export async function sendMessage(roleId, message, history = []) {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存在')
    }
    
    // 转换历史记录格式
    const messages = history.map(h => ({
      role: h.role,
      content: h.content
    }))
    
    // AI回复
    let reply = ''
    try {
      reply = await chat(role, message, messages)
    } catch (e) {
      console.error('AI聊天失败:', e)
      reply = getDefaultReply(message)
    }
    
    // 添加到历史
    messages.push({ role: 'user', content: message })
    messages.push({ role: 'assistant', content: reply })
    
    // 存储
    const collection = chatCollection()
    
    // 查找或创建会话
    let chatSession = await collection.findOne({ role_id: toObjectId(roleId) })
    
    if (chatSession) {
      await collection.updateOne(
        { _id: chatSession._id },
        { 
          $set: { 
            messages,
            updated_at: new Date()
          }
        }
      )
    } else {
      await collection.insertOne({
        role_id: toObjectId(roleId),
        messages,
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    
    return success({ 
      message: {
        role: 'assistant',
        content: reply
      }
    })
  } catch (err) {
    console.error('AI聊天失败:', err)
    return error('AI聊天失败')
  }
}

// 获取聊天历史
export async function getHistory(roleId) {
  try {
    const collection = chatCollection()
    
    const chatSession = await collection.findOne({ role_id: toObjectId(roleId) })
    if (!chatSession) {
      return success({ messages: [] })
    }
    
    return success({ messages: chatSession.messages })
  } catch (err) {
    console.error('获取聊天历史失败:', err)
    return error('获取聊天历史失败')
  }
}

// 默认回复
function getDefaultReply(message) {
  const lowerM = message.toLowerCase()
  
  if (lowerM.includes('你好') || lowerM.includes('hello')) {
    return '你好！我是你的AI运势助手，有什么想聊的吗？'
  }
  if (lowerM.includes('运势') || lowerM.includes(' fortune')) {
    return '想了解今天的运势吗？去首页看看每日运势吧！'
  }
  if (lowerM.includes('mbti')) {
    return 'MBTI测试可以帮助你更好地了解自己，去试试吧！'
  }
  
  return '我明白了，你想聊的还有什么？或者想不想了解一下你的运势？'
}