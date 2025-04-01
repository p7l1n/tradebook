import { computed, ref } from "vue";
import { useStore } from "vuex";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";
import { CONTRAGENTS } from "@/config/noteTypes";
import { ORDER_TYPES } from "@/config/orderTypes";

export default function useOrders() {
  const store = useStore();
  const activeOperationTypesIndex = ref(0);
  const activeIncurrenciesIndex = ref(0);
  const activeOutcurrenciesIndex = ref(0);
  const selectedOperator = ref("");
  const selectedClient = ref("");
  const amountIn = ref("");
  const rateIn = ref("");

  const inCurrencies = ref(DEFAULT_CURRENCIES);
  const outCurrencies = ref(DEFAULT_CURRENCIES);

  const operationTypes = ref([
    ORDER_TYPES.order,
    ORDER_TYPES.move,
    ORDER_TYPES.trade,
  ]);

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

  const getOrderAPIFormat = (order) => {
    const apiData = { ...order };

    selectedOperator.value = apiData.operator;
    activeOperationTypesIndex.value = operationTypes.value.findIndex(
      (item) => item === apiData.type
    );
    selectedClient.value = apiData.client;
    activeIncurrenciesIndex.value = inCurrencies.value.findIndex(
      (item) => item === apiData.inCurrency
    );
    amountIn.value = apiData.inAmount;
    rateIn.value = apiData.rate;
    activeOutcurrenciesIndex.value = outCurrencies.value.findIndex(
      (item) => item === apiData.outCurrency
    );

    let outAmountValue =
      outCurrencies.value[activeOutcurrenciesIndex.value] === "USDT"
        ? +amountIn.value / +rateIn.value
        : +amountIn.value / +rateIn.value; // *

    if (activeOperationTypesIndex.value == 2) {
      // выручка просто прибыль с 0 расходом
      outAmountValue = 0;
      rateIn.value = 0;
    }

    const operatorId = operatorList.value.find(
      (op) => op.name === selectedOperator.value
    )?.id;
    const clientId = clientsList.value.find(
      (cl) => cl.name === selectedClient.value
    )?.id;

    const newOrderEntity = {
      id: apiData.id,
      date: new Date(apiData.date),
      type: activeOperationTypesIndex.value,
      operatorId,
      clientId,
      inCurrencyId: activeIncurrenciesIndex.value,
      inAmount: amountIn.value,
      rate: rateIn.value,
      outCurrencyId: activeOutcurrenciesIndex.value,
      outAmount: outAmountValue,
      status: apiData.status,
    };

    return newOrderEntity;
  };

  return {
    getOrderAPIFormat,
  };
}
