<template>
  <div :class="{ maxWidth }" class="widget-total">
    <div class="widget-total__title">Статистика (ТЕТРАДЬ + ЖУРНАЛ ДК)</div>
    <div class="widget-total__list">
      <div class="widget-total__list-item">
        <div class="widget-total__list-item-field label"></div>
        <div class="widget-total__list-item-field label">USDT</div>
        <div class="widget-total__list-item-field label">RUB</div>
        <div class="widget-total__list-item-field label">USD</div>
        <div class="widget-total__list-item-field label">EUR</div>
        <div class="widget-total__list-item-field label">WUSD</div>
      </div>
      <div
        class="widget-total__list-item"
        v-for="(item, ndx) in allStats"
        :key="ndx"
      >
        <div class="widget-total__list-item-field strong">
          {{ item.client }}
        </div>
        <div
          :class="{
            red: item.amounts.USDT < 0,
            green: item.amounts.USDT >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(item.amounts.USDT || 0) }}
        </div>
        <div
          :class="{
            red: item.amounts.RUB < 0,
            green: item.amounts.RUB >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(item.amounts.RUB || 0) }}
        </div>
        <div
          :class="{
            red: item.amounts.USD < 0,
            green: item.amounts.USD >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(item.amounts.USD || 0) }}
        </div>
        <div
          :class="{
            red: item.amounts.EUR < 0,
            green: item.amounts.EUR >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(item.amounts.EUR || 0) }}
        </div>
        <div
          :class="{
            red: item.amounts.WUSD < 0,
            green: item.amounts.WUSD >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(item.amounts.WUSD || 0) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { computed } from "vue";
// import { useStore } from "vuex";
import useStatsNotes from "@/compositions/useStatsNotes";
import { toCurrency } from "@/helpers";

export default {
  props: {
    maxWidth: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { allStats } = useStatsNotes();

    console.log("allStats", allStats.value);

    return {
      allStats,
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
