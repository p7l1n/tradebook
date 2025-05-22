<template>
  <div class="note-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div :class="{ isLoading }" class="note-page__widgets">
      <div class="filter">
        <!-- <Button title="Новая запись" @click="openForm" class="credit-btn" /> -->
        <div class="filter__stats">
          <el-input
            v-model="searchStr"
            placeholder="Поиск по посредникам"
            clearable
          />
          <div v-if="activeMenuIndex === 0" class="ml10">
            <el-date-picker
              v-model="dateFrom"
              type="date"
              placeholder="Показать с"
              :disabled-date="disabledDate"
              :shortcuts="shortcuts"
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
              @change="onSelectDateTo"
            />
          </div>
          <!-- <div class="filter__profit ml10">
            <span>Итоговая сумма: </span>{{ toCurrency(0) }} USDT
          </div> -->
        </div>
      </div>
      <Notes
        v-if="!isLoading && activeMenuIndex === 0"
        class="notes-page__widgets-item"
        :search-str="searchStr"
        :is-agents="true"
      />
      <NotesStats
        v-if="!isLoading && activeMenuIndex === 1"
        :search-str="searchStr"
        :is-agents="true"
      />
    </div>
  </div>
</template>
<script>
import SubMenu from "./components/SubMenu";

import Notes from "@/components/widgets/Notes";
import NotesStats from "@/components/widgets/NotesStats";

import { useStore } from "vuex";
import { toCurrency } from "@/helpers";

import { ref, computed, onMounted } from "vue";

export default {
  components: {
    SubMenu,
    Notes,
    NotesStats,
  },
  setup() {
    const store = useStore();
    const activeMenuIndex = ref(0);
    const dateFrom = ref("");
    const dateTo = ref("");
    const searchStr = ref("");

    const isLoading = computed(() => store.getters["rates/isLoading"]);

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

    const filterOptions = computed(() => store.getters["agents/filter"]);

    const onSelectMenu = (ndx) => {
      activeMenuIndex.value = ndx;
    };

    const onSelectDateFrom = (val) => {
      store.dispatch("agents/setFilterOption", { key: "dateFrom", value: val });
    };

    const onSelectDateTo = (val) => {
      store.dispatch("agents/setFilterOption", { key: "dateTo", value: val });
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
      dateFrom,
      dateTo,
      shortcuts,
      isLoading,
      activeMenuIndex,
      toCurrency,

      disabledDate,

      onSelectMenu,
      onSelectDateFrom,
      onSelectDateTo,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";
@import "@/assets/styles/_breakpoints.scss";

.note-page {
  position: relative;
  height: 100vh;

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
      gap: 10px;

      .el-input {
        width: 170px;
      }

      .el-date-picker {
        width: 200px;
      }
    }

    &__profit {
      position: absolute;
      right: 20px;
      font-size: 16px;
      font-family: "Roboto-Medium";
      color: $colorGreenDark;

      span {
        color: $textColorBlack;
      }
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    .filter {
      flex-direction: column;
      gap: 10px;

      &__stats {
        width: 100%;
        flex-direction: column;
        align-items: stretch;

        .el-input,
        .el-date-picker {
          width: 100% !important;
        }

        .ml10 {
          margin-left: 0;
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
    width: 100%;
    box-sizing: border-box;
  }

  &__widgets {
    width: 100%;
    padding: $paddingLarge;
    box-sizing: border-box;
    overflow-x: hidden;

    &.isLoading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 120px);
    }

    @media screen and (max-width: $breakpoint-tablet) {
      padding: $paddingMedium;
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
