// 角色API
import { rolesCollection, toObjectId } from '../utils/db.js'
import { success, error } from '../utils/response.js'
import { calcRoleAutoData, calcUsefulElement } from '../services/date.js'

// 获取用户所有角色
export async function getRoles(userId) {
  try {
    const collection = rolesCollection()
    
    const roles = await collection.find({ user_id: toObjectId(userId) }).toArray()
    
    return success({ 
      roles: roles.map(r => ({
        ...r,
        _id: r._id.toString()
      }))
    })
  } catch (err) {
    console.error('获取角色失败:', err)
    return error('获取角色失败')
  }
}

// 创建角色
export async function createRole(userId, roleData) {
  try {
    const collection = rolesCollection()
    
    // 自动计算数据
    const autoData = calcRoleAutoData(roleData.birthday)
    autoData.useful_element = calcUsefulElement(autoData.bazi)
    
    const role = {
      user_id: toObjectId(userId),
      nickname: roleData.nickname,
      real_name: roleData.real_name || '',
      birthday: roleData.birthday,
      ...autoData,
      role_type: '自有',
      is_active: false,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await collection.insertOne(role)
    
    // 如果是第一个角色，设为活跃
    const count = await collection.countDocuments({ user_id: toObjectId(userId) })
    if (count === 1) {
      await collection.updateOne(
        { _id: result.insertedId },
        { $set: { is_active: true } }
      )
      role.is_active = true
    }
    
    return success({ 
      role: { 
        ...role, 
        _id: result.insertedId.toString() 
      }
    })
  } catch (err) {
    console.error('创建角色失败:', err)
    return error('创建角色失败')
  }
}

// 更新角色
export async function updateRole(roleId, userId, roleData) {
  try {
    const collection = rolesCollection()
    
    const updateData = {
      ...roleData,
      updated_at: new Date()
    }
    
    // 生日更新时重新计算
    if (roleData.birthday) {
      const autoData = calcRoleAutoData(roleData.birthday)
      Object.assign(updateData, autoData)
    }
    
    const result = await collection.updateOne(
      { _id: toObjectId(roleId), user_id: toObjectId(userId) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return error('角色不存在')
    }
    
    return success({ message: '更新成功' })
  } catch (err) {
    console.error('更新角色失败:', err)
    return error('更新角色失败')
  }
}

// 删除角色
export async function deleteRole(roleId, userId) {
  try {
    const collection = rolesCollection()
    
    const result = await collection.deleteOne({
      _id: toObjectId(roleId),
      user_id: toObjectId(userId)
    })
    
    if (result.deletedCount === 0) {
      return error('角色不存在')
    }
    
    return success({ message: '删除成功' })
  } catch (err) {
    console.error('删除角色失败:', err)
    return error('删除角色失败')
  }
}

// 切换活跃角色
export async function setActiveRole(roleId, userId) {
  try {
    const collection = rolesCollection()
    
    // 先取消所有活跃状态
    await collection.updateMany(
      { user_id: toObjectId(userId) },
      { $set: { is_active: false } }
    )
    
    // 设置目标为活跃
    await collection.updateOne(
      { _id: toObjectId(roleId), user_id: toObjectId(userId) },
      { $set: { is_active: true } }
    )
    
    return success({ message: '切换成功' })
  } catch (err) {
    console.error('切换角色失败:', err)
    return error('切换角色失败')
  }
}

// 获取单个角色
export async function getRole(roleId) {
  try {
    const collection = rolesCollection()
    
    const role = await collection.findOne({ _id: toObjectId(roleId) })
    if (!role) {
      return error('角色不存在')
    }
    
    return success({ 
      role: {
        ...role,
        _id: role._id.toString()
      }
    })
  } catch (err) {
    console.error('获取角色失败:', err)
    return error('获取角色失败')
  }
}