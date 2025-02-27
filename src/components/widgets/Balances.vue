<template>
  <div class="balances">
    <div class="balances-item">
      <div class="label">RUB</div>
      <Input
        placeholder="RUB"
        v-model="rubAmount"
        type="number"
        @input="onRubInput"
      />
    </div>
    <div class="balances-item">
      <div class="label">USD</div>
      <Input
        placeholder="USD"
        v-model="usdAmount"
        type="number"
        @input="onUsdInput"
      />
    </div>
    <div class="balances-item">
      <div class="label">EUR</div>
      <Input
        placeholder="EUR"
        v-model="eurAmount"
        type="number"
        @input="onEurInput"
      />
    </div>
    <div class="balances-item">
      <div class="label">USDT</div>
      <Input
        placeholder="USDT"
        v-model="usdtAmount"
        type="number"
        @input="onUsdtInput"
      />
    </div>
    <div class="balances-item">
      <div class="label">WUSD</div>
      <Input
        placeholder="WUSD"
        v-model="wusdAmount"
        type="number"
        @input="onWusdInput"
      />
    </div>
  </div>
</template>
<script>
import Input from "../Input";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    Input,
  },
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

    onMounted(() => {
      rubAmount.value = statsStartAmounts.value.RUB;
      usdAmount.value = statsStartAmounts.value.USD;
      eurAmount.value = statsStartAmounts.value.EUR;
      usdtAmount.value = statsStartAmounts.value.USDT;
      wusdAmount.value = statsStartAmounts.value.WUSD;
    });

    return {
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
    };
  },
};
</script>
<style lang="scss" scoped>
.balances {
  width: 350px;
  padding: 15px;
  background-color: $colorRowGrayActive;
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
