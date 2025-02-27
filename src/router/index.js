import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home/index.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/balances",
    name: "balances",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Balances"),
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import(/* webpackChunkName: "about" */ "../views/Orders"),
  },
  {
    path: "/dailynotes",
    name: "dailynotes",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DailyNote"),
  },
  {
    path: "/notes",
    name: "notes",
    component: () => import(/* webpackChunkName: "about" */ "../views/Note"),
  },
  {
    path: "/clients",
    name: "clients",
    component: () => import(/* webpackChunkName: "about" */ "../views/Clients"),
  },
  {
    path: "/operators",
    name: "operators",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Operators"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "about" */ "../views/Login"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
