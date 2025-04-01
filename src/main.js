import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import createPersistedState from "vuex-persistedstate";
import VueClickAway from "vue3-click-away";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createPersistedState({
  paths: [
    // "rates.rates",
    // "rates.updateFromServer",
    // "orders.showFields",
    "orders.filter",
    // "orders.orders",
    // "clients.clients",
    // "operators.operators",
    // "note.notes",
    // "note.profitHistory",
    // "note.filter",
    // "dailyNote.notes",
    // "dailyNote.filter",
    // "stats.stats",
    "auth.user",
  ],
})(store);

createApp(App)
  .use(store)
  .use(router)
  .use(VueClickAway)
  .use(ElementPlus)
  .mount("#app");
