import { postQuery } from "@/api";
import { ElNotification } from "element-plus";
import router from "@/router";
import { parseJwt } from "@/api/jwt";

const types = {
  ADD_USER: "ADD_USER",
};

export default {
  namespaced: true,
  state: () => ({
    user: null,
  }),

  getters: {
    user: (state) => state.user,
  },

  mutations: {
    [types.ADD_USER](state, value) {
      state.user = value;
    },
  },

  actions: {
    logout({ commit }) {
      commit(types.ADD_USER, null);
    },
    async login({ commit }, params) {
      const res = await postQuery("Account/login", params);
      if (res.error) {
        return;
      }
      if (res.token) {
        const userInfo = parseJwt(res.token);
        console.log(userInfo);
        commit(types.ADD_USER, { ...userInfo, jwt: res.token });
        router.push("/balances");
      } else {
        ElNotification({
          title: "LogIn",
          message: "Token not found",
          type: "warning",
        });
      }
    },

    async register(_, params) {
      const res = await postQuery("Account/register", params);
      if (res.error) {
        return {
          error: true,
        };
      }

      ElNotification({
        title: "Register",
        message: res.result,
        type: "success",
      });

      return {
        success: true,
      };
    },
  },
};
