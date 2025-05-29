import { createRouter, createWebHistory } from 'vue-router'

const UserInfoView = () => import('../views/UserInfoView.vue');
const GameView = () => import('../views/GameView.vue');
const GameOverView = () => import('../views/GameOverView.vue');

const routes = [
  {
    path: '/',
    name: 'UserInfo',
    component: UserInfoView,
    alias: '/user-info'
  },
  {
    path: '/game',
    name: 'Game',
    component: GameView
  },
  {
    path: '/game-over',
    name: 'GameOver',
    component: GameOverView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router
