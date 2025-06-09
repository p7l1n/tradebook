<template>
  <div class="filter-orders">
    <ExportButton
      class="filter-orders__export"
      :collection="filteredOrdersList"
    />
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
          filterable
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
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Номер</div>
        <el-select
          v-model="selectedCustomNum"
          clearable
          filterable
          multiple
          placeholder="Выберите номер"
          style="width: 170px"
          @change="onCustomNumSelect"
        >
          <el-option
            v-for="item in customNumItems"
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
          multiple
          placeholder="Выберите клиента"
          filterable
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
          multiple
          placeholder="Выберите оператора"
          style="width: 170px"
          filterable
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
          multiple
          placeholder="Выберите приход"
          style="width: 170px"
          filterable
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
          multiple
          placeholder="Выберите расход"
          filterable
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
      <div class="filter-orders__item">
        <div class="filter-orders__item-title">Только с посредником</div>
        <el-select
          v-model="selectedWithAgent"
          clearable
          filterable
          placeholder="Да/Нет"
          style="width: 170px"
          @change="onWithAgentSelect"
        >
          <el-option
            v-for="item in agentsItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="filter-orders__section row">
      <div v-if="false" class="cashouted">Касса снята</div>
      <el-button
        v-if="showCashOut"
        type="success"
        :loading="cashOutLoading"
        :disabled="!profitUsdt"
        @click="cashOut(false)"
        class="cashout"
        >Снять кассу {{ toCurrency(profitUsdt) }} USDT</el-button
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
      <div v-if="false" class="filter-orders__item">
        <el-checkbox
          v-model="showPayed"
          label="Показать зеленые"
          border
          @change="onChangePayed"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { ElSelect, ElNotification, ElMessageBox } from "element-plus";
import ExportButton from "@/components/ExportButton";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import useStats from "@/compositions/useStats";
import useNotes from "@/compositions/useNotes";
import { toCurrency, isTodayBetweenDates } from "@/helpers";
import useOrders from "@/compositions/useOrders";
import {
  // NOTE_TYPES,
  NOTE_COMMENT_TYPES,
  CONTRAGENTS,
} from "@/config/noteTypes";

export default {
  setup() {
    const { filteredOrdersList } = useStats();
    const profitUsdt = computed(() => store.getters["noteStats/profitUsdt"]);
    const { getOrderAPIFormat } = useOrders();
    const { isCashOutedToday } = useNotes();
    const store = useStore();
    const selectedDate = ref(null);
    const selectedStatus = ref(null);
    const selectedClient = ref(null);
    const selectedOperator = ref(null);
    const selectedCurrIn = ref(null);
    const selectedCurrOut = ref(null);
    const showStats = ref(null);
    const showPayed = ref(null);
    const searchStr = ref("");
    const currentDate = ref(null);
    const cashOutLoading = ref(false);
    const selectedCustomNum = ref(null);
    const selectedWithAgent = ref(null);

    const filterOptions = computed(() => store.getters["orders/filter"]);
    // const notesList = computed(() => store.getters["note/notes"]);
    const clientsList = computed(() => store.getters["clients/clients"]);

    const startCurrenciesIndexes = computed(
      () => store.getters["stats/startCurrenciesIndexes"]
    );

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

    const agentsItems = computed(() => {
      return ["Да"].map((item) => {
        return {
          title: item,
          value: item,
        };
      });
    });
    const statusItems = computed(() => {
      return ["Исполнено", "Не исполнено"].map((item) => {
        return {
          title: item,
          value: item,
        };
      });
    });

    const clientItems = computed(() => {
      return [...new Set(clientsList.value.map((item) => item.name))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const operatorItems = computed(() => {
      return [...new Set(clientsList.value.map((item) => item.name))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const customNumItems = computed(() => {
      return Array.from({ length: 500 }, (_, i) => i + 1).map((item) => ({
        title: item,
        value: item,
      }));
    });

    const currInItems = computed(() => {
      return ["USDT", "RUB", "USD", "EUR", "WUSD"].map((item) => {
        return {
          title: item,
          value: item,
        };
      });
    });

    const currOutItems = computed(() => {
      return ["USDT", "RUB", "USD", "EUR", "WUSD"].map((item) => {
        return {
          title: item,
          value: item,
        };
      });
    });

    const onWithAgentSelect = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "showAgents",
        value: val,
      });
    };

    const onSelectDate = (val) => {
      store.dispatch("orders/setFilterOption", { key: "from", value: val });
    };

    const onStatusSelect = (val) => {
      // сбросить айди при смене фильтра
      store.dispatch("orders/setFilterOption", {
        key: "cacheIdsForLayer2Filter",
        value: [],
      });
      // установить сам фильтр
      store.dispatch("orders/setFilterOption", { key: "status", value: val });
      // после выбора не исп запомнить оставшихся айди
      if (val === "Не исполнено") {
        const ids = filteredOrdersList.value.map((item) => item.id);
        store.dispatch("orders/setFilterOption", {
          key: "cacheIdsForLayer2Filter",
          value: ids,
        });
      }
    };

    const onCustomNumSelect = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "customNum",
        value: val,
      });
    };

    const onClientSelect = (val) => {
      store.dispatch("orders/setFilterOption", { key: "clientId", value: val });
    };

    const onOperatorSelect = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "operatorId",
        value: val,
      });
    };

    const onCurrInSelect = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "inCurrencyId",
        value: val,
      });
    };

    const onCurrOutSelect = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "outCurrencyId",
        value: val,
      });
    };

    const onChangeStats = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "showStats",
        value: val,
      });
    };

    const onChangePayed = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "showPayed",
        value: val,
      });
    };

    const onSearch = (val) => {
      store.dispatch("orders/setFilterOption", {
        key: "searchStr",
        value: val,
      });
    };

    const operatorList = computed(() =>
      store.getters["clients/clients"].filter(
        (item) => item.type === CONTRAGENTS.operator
      )
    );

    const cashOut = async (confirm = false) => {
      if (!confirm) {
        ElMessageBox.confirm(
          `Подтвердите снятие кассы на сумму ${toCurrency(
            profitUsdt.value
          )} USDT. Продолжить?`,
          "Предупреждение",
          {
            confirmButtonText: "Снять кассу",
            cancelButtonText: "Отменить",
            type: "success",
          }
        )
          .then(() => {
            cashOut(true);
          })
          .catch(() => {});
        return;
      }
      // const id = `${Math.random()}`.slice(2);
      const profitSum = profitUsdt.value;

      const clientId = clientsList.value.find(
        (cl) => cl.type === "Прибыль" && cl.name === "Прибыль"
      )?.id;

      if (!clientId) {
        ElNotification({
          title: "Ошибка снятия",
          message: `Не найден контрагент "Прибыль"`,
          type: "warning",
        });
        return;
      }
      cashOutLoading.value = true;
      const date = Math.floor((+new Date() + 10800000) / 1000);
      // новая запись в таблицу профит
      await store.dispatch("note/addNewProfit", {
        // id,
        date,
        amount: profitSum,
      });
      // дулируем как КРЕДИТ в тетрадь
      const res = await store.dispatch("dailyNote/addNewEntity", {
        // id,
        date,
        type: 1, // NOTE_TYPES.credit,
        clientId,
        inCurrencyId: startCurrenciesIndexes.value["USDT"], // usdt
        amount: profitSum,
        comment: NOTE_COMMENT_TYPES.cashOut,
        category: 1,
        isProfit: true,
      });

      if (res.error) {
        cashOutLoading.value = false;
        return;
      }

      const operatorId = operatorList.value.find(
        (op) => op.name === store.getters["auth/user"]?.sub
      )?.id;

      const clientCashId = clientsList.value.find(
        (cl) => cl.name === "Выручка"
      )?.id;

      const orderCashout = {
        date,
        type: 2,
        operatorId,
        clientId: clientCashId,
        inCurrencyId: startCurrenciesIndexes.value["USDT"],
        inAmount: 0,
        outCurrencyId: startCurrenciesIndexes.value["USDT"],
        outAmount: profitSum,
        rate: 0,
        status: 1,
        comment: `payed${(date - 10800) * 1000}`,
        agentId: 0,
        agentCurrencyId: startCurrenciesIndexes.value["USDT"],
        agentAmount: 0,
        agentRate: 0,
        customComment: "",
        customNum: "",
        metaInfo: "",
      };

      store.dispatch("orders/setStopFetchAll", true); // чтобы после каждого изменения не обновлялось
      const ordersToUpdate = filteredOrdersList.value
        .filter(
          (order) =>
            order.status === true &&
            order.type !== 2 &&
            !order.comment.includes("payed")
        )
        .map((order) => {
          const newOrder = getOrderAPIFormat(order);
          newOrder.comment = `payed${(date - 10800) * 1000}`;
          newOrder.status = 1;
          newOrder.customNum = "";
          return newOrder;
        });

      // Батчинг по 50 заказов
      const batchSize = 50;

      for (let i = 0; i < ordersToUpdate.length; i += batchSize) {
        const batch = ordersToUpdate.slice(i, i + batchSize);

        ElNotification({
          title: "Снятие кассы",
          message: `Обработка ${i + batch.length} из ${
            ordersToUpdate.length
          } сделок`,
          type: "info",
          duration: 2000,
        });

        await Promise.all(
          batch.map((order) =>
            store.dispatch("orders/updateOrderEntity", order)
          )
        );
      }
      store.dispatch("orders/setStopFetchAll", false);
      await store.dispatch("orders/addNewOrderEntity", orderCashout);
      await store.dispatch("orders/fetchOrders");
      cashOutLoading.value = false;
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
        message: `Снятие кассы на сумму ${toCurrency(profitSum)}`,
        type: "success",
      });
    };

    // возможность снятия прибыли
    const showCashOut = computed(() => {
      return filteredOrdersList.value.filter(
        (item) => item.status === true && !item.comment.includes("payed")
      ).length;
    });

    onMounted(() => {
      searchStr.value = filterOptions.value.searchStr;
      selectedClient.value = filterOptions.value.clientId;
      selectedOperator.value = filterOptions.value.operatorId;
      selectedDate.value = filterOptions.value.from;
      selectedCurrIn.value = filterOptions.value.inCurrencyId;
      selectedCurrOut.value = filterOptions.value.outCurrencyId;
      showStats.value = filterOptions.value.showStats;
      showPayed.value = filterOptions.value.showPayed;
      selectedStatus.value = filterOptions.value.status;
      selectedCustomNum.value = filterOptions.value.customNum;
      selectedWithAgent.value = filterOptions.value.showAgents;

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
      selectedCustomNum,
      selectedWithAgent,
      clientItems,
      operatorItems,
      customNumItems,
      currInItems,
      currOutItems,
      agentsItems,
      showStats,
      showPayed,
      showCashOut,
      isCashOutedToday,
      cashOutLoading,
      profitUsdt,
      filteredOrdersList,

      toCurrency,
      disabledDate,
      onSearch,
      onSelectDate,
      onStatusSelect,
      onClientSelect,
      onOperatorSelect,
      onCurrInSelect,
      onCurrOutSelect,
      onWithAgentSelect,
      onChangeStats,
      onChangePayed,
      onCustomNumSelect,
      cashOut,
      isTodayBetweenDates,
    };
  },
  components: {
    ElSelect,
    ExportButton,
  },
};
</script>
<style lang="scss" scoped>
.filter-orders {
  @import "@/assets/styles/_breakpoints.scss";
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  position: relative;

  &__export {
    position: absolute;
    right: 0;
    top: 85px;

    @media (max-width: $breakpoint-tablet) {
      position: static;
      margin-bottom: 15px;
      width: 100%;
    }
  }

  &__section {
    display: flex;
    align-items: center;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 10px;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    @media (max-width: $breakpoint-tablet) {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 10px;
    }

    &:last-child {
      margin-top: 15px;
    }

    .cashout {
      margin-right: 10px;
    }

    .cashouted {
      margin-right: 30px;
      color: $colorRedDark;
      font-family: "Roboto-Medium";
    }

    &.row {
      display: flex;
      align-items: center;

      @media (max-width: $breakpoint-tablet) {
        flex-direction: column;
        align-items: stretch;
        width: 100%;

        .cashout {
          width: 100%;
          margin-right: 0;
          margin-bottom: 10px;
        }

        .filter-orders__item {
          width: 100%;
          margin-right: 0;
          margin-bottom: 10px;

          :deep(.el-checkbox) {
            width: 100%;
            margin-right: 0;
          }
        }
      }
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 12px;
  }

  &__item-title {
    min-height: 19px;
    font-size: 14px;
  }
}
</style>
