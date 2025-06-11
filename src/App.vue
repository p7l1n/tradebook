<template>
  <MainMenu v-if="userInfo" />
  <div class="app-version">
    {{ lastExecutionTime ? `${lastExecutionTime}ms | ` : "" }}p1.2.12
  </div>
  <div :class="{ isAuth: userInfo }" class="main-app">
    <div v-if="isAuth" class="app-switch-theme">
      <el-switch size="large" v-model="switchTheme" @change="onSwitchTheme">
        <template #active-action>
          <span class="custom-active-action">Н</span>
        </template>
        <template #inactive-action>
          <span class="custom-inactive-action">Д</span>
        </template>
      </el-switch>
    </div>
    <div v-if="isAuth" :class="{ focused }" class="main-calculator">
      <el-input
        placeholder="Калькулятор"
        v-model="mathStr"
        clearable
        class="base-input"
        @focus="onFocus(true)"
        @blur="onFocus(false)"
        @input="onCalcInput"
      />
      <div class="sum-total">{{ sumCalc }}</div>
    </div>
    <router-view />
  </div>
</template>
<script>
import MainMenu from "@/components/MainMenu";
import { computed, onMounted, watch, ref, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { toCurrency, replaceCommasWithDots } from "@/helpers";
const { evaluate } = require("mathjs");

export default {
  components: {
    MainMenu,
  },
  setup() {
    const store = useStore();
    const switchTheme = ref(false);
    const userInfo = computed(() => store.getters["auth/user"]);
    const isAdmin = computed(() => store.getters["auth/isAdmin"]);
    const isAuth = computed(() => userInfo.value?.jwt);
    const organizationId = computed(
      () => store.getters["settings/organizationId"]
    );
    const stopFetchAll = computed(() => store.getters["orders/stopFetchAll"]);
    const mathStr = ref("");
    const sumCalc = ref("");
    const focused = ref(false);
    const lastExecutionTime = ref(null);

    const initApp = async (strongOnly) => {
      const startTime = performance.now();
      if (strongOnly) {
        await store.dispatch("clients/fetchContragents");
        await store.dispatch("dailyNote/fetchNotes");
        await store.dispatch("dailyNote/fetchOnlyDailyNotes");
        await store.dispatch("orders/fetchOrders");
      } else {
        await store.dispatch("settings/fetchOrganizations");
        await store.dispatch("stats/fetchCurrencies");
        await store.dispatch("rates/fetchRates");
        await store.dispatch("clients/fetchContragents");
        await store.dispatch("dailyNote/fetchNotes");
        await store.dispatch("dailyNote/fetchOnlyDailyNotes");
        await store.dispatch("note/fetchProfitHistory");
        await store.dispatch("orders/fetchOrders");
        await store.dispatch("sverka/fetchBalance");
        // await store.dispatch("noteStats/fetchDkStats");
        // await store.dispatch("noteStats/fetchAgentsStats");
        // await store.dispatch("noteStats/fetchKassaStats");
      }
      if (isAdmin.value) {
        await store.dispatch("claims/fetchClaimList");
      }
      const endTime = performance.now();
      lastExecutionTime.value = Math.round(endTime - startTime);
    };

    watch(
      () => organizationId.value,
      async (organizationId) => {
        if (organizationId) {
          await initApp();
        }
      }
    );

    watch(
      () => userInfo.value?.jwt,
      async (jwt) => {
        if (jwt) {
          await initApp();
        }
      }
    );

    const timer = ref(null);
    const timerLog = ref(null);

    onMounted(async () => {
      switchTheme.value = store.getters["settings/isDarkTheme"];
      if (switchTheme.value) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      store.dispatch("orders/setFilterOption", {
        key: "showPayed",
        value: true,
      });
      setTimeout(async () => {
        if (userInfo.value?.jwt) {
          initApp();
          timer.value = setInterval(() => {
            // если есть токен, то обновляем и не идет снятие или откат
            if (userInfo.value?.jwt && !stopFetchAll.value) {
              initApp(true);
            }
          }, 30000);
          timerLog.value = setInterval(async () => {
            await store.dispatch("sverka/fetchBalance");
          }, 120000);
        }
      }, 500);
    });

    const onCalcInput = (val) => {
      try {
        sumCalc.value = ` = ${toCurrency(
          +evaluate(replaceCommasWithDots(val)).toFixed(3),
          ","
        )}`;
      } catch (err) {
        sumCalc.value = "";
      }
    };

    const onFocus = (val) => {
      focused.value = val;
    };

    const onSwitchTheme = (val) => {
      store.dispatch("settings/setIsDarkTheme", val);
      if (val) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    };

    onBeforeUnmount(() => {
      clearInterval(timer.value);
      clearInterval(timerLog.value);
    });

    return {
      userInfo,
      sumCalc,
      mathStr,
      focused,
      isAuth,
      switchTheme,
      lastExecutionTime,
      onFocus,
      onCalcInput,
      onSwitchTheme,
    };
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/_breakpoints.scss";

body,
html {
  padding: 0;
  margin: 0;
  background-color: $bgMainColor;
  // min-width: 1385px;
  // overflow-x: auto;
}

.main-app {
  &.isAuth {
    padding-top: 80px;
  }
}

* {
  transition: all 0.3s ease;
}

.app-switch-theme {
  position: fixed;
  right: 430px;
  top: 22px;
  z-index: 1000;

  @media (max-width: $breakpoint-mobile) {
    right: auto;
    left: 90px;
    top: 20px;
  }
}
.main-calculator {
  opacity: 0.1;
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 70px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  position: fixed;
  right: 200px;
  top: 5px;
  bottom: 10px;
  z-index: 1000;
  overflow: hidden;

  &.focused {
    opacity: 1;
  }

  .sum-total {
    margin-top: 5px;
  }

  @media (max-width: $breakpoint-mobile) {
    right: 50%;
    transform: translateX(50%);
    top: auto;
    bottom: 10px;
  }
}

#app {
  font-family: Roboto-Regular, Manrope-Medium, Avenir, Helvetica;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $defaultTextColor;
}

.app-version {
  position: fixed;
  right: 3px;
  bottom: 3px;
  font-weight: bold;
  font-size: 10px;
  z-index: 10;
}

body.dark {
  .main-calculator {
    border: 1px solid transparent;

    .sum-total {
      color: #444;
    }

    .el-input {
      background-color: #2a2929bd;
    }
  }
}
</style>
