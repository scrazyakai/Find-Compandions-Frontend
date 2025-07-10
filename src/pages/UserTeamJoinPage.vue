<template> 
  <div id="teamPage" class="team-page-container"> 
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="page-title">
        <h1>我的队伍</h1>
        <p class="subtitle">管理和查看你加入的所有队伍</p>
      </div>
      
      <!-- 搜索框 --> 
      <van-search 
        v-model="searchText" 
        placeholder="搜索队伍名称或标签" 
        @search="onSearch" 
        class="search-bar"
        shape="round"
      /> 
    </div>
 
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 加载状态 --> 
      <div v-if="isLoading" class="loading-container">
        <van-loading 
          size="32px" 
          color="#6366f1"
          class="loading-indicator"
        />
        <p class="loading-text">正在加载队伍信息...</p>
      </div>
   
      <!-- 队伍列表 --> 
      <div v-else-if="teamList?.length > 0" class="team-list-container">
        <div class="list-header">
          <span class="team-count">共 {{ teamList.length }} 个队伍</span>
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
            <div class="empty-icon">
              <van-icon name="friends-o" size="48" color="#d1d5db" />
            </div>
          </template>
          <template #description>
            <div class="empty-description">
              <p>还没有加入任何队伍</p>
              <p class="empty-subtitle">快去发现并加入感兴趣的队伍吧!</p>
            </div>
          </template>
        </van-empty>
      </div>
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
const { teamList, isLoading, listTeam } = useTeamList("/team/list/my/join"); 
 
// 页面加载时获取团队列表 
onMounted(() => { 
  listTeam(); 
}); 
 
// 搜索队伍 
const onSearch = (val: string) => { 
  listTeam(val); 
}; 
</script> 
 
<style scoped> 
.team-page-container { 
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%) !important;
  overflow-x: hidden;
} 

.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white;
  padding: 20px 16px 24px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  position: relative;
  z-index: 100;
  border-bottom: none !important;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

.search-bar {
  margin: 0;
}

.search-bar :deep(.van-search__content) {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.search-bar :deep(.van-search__content:focus-within) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-bar :deep(.van-field__control) {
  color: #374151;
  font-size: 14px;
}

.main-content {
  padding: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.loading-text {
  margin-top: 12px;
  color: #6b7280;
  font-size: 14px;
}

.team-list-container {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.list-header {
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.team-count {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.team-list {
  margin: 0;
}

.empty-container {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 60px 20px;
  text-align: center;
}

.empty-state {
  padding: 0;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-description p {
  margin: 0 0 6px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 500;
}

.empty-subtitle {
  color: #6b7280 !important;
  font-size: 14px !important;
  font-weight: 400 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    padding: 16px 12px;
  }
  
  .page-title h1 {
    font-size: 22px;
  }
  
  .main-content {
    padding: 12px;
  }
  
  .list-header {
    padding: 12px 16px;
  }
  
  .loading-container {
    padding: 60px 16px;
  }
  
  .empty-container {
    padding: 40px 16px;
  }
}

/* 平滑过渡 */
.team-list-container,
.empty-container,
.loading-container {
  transition: all 0.3s ease;
}

/* 悬停效果 */
.team-list-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.main-content,
.team-list-container,
.empty-container,
.loading-container {
  background: transparent !important;
  border: none !important;
}
</style>