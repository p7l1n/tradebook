<template>
  <div class="balances">
    <div class="balances-item">
      <div class="label">RUB</div>
      <el-input
        placeholder="RUB"
        v-model="rubAmount"
        :formatter="numberFormatter"
        :parser="numberParser"
        class="base-input"
        @input="onRubInput"
      />
    </div>
    <div class="balances-item">
      <div class="label">USD</div>
      <el-input
        placeholder="USD"
        v-model="usdAmount"
        :formatter="numberFormatter"
        :parser="numberParser"
        class="base-input"
        @input="onUsdInput"
      />
    </div>
    <div class="balances-item">
      <div class="label">EUR</div>
      <el-input
        placeholder="EUR"
        v-model="eurAmount"
        :formatter="numberFormatter"
        :parser="numberParser"
        class="base-input"
        @input="onEurInput"
      />
    </div>
    <div class="balances-item">
      <div class="label">USDT</div>
      <el-input
        placeholder="USDT"
        v-model="usdtAmount"
        :formatter="numberFormatter"
        :parser="numberParser"
        class="base-input"
        @input="onUsdtInput"
      />
    </div>
    <div class="balances-item">
      <div class="label">WUSD</div>
      <el-input
        placeholder="WUSD"
        v-model="wusdAmount"
        :formatter="numberFormatter"
        :parser="numberParser"
        class="base-input"
        @input="onWusdInput"
      />
    </div>
    <div v-if="false" class="balances-item" @click="addNewCurrency">ADD</div>
  </div>
</template>
<script>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { numberFormatter, numberParser } from "@/formatters";

export default {
  setup() {
    const store = useStore();
    const rubAmount = ref("");
    const usdAmount = ref("");
    const eurAmount = ref("");
    const usdtAmount = ref("");
    const wusdAmount = ref("");

    const statsStartAmounts = computed(
      () => store.getters["stats/stats"].start
    );

    const onRubInput = () => {
      store.dispatch("stats/setAmount", {
        key: "RUB",
        value: rubAmount.value,
      });
    };

    const onUsdInput = () => {
      store.dispatch("stats/setAmount", {
        key: "USD",
        value: usdAmount.value,
      });
    };

    const onEurInput = () => {
      store.dispatch("stats/setAmount", {
        key: "EUR",
        value: eurAmount.value,
      });
    };

    const onUsdtInput = () => {
      store.dispatch("stats/setAmount", {
        key: "USDT",
        value: usdtAmount.value,
      });
    };

    const onWusdInput = () => {
      store.dispatch("stats/setAmount", {
        key: "WUSD",
        value: wusdAmount.value,
      });
    };

    const addNewCurrency = async () => {
      // city
      await store.dispatch("stats/addCurrencies", {
        name: "RUB",
        amount: 70000000,
        organizationId: 1,
      });
      await store.dispatch("stats/addCurrencies", {
        name: "USD",
        amount: 700000,
        organizationId: 1,
      });
      await store.dispatch("stats/addCurrencies", {
        name: "EUR",
        amount: 500000,
        organizationId: 1,
      });
      await store.dispatch("stats/addCurrencies", {
        name: "WUSD",
        amount: 0,
        organizationId: 1,
      });
      await store.dispatch("stats/addCurrencies", {
        name: "USDT",
        amount: 1105000,
        organizationId: 1,
      });
      // sport
      await store.dispatch("stats/addCurrencies", {
        name: "RUB",
        amount: 30000000,
        organizationId: 2,
      });
      await store.dispatch("stats/addCurrencies", {
        name: "USD",
        amount: 350000,
        organizationId: 2,
      });
      await store.dispatch("stats/addCurrencies", {
        name: "EUR",
        amount: 250000,
        organizationId: 2,
      });
      await store.dispatch("stats/addCurrencies", {
        name: "WUSD",
        amount: 0,
        organizationId: 2,
      });
      await store.dispatch("stats/addCurrencies", {
        name: "USDT",
        amount: 300000,
        organizationId: 2,
      });
    };

    onMounted(() => {
      rubAmount.value = statsStartAmounts.value.RUB;
      usdAmount.value = statsStartAmounts.value.USD;
      eurAmount.value = statsStartAmounts.value.EUR;
      usdtAmount.value = statsStartAmounts.value.USDT;
      wusdAmount.value = statsStartAmounts.value.WUSD;
    });

    return {
      addNewCurrency,
      rubAmount,
      usdAmount,
      eurAmount,
      usdtAmount,
      wusdAmount,

      onRubInput,
      onUsdInput,
      onEurInput,
      onUsdtInput,
      onWusdInput,
      numberFormatter,
      numberParser,
    };
  },
};
</script>
<style lang="scss" scoped>
.balances {
  width: 350px;
  padding: 15px;
  background-color: $panelColorLight;
  border-radius: $borderRadius;
}

.balances-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  .label {
    text-align: center;
    font-size: 14px;
  }
}
</style>
