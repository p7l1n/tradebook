<template>
  <div :class="{ maxWidth }" class="widget-total">
    <div class="widget-total__title">
      {{ isAgents ? "Посредники" : "Статистика (ТЕТРАДЬ + ЖУРНАЛ ДК)" }}
    </div>
    <div class="widget-total__list">
      <div class="widget-total__list-item">
        <div class="widget-total__list-item-field long label"></div>
        <div class="widget-total__list-item-field label">USDT</div>
        <div class="widget-total__list-item-field label">RUB</div>
        <div class="widget-total__list-item-field label">USD</div>
        <div class="widget-total__list-item-field label">EUR</div>
        <div class="widget-total__list-item-field label">WUSD</div>
      </div>
      <div
        class="widget-total__list-item"
        v-for="item in statsList"
        :key="item.client"
      >
        <div class="widget-total__list-item-field long strong">
          {{ checkVinny(item.client) }}
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
        <el-button
          type="warning"
          class="base-btn"
          style="margin-left: 10px; width: 80px; height: 24px"
          @click="reCalculate(item)"
        >
          Расчет
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
// import { computed } from "vue";
// import { useStore } from "vuex";
import useStatsNotes from "@/compositions/useStatsNotes";
import { toCurrency } from "@/helpers";
import { sortByKey } from "@/helpers";
import { computed } from "vue";
import { useStore } from "vuex";
import { checkVinny } from "@/helpers";
import { ElNotification } from "element-plus";
import { DEFAULT_CURRENCIES_SHORT_MAP } from "@/config/defaultCurrencies";
export default {
  props: {
    maxWidth: {
      type: Boolean,
      default: false,
    },
    isAgents: {
      type: Boolean,
      default: false,
    },
    searchStr: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const store = useStore();
    const { allStats, allStatsAgents } = useStatsNotes();
    const contragents = computed(() => store.getters["clients/clients"]);

    const statsList = computed(() => {
      const list = props.isAgents ? allStatsAgents.value : allStats.value;

      const filteredList = !props.searchStr.length
        ? list
        : list.filter((item) =>
            item.client.toLowerCase().includes(props.searchStr.toLowerCase())
          );
      return sortByKey(
        filteredList.filter((item) =>
          Object.values(item.amounts).some((value) => value != 0)
        ),
        "client"
      );
    });

    const reCalculate = (item) => {
      const clientId = contragents.value.find(
        (c) => c.name === item.client
      )?.id;
      if (!clientId) {
        ElNotification({
          title: "Ошибка",
          message: "Контрагент не найден",
          type: "error",
        });
      }
      Object.keys(item.amounts).forEach(async (key) => {
        const inCurrencyId = DEFAULT_CURRENCIES_SHORT_MAP[key];
        const type = item.amounts[key] > 0 ? 0 : 1;
        const amount = Math.abs(item.amounts[key]);
        const date = Math.floor((+new Date() + 10800000) / 1000);

        const note = {
          date,
          clientId,
          inCurrencyId,
          type,
          amount,
          category: 1,
          comment: `расчет`,
          isProfit: false,
        };
        await store.dispatch("dailyNote/addNewEntity", note);
      });
      ElNotification({
        title: "Сводка",
        message: "Расчет успешно произведен",
        type: "success",
      });
    };

    return {
      statsList,
      toCurrency,
      checkVinny,
      reCalculate,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";
@import "@/assets/styles/breakpoints.scss";

.widget-total {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: $panelColorLight;
  position: relative;
  overflow-x: auto;
  min-width: 0;

  &.maxWidth {
    width: 100%;
  }

  &__title {
    position: sticky;
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
    height: auto;
    min-width: min-content;
  }

  &__list-item {
    display: flex;
    align-items: center;
    min-width: min-content;
  }

  &__list-item-field {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 40px;
    flex-shrink: 0;

    &.long {
      width: 250px;
    }

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

  @media (max-width: $breakpoint-mobile) {
    border-radius: 0;
    width: 100%;
    overflow-x: auto;
  }
}
</style>
