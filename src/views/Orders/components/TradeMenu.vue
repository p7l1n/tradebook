<template>
  <div class="trade-menu">
    <div class="trade-menu__item">
      <Button
        :is-green="true"
        title="Покупка USDT"
        @click="$emit('buyUSDT', 'buyUSDT')"
      ></Button>
    </div>
    <div class="trade-menu__item">
      <Button
        :is-red="true"
        title="Продажа USDT"
        @click="$emit('sellUSDT', 'sellUSDT')"
      ></Button>
    </div>
    <!-- <div class="trade-menu__item">
      <Button :is-green="true" title="Покупка RUB"></Button>
    </div>
    <div class="trade-menu__item">
      <Button :is-red="true" title="Продажа RUB"></Button>
    </div> -->
    <div class="trade-menu__item">
      <Button
        :is-green="true"
        title="Покупка USD"
        @click="$emit('buyUSD', 'buyUSD')"
      ></Button>
    </div>
    <div class="trade-menu__item">
      <Button
        :is-red="true"
        title="Продажа USD"
        @click="$emit('sellUSD', 'sellUSD')"
      ></Button>
    </div>
    <div class="trade-menu__item">
      <Button
        :is-green="true"
        title="Покупка EUR"
        @click="$emit('buyEUR', 'buyEUR')"
      ></Button>
    </div>
    <div class="trade-menu__item">
      <Button
        :is-red="true"
        title="Продажа EUR"
        @click="$emit('sellEUR', 'sellEUR')"
      ></Button>
    </div>
    <div class="trade-menu__item">
      <Button
        :is-green="true"
        title="Покупка WUSD"
        @click="$emit('buyWUSD', 'buyWUSD')"
      ></Button>
    </div>
    <div class="trade-menu__item">
      <Button
        :is-red="true"
        title="Продажа WUSD"
        @click="$emit('sellWUSD', 'sellWUSD')"
      ></Button>
    </div>
    <CheckGroupButton
      :items="operationTypes"
      :active-index="activeOperationTypesIndex"
      @check="onSelectOperationType"
    />
  </div>
</template>
<script>
import Button from "@/components/Button";
import CheckGroupButton from "@/components/CheckGroupButton";
import { onMounted, ref } from "vue";
import { ORDER_TYPES } from "@/config/orderTypes";

export default {
  components: {
    Button,
    CheckGroupButton,
  },
  setup(_, { emit }) {
    const activeOperationTypesIndex = ref(0);
    const operationTypes = ref([
      ORDER_TYPES.order,
      ORDER_TYPES.move,
      ORDER_TYPES.trade,
    ]);

    const onSelectOperationType = (ndx) => {
      activeOperationTypesIndex.value = ndx;
      emit("selectOrderType", activeOperationTypesIndex.value);
    };

    onMounted(() => {
      emit("selectOrderType", activeOperationTypesIndex.value);
    });

    return {
      operationTypes,
      activeOperationTypesIndex,
      onSelectOperationType,
    };
  },
};
</script>
<style lang="scss" scoped>
.trade-menu {
  display: flex;
  align-items: center;

  &__item {
    margin-right: 12px;
    min-width: 100px;
  }
}
</style>
