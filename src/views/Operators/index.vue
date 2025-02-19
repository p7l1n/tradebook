<template>
  <div class="operators-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div
      v-if="activeMenuIndex === 0"
      :class="{ isLoading }"
      class="operators-page__operators"
    >
      <Loader v-if="isLoading" />
      <Operators v-if="!isLoading" class="operators-page__operators-item" />
    </div>
    <!-- operators edit -->
    <div
      v-if="activeMenuIndex === 1"
      :class="{ isLoading }"
      class="operators-page__operators"
    >
      <Loader v-if="isLoading" />
      <operators
        v-if="!isLoading"
        :edit-mode="true"
        class="operators-page__operators-item"
      />
    </div>
  </div>
</template>
<script>
import SubMenu from "./components/SubMenu";
import Operators from "@/components/widgets/Operators";
import Loader from "@/components/Loader";

import { useStore } from "vuex";

import { onMounted, ref, computed } from "vue";

export default {
  components: {
    SubMenu,
    Operators,
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

.operators-page {
  &__operators {
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

  &__operators-item {
    margin: 20px 0;

    &:first-child {
      margin-right: 20px;
    }
  }
}
</style>
