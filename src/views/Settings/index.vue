<template>
  <div class="settings">
    <SubMenu :active-index="activeMenuIndex" @selectMenu="onSelectMenu" />
    <div class="settings__widgets">
      <Organizations v-if="activeMenuIndex === 0" />
      <div class="settings__search">
        <el-input
          v-if="activeMenuIndex === 1"
          v-model="searchStr"
          style="width: 170px"
          placeholder="Поиск по юзерам"
          clearable
        />
      </div>
      <Claims v-if="activeMenuIndex === 1" :search-str="searchStr" />
      <Login
        v-if="activeMenuIndex === 2"
        :register-mode="true"
        @registered="onRegistered"
      />
      <BalancesAdmin v-if="activeMenuIndex === 3" />
    </div>
  </div>
</template>
<script>
import Organizations from "@/components/widgets/Organizations";
import Claims from "@/components/widgets/Claims";
import BalancesAdmin from "@/components/widgets/BalancesAdmin";
import Login from "../Login";
import SubMenu from "./components/SubMenu";
import { ref } from "vue";

export default {
  components: {
    Organizations,
    BalancesAdmin,
    Claims,
    Login,
    SubMenu,
  },
  setup() {
    const activeMenuIndex = ref(0);
    const searchStr = ref("");

    const onSelectMenu = (ndx) => {
      activeMenuIndex.value = ndx;
    };

    const onRegistered = () => {
      activeMenuIndex.value = 1;
    };

    return {
      searchStr,
      activeMenuIndex,
      onSelectMenu,
      onRegistered,
    };
  },
};
</script>
<style lang="scss" scoped>
.settings {
  &__widgets {
    width: calc(100% - 20px);
    padding: 20px;
    box-sizing: border-box;
  }

  &__search {
    display: flex;
    margin-bottom: 15px;
    width: 100%;
    align-items: center;
  }
}
</style>
