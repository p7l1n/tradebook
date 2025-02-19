const types = {
  ADD_OPERATOR: "ADD_OPERATORT",
  REMOVE_OPERATOR: "REMOVE_OPERATOR",
  UPDATE_OPERATOR: "UPDATE_OPERATOR",
};

export default {
  namespaced: true,
  state: () => ({
    operators: [],
  }),

  getters: {
    operators: (state) => state.operators,
  },

  mutations: {
    [types.ADD_OPERATOR](state, value) {
      const findItem = state.operators.find((cl) => cl.id === value.id);
      if (findItem) return;

      state.operators.push(value);
    },
    [types.UPDATE_OPERATOR](state, value) {
      const findIndex = state.operators.findIndex((cl) => cl.id === value.id);
      state.operators.splice(findIndex, 1, { ...value });
    },
    [types.REMOVE_OPERATOR](state, value) {
      state.operators = state.operators.filter((cl) => cl.id !== value);
    },
  },

  actions: {
    addEntity({ commit }, value) {
      commit(types.ADD_OPERATOR, value);
    },
    updateEntity({ commit }, value) {
      commit(types.UPDATE_OPERATOR, value);
    },
    removeEntity({ commit }, value) {
      commit(types.REMOVE_OPERATOR, value);
    },
  },
};
