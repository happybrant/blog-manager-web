import { ajaxHeadersTokenKey } from '@/settings'
import store from '@/store'
import { getToken, setLoginExpire } from '@/utils/auth'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router/index'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 默认返回值
const defaultData = {
  data: {
    data: null,
    message: '无数据',
    code: -1
  }
}
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers[ajaxHeadersTokenKey] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.headers.auth) { // 如果返回表头中存在auth,则表明为token有误或超时被拦截器拦截返回
      setLoginExpire(true)
      store.commit('user/SET_LOGINEXPIRRE', true) // 设置超时标识为true，登录后修改此标识
      router.push('/login')
      return Promise.resolve(defaultData)
    }
    return response
    // const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    // if (res && res.code !== 200) {
    //   if (res.code === 401) {
    //     store.commit('user/SET_LOGINEXPIRRE', true) // 设置超时标识为true，登录后修改此标识
    //     router.push('/login')
    //     return Promise.resolve(response)
    //   } else {
    //     Message({
    //       message: res.message || 'Error',
    //       type: 'error',
    //       duration: 5 * 1000
    //     })
    //   }
    // } else {
    //   return response
    // }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
