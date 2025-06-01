import { postQuery, getQuery, deleteQuery } from "@/api";

const types = {
  SET_FILTER_OPTION: "SET_FILTER_OPTION",
  ADD_PROFIT_LIST: "ADD_PROFIT_LIST",
};

export default {
  namespaced: true,
  state: () => ({
    filter: {
      from: null,
      to: null,
    },
    notes: [],
    profitHistory: [],
  }),

  getters: {
    filter: (state) => state.filter,
    notes: (state, getters, rootState) =>
      rootState.dailyNote.notes.filter((c) => c.category === 1), // DK
    profitHistory: (state) => state.profitHistory,
  },

  mutations: {
    [types.SET_FILTER_OPTION](state, { key, value }) {
      state.filter[key] = value;
    },
    [types.ADD_PROFIT_LIST](state, value) {
      state.profitHistory = value;
    },
  },

  actions: {
    setFilterOption({ commit }, { key, value }) {
      commit(types.SET_FILTER_OPTION, { key, value });
    },
    // profit
    async fetchProfitHistory({ state, commit }) {
      const res = await getQuery("ProfitHistory", state.filter);
      if (res && Array.isArray(res)) {
        commit(
          types.ADD_PROFIT_LIST,
          res.reverse().map((item) => {
            return {
              ...item,
              date: item.date * 1000,
            };
          })
        );
      }
      if (res.error) {
        return;
      }
    },
    async addNewProfit({ dispatch }, value) {
      const res = await postQuery("ProfitHistory", value);
      if (res.id) {
        await dispatch("fetchProfitHistory");
      }
      if (res.error) {
        return;
      }
    },
    async removeProfit({ dispatch }, value) {
      const res = await deleteQuery(`ProfitHistory/${value.id}`);
      await dispatch("fetchProfitHistory");
      if (res.error) {
        return;
      }
    },
  },
};
