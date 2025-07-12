import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 假设存在首页组件，实际项目中请替换为正确路径
import IndexPage from '../pages/Index.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: IndexPage },
  // 可以添加其他现有路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;