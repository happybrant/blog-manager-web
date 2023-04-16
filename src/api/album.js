import request from '@/utils/request'

// 分页查询相册列表
export function getAlbumListPager(data) {
  return request({
    url: '/album/list',
    method: 'get',
    params: data,
    withCredentials: false
  })
}

// 新增相册
export function addAlbum(data) {
  return request({
    url: '/album/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 更新相册
export function updateAlbum(data) {
  return request({
    url: '/album/update',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 删除相册
export function deleteAlbum(data) {
  return request({
    url: '/album/delete',
    method: 'delete',
    params: data,
    withCredentials: false
  })
}
// 分页查询照片列表
export function getPhotoListPager(data) {
  return request({
    url: '/album/photo/list',
    method: 'get',
    params: data,
    withCredentials: false
  })
}

// 新增照片
export function addPhoto(data) {
  return request({
    url: '/album/photo/add',
    method: 'post',
    data: data,
    withCredentials: false
  })
}

// 删除照片
export function deletePhoto(data) {
  return request({
    url: '/album/photo/delete',
    method: 'delete',
    params: data,
    withCredentials: false
  })
}
