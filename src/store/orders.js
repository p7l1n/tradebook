import { postQuery, getQuery, putQuery, deleteQuery } from "@/api";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";
import { getOrderTypeFromIndex } from "@/config/orderTypes";

const types = {
  UPDATE_SHOW_FIELDS: "UPDATE_SHOW_FIELDS",
  SET_FILTER_OPTION: "SET_FILTER_OPTION",
  SET_ORDERS: "SET_ORDERS",
};

export default {
  namespaced: true,
  state: () => ({
    filter: {
      searchStr: "",
      status: null,
      client: null,
      operator: null,
      inCurrency: null,
      outCurrency: null,
      date: null,
      showStats: null,
      showPayed: true,
    },
    showFields: {
      id: {
        title: "ID",
        show: false,
      },
      date: {
        title: "Дата",
        show: true,
      },
      dateChange: {
        title: "Дата изм",
        show: false,
      },
      type: {
        title: "Тип",
        show: true,
      },
      client: {
        title: "Клиент",
        show: true,
      },
      operator: {
        title: "Оператор",
        show: true,
      },
      hint: {
        title: "Подсказка",
        show: true,
      },
    },
    orders: [],
  }),

  getters: {
    orders: (state) => state.orders,
    showFields: (state) => state.showFields,
    filter: (state) => state.filter,
  },

  mutations: {
    [types.SET_FILTER_OPTION](state, { key, value }) {
      state.filter[key] = value;
    },
    [types.UPDATE_SHOW_FIELDS](state, key) {
      if (state.showFields[key]) {
        state.showFields[key].show = !state.showFields[key].show;
      }
    },
    [types.SET_ORDERS](state, value) {
      state.orders = value;
    },
  },

  actions: {
    setFilterOption({ commit }, { key, value }) {
      commit(types.SET_FILTER_OPTION, { key, value });
    },
    updateShowFields({ commit }, value) {
      commit(types.UPDATE_SHOW_FIELDS, value);
    },
    async fetchOrders({ commit, rootGetters }) {
      const clients = rootGetters["clients/clients"];

      const res = await getQuery("Orders");
      if (res && Array.isArray(res)) {
        commit(
          types.SET_ORDERS,
          res
            .reverse()
            // .filter((item) => item.comment !== "payed")
            .map((item) => {
              // calc in
              let kassaAmountIn = 0;
              let kassaAmountOut = 0;

              if (item.agentAmount !== 0) {
                if (item.agentCurrencyId === item.inCurrencyId) {
                  kassaAmountIn = item.inAmount - item.agentAmount;
                }

                if (item.agentCurrencyId === item.outCurrencyId) {
                  kassaAmountOut = item.outAmount + item.agentAmount;
                }
              }
              if (kassaAmountOut === 0) {
                kassaAmountOut = item.outAmount;
              }
              if (kassaAmountIn === 0) {
                kassaAmountIn = item.inAmount;
              }
              // calc out
              return {
                ...item,
                date: item.date * 1000,
                status: item.status === 0 ? false : true,
                type: getOrderTypeFromIndex(item.type),
                inCurrency: DEFAULT_CURRENCIES[item.inCurrencyId],
                outCurrency: DEFAULT_CURRENCIES[item.outCurrencyId],
                client:
                  clients.find((c) => c.id === item.clientId)?.name || "???",
                operator:
                  clients.find((c) => c.id === item.operatorId)?.name || "???",
                agent: clients.find((c) => c.id === item.agentId)?.name || "",
                agentCurrency: DEFAULT_CURRENCIES[item.agentCurrencyId],
                kassaAmountIn,
                kassaAmountOut,
              };
            })
        );
      }
      if (res.error) {
        return;
      }
    },
    async updateOrderEntity({ dispatch }, value) {
      const data = { ...value };
      if (data.status === false) data.status = 0;
      if (data.status === true) data.status = 1;
      const res = await putQuery(`Orders/${value.id}`, data);
      await dispatch("fetchOrders");
      if (res.error) {
        return;
      }
    },
    async addNewOrderEntity({ dispatch }, value) {
      const res = await postQuery("Orders", value);
      if (res.id) {
        await dispatch("fetchOrders");
      }
      return res;
    },
    async removeOrderEntity({ dispatch }, value) {
      const res = await deleteQuery(`Orders/${value.id}`);
      await dispatch("fetchOrders");
      if (res.error) {
        return;
      }
    },
  },
};
