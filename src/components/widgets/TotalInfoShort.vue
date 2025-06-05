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
      <div v-if="!isInactive" class="widget-total__list-item">
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
      <!-- строка журнал (неактивные) -->
      <div v-if="isInactive" class="widget-total__list-item">
        <div class="widget-total__list-item-field label">Журнал</div>
        <div
          :class="{
            red: allStats?.statsOrders?.RUB?.totalInCurrencyAll < 0,
            green: allStats?.statsOrders?.RUB?.totalInCurrencyAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.RUB?.totalInCurrencyAll) }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.USD?.totalInCurrencyAll < 0,
            green: allStats?.statsOrders?.USD?.totalInCurrencyAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.USD?.totalInCurrencyAll) }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.EUR?.totalInCurrencyAll < 0,
            green: allStats?.statsOrders?.EUR?.totalInCurrencyAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.EUR?.totalInCurrencyAll) }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.WUSD?.totalInCurrencyAll < 0,
            green: allStats?.statsOrders?.WUSD?.totalInCurrencyAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.WUSD?.totalInCurrencyAll) }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.USDT?.totalInCurrencyAll < 0,
            green: allStats?.statsOrders?.USDT?.totalInCurrencyAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{ toCurrency(allStats?.statsOrders?.USDT?.totalInCurrencyAll) }}
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
          {{ toCurrency(profitUsdtValue) }}
        </div>
      </div>
      <!-- строка факт АКТИВ-->
      <div v-if="!isInactive" class="widget-total__list-item">
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
      <!-- Строка факт (неактивные) -->
      <div v-if="isInactive" class="widget-total__list-item">
        <div class="widget-total__list-item-field label">Факт</div>
        <div
          :class="{
            red: allStats?.statsOrders?.RUB?.totalInCurrencyFACTAll < 0,
            green: allStats?.statsOrders?.RUB?.totalInCurrencyFACTAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.RUB?.totalInCurrencyFACTAll
              ? 0
              : toCurrency(allStats?.statsOrders?.RUB?.totalInCurrencyFACTAll)
          }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.USD?.totalInCurrencyFACTAll < 0,
            green: allStats?.statsOrders?.USD?.totalInCurrencyFACTAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.USD?.totalInCurrencyFACTAll
              ? 0
              : toCurrency(allStats?.statsOrders?.USD?.totalInCurrencyFACTAll)
          }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.EUR?.totalInCurrencyFACTAll < 0,
            green: allStats?.statsOrders?.EUR?.totalInCurrencyFACTAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.EUR?.totalInCurrencyFACTAll
              ? 0
              : toCurrency(allStats?.statsOrders?.EUR?.totalInCurrencyFACTAll)
          }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.WUSD?.totalInCurrencyFACTAll < 0,
            green: allStats?.statsOrders?.WUSD?.totalInCurrencyFACTAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.WUSD?.totalInCurrencyFACTAll
              ? 0
              : toCurrency(allStats?.statsOrders?.WUSD?.totalInCurrencyFACTAll)
          }}
        </div>
        <div
          :class="{
            red: allStats?.statsOrders?.USDT?.totalInCurrencyFACTAll < 0,
            green: allStats?.statsOrders?.USDT?.totalInCurrencyFACTAll >= 0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.USDT?.totalInCurrencyFACTAll
              ? 0
              : toCurrency(allStats?.statsOrders?.USDT?.totalInCurrencyFACTAll)
          }}
        </div>
      </div>

      <!-- строка факт2 -->
      <div v-if="isInactive" class="widget-total__list-item">
        <div class="widget-total__list-item-field label">Ф + Балансовые ДК</div>
        <div
          :class="{
            red:
              allStats?.statsOrders?.RUB?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.RUB?.totalInCurrencyDKwithProvodka <
              0,
            green:
              allStats?.statsOrders?.RUB?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.RUB?.totalInCurrencyDKwithProvodka >=
              0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.RUB?.totalInCurrencyDKwithProvodka
              ? toCurrency(
                  allStats?.statsOrders?.RUB?.totalInCurrencyFACTAll || 0
                )
              : toCurrency(
                  allStats?.statsOrders?.RUB?.totalInCurrencyFACTAll +
                    allStats?.statsOrders?.RUB?.totalInCurrencyDKwithProvodka
                )
          }}
        </div>
        <div
          :class="{
            red:
              allStats?.statsOrders?.USD?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.USD?.totalInCurrencyDKwithProvodka <
              0,
            green:
              allStats?.statsOrders?.USD?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.USD?.totalInCurrencyDKwithProvodka >=
              0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.USD?.totalInCurrencyDKwithProvodka
              ? toCurrency(
                  allStats?.statsOrders?.USD?.totalInCurrencyFACTAll || 0
                )
              : toCurrency(
                  allStats?.statsOrders?.USD?.totalInCurrencyFACTAll +
                    allStats?.statsOrders?.USD?.totalInCurrencyDKwithProvodka
                )
          }}
        </div>
        <div
          :class="{
            red:
              allStats?.statsOrders?.EUR?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.EUR?.totalInCurrencyDKwithProvodka <
              0,
            green:
              allStats?.statsOrders?.EUR?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.EUR?.totalInCurrencyDKwithProvodka >=
              0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.EUR?.totalInCurrencyDKwithProvodka
              ? toCurrency(
                  allStats?.statsOrders?.EUR?.totalInCurrencyFACTAll || 0
                )
              : toCurrency(
                  allStats?.statsOrders?.EUR?.totalInCurrencyFACTAll +
                    allStats?.statsOrders?.EUR?.totalInCurrencyDKwithProvodka
                )
          }}
        </div>
        <div
          :class="{
            red:
              allStats?.statsOrders?.WUSD?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.WUSD?.totalInCurrencyDKwithProvodka <
              0,
            green:
              allStats?.statsOrders?.WUSD?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.WUSD?.totalInCurrencyDKwithProvodka >=
              0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.WUSD?.totalInCurrencyDKwithProvodka
              ? toCurrency(
                  allStats?.statsOrders?.WUSD?.totalInCurrencyFACTAll || 0
                )
              : toCurrency(
                  +allStats?.statsOrders?.WUSD?.totalInCurrencyFACTAll +
                    +allStats?.statsOrders?.WUSD?.totalInCurrencyDKwithProvodka
                )
          }}
        </div>
        <div
          :class="{
            red:
              allStats?.statsOrders?.USDT?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.USDT?.totalInCurrencyDKwithProvodka <
              0,
            green:
              allStats?.statsOrders?.USDT?.totalInCurrencyFACTAll +
                allStats?.statsOrders?.USDT?.totalInCurrencyDKwithProvodka >=
              0,
          }"
          class="widget-total__list-item-field"
        >
          {{
            !allStats?.statsOrders?.USDT?.totalInCurrencyDKwithProvodka
              ? toCurrency(
                  allStats?.statsOrders?.USDT?.totalInCurrencyFACTAll || 0
                )
              : toCurrency(
                  allStats?.statsOrders?.USDT?.totalInCurrencyFACTAll +
                    allStats?.statsOrders?.USDT?.totalInCurrencyDKwithProvodka
                )
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";

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

    const profitUsdt = computed(() => store.getters["noteStats/profitUsdt"]);
    const profitUsdtAll = computed(
      () => store.getters["noteStats/profitUsdtAll"]
    );
    const kassaStats = computed(() => store.getters["noteStats/kassaStats"]);
    const ratesList = computed(() => store.getters["rates/rates"]);

    const allStats = computed(() => {
      return { statsOrders: kassaStats.value };
    });

    const profitUsdtValue = computed(() => {
      return !props.isInactive ? profitUsdt.value : profitUsdtAll.value;
    });
    return {
      ratesList,
      allStats,
      profitUsdtValue,
      toCurrency,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-total {
  width: 100%;
  // max-width: 600px;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: $panelColorLight;
  border-radius: $borderRadius;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

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
  }

  &__list-item {
    display: flex;
    align-items: center;
    min-width: max-content;
  }

  &__list-item-field {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 80px;
    height: 40px;
    padding: 0 5px;
    box-sizing: border-box;

    &.strong {
      color: $textColorBlack;
      font-family: "Roboto-Medium";
    }

    &.green {
      color: $colorGreenDark;
      font-family: "Roboto-Medium";
    }

    &.red {
      color: $colorRedDark;
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
  }
}
</style>
