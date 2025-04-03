<template>
  <div class="note-form">
    <div class="note-form__field">
      <CheckGroupButton
        label="Тип записи"
        :items="operationTypes"
        :active-index="activeOperationTypesIndex"
        @check="onSelectOperationType"
      />
    </div>
    <div class="note-form__field">
      <el-select
        v-model="selectedClient"
        clearable
        filterable
        placeholder="Контрагент"
        style="width: 100%"
        size="large"
        @change="onClientSelect"
      >
        <el-option
          v-for="item in clientItems"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="note-form__field">
      <CheckGroupButton
        label="Валюта"
        :items="inCurrencies"
        :active-index="activeIncurrenciesIndex"
        @check="onSelectInCurrencies"
      />
    </div>
    <div class="note-form__field">
      <Input
        placeholder="Сумма"
        :red="activeOperationTypesIndex === 0"
        :green="activeOperationTypesIndex === 1"
        v-model="amount"
        type="number"
      />
    </div>
    <div class="note-form__field">
      <Input placeholder="Примечание" v-model="comment" />
    </div>

    <div class="note-form__btns">
      <Button title="Очистить" @click="clearForm" />
      <el-button
        v-if="editNote"
        type="warning"
        :loading="loadingRemove"
        class="base-btn ml10"
        style="width: 120px"
        @enter="remove"
        @click="remove"
      >
        Удалить
      </el-button>
      <el-button
        type="success"
        :loading="loading"
        class="base-btn ml10"
        style="width: 120px"
        @enter="addNew"
        @click="addNew"
      >
        {{ editNote ? "Сохранить" : "Добавить" }}
      </el-button>
    </div>
  </div>
</template>
<script>
import Input from "@/components/Input";
import Button from "@/components/Button";
import CheckGroupButton from "@/components/CheckGroupButton";
import { NOTE_TYPES } from "@/config/noteTypes";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";

import { useStore } from "vuex";
import { onMounted, ref, computed } from "vue";

import { ElSelect } from "element-plus";

export default {
  components: {
    Input,
    Button,
    CheckGroupButton,
    ElSelect,
  },
  props: {
    editNote: {
      type: [null, Object],
      default: null,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const client = ref("");
    const comment = ref("");
    const selectedClient = ref(null);
    const operationTypes = ref([NOTE_TYPES.debit, NOTE_TYPES.credit]);
    const activeOperationTypesIndex = ref(0);
    const activeIncurrenciesIndex = ref(0);
    const loading = ref(false);
    const loadingRemove = ref(false);

    const inCurrencies = ref(DEFAULT_CURRENCIES);

    const amount = ref("");

    const clientsList = computed(() => store.getters["clients/clients"]);
    const clientItems = computed(() => {
      return [...new Set(clientsList.value.map((item) => item.name))].map(
        (item) => {
          return {
            title: item,
            value: item,
          };
        }
      );
    });

    const onSelectOperationType = (ndx) => {
      activeOperationTypesIndex.value = ndx;
    };

    const onSelectInCurrencies = (ndx) => {
      activeIncurrenciesIndex.value = ndx;
    };

    const onClientSelect = (val) => {
      selectedClient.value = val;
    };

    const clearForm = () => {
      activeOperationTypesIndex.value = 0;
      activeIncurrenciesIndex.value = 0;

      comment.value = "";
      amount.value = "";
      selectedClient.value = null;
    };

    const addNew = async () => {
      if (!selectedClient.value || !amount.value) return;
      // edit
      if (props.editNote) {
        const findClient = clientsList.value.find(
          (item) => item.name === selectedClient.value
        );

        loading.value = true;
        const newOrderEntity = {
          id: props.editNote.id,
          date: Math.floor((props.editNote.date + 10800000) / 1000),
          type: activeOperationTypesIndex.value,
          clientId: findClient?.id,
          comment: comment.value,
          inCurrencyId: activeIncurrenciesIndex.value,
          amount: amount.value,
          category: props.editNote.category,
        };
        await store.dispatch("dailyNote/updateEntity", newOrderEntity);
        loading.value = false;
        clearForm();
        emit("close");
        return;
      }

      // add new
      loading.value = true;
      const findClient = clientsList.value.find(
        (item) => item.name === selectedClient.value
      );
      const newOrderEntity = {
        date: Math.floor((+new Date() + 10800000) / 1000),
        clientId: findClient?.id,
        type: activeOperationTypesIndex.value,
        inCurrencyId: activeIncurrenciesIndex.value,
        amount: amount.value,
        comment: comment.value,
        isProfit: false,
        category: 1,
      };

      await store.dispatch("dailyNote/addNewEntity", newOrderEntity);
      loading.value = false;

      clearForm();
      emit("close");
    };

    const remove = async () => {
      loadingRemove.value = true;
      await store.dispatch("dailyNote/removeEntity", props.editNote);
      loadingRemove.value = false;
      emit("close");
    };

    onMounted(() => {
      if (props.editNote) {
        selectedClient.value = props.editNote.client;
        comment.value = props.editNote.comment;
        activeOperationTypesIndex.value = operationTypes.value.findIndex(
          (item) => item === props.editNote.type
        );
        client.value = props.editNote.client;
        activeIncurrenciesIndex.value = inCurrencies.value.findIndex(
          (item) => item === props.editNote.inCurrency
        );
        amount.value = props.editNote.amount;
      }
    });

    return {
      client,
      operationTypes,
      activeOperationTypesIndex,
      activeIncurrenciesIndex,
      inCurrencies,
      amount,
      comment,
      selectedClient,
      clientItems,
      loading,
      loadingRemove,
      onSelectOperationType,
      onSelectInCurrencies,
      onClientSelect,
      clearForm,
      addNew,
      remove,
    };
  },
};
</script>
<style lang="scss" scoped>
.note-form {
  display: flex;
  flex-direction: column;

  &__field {
    margin-bottom: 15px;
  }

  &__btns {
    border-top: 1px solid #000;
    padding: 10px 0;
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;

    .ml10 {
      margin-left: 10px;
    }
  }
}
</style>
