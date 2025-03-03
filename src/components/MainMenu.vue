<template>
  <div class="main-menu">
    <div class="main-menu__items">
      <router-link
        v-for="(item, ndx) in menuItems"
        :to="item.route"
        :key="ndx"
        active-class="active"
        class="main-menu__items-item"
      >
        {{ item.title }}
      </router-link>
    </div>
    <div class="main-menu__office" @click="$router.push({ name: 'login' })">
      <div class="icon" />
    </div>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  setup() {
    const menuItems = ref([
      { title: "Балансы", route: "balances" },
      { title: "Журнал СД", route: "orders" },
      { title: "Журнал ДК", route: "notes" },
      { title: "Тетрадь", route: "dailynotes" },
      { title: "Контрагенты", route: "clients" },
    ]);

    return {
      menuItems,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.main-menu {
  width: 100%;
  height: 80px;
  background-color: $panelColor;

  display: flex;
  align-items: center;

  &__items {
    display: flex;
    width: calc(100% - $menuWidth);
    height: 100%;
  }

  &__items-item {
    min-width: $menuWidth;
    color: $textColorWhite;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;

    &:hover {
      color: $textColorGreen;
      cursor: pointer;
    }

    &.active {
      color: $textColorGreen;
    }
  }

  &__office {
    width: $menuWidth;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      width: 64px;
      height: 64px;
      background-image: url("~@/assets/icons/person.svg");
      background-size: contain;
      background-position: 50%;
      background-repeat: no-repeat;
      border-radius: 50%;
      background-color: $panelColorSecondary;

      &:hover {
        cursor: pointer;
        opacity: 0.7;
      }
    }
  }
}
</style>
