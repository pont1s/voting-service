<script lang="ts" setup>
import { computed, reactive } from 'vue';

import VInput from '@/components/kit/VInput.vue';
import VButton from '@/components/kit/VButton.vue';
import { registration } from '@/services/auth';
import { RegistrationUserDto } from '@/services/@types/auth';

const form = reactive({
  fullName: {
    value: '',
  },
  email: {
    value: '',
  },
  password: {
    value: '',
  },
});

const isFormDisabled = computed(() => !(form.fullName.value && form.email.value && form.password.value));

const onFormSubmitHandler = async () => {
  const formData: { [key: string]: string } = {};

  Object.entries(form).forEach(([fieldKey, fieldValue]) => {
    formData[fieldKey] = fieldValue.value;
  });

  const authToken = await registration(formData);
  console.log(authToken);
};
</script>

<template>
  <div class="login">
    <img
      class="logo"
      src="@/assets/images/logo.svg"
      alt="logo"
    >
    <div class="login-container">
      <div class="login-content">
        <h2>Новый аккаунт</h2>
        <div class="login-another-page">
          Уже есть аккаунт? <router-link :to="{ name: 'login' }">
            Войти
          </router-link>
        </div>
        <form class="login-form" @submit.prevent="onFormSubmitHandler">
          <div class="form-input">
            <v-input
              v-model:value="form.fullName.value"
              placeholder="Полное имя"
              style-type="form"
            />
          </div>
          <div class="form-input">
            <v-input
              v-model:value="form.email.value"
              placeholder="E-mail"
              style-type="form"
            />
          </div>
          <div class="form-input">
            <v-input
              v-model:value="form.password.value"
              placeholder="Пароль"
              style-type="form"
              type="password"
            />
          </div>
          <v-button
            class="login-action"
            type="primary"
            :fluid="true"
            native-type="submit"
            :disabled="isFormDisabled"
          >
            Зарегистрироваться
          </v-button>
        </form>
      </div>
    </div>
    <img
      class="illustration"
      src="@/assets/images/auth-illustration.png"
      alt="auth-illustration"
    >
  </div>
</template>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100%;
  padding: 4rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  gap: 3rem;

  a {
    color: var(--color-primary);
    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: 927px) {
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    padding: 6rem;
  }

  .logo {
    display: none;

    @media (min-width: 927px) {
      display: inherit;
    }

    position: absolute;
    width: 100px;
    height: 100px;
    top: 6rem;
    right: 6rem;
  }

  .illustration {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-height: 400px;

    @media (min-width: 927px) {
      max-height: 700px;
    }
  }

  .login-container {
    position: relative;

    @media (min-width: 927px) {
      display: flex;
      justify-content: flex-end;
      flex: 100%;
    }

    .login-content {
      width: 100%;

      @media (min-width: 927px) {
        max-width: 420px;
      }

      .login-another-page {
        @media (min-width: 927px) {
          font-size: 1.25rem;
        }
      }

      .login-form {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        @media (min-width: 927px) {
          margin-top: 2rem;
        }
      }

      .login-action {
        margin-top: 0.5rem;
      }
    }
  }
}
</style>
