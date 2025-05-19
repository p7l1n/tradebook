<template>
  <div class="edit-fields-form">
    <div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать ID"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.id?.show"
          @check="toggleField('id')"
        />
      </div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать виртуальный номер"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.num?.show"
          @check="toggleField('num')"
        />
      </div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать Дату"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.date?.show"
          @check="toggleField('date')"
        />
      </div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать Дату изм"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.dateChange?.show"
          @check="toggleField('dateChange')"
        />
      </div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать Тип"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.type?.show"
          @check="toggleField('type')"
        />
      </div>
    </div>
    <div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать Клиента"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.client?.show"
          @check="toggleField('client')"
        />
      </div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать Оператора"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.operator?.show"
          @check="toggleField('operator')"
        />
      </div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать комментарий"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.customComment?.show"
          @check="toggleField('customComment')"
        />
      </div>
      <div class="edit-fields-form__item">
        <CheckButton
          label="Отображать Подсказку"
          yes-title="Да"
          no-title="Нет"
          :checked="showFields?.hint?.show"
          @check="toggleField('hint')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import CheckButton from "@/components/CheckButton";
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  components: {
    CheckButton,
  },
  setup() {
    const store = useStore();
    const showFields = computed(() => store.getters["orders/showFields"]);

    const toggleField = (key) => {
      store.dispatch("orders/updateShowFields", key);
    };

    return {
      showFields,
      toggleField,
    };
  },
};
</script>
<style lang="scss" scoped>
.edit-fields-form {
  @import "@/assets/styles/_breakpoints.scss";
  display: flex;
  width: 500px;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: $breakpoint-tablet) {
    flex-direction: column;
    width: 100%;
    max-height: 550px;
    overflow-y: auto;
  }

  &__item {
    margin-bottom: 15px;
  }
}
</style>
