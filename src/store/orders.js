const types = {
  UPDATE_ORDER_ENTITY: "UPDATE_ORDER_ENTITY",
  ADD_NEW_ORDER_ENTITY: "ADD_NEW_ORDER_ENTITY",
  REMOVE_ORDER_ENTITY: "REMOVE_ORDER_ENTITY",
  UPDATE_SHOW_FIELDS: "UPDATE_SHOW_FIELDS",
  SET_FILTER_OPTION: "SET_FILTER_OPTION",
};

export default {
  namespaced: true,
  state: () => ({
    filter: {
      searchStr: "",
      client: null,
      operator: null,
      inCurrency: null,
      outCurrency: null,
      date: null,
      showStats: null,
    },
    showFields: {
      id: {
        title: "ID",
        show: true,
      },
      date: {
        title: "Дата",
        show: true,
      },
      dateChange: {
        title: "Дата изм",
        show: true,
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
    orders: [
      // {
      //   id: 8073470215460445,
      //   date: 1737234000000,
      //   dateChange: 1737234000000,
      //   type: "СДЕЛКА",
      //   client: "Ivan ivanov",
      //   operator: "bschange",
      //   inCurrency: "RUB",
      //   inAmount: "43000",
      //   rate: "90",
      //   outCurrency: "USDT",
      //   outAmount: 477.778, // 43000 / 90
      // },
      // {
      //   id: 8017590425460445,
      //   date: 1736888400000,
      //   dateChange: 1737234000000,
      //   type: "СДЕЛКА",
      //   client: "Danya",
      //   operator: "velvet",
      //   inCurrency: "USDT",
      //   inAmount: "70000",
      //   rate: "1.005",
      //   outCurrency: "USD",
      //   outAmount: 70349.99999999999, // 70000 * 1.005
      // },
      // {
      //   id: 1937470875460445,
      //   date: 1731618000000,
      //   dateChange: 1737234000000,
      //   type: "СДЕЛКА",
      //   client: "Danya",
      //   operator: "bschange",
      //   inCurrency: "EUR",
      //   inAmount: "20000",
      //   rate: "95",
      //   outCurrency: "RUB",
      //   outAmount: 1900000, // 20000 * 95
      // },
    ],
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
    [types.UPDATE_ORDER_ENTITY](state, value) {
      const newList = [];

      state.orders.forEach((item) => {
        if (item.id == value.id) {
          newList.push({ ...value });
        } else {
          newList.push({ ...item });
        }
      });
      state.orders = newList;
    },
    [types.ADD_NEW_ORDER_ENTITY](state, value) {
      state.orders.unshift(value);
    },
    [types.REMOVE_ORDER_ENTITY](state, value) {
      state.orders = state.orders.filter((item) => item.id !== value.id);
    },
  },

  actions: {
    setFilterOption({ commit }, { key, value }) {
      commit(types.SET_FILTER_OPTION, { key, value });
    },
    updateShowFields({ commit }, value) {
      commit(types.UPDATE_SHOW_FIELDS, value);
    },
    updateOrderEntity({ commit }, value) {
      commit(types.UPDATE_ORDER_ENTITY, value);
    },
    addNewOrderEntity({ commit }, value) {
      commit(types.ADD_NEW_ORDER_ENTITY, value);
    },
    removeOrderEntity({ commit }, value) {
      commit(types.REMOVE_ORDER_ENTITY, value);
    },
  },
};
