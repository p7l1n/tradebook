<template>
  <div class="note-page">
    <!-- <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" /> -->
    <!-- end tables -->
    <div :class="{ isLoading }" class="note-page__widgets">
      <Loader v-if="isLoading" />
      <div class="filter">
        <!-- <Button title="Новая запись" @click="openForm" class="credit-btn" /> -->
        <div class="filter__stats">
          <el-input
            v-model="searchStr"
            style="width: 170px"
            placeholder="Поиск по тетради"
            clearable
          />
          <div class="ml10">
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
          <div class="title">
            USDT ({{
              `Дебет: ${toCurrency(
                dailyList("USDT")?.["sumDebetUSDT"]
              )}, Кредит: ${toCurrency(dailyList("USDT")?.["sumCreditUSDT"])}`
            }})
          </div>
          <div class="form">
            <div class="form-field">
              <el-input
                v-model="amounUsd"
                placeholder="USDT сумма"
                :formatter="numberFormatter"
                :parser="numberParser"
                :class="{
                  red: activeOperationTypesIndex === 0,
                  green: activeOperationTypesIndex === 1,
                }"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-input
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
            <div class="form-field ml10">
              <CheckGroupButton
                :items="operationTypes"
                :active-index="activeOperationTypesIndex"
                @check="onSelectOperationType"
              />
            </div>
          </div>
          <div class="row-tables">
            <div class="debet" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('USDT').debet"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="credit" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('USDT').credit"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="note-page__tables-table">
          <div class="title">
            RUB ({{
              `Дебет: ${toCurrency(
                dailyList("RUB")?.["sumDebetRUB"]
              )}, Кредит: ${toCurrency(dailyList("RUB")?.["sumCreditRUB"])}`
            }})
          </div>
          <div class="form">
            <div class="form-field">
              <el-input
                v-model="amountRub"
                placeholder="RUB сумма"
                :formatter="numberFormatter"
                :parser="numberParser"
                :class="{
                  red: activeOperationTypesIndex === 0,
                  green: activeOperationTypesIndex === 1,
                }"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-input
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
            <div class="form-field ml10">
              <CheckGroupButton
                :items="operationTypes"
                :active-index="activeOperationTypesIndex"
                @check="onSelectOperationType"
              />
            </div>
          </div>
          <div class="row-tables">
            <div class="debet" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('RUB').debet"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="credit" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('RUB').credit"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" class="credit" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="note-page__tables-table">
          <div class="title">
            USD ({{
              `Дебет: ${toCurrency(
                dailyList("USD")?.["sumDebetUSD"]
              )}, Кредит: ${toCurrency(dailyList("USD")?.["sumCreditUSD"])}`
            }})
          </div>
          <div class="form">
            <div class="form-field">
              <el-input
                v-model="amountDol"
                placeholder="USD сумма"
                :formatter="numberFormatter"
                :parser="numberParser"
                :class="{
                  red: activeOperationTypesIndex === 0,
                  green: activeOperationTypesIndex === 1,
                }"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-input
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
            <div class="form-field ml10">
              <CheckGroupButton
                :items="operationTypes"
                :active-index="activeOperationTypesIndex"
                @check="onSelectOperationType"
              />
            </div>
          </div>
          <div class="row-tables">
            <div class="debet" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('USD').debet"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="credit" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('USD').credit"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="note-page__tables-table">
          <div class="title">
            EUR ({{
              `Дебет: ${toCurrency(
                dailyList("EUR")?.["sumDebetEUR"]
              )}, Кредит: ${toCurrency(dailyList("EUR")?.["sumCreditEUR"])}`
            }})
          </div>
          <div class="form">
            <div class="form-field">
              <el-input
                v-model="amountEur"
                placeholder="EUR сумма"
                :formatter="numberFormatter"
                :parser="numberParser"
                :class="{
                  red: activeOperationTypesIndex === 0,
                  green: activeOperationTypesIndex === 1,
                }"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-input
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
            <div class="form-field ml10">
              <CheckGroupButton
                :items="operationTypes"
                :active-index="activeOperationTypesIndex"
                @check="onSelectOperationType"
              />
            </div>
          </div>
          <div class="row-tables">
            <div class="debet" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('EUR').debet"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="credit" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('EUR').credit"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="note-page__tables-table">
          <div class="title">
            WUSD ({{
              `Дебет: ${toCurrency(
                dailyList("WUSD")?.["sumDebetWUSD"]
              )}, Кредит: ${toCurrency(dailyList("WUSD")?.["sumCreditWUSD"])}`
            }})
          </div>
          <div class="form">
            <div class="form-field">
              <el-input
                v-model="amountWusd"
                placeholder="WUSD сумма"
                :formatter="numberFormatter"
                :parser="numberParser"
                :class="{
                  red: activeOperationTypesIndex === 0,
                  green: activeOperationTypesIndex === 1,
                }"
                class="base-input"
              />
            </div>
            <div class="form-field ml10">
              <el-input
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
            <div class="form-field ml10">
              <CheckGroupButton
                :items="operationTypes"
                :active-index="activeOperationTypesIndex"
                @check="onSelectOperationType"
              />
            </div>
          </div>
          <div class="row-tables">
            <div class="debet" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('WUSD').debet"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="credit" style="width: 100%">
              <el-table
                empty-text="Нет данных"
                :data="dailyList('WUSD').credit"
                height="220"
                style="width: 100%"
              >
                <el-table-column prop="amount" label="Сумма" width="180" />
                <el-table-column prop="comment" label="Инфо" />
                <el-table-column width="20px">
                  <template #default="scope">
                    <div
                      class="remove-item"
                      @click="removeDailyNote(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
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
import { numberFormatter, numberParser } from "@/formatters";

export default {
  components: {
    // SubMenu,
    Loader,
    Modal,
    ModalContent,
    Form,
    Input,
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
    const searchStr = ref("");
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
      if (!findClient) {
        ElNotification({
          title: "Тетрадь",
          message: `Добавьте контрагент тетрадь`,
          type: "warning",
        });
        return;
      }
      const newOrderEntity = {
        date: Math.floor((+new Date() + 10800000) / 1000),
        clientId: findClient?.id,
        type: activeOperationTypesIndex.value,
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
      if (!findClient) {
        ElNotification({
          title: "Тетрадь",
          message: `Добавьте контрагент тетрадь`,
          type: "warning",
        });
        return;
      }
      const newOrderEntity = {
        date: Math.floor((+new Date() + 10800000) / 1000),
        clientId: findClient?.id,
        type: activeOperationTypesIndex.value,
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
      if (!findClient) {
        ElNotification({
          title: "Тетрадь",
          message: `Добавьте контрагент тетрадь`,
          type: "warning",
        });
        return;
      }
      const newOrderEntity = {
        date: Math.floor((+new Date() + 10800000) / 1000),
        clientId: findClient?.id,
        type: activeOperationTypesIndex.value,
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

      if (!findClient) {
        ElNotification({
          title: "Тетрадь",
          message: `Добавьте контрагент тетрадь`,
          type: "warning",
        });
        return;
      }

      const newOrderEntity = {
        date: Math.floor((+new Date() + 10800000) / 1000),
        clientId: findClient?.id,
        type: activeOperationTypesIndex.value,
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
      if (!findClient) {
        ElNotification({
          title: "Тетрадь",
          message: `Добавьте контрагент тетрадь`,
          type: "warning",
        });
        return;
      }
      const newOrderEntity = {
        date: Math.floor((+new Date() + 10800000) / 1000),
        clientId: findClient?.id,
        type: activeOperationTypesIndex.value,
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

    const dailyList = (curr) => {
      const search = searchStr.value.toLowerCase();

      let list = filteredNotesList.value.filter((item) => {
        return (
          item.comment.toLowerCase().includes(search) ||
          `${item.amount}`.toLowerCase().includes(search)
        );
      });

      if (!search) {
        list = filteredNotesList.value;
      }

      return {
        [`sumDebet${curr}`]: list
          .filter(
            (item) => item.inCurrency === curr && item.type === NOTE_TYPES.debit
          )
          .reduce((prev, item) => {
            return prev + item.amount;
          }, 0),
        [`sumCredit${curr}`]: list
          .filter(
            (item) =>
              item.inCurrency === curr && item.type === NOTE_TYPES.credit
          )
          .reduce((prev, item) => {
            return prev + item.amount;
          }, 0),
        debet: list
          .filter(
            (item) => item.inCurrency === curr && item.type === NOTE_TYPES.debit
          )
          .map((item) => {
            return {
              ...item,
              amount: toCurrency(item.amount),
            };
          }),

        credit: list
          .filter(
            (item) =>
              item.inCurrency === curr && item.type === NOTE_TYPES.credit
          )
          .map((item) => {
            return {
              ...item,
              amount: toCurrency(item.amount),
            };
          }),
      };
    };

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
        key: "from",
        value: val,
      });
    };

    const onSelectDateTo = (val) => {
      store.dispatch("dailyNote/setFilterOption", {
        key: "to",
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
        date: Math.floor((+new Date() + 10800000) / 1000),
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

    const removeDailyNote = async (_, item) => {
      await store.dispatch("dailyNote/removeEntity", item);
    };

    onMounted(() => {
      if (filterOptions.value.from) {
        dateFrom.value = filterOptions.value.from;
      }
      if (filterOptions.value.to) {
        dateTo.value = filterOptions.value.to;
      }
      if (filterOptions.value.activeTabIndex) {
        activeMenuIndex.value = filterOptions.value.activeTabIndex;
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
      loading,
      removeDailyNote,

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
      addUSDT,

      //
      amountDol,
      commentDol,
      loadingDOL,
      addDOL,

      //
      amountRub,
      commentRub,
      loadingRUB,
      dailyList,
      addRUB,

      //
      amountEur,
      commentEur,
      loadingEUR,
      addEUR,

      //
      amountWusd,
      commentWusd,
      loadingWusd,
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
      numberFormatter,
      numberParser,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";
@import "@/assets/styles/_breakpoints.scss";

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
      width: 100%;

      @media (max-width: $breakpoint-tablet) {
        flex-direction: column;
        align-items: stretch;

        .ml10 {
          margin-left: 0;
          margin-top: 10px;
        }

        .el-input,
        .el-date-picker {
          width: 100% !important;
        }
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
    width: 100%;
    padding: $paddingLarge;
    box-sizing: border-box;

    @media (max-width: $breakpoint-tablet) {
      padding: $paddingMedium;
    }

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
    flex-wrap: wrap;
    align-items: flex-start;
    box-sizing: border-box;
    margin-top: 20px;

    @media (max-width: $breakpoint-tablet) {
      flex-direction: column;

      .note-page__tables-table {
        width: 100%;
        margin-right: 0;
      }
    }

    .row-tables {
      display: flex;
      align-items: center;
      overflow-x: auto;
      width: 100%;
      -webkit-overflow-scrolling: touch;

      .remove-item {
        cursor: pointer;
        width: 16px;
        height: 16px;
        background-image: url("~@/assets/icons/remove.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        position: absolute;
        right: 5px;
        top: 13px;
      }
    }
  }

  &__tables-table {
    margin-right: 15px;
    margin-bottom: 15px;
    width: calc(50% - 15px);
    min-height: 290px;
    border: 1px solid $colorSelected;
    position: relative;
    border-radius: $controlRadius;
    overflow: hidden;

    &:nth-child(2n) {
      margin-right: 0;
    }

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
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;

      @media (max-width: $breakpoint-tablet) {
        flex-wrap: wrap;
        padding: 0 4px;
        margin-top: 35px;

        .form-field {
          margin-left: 0;
          margin-bottom: 10px;
          width: 100%;

          &:last-child {
            margin-bottom: 0;
          }

          .el-input,
          .base-input {
            width: 100%;
          }

          .el-button {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
