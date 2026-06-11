import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import ElevatorsPage from '../pages/ElevatorsPage.vue';
import FloorsPage from '../pages/FloorsPage.vue';
import CallsPage from '../pages/CallsPage.vue';
import UsersPage from '../pages/UsersPage.vue';
import EventsPage from '../pages/EventsPage.vue';
import SettingsPage from '../pages/SettingsPage.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginPage },
    { path: '/', component: DashboardPage, meta: { auth: true } },
    { path: '/elevators', component: ElevatorsPage, meta: { auth: true } },
    { path: '/floors', component: FloorsPage, meta: { auth: true } },
    { path: '/calls', component: CallsPage, meta: { auth: true } },
    { path: '/users', component: UsersPage, meta: { auth: true, admin: true } },
    { path: '/events', component: EventsPage, meta: { auth: true } },
    { path: '/settings', component: SettingsPage, meta: { auth: true } }
  ]
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  auth.restore();
  if (to.meta.auth && !auth.isAuthenticated) return '/login';
  if (to.meta.admin && !auth.isAdmin) return '/';
});

export default router;
