<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list nav>
      <v-list-item title="Управление лифтами" subtitle="Курсовой проект" prepend-icon="mdi-elevator" />
      <v-divider class="my-2" />
      <v-list-item to="/" title="Панель" prepend-icon="mdi-view-dashboard" />
      <v-list-item to="/calls" title="Вызовы" prepend-icon="mdi-bell-ring" />
      <v-list-item to="/elevators" title="Лифты" prepend-icon="mdi-elevator-passenger" />
      <v-list-item to="/floors" title="Этажи" prepend-icon="mdi-office-building" />
      <v-list-item to="/events" title="Журнал" prepend-icon="mdi-history" />
      <v-list-item v-if="auth.isAdmin" to="/users" title="Пользователи" prepend-icon="mdi-account-group" />
      <v-list-item to="/settings" title="Настройки" prepend-icon="mdi-cog" />
    </v-list>
  </v-navigation-drawer>

  <v-app-bar app color="primary">
    <v-app-bar-nav-icon @click="drawer = !drawer" aria-label="Открыть меню" />
    <v-toolbar-title>Система управления лифтами</v-toolbar-title>
    <v-spacer />
    <span class="mr-4">{{ auth.user?.name }}</span>
    <v-btn variant="text" @click="auth.logout">Выйти</v-btn>
  </v-app-bar>

  <v-main>
    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
const drawer = ref(true);
const auth = useAuthStore();
</script>
