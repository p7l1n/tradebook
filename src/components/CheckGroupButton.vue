<template>
  <div class="check-button">
    <div v-if="label" class="check-button__label">
      {{ label }}
    </div>
    <div class="check-button__selector">
      <div
        v-for="(item, ndx) in items"
        :key="ndx"
        :class="{ active: ndx === activeIndex }"
        class="check-button__selector-item mr-5"
        @click="$emit('check', ndx)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      required: true,
    },
    activeIndex: {
      type: [Number, String],
      default: 0,
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
  width: 250px;

  &__label {
    font-size: 14px;
    color: $textColorGrayDark;
    text-align: left;
    margin-bottom: 5px;
  }

  &__selector {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $controlRadius;
    background-color: $panelColorLight;
    padding: 5px;
    box-sizing: border-box;
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
