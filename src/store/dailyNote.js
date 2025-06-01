import { postQuery, getQuery, putQuery, deleteQuery } from "@/api";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";
import { getNoteTypeFromIndex } from "@/config/noteTypes";

const types = {
  SET_FILTER_OPTION: "SET_FILTER_OPTION",
  SET_NOTES: "SET_NOTES",
};

export default {
  namespaced: true,
  state: () => ({
    filter: {
      from: null,
      to: null,
      activeTabIndex: 0,
    },
    notes: [],
  }),

  getters: {
    filter: (state) => state.filter,
    notes: (state) => state.notes.filter((c) => c.category === 0), // 0 daily
  },

  mutations: {
    [types.SET_NOTES](state, value) {
      state.notes = value;
    },
    [types.SET_FILTER_OPTION](state, { key, value }) {
      state.filter[key] = value;
    },
  },

  actions: {
    async fetchNotes({ state, commit, rootGetters }) {
      const contragents = rootGetters["clients/clients"];

      const res = await getQuery("Notes", state.filter);
      if (res && Array.isArray(res)) {
        commit(
          types.SET_NOTES,
          res.map((item) => {
            return {
              ...item,
              date: item.date * 1000,
              type: getNoteTypeFromIndex(item.type),
              inCurrency: DEFAULT_CURRENCIES[item.inCurrencyId],
              client:
                contragents.find((c) => c.id === item.clientId)?.name || "???",
            };
          })
        );
      }
      if (res.error) {
        return;
      }
    },
    setFilterOption({ commit, state, dispatch }, { key, value }) {
      commit(types.SET_FILTER_OPTION, { key, value });
      if (
        (state.filter.from && state.filter.to) ||
        (!state.filter.from && !state.filter.to)
      ) {
        dispatch("fetchNotes");
      }
    },
    async updateEntity({ dispatch }, value) {
      const res = await putQuery(`Notes/${value.id}`, value);
      await dispatch("fetchNotes");
      if (res.error) {
        return;
      }
    },
    async addNewEntity({ dispatch }, value) {
      const res = await postQuery("Notes", value); // { ...value, category: 2 }
      if (res.id) {
        await dispatch("fetchNotes");
      }
      return res;
    },
    async removeEntity({ dispatch }, value) {
      const res = await deleteQuery(`Notes/${value.id}`);
      await dispatch("fetchNotes");
      if (res.error) {
        return;
      }
    },
  },
};
