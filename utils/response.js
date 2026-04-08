// 统一响应格式

// 成功响应
export function success(data = null, message = 'success') {
  return {
    code: 0,
    message,
    data
  }
}

// 失败响应
export function error(message = 'error', code = 1) {
  return {
    code,
    message,
    data: null
  }
}

// 分页响应
export function paginate(data, total, page, pageSize) {
  return {
    code: 0,
    message: 'success',
    data: {
      list: data,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    }
  }
}