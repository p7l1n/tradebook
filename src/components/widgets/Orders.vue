<template>
  <div class="widget-orders-wrap">
    <div class="widget-orders">
      <div class="widget-orders__title">Журнал сделок</div>
      <div class="widget-orders__list">
        <div class="widget-orders__list-item">
          <div
            v-if="showFields?.id?.show"
            class="widget-orders__list-item-field label"
          >
            ID
          </div>
          <div
            v-if="showFields?.date?.show"
            class="widget-orders__list-item-field label"
          >
            Дата
          </div>
          <div
            v-if="showFields?.type?.show"
            class="widget-orders__list-item-field label"
          >
            Тип
          </div>
          <div
            v-if="showFields?.client?.show"
            class="widget-orders__list-item-field label"
          >
            Клиент
          </div>
          <div
            v-if="showFields?.operator?.show"
            class="widget-orders__list-item-field label"
          >
            Оператор
          </div>
          <div class="widget-orders__list-item-field label">Приход</div>
          <div class="widget-orders__list-item-field label">Сумма</div>
          <div class="widget-orders__list-item-field label">Курс</div>
          <div class="widget-orders__list-item-field label">Расход</div>
          <div class="widget-orders__list-item-field label">Сумма</div>
          <div
            v-if="showFields?.hint?.show"
            class="widget-orders__list-item-field label"
          >
            Подсказка
          </div>
          <div
            v-if="showFields?.dateChange?.show"
            class="widget-orders__list-item-field label"
          >
            Дата изм
          </div>
        </div>
        <el-empty
          v-if="!ordersList.length"
          :image-size="300"
          description="Данных нет"
        />
        <div
          :class="{
            editing: editing && ids.includes(item.id),
          }"
          class="widget-orders__list-item"
          v-for="(item, ndx) in ordersList"
          :key="ndx"
          @click="selectRow(item)"
        >
          <el-checkbox
            v-model="item.status"
            size="large"
            class="toggler"
            @click.stop="() => {}"
            @change="onChangeStatus(item)"
          />
          <div
            v-if="showFields?.id?.show"
            class="widget-orders__list-item-field"
          >
            {{ `${item.id}`.slice(0, 9) }}
          </div>
          <div
            v-if="showFields?.date?.show"
            class="widget-orders__list-item-field"
          >
            {{ moment(item.date).format("DD.MM,HH:mm") }}
          </div>
          <div
            v-if="showFields?.type?.show"
            class="widget-orders__list-item-field strong clicked"
          >
            {{ item.type }}
          </div>
          <div
            v-if="showFields?.client?.show"
            class="widget-orders__list-item-field"
          >
            {{ item.client }}
          </div>
          <div
            v-if="showFields?.operator?.show"
            class="widget-orders__list-item-field"
          >
            {{ item.operator }}
          </div>
          <div class="widget-orders__list-item-field green">
            {{ item.inCurrency }}
          </div>
          <div class="widget-orders__list-item-field strong">
            {{ toCurrency(item.inAmount) }}
          </div>
          <div class="widget-orders__list-item-field">
            {{ item.rate }}
          </div>
          <div class="widget-orders__list-item-field red">
            {{ ORDER_TYPES.trade !== item.type ? item.outCurrency : "" }}
          </div>
          <div class="widget-orders__list-item-field strong">
            {{
              ORDER_TYPES.trade !== item.type ? toCurrency(item.outAmount) : ""
            }}
          </div>
          <div
            v-if="showFields?.hint?.show"
            class="widget-orders__list-item-field mini"
          >
            {{ ORDER_TYPES.trade !== item.type ? getHint(item) : "" }}
          </div>
          <div
            v-if="showFields?.dateChange?.show"
            class="widget-orders__list-item-field mini"
          >
            {{ moment(item.dateChange).format("DD.MM,HH:mm") }}
          </div>
          <div
            class="widget-orders__list-item-field remove"
            @click.stop="remove(item)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { getNumFormat, toCurrency } from "@/helpers";
import { ORDER_TYPES } from "@/config/orderTypes";
import moment from "moment";
import useStats from "@/compositions/useStats";

export default {
  components: {},
  props: {
    editing: {
      type: Boolean,
      default: false,
    },
    ids: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { filteredOrdersList: ordersList } = useStats();
    const store = useStore();
    const selectedItem = ref(null);
    const title = ref("");
    const buy = ref("");
    const sell = ref("");
    const spreadBuy = ref("");
    const spreadSell = ref("");
    const apiKey = ref("");
    const points = ref("");

    // const ratesList = computed(() => store.getters["rates/rates"]);
    // const ordersList = computed(() => store.getters["orders/orders"]);
    const showFields = computed(() => store.getters["orders/showFields"]);

    const selectRow = (item) => {
      if (props.editing) {
        emit("collect", item.id);
        return;
      }
      emit("select", item);
    };

    const getHint = (item) => {
      if (item.outCurrency === "USDT") {
        return `Продажа ${item.outCurrency} за ${item.inCurrency}`;
      }

      return `Покупка ${item.inCurrency} за ${item.outCurrency}`;
    };

    const getOutAmount = (item) => {
      if (item.outCurrency === "USDT") {
        return toCurrency(+item.inAmount / +item.rate);
      }
      return toCurrency(+item.inAmount * +item.rate);
    };

    const onChangeStatus = (item) => {
      const updateItem = { ...item };
      store.dispatch("orders/updateOrderEntity", updateItem);
    };

    const remove = (item) => {
      store.dispatch("orders/removeOrderEntity", item);
    };

    return {
      ORDER_TYPES,
      ordersList,
      title,
      buy,
      sell,
      spreadBuy,
      spreadSell,
      apiKey,
      points,
      //
      selectedItem,
      moment,
      showFields,
      getNumFormat,
      selectRow,
      remove,
      toCurrency,
      getHint,
      getOutAmount,
      onChangeStatus,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-orders-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.widget-orders {
  width: 100%;
  padding: 0 $paddingSmall;
  border-radius: $borderRadius;
  background-color: $panelColorLight;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .toggler {
    position: absolute;
    left: 5px;
    top: -6px;
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
    margin-top: 20px;
    height: auto;
    padding-bottom: 10px;
  }

  &__list-item {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;

    &.editing {
      background-color: #ccc;
    }

    &.active {
      background-color: $colorRowGrayActive;
      border-radius: $controlRadius;

      .widget-rates__list-item-field {
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

  // edit
  &__edit-form {
    width: 400px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    padding: $paddingSmall;
    border-radius: $borderRadius;
    background-color: $panelColorLight;

    .input-field {
      margin-bottom: 15px;

      &.row {
        display: flex;
        align-items: center;

        .mr15 {
          margin-right: 15px;
        }
      }
    }
  }
}

.mt15 {
  margin-top: 5px;
}
</style>
