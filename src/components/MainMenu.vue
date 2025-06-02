<template>
  <div class="main-menu">
    <div class="main-menu__items" :class="{ 'mobile-menu': isMobileMenuOpen }">
      <router-link
        v-for="(item, ndx) in menuItems"
        :to="item.route"
        :key="ndx"
        active-class="active"
        class="main-menu__items-item"
        @click="closeMobileMenu(item)"
      >
        {{ item.title }}
      </router-link>
    </div>
    <div
      class="burger-menu"
      @click="toggleMobileMenu"
      :class="{ active: isMobileMenuOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
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
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const isMobileMenuOpen = ref(false);
    const isMobile = ref(window.innerWidth <= 1433);

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 1433;
      if (!isMobile.value) {
        isMobileMenuOpen.value = false;
      }
    };

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const closeMobileMenu = (item) => {
      document.title = `TradeBook - ${item.title}`;
      if (isMobile.value) {
        isMobileMenuOpen.value = false;
      }
    };

    onMounted(() => {
      setTimeout(() => {
        const title = ` - ${
          document.querySelector(".main-menu__items-item.active")?.innerHTML ||
          ""
        }`;
        document.title = `TradeBook${title}`;
      }, 1000);
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });

    const userInfo = computed(() => store.getters["auth/user"]);
    const isAdmin = computed(() => store.getters["auth/isAdmin"]);
    const organizationName = computed(
      () => store.getters["settings/organizationName"]
    );

    const menuItems = computed(() => {
      const items = [
        { title: "Балансы", route: "balances" },
        { title: "Сделки", route: "orders" },
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
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
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
  position: fixed;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__items {
    display: flex;
    width: calc(100% - $menuWidth);
    height: 100%;

    @media (max-width: 1433px) {
      position: fixed;
      top: 80px;
      left: -100%;
      width: 250px;
      height: calc(100vh - 80px);
      background-color: $panelColor;
      flex-direction: column;
      transition: left 0.3s ease;
      padding: 20px 0;

      &.mobile-menu {
        left: 0;
      }
    }
  }

  &__items-item {
    min-width: $menuWidth;
    color: $textColorWhite;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;

    @media (max-width: 1433px) {
      min-width: auto;
      padding: 15px 20px;
      justify-content: flex-start;
    }

    &:hover {
      color: $textColorGreen;
      cursor: pointer;
    }

    &.active {
      color: $textColorGreen;
    }
  }

  .burger-menu {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    cursor: pointer;
    margin: 0 30px;
    position: relative;

    @media (max-width: 1433px) {
      display: flex;
    }

    span {
      width: 100%;
      height: 2px;
      background-color: $textColorWhite;
      transition: all 0.3s ease;
      position: absolute;
      left: 0;

      &:first-child {
        top: 0;
      }
      &:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
      }
      &:last-child {
        bottom: 0;
      }
    }

    &.active {
      span {
        &:first-child {
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }
        &:nth-child(2) {
          opacity: 0;
        }
        &:last-child {
          top: 50%;
          transform: translateY(-50%) rotate(-45deg);
        }
      }
    }
  }

  &__office {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $textColorWhite;
    font-family: "Roboto-Medium";
    cursor: pointer;
    margin-left: auto;

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
