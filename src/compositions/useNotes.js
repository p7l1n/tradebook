import { computed } from "vue";
import { useStore } from "vuex";
import { isTodayBetweenDates } from "@/helpers";

export default function useNotes() {
  const store = useStore();

  const notesList = computed(() => store.getters["note/notes"]);
  const profitHistory = computed(() => store.getters["note/profitHistory"]);

  const filteredNotesList = computed(() => {
    return notesList.value;
  });

  const filteredProfitHistory = computed(() => {
    return profitHistory.value;
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
