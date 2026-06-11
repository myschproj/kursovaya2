<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
    <v-card width="430" class="pa-6" elevation="8">
      <v-card-title class="text-h5">Вход в систему</v-card-title>
      <v-card-subtitle>Введите учетные данные</v-card-subtitle>
      <v-card-text>
        <v-alert v-if="error" type="error" class="mb-4" :text="error" />
        <v-form @submit.prevent="submit">
          <v-text-field v-model="email" label="Email" type="email" prepend-inner-icon="mdi-email" required />
          <v-text-field v-model="password" label="Пароль" type="password" prepend-inner-icon="mdi-lock" required />
          <v-btn type="submit" block color="primary" :loading="loading">Войти</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
const email = ref('admin@example.com');
const password = ref('admin123');
const loading = ref(false);
const error = ref('');
const auth = useAuthStore();
const router = useRouter();
async function submit() {
  try {
    loading.value = true;
    error.value = '';
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
