<template>
  <div class="widget-notes-wrap">
    <div class="widget-notes">
      <div class="widget-notes__title">
        {{ isAgents ? "Посредники" : "Журнал ДК" }}
      </div>
      <div class="widget-notes__list">
        <div class="widget-notes__list-item">
          <!-- <div class="widget-notes__list-item-field label">ID</div> -->
          <div class="widget-notes__list-item-field label">Дата</div>
          <div class="widget-notes__list-item-field label">Тип</div>
          <div class="widget-notes__list-item-field label">Контрагент</div>
          <div class="widget-notes__list-item-field label">Валюта</div>
          <div class="widget-notes__list-item-field label">Сумма</div>
          <div class="widget-notes__list-item-field label">
            {{ isAgents ? "Действие" : "Примечание" }}
          </div>
        </div>
        <el-empty
          v-if="!notesList.length"
          :image-size="300"
          description="Данных нет"
        />
        <div
          :class="{
            active: selectedItem && selectedItem.apiKey === item.apiKey,
            editing: editing && ids.includes(item.id),
          }"
          class="widget-notes__list-item"
          v-for="(item, ndx) in notesList.slice(0, countToShow)"
          :key="ndx"
          @click="selectRow(item)"
        >
          <!-- <div class="widget-notes__list-item-field">
            {{ `${item.id}`.slice(0, 9) }}
          </div> -->
          <div class="widget-notes__list-item-field">
            {{ moment(item.date).utcOffset(180).format("DD.MM, HH:mm") }}
          </div>
          <div class="widget-notes__list-item-field strong">
            {{ item.type }}
          </div>
          <div class="widget-notes__list-item-field">
            {{ parseLongName(item.client) }}
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
            <el-button
              v-if="isAgents"
              type="warning"
              :loading="loading && activeRemoveNdx === ndx"
              size="small"
              @click="updateEntity(item, ndx)"
            >
              Перенести в ДК
            </el-button>
            {{ isAgents ? "" : item.comment }}
          </div>
          <div
            v-if="!isAgents"
            class="widget-notes__list-item-field remove"
            @click.stop="remove(item)"
          ></div>
        </div>
      </div>
      <div
        v-if="notesList.length >= countToShow"
        class="widget-notes__more"
        @click="showMore"
      >
        Показать еще
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from "vue";
// import { useStore } from "vuex";
import { getNumFormat, toCurrency } from "@/helpers";
import { NOTE_TYPES } from "@/config/noteTypes";
import { useStore } from "vuex";
import moment from "moment";
import useNotes from "@/compositions/useNotes";
import useAgentsNotes from "@/compositions/useAgentsNotes";
import { parseLongName } from "@/helpers";

export default {
  components: {},
  props: {
    searchStr: {
      type: String,
      default: "",
    },
    editing: {
      type: Boolean,
      default: false,
    },
    ids: {
      type: Array,
      default: () => [],
    },
    isAgents: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const { filteredNotesList } = props.isAgents
      ? useAgentsNotes()
      : useNotes();
    // const store = useStore();
    const selectedItem = ref(null);
    const loading = ref(false);
    const activeRemoveNdx = ref(-1);

    const notesList = computed(() => {
      const search = props.searchStr.toLowerCase();
      if (!search) {
        return filteredNotesList.value;
      }
      return filteredNotesList.value.filter((item) => {
        return (
          item.client.toLowerCase().includes(search) ||
          item.type.toLowerCase().includes(search) ||
          item.inCurrency.toLowerCase().includes(search) ||
          item.comment.toLowerCase().includes(search) ||
          `${item.amount}`.toLowerCase().includes(search)
        );
      });
    });

    const countToShow = ref(20);
    const countIncrement = ref(20);

    const showMore = () => {
      countToShow.value += countIncrement.value;
    };

    const selectRow = (item) => {
      if (props.editing) {
        emit("collect", item.id);
        return;
      }
      emit("select", item);
    };

    const remove = async (item) => {
      await store.dispatch("dailyNote/removeEntity", item);
    };

    const updateEntity = async (item, ndx) => {
      activeRemoveNdx.value = ndx;
      const newData = { ...item };

      delete newData.client;
      delete newData.inCurrency;
      delete newData.isProfit;
      newData.category = 1; // жк
      newData.type = 1; // дебет
      newData.date = Math.floor((newData.date + 10800000) / 1000);
      newData.comment = "Перенос посредника";
      loading.value = true;
      await store.dispatch("dailyNote/updateEntity", newData);
      loading.value = false;
      activeRemoveNdx.value = -1;
    };

    return {
      notesList,
      selectedItem,
      loading,
      activeRemoveNdx,
      moment,
      NOTE_TYPES,
      countIncrement,
      countToShow,
      getNumFormat,
      selectRow,
      remove,
      showMore,
      parseLongName,
      toCurrency,
      updateEntity,
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
  padding-bottom: 10px;

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
    position: relative;

    &.editing {
      background-color: #ccc;
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

  &__more {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 40px;
    border-radius: $controlRadius;
    background-color: $colorRowGrayActive;
    margin: 0 auto 10px;

    &:hover {
      opacity: 0.8;
    }
  }

  &__list-item-field {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;
    position: relative;

    &.remove {
      cursor: pointer;
      width: 16px;
      height: 16px;
      background-image: url("~@/assets/icons/remove.png");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      position: absolute;
      right: 5px;
      top: 6px;
    }

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
