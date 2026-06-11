<template>
  <h1 class="text-h4 mb-4">Пользователи</h1>
  <v-alert v-if="error" type="error" class="mb-3" :text="error" />
  <v-alert v-if="message" type="success" class="mb-3" :text="message" />
  <v-card class="pa-4 mb-4">
    <v-row>
      <v-col cols="12" md="3"><v-text-field v-model="form.name" label="Имя" /></v-col>
      <v-col cols="12" md="3"><v-text-field v-model="form.email" label="Email" /></v-col>
      <v-col cols="12" md="2"><v-text-field v-model="form.password" label="Пароль" type="password" /></v-col>
      <v-col cols="12" md="2"><v-select v-model="form.roleId" :items="roles" item-title="name" item-value="id" label="Роль" /></v-col>
      <v-col cols="12" md="2" class="d-flex align-center"><v-btn color="primary" @click="save">{{ form.id ? 'Сохранить' : 'Создать' }}</v-btn></v-col>
    </v-row>
  </v-card>
  <v-table>
    <thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Роль</th><th>Действия</th></tr></thead>
    <tbody>
      <tr v-for="u in users" :key="u.id">
        <td>{{u.id}}</td><td>{{u.name}}</td><td>{{u.email}}</td><td>{{u.role?.name}}</td>
        <td>
          <v-btn size="small" @click="edit(u)">Изменить</v-btn>
          <v-btn size="small" color="error" class="ml-2" :loading="deletingId === u.id" @click="remove(u.id)">Удалить</v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'; import { api } from '../api/client';
const users=ref([]); const roles=ref([]); const error=ref(''); const message=ref(''); const deletingId=ref(null); const form=reactive({id:null,name:'',email:'',password:'',roleId:null});
function reset(){Object.assign(form,{id:null,name:'',email:'',password:'',roleId:roles.value[0]?.id});}
async function load(){const [u,r]=await Promise.all([api.get('/users'),api.get('/users/roles')]); users.value=u.data; roles.value=r.data; if(!form.roleId) reset();}
function edit(u){Object.assign(form,{id:u.id,name:u.name,email:u.email,password:'',roleId:u.roleId});}
async function save(){try{error.value=''; message.value=''; const body={...form}; if(!body.password) delete body.password; form.id?await api.put(`/users/${form.id}`,body):await api.post('/users',body); message.value=form.id?'Пользователь обновлён':'Пользователь создан'; reset(); await load();}catch(e){error.value=e.message;}}
async function remove(id){
  if(!confirm('Удалить пользователя? Его вызовы и события останутся в системе без привязки к пользователю.')) return;
  try{
    error.value=''; message.value=''; deletingId.value=id;
    const {data}=await api.delete(`/users/${id}`);
    message.value=data?.message || 'Пользователь удалён';
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
