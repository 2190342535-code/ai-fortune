// 抽签API
import { fortuneCollection, rolesCollection, toObjectId } from '../../utils/db.js'
import { success, error } from '../../utils/response.js'
import { interpretFortune } from '../services/ai.js'

// 签诗数据库
const fortunePoems = {
  '上上签': [
    '龙吟虎啸啸声回，凤鸟飞来五彩开。',
    '春风得意马蹄疾，一日看尽长安花。'
  ],
  '上签': [
    '登山涉水去还来，野草闲花满地开。',
    '君子有事东南角，财物当年遇横财。'
  ],
  '中上签': [
    '东边日出西边雨，道是无情却有情。',
    '莫言蜀道路遥远，且看云开见月明。'
  ],
  '中签': [
    '花开花落有时节，潮起潮落无定时。',
    '守得云开见月明，静待花期自有时。'
  ],
  '中下签': [
    '路途遥远须努力，莫问前程吉与凶。',
    '且将心事付流水，静看风云变幻中。'
  ],
  '下签': [
    '山高水长路崎岖，小心行得万年船。',
    '守得寒尽春来到，自有好事入家来。'
  ],
  '下下签': [
    '屋漏偏逢连夜雨，船迟又遇打头风。',
    '但存善念终有报，春暖花开会有时。'
  ]
}

// 抽签
export async function draw(roleId, type = '运') {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存在')
    }
    
    // 随机抽取签运
    const signs = Object.keys(fortunePoems)
    const rand = Math.random()
    let sign
    if (rand < 0.05) sign = '下下签'
    else if (rand < 0.15) sign = '下签'
    else if (rand < 0.35) sign = '中下签'
    else if (rand < 0.55) sign = '中签'
    else if (rand < 0.75) sign = '中上签'
    else if (rand < 0.90) sign = '上签'
    else sign = '上上签'
    
    // 随机签诗
    const poems = fortunePoems[sign]
    const poem = poems[Math.floor(Math.random() * poems.length)]
    
    // AI解读
    let aiInterpretation = null
    try {
      aiInterpretation = await interpretFortune(role, {
        sign,
        poem,
        type
      })
    } catch (e) {
      console.error('AI解读失败:', e)
    }
    
    const interpretation = {
      personalized: aiInterpretation || {},
      advice: getFortuneAdvice(sign),
      history_link: getHistoryLink(sign)
    }
    
    // 存储
    const collection = fortuneCollection()
    const result = await collection.insertOne({
      role_id: toObjectId(roleId),
      fortune_type: type,
      sign,
      poem,
      interpretation,
      created_at: new Date()
    })
    
    return success({ 
      fortune: {
        _id: result.insertedId.toString(),
        role_id: roleId,
        fortune_type: type,
        sign,
        poem,
        interpretation
      }
    })
  } catch (err) {
    console.error('抽签失败:', err)
    return error('抽签失败')
  }
}

// 签运建议
function getFortuneAdvice(sign) {
  const advice = {
    '上上签': '大吉！今天做任何事都顺心如意，把握机会！',
    '上签': '吉兆！运势很好，积极行动会有好结果。',
    '中上签': '中吉！保持当前状态，好运会来临。',
    '中签': '平平稳稳，不要过于激进，顺其自然。',
    '中下签': '需要耐心等待，保存实力等待时机。',
    '下签': '凡事谨慎小心，避免冲动决定。',
    '下下签': '调整心态，逆境中保持定力，终会好转。'
  }
  return advice[sign] || '保持平常心'
}

// 历史典故
function getHistoryLink(sign) {
  const links = {
    '上上签': '如汉高祖斩蛇起义，大吉之兆',
    '上签': '如刘备入蜀��三分天下',
    '中上签': '如姜子牙钓鱼，静待时机',
    '中签': '如韩信受胯下之辱，终成大将',
    '中下签': '如重耳流亡十九年终成霸业',
    '下签': '如勾践卧薪尝胆，三千越甲可吞吴',
    '下下签': '如苏武牧羊十九年，持节不屈'
  }
  return links[sign] || ''
}