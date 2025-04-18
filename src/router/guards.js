import store from "@/store";

/* eslint-disable-next-line consistent-return */
export default async (to, from, next) => {
  const isAuthenticated = store.getters["auth/user"];
  const isAdmin = store.getters["auth/isAdmin"];
  if (to.name === "settings" && !isAdmin) next({ name: "balances" });
  if (to.name !== "login" && !isAuthenticated) next({ name: "login" });
  else if (to.name === "login" && isAuthenticated) next({ name: "balances" });
  else next();
};
