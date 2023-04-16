import request from '@/utils/request'

// 查询笔记列表
export function getNoteListPager(data) {
  return request({
    url: '/note/list',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function getNoteById(data) {
  return request({
    url: '/note/getNoteById',
    method: 'get',
    params: data,
    withCredentials: false
  })
}

// 新增笔记
export function addNote(data) {
  return request({
    url: '/note/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 更新笔记
export function updateNote(data) {
  return request({
    url: '/note/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 删除笔记
export function deleteNote(data) {
  return request({
    url: '/note/delete',
    method: 'delete',
    params: data,
    withCredentials: false
  })
}

