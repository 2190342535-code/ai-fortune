// 日期计算服务（后端）
import { getLunarDate, getZodiac, getSunSign, getYearElement, isLeapYear } from '../../frontend/src/utils/date.js'

// 注意：后端需要独立的日期计算实现，这里复用前端的简化版
// 实际生产中需要引入 lunar-javascript 库

// 获取农历日期（后端版）
export function calcLunarDate(year, month, day) {
  // 简化版 - 需要集成 lunar-javascript 做精确计算
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  const stemsIndex = (year - 2024) % 10
  const branchesIndex = (year - 2024) % 12
  
  return {
    year: stems[stemsIndex] + branches[branchesIndex],
    month: `月${month}`,
    day: `日${day}`
  }
}

// 计算角色自动数据
export function calcRoleAutoData(birthday) {
  const { year, month, day, hour } = birthday
  
  return {
    lunar_date: calcLunarDate(year, month, day),
    zodiac: getZodiac(year),
    sun_sign: getSunSign(month, day),
    year_element: getYearElement(year),
    bazi: {
      year: calcLunarDate(year, month, day).year,
      month: '待计算',
      day: '待计算',
      hour: hour ? `${hour}:00` : '待计算'
    }
  }
}

// 获取喜用神（简化版）
export function calcUsefulElement(bazi) {
  // 八字分析计算喜用神 - 简化版
  const elements = ['木', '火', '土', '金', '水']
  const element = elements[Math.floor(Math.random() * 5)]
  return `${element}、${elements[(elements.indexOf(element) + 2) % 5]}`
}

// 获取今日五行
export function getTodayElement() {
  const day = new Date().getDate()
  const elements = ['木', '火', '土', '金', '水']
  return elements[(day - 1) % 5]
}

// 获取今日运势基础数据
export function getDailyBaseData(role) {
  const todayElement = getTodayElement()
  const element = role.year_element
  
  return {
    keyElement: todayElement,
    elementRelation: getElementRelation(element, todayElement),
    lucky directions: ['东', '东南', '南'][Math.floor(Math.random() * 3)],
    lucky colors: ['红色', '黄色', '绿色'].slice(0, 2),
    lucky numbers: [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10) + 10]
  }
}

// 五行关系
function getElementRelation(el1, el2) {
  const relations = {
    '木': { '火': '生', '土': '克', '金': '耗', '水': '泄' },
    '火': { '土': '生', '金': '克', '水': '耗', '木': '泄' },
    '土': { '金': '生', '水': '克', '木': '耗', '火': '泄' },
    '金': { '水': '生', '木': '克', '火': '耗', '土': '泄' },
    '水': { '木': '生', '火': '克', '土': '耗', '金': '泄' }
  }
  return relations[el1]?.[el2] || '同'
}