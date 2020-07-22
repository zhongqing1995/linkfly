import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  //strict: true,  如果在其他地方修改state， 则会报错
  state: {
    rowData: JSON.parse(sessionStorage.getItem('secondData'))?JSON.parse(sessionStorage.getItem('secondData')):'', //二级工程的需要的一级工程信息
    threeData: JSON.parse(sessionStorage.getItem('threeData')), //三级工程需要的二级工程的信息
    pm_admin_id: JSON.parse(sessionStorage.getItem('adminId')), //工程管理员id
    threePhoto:'',
  },
  mutations: {
    setSecondData(state, data) {
      state.rowData = data;
    },
    setThreeData(state, data) {
      state.threeData = data;
    },
    setAdminId(state, data) {
      state.pm_admin_id = data;
    },
    setPhotoSrc(state, data) {
      state.threePhoto = data;
    },
  },
  getters: {

  },
  actions: {
    getSecondData(store, param) {
      store.commit('setSecondData', param);
    },
    getThreeData(store, param) {
      store.commit('setThreeData', param);
    },
    getAdminId(store, param) {
      store.commit('setAdminId', param);
    },
    getPhotoSrc(store, param) {
      store.commit('setPhotoSrc', param);
    },
  },
  modules: {

  },
});
