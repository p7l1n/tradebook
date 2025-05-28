import { computed } from "vue";
import { useStore } from "vuex";
import { NOTE_TYPES } from "@/config/noteTypes";

export default function useStats() {
  const store = useStore();

  const ratesList = computed(() => store.getters["rates/rates"]);
  const ordersList = computed(() => store.getters["orders/orders"]);
  const notesList = computed(() => store.getters["note/notes"]);
  const agentList = computed(() => store.getters["agents/notes"]);
  const dailyNotesList = computed(() => store.getters["dailyNote/notes"]);
  const notesWithAgentsList = computed(() =>
    notesList.value.concat(agentList.value)
  );

  const initialStats = computed(
    () => store.getters["settings/organizationBalances"]
  );

  const filterOptions = computed(() => store.getters["orders/filter"]);

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
              (r.outAmount + "").includes(str) ||
              (r.comment + "").includes(str)
          : true;
      })
      .filter((r) =>
        filterOptions.value.showPayed ? true : !r.comment.includes("payed")
      )
      .filter(
        (r) =>
          filterOptions.value.status == null
            ? true
            : filterOptions.value.status === "Исполнено"
            ? r.status == true
            : r.status == false ||
              filterOptions.value.cacheIdsForLayer2Filter.includes(r.id) // поверх не ИСП можно выделять исп и видеть их
      )
      .filter((r) =>
        filterOptions.value.client && filterOptions.value.client.length
          ? filterOptions.value.client.includes(r.client)
          : true
      )
      .filter((r) =>
        filterOptions.value.customNum && filterOptions.value.customNum.length
          ? filterOptions.value.customNum.includes(r.customNum)
          : true
      )
      .filter((r) =>
        filterOptions.value.operator && filterOptions.value.operator.length
          ? filterOptions.value.operator.includes(r.operator)
          : true
      )
      .filter((r) =>
        filterOptions.value.inCurrency && filterOptions.value.inCurrency.length
          ? filterOptions.value.inCurrency.includes(r.inCurrency)
          : true
      )
      .filter((r) =>
        filterOptions.value.outCurrency &&
        filterOptions.value.outCurrency.length
          ? filterOptions.value.outCurrency.includes(r.outCurrency)
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
        totalInCurrencyFACTwu: 0,
        totalInCurrencyStart: +initialStats.value.start[key],
      };
    });

    // calc total
    filteredOrdersList.value.forEach((order) => {
      if (order.status) {
        statsOrders[order.inCurrency].totalInCurrency += +order.kassaAmountIn;
        statsOrders[order.outCurrency].totalInCurrency -= +order.kassaAmountOut;
      } else {
        statsOrders[order.inCurrency].totalInCurrency += 0;
        statsOrders[order.outCurrency].totalInCurrency -= 0;
      }
    });

    // calc DK
    notesWithAgentsList.value.forEach((note) => {
      // with profit
      const amount =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      statsOrders[note.inCurrency].totalInCurrencyDK += amount;

      // without profit
      let amountWithout =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      if (note.isProfit) {
        // amountWithout = 0;
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
          +statsOrders[key].totalInCurrency /
            (+ratesList.value[key]?.sell + +ratesList.value[key]?.spreadSell) ||
          0;

        if (key === "EUR") {
          statsOrders[key].totalInUSDT =
            +statsOrders[key].totalInCurrency *
              (+ratesList.value[key]?.sell +
                +ratesList.value[key]?.spreadSell) || 0;
        }
      } else {
        statsOrders[key].totalInUSDT =
          +statsOrders[key].totalInCurrency /
            (+ratesList.value[key]?.buy - +ratesList.value[key]?.spreadBuy) ||
          0;

        if (key === "EUR") {
          statsOrders[key].totalInUSDT =
            +statsOrders[key].totalInCurrency *
              (+ratesList.value[key]?.buy - +ratesList.value[key]?.spreadBuy) ||
            0;
        }
      }
    });

    // calc in FACTS
    Object.keys(statsOrders).forEach((key) => {
      statsOrders[key].totalInCurrencyFACT =
        +statsOrders[key].totalInCurrencyStart +
        +statsOrders[key].totalInCurrency +
        +statsOrders[key].totalInCurrencyDailyNotes + // тетрадь
        +statsOrders[key].totalInCurrencyDKwithoutProfit;

      // факт юсд + вусд
      if (["USD", "WUSD"].includes(key)) {
        statsOrders[key].totalInCurrencyFACTwu +=
          statsOrders[key].totalInCurrencyFACT;
      }
    });

    return {
      statsOrders,
    };
  });

  // статистика тех которые без галочки
  const allStatsInactive = computed(() => {
    const statsOrders = {};

    // initial set structure
    Object.keys(initialStats.value.start).forEach((key) => {
      statsOrders[key] = {
        totalInCurrency: 0,
        totalInCurrencyDK: 0,
        totalInCurrencyDKwithoutProfit: 0,
        totalInCurrencyDailyNotes: 0,
        totalInCurrencyDKwithProvodka: 0, // сумма ДК только по проводкам неактивных сделок
        totalInCurrencyFACT: 0,
        totalInCurrencyFACT2: 0, // прибавить к факту ДК проводок по неактивным заявкам
        totalInCurrencyStart: +initialStats.value.start[key],
      };
    });

    // calc total
    filteredOrdersList.value.forEach((order) => {
      // и с галочкой и без считаем
      statsOrders[order.inCurrency].totalInCurrency += +order.kassaAmountIn;
      statsOrders[order.outCurrency].totalInCurrency -= +order.kassaAmountOut;
      // if (!order.status) {
      //   statsOrders[order.inCurrency].totalInCurrency += +order.kassaAmountIn;
      //   statsOrders[order.outCurrency].totalInCurrency -= +order.kassaAmountOut;
      // } else {
      //   statsOrders[order.inCurrency].totalInCurrency += 0;
      //   statsOrders[order.outCurrency].totalInCurrency -= 0;
      // }
      if (order.status) {
        notesList.value.forEach((note) => {
          if (
            order.comment.includes("withB") &&
            order.comment === note.comment
          ) {
            const amount =
              note.type === NOTE_TYPES.debit ? note.amount : -note.amount;
            statsOrders[note.inCurrency].totalInCurrencyDKwithProvodka +=
              amount;
          }
        });
      }
    });

    // calc DK
    notesWithAgentsList.value.forEach((note) => {
      // with profit
      const amount =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      statsOrders[note.inCurrency].totalInCurrencyDK += amount;

      // without profit
      let amountWithout =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      if (note.isProfit) {
        // amountWithout = 0;
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
          +statsOrders[key].totalInCurrency /
            (+ratesList.value[key]?.sell + +ratesList.value[key]?.spreadSell) ||
          0;

        if (key === "EUR") {
          statsOrders[key].totalInUSDT =
            +statsOrders[key].totalInCurrency *
              (+ratesList.value[key]?.sell +
                +ratesList.value[key]?.spreadSell) || 0;
        }
      } else {
        statsOrders[key].totalInUSDT =
          +statsOrders[key].totalInCurrency /
            (+ratesList.value[key]?.buy - +ratesList.value[key]?.spreadBuy) ||
          0;

        if (key === "EUR") {
          statsOrders[key].totalInUSDT =
            +statsOrders[key].totalInCurrency *
              (+ratesList.value[key]?.buy - +ratesList.value[key]?.spreadBuy) ||
            0;
        }
      }
    });

    // calc in FACTS
    Object.keys(statsOrders).forEach((key) => {
      statsOrders[key].totalInCurrencyFACT =
        +statsOrders[key].totalInCurrencyStart +
        +statsOrders[key].totalInCurrency +
        +statsOrders[key].totalInCurrencyDailyNotes + // тетрадь
        +statsOrders[key].totalInCurrencyDKwithoutProfit;

      statsOrders[key].totalInCurrencyFACT2 =
        +statsOrders[key].totalInCurrencyFACT +
        +statsOrders[key].totalInCurrencyDKwithProvodka;
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

  const profitUsdtInactive = computed(() => {
    let sum = 0;

    Object.keys(allStatsInactive.value.statsOrders).forEach((key) => {
      sum += allStatsInactive.value.statsOrders[key]?.totalInUSDT || 0;
    });

    return sum;
  });

  return {
    allStats,
    allStatsInactive,
    profitUsdt,
    profitUsdtInactive,
    filteredOrdersList,
  };
}
