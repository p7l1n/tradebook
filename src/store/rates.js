import { getRates } from "@/api/getRates";

const types = {
  ADD_RATE_ENTITY: "ADD_RATE_ENTITY",
  UPDATE_RATE: "UPDATE_RATE",
  UPDATE_RATE_ENTITY: "UPDATE_RATE_ENTITY",
  REMOVE_RATE_ENTITY: "REMOVE_RATE_ENTITY",

  SET_UPDATE_FROM_SERVER: "SET_UPDATE_FROM_SERVER",
};

export default {
  namespaced: true,
  state: () => ({
    updateFromServer: true,
    rates: {
      RUB: {
        title: "RUB",
        buy: 0,
        sell: 0,
        spreadBuy: 0,
        spreadSell: 0,
        points: 2,
        apiKey: "usdtrub",
      },
      USD: {
        title: "USD",
        buy: 0,
        sell: 0,
        spreadBuy: 0,
        spreadSell: 0,
        points: 3,
        apiKey: "usdtusd",
      },
      EUR: {
        title: "EUR",
        buy: 0,
        sell: 0,
        spreadBuy: 0,
        spreadSell: 0,
        points: 3,
        apiKey: "usdteur",
      },
      WUSD: {
        title: "WUSD",
        buy: 0,
        sell: 0,
        spreadBuy: 0,
        spreadSell: 0,
        points: 3,
        apiKey: "wusdtusd",
      },
      USDT: {
        title: "USDT",
        buy: 0,
        sell: 0,
        spreadBuy: 0,
        spreadSell: 0,
        points: 3,
        apiKey: "usdtusdt",
      },
    },
  }),

  getters: {
    rates: (state) => state.rates,
    isLoading: () => false, // !+state.rates.USD.buy,
    updateFromServer: (state) => state.updateFromServer,
  },

  mutations: {
    [types.SET_UPDATE_FROM_SERVER](state, value) {
      state.updateFromServer = value;
    },
    [types.ADD_RATE_ENTITY](state, toast = {}) {
      if (!state.rates[toast.title]) {
        state.rates[toast.title] = {
          ...toast,
        };
      }
    },
    [types.UPDATE_RATE_ENTITY](state, entity) {
      if (state.rates[entity.title]) {
        state.rates[entity.title] = entity;
      }
    },
    [types.UPDATE_RATE](state, { key, buy, sell }) {
      if (state.rates[key]) {
        state.rates[key].buy = buy;
        state.rates[key].sell = sell;
      }
    },
    [types.REMOVE_RATE_ENTITY](state, key) {
      delete state.rates[key];
    },
  },

  actions: {
    setUpdateFromServer({ commit }, value) {
      commit(types.SET_UPDATE_FROM_SERVER, value);
    },
    addRateEntity({ commit }, rate) {
      commit(types.ADD_RATE_ENTITY, rate);
    },
    removeRateEntity({ commit }, key) {
      commit(types.REMOVE_RATE_ENTITY, key);
    },
    updateRateEntity({ commit }, entity) {
      commit(types.UPDATE_RATE_ENTITY, entity);
    },
    async fetchRates({ commit, state }) {
      if (!state.updateFromServer) {
        return;
      }
      const rub = await getRates("usdtrub");
      const usd = await getRates("usdtusd");
      const eur = await getRates("usdteur");

      if (rub.info) {
        commit(types.UPDATE_RATE, {
          key: "RUB",
          buy: rub.info.ask,
          sell: rub.info.bid,
        });
      }
      if (usd.info) {
        commit(types.UPDATE_RATE, {
          key: "USD",
          buy: usd.info.ask,
          sell: usd.info.bid,
        });
      }
      if (eur.info) {
        commit(types.UPDATE_RATE, {
          key: "EUR",
          buy: eur.info.ask,
          sell: eur.info.bid,
        });
      }
    },
  },
};
