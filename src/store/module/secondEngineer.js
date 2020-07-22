const secondEngineer = {
  namespaced: true,
  state: {
    rowData:[],//二级工程的信息
  },
  getters: {

  },
  mutations: {
    setSecondData(state, data) {
      state.rowData = data;
    }
  },
  actions: {
    getSecondData(store,param) {
      store.commit('setSecondData', param);
    }
  }
}
export default secondEngineer;
