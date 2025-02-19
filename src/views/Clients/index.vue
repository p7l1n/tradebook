<template>
  <div class="clients-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div
      v-if="activeMenuIndex === 0"
      :class="{ isLoading }"
      class="clients-page__clients"
    >
      <Loader v-if="isLoading" />
      <Clients v-if="!isLoading" class="clients-page__clients-item" />
    </div>
    <!-- clients edit -->
    <div
      v-if="activeMenuIndex === 1"
      :class="{ isLoading }"
      class="clients-page__clients"
    >
      <Loader v-if="isLoading" />
      <Clients
        v-if="!isLoading"
        :edit-mode="true"
        class="clients-page__clients-item"
      />
    </div>
  </div>
</template>
<script>
import SubMenu from "./components/SubMenu";
import Clients from "@/components/widgets/Clients";
import Loader from "@/components/Loader";

import { useStore } from "vuex";

import { onMounted, ref, computed } from "vue";

export default {
  components: {
    SubMenu,
    Clients,
    Loader,
  },
  setup() {
    const store = useStore();
    const activeMenuIndex = ref(0);

    const isLoading = computed(() => store.getters["rates/isLoading"]);

    const onSelectMenu = (ndx) => {
      activeMenuIndex.value = ndx;
    };

    onMounted(async () => {
      await store.dispatch("rates/fetchRates");
    });

    return {
      activeMenuIndex,
      isLoading,
      onSelectMenu,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.clients-page {
  &__clients {
    width: 100%;
    padding: 0 $paddingLarge;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;

    &.isLoading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 120px);
    }
  }

  &__clients-item {
    margin: 20px 0;

    &:first-child {
      margin-right: 20px;
    }
  }
}
</style>
