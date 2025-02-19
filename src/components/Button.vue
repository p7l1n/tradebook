<template>
  <div :class="{ isRed, isGreen }" class="ui-button">
    {{ title }}
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isRed: {
      type: Boolean,
      default: false,
    },
    isGreen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.ui-button {
  min-width: 80px;
  width: 100%;
  height: 40px;
  border-radius: $controlRadius;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  background-color: $panelColor;
  color: $textColorWhite;
  font-size: 12px;

  &.isRed {
    background-color: $colorRedDark;
  }

  &.isGreen {
    background-color: $colorGreenDark;
  }

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
}
</style>
