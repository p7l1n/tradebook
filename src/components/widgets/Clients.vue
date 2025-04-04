<template>
  <div class="widget-clients-wrap">
    <!-- edit -->
    <el-input
      v-model="searchStr"
      style="width: 240px"
      placeholder="Поиск по контрагентам"
      clearable
      @input="onSearch"
      class="widget-clients-wrap__search"
    />
    <div v-if="false" class="widget-clients-controls">
      <CheckButton
        yes-title="Редакт"
        no-title="Выкл"
        :checked="editModeFlag"
        @check="onCheckEdit"
      />
    </div>
    <div v-if="editModeFlag" class="widget-clients__edit-form">
      <div class="row">
        <div class="input-field row">
          <Input placeholder="Контрагент" gray v-model="name" />
        </div>
        <div class="input-field row">
          <Input placeholder="Телеграм" gray v-model="telegram" />
        </div>
        <div class="input-field row">
          <Input placeholder="Дополнительно" gray v-model="info" />
        </div>
        <CheckGroupButton
          :items="typesItems"
          :active-index="activeTypesIndex"
          @check="onSelectType"
        />
      </div>
      <div class="row">
        <el-button
          v-if="!isSystemItem"
          type="success"
          :loading="loading"
          class="base-btn"
          style="margin-left: 10px"
          @enter="updateEntity"
          @click="updateEntity"
        >
          {{ isEditing ? "Сохранить" : "Добавить" }}
        </el-button>
        <Button v-if="!isSystemItem" title="Очистить" @click="clearAll" />
        <el-button
          v-if="isEditing && !isSystemItem"
          type="warning"
          :loading="loadingRemove"
          class="base-btn"
          style="margin-left: 10px"
          @enter="removeEntity"
          @click="removeEntity"
        >
          Удалить
        </el-button>
      </div>
    </div>
    <div class="widget-clients">
      <div class="widget-clients__title">Контрагенты</div>
      <div class="widget-clients__list">
        <div class="widget-clients__list-item">
          <div class="widget-clients__list-item-field label">Контрагент</div>
          <div class="widget-clients__list-item-field label">Телеграм</div>
          <div class="widget-clients__list-item-field label">Дополнительно</div>
          <div class="widget-clients__list-item-field label">Тип</div>
        </div>
        <el-empty
          v-if="!filteredClientsList.length"
          :image-size="300"
          description="Данных нет"
        />
        <div
          :class="{
            editMode: editModeFlag,
            active: selectedItem && selectedItem.id === item.id,
          }"
          class="widget-clients__list-item"
          v-for="(item, ndx) in filteredClientsList.slice(0, countToShow)"
          :key="ndx"
          @click="selectRow(item)"
        >
          <div class="widget-clients__list-item-field strong name">
            {{ item.name }}
          </div>
          <div class="widget-clients__list-item-field">
            {{ item.telegram }}
          </div>
          <div class="widget-clients__list-item-field">
            {{ item.info }}
          </div>
          <div class="widget-clients__list-item-field">
            {{ item.type }}
          </div>
        </div>
      </div>
      <div
        v-if="filteredClientsList.length >= countToShow"
        class="widget-clients__more"
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
import Input from "@/components/Input";
import Button from "@/components/Button";
import CheckButton from "@/components/CheckButton";
import { getNumFormat } from "@/helpers";
import CheckGroupButton from "@/components/CheckGroupButton";
import { CONTRAGENTS } from "@/config/noteTypes";
import { ElNotification } from "element-plus";

export default {
  components: {
    Input,
    Button,
    CheckButton,
    CheckGroupButton,
  },
  setup() {
    const store = useStore();
    const editModeFlag = ref(true);
    const selectedItem = ref(null);
    const id = ref("");
    const name = ref("");
    const telegram = ref("");
    const info = ref("");
    const searchStr = ref("");
    const typesItems = ref([
      CONTRAGENTS.client,
      CONTRAGENTS.operator,
      CONTRAGENTS.profit,
    ]);
    const loading = ref(false);
    const loadingRemove = ref(false);
    const activeTypesIndex = ref(0);

    const countToShow = ref(20);
    const countIncrement = ref(20);

    const showMore = () => {
      countToShow.value += countIncrement.value;
    };

    const clientsList = computed(() => store.getters["clients/clients"]);

    const isSystemItem = computed(() => {
      return (
        selectedItem.value &&
        ((selectedItem.value.name === "Прибыль" &&
          selectedItem.value.type === "Прибыль") ||
          selectedItem.value.name === "Тетрадь" ||
          selectedItem.value.name === "Выручка")
      );
    });

    const filteredClientsList = computed(() => {
      if (!searchStr.value) return clientsList.value;

      return clientsList.value.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchStr.value.toLowerCase()) ||
          item.type.toLowerCase().includes(searchStr.value.toLowerCase()) ||
          item.telegram.toLowerCase().includes(searchStr.value.toLowerCase()) ||
          item.info.toLowerCase().includes(searchStr.value.toLowerCase())
        );
      });
    });

    const onSelectType = (ndx) => {
      activeTypesIndex.value = ndx;
    };

    const clearAll = () => {
      selectedItem.value = null;
      name.value = "";
      telegram.value = "";
      info.value = "";
      id.value = "";
    };

    const selectRow = (item) => {
      if (!editModeFlag.value) return;

      selectedItem.value = item;
      name.value = selectedItem.value.name;
      telegram.value = selectedItem.value.telegram;
      info.value = selectedItem.value.info;
      id.value = selectedItem.value.id;
      activeTypesIndex.value = typesItems.value.findIndex(
        (type) => type === selectedItem.value.type
      );
    };

    const isEditing = computed(() => {
      return id.value === selectedItem.value?.id;
    });

    const updateEntity = async () => {
      if (!name.value.trim()) {
        ElNotification({
          title: "Контрагенты",
          message: `Укажите контрагента`,
          type: "warning",
        });
        return;
      }
      const find = clientsList.value.find(
        (item) =>
          item.name === name.value.trim() &&
          item.type === typesItems.value[activeTypesIndex.value]
      );
      if (!isEditing.value && find) {
        ElNotification({
          title: "Внимание",
          message: `Такой контрагент уже существует`,
          type: "warning",
        });
        return;
      }

      if (isEditing.value) {
        loading.value = true;
        store.dispatch("clients/updateEntity", {
          name: name.value,
          telegram: telegram.value,
          info: info.value,
          id: id.value,
          type: activeTypesIndex.value,
        });
        loading.value = false;
        clearAll();
      } else {
        loading.value = true;
        await store.dispatch("clients/addEntity", {
          name: name.value,
          telegram: telegram.value,
          info: info.value,
          type: activeTypesIndex.value,
        });
        loading.value = false;
        clearAll();
      }
    };

    const removeEntity = async () => {
      if (!selectedItem.value) return;
      loadingRemove.value = true;
      await store.dispatch("clients/removeEntity", selectedItem.value.id);
      loadingRemove.value = false;
      clearAll();
    };

    const onCheckEdit = (val) => {
      editModeFlag.value = val;
    };

    const onSearch = () => {};

    return {
      clientsList,
      id,
      name,
      telegram,
      info,
      //
      loading,
      loadingRemove,
      isSystemItem,

      selectedItem,
      isEditing,
      typesItems,
      activeTypesIndex,
      editModeFlag,
      searchStr,
      filteredClientsList,
      countIncrement,
      countToShow,
      showMore,
      getNumFormat,
      clearAll,
      selectRow,
      updateEntity,
      removeEntity,
      onCheckEdit,
      onSelectType,
      onSearch,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-clients-wrap {
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative;

  &__search {
    position: absolute;
    top: -60px;
  }
}

.widget-clients-controls {
  margin-left: 10px;
}

.widget-clients {
  width: 100%;
  padding: $paddingSmall;
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
    &:nth-child(even) {
      background-color: $panelColorActive;
    }

    &.active {
      background-color: $colorRowGrayActive;
      border-radius: $controlRadius;

      .widget-clients__list-item-field {
        &:nth-child(even) {
          background-color: initial;
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
    height: 40px;

    &.name {
      text-align: left;
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
    }

    &:nth-child(even) {
      // background-color: $panelColorActive;
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
    width: 1000px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .row {
      display: flex;
      align-items: center;

      .ui-button {
        width: 33%;
        margin-left: 10px;
      }
    }

    .input-field {
      width: 25%;
      margin-right: 10px;

      &.row {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
