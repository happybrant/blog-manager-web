import {
  addNote, addNoteCategory, deleteNote, deleteNoteCategory, getNoteById, getNoteCategoryList, getNoteCategoryListPager,
  getNoteListPager, updateNote, updateNoteCategory
} from '@/api/note'
const state = {
  dynamicRoutes: []
}

const mutations = {
  DYNAMIC_ROUTES(state, routes) {
    state.dynamicRoutes = routes
  }
}
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
  },
  // 获取笔记分类列表
  getNoteCategoryList: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getNoteCategoryList(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 分页获取笔记分类列表
  getNoteCategoryListPager: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getNoteCategoryListPager(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增分类
  addNoteCategory: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addNoteCategory(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新分类
  updateNoteCategory: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateNoteCategory(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 删除分类
  deleteNoteCategory: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deleteNoteCategory(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  dynamicRoutes({ commit }, routes) {
    commit('DYNAMIC_ROUTES', routes)
  }
}

export default {
  namespaced: true,
  actions,
  state,
  mutations
}

