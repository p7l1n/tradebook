<template>
  <div class="note-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div :class="{ isLoading }" class="note-page__widgets">
      <div v-if="activeMenuIndex === 0" class="note-page__edit">
        <CheckButton
          yes-title="Редакт."
          no-title="Выкл"
          :checked="editModeFlag"
          @check="onCheckEdit"
        />
        <div v-if="activeMenuIndex === 0 && collectionsIds.length">
          <el-button
            type="warning"
            :loading="loadingRemove"
            class="base-btn ml10"
            style="height: 30px"
            @click="removeOrders"
          >
            Удалить
          </el-button>
        </div>
      </div>
      <Loader v-if="isLoading && activeMenuIndex === 0" />
      <div class="filter">
        <!-- <Button title="Новая запись" @click="openForm" class="credit-btn" /> -->
        <div class="filter__stats">
          <el-input
            v-if="activeMenuIndex < 2"
            v-model="searchStr"
            style="width: 170px"
            placeholder="Поиск по ДК"
            clearable
          />
          <div v-if="activeMenuIndex === 0" class="ml10">
            <el-date-picker
              v-model="dateFrom"
              type="date"
              placeholder="Показать с"
              :disabled-date="disabledDate"
              :shortcuts="shortcuts"
              style="width: 170px"
              @change="onSelectDateFrom"
            />
          </div>
          <div v-if="activeMenuIndex === 0" class="ml10">
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
          <div
            v-if="activeMenuIndex === 2"
            class="filter__stats"
            style="height: 32px"
          >
            <div class="filter__profit ml10">
              <span>Снятий на сумму: </span
              >{{ toCurrency(profitUsdtHistory) }} USDT
            </div>
          </div>
        </div>
      </div>
      <!-- form -->
      <div
        v-if="activeMenuIndex === 0"
        class="note-page__form"
        tabindex="0"
        @keydown.enter="addNew"
      >
        <CheckGroupButton
          :items="operationTypes"
          :active-index="activeOperationTypesIndex"
          @check="onSelectOperationType"
        />
        <div class="note-page__form-field">
          <CheckGroupButton
            :items="inCurrencies"
            :active-index="activeIncurrenciesIndex"
            @check="onSelectInCurrencies"
          />
        </div>

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
          <Input
            placeholder="Сумма"
            :red="activeOperationTypesIndex === 0"
            :green="activeOperationTypesIndex === 1"
            v-model="amount"
            type="number"
          />
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
      </div>
      <!-- end form -->
      <Notes
        v-if="!isLoading && activeMenuIndex === 0"
        class="notes-page__widgets-item"
        :search-str="searchStr"
        :editing="editModeFlag"
        :ids="collectionsIds"
        @collect="onCollect"
        @select="onSelectNote"
      />
      <NotesStats
        v-if="!isLoading && activeMenuIndex === 1"
        :search-str="searchStr"
      />
      <ProfitHistory
        v-if="!isLoading && activeMenuIndex === 2"
        class="notes-page__widgets-item"
      />
    </div>
    <!-- редактирование формы -->
    <teleport v-if="editForm" to="body">
      <Modal>
        <ModalContent
          :title="selectedItem ? 'Редактирование записи' : 'Новая запись'"
          v-click-away="closeForm"
        >
          <Form @close="closeForm" :edit-note="selectedItem" />
        </ModalContent>
      </Modal>
    </teleport>
  </div>
</template>
<script>
import SubMenu from "./components/SubMenu";
import Loader from "@/components/Loader";

import Modal from "@/components/Modal";
import ModalContent from "@/components/ModalContent";
import Form from "./components/Form";
import Notes from "@/components/widgets/Notes";
import ProfitHistory from "@/components/widgets/ProfitHistory";
import NotesStats from "@/components/widgets/NotesStats";
// import Button from "@/components/Button";
import Input from "@/components/Input";
import CheckGroupButton from "@/components/CheckGroupButton";

import { useStore } from "vuex";

import { ref, computed, onMounted } from "vue";
import useNotes from "@/compositions/useNotes";
import { toCurrency } from "@/helpers";
import { NOTE_TYPES } from "@/config/noteTypes";
import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";
import { ElNotification } from "element-plus";
import CheckButton from "@/components/CheckButton";

export default {
  components: {
    SubMenu,
    Loader,
    Modal,
    ModalContent,
    Form,
    Notes,
    ProfitHistory,
    NotesStats,
    // Button,
    Input,
    CheckGroupButton,
    CheckButton,
  },
  setup() {
    const { profitUsdtHistory } = useNotes();
    const store = useStore();
    const activeMenuIndex = ref(0);
    const editForm = ref(false);
    const selectedItem = ref(null);
    const dateFrom = ref("");
    const dateTo = ref("");
    const loading = ref(false);
    const searchStr = ref("");
    const collectionsIds = ref([]);
    const editModeFlag = ref(false);
    const loadingRemove = ref(false);

    const activeIncurrenciesIndex = ref(0);
    const inCurrencies = ref(DEFAULT_CURRENCIES);

    // form
    const operationTypes = ref([NOTE_TYPES.debit, NOTE_TYPES.credit]);
    const activeOperationTypesIndex = ref(0);
    const selectedClient = ref(null);
    const amount = ref("");
    const comment = ref("");

    const onSelectInCurrencies = (ndx) => {
      activeIncurrenciesIndex.value = ndx;
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

    const onClientSelect = (val) => {
      selectedClient.value = val;
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

    const isLoading = computed(() => store.getters["rates/isLoading"]);
    const filterOptions = computed(() => store.getters["note/filter"]);

    const onSelectMenu = (ndx) => {
      activeMenuIndex.value = ndx;
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
      store.dispatch("note/setFilterOption", { key: "dateFrom", value: val });
    };

    const onSelectDateTo = (val) => {
      store.dispatch("note/setFilterOption", { key: "dateTo", value: val });
    };

    const addNew = async () => {
      if (!selectedClient.value || !amount.value) {
        ElNotification({
          title: "Журнал ДК",
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
    };

    const onCheckEdit = (val) => {
      editModeFlag.value = val;
      if (!editModeFlag.value) {
        collectionsIds.value = [];
      }
    };

    const removeOrders = async () => {
      loadingRemove.value = true;
      collectionsIds.value.forEach(async (id) => {
        await store.dispatch("dailyNote/removeEntity", { id });
      });
      loadingRemove.value = false;

      ElNotification({
        title: "Успешно",
        message: `Выбранные записи удалены`,
        type: "success",
      });
    };

    const onCollect = (id) => {
      if (collectionsIds.value.includes(id)) {
        collectionsIds.value = collectionsIds.value.filter(
          (collId) => collId != id
        );
      } else {
        collectionsIds.value.push(id);
      }
    };

    onMounted(() => {
      if (filterOptions.value.dateFrom) {
        dateFrom.value = filterOptions.value.dateFrom;
      }
      if (filterOptions.value.dateTo) {
        dateTo.value = filterOptions.value.dateTo;
      }
    });

    return {
      searchStr,
      activeMenuIndex,
      isLoading,
      editForm,
      selectedItem,
      dateFrom,
      dateTo,
      shortcuts,
      profitUsdtHistory,
      // form
      amount,
      comment,
      operationTypes,
      clientItems,
      loading,
      selectedClient,
      activeOperationTypesIndex,
      activeIncurrenciesIndex,
      inCurrencies,
      // edit
      editModeFlag,
      collectionsIds,
      loadingRemove,

      toCurrency,
      disabledDate,

      onSelectMenu,
      closeForm,
      onSelectNote,
      openForm,
      onSelectDateFrom,
      onSelectDateTo,

      onClientSelect,
      onSelectOperationType,
      onSelectInCurrencies,
      addNew,
      removeOrders,
      onCheckEdit,
      onCollect,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.note-page {
  position: relative;

  &__edit {
    display: flex;
    align-items: center;
    position: absolute;
    top: 5px;
  }

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

    &__profit {
      position: absolute;
      right: 20px;
      font-size: 16px;
      font-weight: bold;
      color: $colorGreenDark;

      span {
        color: $textColorBlack;
      }
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
