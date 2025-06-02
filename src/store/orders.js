import { postQuery, getQuery, putQuery, deleteQuery } from "@/api";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";
import { getOrderTypeFromIndex } from "@/config/orderTypes";

const types = {
  UPDATE_SHOW_FIELDS: "UPDATE_SHOW_FIELDS",
  SET_FILTER_OPTION: "SET_FILTER_OPTION",
  SET_ORDERS: "SET_ORDERS",
  SET_STOP_FETCH_ALL: "SET_STOP_FETCH_ALL",
};

export default {
  namespaced: true,
  state: () => ({
    stopFetchAll: false,
    filter: {
      searchStr: "",
      status: null,
      customNum: null,
      clientId: null,
      operatorId: null,
      inCurrencyId: null,
      outCurrencyId: null,
      from: null,
      to: null,
      showStats: true,
      showPayed: true,
      cacheIdsForLayer2Filter: [],
      pageSize: 100000,
    },
    showFields: {
      id: {
        title: "ID",
        show: false,
      },
      num: {
        title: "Номер",
        show: true,
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
      customComment: {
        title: "Комм",
        show: true,
      },
      hint: {
        title: "Подсказка",
        show: false,
      },
    },
    orders: [],
  }),

  getters: {
    orders: (state) => state.orders,
    showFields: (state) => state.showFields,
    filter: (state) => state.filter,
    stopFetchAll: (state) => state.stopFetchAll,
  },

  mutations: {
    [types.SET_STOP_FETCH_ALL](state, value) {
      state.stopFetchAll = value;
    },
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
    setStopFetchAll({ commit }, value) {
      commit(types.SET_STOP_FETCH_ALL, value);
    },
    setFilterOption({ commit, dispatch }, { key, value }) {
      commit(types.SET_FILTER_OPTION, { key, value });
      dispatch("fetchOrders");
    },
    updateShowFields({ commit }, value) {
      commit(types.UPDATE_SHOW_FIELDS, value);
    },
    setVirtualQueue({ commit }, id) {
      commit(types.SET_VIRTUAL_QUEUE_NUM, id);
    },
    async fetchOrders({ state, commit, rootGetters }) {
      const clients = rootGetters["clients/clients"];

      const res = await getQuery("Orders", state.filter);
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
                // если валюта прихода и расхода совпадают то плюсуем в расход
                if (item.inCurrencyId === item.outCurrencyId) {
                  kassaAmountOut = item.outAmount + item.agentAmount;
                } else {
                  if (item.agentCurrencyId === item.inCurrencyId) {
                    // если приход минусуем
                    kassaAmountIn = item.inAmount - item.agentAmount;
                  }

                  if (item.agentCurrencyId === item.outCurrencyId) {
                    // в расход плюсуем
                    kassaAmountOut = item.outAmount + item.agentAmount;
                  }
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
    async updateOrderEntity({ getters, dispatch }, value) {
      const data = { ...value };
      if (data.status === false) data.status = 0;
      if (data.status === true) data.status = 1;
      const res = await putQuery(`Orders/${value.id}`, data);
      if (!getters.stopFetchAll) {
        await dispatch("fetchOrders");
      }
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
