import { addAlbum, addPhoto, deleteAlbum, deletePhoto, getAlbumListPager, getPhotoListPager, updateAlbum } from '@/api/album'

const actions = {
  // 分页获取相册列表
  getAlbumListPager: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getAlbumListPager(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增相册
  addAlbum: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addAlbum(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新相册
  updateAlbum: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateAlbum(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 删除相册
  deleteAlbum: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deleteAlbum(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 分页获取照片列表
  getPhotoListPager: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getPhotoListPager(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增照片
  addPhoto: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addPhoto(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 删除照片
  deletePhoto: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deletePhoto(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  } }
export default {
  namespaced: true,
  actions
}

