<template>
  <div id="teamPage" class="team-page-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="page-title">
        <div class="title-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1>队伍广场</h1>
        <p>发现志同道合的伙伴</p>
      </div>
      
      <van-search
        v-model="searchText"
        placeholder="搜索队伍名称或描述..."
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
              <div class="tab-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>公开队伍</span>
            </div>
          </template>
        </van-tab>
        <van-tab name="private">
          <template #title>
            <div class="tab-content">
              <div class="tab-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
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
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding-bottom: 60px;
  position: relative;
  overflow-x: hidden;
}

.team-page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(103, 126, 234, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}

/* 头部区域 */
.header-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 32px 20px 32px;
  border-radius: 0 0 32px 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
  pointer-events: none;
}

.page-title {
  text-align: center;
  margin-bottom: 28px;
  position: relative;
  z-index: 2;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 50%;
  margin: 0 auto 16px;
  color: #667eea;
  transition: transform 0.3s ease;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.title-icon:hover {
  transform: scale(1.05);
}

.page-title h1 {
  font-size: 28px;
  font-weight: 700;
  color: #2D3748;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.page-title p {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* 搜索栏 */
.search-bar {
  border-radius: 24px;
  background: rgba(248, 250, 252, 0.9);
  border: 2px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
}

.search-bar:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
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
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: white !important;
  border: none !important;
  border-radius: 16px !important;
  padding: 10px 18px !important;
  margin-right: 8px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
}

.search-bar :deep(.van-search__action):hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
}

/* 标签页 */
.tabs-container {
  margin: 0 20px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.tabs-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
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
  color: #667eea;
  font-weight: 600;
}

.custom-tabs :deep(.van-tabs__line) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
  height: 3px;
}

/* 统计卡片 */
.stats-section {
  display: flex;
  gap: 16px;
  margin: 0 20px 24px;
  position: relative;
  z-index: 10;
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px 20px;
  text-align: center;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  position: relative;
  z-index: 2;
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
  margin: 0 20px;
  position: relative;
  z-index: 10;
}

.team-card-list {
  margin: 0 -20px;
}

/* 空状态 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 60px 20px;
}

.empty-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 48px 40px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 360px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.empty-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
  pointer-events: none;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 50%;
  color: #667eea;
  position: relative;
  z-index: 2;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.empty-desc {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 32px;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

.create-team-btn {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  height: 44px;
  padding: 0 24px;
  border-radius: 16px !important;
  font-size: 15px !important;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease !important;
  position: relative;
  z-index: 2;
}

.create-team-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4) !important;
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
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.floating-button::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.floating-button:hover::before {
  opacity: 0.3;
}

.floating-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.floating-button:active {
  transform: translateY(0) scale(0.95);
}

.fab-text {
  font-size: 11px;
  font-weight: 600;
  margin-top: 2px;
  letter-spacing: 0.3px;
}

/* 快捷操作 */
.quick-actions {
  position: fixed;
  left: 20px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1000;
}

.quick-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(102, 126, 234, 0.2) !important;
  color: #667eea !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.quick-btn:hover {
  transform: translateY(-2px) scale(1.05);
  border-color: rgba(102, 126, 234, 0.4) !important;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.quick-btn:active {
  transform: translateY(0) scale(0.95);
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