// API工具

const API_BASE = '/api'

// 通用请求方法
async function request(url, options = {}) {
  const fullUrl = API_BASE + url
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(fullUrl, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败')
    }
    
    return data
  } catch (error) {
    console.error('API请求失败:', error)
    throw error
  }
}

// 用户相关
export const userAPI = {
  register(username, password) {
    return request('/user/register', { method: 'POST', body: JSON.stringify({ username, password }) })
  },
  login(username, password) {
    return request('/user/login', { method: 'POST', body: JSON.stringify({ username, password }) })
  },
  getProfile() {
    return request('/user/profile')
  }
}

// 角色相关
export const roleAPI = {
  create(roleData) {
    return request('/role/create', { method: 'POST', body: JSON.stringify(roleData) })
  },
  getAll() {
    return request('/role/list')
  },
  getOne(roleId) {
    return request(`/role/${roleId}`)
  },
  update(roleId, roleData) {
    return request(`/role/${roleId}`, { method: 'PUT', body: JSON.stringify(roleData) })
  },
  delete(roleId) {
    return request(`/role/${roleId}`, { method: 'DELETE' })
  }
}

// MBTI相关
export const mbtiAPI = {
  getResult(roleId) {
    return request(`/mbti/result/${roleId}`)
  },
  submitTest(roleId, answers) {
    return request('/mbti/submit', { method: 'POST', body: JSON.stringify({ roleId, answers }) })
  }
}

// 星座分析
export const astroAPI = {
  analyze(birthday) {
    return request('/astro/analyze', { method: 'POST', body: JSON.stringify({ birthday }) })
  }
}

// 每日运势
export const dailyAPI = {
  get(roleId) {
    return request(`/daily/${roleId}`)
  }
}

// 抽签
export const fortuneAPI = {
  draw(roleId) {
    return request('/fortune/draw', { method: 'POST', body: JSON.stringify({ roleId }) })
  }
}

// 解梦
export const dreamAPI = {
  interpret(dream) {
    return request('/dream/interpret', { method: 'POST', body: JSON.stringify({ dream }) })
  }
}

// 解卦
export const hexagramAPI = {
  consult(question) {
    return request('/hexagram/consult', { method: 'POST', body: JSON.stringify({ question }) })
  }
}

// AI聊天
export const chatAPI = {
  send(roleId, message, history) {
    return request('/chat/send', { method: 'POST', body: JSON.stringify({ roleId, message, history }) })
  },
  getHistory(roleId) {
    return request(`/chat/history/${roleId}`)
  }
}

// 生日密码
export const lifeAPI = {
  calculate(birthday) {
    return request('/life/calculate', { method: 'POST', body: JSON.stringify({ birthday }) })
  }
}

// 姓名分析
export const nameAPI = {
  analyze(name, gender) {
    return request('/name/analyze', { method: 'POST', body: JSON.stringify({ name, gender }) })
  }
}

// 配对
export const compatAPI = {
  match(roleId1, roleId2) {
    return request('/compat/match', { method: 'POST', body: JSON.stringify({ roleId1, roleId2 }) })
  }
}