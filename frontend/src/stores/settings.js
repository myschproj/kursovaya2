import { defineStore } from 'pinia';
import { api } from '../api/client';

const defaultSettings = {
  theme: 'light',
  fontSize: 'medium',
  accessibilityMode: false,
  soundFeedback: true,
  language: 'ru'
};

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: { ...defaultSettings }
  }),
  getters: {
    appClasses: (state) => ({
      'theme-light': state.settings.theme === 'light',
      'theme-dark': state.settings.theme === 'dark',
      'theme-contrast': state.settings.theme === 'contrast',
      'accessibility-mode': state.settings.accessibilityMode,
      'font-large': state.settings.fontSize === 'large',
      'font-small': state.settings.fontSize === 'small'
    })
  },
  actions: {
    async load() {
      const { data } = await api.get('/settings');
      this.settings = { ...defaultSettings, ...(data || {}) };
    },
    async save(payload) {
      const { data } = await api.put('/settings', payload);
      this.settings = { ...defaultSettings, ...(data || {}) };
    }
  }
});
