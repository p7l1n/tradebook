import { computed } from "vue";
import { useStore } from "vuex";

export default function useAgentsNotes() {
  const store = useStore();

  const notesList = computed(() => store.getters["agents/notes"]);
  const filterOptions = computed(() => store.getters["agents/filter"]);

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

  return {
    filteredNotesList,
  };
}
