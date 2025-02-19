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
  </div>
</template>
<script>
import Button from "@/components/Button";

export default {
  components: {
    Button,
  },
  setup() {},
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
