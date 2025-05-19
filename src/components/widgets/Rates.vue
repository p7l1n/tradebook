<template>
  <div class="widget-rates-wrap">
    <!-- <div v-if="editMode" class="widget-rates-controls">
      <CheckButton
        label="Обновлять цены с сервера"
        yes-title="Да"
        no-title="Нет"
        :checked="updateFromServerFlag"
        @check="onCheckUpdatePrice"
      />
    </div> -->
    <!-- <div @click="update">ОБНОВИТЬ</div> -->
    <div class="widget-rates">
      <div class="widget-rates__title">Курс валют</div>
      <div class="widget-rates__list">
        <div class="widget-rates__list-item">
          <div class="widget-rates__list-item-field label"></div>
          <div class="widget-rates__list-item-field label">Покупка</div>
          <div class="widget-rates__list-item-field label">Продажа</div>
          <div class="widget-rates__list-item-field label">Покуп. -</div>
          <div class="widget-rates__list-item-field label">Продаж. +</div>
        </div>
        <div
          :class="{
            editMode,
            active: selectedItem && selectedItem.apiKey === item.apiKey,
          }"
          class="widget-rates__list-item"
          v-for="(item, ndx) in ratesList"
          :key="ndx"
          @click="selectRow(item)"
        >
          <div class="widget-rates__list-item-field strong">
            {{ item.title }}
          </div>
          <div class="widget-rates__list-item-field green">
            {{ getNumFormat(+item.buy - +item.spreadBuy || 0, item.points) }}
          </div>
          <div class="widget-rates__list-item-field red">
            {{ getNumFormat(+item.sell + +item.spreadSell || 0, item.points) }}
          </div>
          <div class="widget-rates__list-item-field">-{{ item.spreadBuy }}</div>
          <div class="widget-rates__list-item-field">
            +{{ item.spreadSell }}
          </div>
        </div>
      </div>
    </div>
    <!-- edit -->
    <div v-if="editMode" class="widget-rates__edit-form">
      <div v-if="false" class="input-field row">
        <Input
          placeholder="Валюта"
          :disabled="isEditing"
          class="mr15"
          v-model="title"
        />
      </div>
      <div class="input-field row">
        <el-input
          placeholder="Покупка"
          v-model="buy"
          :formatter="numberFormatter"
          :parser="numberParser"
          class="base-input green mr15"
        />
        <el-input
          placeholder="Продажа"
          v-model="sell"
          :formatter="numberFormatter"
          :parser="numberParser"
          class="base-input red mr15"
        />
      </div>
      <div class="input-field row">
        <el-input
          placeholder="Покуп. -"
          v-model="spreadBuy"
          :formatter="numberFormatter"
          :parser="numberParser"
          class="base-input mr15"
        />
        <el-input
          placeholder="Продаж. +"
          v-model="spreadSell"
          :formatter="numberFormatter"
          :parser="numberParser"
          class="base-input mr15"
        />
      </div>
      <div class="input-field row">
        <Input
          v-if="false"
          placeholder="Валюта"
          :disabled="isEditing"
          class="mr15"
          v-model="title"
        />
        <Input
          v-if="false"
          placeholder="Тикер (API)"
          :disabled="isEditing"
          v-model="apiKey"
          class="mr15"
        />
        <el-input
          placeholder="Округление"
          v-model="points"
          :formatter="numberFormatter"
          :parser="numberParser"
          class="base-input mr15"
        />
      </div>
      <el-button
        type="warning"
        :loading="loading"
        class="base-btn"
        @click="updateEntity"
      >
        {{ isEditing ? "Сохранить" : "Добавить" }}
      </el-button>
      <!-- <Button
        :title="isEditing ? 'Сохранить' : 'Добавить'"
        @click="updateEntity"
      /> -->
      <!-- <Button title="Очистить поля" class="mt15" @click="clearAll" /> -->
      <!-- <Button
        v-if="selectedItem && !fixedRates.includes(selectedItem?.title)"
        title="Удалить текущий курс"
        class="mt15"
        @click="removeRateEntity"
      /> -->
    </div>
  </div>
</template>
<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Input from "@/components/Input";
// import Button from "@/components/Button";
// import CheckButton from "@/components/CheckButton";
import { getNumFormat } from "@/helpers";
import { numberFormatter, numberParser } from "@/formatters";

export default {
  components: {
    Input,
    // Button,
    // CheckButton,
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const selectedItem = ref(null);
    const title = ref("");
    const buy = ref("");
    const sell = ref("");
    const spreadBuy = ref("");
    const spreadSell = ref("");
    const apiKey = ref("");
    const points = ref("");
    const loading = ref(false);
    const fixedRates = []; // ["RUB", "USD", "EUR"];

    const ratesList = computed(() => store.getters["rates/rates"]);

    const clearAll = () => {
      selectedItem.value = null;
      title.value = "";
      buy.value = "";
      sell.value = "";
      spreadBuy.value = "";
      spreadSell.value = "";
      apiKey.value = "";
      points.value = "";
    };

    const isEditing = computed(() => {
      return apiKey.value === selectedItem.value?.apiKey;
    });

    const selectRow = (item) => {
      if (!props.editMode) return;

      selectedItem.value = item;
      title.value = selectedItem.value.title;
      buy.value = selectedItem.value.buy;
      sell.value = selectedItem.value.sell;
      spreadBuy.value = selectedItem.value.spreadBuy;
      spreadSell.value = selectedItem.value.spreadSell;
      apiKey.value = selectedItem.value.apiKey;
      points.value = selectedItem.value.points;
    };

    const getIndexOfTitle = (title) => {
      if (title === "RUB") return 1;
      if (title === "USD") return 2;
      if (title === "USDT") return 5;
      if (title === "EUR") return 3;
      if (title === "WUSD") return 4;
    };

    const updateEntity = async () => {
      loading.value = true;
      if (isEditing.value) {
        await store.dispatch("rates/updateRateEntity", {
          id: selectedItem.value.id,
          title: selectedItem.value.title,
          buy: +buy.value,
          sell: +sell.value,
          spreadBuy: +spreadBuy.value,
          spreadSell: +spreadSell.value,
          apiKey: apiKey.value,
          points: points.value,
          inCurrencyId: getIndexOfTitle(title.value),
        });
        loading.value = false;
        // clearAll();
        selectRow(ratesList.value["RUB"]);
      } else {
        await store.dispatch("rates/addRateEntity", {
          title: title.value,
          buy: +buy.value,
          sell: +sell.value,
          spreadBuy: +spreadBuy.value,
          spreadSell: +spreadSell.value,
          apiKey: apiKey.value,
          points: points.value,
        });
        loading.value = false;
        // clearAll();
        selectRow(ratesList.value["RUB"]);
      }
    };

    const removeRateEntity = () => {
      store.dispatch("rates/removeRateEntity", selectedItem.value.title);
      clearAll();
    };

    const updateFromServerFlag = computed(
      () => store.getters["rates/updateFromServer"]
    );

    const onCheckUpdatePrice = (val) => {
      store.dispatch("rates/setUpdateFromServer", val);
    };

    const update = async () => {
      await store.dispatch("rates/addRateEntity", {
        title: "USDT",
        buy: 0,
        sell: 0,
        spreadBuy: 0,
        spreadSell: 0,
        apiKey: "usdt",
        points: 3,
        inCurrencyId: 5,
        organizationId: 5,
      });
    };

    onMounted(async () => {
      selectRow(ratesList.value["RUB"]);
    });

    return {
      ratesList,
      title,
      buy,
      sell,
      spreadBuy,
      spreadSell,
      apiKey,
      points,
      //
      isEditing,
      selectedItem,
      fixedRates,
      loading,

      updateFromServerFlag,
      getNumFormat,
      clearAll,
      selectRow,
      updateEntity,
      removeRateEntity,
      onCheckUpdatePrice,
      numberFormatter,
      numberParser,
      update,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.widget-rates-wrap {
  display: flex;
  flex-direction: column;
  position: relative;
}

.widget-rates-controls {
  position: absolute;
  left: 480px;
  top: 0;
}

.widget-rates {
  // width: 400px;
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

      .widget-rates__list-item-field {
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
    width: 120px;
    height: 40px;

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
    // width: 400px;
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
