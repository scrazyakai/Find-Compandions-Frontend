<template>
  <!-- 搜索框入口 -->
  <div class="home-search-bar" @click="goToSearch">
    <van-icon name="search" class="search-icon" />
    <span class="search-placeholder">标签搜索用户</span>
  </div>
  <div class="index-container container">
    <van-cell center title="心动模式" class="match-mode-switch" style="padding: 10px 6px;">
      <template #right-icon>
        <van-switch v-model="isMatchMode" size="24" active-color="#ff4d4f" />
      </template>
    </van-cell>
    <user-card-list :user-list="userList" :loading="loading" :is-match-mode="isMatchMode" class="user-card-list"/>
    <van-empty v-if="!userList || userList.length < 1" description="数据为空" class="empty-state"/>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";

const route = useRoute();
const router = useRouter();
const isMatchMode = ref<boolean>(false);

const goToSearch = () => {
  router.push('/search');
};

const userList = ref([]);
const loading = ref(true);

/**
 * 加载数据
 */
const loadData = async () => {
  let userListData;
  loading.value = true;
  // 心动模式，根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data;
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          Toast.fail('请求失败');
        })
  } else {
    // 普通模式，直接分页查询用户
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
        tags: route.query.tags
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data?.records;
        })
        .catch(function (error) {
          console.error('/user/recommend error', error);
          Toast.fail('请求失败');
        })
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
})

</script>

<style scoped>
.home-search-bar {
  display: flex;
  align-items: center;
  background: #fff;                /* 白色背景 */
  border: 2px solid #1677ff;       /* 蓝色边框 */
  border-radius: 20px;
  padding: 10px 16px;
  margin-bottom: 16px;
  cursor: pointer;
  color: #1677ff;                  /* 文字和icon蓝色 */
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(22,119,255,0.04);
  transition: border 0.2s;
}
.home-search-bar:hover {
  border-color: #1563c7;           /* 悬浮时更深蓝 */
}
.search-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #1677ff;
}
.search-placeholder {
  color: #1677ff;
  opacity: 0.95;
}
/* 主页容器样式 */
.index-container {
  padding: 0 16px;
  margin-top: 0;
}

/* 匹配模式开关样式 */
.match-mode-switch {
  margin-bottom: 0;
}

/* 心动模式开关样式 */
.match-mode-switch {
  margin: 16px 0;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

/* 用户卡片列表样式 */
.user-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 140px;
}

/* 空状态样式 */
.empty-state {
  margin-top: 40px;
}

.search-bar {
  margin-bottom: 16px;
  background: #fff !important;
  border: 2px solid #1677ff !important;
  border-radius: 20px !important;
  padding: 0 8px !important;
  box-shadow: 0 2px 8px rgba(22,119,255,0.04);
  color: #1677ff !important;
  font-size: 15px;
  transition: border 0.2s;
}

/* 深度覆盖 Vant 内部结构 */
.search-bar :deep(.van-search__content) {
  background: transparent !important;
  border-radius: 20px !important;
}

.search-bar :deep(.van-icon) {
  color: #1677ff !important;
}

.search-bar :deep(.van-field__control) {
  color: #1677ff !important;
  background: transparent !important;
}

.search-bar :deep(.van-search__action) {
  color: #1677ff !important;
}

.search-bar:hover {
  border-color: #1563c7 !important;
}
</style>
