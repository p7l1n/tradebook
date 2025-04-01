<template>
  <div class="note-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div :class="{ isLoading }" class="note-page__widgets">
      <Loader v-if="isLoading" />
      <div class="filter">
        <!-- <Button title="Новая запись" @click="openForm" class="credit-btn" /> -->
        <div class="filter__stats">
          <el-date-picker
            v-model="dateFrom"
            type="date"
            placeholder="Показать с"
            :disabled-date="disabledDate"
            :shortcuts="shortcuts"
            style="width: 170px"
            @change="onSelectDateFrom"
          />
          <div class="ml10">
            <el-date-picker
              v-model="dateTo"
              type="date"
              placeholder="Показать по"
              :disabled-date="disabledDate"
              :shortcuts="shortcuts"
              style="width: 170px"
              @change="onSelectDateTo"
            />
          </div>
        </div>
      </div>
      <!-- form -->
      <div v-if="activeMenuIndex != 0" class="note-page__form">
        <CheckGroupButton
          :items="operationTypes"
          :active-index="activeOperationTypesIndex"
          @check="onSelectOperationType"
        />
        <div class="note-page__form-field">
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
        <div class="note-page__form-field">
          <Input placeholder="Сумма" gray v-model="amount" type="number" />
        </div>
        <div class="note-page__form-field">
          <Input placeholder="Примечание" gray v-model="comment" />
        </div>
        <div class="note-page__form-field">
          <el-button
            type="success"
            :loading="loading"
            class="base-btn"
            style="width: 120px"
            @click="addNew"
          >
            Добавить
          </el-button>
        </div>
        <div class="note-page__form-field">
          <el-checkbox v-model="showStats" label="Показать сводку" border />
        </div>
      </div>
      <!-- end form -->
      <DailyNotes
        v-if="!isLoading && !showStats"
        class="notes-page__widgets-item"
        @select="onSelectNote"
      />
      <NotesStats v-if="!isLoading && showStats" />
    </div>
    <!-- редактирование формы -->
    <teleport v-if="editForm" to="body">
      <Modal>
        <ModalContent
          :title="selectedItem ? 'Редактирование записи' : 'Новая запись'"
          v-click-away="closeForm"
        >
          <Form
            @close="closeForm"
            :edit-note="selectedItem"
            :currency-index="activeMenuIndex"
          />
        </ModalContent>
      </Modal>
    </teleport>
  </div>
</template>
<script>
import SubMenu from "./components/SubMenu";
import Loader from "@/components/Loader";

import Input from "@/components/Input";
import Modal from "@/components/Modal";
import ModalContent from "@/components/ModalContent";
import Form from "./components/Form";
import DailyNotes from "@/components/widgets/DailyNotes";
// import Button from "@/components/Button";
import CheckGroupButton from "@/components/CheckGroupButton";
// import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";

import { useStore } from "vuex";

import { ref, computed, onMounted } from "vue";
import { toCurrency } from "@/helpers";
import { NOTE_TYPES } from "@/config/noteTypes";
import NotesStats from "@/components/widgets/NotesStats";
import { ElNotification } from "element-plus";

export default {
  components: {
    SubMenu,
    Loader,
    Modal,
    ModalContent,
    Form,
    Input,
    DailyNotes,
    // Button,
    CheckGroupButton,
    NotesStats,
  },
  setup() {
    const store = useStore();
    const showStats = ref(null);
    const activeMenuIndex = ref(0);
    const editForm = ref(false);
    const selectedItem = ref(null);
    const dateFrom = ref("");
    const dateTo = ref("");
    const loading = ref(false);

    // form
    const operationTypes = ref([NOTE_TYPES.debit, NOTE_TYPES.credit]);
    const activeOperationTypesIndex = ref(0);
    const selectedClient = ref(null);
    const amount = ref("");
    const comment = ref("");

    const onClientSelect = (val) => {
      selectedClient.value = val;
    };

    const shortcuts = ref([
      {
        text: "Сегодня",
        value: new Date(),
      },
      {
        text: "Вчера",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        },
      },
      {
        text: "Нед. назад",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          return date;
        },
      },
    ]);

    const disabledDate = (time) => {
      return time.getTime() > Date.now();
    };

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

    const isLoading = computed(() => store.getters["rates/isLoading"]);
    const filterOptions = computed(() => store.getters["dailyNote/filter"]);

    const onSelectMenu = (ndx) => {
      activeMenuIndex.value = ndx;
      store.dispatch("dailyNote/setFilterOption", {
        key: "activeTabIndex",
        value: ndx,
      });
    };

    const closeForm = () => {
      editForm.value = false;
    };

    const onSelectNote = (order) => {
      selectedItem.value = order;
      editForm.value = true;
    };

    const openForm = () => {
      editForm.value = true;
      selectedItem.value = null;
    };

    const onSelectDateFrom = (val) => {
      store.dispatch("dailyNote/setFilterOption", {
        key: "dateFrom",
        value: val,
      });
    };

    const onSelectDateTo = (val) => {
      store.dispatch("dailyNote/setFilterOption", {
        key: "dateTo",
        value: val,
      });
    };

    const onSelectOperationType = (ndx) => {
      activeOperationTypesIndex.value = ndx;
    };

    const clearForm = () => {
      activeOperationTypesIndex.value = 0;

      comment.value = "";
      amount.value = "";
      selectedClient.value = null;
    };

    const getCurrency = () => {
      return activeMenuIndex.value - 1; // DEFAULT_CURRENCIES[activeMenuIndex.value - 1];
    };

    const addNew = async () => {
      if (!selectedClient.value || !amount.value) {
        ElNotification({
          title: "Тетрадь",
          message: `Укажите контрагента и сумму`,
          type: "warning",
        });
        return;
      }
      loading.value = true;
      const findClient = clientsList.value.find(
        (item) => item.name === selectedClient.value
      );
      const newOrderEntity = {
        date: new Date(),
        clientId: findClient?.id,
        type: activeOperationTypesIndex.value, // operationTypes.value[activeOperationTypesIndex.value],
        inCurrencyId: getCurrency(),
        amount: amount.value,
        comment: comment.value,
        isProfit: false,
        category: 0,
      };

      await store.dispatch("dailyNote/addNewEntity", newOrderEntity);
      loading.value = false;
      clearForm();
    };

    onMounted(() => {
      if (filterOptions.value.dateFrom) {
        dateFrom.value = filterOptions.value.dateFrom;
      }
      if (filterOptions.value.dateTo) {
        dateTo.value = filterOptions.value.dateTo;
      }
      if (filterOptions.value.activeTabIndex) {
        activeMenuIndex.value = filterOptions.value.activeTabIndex;
      }
    });

    return {
      activeMenuIndex,
      isLoading,
      editForm,
      selectedItem,
      dateFrom,
      dateTo,
      shortcuts,
      loading,

      // form
      operationTypes,
      activeOperationTypesIndex,
      clientItems,
      amount,
      comment,
      selectedClient,
      showStats,
      onClientSelect,
      addNew,

      toCurrency,
      disabledDate,

      onSelectMenu,
      closeForm,
      onSelectNote,
      openForm,
      onSelectDateFrom,
      onSelectDateTo,
      onSelectOperationType,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.note-page {
  .ml10 {
    margin-left: 10px;
  }
  .filter {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;

    &__stats {
      display: flex;
      align-items: center;
    }
  }

  .credit-btn {
    width: 170px;
    margin-bottom: 15px;
  }

  &__row {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__widgets-item {
    margin-top: 15px;
  }

  &__widgets {
    width: calc(100% - 20px);
    padding: $paddingLarge;
    box-sizing: border-box;

    &.isLoading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 120px);
    }
  }

  &__form {
    margin: 0 0 10px 0;
    display: flex;
    width: 100%;
    align-items: center;
  }

  &__form-field {
    margin-left: 10px;
  }
}
</style>
