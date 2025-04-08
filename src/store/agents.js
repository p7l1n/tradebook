const types = {
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
  }),

  getters: {
    filter: (state) => state.filter,
    notes: (state, getters, rootState) =>
      rootState.dailyNote.notes.filter((c) => c.category === 2), // посредник
  },

  mutations: {
    [types.SET_FILTER_OPTION](state, { key, value }) {
      state.filter[key] = value;
    },
  },

  actions: {
    setFilterOption({ commit }, { key, value }) {
      commit(types.SET_FILTER_OPTION, { key, value });
    },
  },
};
