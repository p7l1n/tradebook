import { postQuery, getQuery, putQuery, deleteQuery } from "@/api";
import { getNoteTypeFromIndex } from "@/config/noteTypes";

const types = {
  SET_FILTER_OPTION: "SET_FILTER_OPTION",
  SET_NOTES: "SET_NOTES",
  SET_ONLY_DAILY_NOTES: "SET_ONLY_DAILY_NOTES",
  SET_ALL_TYPES_NOTES: "SET_ALL_TYPES_NOTES", // все записи по 1000 всех страниц
};

export default {
  namespaced: true,
  state: () => ({
    filter: {
      from: null,
      to: null,
      pageSize: 1000,
      activeTabIndex: 0,
    },
    allTypesNotes: [],
    notes: [],
    onlyDailyNotes: [],
  }),

  getters: {
    filter: (state) => state.filter,
    notes: (state) => state.notes.filter((c) => c.category === 0), // 0 daily
    onlyDailyNotes: (state) => state.onlyDailyNotes,
    allTypesNotes: (state) => state.allTypesNotes,
  },

  mutations: {
    [types.SET_ALL_TYPES_NOTES](state, value) {
      state.allTypesNotes = value;
    },
    [types.SET_ONLY_DAILY_NOTES](state, value) {
      state.onlyDailyNotes = value;
    },
    [types.SET_NOTES](state, value) {
      state.notes = value;
    },
    [types.SET_FILTER_OPTION](state, { key, value }) {
      state.filter[key] = value;
    },
  },

  actions: {
    async fetchAllTypesNotes({ commit, rootGetters }) {
      const contragents = rootGetters["clients/clients"];
      const startCurrenciesIndexes =
        rootGetters["stats/startCurrenciesIndexes"];
      const invertedObj = Object.fromEntries(
        Object.entries(startCurrenciesIndexes).map(([k, v]) => [v, k])
      );

      const pageSize = 1000;
      let page = 1;
      let allNotes = [];

      const fetchPage = async (pageNum) => {
        const res = await getQuery("Notes", { page: pageNum, pageSize });
        if (res && Array.isArray(res)) {
          const processedNotes = res.map((item) => ({
            ...item,
            date: item.date * 1000,
            type: getNoteTypeFromIndex(item.type),
            inCurrency: invertedObj[item.inCurrencyId],
            client:
              contragents.find((c) => c.id === item.clientId)?.name || "???",
          }));
          allNotes = [...allNotes, ...processedNotes];

          if (res.length === pageSize) {
            await fetchPage(pageNum + 1);
          }
        }
        if (res.error) {
          return;
        }
      };

      await fetchPage(page);
      commit(types.SET_ALL_TYPES_NOTES, allNotes);
    },
    async fetchOnlyDailyNotes({ commit, rootGetters }) {
      const contragents = rootGetters["clients/clients"];
      const startCurrenciesIndexes =
        rootGetters["stats/startCurrenciesIndexes"];
      const invertedObj = Object.fromEntries(
        Object.entries(startCurrenciesIndexes).map(([k, v]) => [v, k])
      );

      const res = await getQuery("Notes", { category: 0, pageSize: 1000 });
      if (res && Array.isArray(res)) {
        commit(
          types.SET_ONLY_DAILY_NOTES,
          res.map((item) => {
            return {
              ...item,
              date: item.date * 1000,
              type: getNoteTypeFromIndex(item.type),
              inCurrency: invertedObj[item.inCurrencyId],
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
    async fetchNotes({ state, commit, rootGetters, dispatch }) {
      const contragents = rootGetters["clients/clients"];
      const startCurrenciesIndexes =
        rootGetters["stats/startCurrenciesIndexes"];
      const invertedObj = Object.fromEntries(
        Object.entries(startCurrenciesIndexes).map(([k, v]) => [v, k])
      );

      const res = await getQuery("Notes", state.filter);
      if (res && Array.isArray(res)) {
        commit(
          types.SET_NOTES,
          res.map((item) => {
            return {
              ...item,
              date: item.date * 1000,
              type: getNoteTypeFromIndex(item.type),
              inCurrency: invertedObj[item.inCurrencyId],
              client:
                contragents.find((c) => c.id === item.clientId)?.name || "???",
            };
          })
        );
        dispatch("noteStats/fetchDkStats", {}, { root: true });
        dispatch("noteStats/fetchAgentsStats", {}, { root: true });
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
