<template>
  <div id="teamPage" class="team-page-container">
    <!-- 页面顶部背景装饰 -->
    <div class="page-header">
      <div class="header-decoration"></div>
      <h1 class="page-title">我的队伍</h1>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <van-search
        v-model="searchText"
        placeholder="搜索队伍名称..."
        @search="onSearch"
        class="search-bar"
        shape="round"
        background="#f8f9fa"
      >
        <template #left-icon>
          <van-icon name="search" class="search-icon" />
        </template>
      </van-search>
    </div>

    <!-- 创建队伍按钮 -->
    <div class="action-section">
      <van-button
        type="primary"
        @click="createTeam"
        class="create-btn"
        round
        block
        size="large"
      >
        <van-icon name="plus" class="btn-icon" />
        创建新队伍
      </van-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <van-loading
        size="40px"
        color="#1989fa"
        class="loading-indicator"
      />
      <p class="loading-text">正在加载队伍信息...</p>
    </div>

    <!-- 队伍列表 -->
    <div v-else-if="teamList?.length > 0" class="content-section">
      <div class="list-header">
        <h3 class="section-title">队伍列表</h3>
        <span class="team-count">共 {{ teamList.length }} 支队伍</span>
      </div>
      <team-card-list
        :teamList="teamList"
        class="team-list"
      />
    </div>

    <!-- 空状态提示 -->
    <div v-else class="empty-container">
      <van-empty
        description="暂无队伍数据"
        class="empty-state"
      >
        <template #image>
          <div class="empty-image">
            <van-icon name="friends-o" size="80" color="#ddd" />
          </div>
        </template>
        <template #description>
          <div class="empty-description">
            <p class="empty-title">还没有队伍</p>
            <p class="empty-subtitle">创建第一支队伍，开始您的团队之旅</p>
          </div>
        </template>
        <template #bottom>
          <van-button
            type="primary"
            @click="createTeam"
            class="empty-action-btn"
            round
          >
            立即创建
          </van-button>
        </template>
      </van-empty>
    </div>
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
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow-x: hidden;
}

/* 页面顶部装饰 */
.page-header {
  position: relative;
  padding: 20px 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 20px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 搜索区域 */
.search-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.search-bar {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 25px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.search-bar:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.search-icon {
  color: #999;
  font-size: 18px;
}

/* 操作区域 */
.action-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.create-btn {
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.create-btn:active {
  transform: translateY(0);
}

.btn-icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.loading-indicator {
  margin-bottom: 16px;
}

.loading-text {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 内容区域 */
.content-section {
  padding: 0 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.team-count {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 10px;
}

.team-list {
  animation: fadeInUp 0.6s ease;
}

/* 空状态 */
.empty-container {
  padding: 40px 16px;
  text-align: center;
}

.empty-state {
  padding: 0;
}

.empty-image {
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

.empty-description {
  margin-bottom: 30px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
  line-height: 1.4;
}

.empty-action-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 375px) {
  .page-header {
    padding: 16px 12px 20px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .search-section,
  .action-section,
  .content-section {
    padding: 0 12px;
  }
  
  .create-btn {
    height: 44px;
    font-size: 15px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .team-page-container {
    background: linear-gradient(180deg, #2c3e50 0%, #3498db 100%);
  }
  
  .section-title {
    color: #fff;
  }
  
  .team-count {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  
  .empty-title {
    color: #fff;
  }
  
  .empty-subtitle {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .loading-text {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .search-bar {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
  }
}

.user-list-section,
.match-mode-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 其它样式不变 */
}

.index-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 28px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 0 16px;
  margin-top: 0;
  position: relative;
  z-index: 2;
}
</style>