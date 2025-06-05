import { getQuery } from "@/api";
import ElNotification from "element-plus";

const types = {
  SET_DK_STATS: "SET_DK_STATS",
  SET_AGENTS_STATS: "SET_AGENTS_STATS",
  SET_KASSA_STATS: "SET_KASSA_STATS",
};

export default {
  namespaced: true,
  state: () => ({
    dkStats: [],
    agentsStats: [],
    kassaStats: [],
  }),

  getters: {
    profitUsdt: (state) => {
      return Object.values(state.kassaStats).reduce((acc, curr) => {
        return acc + (curr.totalInUSDT || 0);
      }, 0);
    },
    profitUsdtAll: (state) => {
      return Object.values(state.kassaStats).reduce((acc, curr) => {
        return acc + (curr.totalInUSDTAll || 0);
      }, 0);
    },
    kassaStats: (state) => state.kassaStats,
    dkStats: (state) => state.dkStats,
    agentsStats: (state) => state.agentsStats,
    combinedAgentsStats: (state) => {
      const combined = {
        client: "Посредники",
        amounts: {},
      };

      state.agentsStats.forEach((agent) => {
        Object.entries(agent.amounts).forEach(([currency, amount]) => {
          combined.amounts[currency] =
            (combined.amounts[currency] || 0) + amount;
        });
      });

      return combined;
    },
  },

  mutations: {
    [types.SET_KASSA_STATS](state, value) {
      state.kassaStats = { ...state.kassaStats, ...value };
    },
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
        commit(types.SET_DK_STATS, stats);
      }
      if (res.error) {
        ElNotification({
          title: "Ошибка загрузки статистики ДК",
          message: res.error,
          type: "error",
        });
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
        commit(types.SET_AGENTS_STATS, stats);
      }
      if (res.error) {
        ElNotification({
          title: "Ошибка загрузки статистики посредников",
          message: res.error,
          type: "error",
        });
        return;
      }
    },
    async fetchKassaStats({ rootGetters, commit }) {
      const organizationId = rootGetters["settings/organizationId"];
      const res = await getQuery("Logic/get-stats", {
        organizationId,
      });
      if (res && Array.isArray(res)) {
        const stats = res.reduce((acc, curr) => {
          const { name, ...rest } = curr;
          acc[name] = rest;
          return acc;
        }, {});

        Object.keys(stats).forEach((key) => {
          stats[key].totalInCurrencyFACTAll =
            (stats[key].totalInCurrencyStart || 0) +
            (stats[key].totalInCurrencyAll || 0) +
            (stats[key].totalInCurrencyDK || 0) +
            // (stats[key].totalInUSDTAll || 0) +
            (stats[key].totalInCurrencyDailyNotes || 0);
        });

        commit(types.SET_KASSA_STATS, stats);
      }
      if (res.error) {
        ElNotification({
          title: "Ошибка загрузки статистики",
          message: res.error,
          type: "error",
        });
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
