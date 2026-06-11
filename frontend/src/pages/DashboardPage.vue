<template>
  <h1 class="text-h4 mb-4">Панель диспетчера</h1>
  <v-alert class="mb-4 feedback-card" type="info">
    Здесь отображается текущее состояние лифтов и быстрый вызов кабины.
  </v-alert>

  <div class="status-grid mb-6">
    <v-card v-for="elevator in elevators" :key="elevator.id" class="pa-4">
      <div class="d-flex justify-space-between align-center">
        <h2 class="text-h6">{{ elevator.name }}</h2>
        <StatusBadge :status="elevator.status" />
      </div>
      <p class="mt-2">Этаж: {{ elevator.currentFloor?.number }}</p>
      <p>Направление: {{ directionLabel(elevator.direction) }}</p>
      <p>Вместимость: {{ elevator.capacity }} чел.</p>
    </v-card>
  </div>

  <v-card class="pa-4" max-width="620">
    <h2 class="text-h6 mb-3">Создать вызов</h2>
    <v-alert v-if="message" :type="messageType" class="mb-3" :text="message" />
    <v-row>
      <v-col cols="12" md="5">
        <v-select v-model="fromFloorId" :items="floors" item-title="name" item-value="id" label="Откуда" />
      </v-col>
      <v-col cols="12" md="5">
        <v-select v-model="toFloorId" :items="floors" item-title="name" item-value="id" label="Куда" />
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn color="primary" @click="createCall">Вызвать</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge.vue';

const elevators = ref([]);
const floors = ref([]);
const fromFloorId = ref(null);
const toFloorId = ref(null);
const message = ref('');
const messageType = ref('success');

function directionLabel(direction) {
  return { UP: 'вверх', DOWN: 'вниз', STOPPED: 'стоит' }[direction] || direction;
}

async function load() {
  const [eRes, fRes] = await Promise.all([api.get('/elevators'), api.get('/floors')]);
  elevators.value = eRes.data;
  floors.value = fRes.data;
  fromFloorId.value = floors.value[0]?.id;
  toFloorId.value = floors.value[1]?.id;
}

async function createCall() {
  try {
    const { data } = await api.post('/calls', { fromFloorId: fromFloorId.value, toFloorId: toFloorId.value });
    messageType.value = 'success';
    message.value = `Вызов создан. Назначен лифт: ${data.elevator?.name || 'ожидает назначения'}`;
    await load();
  } catch (e) {
    messageType.value = 'error';
    message.value = e.message;
  }
}

onMounted(load);
</script>
