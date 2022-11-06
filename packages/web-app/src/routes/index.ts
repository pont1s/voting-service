import {
  createWebHistory,
  createRouter,
  RouteRecordRaw,
  RouteLocationNormalized,
} from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    redirect: '/votes',
    component: () => import('@/views/Main.vue'),
    meta: {
      layout: 'MainLayout',
    },
    children: [
      {
        path: '/votes',
        name: 'votes',
        component: () => import('@/views/votes/Votes.vue'),
        meta: {
          layout: 'MainLayout',
        },
      },
      {
        path: '/my-votes',
        name: 'my-votes',
        component: () => import('@/views/votes/MyVotes.vue'),
        meta: {
          layout: 'MainLayout',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      layout: 'DefaultLayout',
    },
  },
  {
    path: '/registration',
    name: 'registration',
    component: () => import('@/views/Registration.vue'),
    meta: {
      layout: 'DefaultLayout',
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
