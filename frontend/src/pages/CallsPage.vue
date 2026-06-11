<template>
  <h1 class="text-h4 mb-4">Вызовы лифта</h1>
  <v-card class="pa-4 mb-4">
    <v-row>
      <v-col cols="12" md="4"><v-select v-model="fromFloorId" :items="floors" item-title="name" item-value="id" label="Этаж отправления" /></v-col>
      <v-col cols="12" md="4"><v-select v-model="toFloorId" :items="floors" item-title="name" item-value="id" label="Этаж назначения" /></v-col>
      <v-col cols="12" md="2"><v-select v-model="strategy" :items="strategies" label="Алгоритм" /></v-col>
      <v-col cols="12" md="2" class="d-flex align-center"><v-btn color="primary" @click="createCall">Создать</v-btn></v-col>
    </v-row>
  </v-card>
  <v-alert v-if="message" :type="messageType" class="mb-3" :text="message" />
  <v-table>
    <thead><tr><th>ID</th><th>Откуда</th><th>Куда</th><th>Лифт</th><th>Статус</th><th>Дата</th><th>Действия</th></tr></thead>
    <tbody>
      <tr v-for="call in calls" :key="call.id">
        <td>{{ call.id }}</td><td>{{ call.fromFloor?.name }}</td><td>{{ call.toFloor?.name }}</td><td>{{ call.elevator?.name || '-' }}</td><td><StatusBadge :status="call.status" /></td><td>{{ new Date(call.createdAt).toLocaleString() }}</td>
        <td><v-btn size="small" @click="cancel(call.id)" :disabled="['CANCELED','COMPLETED'].includes(call.status)">Отменить</v-btn></td>
      </tr>
    </tbody>
  </v-table>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge.vue';
const floors=ref([]); const calls=ref([]); const fromFloorId=ref(null); const toFloorId=ref(null); const strategy=ref('nearest'); const strategies=['nearest','destination']; const message=ref(''); const messageType=ref('success');
async function load(){ const [f,c]=await Promise.all([api.get('/floors'),api.get('/calls')]); floors.value=f.data; calls.value=c.data; fromFloorId.value ||= floors.value[0]?.id; toFloorId.value ||= floors.value[1]?.id; }
async function createCall(){try{const {data}=await api.post('/calls',{fromFloorId:fromFloorId.value,toFloorId:toFloorId.value,strategy:strategy.value}); messageType.value='success'; message.value=`Вызов создан, лифт: ${data.elevator?.name || 'не назначен'}`; await load();}catch(e){messageType.value='error'; message.value=e.message;}}
async function cancel(id){await api.patch(`/calls/${id}/cancel`); await load();}
onMounted(load);
</script>
