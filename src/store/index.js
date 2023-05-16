import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import album from './modules/album'
import app from './modules/app'
import blog from './modules/blog'
import home from './modules/home'
import log from './modules/log'
import note from './modules/note'
import permission from './modules/permission'
import settings from './modules/settings'
import task from './modules/task'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    home,
    user,
    blog,
    album,
    task,
    note,
    permission,
    log
  },
  getters
})

export default store
