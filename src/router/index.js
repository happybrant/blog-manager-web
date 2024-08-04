/* Layout */
import Layout from '@/layout'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/list',
    name: '博客',
    meta: { title: '博客', icon: 'blog' },
    children: [
      {
        path: '/blog/list',
        name: '博客列表',
        component: () => import('@/views/blog/list'),
        meta: { title: '博客列表', icon: 'list' }
      },
      {
        path: '/blog/edit',
        name: '写博客',
        component: () => import('@/views/blog/edit'),
        meta: { title: '写博客', icon: 'el-icon-edit-outline' }
      }
    ]
  },
  {
    path: '/album',
    component: Layout,
    redirect: '/album/index',
    children: [
      {
        path: '/album/index',
        name: '相册',
        component: () => import('@/views/album/index'),
        meta: { title: '相册', icon: 'album' }
      },
      {
        path: '/album/detail',
        name: '照片',
        component: () => import('@/views/album/detail'),
        meta: { title: '相册 / 照片', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task',
    children: [
      {
        path: 'index',
        name: '任务',
        component: () => import('@/views/task/index'),
        meta: { title: '任务', icon: 'task' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/blog',
    name: '个人中心',
    meta: { title: '个人中心', icon: 'user' },
    children: [
      {
        path: '/setting/blog',
        name: '个人设置',
        component: () => import('@/views/setting/manager'),
        meta: { title: '个人设置', icon: 'el-icon-setting' }
      },
      {
        path: '/setting/personal',
        name: '关于我',
        component: () => import('@/views/setting/editAbout'),
        meta: { title: '关于我', icon: 'el-icon-edit-outline' }
      }
    ]
  }
]
export const noteRoutes =
  {
    path: '/note',
    component: Layout,
    redirect: '/note/list',
    name: '笔记',
    meta: {
      title: '笔记',
      icon: 'form'
    },
    children: [
      {
        path: '/note/list',
        name: '笔记列表',
        component: () => import('@/views/note/list'),
        meta: { title: '笔记列表', icon: 'el-icon-notebook-2' }
      },
      {
        path: '/note/edit',
        name: '写笔记',
        component: () => import('@/views/note/edit'),
        meta: { title: '写笔记', icon: 'el-icon-edit-outline' }
      }
    ]
  }

export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: '系统管理',
    meta: {
      title: '系统管理',
      icon: 'peoples',
      roles: ['admin']
    },
    children: [
      {
        path: '/user/index',
        name: '用户管理',
        component: () => import('@/views/user/list'),
        meta: {
          title: '用户管理',
          icon: 'people',
          roles: ['admin'] // you can set roles in root nav
        }
      },
      {
        path: '/log/index',
        name: '日志监控',
        component: () => import('@/views/log/logList'),
        meta: {
          title: '日志监控',
          icon: 'el-icon-document',
          roles: ['admin'] // you can set roles in root nav
        }
      }
      // {
      //   path: '/user/personal',
      //   name: '迭代计划',
      //   component: () => import('@/views/user/plan'),
      //   meta: { title: '迭代计划', icon: 'guide', roles: ['admin'] // you can set roles in root nav
      //   }
      // }
    ]
  },
  // 404 page must be placed at the end !!!

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
