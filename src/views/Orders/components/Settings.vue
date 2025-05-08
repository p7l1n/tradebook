<template>
  <div class="orders-edit-fields">
    <div class="orders-edit-fields__field">
      <el-button
        style="width: 150px"
        type="success"
        class="base-btn"
        @click="$emit('editOrdersFields')"
      >
        Настройки полей
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  setup() {},
};
</script>
<style lang="scss" scoped>
.orders-edit-fields {
  display: flex;
  flex-direction: column;
  width: 100%;

  .ml-20 {
    margin-left: 20px;
  }

  .control {
    width: 160px;
  }

  &__field {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
