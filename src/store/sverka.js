// import { ElNotification } from "element-plus";
import { getBalance } from "@/api/getBalance";

const types = {
  ADD_NEW_ITEM: "ADD_NEW_ITEM",
  CLEAR_LIST: "CLEAR_LIST",
  SET_ADDRESS: "SET_ADDRESS",
};

export default {
  namespaced: true,
  state: () => ({
    sverkaList: [],
    address: "",
  }),

  getters: {
    sverkaList: (state) => [...state.sverkaList].sort((a, b) => b.d - a.d),
    address: (state) => state.address,
  },

  mutations: {
    [types.ADD_NEW_ITEM](state, value) {
      state.sverkaList.push(value);
    },
    [types.CLEAR_LIST](state) {
      state.sverkaList = [];
    },
    [types.SET_ADDRESS](state, value) {
      state.address = value;
    },
  },

  actions: {
    addNewItem({ commit }, value) {
      commit(types.ADD_NEW_ITEM, value);
    },
    clearList({ commit }) {
      commit(types.CLEAR_LIST);
    },
    setAddress({ commit }, value) {
      commit(types.SET_ADDRESS, value);
    },
    async fetchBalance({ state, commit, rootGetters }) {
      if (state.address) {
        const { balance } = await getBalance(state.address);
        const fact =
          rootGetters["noteStats/kassaStats"]["USDT"]?.totalInCurrencyFACT;
        if (typeof balance === "number") {
          commit(types.ADD_NEW_ITEM, {
            d: +new Date(),
            b: balance,
            f: fact,
            df: +balance - +fact,
            // то что ввели руками отнимаем то что посчитано
          });
        }
      }
    },
  },
};
