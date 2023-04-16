import request from '@/utils/request'

// 查询任务列表
export function getTaskList(data) {
  return request({
    url: '/task/list',
    method: 'get',
    params: data,
    withCredentials: false
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/task/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 更新任务
export function updateTask(data) {
  return request({
    url: '/task/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 删除任务
export function deleteTask(data) {
  return request({
    url: '/task/delete',
    method: 'delete',
    params: data,
    withCredentials: false
  })
}
// 查询进度列表
export function getProgressList(data) {
  return request({
    url: '/task/progress/list',
    method: 'get',
    params: data,
    withCredentials: false
  })
}
// 更新进度
export function updateProgress(data) {
  return request({
    url: '/task/progress/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

