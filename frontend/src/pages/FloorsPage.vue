<template>
  <h1 class="text-h4 mb-4">Этажи</h1>
  <v-alert v-if="error" type="error" class="mb-3" :text="error" />
  <v-alert v-if="message" type="success" class="mb-3" :text="message" />
  <v-card class="pa-4 mb-4">
    <v-row>
      <v-col cols="12" md="3"><v-text-field v-model.number="form.number" label="Номер этажа" type="number" /></v-col>
      <v-col cols="12" md="5"><v-text-field v-model="form.name" label="Название" /></v-col>
      <v-col cols="12" md="2"><v-checkbox v-model="form.isAvailable" label="Доступен" /></v-col>
      <v-col cols="12" md="2" class="d-flex align-center"><v-btn color="primary" @click="save">{{ form.id ? 'Сохранить' : 'Добавить' }}</v-btn></v-col>
    </v-row>
  </v-card>
  <v-table>
    <thead><tr><th>ID</th><th>Номер</th><th>Название</th><th>Доступность</th><th>Действия</th></tr></thead>
    <tbody>
      <tr v-for="item in floors" :key="item.id">
        <td>{{ item.id }}</td><td>{{ item.number }}</td><td>{{ item.name }}</td><td>{{ item.isAvailable ? 'Да' : 'Нет' }}</td>
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
const floors = ref([]); const error = ref(''); const message = ref(''); const deletingId = ref(null); const form = reactive({ id:null, number:1, name:'', isAvailable:true });
function reset(){Object.assign(form,{id:null, number:1, name:'', isAvailable:true});}
async function load(){ const {data}=await api.get('/floors'); floors.value=data; }
function edit(item){Object.assign(form,item);}
async function save(){try{error.value=''; message.value=''; form.id?await api.put(`/floors/${form.id}`,form):await api.post('/floors',form); message.value=form.id?'Этаж обновлён':'Этаж добавлен'; reset(); await load();}catch(e){error.value=e.message;}}
async function remove(id){
  if(!confirm('Удалить этаж? Вызовы с этим этажом будут удалены, а лифты будут перенесены на ближайший доступный этаж.')) return;
  try{
    error.value=''; message.value=''; deletingId.value=id;
    const {data}=await api.delete(`/floors/${id}`);
    message.value=data?.message || 'Этаж удалён';
    if(form.id === id) reset();
    await load();
  }catch(e){
    error.value=e.message;
  }finally{
    deletingId.value=null;
  }
}
onMounted(load);
</script>
