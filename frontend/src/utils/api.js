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
  register(phone) {
    return request('/user/register', { method: 'POST', body: JSON.stringify({ phone }) })
  },
  login(phone) {
    return request('/user/login', { method: 'POST', body: JSON.stringify({ phone }) })
  },
  getProfile() {
    return request('/user/profile')
  }
}

// 角色相关
export const roleAPI = {
  getAll() {
    return request('/roles')
  },
  create(roleData) {
    return request('/roles', { method: 'POST', body: JSON.stringify(roleData) })
  },
  update(id, roleData) {
    return request(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(roleData) })
  },
  delete(id) {
    return request(`/roles/${id}`, { method: 'DELETE' })
  },
  setActive(id) {
    return request(`/roles/${id}/active`, { method: 'POST' })
  }
}

// MBTI相关
export const mbtiAPI = {
  getResult(roleId) {
    return request(`/mbti/${roleId}`)
  },
  submitTest(roleId, answers) {
    return request('/mbti/test', { method: 'POST', body: JSON.stringify({ roleId, answers }) })
  },
  selectType(roleId, mbtiType) {
    return request('/mbti/select', { method: 'POST', body: JSON.stringify({ roleId, mbtiType }) })
  }
}

// 运势相关
export const astroAPI = {
  getAnalysis(roleId) {
    return request(`/astro/${roleId}`)
  }
}

export const dailyAPI = {
  getDaily(roleId) {
    return request(`/daily/${roleId}`)
  }
}

export const fortuneAPI = {
  draw(roleId, type) {
    return request('/fortune/draw', { method: 'POST', body: JSON.stringify({ roleId, type }) })
  }
}

export const dreamAPI = {
  interpret(roleId, content) {
    return request('/dream/interpret', { method: 'POST', body: JSON.stringify({ roleId, content }) })
  }
}

export const hexagramAPI = {
  cast(roleId, hexagram, question) {
    return request('/hexagram/cast', { method: 'POST', body: JSON.stringify({ roleId, hexagram, question }) })
  }
}

export const chatAPI = {
  sendMessage(roleId, message, history) {
    return request('/chat/message', { method: 'POST', body: JSON.stringify({ roleId, message, history }) })
  }
}

export const lifeAPI = {
  getLifeNumber(roleId) {
    return request(`/life/${roleId}`)
  }
}

export const nameAPI = {
  analyze(roleId, name) {
    return request('/name/analyze', { method: 'POST', body: JSON.stringify({ roleId, name }) })
  }
}

export const compatAPI = {
  analyze(roleAId, roleBId, type) {
    return request('/compat/analyze', { method: 'POST', body: JSON.stringify({ roleAId, roleBId, type }) })
  }
}