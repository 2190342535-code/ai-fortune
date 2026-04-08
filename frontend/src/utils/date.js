// 日期计算工具

// 农历数据（简化版）
const lunarMonths = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]

// 生肖
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 星座
const sunSigns = [
  { name: '白羊座', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { name: '金牛座', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { name: '双子座', start: { month: 5, day: 21 }, end: { month: 6, day: 21 } },
  { name: '巨蟹座', start: { month: 6, day: 22 }, end: { month: 7, day: 22 } },
  { name: '狮子座', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { name: '处女座', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { name: '天秤座', start: { month: 9, day: 23 }, end: { month: 10, day: 23 } },
  { name: '天蝎座', start: { month: 10, day: 24 }, end: { month: 11, day: 22 } },
  { name: '射手座', start: { month: 11, day: 23 }, end: { month: 12, day: 21 } },
  { name: '摩羯座', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { name: '水瓶座', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { name: '双鱼座', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } }
]

// 五行
const elements = ['木', '火', '土', '金', '水']
const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 判断是否闰年
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// 获取一年的天数
export function getYearDays(year) {
  return isLeapYear(year) ? 366 : 365
}

// 计算农历日期（简化版，需要引入lunar-javascript库做精确计算）
export function getLunarDate(year, month, day) {
  // 这里先用简化版，后续集成 lunar-javascript
  // 返回示例：{ year: '甲辰', month: '三月', day: '十八' }
  const stemsIndex = (year - 2024) % 10
  const branchesIndex = (year - 2024) % 12
  const yearStr = stems[stemsIndex] + zodiacs[branchesIndex]
  
  return {
    year: yearStr,
    month: `月${month}`,
    day: `日${day}`
  }
}

// 获取生肖
export function getZodiac(year) {
  // 2024年是龙年
  const baseYear = 2024
  const baseZodiac = 4 // 龙
  const diff = year - baseYear
  const zodiacIndex = (baseZodiac + diff) % 12
  return zodiacs[zodiacIndex >= 0 ? zodiacIndex : zodiacIndex + 12]
}

// 获取太阳星座
export function getSunSign(month, day) {
  for (const sign of sunSigns) {
    const start = sign.start
    const end = sign.end
    
    if (month === start.month && day >= start.day) {
      return sign.name
    }
    if (month === end.month && day <= end.day) {
      return sign.name
    }
    if (month > start.month && month < end.month) {
      return sign.name
    }
  }
  return '摩羯座'
}

// 获取年五行
export function getYearElement(year) {
  // 2024 = 甲辰（木）-> 2025 = 乙巳（木火）
  const diff = year - 2024
  const elementIndex = diff % 5
  return elements[elementIndex]
}

// 计算八字（简化版）
export function getBazi(year, month, day, hour) {
  // 需要完整的八字计算，后续集成
  const yearStem = stems[(year - 2024) % 10]
  const yearBranch = zodiacs[(year - 2024) % 12]
  
  return {
    year: yearStem + yearBranch,
    month: '待计算',
    day: '待计算',
    hour: '待计算'
  }
}

// 获取今天的五行
export function getTodayElement() {
  const day = new Date().getDate()
  const elementIndex = (day - 1) % 5
  return elements[elementIndex]
}