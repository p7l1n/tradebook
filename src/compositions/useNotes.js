import { computed } from "vue";
import { useStore } from "vuex";
import { isTodayBetweenDates } from "@/helpers";

export default function useNotes() {
  const store = useStore();

  const notesList = computed(() => store.getters["note/notes"]);
  const profitHistory = computed(() => store.getters["note/profitHistory"]);
  const filterOptions = computed(() => store.getters["note/filter"]);

  const filteredNotesList = computed(() => {
    return notesList.value.filter((r) => {
      if (filterOptions.value.dateFrom && filterOptions.value.dateTo) {
        return (
          +r.date >= +new Date(filterOptions.value.dateFrom) &&
          +r.date < +new Date(filterOptions.value.dateTo) + 86400000
        );
      }
      if (filterOptions.value.dateFrom && !filterOptions.value.dateTo) {
        return +r.date >= +new Date(filterOptions.value.dateFrom);
      }
      return true;
    });
  });

  const filteredProfitHistory = computed(() => {
    return profitHistory.value.filter((r) => {
      if (filterOptions.value.dateFrom && filterOptions.value.dateTo) {
        return (
          +r.date >= +new Date(filterOptions.value.dateFrom) &&
          +r.date < +new Date(filterOptions.value.dateTo) + 86400000
        );
      }
      if (filterOptions.value.dateFrom && !filterOptions.value.dateTo) {
        return +r.date >= +new Date(filterOptions.value.dateFrom);
      }
      return true;
    });
  });

  const isCashOutedToday = computed(() => {
    return !!profitHistory.value.find((r) =>
      isTodayBetweenDates(new Date(), r.date)
    );
  });

  const profitUsdtHistory = computed(() => {
    return filteredProfitHistory.value.reduce((next, item) => {
      return next + item.amount;
    }, 0);
  });

  return {
    filteredNotesList,
    filteredProfitHistory,
    profitUsdtHistory,

    //
    isCashOutedToday,
  };
}
