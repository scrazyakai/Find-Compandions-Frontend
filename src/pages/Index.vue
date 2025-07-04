<template>
  <div class="index-container">
    <van-cell center title="心动模式" class="match-mode-switch">
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
import { useRoute } from 'vue-router';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";

const route = useRoute();
const isMatchMode = ref<boolean>(false);

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
/* 主页容器样式 */
.index-container {
  padding: 16px;
}

/* 心动模式开关样式 */
.match-mode-switch {
  margin: 16px 0;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

/* 用户卡片列表样式 */
.user-card-list {
  padding: 0 16px;
}

/* 空状态样式 */
.empty-state {
  margin-top: 40px;
}
</style>
