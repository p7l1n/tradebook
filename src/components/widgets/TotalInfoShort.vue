<template>
  <div :class="{ maxWidth }" class="widget-total">
    <div class="widget-total__title">
      {{ !isInactive ? "Статистика (активные)" : "Статистика (неактивные)" }}
    </div>
    <div class="widget-total__list">
      <div class="widget-total__list-item">
        <div class="widget-total__list-item-field strong"></div>
        <div class="widget-total__list-item-field strong">RUB</div>
        <div class="widget-total__list-item-field strong">USD</div>
        <div class="widget-total__list-item-field strong">EUR</div>
        <div class="widget-total__list-item-field strong">WUSD</div>
        <div class="widget-total__list-item-field strong">USDT</div>
      </div>
      <!-- строка журнал -->
      <div class="widget-total__list-item">
        <div class="widget-total__list-item-field label">Журнал</div>
        <div
          :class="{
            red: allStats?.statsOrders?.RUB?.totalInCurrency < 0,
            green: allStats?.statsOrders?.RUB?.totalInCurrency >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.RUB?.totalInCurrency) }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.USD?.totalInCurrency < 0,
            green: allStats?.statsOrders?.USD?.totalInCurrency >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.USD?.totalInCurrency) }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.EUR?.totalInCurrency < 0,
            green: allStats?.statsOrders?.EUR?.totalInCurrency >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.EUR?.totalInCurrency) }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.WUSD?.totalInCurrency < 0,
            green: allStats?.statsOrders?.WUSD?.totalInCurrency >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.WUSD?.totalInCurrency) }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.USDT?.totalInCurrency < 0,
            green: allStats?.statsOrders?.USDT?.totalInCurrency >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.USDT?.totalInCurrency) }}
        </div>
      </div>
      <!-- строка прибыль -->
      <div class="widget-total__list-item">
        <div class="widget-total__list-item-field label">Винни</div>
        <div class="widget-total__list-item-field"></div>
        <div class="widget-total__list-item-field"></div>
        <div class="widget-total__list-item-field"></div>
        <div class="widget-total__list-item-field"></div>
        <div class="widget-total__list-item-field strong">
          {{ toCurrency(profitUsdt) }}
        </div>
      </div>
      <!-- строка факт -->
      <div class="widget-total__list-item">
        <div class="widget-total__list-item-field label">Факт</div>
        <div
          :class="{
            red: allStats?.statsOrders?.RUB?.totalInCurrencyFACT < 0,
            green: allStats?.statsOrders?.RUB?.totalInCurrencyFACT >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.RUB?.totalInCurrencyFACT
              ? 0
              : toCurrency(allStats?.statsOrders?.RUB?.totalInCurrencyFACT)
          }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.USD?.totalInCurrencyFACT < 0,
            green: allStats?.statsOrders?.USD?.totalInCurrencyFACT >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.USD?.totalInCurrencyFACT
              ? 0
              : toCurrency(allStats?.statsOrders?.USD?.totalInCurrencyFACT)
          }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.EUR?.totalInCurrencyFACT < 0,
            green: allStats?.statsOrders?.EUR?.totalInCurrencyFACT >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.EUR?.totalInCurrencyFACT
              ? 0
              : toCurrency(allStats?.statsOrders?.EUR?.totalInCurrencyFACT)
          }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.WUSD?.totalInCurrencyFACT < 0,
            green: allStats?.statsOrders?.WUSD?.totalInCurrencyFACT >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.WUSD?.totalInCurrencyFACT
              ? 0
              : toCurrency(allStats?.statsOrders?.WUSD?.totalInCurrencyFACT)
          }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.USDT?.totalInCurrencyFACT < 0,
            green: allStats?.statsOrders?.USDT?.totalInCurrencyFACT >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.USDT?.totalInCurrencyFACT
              ? 0
              : toCurrency(allStats?.statsOrders?.USDT?.totalInCurrencyFACT)
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import useStats from "@/compositions/useStats";
import { toCurrency } from "@/helpers";

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
  setup(props) {
    const store = useStore();
    const { allStats, profitUsdt, allStatsInactive, profitUsdtInactive } =
      useStats();

    const ratesList = computed(() => store.getters["rates/rates"]);
    const stats = computed(() => {
      return props.isInactive ? allStatsInactive.value : allStats.value;
    });
    const profit = computed(() => {
      return props.isInactive ? profitUsdtInactive.value : profitUsdt.value;
    });
    return {
      ratesList,
      allStats: stats,
      profitUsdt: profit,
      toCurrency,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-total {
  width: 600px;
  padding: $paddingSmall;
  display: flex;
  flex-direction: column;
  background-color: $panelColorLight;
  border-radius: $borderRadius;
  position: relative;
  overflow: hidden;

  &.maxWidth {
    width: 100%;
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
  }

  &__list {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    height: auto;
  }

  &__list-item {
    display: flex;
    align-items: center;
  }

  &__list-item-field {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 40px;

    &.strong {
      color: $textColorBlack;
      font-weight: bold;
    }

    &.green {
      color: $colorGreenDark;
      font-weight: bold;
    }

    &.red {
      color: $colorRedDark;
      font-weight: bold;
    }

    &.label {
      font-size: 10px;
      text-transform: uppercase;
      color: $textColorGrayDark;
    }

    &:nth-child(even) {
      background-color: $panelColorActive;
    }
  }
}
</style>
