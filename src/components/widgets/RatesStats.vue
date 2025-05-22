<template>
  <div :class="{ maxWidth }" class="widget-total">
    <div class="widget-total__title">Средние курсы валют</div>
    <div class="widget-total__list">
      <div class="widget-total__list-item">
        <div class="widget-total__list-item-field label">Покупка / Продажа</div>
        <div class="widget-total__list-item-field strong red">RUB</div>
        <div class="widget-total__list-item-field strong red">USD</div>
        <div class="widget-total__list-item-field strong red">EUR</div>
        <div class="widget-total__list-item-field strong red">WUSD</div>
        <div class="widget-total__list-item-field strong red">USDT</div>
      </div>
      <div
        v-for="buyCurrency in currencies"
        :key="buyCurrency"
        class="widget-total__list-item"
      >
        <div class="widget-total__list-item-field strong green">
          {{ buyCurrency }}
        </div>
        <div
          v-for="sellCurrency in currencies"
          :key="sellCurrency"
          class="widget-total__list-item-field"
        >
          {{ getAverageRate(buyCurrency, sellCurrency) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useStats from "@/compositions/useStats";
import { getNumFormat } from "@/helpers";

export default {
  props: {
    isInactive: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { filteredOrdersList: ordersList } = useStats();

    const currencies = ["RUB", "USD", "EUR", "WUSD", "USDT"];

    const getAverageRate = (buyCurrency, sellCurrency) => {
      if (buyCurrency === sellCurrency) return "-";

      const relevantOrders = ordersList.value.filter(
        (order) =>
          !order.comment.includes("payed") &&
          order.inCurrency === buyCurrency &&
          order.outCurrency === sellCurrency
      );

      if (relevantOrders.length === 0) return "-";

      const sum = relevantOrders.reduce((acc, order) => acc + order.rate, 0);
      const average = sum / relevantOrders.length;

      return getNumFormat(average, 3);
    };

    return {
      ordersList,
      currencies,
      getAverageRate,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-total {
  width: 100%;
  max-width: 600px;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: $panelColorLight;
  border-radius: $borderRadius;
  position: relative;
  overflow: hidden;

  &.maxWidth {
    max-width: 100%;
  }

  &__title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-size: 11px;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    background-color: $panelColorSecondary;
    color: $textColorWhite;
    z-index: 1;
  }

  &__list {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    height: auto;
    overflow-x: auto;
    min-width: 0;
    width: 100%;
  }

  &__list-item {
    display: flex;
    align-items: center;
    min-width: max-content;
    width: 100%;
  }

  &__list-item-field {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 80px;
    height: 40px;

    &.strong {
      color: $textColorBlack;
      font-family: "Roboto-Medium";
    }

    &.label {
      font-size: 10px;
      text-transform: uppercase;
      color: $textColorGrayDark;
    }

    &:nth-child(even) {
      background-color: $panelColorActive;
    }

    &.red {
      color: $colorRedDark;
    }

    &.green {
      color: $colorGreenDark;
    }
  }
}
</style>
