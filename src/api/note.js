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

// 获取笔记分类列表
export function getNoteCategoryList() {
  return request({
    url: '/note/category/list',
    method: 'get',
    withCredentials: false
  })
}
// 获取笔记分类分页列表
export function getNoteCategoryListPager(data) {
  return request({
    url: '/note/category/listPager',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
// 新增笔记分类
export function addNoteCategory(data) {
  return request({
    url: '/note/category/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 更新笔记分类
export function updateNoteCategory(data) {
  return request({
    url: '/note/category/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 删除笔记分类
export function deleteNoteCategory(data) {
  return request({
    url: '/note/category/delete',
    method: 'delete',
    data: data,
    withCredentials: false
  })
}
