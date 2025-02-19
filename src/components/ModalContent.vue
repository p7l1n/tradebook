<template>
  <div class="modal-content">
    <div class="modal-content__title">{{ title }}</div>
    <div class="modal-content__info">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  setup() {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.modal-content {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-width: 360px;
  border-radius: $borderRadius;
  background-color: $panelColorActive;

  &__title {
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
