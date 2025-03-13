const types = {
  ADD_USER: "ADD_USER",
};

export default {
  namespaced: true,
  state: () => ({
    user: null,
  }),

  getters: {
    user: (state) => state.user,
  },

  mutations: {
    [types.ADD_USER](state, value) {
      state.user = value;
    },
  },

  actions: {
    addUser({ commit }, value) {
      commit(types.ADD_USER, value);
    },
  },
};
