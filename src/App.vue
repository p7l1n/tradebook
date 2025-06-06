<template>
  <MainMenu v-if="userInfo" />
  <div class="app-version">
    {{ lastExecutionTime ? `${lastExecutionTime}ms | ` : "" }}p1.2.3
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
        await store.dispatch("orders/fetchOrders");
      } else {
        await store.dispatch("stats/fetchCurrencies");
        await store.dispatch("rates/fetchRates");
        await store.dispatch("clients/fetchContragents");
        await store.dispatch("dailyNote/fetchNotes");
        await store.dispatch("note/fetchProfitHistory");
        await store.dispatch("orders/fetchOrders");
        await store.dispatch("settings/fetchOrganizations");
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

.el-notification,
.el-select-dropdown__item {
  font-family: Manrope-Regular, Manrope-Medium, Avenir, Helvetica, Arial,
    sans-serif !important;
}

.debet {
  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background: $lightRed !important;
  }
  .el-table tr {
    background: $lightRed !important;
  }
  tr th .cell {
    color: $colorRedDark !important;
  }
}

.credit {
  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background: $lightGreen !important;
  }
  .el-table tr {
    background: $lightGreen !important;
  }
  tr th .cell {
    color: $colorGreenDark !important;
  }
}
.el-input__wrapper,
.el-select__wrapper {
  background-color: $colorInputWrap !important;
  box-shadow: initial !important;
}

.el-select__input-wrapper {
  // box-shadow: 0 0 0 1px #ccc inset !important;
}
.green {
  .el-input__wrapper {
    background-color: $lightGreen !important;
  }
}

.red {
  .el-input__wrapper {
    background-color: $lightRed !important;
  }
}

.el-input__wrapper,
.el-input__wrapper.is-focus {
  box-shadow: none !important;
}

.el-input {
  width: 100% !important;
  min-width: 170px;
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
  .el-select-dropdown__list {
    background-color: #444 !important;
  }
  .el-select__input {
    color: #ccc;
  }
  .el-select-dropdown__item {
    color: #ccc !important;
  }
  .el-select-dropdown__item.is-hovering {
    background-color: #888 !important;
    color: #ccc !important;
  }
  .el-input__wrapper {
    .el-input__inner {
      color: #ccc;
    }
  }

  .el-popper.is-light,
  .el-popper.is-light > .el-popper__arrow:before {
    border: none !important; // рамка
  }

  .el-popper.is-light,
  .el-popper.is-light > .el-popper__arrow:before {
    background: #444 !important; // крестик
  }

  .el-table__body-wrapper {
    // тетрадь фон
    background-color: #3c3c3c;
  }

  .el-table th.el-table__cell {
    background-color: #3c3c3c !important;
  }

  .el-table {
    --el-table-border-color: transparent !important;
  }

  .el-table__row {
    td {
      color: #ccc !important;
    }
  }

  // login
  .el-tabs__content {
    background-color: #444;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #444;
    color: #ccc !important;
  }

  .el-tabs__nav-scroll {
    background-color: #888;
  }

  .el-checkbox__label {
    color: #ccc;
  }

  .el-switch.is-checked .el-switch__core {
    background-color: #4b5157;
    border-color: #4b4e6a;
  }

  .main-calculator {
    border: 1px solid transparent;

    .sum-total {
      color: #444;
    }

    .el-input {
      background-color: #2a2929bd;
    }
  }

  // calendar
  .el-picker-panel [slot="sidebar"],
  .el-picker-panel__sidebar {
    background-color: #444;
    font-family: Roboto-Regular, Manrope-Medium, Avenir, Helvetica;
  }

  .el-picker-panel__shortcut {
    color: #ccc !important;
  }

  .el-picker-panel [slot="sidebar"] + .el-picker-panel__body,
  .el-picker-panel__sidebar + .el-picker-panel__body {
    background-color: #383737 !important;
  }

  .el-date-table td.disabled .el-date-table-cell {
    background-color: #555759 !important;
  }

  .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
    background-color: #575757 !important;
  }

  .el-date-table td.today .el-date-table-cell__text {
    color: var(--el-color-primary);
  }

  .el-date-table td.is-selected .el-date-table-cell__text {
    background-color: #444 !important;
    color: #fff !important;
  }

  .el-year-table td.disabled .el-date-table-cell__text {
    background-color: #545454;
  }

  .el-year-table td.current:not(.disabled) .el-date-table-cell__text {
    background-color: #575757;
    color: #fff;
  }

  .el-month-table td.disabled .el-date-table-cell__text {
    background-color: #575757 !important;
  }

  .el-select__placeholder {
    color: #ccc !important;
  }
}
</style>
