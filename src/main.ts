import {createApp} from 'vue'
import router from './router';
import App from './App.vue'
import * as VueRouter from 'vue-router';
import routes from "./config/route";
import Vant from 'vant';
import 'vant/lib/index.css';
import '../global.css'
import { setCurrentUserState } from './states/user';

const app = createApp(App);
app.use(Vant);

const router = VueRouter.createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写
})

app.use(router);

const userStr = localStorage.getItem('user');
if (userStr) {
  setCurrentUserState(JSON.parse(userStr));
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  // 直接用UTC时间
  return date.getUTCFullYear() + '/' +
         (date.getUTCMonth() + 1) + '/' +
         date.getUTCDate() + ' ' +
         date.getUTCHours() + ':' +
         String(date.getUTCMinutes()).padStart(2, '0') + ':' +
         String(date.getUTCSeconds()).padStart(2, '0')
}

app.use(router).mount('#app')
