<template>
  <MainMenu v-if="userInfo" />
  <router-view />
</template>
<script>
import MainMenu from "@/components/MainMenu";
import { computed, onMounted, watch } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    MainMenu,
  },
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters["auth/user"]);

    watch(
      () => userInfo.value?.jwt,
      async (jwt) => {
        if (jwt) {
          await store.dispatch("clients/fetchContragents");
          await store.dispatch("dailyNote/fetchNotes");
        }
      }
    );

    onMounted(async () => {
      setTimeout(async () => {
        if (userInfo.value?.jwt) {
          await store.dispatch("clients/fetchContragents");
          await store.dispatch("dailyNote/fetchNotes");
        }
      }, 500);
    });

    return {
      userInfo,
    };
  },
};
</script>
<style lang="scss">
body,
html {
  padding: 0;
  margin: 0;
}

* {
  transition: all 0.3s ease;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-notification {
  font-family: Avenir, Helvetica, Arial, sans-serif !important;
}
</style>
