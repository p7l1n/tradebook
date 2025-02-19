//const types = {};

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

  mutations: {},

  actions: {},
};
