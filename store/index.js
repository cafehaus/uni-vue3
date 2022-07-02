import user from './modules/user'
import app from './modules/app'
let store

// #ifdef VUE3
import { createStore } from 'vuex'
store = createStore({
  modules: {
	user,
	app
  }
})
// #endif

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

store = new Vuex.Store({
  modules: {
	user,
	app
  }
})
// #endif

export default store