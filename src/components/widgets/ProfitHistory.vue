<template>
  <div class="widget-profits-wrap">
    <div class="widget-profits">
      <div class="widget-profits__title">История снятий прибыли</div>
      <div class="widget-profits__list">
        <div class="widget-profits__list-item">
          <!-- <div class="widget-profits__list-item-field label">ID</div> -->
          <div class="widget-profits__list-item-field label">Дата</div>
          <div class="widget-profits__list-item-field label">Сумма</div>
          <div class="widget-profits__list-item-field label">Действие</div>
        </div>
        <el-empty
          v-if="!filteredProfitHistory.length"
          :image-size="300"
          description="Данных нет"
        />
        <div
          :class="{
            active: selectedItem && selectedItem.apiKey === item.apiKey,
          }"
          class="widget-profits__list-item"
          v-for="(item, ndx) in filteredProfitHistory"
          :key="ndx"
          @click="selectRow(item)"
        >
          <!-- <div class="widget-profits__list-item-field">
            {{ `${item.id}`.slice(0, 9) }}
          </div> -->
          <div class="widget-profits__list-item-field strong">
            {{ moment(item.date).utcOffset(360).format("DD.MM.YY,HH:mm") }}
          </div>
          <div class="widget-profits__list-item-field strong green">
            {{ toCurrency(item.amount) }}
          </div>
          <div class="widget-profits__list-item-field strong green">
            <el-button
              size="small"
              type="danger"
              :loading="removeLoading"
              @click="removeProfit(item)"
              >Отменить снятие</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { toCurrency } from "@/helpers";
import { NOTE_TYPES } from "@/config/noteTypes";
import moment from "moment";
import { ElNotification } from "element-plus";
import useNotes from "@/compositions/useNotes";

export default {
  components: {},
  setup(_, { emit }) {
    const store = useStore();
    const selectedItem = ref(null);
    const removeLoading = ref(false);

    const { filteredProfitHistory } = useNotes();
    const notesList = computed(() => store.getters["note/notes"]);

    const selectRow = (item) => {
      emit("select", item);
    };

    const removeProfit = async (profitItem) => {
      removeLoading.value = true;

      // ищем в журнале ДК эту запись тоже
      const noteDKItem = notesList.value.find(
        (dk) => dk.date === profitItem.date
      );

      if (!noteDKItem) {
        ElNotification({
          title: "Ошибка",
          message: `Данное снятие не найдено в журнале ДК`,
          type: "error",
        });
        removeLoading.value = false;
        return;
      }
      try {
        await store.dispatch("dailyNote/removeEntity", noteDKItem);
        await store.dispatch("note/removeProfit", profitItem);
        ElNotification({
          title: "Отменено",
          message: `Снятие кассы на сумму ${toCurrency(profitItem.amount)}`,
          type: "warning",
        });
      } catch (err) {
        ElNotification({
          title: "Отменено",
          message: `Ошибка при снятии суммы`,
          type: "error",
        });
        removeLoading.value = false;
      }
      removeLoading.value = false;
    };

    return {
      selectedItem,
      moment,
      NOTE_TYPES,
      filteredProfitHistory,
      removeLoading,
      toCurrency,
      selectRow,
      removeProfit,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-profits-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.widget-profits {
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
    padding-bottom: 10px;
  }

  &__list-item {
    display: flex;
    align-items: center;

    &.active {
      background-color: $colorRowGrayActive;
      border-radius: $controlRadius;

      .widget-profits__list-item-field {
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
