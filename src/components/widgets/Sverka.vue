<template>
  <div class="widget-profits-wrap">
    <el-input
      v-model="addressTron"
      placeholder="Введите кошелек USDT"
      clearable
      style="margin-bottom: 15px"
      @change="changeAddress"
    />
    <el-button
      type="warning"
      class="base-btn"
      style="height: 30px; margin-bottom: 15px"
      @click="$store.dispatch('sverka/clearList')"
    >
      Удалить все
    </el-button>

    <div class="widget-profits">
      <div class="widget-profits__title">Сверка кош USDT / Факт USDT</div>
      <div class="widget-profits__list">
        <div class="widget-profits__list-item">
          <div class="widget-profits__list-item-field">Дата</div>
          <div class="widget-profits__list-item-field label">Кош USDT</div>
          <div class="widget-profits__list-item-field label">Факт USDT</div>
          <div class="widget-profits__list-item-field label">Разница</div>
        </div>
        <el-empty
          v-if="!sverkaList?.length"
          :image-size="300"
          description="Данных нет"
        />
        <div
          class="widget-profits__list-item"
          v-for="(item, ndx) in sverkaList"
          :key="ndx"
          @click="selectRow(item)"
        >
          <div class="widget-profits__list-item-field strong">
            {{ moment(item.d).utcOffset(180).format("DD.MM,HH:mm") }}
          </div>
          <div class="widget-profits__list-item-field strong">
            {{ toCurrency(item.b) }}
          </div>
          <div class="widget-profits__list-item-field strong">
            {{ toCurrency(item.f) }}
          </div>
          <div
            :class="item.diff > 0 ? 'green' : 'red'"
            class="widget-profits__list-item-field strong"
          >
            {{ toCurrency(item.df) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { toCurrency } from "@/helpers";
import moment from "moment";

export default {
  components: {},
  setup() {
    const addressTron = ref("");
    const store = useStore();
    const address = computed(() => store.getters["sverka/address"]);
    const sverkaList = computed(() => store.getters["sverka/sverkaList"]);

    const changeAddress = (val) => {
      addressTron.value = val;
      store.dispatch("sverka/setAddress", addressTron.value);
    };

    onMounted(() => {
      if (address.value) {
        addressTron.value = address.value;
      }
    });

    return {
      addressTron,
      sverkaList,
      moment,
      toCurrency,
      changeAddress,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";
@import "@/assets/styles/breakpoints.scss";

.widget-profits-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}

.widget-profits {
  width: 100%;
  min-width: 600px; // минимальная ширина таблицы
  padding: 0 $paddingSmall;
  border-radius: $borderRadius;
  background-color: $panelColorLight;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: $breakpoint-tablet) {
    width: 100%;
  }

  @media (max-width: $breakpoint-mobile) {
    min-width: 100%;
  }

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
    height: auto;
    margin-top: 20px;
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
      font-family: "Roboto-Medium";
    }

    &.green {
      color: $colorGreenDark;
      font-family: "Roboto-Medium";
    }

    &.red {
      color: $colorRedDark;
      font-family: "Roboto-Medium";
    }

    &.label {
      font-size: 10px;
      text-transform: uppercase;
      color: $textColorGrayDark;
      font-family: "Roboto-Medium";
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
