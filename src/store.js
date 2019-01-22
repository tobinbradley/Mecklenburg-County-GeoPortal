import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    selected: {
      lnglat: null,
      label: null,
      address: null,
      pid: null
    },
    poi: {
      lnglat: null,
      label: null,
      address: null
    },
    show: 'welcome',
    initLnglatFlag: false
  },
  getters: {
    selected: state => state.selected,
    poi: state => state.poi,
    show: state => state.show,
    initLnglatFlag: state => state.initLnglatFlag
  },
  mutations: {
    selected (state, payload) {
      state.selected = {
        lnglat: payload.lnglat,
        label: payload.label,
        address: payload.address,
        pid: payload.pid
      }
    },
    poi (state, payload) {
      state.poi = {
        lnglat: payload.lnglat,
        label: payload.label,
        address: payload.address
      }
    },
    show (state, n) {
      state.show = n
    },
    initLnglatFlag (state, n) {
      state.initLnglatFlag = n
    }
  }
})
