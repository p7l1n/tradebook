import { getQuery } from "@/api";

const types = {
  SET_DK_STATS: "SET_DK_STATS",
  SET_AGENTS_STATS: "SET_AGENTS_STATS",
};

export default {
  namespaced: true,
  state: () => ({
    dkStats: [],
    agentsStats: [],
  }),

  getters: {
    dkStats: (state) => state.dkStats,
    agentsStats: (state) => state.agentsStats,
  },

  mutations: {
    [types.SET_DK_STATS](state, value) {
      state.dkStats = value;
    },
    [types.SET_AGENTS_STATS](state, value) {
      state.agentsStats = value;
    },
  },

  actions: {
    // ДК + ТЕТРАДЬ
    async fetchDkStats({ rootGetters, commit }) {
      const organizationId = rootGetters["settings/organizationId"];
      const startCurrenciesIndexes =
        rootGetters["stats/startCurrenciesIndexes"];
      const invertedObj = Object.fromEntries(
        Object.entries(startCurrenciesIndexes).map(([k, v]) => [v, k])
      );

      const res = await getQuery("Notes/aggregate-by-client-currency", {
        organizationId,
        category: [0, 1],
      });
      if (res && Array.isArray(res)) {
        const stats = res.map((r) => ({
          client: r.name,
          //currencies: r.currencies,
          amounts: r.currencies.reduce((acc, curr) => {
            acc[invertedObj[curr.currencyId]] = curr.amount;
            return acc;
          }, {}),
        }));
        console.log("STATS API DK", stats);
        commit(types.SET_DK_STATS, stats);
      }
      if (res.error) {
        return;
      }
    },
    // ПОСРЕДНИКИ
    async fetchAgentsStats({ rootGetters, commit }) {
      const organizationId = rootGetters["settings/organizationId"];
      const startCurrenciesIndexes =
        rootGetters["stats/startCurrenciesIndexes"];
      const invertedObj = Object.fromEntries(
        Object.entries(startCurrenciesIndexes).map(([k, v]) => [v, k])
      );

      const res = await getQuery("Notes/aggregate-by-client-currency", {
        organizationId,
        category: [2],
      });
      if (res && Array.isArray(res)) {
        const stats = res.map((r) => ({
          client: r.name,
          // currencies: r.currencies,
          amounts: r.currencies.reduce((acc, curr) => {
            acc[invertedObj[curr.currencyId]] = curr.amount;
            return acc;
          }, {}),
        }));
        console.log("STATS API AGENT", stats);
        commit(types.SET_AGENTS_STATS, stats);
      }
      if (res.error) {
        return;
      }
    },
    // async fetchAllStats({ rootGetters }) {
    //   const organizationId = rootGetters["settings/organizationId"];

    //   const res = await getQuery("Notes/aggregate-by-currency", {
    //     organizationId,
    //   });
    //   if (res && Array.isArray(res)) {
    //     console.log("API STATS2", res);
    //   }
    // },
  },
};
