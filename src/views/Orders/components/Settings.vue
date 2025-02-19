<template>
  <div class="orders-edit-fields">
    <div class="orders-edit-fields__field">
      <Button title="Настройки полей" @click="$emit('editOrdersFields')" />
    </div>
  </div>
</template>
<script>
import Button from "@/components/Button";

export default {
  components: {
    Button,
  },
  setup() {},
};
</script>
<style lang="scss" scoped>
.orders-edit-fields {
  display: flex;
  justify-content: center;

  &__field {
    min-width: 150px;
    margin-bottom: 20px;
  }
}
</style>
