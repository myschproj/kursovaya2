<template>
  <h1 class="text-h4 mb-4">Лифты</h1>
  <v-alert v-if="error" type="error" class="mb-3" :text="error" />
  <v-alert v-if="message" type="success" class="mb-3" :text="message" />
  <v-card class="pa-4 mb-4">
    <v-row>
      <v-col cols="12" md="3"><v-text-field v-model="form.name" label="Название" /></v-col>
      <v-col cols="12" md="3"><v-select v-model="form.currentFloorId" :items="floors" item-title="name" item-value="id" label="Текущий этаж" /></v-col>
      <v-col cols="12" md="2"><v-text-field v-model.number="form.capacity" label="Вместимость" type="number" /></v-col>
      <v-col cols="12" md="2"><v-text-field v-model.number="form.maxFloor" label="Макс. этаж" type="number" /></v-col>
      <v-col cols="12" md="2" class="d-flex align-center"><v-btn color="primary" @click="save">{{ form.id ? 'Сохранить' : 'Добавить' }}</v-btn></v-col>
    </v-row>
  </v-card>

  <v-table>
    <thead><tr><th>ID</th><th>Название</th><th>Этаж</th><th>Статус</th><th>Направление</th><th>Действия</th></tr></thead>
    <tbody>
      <tr v-for="item in elevators" :key="item.id">
        <td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.currentFloor?.name }}</td><td><StatusBadge :status="item.status" /></td><td>{{ item.direction }}</td>
        <td>
          <v-btn size="small" @click="edit(item)">Изменить</v-btn>
          <v-btn size="small" color="error" class="ml-2" :loading="deletingId === item.id" @click="remove(item.id)">Удалить</v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge.vue';
const elevators = ref([]);
const floors = ref([]);
const error = ref('');
const message = ref('');
const deletingId = ref(null);
const form = reactive({ id: null, name: '', currentFloorId: null, capacity: 8, maxFloor: 10 });
function reset() { Object.assign(form, { id: null, name: '', currentFloorId: floors.value[0]?.id, capacity: 8, maxFloor: 10 }); }
async function load() { const [e, f] = await Promise.all([api.get('/elevators'), api.get('/floors')]); elevators.value = e.data; floors.value = f.data; if (!form.currentFloorId) reset(); }
function edit(item) { Object.assign(form, { id: item.id, name: item.name, currentFloorId: item.currentFloorId, capacity: item.capacity, maxFloor: item.maxFloor }); }
async function save() { try { error.value = ''; message.value = ''; form.id ? await api.put(`/elevators/${form.id}`, form) : await api.post('/elevators', form); message.value = form.id ? 'Лифт обновлён' : 'Лифт добавлен'; reset(); await load(); } catch (e) { error.value = e.message; } }
async function remove(id) {
  if (!confirm('Удалить лифт? Связанные вызовы останутся в журнале без привязки к лифту.')) return;
  try {
    error.value = ''; message.value = ''; deletingId.value = id;
    const { data } = await api.delete(`/elevators/${id}`);
    message.value = data?.message || 'Лифт удалён';
    await load();
  } catch (e) {
    error.value = e.message;
  } finally {
    deletingId.value = null;
  }
}
onMounted(load);
</script>
