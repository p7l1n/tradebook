import { computed } from "vue";
import { useStore } from "vuex";

export default function useStats() {
  const store = useStore();

  const ordersList = computed(() => store.getters["orders/orders"]);

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

  return {
    filteredOrdersList,
  };
}
