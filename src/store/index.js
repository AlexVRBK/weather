import { createStore } from 'vuex'


export default createStore({
  state: {
    newCityArray: []
  },
  mutations: {
    setNewCityArray(state, newArray) {
      state.newCityArray = newArray;
    },
  },
  actions: {
   
  },
  getters: {
    
  },
})
