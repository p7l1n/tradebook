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
    <div
      class="main-menu__office"
      @click="
        $router.push({ name: 'login' });
        $store.dispatch('auth/logout', null);
      "
    >
      <div class="row">
        {{ userInfo?.sub?.split("@")[0] }}
        <span>{{ organizationName ? `(${organizationName})` : "" }}</span>
      </div>
      <div class="icon" />
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    const userInfo = computed(() => store.getters["auth/user"]);
    const isAdmin = computed(() => store.getters["auth/isAdmin"]);
    const organizationName = computed(
      () => store.getters["settings/organizationName"]
    );

    const menuItems = computed(() => {
      const items = [
        { title: "Балансы", route: "balances" },
        { title: "Журнал СД", route: "orders" },
        { title: "Журнал ДК", route: "notes" },
        { title: "Посредники", route: "agents" },
        { title: "Тетрадь", route: "dailynotes" },
        { title: "Контрагенты", route: "clients" },
      ];
      if (isAdmin.value) {
        items.push({ title: "Настройки", route: "settings" });
      }

      return items;
    });

    return {
      menuItems,
      userInfo,
      organizationName,
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
    // width: $menuWidth;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $textColorWhite;
    font-weight: bold;
    cursor: pointer;

    .row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    span {
      font-size: 13px;
    }

    .icon {
      cursor: pointer;
      width: 64px;
      height: 64px;
      background-image: url("~@/assets/icons/person.svg");
      background-size: contain;
      background-position: 50%;
      background-repeat: no-repeat;
      border-radius: 50%;
      background-color: $panelColorSecondary;
      margin: 0 15px;

      &:hover {
        cursor: pointer;
        opacity: 0.7;
      }
    }
  }
}
</style>
