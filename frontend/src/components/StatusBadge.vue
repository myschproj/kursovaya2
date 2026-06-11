<template>
  <v-chip :color="color" variant="flat" size="small">{{ label }}</v-chip>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ status: { type: String, required: true } });
const dictionary = {
  IDLE: ['Свободен', 'green'],
  MOVING: ['Движется', 'blue'],
  DOORS_OPEN: ['Двери открыты', 'cyan'],
  MAINTENANCE: ['Обслуживание', 'orange'],
  ERROR: ['Ошибка', 'red'],
  NEW: ['Новый', 'grey'],
  ASSIGNED: ['Назначен', 'blue'],
  IN_PROGRESS: ['Выполняется', 'indigo'],
  COMPLETED: ['Завершен', 'green'],
  CANCELED: ['Отменен', 'grey']
};
const label = computed(() => dictionary[props.status]?.[0] || props.status);
const color = computed(() => dictionary[props.status]?.[1] || 'grey');
</script>
