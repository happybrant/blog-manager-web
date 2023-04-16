import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 查询用户列表
export function getUserListPager(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
// 新增用户
export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 更新用户
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
// 更新用户登录密码
export function updatePwd(data) {
  return request({
    url: '/user/updatePwd',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
// 删除用户
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
// 重置密码
export function resetPwd(data) {
  return request({
    url: '/user/resetPwd',
    method: 'get',
    params: data,
    withCredentials: false
  })
}
