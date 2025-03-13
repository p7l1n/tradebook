import store from "@/store";

/* eslint-disable-next-line consistent-return */
export default async (to, from, next) => {
  const isAuthenticated = store.getters["auth/user"];
  if (to.name !== "login" && !isAuthenticated) next({ name: "login" });
  else if (to.name === "login" && isAuthenticated) next({ name: "balances" });
  else next();
};
