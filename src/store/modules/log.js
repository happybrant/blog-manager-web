import { getLogById, getLogListPager, getStatisticData } from '@/api/log'

const actions = {
  // 获取日志列表
  getLogListPager: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getLogListPager(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 根据id获取日志
  getLogById: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getLogById(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 获取日志统计数据
  getStatisticData: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getStatisticData(parameters)
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

