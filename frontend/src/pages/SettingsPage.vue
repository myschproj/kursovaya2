<template>
  <h1 class="text-h4 mb-4">Настройки интерфейса</h1>
  <v-alert v-if="message" type="success" class="mb-3" :text="message" />
  <v-card class="pa-4" max-width="700">
    <v-select v-model="local.theme" :items="themes" label="Тема" />
    <v-select v-model="local.fontSize" :items="fontSizes" label="Размер текста" />
    <v-switch v-model="local.accessibilityMode" label="Режим доступности" color="primary" />
    <v-switch v-model="local.soundFeedback" label="Звуковая обратная связь" color="primary" />
    <v-btn color="primary" @click="save">Сохранить настройки</v-btn>
  </v-card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'; import { useSettingsStore } from '../stores/settings';
const settings=useSettingsStore(); const message=ref(''); const local=reactive({theme:'light',fontSize:'medium',accessibilityMode:false,soundFeedback:true});
const themes=['light','dark','contrast']; const fontSizes=['small','medium','large'];
onMounted(async()=>{await settings.load(); Object.assign(local, settings.settings);});
async function save(){await settings.save(local); message.value='Настройки сохранены';}
</script>
