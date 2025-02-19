<template>
  <div class="check-button">
    <div class="check-button__label">
      {{ label }}
    </div>
    <div class="check-button__selector">
      <div
        :class="{ active: checked }"
        class="check-button__selector-item mr-5"
        @click="$emit('check', true)"
      >
        {{ yesTitle }}
      </div>
      <div
        :class="{ active: !checked }"
        class="check-button__selector-item"
        @click="$emit('check', false)"
      >
        {{ noTitle }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    yesTitle: {
      type: String,
      default: "",
    },
    noTitle: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.check-button {
  display: flex;
  flex-direction: column;
  width: 200px;

  &__label {
    font-size: 14px;
    color: $textColorGrayDark;
    text-align: left;
  }

  &__selector {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $controlRadius;
    background-color: $panelColorLight;
    padding: 5px;
    box-sizing: border-box;
    margin-top: 5px;
  }

  &__selector-item {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    border-radius: $controlRadius;
    color: $textColorGrayDark;

    &.mr-5 {
      margin-right: 5px;
    }

    &:hover {
      cursor: pointer;
      background-color: $panelColorActive;
    }

    &.active {
      background-color: $panelColorSecondary;
      color: $textColorWhite;
    }
  }
}
</style>
