<template>
  <MainMenu v-if="userInfo" />
  <div class="app-version">{{ "p1.1.39" }}</div>
  <div class="main-app">
    <div :class="{ focused }" class="main-calculator">
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
    const userInfo = computed(() => store.getters["auth/user"]);
    const isAdmin = computed(() => store.getters["auth/isAdmin"]);
    const organizationId = computed(
      () => store.getters["settings/organizationId"]
    );
    const mathStr = ref("");
    const sumCalc = ref("");
    const focused = ref(false);

    const initApp = async () => {
      await store.dispatch("stats/fetchCurrencies");
      await store.dispatch("rates/fetchRates");
      await store.dispatch("clients/fetchContragents");
      await store.dispatch("dailyNote/fetchNotes");
      await store.dispatch("note/fetchProfitHistory");
      await store.dispatch("orders/fetchOrders");
      await store.dispatch("settings/fetchOrganizations");
      if (isAdmin.value) {
        await store.dispatch("claims/fetchClaimList");
      }
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
      store.dispatch("orders/setFilterOption", {
        key: "showPayed",
        value: true,
      });
      setTimeout(async () => {
        if (userInfo.value?.jwt) {
          initApp();
          timer.value = setInterval(() => {
            initApp();
          }, 60000);
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

    onBeforeUnmount(() => {
      clearInterval(timer.value);
    });

    return {
      userInfo,
      sumCalc,
      mathStr,
      focused,
      onFocus,
      onCalcInput,
    };
  },
};
</script>
<style lang="scss">
body,
html {
  padding: 0;
  margin: 0;
  min-width: 1385px;
  overflow-x: auto;
}

.main-app {
  padding-top: 80px;
}

* {
  transition: all 0.3s ease;
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
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-notification,
.el-select-dropdown__item {
  font-family: Avenir, Helvetica, Arial, sans-serif !important;
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
.el-input__wrapper {
  background-color: #746f6f21 !important;
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

.app-version {
  position: fixed;
  right: 3px;
  bottom: 3px;
  font-weight: bold;
  font-size: 10px;
  z-index: 10;
}
</style>
