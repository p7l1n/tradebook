<template>
  <div class="widget-clients-wrap">
    <div class="widget-clients-controls">
      <CheckButton
        label="Редактировать"
        yes-title="Вкл"
        no-title="Выкл"
        :checked="editModeFlag"
        @check="onCheckEdit"
      />
    </div>
    <div class="widget-clients">
      <div class="widget-clients__title">Клиенты</div>
      <div class="widget-clients__list">
        <div class="widget-clients__list-item">
          <div class="widget-clients__list-item-field label">Клиент</div>
          <div class="widget-clients__list-item-field label">Телеграм</div>
          <div class="widget-clients__list-item-field label">Дополнительно</div>
        </div>
        <div
          :class="{
            editMode: editModeFlag,
            active: selectedItem && selectedItem.id === item.id,
          }"
          class="widget-clients__list-item"
          v-for="(item, ndx) in clientsList"
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
        </div>
      </div>
    </div>
    <!-- edit -->
    <div v-if="editModeFlag" class="widget-clients__edit-form">
      <div class="input-field row">
        <Input placeholder="Клиент" v-model="name" />
      </div>
      <div class="input-field row">
        <Input placeholder="Телеграм" v-model="telegram" />
      </div>
      <div class="input-field row">
        <Input placeholder="Дополнительно" v-model="info" />
      </div>
      <Button
        :title="isEditing ? 'Сохранить' : 'Добавить'"
        @click="updateEntity"
      />
      <Button title="Очистить поля" class="mt15" @click="clearAll" />
      <Button title="Удалить клиента" class="mt15" @click="removeEntity" />
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

export default {
  components: {
    Input,
    Button,
    CheckButton,
  },
  setup() {
    const store = useStore();
    const editModeFlag = ref(false);
    const selectedItem = ref(null);
    const id = ref("");
    const name = ref("");
    const telegram = ref("");
    const info = ref("");

    const clientsList = computed(() => store.getters["clients/clients"]);

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
    };

    const isEditing = computed(() => {
      return id.value === selectedItem.value?.id;
    });

    const updateEntity = async () => {
      if (isEditing.value) {
        store.dispatch("clients/updateEntity", {
          name: name.value,
          telegram: telegram.value,
          info: info.value,
          id: id.value,
        });
        clearAll();
      } else {
        store.dispatch("clients/addEntity", {
          id: `${Math.random()}`.slice(2),
          name: name.value,
          telegram: telegram.value,
          info: info.value,
        });
        clearAll();
      }
    };

    const removeEntity = () => {
      store.dispatch("clients/removeEntity", selectedItem.value.id);
      clearAll();
    };

    const onCheckEdit = (val) => {
      editModeFlag.value = val;
    };

    return {
      clientsList,
      id,
      name,
      telegram,
      info,
      //
      selectedItem,
      isEditing,

      editModeFlag,
      getNumFormat,
      clearAll,
      selectRow,
      updateEntity,
      removeEntity,
      onCheckEdit,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-clients-wrap {
  display: flex;
  flex-direction: column;
  position: relative;
}

.widget-clients-controls {
  position: absolute;
  left: 780px;
  top: 0;
}

.widget-clients {
  width: 700px;
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
      background-color: $panelColorActive;
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
