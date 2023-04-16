import { addTask, deleteTask, getProgressList, getTaskList, updateProgress, updateTask } from '@/api/task'

const actions = {
  // 获取任务列表
  getTaskList: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getTaskList(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增任务
  addTask: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addTask(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新任务
  updateTask: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateTask(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 删除任务
  deleteTask: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deleteTask(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 获取任务列表
  getProgressList: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getProgressList(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新进度
  updateProgress: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateProgress(parameters)
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

