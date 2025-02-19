<template>
  <div class="note-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div :class="{ isLoading }" class="note-page__widgets">
      <Loader v-if="isLoading && activeMenuIndex === 0" />
      <div class="filter">
        <Button title="Новая запись" @click="openForm" class="credit-btn" />
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
          <div class="filter__profit ml10">
            <span>Снятий на сумму: </span
            >{{ toCurrency(profitUsdtHistory) }} USDT
          </div>
        </div>
      </div>
      <Notes
        v-if="!isLoading && activeMenuIndex === 0"
        class="notes-page__widgets-item"
        @select="onSelectNote"
      />
      <ProfitHistory
        v-if="!isLoading && activeMenuIndex === 1"
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
import Button from "@/components/Button";

import { useStore } from "vuex";

import { ref, computed, onMounted } from "vue";
import useNotes from "@/compositions/useNotes";
import { toCurrency } from "@/helpers";

export default {
  components: {
    SubMenu,
    Loader,
    Modal,
    ModalContent,
    Form,
    Notes,
    ProfitHistory,
    Button,
  },
  setup() {
    const { profitUsdtHistory } = useNotes();
    const store = useStore();
    const activeMenuIndex = ref(0);
    const editForm = ref(false);
    const selectedItem = ref(null);
    const dateFrom = ref("");
    const dateTo = ref("");

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

    onMounted(() => {
      if (filterOptions.value.dateFrom) {
        dateFrom.value = filterOptions.value.dateFrom;
      }
      if (filterOptions.value.dateTo) {
        dateTo.value = filterOptions.value.dateTo;
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
      profitUsdtHistory,
      toCurrency,
      disabledDate,

      onSelectMenu,
      closeForm,
      onSelectNote,
      openForm,
      onSelectDateFrom,
      onSelectDateTo,
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

    &__stats {
      display: flex;
      align-items: center;
    }

    &__profit {
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
}
</style>
