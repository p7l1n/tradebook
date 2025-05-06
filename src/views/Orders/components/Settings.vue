<template>
  <div class="orders-edit-fields">
    <div class="orders-edit-fields__field">
      <Button
        title="Настройки полей"
        @click="$emit('editOrdersFields')"
        class="control"
      />
    </div>
    <div class="orders-edit-fields__field">
      <div class="numeric">
        <Button
          title="Установить номерацию с"
          @click="resetNumeric"
          class="control"
        />
        <el-input
          placeholder="Номерация 0"
          v-model="num"
          class="control base-input ml-20"
        />
        <div class="numeric__current">Последний номер: {{ currentNum }}</div>
        <div class="numeric__current">
          Последняя заявка ID: {{ lastOrderNum }}
        </div>
      </div>
    </div>
    <div class="orders-edit-fields__field">
      <Button
        title="Сбросить коллекции номераций"
        @click="resetVirtualNums"
        class="control"
      />
    </div>
  </div>
</template>
<script>
import Button from "@/components/Button";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import { ElNotification } from "element-plus";

export default {
  components: {
    Button,
  },
  setup() {
    const store = useStore();
    const num = ref(0);

    const currentNum = computed(() => store.getters["orders/currentNum"]);
    const lastOrderNum = computed(() => store.getters["orders/lastOrderNum"]);
    const orders = computed(() => store.getters["orders/orders"]);

    const resetNumeric = () => {
      store.dispatch("orders/resetNum", +num.value);
      store.dispatch("orders/setLastOrderNum", orders.value[0].id || 0);
      ElNotification({
        title: "Настройки",
        message: `Номерация установлена! следующая сделка ${+num.value + 1}`,
        type: "success",
      });
    };

    const resetVirtualNums = () => {
      store.dispatch("orders/resetVirtualNums");
      ElNotification({
        title: "Настройки",
        message: `Очередь сброшена`,
        type: "success",
      });
    };

    onMounted(() => {
      // num.value = currentNum.value;
    });

    return {
      currentNum,

      num,
      resetNumeric,
      resetVirtualNums,
      lastOrderNum,
    };
  },
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

  .numeric {
    display: flex;
    align-items: center;

    &__current {
      margin-left: 20px;
    }
  }
}
</style>
