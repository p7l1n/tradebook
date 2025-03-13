<template>
  <div class="login-page">
    <div class="login-form">
      <div class="login-form__title">Вход</div>
      <div class="login-form__icon"></div>
      <div class="login-form__field mt25">
        <Input placeholder="Логин" v-model="userName" />
      </div>
      <div class="login-form__field">
        <Input placeholder="Пароль" type="password" v-model="password" />
      </div>
      <div class="login-form__login-btn" @click="login">
        <Button title="Войти" />
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useStore } from "vuex";

export default {
  components: {
    Input,
    Button,
  },
  setup() {
    const userName = ref("");
    const password = ref("");
    const store = useStore();

    const login = () => {
      if (userName.value === "admin" && password.value === "12312345") {
        store.dispatch("auth/addUser", {
          userName: userName.value,
        });
        window.location.reload();
      } else {
        alert("Некорректный доступ");
      }
    };

    return {
      userName,
      password,
      login,
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
  height: 100vh;
  background-image: url("https://avatars.mds.yandex.net/i?id=ef87dc26201fba0ace05f0ce30f59027_l-5253062-images-thumbs&n=13");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
}

.login-form {
  width: 300px;
  height: 250px;
  margin: 0 auto;
  padding: $paddingSmall;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $panelColorLight;
  border-radius: $borderRadius;
  position: relative;
  overflow: hidden;

  &__icon {
    width: 50px;
    height: 50px;
    background-image: url("~@/assets/icons/person.svg");
    background-size: contain;
    background-position: 50%;
    background-repeat: no-repeat;
    border-radius: 50%;
    margin-top: 25px;
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
