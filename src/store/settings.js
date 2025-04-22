import { getQuery, postQuery, putQuery, deleteQuery } from "@/api";

const types = {
  SET_ORGANIZATION_ID: "SET_ORGANIZATION_ID",
  SET_ORGANIZATIONS_LIST: "SET_ORGANIZATIONS_LIST",
};

export default {
  namespaced: true,
  state: () => ({
    organizationId: 1,
    organizationsList: [],
  }),

  getters: {
    organizationId: (state) => state.organizationId,
    organizationsList: (state) => state.organizationsList,
    organizationName: (state) =>
      state.organizationsList.length === 1
        ? state.organizationsList[0]?.name || ""
        : state.organizationsList.find((org) => org.id == state.organizationId)
            ?.name || "",
  },

  mutations: {
    [types.SET_ORGANIZATION_ID](state, id) {
      state.organizationId = id;
    },
    [types.SET_ORGANIZATIONS_LIST](state, list) {
      state.organizationsList = list;
    },
  },

  actions: {
    setOrganizationId({ commit }, id) {
      commit(types.SET_ORGANIZATION_ID, id);
    },
    async fetchOrganizations({ commit }) {
      const res = await getQuery("Organizations");
      if (res && Array.isArray(res)) {
        commit(types.SET_ORGANIZATIONS_LIST, res);
      }
      if (res.error) {
        return;
      }
    },
    async updateOrganization({ dispatch }, value) {
      const res = await putQuery(`Organizations/${value.id}`, value);
      await dispatch("fetchOrganizations");
      if (res.error) {
        return;
      }
    },
    async addNewOrganization({ dispatch }, value) {
      const res = await postQuery("Organizations", value);
      if (res.id) {
        await dispatch("fetchOrganizations");
      }
      return res;
    },
    async removeOrganization({ dispatch }, value) {
      const res = await deleteQuery(`Organizations/${value.id}`);
      await dispatch("fetchOrganizations");
      if (res.error) {
        return;
      }
    },
  },
};
