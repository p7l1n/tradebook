<template>
  <div class="widget-notes-wrap">
    <div class="widget-notes">
      <div class="widget-notes__title">Тетрадь</div>
      <div class="widget-notes__list">
        <div class="widget-notes__list-item">
          <!-- <div class="widget-notes__list-item-field label">ID</div> -->
          <div class="widget-notes__list-item-field label">Дата</div>
          <div class="widget-notes__list-item-field label">Тип</div>
          <div class="widget-notes__list-item-field label">Контрагент</div>
          <div class="widget-notes__list-item-field label">Валюта</div>
          <div class="widget-notes__list-item-field label">Сумма</div>
          <div class="widget-notes__list-item-field label">Примечание</div>
        </div>
        <el-empty
          v-if="!filteredNotesList.length"
          :image-size="300"
          description="Данных нет"
        />
        <div
          :class="{
            active: selectedItem && selectedItem.apiKey === item.apiKey,
            old: !isTodayBetweenDates(+new Date(), item.date),
          }"
          class="widget-notes__list-item"
          v-for="(item, ndx) in filteredNotesList"
          :key="ndx"
          @click="selectRow(item)"
        >
          <!-- <div class="widget-notes__list-item-field">
            {{ `${item.id}`.slice(0, 9) }}
          </div> -->
          <div class="widget-notes__list-item-field">
            {{ moment(item.date).format("DD.MM.YY,HH:mm") }}
          </div>
          <div class="widget-notes__list-item-field strong">
            {{ item.type }}
          </div>
          <div class="widget-notes__list-item-field">
            {{ item.client }}
          </div>
          <div class="widget-notes__list-item-field">
            {{ item.inCurrency }}
          </div>
          <div
            :class="{
              red: item.type === NOTE_TYPES.debit,
              green: item.type === NOTE_TYPES.credit,
            }"
            class="widget-notes__list-item-field"
          >
            {{ toCurrency(item.amount) }}
          </div>
          <div class="widget-notes__list-item-field strong">
            {{ item.comment }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
// import { useStore } from "vuex";
import { getNumFormat, toCurrency } from "@/helpers";
import { NOTE_TYPES } from "@/config/noteTypes";
import moment from "moment";
import useDailyNotes from "@/compositions/useDailyNotes";
import { isTodayBetweenDates } from "@/helpers";

export default {
  components: {},
  setup(_, { emit }) {
    const { filteredNotesList } = useDailyNotes();
    // const store = useStore();
    const selectedItem = ref(null);

    const selectRow = (item) => {
      emit("select", item);
    };

    return {
      filteredNotesList,
      selectedItem,
      moment,
      NOTE_TYPES,
      getNumFormat,
      selectRow,

      toCurrency,
      isTodayBetweenDates,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-notes-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.widget-notes {
  width: 100%;
  padding: 0 $paddingSmall;
  border-radius: $borderRadius;
  background-color: $panelColorLight;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &__title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-size: 11px;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;

    background-color: $panelColorSecondary;
    color: $textColorWhite;
  }

  &__list {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    height: auto;
  }

  &__list-item {
    display: flex;
    align-items: center;
    cursor: pointer;

    &.old {
      background-color: #ebc6c6;
    }

    &.active {
      background-color: $colorRowGrayActive;
      border-radius: $controlRadius;

      .widget-notes__list-item-field {
        &:nth-child(even) {
          // background-color: initial;
        }
      }
    }

    &.editMode {
      &:hover {
        cursor: pointer;
      }
    }
  }

  &__list-item-field {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;

    &.strong {
      color: $textColorBlack;
      font-weight: bold;
    }

    &.green {
      color: $colorGreenDark;
      font-weight: bold;
    }

    &.red {
      color: $colorRedDark;
      font-weight: bold;
    }

    &.label {
      font-size: 10px;
      text-transform: uppercase;
      color: $textColorGrayDark;
      font-weight: bold;
    }

    &.mini {
      font-size: 12px;
    }

    &:nth-child(even) {
      // background-color: $panelColorActive;
    }

    &.clicked {
      cursor: pointer;
    }
  }
}

.mt15 {
  margin-top: 5px;
}
</style>
