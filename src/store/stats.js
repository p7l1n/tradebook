import { postQuery, getQuery, putQuery, deleteQuery } from "@/api";

const types = {
  SET_AMOUNT: "SET_AMOUNT",
  ADD_CURR: "ADD_CURR",
  REMOVE_CURR_LIST: "REMOVE_CURR_LIST",
  UPDATE_CURR_LIST: "UPDATE_CURR_LIST",
  ADD_CURR_LIST: "ADD_CURR_LIST",
};

export default {
  namespaced: true,
  state: () => ({
    currencies: [],
    stats: {
      startDefaultControlCurrencies: {
        1: "RUB",
        2: "USD",
        3: "EUR",
        0: "USDT",
        4: "WUSD",
      },
      startCurrenciesIndexes: {},
      start: {
        RUB: 0,
        USD: 0,
        EUR: 0,
        USDT: 0,
        WUSD: 0,
      },
    },
  }),

  getters: {
    stats: (state) => state.stats,
    startCurrenciesIndexes: (state) => state.stats.startCurrenciesIndexes,
    startCurrenciesIndexFromSelectorId: (state) => (id) => {
      const label = state.stats.startDefaultControlCurrencies[id];
      return state.stats.startCurrenciesIndexes[label];
    },
  },

  mutations: {
    [types.SET_AMOUNT](state, { key, value, id }) {
      state.stats.start[key] = value;
      state.stats.startCurrenciesIndexes[key] = id;
    },
    [types.ADD_CURR_LIST](state, value) {
      state.currencies = value;
    },
  },

  actions: {
    async updateCurrencies({ dispatch }, value) {
      const res = await putQuery(`Currencies/${value.id}`, value);
      await dispatch("fetchCurrencies");
      if (res.error) {
        return;
      }
    },
    setAmount({ state, dispatch }, { key, value, initial, id }) {
      if (initial) {
        state.stats.start[key] = value;
        state.stats.startCurrenciesIndexes[key] = id;
        return;
      }
      const curr = state.currencies.find((item) => item.name === key);
      if (curr && curr.amount === value) return;
      dispatch("updateCurrencies", { ...curr, amount: value });
    },
    async fetchCurrencies({ state, dispatch, rootGetters, commit }) {
      const organizationId = rootGetters["settings/organizationId"];

      const res = await getQuery("Currencies", { organizationId });
      if (res && Array.isArray(res)) {
        const arr = res.filter(
          (item) => item.organizationId === organizationId
        );

        commit(types.ADD_CURR_LIST, arr);
        arr.forEach((curr) => {
          dispatch("setAmount", {
            key: curr.name,
            value: curr.amount,
            initial: true,
            id: curr.id,
          });
        });
      }
      console.log("INDEXES", state.stats.startCurrenciesIndexes);
      if (res.error) {
        return;
      }
    },
    async addCurrencies({ dispatch }, value) {
      const res = await postQuery("Currencies", value);
      if (res.id) {
        await dispatch("fetchCurrencies");
      }
      if (res.error) {
        return;
      }
    },
    async removeCurrencies({ dispatch }, id) {
      const res = await deleteQuery(`Currencies/${id}`);
      await dispatch("fetchCurrencies");
      if (res.error) {
        return;
      }
    },
  },
};
