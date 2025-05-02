<template>
  <div class="widget-rates-wrap">
    <div class="widget-rates">
      <div class="widget-rates__title">Курс валют</div>
      <div class="widget-rates__list">
        <div class="widget-rates__list-item">
          <div class="widget-rates__list-item-field strong"></div>
          <div class="widget-rates__list-item-field strong">RUB</div>
          <div class="widget-rates__list-item-field strong">USD</div>
          <div class="widget-rates__list-item-field strong">EUR</div>
          <div class="widget-rates__list-item-field strong">WUSD</div>
          <div class="widget-rates__list-item-field strong">USDT</div>
        </div>
        <!-- строка покупка -->
        <div class="widget-rates__list-item">
          <div class="widget-rates__list-item-field label">Покупка</div>
          <div class="widget-rates__list-item-field green">
            {{
              getNumFormat(
                +ratesList["RUB"].buy - +ratesList["RUB"].spreadBuy || 0,
                ratesList["RUB"].points
              )
            }}
          </div>
          <div class="widget-rates__list-item-field green">
            {{
              getNumFormat(
                +ratesList["USD"].buy - +ratesList["USD"].spreadBuy || 0,
                ratesList["USD"].points
              )
            }}
          </div>
          <div class="widget-rates__list-item-field green">
            {{
              getNumFormat(
                +ratesList["EUR"].buy - +ratesList["EUR"].spreadBuy || 0,
                ratesList["EUR"].points
              )
            }}
          </div>
          <div class="widget-rates__list-item-field green">
            {{
              getNumFormat(
                +ratesList["WUSD"].buy - +ratesList["WUSD"].spreadBuy || 0,
                ratesList["WUSD"].points
              )
            }}
          </div>
          <div class="widget-rates__list-item-field green">
            {{
              getNumFormat(
                +ratesList["USDT"].buy - +ratesList["USDT"].spreadBuy || 0,
                ratesList["USDT"].points
              )
            }}
          </div>
        </div>
        <!-- строка продажа -->
        <div class="widget-rates__list-item">
          <div class="widget-rates__list-item-field label">Продажа</div>
          <div class="widget-rates__list-item-field red">
            {{
              getNumFormat(
                +ratesList["RUB"].sell - +ratesList["RUB"].spreadSell || 0,
                ratesList["RUB"].points
              )
            }}
          </div>
          <div class="widget-rates__list-item-field red">
            {{
              getNumFormat(
                +ratesList["USD"].sell - +ratesList["USD"].spreadSell || 0,
                ratesList["USD"].points
              )
            }}
          </div>
          <div class="widget-rates__list-item-field red">
            {{
              getNumFormat(
                +ratesList["EUR"].sell - +ratesList["EUR"].spreadSell || 0,
                ratesList["EUR"].points
              )
            }}
          </div>
          <div class="widget-rates__list-item-field red">
            {{
              getNumFormat(
                +ratesList["WUSD"].sell - +ratesList["WUSD"].spreadSell || 0,
                ratesList["WUSD"].points
              )
            }}
          </div>
          <div class="widget-rates__list-item-field red">
            {{
              getNumFormat(
                +ratesList["USDT"].sell - +ratesList["USDT"].spreadSell || 0,
                ratesList["USDT"].points
              )
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";

import { getNumFormat } from "@/helpers";
import { numberFormatter, numberParser } from "@/formatters";

export default {
  components: {},
  setup() {
    const store = useStore();
    const ratesList = computed(() => store.getters["rates/rates"]);

    return {
      ratesList,
      getNumFormat,

      numberFormatter,
      numberParser,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-rates-wrap {
  display: flex;
  flex-direction: column;
  position: relative;
}

.widget-rates-controls {
  position: absolute;
  left: 480px;
  top: 0;
}

.widget-rates {
  padding: $paddingSmall;
  border-radius: $borderRadius;
  background-color: $panelColorLight;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

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

    &.active {
      background-color: $colorRowGrayActive;
      border-radius: $controlRadius;

      .widget-rates__list-item-field {
        &:nth-child(even) {
          background-color: initial;
        }
      }
    }

    &.editMode {
      &:hover {
        cursor: pointer;
      }
    }
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

  // edit
  &__edit-form {
    width: 400px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    padding: $paddingSmall;
    border-radius: $borderRadius;
    background-color: $panelColorLight;

    .input-field {
      margin-bottom: 15px;

      &.row {
        display: flex;
        align-items: center;

        .mr15 {
          margin-right: 15px;
        }
      }
    }
  }
}

.mt15 {
  margin-top: 5px;
}
</style>
