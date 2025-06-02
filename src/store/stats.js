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
  },

  mutations: {
    [types.SET_AMOUNT](state, { key, value }) {
      state.stats.start[key] = value;
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
    setAmount({ state, dispatch }, { key, value, initial }) {
      if (initial) {
        state.stats.start[key] = value;
        return;
      }
      const curr = state.currencies.find((item) => item.name === key);
      if (curr && curr.amount === value) return;
      dispatch("updateCurrencies", { ...curr, amount: value });
    },
    async fetchCurrencies({ dispatch, rootGetters, commit }) {
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
          });
        });
      }
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
