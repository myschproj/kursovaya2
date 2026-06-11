<template>
  <v-app :class="settings.appClasses">
    <AppShell v-if="auth.isAuthenticated" />
    <router-view v-else />
  </v-app>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useTheme } from 'vuetify';
import AppShell from './components/AppShell.vue';
import { useAuthStore } from './stores/auth';
import { useSettingsStore } from './stores/settings';

const auth = useAuthStore();
const settings = useSettingsStore();
const vuetifyTheme = useTheme();

function applyInterfaceSettings() {
  const userSettings = settings.settings || {};
  const theme = ['light', 'dark', 'contrast'].includes(userSettings.theme)
    ? userSettings.theme
    : 'light';

  vuetifyTheme.global.name.value = theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.fontSize = userSettings.fontSize || 'medium';
  document.documentElement.dataset.accessibility = userSettings.accessibilityMode ? 'true' : 'false';
}

watch(
  () => settings.settings,
  () => applyInterfaceSettings(),
  { deep: true, immediate: true }
);

watch(
  () => auth.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await settings.load();
      applyInterfaceSettings();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  auth.restore();
  if (auth.isAuthenticated) {
    await settings.load();
    applyInterfaceSettings();
  }
});
</script>
