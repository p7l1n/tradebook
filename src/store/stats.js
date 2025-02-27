const types = {
  SET_AMOUNT: "SET_AMOUNT",
};

export default {
  namespaced: true,
  state: () => ({
    stats: {
      start: {
        RUB: 100000,
        USD: 100000,
        EUR: 100000,
        USDT: 100000,
        WUSD: 100000,
      },
    },
  }),

  getters: {
    stats: (state) => state.stats,
  },

  mutations: {
    [types.SET_AMOUNT](state, { key, value }) {
      state.stats.start[key] = value;
    },
  },

  actions: {
    setAmount({ commit }, { key, value }) {
      console.log(key, value);
      commit(types.SET_AMOUNT, { key, value });
    },
  },
};
