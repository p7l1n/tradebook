import { getQuery, postQuery, deleteQuery } from "@/api";

const types = {
  SET_CLAIM_LIST: "SET_CLAIM_LIST",
};

export default {
  namespaced: true,
  state: () => ({
    claimList: [],
  }),

  getters: {
    claimList: (state) => state.claimList,
  },

  mutations: {
    [types.SET_CLAIM_LIST](state, list) {
      state.claimList = list;
    },
  },

  actions: {
    async fetchClaimList({ commit }) {
      const res = await getQuery("Claims/users");
      if (res && Array.isArray(res)) {
        commit(types.SET_CLAIM_LIST, res);
      }
      if (res.error) {
        return;
      }
    },
    async removeUser({ dispatch }, id) {
      const res = await deleteQuery(`Claims/delete-user/${id}`);
      await dispatch("fetchClaimList");
      if (res.error) {
        return;
      }
    },
    async addClaim({ dispatch }, value) {
      const res = await postQuery("Claims/add-claim", value);
      await dispatch("fetchClaimList");
      if (res.error) {
        return;
      }
    },
    async removeClaim({ dispatch }, value) {
      const res = await postQuery("Claims/remove-claim", value);
      await dispatch("fetchClaimList");
      if (res.error) {
        return;
      }
    },
  },
};
