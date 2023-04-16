import { getStatisticData } from '@/api/home'

const actions = {
  // 获取首页统计数据
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

