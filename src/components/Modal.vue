<template>
  <div :style="{ position, marginLeft: `${marginLeft}px` }" class="modal">
    <slot />
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    position: {
      type: String,
      default: "fixed",
    },
    marginLeft: {
      type: String,
      default: "0",
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
  overflow: auto;
}
</style>
