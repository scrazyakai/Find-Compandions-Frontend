<template>
  <van-nav-bar
      :title="title"
      :left-arrow="showBackButton"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      style="position: fixed; top: 0; width: 100%; z-index: 100;"
  >
    <template #right v-if="isHomePage">
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div id="content">
    <router-view/>
  </div>
  <div v-if="showTabbar">
    <van-tabbar route @change="onChange">
      <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
      <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
      <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import {ref, computed} from "vue";
import routes from "../config/route";

const router = useRouter();
const route = useRoute();
const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);
const isHomePage = computed(() => route.path === '/');
const showTabbar = computed(() => {
  // 优先使用路由元数据中的showTabbar配置
  if (route.meta.showTabbar !== undefined) {
    return route.meta.showTabbar;
  }
  // 默认规则：仅在首页、队伍、个人页面显示
  return ['/', '/team', '/user'].includes(route.path);
});
const showBackButton = computed(() => {
  // 优先使用路由元数据中的showBackButton配置，默认显示
  return route.meta.showBackButton !== false;
});

/**
 * 根据路由切换标题
 */
router.beforeEach((to, from) => {
  const toPath = to.path;
  const route = routes.find((route) => {
    return toPath == route.path;
  })
  title.value = route?.title ?? DEFAULT_TITLE;
})

const onClickLeft = () => {
  // 优先使用路由元信息中定义的返回路径
  if (route.meta.backPath) {
    router.push(route.meta.backPath);
  } else {
    router.push('/');
  }
};

const onClickRight = () => {
  router.push('/search')
};

</script>

<style scoped>
#content {
  padding-top: 46px; /* 为固定导航栏预留空间 */
  padding-bottom: 50px;
}
</style>
