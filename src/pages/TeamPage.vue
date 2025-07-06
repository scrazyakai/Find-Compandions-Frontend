<template>
  <div id="teamPage" class="container">
    <van-search
  v-model="searchText"
  placeholder="搜索队伍名称"
  @search="onSearch"
  class="search-bar"
  action-text="搜索"
/>
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public" />
      <van-tab title="加密" name="private" />
    </van-tabs>
    <div style="margin-bottom: 16px" />
    <team-card-list :team-list="teamList" :loading="loading" class="team-card-list"/>
    <van-empty v-if="!teamList || teamList.length < 1" description="数据为空" class="empty-state"/>
    <div class="fixed-add-btn">
      <van-button class="circle-btn" icon="plus" @click="toAddTeam" />
    </div>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const active = ref('public')
const router = useRouter();
const searchText = ref('');

/**
 * 切换查询状态
 * @param name
 */
const onTabChange = (name) => {
  // 查公开
  if (name === 'public') {
    listTeam(searchText.value, 0);
  } else {
    // 查加密
    listTeam(searchText.value, 2);
  }
}

// 跳转到创建队伍页
const toAddTeam = () => {
  router.push({
    path: "/team/add"
  })
}

const teamList = ref([]);

/**
 * 搜索队伍
 * @param val
 * @param status
 * @returns {Promise<void>}
 */
const listTeam = async (val = '', status = 0) => {
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      pageNum: 1,
      status,
    },
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail('加载队伍失败，请刷新重试');
  }
}

// 页面加载时只触发一次
onMounted( () => {
  listTeam();
})

const onSearch = (val) => {
  listTeam(val);
};

</script>

<style scoped>
#teamPage {

}
.fixed-add-btn {
  position: fixed;
  right: 24px;
  bottom: 80px;
  z-index: 1000;
}
.circle-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(24, 144, 255, 0.7); /* 半透明蓝色 */
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  padding: 0;
}
/* 队伍页面容器样式 */
.container {
  padding: 16px;
}

/* 搜索栏样式 */
.search-bar {
  margin-bottom: 16px;
  background: #fff;
  border: 2px solid #1677ff;
  border-radius: 20px;
  padding: 0 8px;
  box-shadow: 0 2px 8px rgba(22,119,255,0.04);
  transition: border 0.2s;
}

/* 输入内容区去掉边框，保持白色 */
.search-bar :deep(.van-search__content) {
  background: #fff !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 20px !important;
}

/* 搜索按钮蓝色风格 */
.search-bar :deep(.van-search__action) {
  color: #fff !important;
  background: #1677ff !important;
  border-radius: 16px !important;
  padding: 4px 16px !important;
  margin-right: 4px;
  font-size: 15px;
  transition: background 0.2s;
  border: none !important;
  box-shadow: 0 2px 8px rgba(22,119,255,0.08);
  cursor: pointer;
}
.search-bar :deep(.van-search__action):hover {
  background: #1563c7 !important;
}

/* 队伍卡片列表样式 */
.team-card-list {
  padding: 0 4px;
}

/* 空状态样式 */
.empty-state {
  margin-top: 40px;
}
</style>
