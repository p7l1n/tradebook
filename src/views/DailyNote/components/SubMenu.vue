<template>
  <div class="sub-menu">
    <div
      class="sub-menu__item"
      v-for="(item, ndx) in menuItems"
      :key="ndx"
      :class="{ active: activeIndex === ndx }"
      @click="$emit('selectMenu', ndx)"
    >
      {{ item }}
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";

export default {
  props: {
    activeIndex: {
      type: [Number, String],
      default: 0,
    },
  },
  setup() {
    const menuItems = ref(["ВСЕ"].concat(DEFAULT_CURRENCIES));

    return {
      menuItems,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.sub-menu {
  background-color: $panelColorLight;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__item {
    width: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: $textColorGrayLight;
    font-size: 13px;

    &:hover {
      cursor: pointer;
    }

    &.active {
      color: $textColorGrayDark;
      background-color: $panelColorActive;
    }
  }
}
</style>
