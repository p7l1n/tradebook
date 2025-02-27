<template>
  <div class="balance-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <!-- widgets screen инфо -->
    <div
      v-if="activeMenuIndex === 0"
      :class="{ isLoading }"
      class="balance-page__widgets"
    >
      <Loader v-if="isLoading" />
      <TotalInfo
        v-if="!isLoading"
        max-width
        class="balance-page__widgets-item"
      />
      <Rates v-if="!isLoading" class="balance-page__widgets-item" />
    </div>
    <!-- rates edit -->
    <div
      v-if="activeMenuIndex === 1"
      :class="{ isLoading }"
      class="balance-page__widgets"
    >
      <Loader v-if="isLoading" />
      <Rates
        v-if="!isLoading"
        :edit-mode="true"
        class="balance-page__widgets-item"
      />
    </div>
    <!-- edit balances start -->
    <div
      v-if="activeMenuIndex === 2"
      :class="{ isLoading }"
      class="balance-page__widgets"
    >
      <Loader v-if="isLoading" />
      <Balances v-if="!isLoading" class="balance-page__widgets-item" />
    </div>
  </div>
</template>
<script>
import SubMenu from "./components/SubMenu";
import Rates from "@/components/widgets/Rates";
import TotalInfo from "@/components/widgets/TotalInfo";
import Balances from "@/components/widgets/Balances";
import Loader from "@/components/Loader";

import { useStore } from "vuex";

import { onMounted, ref, computed } from "vue";

export default {
  components: {
    SubMenu,
    Rates,
    TotalInfo,
    Balances,
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

.balance-page {
  &__widgets {
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

  &__widgets-item {
    margin: 20px 0;

    &:first-child {
      margin-right: 20px;
    }
  }
}
</style>
