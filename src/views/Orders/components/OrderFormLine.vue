<template>
  <div class="order-form">
    <div class="order-form__row">
      <div class="order-form__field ml10">
        <CheckGroupButton
          :items="inCurrencies"
          :active-index="activeIncurrenciesIndex"
          @check="onSelectInCurrencies"
        />
      </div>
      <div class="order-form__field ml10">
        <Input
          placeholder="Сумма приход"
          :green="true"
          v-model="amountIn"
          type="number"
          @input="onAmountInChange"
        />
      </div>
      <div class="order-form__field ml10">
        <Input
          placeholder="Курс"
          v-model="rateIn"
          type="number"
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
        <Input
          placeholder="Сумма расход"
          v-model="amountOut"
          red
          type="number"
          @input="onAmountOutChange"
        />
      </div>
      <div v-if="activeOperationTypesIndex != 2" class="order-form__field ml10">
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
          v-if="editOrder"
          type="warning"
          :loading="loadingRemove"
          class="base-btn ml10"
          @click="removeOrder"
        >
          Удалить
        </el-button>
      </div>
      <div class="order-form__field">
        <el-button
          type="success"
          :loading="loading"
          class="base-btn"
          @enter="addNewOrder"
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
</template>
<script>
import Input from "@/components/Input";
import Button from "@/components/Button";
import CheckGroupButton from "@/components/CheckGroupButton";
import { ORDER_TYPES } from "@/config/orderTypes";
import { CONTRAGENTS } from "@/config/noteTypes";
import {
  DEFAULT_CURRENCIES,
  DEFAULT_CURRENCIES_SHORT,
} from "@/config/defaultCurrencies";

import { useStore } from "vuex";
import { onMounted, ref, computed } from "vue";
import { getNumFormat } from "@/helpers";

import { ElSelect } from "element-plus";
import { ElNotification } from "element-plus";

export default {
  components: {
    Input,
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
    const operationTypes = ref([
      ORDER_TYPES.order,
      ORDER_TYPES.move,
      ORDER_TYPES.trade,
    ]);
    const activeOperationTypesIndex = ref(0);
    const activeIncurrenciesIndex = ref(0);
    const activeOutcurrenciesIndex = ref(0);

    const inCurrencies = ref(DEFAULT_CURRENCIES);
    const outCurrencies = ref(DEFAULT_CURRENCIES);

    const amountIn = ref("");
    const amountOut = ref("");
    const rateIn = ref("");

    const loadingRemove = ref(false);
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
      return [...new Set(clientsList.value.map((item) => item.name))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const onSelectOperationType = (ndx) => {
      activeOperationTypesIndex.value = ndx;
    };

    const onSelectInCurrencies = (ndx) => {
      activeIncurrenciesIndex.value = ndx;
    };

    const onSelectOutCurrencies = (ndx) => {
      activeOutcurrenciesIndex.value = ndx;
    };

    const onOperatorSelect = (val) => {
      selectedOperator.value = val;
    };

    const onClientSelect = (val) => {
      selectedClient.value = val;
    };

    const clearForm = () => {
      activeOperationTypesIndex.value = 0;
      activeIncurrenciesIndex.value = 0;
      activeOutcurrenciesIndex.value = 0;
      selectedClient.value = null;
      selectedOperator.value = defaultContragent.value;
      amountIn.value = "";
      amountOut.value = "";
      rateIn.value = "";
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
      }

      const operatorId = operatorList.value.find(
        (op) => op.name === selectedOperator.value
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

      // edit
      if (props.editOrder) {
        const newOrderEntity = {
          id: props.editOrder.id,
          date: props.editOrder.date,
          type: activeOperationTypesIndex.value, // operationTypes.value[activeOperationTypesIndex.value],
          operatorId, // : selectedOperator.value,
          clientId, // selectedClient.value,
          inCurrencyId: activeIncurrenciesIndex.value, // inCurrencies.value[activeIncurrenciesIndex.value],
          inAmount: +amountIn.value,
          rate: rateIn.value,
          outCurrencyId: activeOutcurrenciesIndex.value, // outCurrencies.value[activeOutcurrenciesIndex.value],
          outAmount: +amountOut.value,
          status: props.editOrder.status,
        };
        loading.value = true;
        await store.dispatch("orders/updateOrderEntity", newOrderEntity);
        loading.value = false;
        clearForm();
        emit("close");
        return;
      }

      // add new

      const newOrderEntity = {
        // id: `${Math.random()}`.slice(2),
        date: Math.floor((+new Date() + 10800000) / 1000),
        comment: "active",
        type: activeOperationTypesIndex.value, // operationTypes.value[activeOperationTypesIndex.value],
        operatorId, // selectedOperator.value,
        clientId, // selectedClient.value,
        inCurrencyId: activeIncurrenciesIndex.value, // inCurrencies.value[activeIncurrenciesIndex.value],
        inAmount: +amountIn.value,
        rate: rateIn.value,
        outCurrencyId: activeOutcurrenciesIndex.value, // outCurrencies.value[activeOutcurrenciesIndex.value],
        outAmount: +amountOut.value,
        status: 0,
      };
      loading.value = true;
      await store.dispatch("orders/addNewOrderEntity", newOrderEntity);
      loading.value = false;
      clearForm();
      emit("close");
    };

    const removeOrder = async () => {
      loadingRemove.value = true;
      await store.dispatch("orders/removeOrderEntity", props.editOrder);
      loadingRemove.value = false;
      emit("close");
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
      setTimeout(() => {
        if (
          !amountIn.value ||
          (amountIn.value && amountOut.value && rateIn.value)
        ) {
          rateIn.value = "";
        }
        calcValues();
      }, 100);
    };
    const onAmountOutChange = () => {
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
          amountOut.value = "";
        }
        calcValues();
      }, 100);
    };

    onMounted(() => {
      if (props.editOrder) {
        selectedOperator.value = props.editOrder.operator;
        activeOperationTypesIndex.value = operationTypes.value.findIndex(
          (item) => item === props.editOrder.type
        );
        selectedClient.value = props.editOrder.client;
        activeIncurrenciesIndex.value = inCurrencies.value.findIndex(
          (item) => item === props.editOrder.inCurrency
        );
        amountIn.value = props.editOrder.inAmount;
        amountOut.value = props.editOrder.outAmount;
        rateIn.value = props.editOrder.rate;
        activeOutcurrenciesIndex.value = outCurrencies.value.findIndex(
          (item) => item === props.editOrder.outCurrency
        );
      }
    });

    return {
      operationTypes,
      activeOperationTypesIndex,
      activeIncurrenciesIndex,
      activeOutcurrenciesIndex,
      inCurrencies,
      outCurrencies,
      amountIn,
      amountOut,
      rateIn,
      selectedOperator,
      selectedClient,
      operatorItems,
      clientItems,
      loading,
      loadingRemove,
      onSelectOperationType,
      onSelectInCurrencies,
      onSelectOutCurrencies,
      onOperatorSelect,
      onClientSelect,
      clearForm,
      addNewOrder,
      removeOrder,
      onAmountInChange,
      onAmountOutChange,
      onRateChange,
    };
  },
};
</script>
<style lang="scss" scoped>
.order-form {
  background-color: $panelColorActive;
  padding: 10px;
  border-radius: $controlRadius;
  display: flex;
  flex-direction: column;

  .ml10 {
    margin-left: 10px;
  }

  .ml43 {
    margin-left: 43px;
  }

  &__row {
    display: flex;
    align-items: center;
  }

  &__field {
    margin-bottom: 15px;
  }
}
</style>
