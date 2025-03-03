import { computed } from "vue";
import { useStore } from "vuex";
import { NOTE_TYPES } from "@/config/noteTypes";
import { CONTRAGENTS } from "@/config/noteTypes";

export default function useStatsNotes() {
  const store = useStore();

  const notesList = computed(() =>
    store.getters["note/notes"].filter(
      (item) => item.client !== CONTRAGENTS.profit
    )
  );

  const dailyNotesList = computed(() => store.getters["dailyNote/notes"]);

  const allStats = computed(() => {
    const map = new Map();

    [...notesList.value, ...dailyNotesList.value].forEach(
      ({ client, inCurrency, amount, type }) => {
        if (!map.has(client)) {
          map.set(client, { client, amounts: {} });
        }

        const clientData = map.get(client);
        clientData.amounts[inCurrency] =
          (clientData.amounts[inCurrency] || 0) +
          (NOTE_TYPES.debit === type ? -amount : +amount);
      }
    );

    return Array.from(map.values());
  });

  return {
    allStats,
  };
}
