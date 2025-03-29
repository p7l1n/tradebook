import { postQuery, getQuery, putQuery, deleteQuery } from "@/api";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";
import { getNoteTypeFromIndex } from "@/config/noteTypes";

const types = {
  UPDATE_ENTITY: "UPDATE_ENTITY",
  ADD_NEW_ENTITY: "ADD_NEW_ENTITY",
  REMOVE_ENTITY: "REMOVE_ENTITY",

  SET_FILTER_OPTION: "SET_FILTER_OPTION",
  SET_NOTES: "SET_NOTES",
};

export default {
  namespaced: true,
  state: () => ({
    filter: {
      dateFrom: null,
      dateTo: null,
      activeTabIndex: 0,
    },
    notes: [],
  }),

  getters: {
    filter: (state) => state.filter,
    notes: (state) => state.notes.filter((c) => c.category === 0),
  },

  mutations: {
    [types.SET_NOTES](state, value) {
      state.notes = value;
    },
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
  },

  actions: {
    async fetchNotes({ commit, rootGetters }) {
      const contragents = rootGetters["clients/clients"];

      const res = await getQuery("Notes");
      if (res && Array.isArray(res)) {
        commit(
          types.SET_NOTES,
          res.map((item) => {
            return {
              ...item,
              type: getNoteTypeFromIndex(item.type),
              inCurrency: DEFAULT_CURRENCIES[item.inCurrency],
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
    setFilterOption({ commit }, { key, value }) {
      commit(types.SET_FILTER_OPTION, { key, value });
    },
    async updateEntity({ dispatch }, value) {
      const res = await putQuery(`Notes/${value.id}`, value);
      await dispatch("fetchNotes");
      if (res.error) {
        return;
      }
    },
    async addNewEntity({ dispatch }, value) {
      const res = await postQuery("Notes", value);
      if (res.id) {
        await dispatch("fetchNotes");
      }
      if (res.error) {
        return;
      }
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
