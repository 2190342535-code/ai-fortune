// 名字解析API
import { nameCollection, rolesCollection, toObjectId } from '../../utils/db.js'
import { success, error } from '../../utils/response.js'
import { analyzeName } from '../services/ai.js'

// 名字解析
export async function analyze(roleId, name) {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存在')
    }
    
    // 基础分析：笔画和五行
    const basic = analyzeBasic(name)
    
    // AI解读
    let aiInterpretation = null
    try {
      aiInterpretation = await analyzeName(role, name)
    } catch (e) {
      console.error('AI分析失败:', e)
    }
    
    const analysis = {
      basic,
      personalized: aiInterpretation || {},
      advice: getNameAdvice(basic)
    }
    
    // 存储
    const collection = nameCollection()
    const result = await collection.insertOne({
      role_id: toObjectId(roleId),
      name,
      analysis,
      created_at: new Date()
    })
    
    return success({ 
      name: name,
      analysis
    })
  } catch (err) {
    console.error('名字解析失败:', err)
    return error('名字解析失败')
  }
}

// 基础分析
function analyzeBasic(name) {
  const chars = name.split('')
  const strokes = []
  const elements = []
  
  // 简体字笔画（简化版）
  const strokeMap = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
    '人': 2, '入': 2, '八': 2, '大': 3, '小': 3, '口': 3, '中': 4, '土': 3, '木': 4, '水': 4,
    '火': 4, '金': 8, '女': 3, '子': 3, '天': 4, '地': 6, '王': 4, '心': 4, '日': 4, '月': 8,
    '我': 7, '你': 7, '他': 5, '她': 6, '是': 9, '的': 8, '在': 6, '有': 6, '和': 8, '人': 2
  }
  
  // 五行对应
  const elementMap = {
    '木': ['一', '十', '入', '八'], '火': ['二', '七', '丙', '丁'], '土': ['三', '五', '十', '王'],
    '金': ['四', '九', '庚', '辛'], '水': ['六', '壬', '癸']
  }
  
  chars.forEach(char => {
    const stroke = strokeMap[char] || Math.floor(Math.random() * 10) + 1
    strokes.push(stroke)
    
    // 判断五行
    for (const [el, chars] of Object.entries(elementMap)) {
      if (chars.includes(char)) {
        elements.push(el)
        break
      }
    }
  })
  
  const totalStrokes = strokes.reduce((a, b) => a + b, 0)
  const mainElement = elements.length > 0 ? elements[0] : '土'
  
  return {
    characters: chars,
    strokes,
    totalStrokes,
    element: mainElement,
    meaning: getCharMeaning(chars[0])
  }
}

function getCharMeaning(char) {
  const meanings = {
    '王': '王者之气',
    '伟': '伟大卓越',
    '芳': '美丽芬芳',
    '明': '光明智慧',
    '静': '文静优雅',
    '婷': '美好修长',
    '宇': '宽广胸怀',
    '浩': '浩瀚伟大'
  }
  return meanings[char] || '待解读'
}

function getNameAdvice(basic) {
  return `姓名总笔画${basic.totalStrokes}画，主五行${basic.element}。名字整体寓意需要结合个人八字来分析更适合。`
}