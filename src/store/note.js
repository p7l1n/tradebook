const types = {
  UPDATE_ENTITY: "UPDATE_ENTITY",
  ADD_NEW_ENTITY: "ADD_NEW_ENTITY",
  REMOVE_ENTITY: "REMOVE_ENTITY",

  ADD_NEW_PROFIT: "ADD_NEW_PROFIT",
  REMOVE_PROFIT: "REMOVE_PROFIT",

  SET_FILTER_OPTION: "SET_FILTER_OPTION",
};

export default {
  namespaced: true,
  state: () => ({
    filter: {
      dateFrom: null,
      dateTo: null,
    },
    notes: [],
    profitHistory: [],
  }),

  getters: {
    filter: (state) => state.filter,
    notes: (state) => state.notes,
    profitHistory: (state) => state.profitHistory,
  },

  mutations: {
    [types.SET_FILTER_OPTION](state, { key, value }) {
      state.filter[key] = value;
    },
    [types.UPDATE_ENTITY](state, value) {
      const newList = [];

      state.notes.forEach((item) => {
        if (item.id == value.id) {
          newList.push({ ...value });
        } else {
          newList.push({ ...item });
        }
      });
      state.notes = newList;
    },
    [types.ADD_NEW_ENTITY](state, value) {
      state.notes.unshift(value);
    },
    [types.REMOVE_ENTITY](state, value) {
      state.notes = state.notes.filter((item) => item.id !== value.id);
    },
    // profit
    [types.ADD_NEW_PROFIT](state, value) {
      state.profitHistory.unshift(value);
    },
    [types.REMOVE_PROFIT](state, value) {
      state.profitHistory = state.profitHistory.filter(
        (item) => item.id !== value.id
      );
      state.notes = state.notes.filter((item) => item.id !== value.id);
    },
  },

  actions: {
    setFilterOption({ commit }, { key, value }) {
      commit(types.SET_FILTER_OPTION, { key, value });
    },
    updateEntity({ commit }, value) {
      commit(types.UPDATE_ENTITY, value);
    },
    addNewEntity({ commit }, value) {
      commit(types.ADD_NEW_ENTITY, value);
    },
    removeEntity({ commit }, value) {
      commit(types.REMOVE_ENTITY, value);
    },
    // profit
    addNewProfit({ commit }, value) {
      commit(types.ADD_NEW_PROFIT, value);
    },
    removeProfit({ commit }, value) {
      commit(types.REMOVE_PROFIT, value);
    },
  },
};
