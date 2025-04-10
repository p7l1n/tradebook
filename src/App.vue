<template>
  <MainMenu v-if="userInfo" />
  <div class="app-version">{{ "p1.0.6" }}</div>
  <router-view />
</template>
<script>
import MainMenu from "@/components/MainMenu";
import { computed, onMounted, watch } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    MainMenu,
  },
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters["auth/user"]);

    watch(
      () => userInfo.value?.jwt,
      async (jwt) => {
        if (jwt) {
          await store.dispatch("stats/fetchCurrencies");
          await store.dispatch("rates/fetchRates");
          await store.dispatch("clients/fetchContragents");
          await store.dispatch("dailyNote/fetchNotes");
          await store.dispatch("note/fetchProfitHistory");
          await store.dispatch("orders/fetchOrders");
        }
      }
    );

    onMounted(async () => {
      setTimeout(async () => {
        if (userInfo.value?.jwt) {
          await store.dispatch("stats/fetchCurrencies");
          await store.dispatch("rates/fetchRates");
          await store.dispatch("clients/fetchContragents");
          await store.dispatch("dailyNote/fetchNotes");
          await store.dispatch("note/fetchProfitHistory");
          await store.dispatch("orders/fetchOrders");
        }
      }, 500);
    });

    return {
      userInfo,
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

* {
  transition: all 0.3s ease;
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
