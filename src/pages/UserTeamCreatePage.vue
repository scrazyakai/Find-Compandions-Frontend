<template>
  <div id="teamPage" class="team-page-container">
    <!-- 搜索框 -->
    <van-search
      v-model="searchText"
      placeholder="搜索队伍"
      @search="onSearch"
      class="search-bar"
    />

    <!-- 创建队伍按钮 -->
    <van-button
      type="primary"
      @click="createTeam"
      class="create-btn"
    >
      创建队伍
    </van-button>

    <!-- 加载状态 -->
    <van-loading v-if="isLoading" size="30px" class="loading-indicator" />

    <!-- 队伍列表 -->
    <team-card-list
      v-else
      :teamList="teamList"
      class="team-list"
    />

    <!-- 空状态提示 -->
    <van-empty
      v-if="!isLoading && teamList?.length < 1"
      description="数据为空"
      class="empty-state"
    />
  </div>
</template>

<script setup lang="ts">
// 路由相关
import { useRouter } from "vue-router";

// Vue核心
import { onMounted, ref } from "vue";

// 组件导入
import { Loading } from 'vant';
import TeamCardList from "../components/TeamCardList.vue";

// 组合式函数
import { useTeamList } from "../composables/useTeamList";

// 响应式数据
const router = useRouter();
const searchText = ref('');

// 团队列表数据 - 使用组合式函数
const { teamList, isLoading, listTeam } = useTeamList("/team/list/my/create");

// 页面加载时获取团队列表
onMounted(() => {
  listTeam();
});

// 搜索队伍
const onSearch = (val: string) => {
  listTeam(val);
};

// 跳转到创建队伍页面
const createTeam = () => {
  router.push({ path: "/team/add", replace: true });
};
</script>

<style scoped>
.team-page-container {
  padding: 16px;
}

.search-bar {
  margin-bottom: 16px;
}

.create-btn {
  margin-bottom: 16px;
  width: 100%;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.team-list {
  margin-bottom: 16px;
}

.empty-state {
  padding: 40px 0;
}
</style>
