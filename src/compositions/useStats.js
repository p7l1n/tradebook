import { computed } from "vue";
import { useStore } from "vuex";
import { NOTE_TYPES } from "@/config/noteTypes";

export default function useStats() {
  const store = useStore();

  const ratesList = computed(() => store.getters["rates/rates"]);
  const ordersList = computed(() => store.getters["orders/orders"]);
  const notesList = computed(() => store.getters["note/notes"]);
  const dailyNotesList = computed(() => store.getters["dailyNote/notes"]);
  const initialStats = computed(() => store.getters["stats/stats"]);

  const filterOptions = computed(() => store.getters["orders/filter"]);
  // console.log("ratesList", ratesList.value);
  // console.log("ordersList", ordersList.value);
  // console.log("filter", filterOptions.value);

  const filteredOrdersList = computed(() => {
    return ordersList.value
      .filter((r) => {
        const str = filterOptions.value.searchStr.toLowerCase();

        return filterOptions.value.searchStr
          ? (r.id + "").includes(str) ||
              r.client.toLowerCase().includes(str) ||
              r.operator.toLowerCase().includes(str) ||
              r.type.toLowerCase().includes(str) ||
              (r.inAmount + "").includes(str) ||
              (r.outAmount + "").includes(str)
          : true;
      })
      .filter((r) =>
        filterOptions.value.status == null
          ? true
          : filterOptions.value.status === "Исполнено"
          ? r.status == true
          : r.status == false
      )
      .filter((r) =>
        filterOptions.value.client
          ? r.client === filterOptions.value.client
          : true
      )
      .filter((r) =>
        filterOptions.value.operator
          ? r.operator === filterOptions.value.operator
          : true
      )
      .filter((r) =>
        filterOptions.value.inCurrency
          ? r.inCurrency === filterOptions.value.inCurrency
          : true
      )
      .filter((r) =>
        filterOptions.value.outCurrency
          ? r.outCurrency === filterOptions.value.outCurrency
          : true
      )
      .filter((r) =>
        filterOptions.value.date
          ? +r.date >= +new Date(filterOptions.value.date) &&
            +r.date < +new Date(filterOptions.value.date) + 86400000
          : true
      );
  });

  const allStats = computed(() => {
    const statsOrders = {};

    // initial set structure
    Object.keys(initialStats.value.start).forEach((key) => {
      statsOrders[key] = {
        totalInCurrency: 0,
        totalInCurrencyDK: 0,
        totalInCurrencyDKwithoutProfit: 0,
        totalInCurrencyDailyNotes: 0,
        totalInCurrencyFACT: 0,
        totalInCurrencyStart: +initialStats.value.start[key],
      };
    });

    // calc total
    filteredOrdersList.value.forEach((order) => {
      if (order.status) {
        statsOrders[order.inCurrency].totalInCurrency += +order.inAmount;
        statsOrders[order.outCurrency].totalInCurrency -= +order.outAmount;
      } else {
        statsOrders[order.inCurrency].totalInCurrency += 0;
        statsOrders[order.outCurrency].totalInCurrency -= 0;
      }
    });

    // calc DK
    notesList.value.forEach((note) => {
      // with profit
      const amount =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      statsOrders[note.inCurrency].totalInCurrencyDK += amount;

      // without profit
      let amountWithout =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      if (note.isProfit) {
        amountWithout = 0;
      }
      statsOrders[note.inCurrency].totalInCurrencyDKwithoutProfit +=
        amountWithout;
    });

    // calc DAILY NOTES
    dailyNotesList.value.forEach((note) => {
      const amount =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      statsOrders[note.inCurrency].totalInCurrencyDailyNotes += amount;
    });

    // calc in USDT
    Object.keys(statsOrders).forEach((key) => {
      if (key === "USDT") {
        statsOrders[key].totalInUSDT = statsOrders[key].totalInCurrency;
        return;
      }

      if (+statsOrders[key].totalInCurrency > 0) {
        statsOrders[key].totalInUSDT =
          +statsOrders[key].totalInCurrency / +ratesList.value[key]?.sell || 0;
      } else {
        statsOrders[key].totalInUSDT =
          +statsOrders[key].totalInCurrency / +ratesList.value[key]?.buy || 0;
      }
    });

    // calc in FACTS
    Object.keys(statsOrders).forEach((key) => {
      statsOrders[key].totalInCurrencyFACT =
        +statsOrders[key].totalInCurrencyStart +
        +statsOrders[key].totalInCurrency +
        +statsOrders[key].totalInCurrencyDKwithoutProfit;
    });

    return {
      statsOrders,
    };
  });

  const profitUsdt = computed(() => {
    let sum = 0;

    Object.keys(allStats.value.statsOrders).forEach((key) => {
      sum += allStats.value.statsOrders[key]?.totalInUSDT || 0;
    });

    return sum;
  });

  return {
    allStats,
    profitUsdt,
    filteredOrdersList,
  };
}
