<template>
  <div id="teamPage" class="team-page-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="page-title">
        <div class="title-icon">🚀</div>
        <h1>队伍广场</h1>
        <p>发现志同道合的伙伴</p>
      </div>
      
      <van-search
        v-model="searchText"
        placeholder="🔍 搜索队伍名称或描述..."
        @search="onSearch"
        class="search-bar"
        action-text="搜索"
        shape="round"
        left-icon="search"
      />
    </div>

    <!-- 标签页切换 -->
    <div class="tabs-container">
      <van-tabs 
        v-model:active="active" 
        @change="onTabChange"
        class="custom-tabs"
        animated
        swipeable
        line-width="40px"
        line-height="3px"
      >
        <van-tab name="public">
          <template #title>
            <div class="tab-content">
              <span class="tab-icon">🌍</span>
              <span>公开队伍</span>
            </div>
          </template>
        </van-tab>
        <van-tab name="private">
          <template #title>
            <div class="tab-content">
              <span class="tab-icon">🔒</span>
              <span>加密队伍</span>
            </div>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 队伍统计信息 -->
    <div class="stats-section" v-if="teamList && teamList.length > 0">
      <div class="stat-card">
        <div class="stat-number">{{ teamList.length }}</div>
        <div class="stat-label">找到队伍</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ totalMembers }}</div>
        <div class="stat-label">总成员</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ availableTeams }}</div>
        <div class="stat-label">可加入</div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <van-loading size="20px" color="#667eea" vertical>
        加载中...
      </van-loading>
    </div>

    <!-- 队伍列表 -->
    <div class="content-section" v-else>
      <team-card-list 
        :team-list="teamList" 
        :loading="loading" 
        class="team-card-list"
      />
      
      <!-- 空状态 -->
      <div v-if="!teamList || teamList.length < 1" class="empty-container">
        <div class="empty-content">
          <div class="empty-icon">📭</div>
          <div class="empty-title">
            {{ searchText ? '未找到匹配的队伍' : '暂无队伍' }}
          </div>
          <div class="empty-desc">
            {{ searchText ? '试试其他关键词' : '还没有队伍，快来创建第一个吧！' }}
          </div>
          <van-button 
            type="primary" 
            class="create-team-btn"
            @click="toAddTeam"
            round
            size="small"
          >
            <van-icon name="plus" />
            创建队伍
          </van-button>
        </div>
      </div>
    </div>

    <!-- 底部间距 -->
    <div class="bottom-spacer"></div>

    <!-- 浮动创建按钮 -->
    <div class="floating-button" @click="toAddTeam">
      <van-icon name="plus" size="24" />
      <span class="fab-text">创建</span>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <van-button 
        size="mini" 
        class="quick-btn refresh-btn"
        @click="refreshData"
        icon="refresh"
        round
      />
      <van-button 
        size="mini" 
        class="quick-btn top-btn"
        @click="handleScrollToTop"
        icon="back-top"
        round
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref, computed} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const active = ref('public')
const router = useRouter();
const searchText = ref('');
const loading = ref(false);

// 计算统计数据
const totalMembers = computed(() => {
  return teamList.value.reduce((total, team) => total + team.hasJoinNum, 0);
});

const availableTeams = computed(() => {
  return teamList.value.filter(team => team.hasJoinNum < team.maxNum).length;
});

/**
 * 切换查询状态
 */
const onTabChange = (name) => {
  if (name === 'public') {
    listTeam(searchText.value, 0);
  } else {
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
 */
const listTeam = async (val = '', status = 0) => {
  loading.value = true;
  try {
    const res = await myAxios.get("/team/list", {
      params: {
        searchText: val,
        pageNum: 1,
        status,
      },
    });
    if (res?.code === 0) {
      teamList.value = res.data;
      if (val) {
        Toast.success(`找到 ${res.data.length} 个队伍`);
      }
    } else {
      Toast.fail('加载失败，请重试');
    }
  } catch (error) {
    Toast.fail('网络错误，请稍后重试');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  listTeam();
})

const onSearch = (val) => {
  const status = active.value === 'public' ? 0 : 2;
  listTeam(val, status);
};

const refreshData = () => {
  const status = active.value === 'public' ? 0 : 2;
  listTeam(searchText.value, status);
  Toast.success('已刷新');
}

const scrollToTop = () => {
  // 1. 优先滚动 teamPage
  const container = document.getElementById('teamPage');
  if (container && container.scrollTop > 0) {
    container.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  // 2. 尝试滚动 #app
  const app = document.getElementById('app');
  if (app && app.scrollTop > 0) {
    app.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  // 3. 尝试滚动 documentElement 和 body
  if (document.documentElement.scrollTop > 0) {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (document.body.scrollTop > 0) {
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  // 4. 兜底 window
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScrollToTop = () => {
  console.log('btn click');
  scrollToTop();
};
</script>

<style scoped>
.team-page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #8B7ED8 0%, #B794F6 100%);
  padding-bottom: 60px;
}

/* 头部区域 */
.header-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 20px 16px 24px;
  border-radius: 0 0 32px 32px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  margin-bottom: 24px;
}

.title-icon {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #2D3748;
  margin: 0 0 4px 0;
}

.page-title p {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

/* 搜索栏 */
.search-bar {
  border-radius: 50px;
  background: #F7FAFC;
  border: 2px solid #E2E8F0;
  transition: all 0.2s ease;
  overflow: hidden;
}

.search-bar:focus-within {
  border-color: #8B7ED8;
  box-shadow: 0 0 0 3px rgba(139, 126, 216, 0.1);
}

.search-bar :deep(.van-search__content) {
  background: transparent !important;
  border: none !important;
  padding: 12px 20px !important;
}

.search-bar :deep(.van-field__control) {
  font-size: 16px;
  color: #2D3748;
}

.search-bar :deep(.van-field__control)::placeholder {
  color: #A0AEC0;
}

.search-bar :deep(.van-search__action) {
  background: linear-gradient(135deg, #8B7ED8, #B794F6) !important;
  color: white !important;
  border: none !important;
  border-radius: 50px !important;
  padding: 8px 16px !important;
  margin-right: 8px;
  font-weight: 500;
  font-size: 14px;
}

/* 标签页 */
.tabs-container {
  margin: 0 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.custom-tabs :deep(.van-tabs__wrap) {
  background: transparent;
  border: none;
}

.custom-tabs :deep(.van-tabs__nav) {
  background: transparent;
}

.tab-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 500;
}

.tab-icon {
  font-size: 16px;
}

.custom-tabs :deep(.van-tab) {
  color: #718096;
  flex: 1;
}

.custom-tabs :deep(.van-tab--active) {
  color: #8B7ED8;
  font-weight: 600;
}

.custom-tabs :deep(.van-tabs__line) {
  background: linear-gradient(135deg, #8B7ED8, #B794F6);
  border-radius: 2px;
}

/* 统计卡片 */
.stats-section {
  display: flex;
  gap: 12px;
  margin: 0 16px 20px;
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #8B7ED8;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #718096;
  font-weight: 500;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

/* 内容区域 */
.content-section {
  margin: 0 16px;
}

.team-card-list {
  margin: 0 -16px;
}

/* 空状态 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 40px 20px;
}

.empty-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 280px;
  width: 100%;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #718096;
  margin-bottom: 24px;
  line-height: 1.4;
}

.create-team-btn {
  background: linear-gradient(135deg, #8B7ED8, #B794F6) !important;
  border: none !important;
  color: white !important;
  font-weight: 500;
  height: 36px;
  padding: 0 20px;
  box-shadow: 0 4px 12px rgba(139, 126, 216, 0.3);
}

/* 底部间距 */
.bottom-spacer {
  height: 80px;
}

/* 浮动按钮 */
.floating-button {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #8B7ED8, #B794F6);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 6px 20px rgba(139, 126, 216, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
}

.floating-button:active {
  transform: scale(0.95);
}

.fab-text {
  font-size: 10px;
  font-weight: 500;
  margin-top: 2px;
}

/* 快捷操作 */
.quick-actions {
  position: fixed;
  left: 20px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
}

.quick-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 126, 216, 0.2) !important;
  color: #8B7ED8 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.quick-btn:active {
  transform: scale(0.95);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    padding: 16px 12px 20px;
  }
  
  .page-title h1 {
    font-size: 20px;
  }
  
  .title-icon {
    font-size: 28px;
  }
  
  .stats-section {
    margin: 0 12px 16px;
    gap: 8px;
  }
  
  .stat-card {
    padding: 16px 12px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .content-section {
    margin: 0 12px;
  }
  
  .tabs-container {
    margin: 0 12px 16px;
  }
  
  .floating-button {
    right: 16px;
    bottom: 70px;
    width: 52px;
    height: 52px;
  }
  
  .quick-actions {
    left: 16px;
    bottom: 70px;
  }
  
  .quick-btn {
    width: 40px;
    height: 40px;
  }
}

/* 滚动优化 */
.team-page-container {
  scroll-behavior: smooth;
}

/* 毛玻璃效果增强 */
@supports (backdrop-filter: blur(10px)) {
  .header-section,
  .tabs-container,
  .stat-card,
  .empty-content,
  .quick-btn {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
</style>