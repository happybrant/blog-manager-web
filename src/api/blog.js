import request from '@/utils/request'

export function getArticleList(data) {
  return request({
    url: '/article/list',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function getArticleById(data) {
  return request({
    url: '/article/getArticleById',
    method: 'get',
    params: data,
    withCredentials: false
  })
}
export function getAboutMeArticle() {
  return request({
    url: '/article/getAboutMeArticle',
    method: 'get',
    withCredentials: false
  })
}
export function addArticle(data) {
  return request({
    url: '/article/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function deleteArticle(data) {
  return request({
    url: '/article/delete',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function getCategoryList(data) {
  return request({
    url: '/category/list',
    method: 'get',
    params: data,
    withCredentials: false
  })
}
export function addCategory(data) {
  return request({
    url: '/category/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function updateCategory(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function deleteCategory(data) {
  return request({
    url: '/category/delete',
    method: 'delete',
    params: data,
    withCredentials: false
  })
}
export function getTagList(data) {
  return request({
    url: '/tag/list',
    method: 'get',
    data: data,
    withCredentials: false
  })
}

export function addTag(data) {
  return request({
    url: '/tag/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

export function deleteTag(data) {
  return request({
    url: '/tag/delete',
    method: 'delete',
    params: data,
    withCredentials: false
  })
}
export function publish(data, status) {
  return request({
    url: '/article/add/' + status,
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function getIndex(data, status) {
  return request({
    url: '/article/add/' + status,
    method: 'post',
    data: data,
    withCredentials: false
  })
}

export function addSetting(data) {
  return request({
    url: '/setting/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function updateSetting(data) {
  return request({
    url: '/setting/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function getSettingByCurrentUser() {
  return request({
    url: '/setting/getSettingByCurrentUser',
    method: 'get',
    withCredentials: false
  })
}
