import request from '@/utils/request'

export function getStatisticData() {
  return request({
    url: '/home/getIndexData',
    method: 'get'
  })
}
