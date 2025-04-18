<template>
  <div class="organization-widget">
    <div class="organization-widget__organizations">
      <div class="organization-widget__label">Выберите кассу для работы</div>
      <el-select
        v-model="selectedOrganization"
        clearable
        filterable
        placeholder="Выбор кассы"
        style="width: 100%"
        size="large"
        @change="onSelectOrganization"
      >
        <el-option
          v-for="item in organizationsItems"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="organization-widget__label mt10">Редактировать</div>
      <el-input
        placeholder="Касса (город)"
        v-model="organizationValue"
        class="base-input"
      />
      <div class="row">
        <el-button
          type="warning"
          :loading="loadingEdit"
          class="base-btn mt10"
          @click="updateEntity('edit')"
        >
          Сохранить
        </el-button>
        <el-button
          type="success"
          :loading="loading"
          class="base-btn mt10"
          @click="updateEntity('add')"
        >
          Добавить
        </el-button>
      </div>
      <div class="row mt10">
        <el-checkbox
          v-model="isRemove"
          label="Удалить кассу"
          size="large"
          border
          class="base-input"
        />
      </div>
      <div v-if="isRemove" class="row mt10">
        <el-button
          type="danger"
          :loading="loadingRemove"
          class="base-btn"
          @click="removeEntity"
        >
          Удалить кассу
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";

export default {
  setup() {
    const store = useStore();
    const selectedOrganization = ref("");
    const organizationValue = ref("");
    const loading = ref(false);
    const loadingRemove = ref(false);
    const loadingEdit = ref(false);

    const isRemove = ref(false);
    const organizationsList = computed(
      () => store.getters["settings/organizationsList"]
    );
    const organizationId = computed(
      () => store.getters["settings/organizationId"]
    );
    const organizationsItems = computed(() => {
      return organizationsList.value.map((item) => {
        return {
          ...item,
          title: item.name,
          value: item.name,
        };
      });
    });

    const onSelectOrganization = (val) => {
      selectedOrganization.value = val;
      organizationValue.value = val;
      const organization = organizationsList.value.find(
        (item) => item.name === val
      );
      if (organization?.id) {
        store.dispatch("settings/setOrganizationId", organization.id);
        ElNotification({
          title: "Касса",
          message: `Вы переключись на кассу ${organization.name}`,
          type: "success",
        });
      }
    };

    const createEmptyData = async (id) => {
      const rates = [
        {
          title: "RUB",
          buy: 0,
          sell: 0,
          spreadBuy: 0,
          spreadSell: 0,
          apiKey: "rub",
          points: 2,
          inCurrencyId: 1,
          organizationId: id,
        },
        {
          title: "USD",
          buy: 0,
          sell: 0,
          spreadBuy: 0,
          spreadSell: 0,
          apiKey: "usd",
          points: 3,
          inCurrencyId: 2,
          organizationId: id,
        },
        {
          title: "EUR",
          buy: 0,
          sell: 0,
          spreadBuy: 0,
          spreadSell: 0,
          apiKey: "eur",
          points: 3,
          inCurrencyId: 3,
          organizationId: id,
        },
        {
          title: "WUSD",
          buy: 0,
          sell: 0,
          spreadBuy: 0,
          spreadSell: 0,
          apiKey: "wusd",
          points: 3,
          inCurrencyId: 4,
          organizationId: id,
        },
        {
          title: "USDT",
          buy: 0,
          sell: 0,
          spreadBuy: 0,
          spreadSell: 0,
          apiKey: "usdt",
          points: 3,
          inCurrencyId: 5,
          organizationId: id,
        },
      ];

      const clients = [
        {
          name: "Прибыль",
          telegram: "",
          info: "",
          type: 2,
          organizationId: id,
        },
        {
          name: "Тетрадь",
          telegram: "",
          info: "",
          type: 1,
          organizationId: id,
        },
        {
          name: "Выручка",
          telegram: "",
          info: "",
          type: 1,
          organizationId: id,
        },
      ];

      await Promise.all(
        rates.map(async (rate) => {
          return await store.dispatch("rates/addRateEntity", rate);
        })
      );
      await Promise.all(
        clients.map(async (cl) => {
          return await store.dispatch("clients/addEntity", cl);
        })
      );
    };

    const updateEntity = async (mode) => {
      if (mode === "edit") {
        const organization = organizationsList.value.find(
          (item) => item.name === selectedOrganization.value
        );
        if (!organization) {
          ElNotification({
            title: "Касса",
            message: "Выберите организацию для редактирования",
            type: "warning",
          });
          return;
        }
        if (!organizationValue.value.trim()) {
          ElNotification({
            title: "Касса",
            message: "Укажите название кассы или город",
            type: "warning",
          });
          return;
        }
        loadingEdit.value = true;
        await store.dispatch("settings/updateOrganization", {
          name: organizationValue.value,
          id: organization.id,
        });
        loadingEdit.value = false;
        return;
      }

      if (mode === "add") {
        if (!organizationValue.value.trim()) {
          ElNotification({
            title: "Касса",
            message: "Укажите название кассы или город",
            type: "warning",
          });
          return;
        }
        loading.value = true;
        const { id } = await store.dispatch("settings/addNewOrganization", {
          name: organizationValue.value,
        });
        if (id) {
          onSelectOrganization(
            organizationsList.value.find((org) => org.id == id)?.name
          );
          await createEmptyData(id);
        }
        loading.value = false;
        return;
      }
    };

    const removeEntity = async () => {
      const organization = organizationsList.value.find(
        (item) => item.name === selectedOrganization.value
      );
      if (!organization) {
        ElNotification({
          title: "Касса",
          message: "Выберите организацию для удаления",
          type: "warning",
        });
        return;
      }
      loadingRemove.value = true;
      await store.dispatch("settings/removeOrganization", organization);
      onSelectOrganization(organizationsList.value[0].name);
      loadingRemove.value = false;
    };

    onMounted(async () => {
      const organization = organizationsList.value.find(
        (item) => item.id == organizationId.value
      );
      if (organization) {
        selectedOrganization.value = organization.name;
      }
    });

    return {
      loading,
      loadingEdit,
      loadingRemove,
      isRemove,
      organizationId,
      selectedOrganization,
      organizationsItems,
      organizationValue,
      onSelectOrganization,
      updateEntity,
      removeEntity,
    };
  },
};
</script>
<style lang="scss" scoped>
.organization-widget {
  .row {
    display: flex;
    align-items: center;
  }

  .mt10 {
    margin-top: 10px;
  }

  &__label {
    font-size: 16px;
    text-align: left;
    margin-bottom: 5px;
  }

  &__organizations {
    width: 300px;
    padding: 20px;
    background-color: $panelColorActive;
    border-radius: $borderRadius;
  }
}
</style>
