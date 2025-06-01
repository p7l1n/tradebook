import { computed } from "vue";
import { useStore } from "vuex";

export default function useAgentsNotes() {
  const store = useStore();

  const notesList = computed(() => store.getters["agents/notes"]);

  const filteredNotesList = computed(() => {
    return notesList.value;
  });

  return {
    filteredNotesList,
  };
}
