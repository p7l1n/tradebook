<template>
  <MainMenu v-if="$route.name != 'login'" />
  <router-view />
</template>
<script>
import MainMenu from "@/components/MainMenu";

export default {
  components: {
    MainMenu,
  },
  setup() {},
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
