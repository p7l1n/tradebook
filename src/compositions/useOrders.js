import { computed, ref } from "vue";
import { useStore } from "vuex";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";
import { CONTRAGENTS } from "@/config/noteTypes";
import { ORDER_TYPES } from "@/config/orderTypes";

export default function useOrders() {
  const store = useStore();
  const activeOperationTypesIndex = ref(0);
  const activeAgentcurrenciesIndex = ref(0);
  const activeIncurrenciesIndex = ref(0);
  const activeOutcurrenciesIndex = ref(0);
  const selectedAgent = ref("");
  const selectedOperator = ref("");
  const selectedClient = ref("");
  const amountIn = ref("");
  const amountOut = ref("");
  const amountAgent = ref("");
  const rateIn = ref("");
  const rateAgent = ref("");

  const inCurrencies = ref(DEFAULT_CURRENCIES);
  const outCurrencies = ref(DEFAULT_CURRENCIES);
  const agentCurrencies = ref(DEFAULT_CURRENCIES);

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
    selectedAgent.value = apiData.agent;
    activeAgentcurrenciesIndex.value = agentCurrencies.value.findIndex(
      (item) => item === apiData.agentCurrency
    );
    amountIn.value = apiData.inAmount;
    amountOut.value = apiData.outAmount;
    amountAgent.value = apiData.agentAmount;
    rateIn.value = apiData.rate;
    rateAgent.value = apiData.agentRate;

    activeOutcurrenciesIndex.value = outCurrencies.value.findIndex(
      (item) => item === apiData.outCurrency
    );

    if (activeOperationTypesIndex.value == 2) {
      // выручка просто прибыль с 0 расходом
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

    const operatorId = operatorList.value.find(
      (op) => op.name === selectedOperator.value
    )?.id;
    const agentId = clientsList.value.find(
      (op) => op.name === selectedAgent.value
    )?.id;
    const clientId = clientsList.value.find(
      (cl) => cl.name === selectedClient.value
    )?.id;

    const newOrderEntity = {
      id: apiData.id,
      date: Math.floor((apiData.date + 10800000) / 1000),
      type: activeOperationTypesIndex.value,
      operatorId,
      clientId,
      comment: "active",

      agentId: agentId || 0,
      agentCurrencyId: activeAgentcurrenciesIndex.value || 0,
      agentAmount: +amountAgent.value || 0,
      agentRate: +rateAgent.value || 0,

      inCurrencyId: activeIncurrenciesIndex.value,
      inAmount: +amountIn.value,
      rate: rateIn.value,
      outCurrencyId: activeOutcurrenciesIndex.value,
      outAmount: +amountOut.value,
      status: apiData.status,
    };

    return newOrderEntity;
  };

  return {
    getOrderAPIFormat,
  };
}
