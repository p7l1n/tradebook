<template>
  <div class="login-page" :class="{ registerMode }">
    <div class="login-form wrap">
      <el-tabs
        v-model="tabName"
        class="login-tabs"
        type="border-card"
        @tab-click="onTabClick"
      >
        <!-- reg -->
        <el-tab-pane
          v-if="registerMode"
          label="Регистрация"
          name="register"
          class="login-form"
        >
          <div class="login-form__icon"></div>
          <div class="login-form__field mt25">
            <el-input
              v-model="userName"
              placeholder="Email"
              clearable
              class="base-input"
            />
          </div>
          <div class="login-form__field">
            <el-input
              v-model="password"
              placeholder="Пароль"
              type="password"
              clearable
              class="base-input"
            />
          </div>
          <div class="login-form__field">
            <el-input
              v-model="passwordRepeat"
              placeholder="Повторите пароль"
              type="password"
              clearable
              class="base-input"
            />
          </div>
          <div class="login-form__login-btn" @click="login">
            <el-button type="primary" :loading="loading" class="base-btn"
              >Регистрация</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="!registerMode"
          label="Авторизация"
          name="login"
          class="login-form"
        >
          <div class="login-form__icon"></div>
          <div class="login-form__field mt25">
            <el-input
              v-model="userName"
              placeholder="Email"
              clearable
              class="base-input"
            />
          </div>
          <div class="login-form__field">
            <el-input
              v-model="password"
              placeholder="Пароль"
              clearable
              type="password"
              class="base-input"
            />
          </div>
          <div class="login-form__login-btn" @click="login">
            <el-button type="success" :loading="loading" class="base-btn"
              >Логин</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";

export default {
  components: {},
  props: {
    registerMode: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const userName = ref("");
    const password = ref("");
    const passwordRepeat = ref("");
    const tabName = ref(props.registerMode ? "register" : "login");
    const store = useStore();
    const loading = ref(false);

    const clearForm = () => {
      userName.value = "";
      password.value = "";
      passwordRepeat.value = "";
    };

    const login = async () => {
      if (!userName.value.trim().length || !userName.value.includes("@")) {
        ElNotification({
          title: "Авторизация",
          message: "Проверьте правильность поля email",
          type: "error",
        });
        return;
      }
      if (tabName.value !== "login") {
        if (password.value.length < 8) {
          ElNotification({
            title: "Регистрация",
            message: "Минимальный пароль 8 символов",
            type: "error",
          });
          return;
        }
        if (password.value !== passwordRepeat.value) {
          ElNotification({
            title: "Регистрация",
            message: "Пароли не совпадают",
            type: "error",
          });
          return;
        }
        loading.value = true;
        const res = await store.dispatch("auth/register", {
          email: userName.value,
          password: password.value,
        });

        loading.value = false;

        if (props.registerMode) {
          emit("registered");
          return;
        }

        if (res.success) {
          clearForm();
          tabName.value = "login";
        }
        return;
      }

      loading.value = true;
      await store.dispatch("auth/login", {
        email: userName.value,
        password: password.value,
      });
      loading.value = false;
    };

    const onTabClick = () => {
      clearForm();
    };

    return {
      tabName,
      userName,
      password,
      passwordRepeat,
      loading,
      login,
      onTabClick,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";
@import "@/assets/styles/base.scss";

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #cccccc17;
  //background-image: url("https://avatars.mds.yandex.net/i?id=ef87dc26201fba0ace05f0ce30f59027_l-5253062-images-thumbs&n=13");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;

  &.registerMode {
    display: flex;
    padding-top: 80px;
    align-items: flex-start;
    background-color: initial;
  }
}

.login-form {
  width: 300px;
  // height: 250px;
  margin: 0 auto;
  padding: $paddingSmall;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $panelColorLight;
  border-radius: $borderRadius;
  position: relative;
  overflow: hidden;

  &.wrap {
    padding: 20px 40px;
  }

  &__icon {
    width: 50px;
    min-height: 50px;
    background-image: url("~@/assets/icons/person.svg");
    background-size: contain;
    background-position: 50%;
    background-repeat: no-repeat;
    border-radius: 50%;
    margin-bottom: 20px;
    background-color: $panelColorSecondary;
  }

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

  &__field {
    margin-bottom: 15px;
    width: 100%;
  }

  &__login-btn {
    width: 100%;
  }
}
</style>
