import { postQuery, getQuery, putQuery, deleteQuery } from "@/api";
import { getContragentFromIndex } from "@/config/noteTypes";

const types = {
  ADD_CLIENT_LIST: "ADD_CLIENT_LIST",
};

export default {
  namespaced: true,
  state: () => ({
    clients: [],
  }),

  getters: {
    clients: (state) => state.clients,
  },

  mutations: {
    [types.ADD_CLIENT_LIST](state, value) {
      state.clients = value;
    },
  },

  actions: {
    async fetchContragents({ commit }) {
      const res = await getQuery("Clients");
      if (res && Array.isArray(res)) {
        commit(
          types.ADD_CLIENT_LIST,
          res.map((item) => {
            return {
              ...item,
              type: getContragentFromIndex(item.type),
            };
          })
        );
      }
      if (res.error) {
        return;
      }
    },
    async addEntity({ dispatch }, value) {
      const res = await postQuery("Clients", value);
      if (res.id && res.name) {
        await dispatch("fetchContragents");
      }
      if (res.error) {
        return;
      }
    },
    async updateEntity({ dispatch }, value) {
      const res = await putQuery(`Clients/${value.id}`, value);
      await dispatch("fetchContragents");
      if (res.error) {
        return;
      }
    },
    async removeEntity({ dispatch }, id) {
      const res = await deleteQuery(`Clients/${id}`);
      await dispatch("fetchContragents");
      if (res.error) {
        return;
      }
    },
  },
};
