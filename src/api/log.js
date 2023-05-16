import request from '@/utils/request'

// 查询日志列表
export function getLogListPager(data) {
  return request({
    url: '/accessLog/list',
    method: 'post',
    data: data,
    withCredentials: false
  })
}
export function getLogById(data) {
  return request({
    url: '/accessLog/getLogById',
    method: 'get',
    params: data,
    withCredentials: false
  })
}

export function getStatisticData() {
  return request({
    url: '/accessLog/statistic',
    method: 'get'
  })
}

