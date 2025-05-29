<template>
  <div class="balance-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <!-- widgets screen инфо -->
    <div
      v-if="activeMenuIndex === 0"
      :class="{ isLoading }"
      class="balance-page__widgets main"
    >
      <Loader v-if="isLoading" />
      <div class="col">
        <TotalInfoShort v-if="!isLoading" style="margin-top: 20px" />
        <RatesShort
          v-if="!isLoading"
          class="balance-page__widgets-item"
          style="margin-top: 20px"
        />
      </div>
      <div class="col">
        <TotalInfoShort
          :is-inactive="true"
          v-if="!isLoading"
          style="margin-top: 20px"
        />
        <RatesStats v-if="!isLoading" style="margin-top: 20px" />
      </div>
      <!-- <TotalInfo
        v-if="!isLoading"
        max-width
        class="balance-page__widgets-item"
      /> -->
    </div>
    <!-- <div
      v-if="activeMenuIndex === 0"
      :class="{ isLoading }"
      class="balance-page__widgets"
    >
      <NotesStats class="balance-page__widgets-item" />
    </div> -->
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
import RatesShort from "@/components/widgets/RatesShort";
import TotalInfoShort from "@/components/widgets/TotalInfoShort";
import Balances from "@/components/widgets/Balances";
// import NotesStats from "@/components/widgets/NotesStats";
import Loader from "@/components/Loader";

import { useStore } from "vuex";

import { onMounted, ref, computed } from "vue";
import RatesStats from "@/components/widgets/RatesStats";

export default {
  components: {
    SubMenu,
    Rates,
    TotalInfoShort,
    Balances,
    Loader,
    RatesShort,
    RatesStats,
    // NotesStats,
  },
  setup() {
    const store = useStore();
    const activeMenuIndex = ref(0);

    const isLoading = computed(() => store.getters["rates/isLoading"]);

    const onSelectMenu = (ndx) => {
      activeMenuIndex.value = ndx;
    };

    onMounted(async () => {
      // await store.dispatch("rates/fetchRates");
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
@import "@/assets/styles/_breakpoints.scss";

$paddingLarge: 24px;
$paddingMedium: 16px;
$paddingSmall: 8px;

.balance-page {
  &__widgets {
    width: 100%;
    min-height: 100vh;
    padding: 0 $paddingLarge;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;

    &.main {
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;

      @media (max-width: $breakpoint-tablet) {
        gap: 0;
      }
    }

    &.isLoading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 120px);
    }

    @media (max-width: $breakpoint-tablet) {
      padding: 0 $paddingMedium;
    }

    @media (max-width: $breakpoint-mobile) {
      padding: 0 $paddingSmall;
    }
  }

  &__widgets-item {
    margin: 20px 0;
    width: 100%;

    @media (max-width: $breakpoint-tablet) {
      margin: 10px 0;
      max-width: 100% !important;
      width: 100% !important;
    }
  }
}

.col {
  display: flex;
  flex-direction: column;
  width: 50%;
  // max-width: 600px;
  &:last-child {
    margin-top: -40px;
  }

  @media (max-width: $breakpoint-tablet) {
    width: 100%;
    max-width: 100%;

    &:last-child {
      margin-top: 0px;
    }
  }
}
</style>
