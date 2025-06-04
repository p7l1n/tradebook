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

  // const initialStats = computed(
  //   () => store.getters["settings/organizationBalances"]
  // );
  const initialStats = computed(() => store.getters["stats/stats"]);

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
        filterOptions.value.showAgents == null
          ? true
          : filterOptions.value.showAgents === "Да"
          ? r.agentId > 0
          : false
      )
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
      );
  });

  const allStats = computed(() => {
    const statsOrders = {}; // создаем пустой обьект для хранения статистики

    // проходим по всем валютам из начальной статистики, формат такой
    // {RUB: 10000, USD: 10000, EUR: 10000, USDT: 10000, WUSD: 10000}
    Object.keys(initialStats.value.start).forEach((key) => {
      statsOrders[key] = {
        totalInCurrency: 0,
        totalInCurrencyDK: 0,
        totalInCurrencyDailyNotes: 0,
        totalInCurrencyFACT: 0,
        totalInCurrencyFACTwu: 0,
        totalInCurrencyStart: +initialStats.value.start[key],
      };
    });
    // после создания пустой структуры, получаем такой формат для каждой валюты
    // {RUB: {totalInCurrency: 0, totalInCurrencyDK: 0, totalInCurrencyDailyNotes: 0, totalInCurrencyFACT: 0, totalInCurrencyFACTwu: 0, totalInCurrencyStart: 10000}, USD: {totalInCurrency: 0, totalInCurrencyDK: 0, totalInCurrencyDailyNotes: 0, totalInCurrencyFACT: 0, totalInCurrencyFACTwu: 0, totalInCurrencyStart: 10000}, EUR: {totalInCurrency: 0, totalInCurrencyDK: 0, totalInCurrencyDailyNotes: 0, totalInCurrencyFACT: 0, totalInCurrencyFACTwu: 0, totalInCurrencyStart: 10000}, USDT: {totalInCurrency: 0, totalInCurrencyDK: 0, totalInCurrencyDailyNotes: 0, totalInCurrencyFACT: 0, totalInCurrencyFACTwu: 0, totalInCurrencyStart: 10000}, WUSD: {totalInCurrency: 0, totalInCurrencyDK: 0, totalInCurrencyDailyNotes: 0, totalInCurrencyFACT: 0, totalInCurrencyFACTwu: 0, totalInCurrencyStart: 10000}}

    // calc total
    // в этом цикле проходим по всем заявкам и плюсуем в totalInCurrency и приход и расход по валютам
    // также проверяем статус заявки (status), если галочка стоит то прибавляем в totalInCurrency эмаунты по ней, если нет то прибавляем 0
    filteredOrdersList.value.forEach((order) => {
      if (order.status) {
        // при подсчете сумм заявок, необходимо учесть заявки с посредниками
        // если посредник не указан, оставляем суммы заявок как есть
        statsOrders[order.inCurrency].totalInCurrency += +order.kassaAmountIn;
        statsOrders[order.outCurrency].totalInCurrency -= +order.kassaAmountOut;
      } else {
        statsOrders[order.inCurrency].totalInCurrency += 0;
        statsOrders[order.outCurrency].totalInCurrency -= 0;
      }
    });
    // на этом этапе мы посчитали первый показатель totalInCurrency для каждой валюты по всем заявкам

    // calc DK
    // теперь делаем обход по Notes (ДК + Агенты) category 1,2 и прибавляем в totalInCurrencyDK суммы по валютам
    // учитываем тип записи (дебет или кредит)
    notesWithAgentsList.value.forEach((note) => {
      // with profit
      const amount =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      statsOrders[note.inCurrency].totalInCurrencyDK += amount;
    });
    // на этом этапе мы посчитали второй показатель totalInCurrencyDK для каждой валюты по всем Notes (ДК + Агенты)

    // calc DAILY NOTES
    // теперь делаем обход по Daily Notes (тетрадь) category 0и прибавляем в totalInCurrencyDailyNotes суммы по валютам
    // учитываем тип записи (дебет или кредит)
    dailyNotesList.value.forEach((note) => {
      const amount =
        note.type === NOTE_TYPES.debit ? -note.amount : +note.amount;
      statsOrders[note.inCurrency].totalInCurrencyDailyNotes += amount;
    });
    // на этом этапе мы посчитали третий показатель totalInCurrencyDailyNotes для каждой валюты по всем Daily Notes (тетрадь)

    // теперь у нас посчитаны все три показателя для каждой валюты (заявки, ДК+агенты, тетрадь)
    // теперь считаем totalInUSDT (прибыль в USDT) для каждой валюты
    // calc in USDT

    Object.keys(statsOrders).forEach((key) => {
      // проход по всей структуре statsOrders со всеми посчитанными валютами
      if (key === "USDT") {
        // если валюта USDT, то присваиваем totalInUSDT = totalInCurrency 1 к 1
        statsOrders[key].totalInUSDT = statsOrders[key].totalInCurrency;
        return;
      }
      // считаем прибыль в USDT для каждой валюты учитывая общий курс из ratesList, у меня там формат такой
      // это курсы не заявки, а общие курсы кассы
      // если сумма по заявкам плюсовая используем курс продажи sell, если минусовая то курс покупки buy
      // {
      //   "id": 22,
      //   "title": "EUR",
      //   "buy": 1.14,
      //   "sell": 1.16,
      //   "spreadBuy": 0,
      //   "spreadSell": 0,
      if (+statsOrders[key].totalInCurrency > 0) {
        // если сумма по заявкам в валюте больше 0
        // считаем прибыль в USDT для валюты по формуле totalInCurrency / (sell + spreadSell)
        statsOrders[key].totalInUSDT =
          +statsOrders[key].totalInCurrency /
            (+ratesList.value[key]?.sell + +ratesList.value[key]?.spreadSell) ||
          0;

        // для евро считаем по формуле totalInCurrency * (sell + spreadSell)
        if (key === "EUR") {
          statsOrders[key].totalInUSDT =
            +statsOrders[key].totalInCurrency *
              (+ratesList.value[key]?.sell +
                +ratesList.value[key]?.spreadSell) || 0;
        }
      } else {
        // если сумма по заявкам в валюте минусовая, то считаем по формуле totalInCurrency / (buy - spreadBuy)
        statsOrders[key].totalInUSDT =
          +statsOrders[key].totalInCurrency /
            (+ratesList.value[key]?.buy - +ratesList.value[key]?.spreadBuy) ||
          0;

        // для евро считаем по формуле totalInCurrency * (buy - spreadBuy)
        if (key === "EUR") {
          statsOrders[key].totalInUSDT =
            +statsOrders[key].totalInCurrency *
              (+ratesList.value[key]?.buy - +ratesList.value[key]?.spreadBuy) ||
            0;
        }
      }
    });

    // calc in FACTS
    // теперь считаем totalInCurrencyFACT (ФАКТ) для каждой валюты
    // сюда прибавляем каждый посчитанный показатель по валюте
    Object.keys(statsOrders).forEach((key) => {
      statsOrders[key].totalInCurrencyFACT = // факт =
        +statsOrders[key].totalInCurrencyStart + // начальные суммы
        +statsOrders[key].totalInCurrency + // суммы по заявкам
        +statsOrders[key].totalInCurrencyDailyNotes + // тетрадь
        +statsOrders[key].totalInCurrencyDK; // дк + посредники

      // факт юсд + вусд
      if (["USD", "WUSD"].includes(key)) {
        // ФАКТ U+W последний показатель, в него запихиваем факт по USD + факт по WUSD
        statsOrders[key].totalInCurrencyFACTwu +=
          statsOrders[key].totalInCurrencyFACT;
      }
    });

    // также отдельно нужно посчитать добавляем в факт по структуре сумму в USDT
    // Object.keys(allStats.value.statsOrders).forEach((key) => {
    //   sum += allStats.value.statsOrders[key]?.totalInUSDT || 0;
    // });

    return {
      statsOrders, // возвращаем структуру statsOrders с посчитанными показателями
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
        +statsOrders[key].totalInCurrencyDK;

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
  console.log(allStats.value);
  return {
    allStats,
    allStatsInactive,
    profitUsdt,
    profitUsdtInactive,
    filteredOrdersList,
  };
}
