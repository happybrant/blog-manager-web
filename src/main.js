import '@/icons'
// permission control
import '@/permission'
// global css
import '@/styles/index.scss'
import axios from 'axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
// markdown-it对象：md.s_markdown, md => mavonEditor实例
//                 or
//                 mavonEditor.markdownIt
import 'mavon-editor/dist/css/index.css'
// A modern alternative to CSS resets
import 'normalize.css/normalize.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(Element)
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.use(mavonEditor)

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
