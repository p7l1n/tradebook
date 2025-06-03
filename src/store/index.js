import { createStore } from "vuex";
import rates from "./rates";
import orders from "./orders";
import stats from "./stats";
import clients from "./clients";
import note from "./note";
import dailyNote from "./dailyNote";
import auth from "./auth";
import agents from "./agents";
import settings from "./settings";
import claims from "./claims";
import noteStats from "./noteStats";

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
    note,
    dailyNote,
    auth,
    agents,
    settings,
    claims,
    noteStats,
  },
});
