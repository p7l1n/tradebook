<template>
  <div class="balances-admin">Balances</div>
</template>
<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  setup() {
    const store = useStore();

    const organizationId = computed(
      () => store.getters["settings/organizationId"]
    );
    console.log("organizationId", organizationId.value);
  },
};
</script>
<style lang="scss" scoped></style>
