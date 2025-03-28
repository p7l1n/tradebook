<template>
  <div class="filter-orders">
    <div class="filter-orders__section">
      <!-- search -->
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Поиск</div>
        <el-input
          v-model="searchStr"
          style="width: 170px"
          placeholder="Поиск по журналу"
          clearable
          @input="onSearch"
        />
      </div>
      <!-- day -->
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Опер. день</div>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="Выберите день"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
          style="width: 170px"
          @change="onSelectDate"
        />
      </div>
      <!-- status checked -->
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Исп/Не исп</div>
        <el-select
          v-model="selectedStatus"
          clearable
          placeholder="Выберите статус"
          style="width: 170px"
          @change="onStatusSelect"
        >
          <el-option
            v-for="item in statusItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- client -->
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Клиент</div>
        <el-select
          v-model="selectedClient"
          clearable
          placeholder="Выберите клиента"
          style="width: 170px"
          @change="onClientSelect"
        >
          <el-option
            v-for="item in clientItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- operator -->
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Оператор</div>
        <el-select
          v-model="selectedOperator"
          clearable
          placeholder="Выберите оператора"
          style="width: 170px"
          @change="onOperatorSelect"
        >
          <el-option
            v-for="item in operatorItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- curr in -->
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Приход</div>
        <el-select
          v-model="selectedCurrIn"
          clearable
          placeholder="Выберите приход"
          style="width: 170px"
          @change="onCurrInSelect"
        >
          <el-option
            v-for="item in currInItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- curr out -->
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Расход</div>
        <el-select
          v-model="selectedCurrOut"
          clearable
          placeholder="Выберите расход"
          style="width: 170px"
          @change="onCurrOutSelect"
        >
          <el-option
            v-for="item in currOutItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="filter-orders__section row">
      <div v-if="isCashOutedToday" class="cashouted">Касса снята</div>
      <el-button
        v-if="showCashOut"
        type="success"
        @click="cashOut"
        class="cashout"
        >Снять кассу</el-button
      >
      <!-- options -->
      <div class="filter-orders__item">
        <el-checkbox
          v-model="showStats"
          label="Показать балансы"
          border
          @change="onChangeStats"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { ElSelect, ElNotification } from "element-plus";

import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import useStats from "@/compositions/useStats";
import useNotes from "@/compositions/useNotes";
import { toCurrency, isTodayBetweenDates } from "@/helpers";
import {
  NOTE_TYPES,
  NOTE_COMMENT_TYPES,
  // CONTRAGENTS,
} from "@/config/noteTypes";

export default {
  setup() {
    const { profitUsdt } = useStats();
    const { isCashOutedToday } = useNotes();
    const store = useStore();
    const selectedDate = ref(null);
    const selectedStatus = ref(null);
    const selectedClient = ref(null);
    const selectedOperator = ref(null);
    const selectedCurrIn = ref(null);
    const selectedCurrOut = ref(null);
    const showStats = ref(null);
    const searchStr = ref("");
    const currentDate = ref(null);

    const ordersList = computed(() => store.getters["orders/orders"]);
    const filterOptions = computed(() => store.getters["orders/filter"]);
    const notesList = computed(() => store.getters["note/notes"]);

    const disabledDate = (time) => {
      return time.getTime() > Date.now();
    };

    const shortcuts = ref([
      {
        text: "Сегодня",
        value: new Date(),
      },
      {
        text: "Вчера",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        },
      },
      {
        text: "Нед. назад",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          return date;
        },
      },
    ]);

    const statusItems = computed(() => {
      return ["Исполнено", "Не исполнено"].map((item) => {
        return {
          title: item,
          value: item,
        };
      });
    });

    const clientItems = computed(() => {
      return [...new Set(ordersList.value.map((item) => item.client))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const operatorItems = computed(() => {
      return [...new Set(ordersList.value.map((item) => item.operator))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const currInItems = computed(() => {
      return [...new Set(ordersList.value.map((item) => item.inCurrency))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const currOutItems = computed(() => {
      return [...new Set(ordersList.value.map((item) => item.outCurrency))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const onSelectDate = (val) => {
      store.dispatch("orders/setFilterOption", { key: "date", value: val });
    };

    const onStatusSelect = (val) => {
      store.dispatch("orders/setFilterOption", { key: "status", value: val });
    };

    const onClientSelect = (val) => {
      store.dispatch("orders/setFilterOption", { key: "client", value: val });
    };

    const onOperatorSelect = (val) => {
      store.dispatch("orders/setFilterOption", { key: "operator", value: val });
    };

    const onCurrInSelect = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "inCurrency",
        value: val,
      });
    };

    const onCurrOutSelect = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "outCurrency",
        value: val,
      });
    };

    const onChangeStats = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "showStats",
        value: val,
      });
    };

    const onSearch = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "searchStr",
        value: val,
      });
    };

    const cashOut = () => {
      const id = `${Math.random()}`.slice(2);
      const date = +new Date();
      // новая запись в таблицу профит
      store.dispatch("note/addNewProfit", {
        id,
        date,
        amount: profitUsdt.value,
      });
      // дулируем как КРЕДИТ в тетрадь
      store.dispatch("note/addNewEntity", {
        id,
        date,
        type: NOTE_TYPES.credit,
        client: "Прибыль",
        inCurrency: "USDT",
        amount: profitUsdt.value,
        comment: NOTE_COMMENT_TYPES.cashOut,
        isProfit: true,
      });
      // const newOrderEntity = {
      //   id,
      //   date: +new Date(),
      //   type: NOTE_TYPES.credit,
      //   operator: "-",
      //   client: CONTRAGENTS.profit,
      //   inCurrency: "USDT",
      //   inAmount: 0,
      //   rate: 0,
      //   outCurrency: "USDT",
      //   outAmount: profitUsdt.value,
      // };
      // store.dispatch("orders/addNewOrderEntity", newOrderEntity);
      // делаем расход на эту сумму в ЮСДТ в журнал

      ElNotification({
        title: "Успешно",
        message: `Снятие кассы на сумму ${toCurrency(profitUsdt.value)}`,
        type: "success",
      });
    };

    // возможность снятия прибыли
    const showCashOut = computed(() => {
      const localFilter = { ...filterOptions.value };
      delete localFilter.date; // удаляем поля которые не нужны в фильтре для проверки пустого
      delete localFilter.showStats;

      // проверяем что фильтр скинут чтобы не попало ничего кроме сегодняшнего дня
      const isNotClearFilter = Object.keys(localFilter).some((filterKey) => {
        return !!localFilter[filterKey];
      });

      if (!selectedDate.value) return; // если дата не выбрана не показываем

      // проверяем что выбрана в фильтре только сегодняшняя дата и равна сегодняшнему дню и фильтр пуст
      return (
        !isNotClearFilter && // фильтр пуст
        isTodayBetweenDates(currentDate.value, selectedDate.value) && // сегодняшний день
        !notesList.value.find((note) => {
          return (
            note.comment === NOTE_COMMENT_TYPES.cashOut &&
            isTodayBetweenDates(selectedDate.value, note.date)
          );
        })
      );
    });

    onMounted(() => {
      searchStr.value = filterOptions.value.searchStr;
      selectedClient.value = filterOptions.value.client;
      selectedOperator.value = filterOptions.value.operator;
      selectedDate.value = filterOptions.value.date;
      selectedCurrIn.value = filterOptions.value.inCurrency;
      selectedCurrOut.value = filterOptions.value.outCurrency;
      showStats.value = filterOptions.value.showStats;

      currentDate.value = new Date();
    });

    return {
      shortcuts,

      searchStr,
      selectedDate,
      statusItems,
      selectedStatus,
      selectedClient,
      selectedOperator,
      selectedCurrIn,
      selectedCurrOut,

      clientItems,
      operatorItems,
      currInItems,
      currOutItems,
      showStats,
      showCashOut,
      isCashOutedToday,

      disabledDate,
      onSearch,
      onSelectDate,
      onStatusSelect,
      onClientSelect,
      onOperatorSelect,
      onCurrInSelect,
      onCurrOutSelect,
      onChangeStats,
      cashOut,
      isTodayBetweenDates,
    };
  },
  components: {
    ElSelect,
  },
};
</script>
<style lang="scss" scoped>
.filter-orders {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  &__section {
    display: flex;
    align-items: center;

    &:last-child {
      margin-top: 15px;
    }

    .cashout {
      margin-right: 10px;
    }

    .cashouted {
      margin-right: 30px;
      color: $colorRedDark;
      font-weight: bold;
    }

    &.row {
      display: flex;
      align-items: center;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 15px;
  }

  &__item-title {
    min-height: 19px;
    font-size: 14px;
  }
}
</style>
