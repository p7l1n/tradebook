<template>
  <div class="orders-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div :class="{ isLoading }" class="orders-page__widgets">
      <!-- быстрый доступ к покупке -->
      <TradeMenu
        v-if="activeMenuIndex === 0"
        @buyUSDT="setTradeParam"
        @sellUSDT="setTradeParam"
        @buyUSD="setTradeParam"
        @sellUSD="setTradeParam"
        @buyEUR="setTradeParam"
        @sellEUR="setTradeParam"
        @buyWUSD="setTradeParam"
        @sellWUSD="setTradeParam"
      />
      <div v-if="activeMenuIndex === 0" class="orders-page__edit">
        <CheckButton
          yes-title="Редакт."
          no-title="Выкл"
          :checked="editModeFlag"
          @check="onCheckEdit"
        />
        <div v-if="activeMenuIndex === 0 && collectionsIds.length">
          <Button
            title="Удалить"
            style="width: 100px; margin-left: 10px"
            @click="removeOrders"
          />
        </div>
      </div>
      <!-- панель фильтров -->
      <FilterOrders v-if="activeMenuIndex === 1" />
      <!-- настройки полей таблицы -->
      <Settings
        v-if="activeMenuIndex === 2"
        @editOrdersFields="onEditOrdersFields"
      />
      <Loader v-if="isLoading" />
      <div class="orders-page__row">
        <div class="orders-page__col mt-15">
          <TotalInfo
            v-if="
              !isLoading && activeMenuIndex === 1 && filterOptions.showStats
            "
            max-width
            class="orders-page__widgets-item"
          />
          <Rates
            v-if="
              !isLoading && activeMenuIndex === 1 && filterOptions.showStats
            "
            class="balance-page__widgets-item ml-15"
          />
        </div>
        <Orders
          v-if="!isLoading && activeMenuIndex !== 2"
          :editing="editModeFlag"
          :ids="collectionsIds"
          class="orders-page__widgets-item"
          @collect="onCollect"
          @select="onSelectOrder"
        />
      </div>
    </div>
    <!-- редактирование заявки -->
    <teleport v-if="editOrderForm" to="body">
      <Modal>
        <ModalContent
          :title="selectedOrder ? 'Редактирование сделки' : 'Новая сделка'"
          v-click-away="closeForm"
        >
          <OrderForm
            @close="closeForm"
            :edit-order="selectedOrder"
            :trade-initial-param="tradeInitialParam"
          />
        </ModalContent>
      </Modal>
    </teleport>
    <!-- редактирование полей -->
    <teleport v-if="editOrdersFields" to="body">
      <Modal>
        <ModalContent
          title="Отображение полей в таблице сделок"
          v-click-away="closeEditOrdersFields"
        >
          <EditFieldsForm />
        </ModalContent>
      </Modal>
    </teleport>
  </div>
</template>
<script>
import SubMenu from "./components/SubMenu";
import Settings from "./components/Settings";
import TradeMenu from "./components/TradeMenu";
import FilterOrders from "./components/FilterOrders";
import Orders from "@/components/widgets/Orders";
import Loader from "@/components/Loader";
import Button from "@/components/Button";

import Modal from "@/components/Modal";
import ModalContent from "@/components/ModalContent";
import OrderForm from "@/views/Orders/components/OrderForm";
import EditFieldsForm from "@/views/Orders/components/EditFieldsForm";
import TotalInfo from "@/components/widgets/TotalInfo";
import Rates from "@/components/widgets/Rates";
import CheckButton from "@/components/CheckButton";

import { useStore } from "vuex";
import { onMounted, ref, computed } from "vue";

import { ElNotification } from "element-plus";

export default {
  components: {
    SubMenu,
    Settings,
    TradeMenu,
    Loader,
    Orders,
    Modal,
    ModalContent,
    OrderForm,
    EditFieldsForm,
    FilterOrders,
    TotalInfo,
    Rates,
    CheckButton,
    Button,
  },
  setup() {
    const store = useStore();
    const activeMenuIndex = ref(0);
    const editOrderForm = ref(false);
    const editOrdersFields = ref(false);
    const selectedOrder = ref(null);
    const tradeInitialParam = ref("");
    const editModeFlag = ref(false);
    const collectionsIds = ref([]);

    const isLoading = computed(() => store.getters["rates/isLoading"]);
    const filterOptions = computed(() => store.getters["orders/filter"]);

    const onCollect = (id) => {
      if (collectionsIds.value.includes(id)) {
        collectionsIds.value = collectionsIds.value.filter(
          (collId) => collId != id
        );
      } else {
        collectionsIds.value.push(id);
      }
    };

    const onSelectMenu = (ndx) => {
      activeMenuIndex.value = ndx;
    };

    const closeForm = () => {
      editOrderForm.value = false;
    };

    const onSelectOrder = (order) => {
      selectedOrder.value = order;
      editOrderForm.value = true;
    };

    const onEditOrdersFields = () => {
      editOrdersFields.value = true;
    };

    const closeEditOrdersFields = () => {
      editOrdersFields.value = false;
    };

    const setTradeParam = (param) => {
      tradeInitialParam.value = param;
      editOrderForm.value = true;
      selectedOrder.value = null;
    };

    const onCheckEdit = (val) => {
      editModeFlag.value = val;
      if (!editModeFlag.value) {
        collectionsIds.value = [];
      }
    };

    const removeOrders = () => {
      collectionsIds.value.forEach((id) => {
        store.dispatch("orders/removeOrderEntity", { id });
      });

      ElNotification({
        title: "Успешно",
        message: `Выбранные заявки удалены`,
        type: "success",
      });
    };

    onMounted(async () => {
      await store.dispatch("rates/fetchRates");
    });

    return {
      activeMenuIndex,
      isLoading,
      editOrderForm,
      editOrdersFields,
      selectedOrder,
      tradeInitialParam,
      filterOptions,
      editModeFlag,
      collectionsIds,
      onSelectMenu,
      closeForm,
      onSelectOrder,
      onEditOrdersFields,
      closeEditOrdersFields,
      setTradeParam,
      onCheckEdit,
      onCollect,
      removeOrders,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.orders-page {
  .mt-15 {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .ml-15 {
    margin-left: 15px;
  }

  &__row {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__col {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
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

  &__edit {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
}
</style>
