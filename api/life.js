// 生日密码API
import { lifeCollection, rolesCollection, toObjectId } from '../utils/db.js'
import { success, error } from '../utils/response.js'
import { analyzeLifeNumber } from '../services/ai.js'

// 生命灵数计算
function calcLifeNumber(birthday) {
  const { year, month, day } = birthday
  
  // 生命数：出生年月日数字相�?
  const life = digitSum(year) + digitSum(month) + digitSum(day)
  const lifeNum = digitSum(life)
  
  // 天赋数：出生月日数字相加
  const talent = digitSum(month) + digitSum(day)
  const talentNum = digitSum(talent)
  
  // 性格数：出生日数�?
  const personality = digitSum(day)
  
  // 使命数：出生年月日全部数字相�?
  const destiny = digitSum(year) + digitSum(month) + digitSum(day)
  const destinyNum = digitSum(destiny)
  
  return {
    life: lifeNum || 1,
    talent: talentNum || 1,
    personality: personality || 1,
    destiny: destinyNum || 1
  }
}

function digitSum(num) {
  while (num >= 10) {
    num = String(num).split('').reduce((a, b) => a + Number(b), 0)
  }
  return num
}

// 获取生日密码
export async function getLifeNumber(roleId) {
  try {
    const roles = rolesCollection()
    const role = await roles.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存�?)
    }
    
    const numbers = calcLifeNumber(role.birthday)
    
    // AI解读
    let aiInterpretation = null
    try {
      aiInterpretation = await analyzeLifeNumber(role)
    } catch (e) {
      console.error('AI分析失败:', e)
    }
    
    const interpretation = {
      personalized: aiInterpretation || {},
      meaning: getNumberMeaning(numbers)
    }
    
    return success({
      numbers,
      interpretation
    })
  } catch (err) {
    console.error('获取生日密码失败:', err)
    return error('获取生日密码失败')
  }
}

// 数字含义
function getNumberMeaning(numbers) {
  const meanings = {
    1: '开创、独立、领�?,
    2: '合作、平衡、敏�?,
    3: '创意、表达、欢�?,
    4: '稳定、务实、努�?,
    5: '自由、变化、冒�?,
    6: '责任、关怀、家�?,
    7: '灵性、探索、思�?,
    8: '权力、成就、物�?,
    9: '完成、博爱、智�?
  }
  
  return {
    life: meanings[numbers.life],
    talent: meanings[numbers.talent],
    personality: meanings[numbers.personality],
    destiny: meanings[numbers.destiny]
  }
}
