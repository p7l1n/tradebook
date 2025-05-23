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
            v-if="showFields?.num?.show"
            class="widget-orders__list-item-field label"
          >
            Номер
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
            v-if="showFields?.customComment?.show"
            class="widget-orders__list-item-field label"
          >
            Комм.
          </div>
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
            payed: item?.comment?.includes('payed'),
            disabled: loading && processingId === item.id,
          }"
          class="widget-orders__list-item"
          v-for="item in ordersListWithType.slice(0, countToShow)"
          :key="item.id"
          @click="selectRow(item)"
        >
          <el-checkbox
            v-show="!item?.comment?.includes('payed')"
            v-model="item.status"
            size="large"
            class="toggler"
            :disabled="loading && processingId === item.id"
            @click.stop="() => {}"
            @change="loading ? () => {} : onChangeStatus(item)"
          />
          <div
            v-if="showFields?.id?.show"
            class="widget-orders__list-item-field"
          >
            {{ `${item.id}`.slice(0, 9) }}
          </div>
          <div
            v-if="showFields?.num?.show"
            class="widget-orders__list-item-field"
          >
            {{ item.customNum }}
          </div>
          <div
            v-if="showFields?.date?.show"
            class="widget-orders__list-item-field"
          >
            {{ moment(item.date).utcOffset(180).format("DD.MM, HH:mm") }}
          </div>
          <div
            v-if="showFields?.type?.show"
            class="widget-orders__list-item-field strong clicked"
          >
            {{ item.type }}{{ item.agent ? "(П)" : "" }}
          </div>
          <div
            v-if="showFields?.client?.show"
            class="widget-orders__list-item-field"
          >
            {{ parseLongName(item.client) }}
          </div>
          <div
            v-if="showFields?.operator?.show"
            class="widget-orders__list-item-field"
          >
            {{ parseLongName(item.operator) }}
          </div>
          <div class="widget-orders__list-item-field green">
            {{ item.inAmount !== 0 ? item.inCurrency : "" }}
          </div>
          <div class="widget-orders__list-item-field strong">
            {{ getAmountIn(item) }}
          </div>
          <div class="widget-orders__list-item-field">
            {{
              item.rate !== 0
                ? item.agent
                  ? `${item.rate}(${item.agentRate})`
                  : item.rate
                : ""
            }}
          </div>
          <div class="widget-orders__list-item-field red">
            {{ item.outAmount !== 0 ? item.outCurrency : "" }}
          </div>
          <div class="widget-orders__list-item-field strong">
            {{ getAmountOut(item) }}
          </div>
          <div
            v-if="showFields?.customComment?.show"
            class="widget-orders__list-item-field mini"
          >
            {{ item.customComment }}
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
            {{
              moment(item.dateChange).utcOffset(180).format("DD.MM.YY,HH:mm")
            }}
          </div>
          <div
            v-show="isAdmin || !item?.comment?.includes('payed')"
            class="widget-orders__list-item-field remove"
            @click.stop="remove(item)"
          ></div>
        </div>
      </div>
      <div
        v-if="ordersList.length >= countToShow"
        class="widget-orders__more"
        @click="showMore"
      >
        Показать еще
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
import useOrders from "@/compositions/useOrders";
import { parseLongName } from "@/helpers";
import { ElNotification } from "element-plus";

export default {
  components: {},
  props: {
    hidePayed: {
      type: Boolean,
      default: false,
    },
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
    const { getOrderAPIFormat } = useOrders();
    const { filteredOrdersList: ordersList } = useStats();
    const store = useStore();
    const countToShow = ref(400);
    const countIncrement = ref(400);
    const loading = ref(false);
    const processingId = ref(null);

    const ordersListWithType = computed(() => {
      return props.hidePayed
        ? ordersList.value.filter((order) => !order.comment.includes("payed"))
        : ordersList.value;
    });

    const isAdmin = computed(() => store.getters["auth/isAdmin"]);

    const showMore = () => {
      countToShow.value += countIncrement.value;
    };

    // const ratesList = computed(() => store.getters["rates/rates"]);
    // const ordersList = computed(() => store.getters["orders/orders"]);
    const showFields = computed(() => store.getters["orders/showFields"]);
    const agentNotesList = computed(() => store.getters["agents/notes"]);

    const selectRow = (item) => {
      if (props.editing) {
        emit("collect", item.id);
        return;
      }
      emit("select", item);
    };

    const getHint = (item) => {
      if (item.outCurrency === "USDT") {
        return `Прод. ${item.outCurrency} за ${item.inCurrency}`;
      }

      return `Пок. ${item.inCurrency} за ${item.outCurrency}`;
    };

    const getOutAmount = (item) => {
      if (item.outCurrency === "USDT") {
        return toCurrency(+item.inAmount / +item.rate);
      }
      return toCurrency(+item.inAmount * +item.rate);
    };

    const onChangeStatus = async (item) => {
      if (loading.value) return;
      processingId.value = item.id;

      const order = getOrderAPIFormat(item);
      const status = item.status;
      loading.value = true;
      // order.status = !order.status;

      await store.dispatch("orders/updateOrderEntity", order);
      if (order.agentId === 0) {
        loading.value = false;
        return;
      }
      if (status === true) {
        // добавить в жк
        await store.dispatch("dailyNote/addNewEntity", {
          amount: order.agentAmount,
          category: 2,
          comment: `${order.id}`, // link id with order
          clientId: order.agentId,
          inCurrencyId: order.agentCurrencyId,
          date: Math.floor((+new Date() + 10800000) / 1000),
          type: 1,
        });
      }
      if (status === false) {
        const findForRemove = agentNotesList.value.find((note) => {
          return note.comment == item.id;
        });

        if (findForRemove) {
          await store.dispatch("dailyNote/removeEntity", findForRemove);
        } else {
          ElNotification({
            title: "Удаление посредники",
            message: `Запись по посреднику не найдена`,
            type: "warning",
          });
        }
      }
      loading.value = false;
    };

    const remove = async (item) => {
      await store.dispatch("orders/removeOrderEntity", item);
    };

    const getAmountIn = (item) => {
      if (item.kassaAmountIn === item.inAmount) {
        return item.inAmount !== 0 ? toCurrency(item.inAmount) : "";
      }
      return item.inAmount !== 0
        ? `${toCurrency(item.inAmount)} (${toCurrency(item.kassaAmountIn)})`
        : "";
    };

    const getAmountOut = (item) => {
      if (item.kassaAmountOut === item.outAmount) {
        return item.outAmount !== 0 ? toCurrency(item.outAmount) : "";
      }
      return item.outAmount !== 0
        ? `${toCurrency(item.outAmount)} (${toCurrency(item.kassaAmountOut)})`
        : "";
    };

    return {
      ORDER_TYPES,
      ordersList,
      loading,
      moment,
      showFields,
      countToShow,
      countIncrement,
      isAdmin,
      ordersListWithType,
      processingId,
      parseLongName,
      showMore,
      getNumFormat,
      selectRow,
      remove,
      toCurrency,
      getHint,
      getOutAmount,
      onChangeStatus,
      getAmountIn,
      getAmountOut,
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
  overflow-x: auto;
}

.widget-orders {
  width: 100%;
  min-width: 1200px;
  padding: 0 $paddingSmall;
  box-sizing: border-box;
  border-radius: $borderRadius;
  background-color: $panelColorLight;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;

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
    height: auto;
    margin-top: 20px;
    padding-bottom: 10px;
  }

  &__list-item {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    font-size: 14px;

    &:nth-child(even) {
      background-color: $colorRowNth;
    }

    &.editing {
      background-color: $colorSelected;
    }

    &.payed {
      background-color: $payedColor;
    }

    &.disabled {
      opacity: 0.2;
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
    min-height: 30px;
    position: relative;

    &.remove {
      cursor: pointer;
      width: 16px;
      height: 16px;
      background-image: url("~@/assets/icons/remove.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: 50%;
      position: absolute;
      right: -5px;
      top: 0;
    }

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
