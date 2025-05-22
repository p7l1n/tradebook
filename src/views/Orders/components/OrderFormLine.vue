<template>
  <div class="order-form" tabindex="0" @keydown.enter="addNewOrder">
    <div class="order-form__main">
      <div class="order-form__row">
        <div class="order-form__field ml10">
          <CheckGroupButton
            :items="inCurrencies"
            :active-index="activeIncurrenciesIndex"
            @check="onSelectInCurrencies"
          />
        </div>
        <div class="order-form__field ml10">
          <el-input
            placeholder="Сумма приход"
            v-model="amountIn"
            :formatter="numberFormatter"
            :parser="numberParser"
            class="base-input green"
            @input="onAmountInChange"
          />
        </div>
        <div class="order-form__field ml10">
          <el-input
            placeholder="Курс"
            v-model="rateIn"
            :formatter="numberFormatter"
            :parser="numberParser"
            class="base-input"
            @input="onRateChange"
          />
        </div>
        <div class="order-form__field ml43">
          <CheckGroupButton
            :items="operationTypes"
            :active-index="activeOperationTypesIndex"
            @check="onSelectOperationType"
          />
        </div>
      </div>
      <div class="order-form__row">
        <div class="order-form__field ml10">
          <CheckGroupButton
            :items="outCurrencies"
            :active-index="activeOutcurrenciesIndex"
            @check="onSelectOutCurrencies"
          />
        </div>
        <div class="order-form__field ml10">
          <el-input
            placeholder="Сумма расход"
            v-model="amountOut"
            :formatter="numberFormatter"
            :parser="numberParser"
            class="base-input red"
            @input="onAmountOutChange"
          />
        </div>
        <div
          v-if="activeOperationTypesIndex != 2"
          class="order-form__field ml10"
        >
          <el-select
            v-model="selectedClient"
            clearable
            filterable
            placeholder="Выберите клиента"
            style="width: 100%"
            size="large"
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
        <div v-if="false" class="order-form__field ml10">
          <el-select
            v-model="selectedOperator"
            clearable
            filterable
            placeholder="Выберите оператора"
            style="width: 100%"
            size="large"
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
        <div class="order-form__field ml10">
          <el-button
            type="success"
            :loading="loading"
            class="base-btn"
            @click="addNewOrder"
          >
            {{ editOrder ? "Сохранить" : "Добавить" }}
          </el-button>
        </div>
        <div class="order-form__field ml10">
          <Button title="Очистить" @click="clearForm" />
        </div>
      </div>
    </div>
    <div class="order-form__agent">
      <div class="order-form__field mb0 row">
        <el-select
          v-model="selectedAgent"
          clearable
          filterable
          placeholder="Посредник"
          style="width: 100%"
          size="large"
          @change="onAgentSelect"
        >
          <el-option
            v-for="item in clientItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <Button
          title="Очистить"
          @click="clearFormAgent"
          class="ml10"
          style="height: 36px"
        />
      </div>
      <div class="order-form__field mb0" style="width: 100%">
        <CheckGroupButton
          :items="agentCurrencies"
          :active-index="activeAgentcurrenciesIndex"
          @check="onSelectAgentCurrencies"
        />
      </div>
      <div class="row">
        <div class="order-form__field mb0">
          <el-input
            placeholder="Сумма"
            v-model="amountAgent"
            :formatter="numberFormatter"
            :parser="numberParser"
            :class="{
              green: activeAgentcurrenciesIndex === activeIncurrenciesIndex,
              red: activeAgentcurrenciesIndex === activeOutcurrenciesIndex,
            }"
            class="base-input"
            @input="onAmountAgentChange"
          />
        </div>
        <div class="order-form__field mb0 ml10">
          <el-input
            placeholder="Курс"
            v-model="rateAgent"
            :formatter="numberFormatter"
            :parser="numberParser"
            class="base-input"
            @input="onRateAgentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Button from "@/components/Button";
import CheckGroupButton from "@/components/CheckGroupButton";
import { ORDER_TYPES } from "@/config/orderTypes";
import { CONTRAGENTS } from "@/config/noteTypes";
import {
  DEFAULT_CURRENCIES,
  DEFAULT_CURRENCIES_SHORT,
} from "@/config/defaultCurrencies";

import { useStore } from "vuex";
import { ref, computed } from "vue";
import { getNumFormat } from "@/helpers";

import { ElSelect } from "element-plus";
import { ElNotification } from "element-plus";
import { numberFormatter, numberParser } from "@/formatters";
import { filterWithOutSystem } from "@/filters";

export default {
  components: {
    Button,
    CheckGroupButton,
    ElSelect,
  },
  props: {
    editOrder: {
      type: [null, Object],
      default: null,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const selectedOperator = ref(null);
    const selectedClient = ref(null);
    const selectedAgent = ref(null);
    const operationTypes = ref([
      ORDER_TYPES.order,
      ORDER_TYPES.move,
      ORDER_TYPES.trade,
    ]);
    const lastInputMode = ref("");
    const activeOperationTypesIndex = ref(0);
    const activeAgentcurrenciesIndex = ref(0);
    const activeIncurrenciesIndex = ref(0);
    const activeOutcurrenciesIndex = ref(0);

    const agentCurrencies = ref(DEFAULT_CURRENCIES);
    const inCurrencies = ref(DEFAULT_CURRENCIES);
    const outCurrencies = ref(DEFAULT_CURRENCIES);

    const amountIn = ref("");
    const amountOut = ref("");
    const amountAgent = ref("");
    const rateAgent = ref("");
    const rateIn = ref("");

    const loading = ref(false);

    const defaultContragent = computed(() => store.getters["auth/user"]?.sub);
    selectedOperator.value = defaultContragent.value;

    const operatorList = computed(() =>
      store.getters["clients/clients"].filter(
        (item) => item.type === CONTRAGENTS.operator
      )
    );
    const clientsList = computed(() =>
      store.getters["clients/clients"].filter(
        (item) => item.type !== CONTRAGENTS.profit
      )
    );
    const operatorItems = computed(() => {
      return [...new Set(operatorList.value.map((item) => item.name))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const clientItems = computed(() => {
      return [
        ...new Set(
          clientsList.value.filter(filterWithOutSystem).map((item) => item.name)
        ),
      ].map((item) => {
        return {
          title: item,
          value: item,
        };
      });
    });

    const onSelectOperationType = (ndx) => {
      activeOperationTypesIndex.value = ndx;
    };

    const onSelectInCurrencies = (ndx) => {
      activeIncurrenciesIndex.value = ndx;
      // при переключении табов пересчитывать все
      const rate = rateIn.value;
      rateIn.value = "";
      onRateChange();
      rateIn.value = rate;
      onRateChange();
    };

    const onSelectOutCurrencies = (ndx) => {
      activeOutcurrenciesIndex.value = ndx;
      // при переключении табов пересчитывать все
      const rate = rateIn.value;
      rateIn.value = "";
      onRateChange();
      rateIn.value = rate;
      onRateChange();
    };

    const onSelectAgentCurrencies = (ndx) => {
      if (
        activeIncurrenciesIndex.value !== ndx &&
        activeOutcurrenciesIndex.value !== ndx
      ) {
        ElNotification({
          title: "Журнал сделок",
          message: `Валюта посредника не совпадает с валютами сделки`,
          type: "warning",
        });
        return;
      }
      activeAgentcurrenciesIndex.value = ndx;
    };

    const onOperatorSelect = (val) => {
      selectedOperator.value = val;
    };

    const onClientSelect = (val) => {
      selectedClient.value = val;
    };

    const onAgentSelect = (val) => {
      selectedAgent.value = val;
    };

    const clearForm = () => {
      activeAgentcurrenciesIndex.value = 0;
      selectedAgent.value = null;
      activeOperationTypesIndex.value = 0;
      activeIncurrenciesIndex.value = 0;
      activeOutcurrenciesIndex.value = 0;
      selectedClient.value = null;
      selectedOperator.value = defaultContragent.value;
      amountIn.value = "";
      amountOut.value = "";
      amountAgent.value = "";
      rateAgent.value = "";
      rateIn.value = "";
    };

    const clearFormAgent = () => {
      amountAgent.value = "";
      rateAgent.value = "";
      amountAgent.value = "";
      activeAgentcurrenciesIndex.value = 0;
    };

    const addNewOrder = async () => {
      if (activeOperationTypesIndex.value !== 2) {
        // в выручке проверка на наличие курса не нужна
        if (!amountIn.value || !rateIn.value || !selectedClient.value) {
          ElNotification({
            title: "Журнал сделок",
            message: `Проверьте введенные данные`,
            type: "warning",
          });
          return;
        }

        if (rateAgent.value || amountAgent.value || selectedAgent.value) {
          if (!rateAgent.value || !amountAgent.value || !selectedAgent.value) {
            ElNotification({
              title: "Журнал сделок",
              message: `Не все данные по посреднику заполнены`,
              type: "warning",
            });
            return;
          }
        }
      }

      const operatorId = operatorList.value.find(
        (op) => op.name === selectedOperator.value
      )?.id;
      const agentId = clientsList.value.find(
        (op) => op.name === selectedAgent.value
      )?.id;
      let clientId = clientsList.value.find(
        (cl) => cl.name === selectedClient.value
      )?.id;

      if (activeOperationTypesIndex.value == 2) {
        // выручка просто прибыль с 0 расходом
        clientId = clientsList.value.find((cl) => cl.name === "Выручка")?.id;

        if (!amountIn.value) {
          amountIn.value = 0;
        }
        if (!amountOut.value) {
          amountOut.value = 0;
        }
        if (!rateIn.value) {
          rateIn.value = 0;
        }
      }

      // add new

      const newOrderEntity = {
        // id: `${Math.random()}`.slice(2),
        date: Math.floor((+new Date() + 10800000) / 1000),
        comment: "active",
        type: activeOperationTypesIndex.value, // operationTypes.value[activeOperationTypesIndex.value],
        operatorId, // selectedOperator.value,
        clientId, // selectedClient.value,
        agentId: agentId || 0,
        agentCurrencyId: activeAgentcurrenciesIndex.value || 0,
        agentAmount: amountAgent.value || 0,
        agentRate: rateAgent.value || 0,
        inCurrencyId: activeIncurrenciesIndex.value, // inCurrencies.value[activeIncurrenciesIndex.value],
        inAmount: +amountIn.value,
        rate: rateIn.value,
        outCurrencyId: activeOutcurrenciesIndex.value, // outCurrencies.value[activeOutcurrenciesIndex.value],
        outAmount: +amountOut.value,
        status: 0,
        customComment: "",
        customNum: "",
        metaInfo: "",
      };
      loading.value = true;
      await store.dispatch("orders/addNewOrderEntity", newOrderEntity);
      loading.value = false;
      clearForm();
      emit("close");
    };

    const calcValuesCustom = (amountIn, amountOut, rateIn) => {
      let rate = "";
      let amIn = "";
      let amOut = "";
      const myCurrency =
        DEFAULT_CURRENCIES_SHORT[activeOutcurrenciesIndex.value];
      const yourCurrency =
        DEFAULT_CURRENCIES_SHORT[activeIncurrenciesIndex.value];

      if (myCurrency === "р" || myCurrency === "т") {
        if (amountIn && amountOut) {
          rate = getNumFormat(amountOut / amountIn, 4);
        }
        if (amountIn && !amountOut && rateIn) {
          amOut = getNumFormat(rateIn * amountIn, 4);
        }
        if (amountOut && !amountIn && rateIn) {
          amIn = getNumFormat(amountOut / rateIn, 4);
        }
      } else {
        if (amountIn && amountOut) {
          rate = getNumFormat(amountIn / amountOut, 4);
        }
        if (amountIn && !amountOut && rateIn) {
          amOut = getNumFormat(amountIn / rateIn, 4);
        }
        if (amountOut && !amountIn && rateIn) {
          amIn = getNumFormat(amountOut * rateIn, 4);
        }
      }
      if (myCurrency === "т" && yourCurrency === "р") {
        if (amountIn && amountOut) {
          rate = getNumFormat(amountIn / amountOut, 4);
        }
        if (amountIn && !amountOut && rateIn) {
          amOut = getNumFormat(amountIn / rateIn, 4);
        }
        if (amountOut && !amountIn && rateIn) {
          amIn = getNumFormat(amountOut * rateIn, 4);
        }
      }

      if (myCurrency === "т" && yourCurrency === "е") {
        if (amountIn && amountOut) {
          rate = getNumFormat(amountOut / amountIn, 4);
        }
        if (amountIn && !amountOut && rateIn) {
          amOut = getNumFormat(amountIn * rateIn, 4);
        }
        if (amountOut && !amountIn && rateIn) {
          amIn = getNumFormat(amountOut / rateIn, 4);
        }
      }
      if (
        myCurrency === "т" &&
        (yourCurrency === "б" || yourCurrency === "д")
      ) {
        if (amountIn && amountOut) {
          rate = getNumFormat(amountIn / amountOut, 4);
        }
        if (amountIn && !amountOut && rateIn) {
          amOut = getNumFormat(amountIn / rateIn, 4);
        }
        if (amountOut && !amountIn && rateIn) {
          amIn = getNumFormat(amountOut * rateIn, 4);
        }
      }
      if ((myCurrency === "б" || myCurrency === "д") && yourCurrency === "т") {
        if (amountIn && amountOut) {
          rate = getNumFormat(amountOut / amountIn, 4);
        }
        if (amountIn && !amountOut && rateIn) {
          amOut = getNumFormat(amountIn * rateIn, 4);
        }
        if (amountOut && !amountIn && rateIn) {
          amIn = getNumFormat(amountOut / rateIn, 4);
        }
      }

      return {
        rate: rate || rateIn,
        amIn: amIn || amountIn,
        amOut: amOut || amountOut,
      };
    };

    const calcValues = () => {
      let rate = "";
      let amIn = "";
      let amOut = "";
      const myCurrency =
        DEFAULT_CURRENCIES_SHORT[activeOutcurrenciesIndex.value];
      const yourCurrency =
        DEFAULT_CURRENCIES_SHORT[activeIncurrenciesIndex.value];

      if (myCurrency === "р" || myCurrency === "т") {
        if (amountIn.value && amountOut.value) {
          rate = getNumFormat(amountOut.value / amountIn.value, 4);
        }
        if (amountIn.value && !amountOut.value && rateIn.value) {
          amOut = getNumFormat(rateIn.value * amountIn.value, 4);
        }
        if (amountOut.value && !amountIn.value && rateIn.value) {
          amIn = getNumFormat(amountOut.value / rateIn.value, 4);
        }
      } else {
        if (amountIn.value && amountOut.value) {
          rate = getNumFormat(amountIn.value / amountOut.value, 4);
        }
        if (amountIn.value && !amountOut.value && rateIn.value) {
          amOut = getNumFormat(amountIn.value / rateIn.value, 4);
        }
        if (amountOut.value && !amountIn.value && rateIn.value) {
          amIn = getNumFormat(amountOut.value * rateIn.value, 4);
        }
      }
      if (myCurrency === "т" && yourCurrency === "р") {
        if (amountIn.value && amountOut.value) {
          rate = getNumFormat(amountIn.value / amountOut.value, 4);
        }
        if (amountIn.value && !amountOut.value && rateIn.value) {
          amOut = getNumFormat(amountIn.value / rateIn.value, 4);
        }
        if (amountOut.value && !amountIn.value && rateIn.value) {
          amIn = getNumFormat(amountOut.value * rateIn.value, 4);
        }
      }

      if (myCurrency === "т" && yourCurrency === "е") {
        if (amountIn.value && amountOut.value) {
          rate = getNumFormat(amountOut.value / amountIn.value, 4);
        }
        if (amountIn.value && !amountOut.value && rateIn.value) {
          amOut = getNumFormat(amountIn.value * rateIn.value, 4);
        }
        if (amountOut.value && !amountIn.value && rateIn.value) {
          amIn = getNumFormat(amountOut.value / rateIn.value, 4);
        }
      }
      if (
        myCurrency === "т" &&
        (yourCurrency === "б" || yourCurrency === "д")
      ) {
        if (amountIn.value && amountOut.value) {
          rate = getNumFormat(amountIn.value / amountOut.value, 4);
        }
        if (amountIn.value && !amountOut.value && rateIn.value) {
          amOut = getNumFormat(amountIn.value / rateIn.value, 4);
        }
        if (amountOut.value && !amountIn.value && rateIn.value) {
          amIn = getNumFormat(amountOut.value * rateIn.value, 4);
        }
      }
      if ((myCurrency === "б" || myCurrency === "д") && yourCurrency === "т") {
        if (amountIn.value && amountOut.value) {
          rate = getNumFormat(amountOut.value / amountIn.value, 4);
        }
        if (amountIn.value && !amountOut.value && rateIn.value) {
          amOut = getNumFormat(amountIn.value * rateIn.value, 4);
        }
        if (amountOut.value && !amountIn.value && rateIn.value) {
          amIn = getNumFormat(amountOut.value / rateIn.value, 4);
        }
      }

      if (rate) {
        rateIn.value = rate;
      }
      if (amIn) {
        amountIn.value = amIn;
      }
      if (amOut) {
        amountOut.value = amOut;
      }
    };

    const onAmountInChange = () => {
      lastInputMode.value = "in";
      setTimeout(() => {
        if (
          !amountIn.value ||
          (amountIn.value && amountOut.value && rateIn.value)
        ) {
          amountOut.value = "";
          // rateIn.value = "";
        }
        calcValues();
      }, 100);
    };
    const onAmountOutChange = () => {
      lastInputMode.value = "out";
      setTimeout(() => {
        if (
          !amountOut.value ||
          (amountIn.value && amountOut.value && rateIn.value)
        ) {
          rateIn.value = "";
        }
        calcValues();
      }, 100);
    };
    const onRateChange = () => {
      setTimeout(() => {
        if (
          !rateIn.value ||
          (amountIn.value && amountOut.value && rateIn.value)
        ) {
          if (lastInputMode.value === "out") {
            amountIn.value = "";
          } else {
            amountOut.value = "";
          }
        }
        calcValues();
      }, 100);
    };

    const onAmountAgentChange = () => {
      let result = {};
      rateAgent.value = "";

      if (activeAgentcurrenciesIndex.value === activeIncurrenciesIndex.value) {
        result = calcValuesCustom(
          +amountIn.value - +amountAgent.value,
          amountOut.value
        );
      }
      if (activeAgentcurrenciesIndex.value === activeOutcurrenciesIndex.value) {
        result = calcValuesCustom(
          amountIn.value,
          +amountOut.value + +amountAgent.value
        );
      }
      rateAgent.value = result.rate;
    };

    const onRateAgentChange = () => {
      let result = {};
      amountAgent.value = "";

      if (activeAgentcurrenciesIndex.value === activeIncurrenciesIndex.value) {
        result = calcValuesCustom("", amountOut.value, rateAgent.value);
        amountAgent.value = (+amountIn.value - +result.amIn).toFixed(4);
      }
      if (activeAgentcurrenciesIndex.value === activeOutcurrenciesIndex.value) {
        result = calcValuesCustom(+amountIn.value, "", rateAgent.value);
        amountAgent.value = (+result.amOut - +amountOut.value).toFixed(4);
      }
    };

    return {
      operationTypes,
      activeOperationTypesIndex,
      activeAgentcurrenciesIndex,
      activeIncurrenciesIndex,
      activeOutcurrenciesIndex,
      agentCurrencies,
      inCurrencies,
      outCurrencies,
      amountIn,
      amountOut,
      amountAgent,
      rateAgent,
      rateIn,
      selectedOperator,
      selectedClient,
      selectedAgent,
      operatorItems,
      clientItems,
      loading,
      numberFormatter,
      numberParser,
      clearFormAgent,
      onSelectOperationType,
      onSelectInCurrencies,
      onSelectOutCurrencies,
      onSelectAgentCurrencies,
      onOperatorSelect,
      onClientSelect,
      onAgentSelect,
      clearForm,
      addNewOrder,
      onAmountInChange,
      onAmountOutChange,
      onRateChange,
      onAmountAgentChange,
      onRateAgentChange,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/breakpoints";

.order-form {
  position: relative;
  background-color: $panelColorActive;
  padding: 10px;
  border-radius: $controlRadius;
  display: flex;
  flex-direction: column;

  &__main {
    display: flex;
    flex-direction: column;
  }

  &__agent {
    position: absolute;
    right: 45px;
    top: -7px;
    width: 300px;
    padding: 10px;
    border-radius: $controlRadius;
    // border: 1px solid rgba(255, 255, 255, 0.1);

    @media (max-width: 1335px) {
      position: static;
      width: 100%;
      margin: 0;
      padding: 0;
      border: none;
    }
  }

  .ml10 {
    margin-left: 10px;

    @media (max-width: $breakpoint-tablet) {
      margin-left: 0;
    }
  }

  .ml43 {
    margin-left: 43px;

    @media (max-width: $breakpoint-tablet) {
      margin-left: 0;
    }
  }

  &__row {
    display: flex;
    align-items: center;

    @media (max-width: $breakpoint-tablet) {
      flex-wrap: wrap;
      gap: 10px;
    }

    @media (max-width: $breakpoint-mobile) {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }
  }

  .row {
    display: flex;
    align-items: center;

    .ml10 {
      width: 120px;
    }

    @media (max-width: $breakpoint-mobile) {
      flex-direction: column;
      align-items: stretch;
      gap: 0;

      .ml10 {
        margin: 5px 0;
        width: 100%;
      }
    }
  }

  &__field {
    margin-bottom: 15px;

    @media (max-width: $breakpoint-tablet) {
      margin-right: 0;
    }

    @media (max-width: $breakpoint-mobile) {
      margin-right: 0;
      width: 100%;
    }

    &.mb0 {
      margin-bottom: 1px;
    }
  }
}
</style>
