import { computed } from "vue";
import { useStore } from "vuex";

export default function useDailyNotes() {
  const store = useStore();

  const notesList = computed(() => store.getters["dailyNote/notes"]);
  const filterOptions = computed(() => store.getters["dailyNote/filter"]);

  const getCurrencyFromIndex = (ndx) => {
    if (ndx === 0) return "";
    if (ndx === 1) return "USDT";
    if (ndx === 2) return "RUB";
    if (ndx === 3) return "EUR";
    if (ndx === 4) return "USD";
    if (ndx === 5) return "WUSD";
  };

  const filteredNotesList = computed(() => {
    const inCurrency = getCurrencyFromIndex(filterOptions.value.activeTabIndex);

    return notesList.value.filter((r) => {
      const expressionCurrency = !inCurrency
        ? true
        : r.inCurrency === inCurrency;

      if (filterOptions.value.dateFrom && filterOptions.value.dateTo) {
        return (
          expressionCurrency &&
          +r.date >= +new Date(filterOptions.value.dateFrom) &&
          +r.date < +new Date(filterOptions.value.dateTo) + 86400000
        );
      }
      if (filterOptions.value.dateFrom && !filterOptions.value.dateTo) {
        return (
          expressionCurrency &&
          +r.date >= +new Date(filterOptions.value.dateFrom)
        );
      }

      return expressionCurrency;
    });
  });

  return {
    filteredNotesList,
  };
}
