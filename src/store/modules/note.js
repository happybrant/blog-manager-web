import { addNote, deleteNote, getNoteById, getNoteListPager, updateNote } from '@/api/note'

const actions = {
  // 获取笔记列表
  getNoteListPager: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getNoteListPager(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 根据id获取笔记
  getNoteById: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getNoteById(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增笔记
  addNote: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addNote(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新笔记
  updateNote: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateNote(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 删除笔记
  deleteNote: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deleteNote(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
export default {
  namespaced: true,
  actions
}

