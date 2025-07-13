import {createApp} from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router';
import routes from "./config/route";
import Vant from 'vant';
import 'vant/lib/index.css';
import '../global.css'
import './styles/design-system.css'
import { setCurrentUserState } from './states/user';

const app = createApp(App);
app.use(Vant);

const router = VueRouter.createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写
})

// 全局路由守卫，未登录用户跳转到登录页
router.beforeEach((to, from, next) => {
  const whiteList = ['/user/login', '/register'];
  const userStr = localStorage.getItem('user');
  if (!whiteList.includes(to.path) && !userStr) {
    next('/user/login');
  } else {
    next();
  }
});

app.use(router);

const userStr = localStorage.getItem('user');
if (userStr) {
  setCurrentUserState(JSON.parse(userStr));
}

app.mount('#app')
