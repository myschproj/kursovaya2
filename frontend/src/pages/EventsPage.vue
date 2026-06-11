<template>
  <h1 class="text-h4 mb-4">Журнал событий</h1>
  <v-alert type="info" class="mb-4">Журнал используется для аудита, анализа ошибок и контроля действий пользователей.</v-alert>
  <v-table>
    <thead><tr><th>Дата</th><th>Тип</th><th>Сообщение</th><th>Пользователь</th><th>Лифт</th></tr></thead>
    <tbody><tr v-for="event in events" :key="event.id"><td>{{ new Date(event.createdAt).toLocaleString() }}</td><td>{{ event.eventType }}</td><td>{{ event.message }}</td><td>{{ event.user?.name || '-' }}</td><td>{{ event.elevator?.name || '-' }}</td></tr></tbody>
  </v-table>
</template>
<script setup>
import { onMounted, ref } from 'vue'; import { api } from '../api/client';
const events=ref([]); async function load(){const {data}=await api.get('/events'); events.value=data;} onMounted(load);
</script>
