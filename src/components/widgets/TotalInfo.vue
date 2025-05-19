<template>
  <div :class="{ maxWidth }" class="widget-total">
    <div class="widget-total__title">Статистика</div>
    <div class="widget-total__list">
      <div class="widget-total__list-item">
        <div class="widget-total__list-item-field label"></div>
        <div class="widget-total__list-item-field label">Начало</div>
        <div class="widget-total__list-item-field label">Журнал</div>
        <div class="widget-total__list-item-field label">Свед юсд</div>
        <div class="widget-total__list-item-field label">Винни</div>
        <div class="widget-total__list-item-field label">Журнал ДК</div>
        <div class="widget-total__list-item-field label">Тетрадь</div>
        <div class="widget-total__list-item-field label">ФАКТ</div>
        <div class="widget-total__list-item-field label">ФАКТ U+W</div>
      </div>
      <div
        class="widget-total__list-item"
        v-for="(item, key, ndx) in allStats.statsOrders"
        :key="ndx"
      >
        <div class="widget-total__list-item-field strong">{{ key }}</div>
        <div class="widget-total__list-item-field">
          {{ toCurrency(item.totalInCurrencyStart) }}
        </div>
        <div
          :class="{
            red: item.totalInCurrency < 0,
            green: item.totalInCurrency >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(item.totalInCurrency) }}
        </div>
        <div
          :class="{
            red: item.totalInUSDT < 0,
            green: item.totalInUSDT >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ item.totalInCurrency == 0 ? 0 : toCurrency(item.totalInUSDT) }}
        </div>
        <div class="widget-total__list-item-field strong">
          {{ key === "USDT" ? toCurrency(profitUsdt) : "" }}
        </div>
        <div
          :class="{
            red: item.totalInCurrencyDK < 0,
            green: item.totalInCurrencyDK >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ !item.totalInCurrencyDK ? 0 : toCurrency(item.totalInCurrencyDK) }}
        </div>
        <div
          :class="{
            red: item.totalInCurrencyDailyNotes < 0,
            green: item.totalInCurrencyDailyNotes >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !item.totalInCurrencyDailyNotes
              ? 0
              : toCurrency(item.totalInCurrencyDailyNotes)
          }}
        </div>
        <div
          :class="{
            red: item.totalInCurrencyFACT < 0,
            green: item.totalInCurrencyFACT >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !item.totalInCurrencyFACT ? 0 : toCurrency(item.totalInCurrencyFACT)
          }}
        </div>
        <div
          :class="{
            red: totalInCurrencyFACTwu < 0,
            green: totalInCurrencyFACTwu >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            ndx === 2
              ? !totalInCurrencyFACTwu
                ? 0
                : toCurrency(totalInCurrencyFACTwu)
              : ""
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
    maxWidth: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    const { allStats, profitUsdt } = useStats();

    const ratesList = computed(() => store.getters["rates/rates"]);
    const totalInCurrencyFACTwu = computed(() => {
      return (
        allStats.value.statsOrders?.USD?.totalInCurrencyFACTwu +
        allStats.value.statsOrders?.WUSD?.totalInCurrencyFACTwu
      );
    });

    return {
      ratesList,
      allStats,
      profitUsdt,
      totalInCurrencyFACTwu,
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
  padding: 0;
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
    font-size: 14px;

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
