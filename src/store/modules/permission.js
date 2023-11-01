import { asyncRoutes, constantRoutes, noteRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  // 用于保存普通路由数据
  const temp = []
  // 用于保存存在子路由的路由数据
  let route = []
  // 遍历数据
  for (let i = 0; i < menuList.length; i++) {
    // 存在子路由，则递归遍历，并返回数据作为 children 保存
    if (menuList[i].children && menuList[i].children.length > 0) {
      // 获取路由的基本格式
      route = getRoute(menuList[i])
      // 递归处理子路由数据，并返回，将其作为路由的 children 保存
      route.children = fnAddDynamicMenuRoutes(menuList[i].children)
      // 保存存在子路由的路由
      routes.push(route)
    } else {
      // 保存普通路由
      temp.push(getRoute(menuList[i]))
    }
  }
  // 返回路由结果
  return routes.concat(temp)
}

// 返回路由的基本格式
function getRoute(item) {
  // 路由基本格式
  const route = {
    // 路由的路径
    path: '/note/list/' + item.code,
    // 路由名
    name: item.name,
    // 路由所在组件
    component: () => import('@/views/blog/list'),
    meta: {
      title: item.name,
      icon: 'list'
    },
    // 路由的子路由
    children: []
  }
  // 返回 route
  return route
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { roles, categoryList }) {
    return new Promise((resolve) => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 根据分类动态生成路由
      const noteCategoryRoutes = fnAddDynamicMenuRoutes(categoryList)
      // 将路由加载博客列表下面
      noteRoutes.children[0].children = noteCategoryRoutes
      // 先移除笔记路由
      accessedRoutes = accessedRoutes.filter(item => item.name !== '笔记')
      accessedRoutes.unshift(noteRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
