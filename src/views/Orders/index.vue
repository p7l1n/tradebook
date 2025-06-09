<template>
  <div class="orders-page">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div :class="{ isLoading }" class="orders-page__widgets">
      <div v-if="activeMenuIndex === 0" class="orders-page__edit">
        <CheckButton
          yes-title="Редакт."
          no-title="Выкл"
          :checked="editModeFlag"
          @check="onCheckEdit"
        />
        <div v-if="activeMenuIndex === 0 && collectionsIds.length">
          <el-button
            type="warning"
            :loading="loadingRemove"
            class="base-btn ml10"
            style="height: 30px"
            @click="removeOrders"
          >
            Удалить
          </el-button>
        </div>
      </div>
      <OrderFormLine v-if="activeMenuIndex === 0" />
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
        </div>
        <Orders
          v-if="!isLoading && activeMenuIndex !== 2"
          :editing="editModeFlag"
          :ids="collectionsIds"
          :hide-payed="activeMenuIndex === 0"
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
          :style="{
            width: '740px',
          }"
          :title="
            selectedOrder
              ? `Редактирование сделки ${selectedOrder?.id}`
              : 'Новая сделка'
          "
          v-click-away="closeForm"
        >
          <OrderForm @close="closeForm" :edit-order="selectedOrder" />
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
import FilterOrders from "./components/FilterOrders";
import Orders from "@/components/widgets/Orders";
import Loader from "@/components/Loader";

import Modal from "@/components/Modal";
import ModalContent from "@/components/ModalContent";
import OrderForm from "@/views/Orders/components/OrderForm";
import OrderFormLine from "./components/OrderFormLine";
import EditFieldsForm from "@/views/Orders/components/EditFieldsForm";
import TotalInfo from "@/components/widgets/TotalInfo";
import CheckButton from "@/components/CheckButton";

import { useStore } from "vuex";
import { onMounted, ref, computed } from "vue";

import { ElNotification } from "element-plus";

export default {
  components: {
    SubMenu,
    Settings,
    Loader,
    Orders,
    Modal,
    ModalContent,
    OrderForm,
    OrderFormLine,
    EditFieldsForm,
    FilterOrders,
    TotalInfo,
    CheckButton,
  },
  setup() {
    const store = useStore();
    const activeMenuIndex = ref(0);
    const editOrderForm = ref(false);
    const editOrdersFields = ref(false);
    const selectedOrder = ref(null);
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

    const onCheckEdit = (val) => {
      editModeFlag.value = val;
      if (!editModeFlag.value) {
        collectionsIds.value = [];
      }
    };

    const loadingRemove = ref(false);

    const removeOrders = async () => {
      loadingRemove.value = true;
      collectionsIds.value.forEach(async (id) => {
        await store.dispatch("orders/removeOrderEntity", { id });
      });
      loadingRemove.value = false;

      ElNotification({
        title: "Успешно",
        message: `Выбранные заявки удалены`,
        type: "success",
      });
    };

    onMounted(async () => {
      // await store.dispatch("rates/fetchRates");
    });

    return {
      activeMenuIndex,
      isLoading,
      editOrderForm,
      editOrdersFields,
      selectedOrder,
      filterOptions,
      editModeFlag,
      collectionsIds,
      loadingRemove,
      onSelectMenu,
      closeForm,
      onSelectOrder,
      onEditOrdersFields,
      closeEditOrdersFields,
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
@import "@/assets/styles/breakpoints";

.orders-page {
  position: relative;
  min-height: 100vh;

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

    .orders-page__widgets-item {
      width: 70%;
    }

    .balance-page__widgets-item {
      width: 30%;
    }

    @media (max-width: $breakpoint-tablet) {
      flex-direction: column;

      .orders-page__widgets-item,
      .balance-page__widgets-item {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
      }
    }
  }

  &__widgets {
    width: 100%;
    padding: $paddingLarge;
    box-sizing: border-box;

    @media (max-width: $breakpoint-tablet) {
      padding: 16px;
    }

    &.isLoading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 120px);
    }
  }

  &__edit {
    display: flex;
    align-items: center;
    position: absolute;
    top: 5px;

    @media (max-width: $breakpoint-tablet) {
      position: static;
      margin-bottom: 20px;
    }
  }
}
</style>
