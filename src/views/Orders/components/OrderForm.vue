<template>
  <div class="order-form">
    <div class="order-form__field">
      <CheckGroupButton
        label="Тип операции"
        :items="operationTypes"
        :active-index="activeOperationTypesIndex"
        @check="onSelectOperationType"
      />
    </div>
    <div class="order-form__field">
      <CheckGroupButton
        label="Приход (валюта)"
        :items="inCurrencies"
        :active-index="activeIncurrenciesIndex"
        @check="onSelectInCurrencies"
      />
    </div>
    <div class="order-form__field">
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
    <div class="order-form__field">
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
    <div class="order-form__field">
      <Input placeholder="Сумма" v-model="amountIn" type="number" />
    </div>
    <div v-if="activeOperationTypesIndex != 2" class="order-form__field">
      <Input placeholder="Курс" v-model="rateIn" type="number" />
    </div>
    <div v-if="activeOperationTypesIndex != 2" class="order-form__field">
      <CheckGroupButton
        label="расход (валюта)"
        :items="outCurrencies"
        :active-index="activeOutcurrenciesIndex"
        @check="onSelectOutCurrencies"
      />
    </div>
    <div class="order-form__btns">
      <Button title="Очистить" @click="clearForm" />
      <Button
        v-if="editOrder"
        title="Удалить"
        :is-red="true"
        class="ml10"
        @click="removeOrder"
      />
      <Button
        :title="editOrder ? 'Сохранить' : 'Добавить'"
        class="ml10"
        @click="addNewOrder"
      />
    </div>
  </div>
</template>
<script>
import Input from "@/components/Input";
import Button from "@/components/Button";
import CheckGroupButton from "@/components/CheckGroupButton";
import { ORDER_TYPES } from "@/config/orderTypes";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";

import { useStore } from "vuex";
import { onMounted, ref, computed } from "vue";

import { ElSelect } from "element-plus";

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
    tradeInitialParam: {
      type: String,
      default: "",
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
    const rateIn = ref("");

    const operatorList = computed(() => store.getters["operators/operators"]);
    const clientsList = computed(() => store.getters["clients/clients"]);
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
      selectedOperator.value = null;
      amountIn.value = "";
      rateIn.value = "";
    };

    const addNewOrder = () => {
      if (!selectedClient.value || !amountIn.value) return;

      if (activeOperationTypesIndex.value !== 2) {
        // в выручке проверка на наличие курса не нужна
        if (!rateIn.value) {
          return;
        }
      }

      let outAmountValue =
        outCurrencies.value[activeOutcurrenciesIndex.value] === "USDT"
          ? +amountIn.value / +rateIn.value
          : +amountIn.value * +rateIn.value;

      if (activeOperationTypesIndex.value == 2) {
        // выручка просто прибыль с 0 расходом
        outAmountValue = 0;
        rateIn.value = 0;
      }

      // edit
      if (props.editOrder) {
        const newOrderEntity = {
          id: props.editOrder.id,
          date: props.editOrder.date,
          type: operationTypes.value[activeOperationTypesIndex.value],
          operator: selectedOperator.value,
          client: selectedClient.value,
          inCurrency: inCurrencies.value[activeIncurrenciesIndex.value],
          inAmount: amountIn.value,
          rate: rateIn.value,
          outCurrency: outCurrencies.value[activeOutcurrenciesIndex.value],
          outAmount: outAmountValue,
          status: props.editOrder.status,
        };
        store.dispatch("orders/updateOrderEntity", newOrderEntity);
        clearForm();
        emit("close");
        return;
      }

      // add new

      const newOrderEntity = {
        id: `${Math.random()}`.slice(2),
        date: +new Date(),
        type: operationTypes.value[activeOperationTypesIndex.value],
        operator: selectedOperator.value,
        client: selectedClient.value,
        inCurrency: inCurrencies.value[activeIncurrenciesIndex.value],
        inAmount: amountIn.value,
        rate: rateIn.value,
        outCurrency: outCurrencies.value[activeOutcurrenciesIndex.value],
        outAmount: outAmountValue,
        status: true,
      };

      store.dispatch("orders/addNewOrderEntity", newOrderEntity);
      clearForm();
      emit("close");
    };

    const removeOrder = () => {
      store.dispatch("orders/removeOrderEntity", props.editOrder);
      emit("close");
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
        rateIn.value = props.editOrder.rate;
        activeOutcurrenciesIndex.value = outCurrencies.value.findIndex(
          (item) => item === props.editOrder.outCurrency
        );
      } else {
        // ["USDT", "RUB", "USD", "EUR", "WUSD"] from config queue fixed
        if (props.tradeInitialParam === "buyUSDT")
          activeIncurrenciesIndex.value = 0;
        if (props.tradeInitialParam === "sellUSDT")
          activeOutcurrenciesIndex.value = 0;

        if (props.tradeInitialParam === "buyUSD")
          activeIncurrenciesIndex.value = 2;
        if (props.tradeInitialParam === "sellUSD")
          activeOutcurrenciesIndex.value = 2;

        if (props.tradeInitialParam === "buyEUR")
          activeIncurrenciesIndex.value = 3;
        if (props.tradeInitialParam === "sellEUR")
          activeOutcurrenciesIndex.value = 3;

        if (props.tradeInitialParam === "buyWUSD")
          activeIncurrenciesIndex.value = 4;
        if (props.tradeInitialParam === "sellWUSD")
          activeOutcurrenciesIndex.value = 4;
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
      rateIn,
      selectedOperator,
      selectedClient,
      operatorItems,
      clientItems,
      onSelectOperationType,
      onSelectInCurrencies,
      onSelectOutCurrencies,
      onOperatorSelect,
      onClientSelect,
      clearForm,
      addNewOrder,
      removeOrder,
    };
  },
};
</script>
<style lang="scss" scoped>
.order-form {
  display: flex;
  flex-direction: column;

  &__field {
    margin-bottom: 15px;
  }

  &__btns {
    border-top: 1px solid #000;
    padding: 10px 0;
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;

    .ml10 {
      margin-left: 10px;
    }
  }
}
</style>
