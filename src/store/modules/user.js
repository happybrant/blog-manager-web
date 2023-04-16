import { addUser, deleteUser, getInfo, getUserListPager, login, logout, resetPwd, updatePwd, updateUser } from '@/api/user'
import { resetRouter } from '@/router'
import { getToken, removeToken, setLoginExpire, setToken } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  loginExpire: false, // 是否登录超时
  roles: [],
  userInfo: null
}

const mutations = {
  // RESET_STATE: (state) => {
  //   console.log('重置state')
  //   Object.assign(state, getDefaultState())
  // },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LOGINEXPIRRE: (state, loginExpire) => {
    state.loginExpire = loginExpire
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        if (data != null) {
          setToken(data.data)
          commit('SET_TOKEN', data.data)
          setLoginExpire(false)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response.data
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        commit('SET_NAME', data.displayName)
        commit('SET_AVATAR', data.headerUrl)
        const roles = [data.type === 1 ? 'admin' : 'user']
        data.roles = roles
        commit('SET_ROLES', roles)
        commit('SET_LOGINEXPIRRE', false)
        const userInfo = {}
        userInfo.username = data.username
        userInfo.displayName = data.displayName
        userInfo.email = data.email
        userInfo.headerUrl = data.headerUrl
        userInfo.id = data.id
        commit('SET_USERINFO', userInfo)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ROLES', [])
        removeToken() // must remove  token  first
        resetRouter()

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      resolve()
    })
  },
  // 获取用户列表
  getUserListPager: (_, parameters) => {
    return new Promise((resolve, reject) => {
      getUserListPager(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 新增用户
  addUser: (_, parameters) => {
    return new Promise((resolve, reject) => {
      addUser(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新用户
  updateUser: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updateUser(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新用户登陆密码
  updatePwd: (_, parameters) => {
    return new Promise((resolve, reject) => {
      updatePwd(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 更新用户
  deleteUser: (_, parameters) => {
    return new Promise((resolve, reject) => {
      deleteUser(parameters)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 重置密码
  resetPwd: (_, parameters) => {
    return new Promise((resolve, reject) => {
      resetPwd(parameters)
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
  state,
  mutations,
  actions
}

