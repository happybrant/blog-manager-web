import {
  addArticle, addCategory,
  addSetting, addTag, deleteArticle, deleteCategory, deleteTag,

  getAboutMeArticle, getArticleById, getArticleList, getCategoryList,
  getSettingByCurrentUser, getTagList, publish,
  updateArticle, updateCategory, updateSetting
} from '@/api/blog'

const actions = {
  // 分页获取博客列表
  getArticleList: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getArticleList(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 根据id获取博客
  getArticleById: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getArticleById(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getAboutMeArticle: () => {
    return new Promise((resolve, reject) => {
      getAboutMeArticle()
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增博客
  addArticle: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addArticle(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新博客
  updateArticle: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateArticle(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 删除博客
  deleteArticle: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deleteArticle(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 分页获取博客分类列表
  getCategoryList: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getCategoryList(parameters)
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
  addCategory: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addCategory(parameters)
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
  updateCategory: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateCategory(parameters)
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
  deleteCategory: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deleteCategory(parameters)
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
  addTag: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addTag(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 分页获取博客标签列表
  getTagList: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getTagList(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 删除标签
  deleteTag: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deleteTag(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 获取接口分组
  publish: (_, parameters) => {
    return new Promise((resolve, reject) => {
      publish(parameters, 1)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增设置
  addSetting: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addSetting(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增设置
  updateSetting: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateSetting(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 查找当前用户设置
  getSettingByCurrentUser: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getSettingByCurrentUser(parameters)
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

