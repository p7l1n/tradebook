<template>
  <div class="note-page">
    <!-- <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" /> -->
    <!-- end tables -->
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
      <!-- tables -->
      <div v-if="!isLoading && !showStats" class="note-page__tables">
        <div class="note-page__tables-table">
          <div class="title">USDT</div>
          <div class="form">
            <div class="form-field">
              <Input
                v-model="amounUsd"
                type="number"
                gray
                :red="amounUsd < 0"
                :green="amounUsd > 0"
                placeholder="USDT сумма"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <Input
                v-model="commentUsd"
                gray
                placeholder="Инфо"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-button
                type="success"
                :loading="loadingUSDT"
                class="base-btn"
                @enter="addUSDT"
                @click="addUSDT"
              >
                Добавить
              </el-button>
            </div>
          </div>
          <el-table
            empty-text="Нет данных"
            :data="usdtList"
            height="220"
            style="width: 100%"
          >
            <el-table-column prop="amount" label="Сумма" width="180" />
            <el-table-column prop="type" label="Тип" width="180" />
            <el-table-column prop="comment" label="Инфо" />
            <el-table-column prop="date" label="Дата" width="180" />
          </el-table>
        </div>
        <!--  -->
        <div class="note-page__tables-table">
          <div class="title">RUB</div>
          <div class="form">
            <div class="form-field">
              <Input
                v-model="amountRub"
                type="number"
                gray
                :red="amountRub < 0"
                :green="amountRub > 0"
                placeholder="RUB сумма"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <Input
                v-model="commentRub"
                gray
                placeholder="Инфо"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-button
                type="success"
                :loading="loadingRUB"
                class="base-btn"
                @enter="addRUB"
                @click="addRUB"
              >
                Добавить
              </el-button>
            </div>
          </div>
          <el-table
            empty-text="Нет данных"
            :data="rubList"
            height="220"
            style="width: 100%"
          >
            <el-table-column prop="amount" label="Сумма" width="180" />
            <el-table-column prop="type" label="Тип" width="180" />
            <el-table-column prop="comment" label="Инфо" />
            <el-table-column prop="date" label="Дата" width="180" />
          </el-table>
        </div>
        <!--  -->
        <div class="note-page__tables-table">
          <div class="title">USD</div>
          <div class="form">
            <div class="form-field">
              <Input
                v-model="amountDol"
                type="number"
                gray
                :red="amountDol < 0"
                :green="amountDol > 0"
                placeholder="USD сумма"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <Input
                v-model="commentDol"
                gray
                placeholder="Инфо"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-button
                type="success"
                :loading="loadingDOL"
                class="base-btn"
                @enter="addDOL"
                @click="addDOL"
              >
                Добавить
              </el-button>
            </div>
          </div>
          <el-table
            empty-text="Нет данных"
            :data="dolList"
            height="220"
            style="width: 100%"
          >
            <el-table-column prop="amount" label="Сумма" width="180" />
            <el-table-column prop="type" label="Тип" width="180" />
            <el-table-column prop="comment" label="Инфо" />
            <el-table-column prop="date" label="Дата" width="180" />
          </el-table>
        </div>
        <!--  -->
        <div class="note-page__tables-table">
          <div class="title">EUR</div>
          <div class="form">
            <div class="form-field">
              <Input
                v-model="amountEur"
                type="number"
                gray
                :red="amountEur < 0"
                :green="amountEur > 0"
                placeholder="EUR сумма"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <Input
                v-model="commentEur"
                gray
                placeholder="Инфо"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-button
                type="success"
                :loading="loadingEUR"
                class="base-btn"
                @enter="addEUR"
                @click="addEUR"
              >
                Добавить
              </el-button>
            </div>
          </div>
          <el-table
            empty-text="Нет данных"
            :data="eurList"
            height="220"
            style="width: 100%"
          >
            <el-table-column prop="amount" label="Сумма" width="180" />
            <el-table-column prop="type" label="Тип" width="180" />
            <el-table-column prop="comment" label="Инфо" />
            <el-table-column prop="date" label="Дата" width="180" />
          </el-table>
        </div>
        <!--  -->
        <div class="note-page__tables-table">
          <div class="title">WUSD</div>
          <div class="form">
            <div class="form-field">
              <Input
                v-model="amountWusd"
                type="number"
                gray
                :red="amountWusd < 0"
                :green="amountWusd > 0"
                placeholder="WUSD сумма"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <Input
                v-model="commentWusd"
                gray
                placeholder="Инфо"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-button
                type="success"
                :loading="loadingWusd"
                class="base-btn"
                @enter="addWUSD"
                @click="addWUSD"
              >
                Добавить
              </el-button>
            </div>
          </div>
          <el-table
            empty-text="Нет данных"
            :data="wusdList"
            height="220"
            style="width: 100%"
          >
            <el-table-column prop="amount" label="Сумма" width="180" />
            <el-table-column prop="type" label="Тип" width="180" />
            <el-table-column prop="comment" label="Инфо" />
            <el-table-column prop="date" label="Дата" width="180" />
          </el-table>
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
            @enter="addNew"
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
      <!-- <DailyNotes
        v-if="!isLoading && !showStats"
        class="notes-page__widgets-item"
        @select="onSelectNote"
      />
      <NotesStats v-if="!isLoading && showStats" /> -->
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
// import SubMenu from "./components/SubMenu";
import Loader from "@/components/Loader";

import Input from "@/components/Input";
import Modal from "@/components/Modal";
import ModalContent from "@/components/ModalContent";
import Form from "./components/Form";
// import DailyNotes from "@/components/widgets/DailyNotes";
// import Button from "@/components/Button";
import CheckGroupButton from "@/components/CheckGroupButton";
// import { DEFAULT_CURRENCIES } from "@/config/defaultCurrencies";

import { useStore } from "vuex";

import { ref, computed, onMounted } from "vue";
import { toCurrency } from "@/helpers";
import { NOTE_TYPES } from "@/config/noteTypes";
// import NotesStats from "@/components/widgets/NotesStats";
import { ElNotification } from "element-plus";
import useDailyNotes from "@/compositions/useDailyNotes";
import moment from "moment";

export default {
  components: {
    // SubMenu,
    Loader,
    Modal,
    ModalContent,
    Form,
    Input,
    // DailyNotes,
    // Button,
    CheckGroupButton,
    // NotesStats,
  },
  setup() {
    const { filteredNotesList } = useDailyNotes();
    const store = useStore();
    const showStats = ref(null);
    const activeMenuIndex = ref(0);
    const editForm = ref(false);
    const selectedItem = ref(null);
    const dateFrom = ref("");
    const dateTo = ref("");
    const loading = ref(false);
    //
    const amounUsd = ref("");
    const commentUsd = ref("");
    const loadingUSDT = ref(false);

    const amountRub = ref("");
    const commentRub = ref("");
    const loadingRUB = ref(false);

    const amountDol = ref("");
    const commentDol = ref("");
    const loadingDOL = ref(false);

    const amountEur = ref("");
    const commentEur = ref("");
    const loadingEUR = ref(false);

    const amountWusd = ref("");
    const commentWusd = ref("");
    const loadingWusd = ref(false);

    const addWUSD = async () => {
      if (!amountWusd.value) {
        ElNotification({
          title: "Тетрадь WUSD",
          message: `Укажите сумму`,
          type: "warning",
        });
        return;
      }
      loadingWusd.value = true;
      const findClient = clientsList.value.find(
        (item) => item.name === "Тетрадь"
      );
      const newOrderEntity = {
        date: Math.floor(+new Date() / 1000),
        clientId: findClient?.id,
        type: amountWusd.value > 0 ? 1 : 0,
        inCurrencyId: 4,
        amount: amountWusd.value > 0 ? amountWusd.value : -amountWusd.value,
        comment: commentWusd.value,
        isProfit: false,
        category: 0,
      };

      await store.dispatch("dailyNote/addNewEntity", newOrderEntity);
      loadingWusd.value = false;
      commentWusd.value = "";
      amountWusd.value = "";
    };

    const addEUR = async () => {
      if (!amountEur.value) {
        ElNotification({
          title: "Тетрадь EUR",
          message: `Укажите сумму`,
          type: "warning",
        });
        return;
      }
      loadingEUR.value = true;
      const findClient = clientsList.value.find(
        (item) => item.name === "Тетрадь"
      );
      const newOrderEntity = {
        date: Math.floor(+new Date() / 1000),
        clientId: findClient?.id,
        type: amountEur.value > 0 ? 1 : 0,
        inCurrencyId: 3,
        amount: amountEur.value > 0 ? amountEur.value : -amountEur.value,
        comment: commentEur.value,
        isProfit: false,
        category: 0,
      };

      await store.dispatch("dailyNote/addNewEntity", newOrderEntity);
      loadingEUR.value = false;
      commentEur.value = "";
      amountEur.value = "";
    };

    const addDOL = async () => {
      if (!amountDol.value) {
        ElNotification({
          title: "Тетрадь USD",
          message: `Укажите сумму`,
          type: "warning",
        });
        return;
      }
      loadingDOL.value = true;
      const findClient = clientsList.value.find(
        (item) => item.name === "Тетрадь"
      );
      const newOrderEntity = {
        date: Math.floor(+new Date() / 1000),
        clientId: findClient?.id,
        type: amountDol.value > 0 ? 1 : 0,
        inCurrencyId: 2,
        amount: amountDol.value > 0 ? amountDol.value : -amountDol.value,
        comment: commentDol.value,
        isProfit: false,
        category: 0,
      };

      await store.dispatch("dailyNote/addNewEntity", newOrderEntity);
      loadingDOL.value = false;
      commentDol.value = "";
      amountDol.value = "";
    };

    const addUSDT = async () => {
      if (!amounUsd.value) {
        ElNotification({
          title: "Тетрадь USDT",
          message: `Укажите сумму`,
          type: "warning",
        });
        return;
      }
      loadingUSDT.value = true;
      const findClient = clientsList.value.find(
        (item) => item.name === "Тетрадь"
      );
      const newOrderEntity = {
        date: Math.floor(+new Date() / 1000),
        clientId: findClient?.id,
        type: amounUsd.value > 0 ? 1 : 0,
        inCurrencyId: 0,
        amount: amounUsd.value > 0 ? amounUsd.value : -amounUsd.value,
        comment: commentUsd.value,
        isProfit: false,
        category: 0,
      };

      await store.dispatch("dailyNote/addNewEntity", newOrderEntity);
      loadingUSDT.value = false;
      commentUsd.value = "";
      amounUsd.value = "";
    };
    //
    const addRUB = async () => {
      if (!amountRub.value) {
        ElNotification({
          title: "Тетрадь RUB",
          message: `Укажите сумму`,
          type: "warning",
        });
        return;
      }
      loadingRUB.value = true;
      const findClient = clientsList.value.find(
        (item) => item.name === "Тетрадь"
      );
      const newOrderEntity = {
        date: Math.floor(+new Date() / 1000),
        clientId: findClient?.id,
        type: amountRub.value > 0 ? 1 : 0,
        inCurrencyId: 1,
        amount: amountRub.value > 0 ? amountRub.value : -amountRub.value,
        comment: commentRub.value,
        isProfit: false,
        category: 0,
      };

      await store.dispatch("dailyNote/addNewEntity", newOrderEntity);
      loadingRUB.value = false;
      commentRub.value = "";
      amountRub.value = "";
    };

    // form
    const operationTypes = ref([NOTE_TYPES.debit, NOTE_TYPES.credit]);
    const activeOperationTypesIndex = ref(0);
    const selectedClient = ref(null);
    const amount = ref("");
    const comment = ref("");

    const eurList = computed(() => {
      return filteredNotesList.value
        .filter((item) => item.inCurrency === "EUR")
        .map((item) => {
          return {
            ...item,
            date: moment(item.date).utcOffset(360).format("DD.MM, HH:mm"),
            amount: toCurrency(item.amount),
          };
        });
    });

    const wusdList = computed(() => {
      return filteredNotesList.value
        .filter((item) => item.inCurrency === "WUSD")
        .map((item) => {
          return {
            ...item,
            date: moment(item.date).utcOffset(360).format("DD.MM, HH:mm"),
            amount: toCurrency(item.amount),
          };
        });
    });

    const usdtList = computed(() => {
      return filteredNotesList.value
        .filter((item) => item.inCurrency === "USDT")
        .map((item) => {
          return {
            ...item,
            date: moment(item.date).utcOffset(360).format("DD.MM, HH:mm"),
            amount: toCurrency(item.amount),
          };
        });
    });

    const dolList = computed(() => {
      return filteredNotesList.value
        .filter((item) => item.inCurrency === "USD")
        .map((item) => {
          return {
            ...item,
            date: moment(item.date).utcOffset(360).format("DD.MM, HH:mm"),
            amount: toCurrency(item.amount),
          };
        });
    });

    const rubList = computed(() => {
      return filteredNotesList.value
        .filter((item) => item.inCurrency === "RUB")
        .map((item) => {
          return {
            ...item,
            date: moment(item.date).utcOffset(360).format("DD.MM, HH:mm"),
            amount: toCurrency(item.amount),
          };
        });
    });

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
        date: Math.floor(+new Date() / 1000),
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

      //
      amounUsd,
      commentUsd,
      loadingUSDT,
      usdtList,
      addUSDT,

      //
      amountDol,
      commentDol,
      loadingDOL,
      dolList,
      addDOL,

      //
      amountRub,
      commentRub,
      loadingRUB,
      rubList,
      addRUB,

      //
      amountEur,
      commentEur,
      loadingEUR,
      eurList,
      addEUR,

      //
      amountWusd,
      commentWusd,
      loadingWusd,
      wusdList,
      addWUSD,

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

  &__tables {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  &__tables-table {
    margin-right: 15px;
    margin-bottom: 15px;
    min-width: 48%;
    max-width: 48%;
    width: 100%;
    min-height: 290px;
    border: 1px solid #ccc;
    // margin: 10px;
    position: relative;
    border-radius: $controlRadius;
    overflow: hidden;

    .ml10 {
      margin-left: 10px;
    }

    .title {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      font-size: 11px;
      text-transform: uppercase;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30px;

      background-color: $panelColorSecondary;
      color: $textColorWhite;
    }

    .form {
      padding: 0 10px;
      margin-top: 40px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
