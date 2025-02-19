const types = {
  ADD_CLIENT: "ADD_CLIENT",
  REMOVE_CLIENT: "REMOVE_CLIENT",
  UPDATE_CLIENT: "UPDATE_CLIENT",
};

export default {
  namespaced: true,
  state: () => ({
    clients: [],
  }),

  getters: {
    clients: (state) => state.clients,
  },

  mutations: {
    [types.ADD_CLIENT](state, value) {
      const findItem = state.clients.find((cl) => cl.id === value.id);
      if (findItem) return;

      state.clients.push(value);
    },
    [types.UPDATE_CLIENT](state, value) {
      const findIndex = state.clients.findIndex((cl) => cl.id === value.id);
      state.clients.splice(findIndex, 1, { ...value });
    },
    [types.REMOVE_CLIENT](state, value) {
      state.clients = state.clients.filter((cl) => cl.id !== value);
    },
  },

  actions: {
    addEntity({ commit }, value) {
      commit(types.ADD_CLIENT, value);
    },
    updateEntity({ commit }, value) {
      commit(types.UPDATE_CLIENT, value);
    },
    removeEntity({ commit }, value) {
      commit(types.REMOVE_CLIENT, value);
    },
  },
};
