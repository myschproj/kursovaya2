import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import App from './App.vue';
import router from './router';
import './styles/global.css';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1565c0',
          secondary: '#546e7a',
          error: '#b00020',
          background: '#f5f7fb',
          surface: '#ffffff'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#90caf9',
          secondary: '#b0bec5',
          error: '#ffb4ab',
          background: '#121212',
          surface: '#1e1e1e'
        }
      },
      contrast: {
        dark: false,
        colors: {
          primary: '#000000',
          secondary: '#111111',
          error: '#a00000',
          background: '#ffffff',
          surface: '#ffffff',
          onBackground: '#000000',
          onSurface: '#000000'
        }
      }
    }
  }
});

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app');
