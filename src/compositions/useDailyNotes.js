import { computed } from "vue";
import { useStore } from "vuex";

export default function useDailyNotes() {
  const store = useStore();

  const notesList = computed(() => store.getters["dailyNote/notes"]);

  const filteredNotesList = computed(() => {
    return notesList.value;
  });

  return {
    filteredNotesList,
  };
}
