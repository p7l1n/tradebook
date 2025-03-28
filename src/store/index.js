import { createStore } from "vuex";
import rates from "./rates";
import orders from "./orders";
import stats from "./stats";
import clients from "./clients";
import operators from "./operators";
import note from "./note";
import dailyNote from "./dailyNote";
import auth from "./auth";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    rates,
    orders,
    stats,
    clients,
    operators,
    note,
    dailyNote,
    auth,
  },
});
