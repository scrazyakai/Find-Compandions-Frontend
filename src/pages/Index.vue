<template>
  <div class="home-page">
    <!-- 顶部装饰背景 -->
    <div class="top-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
    
    <!-- 搜索框入口 -->
    <div class="search-section">
      <div class="home-search-bar" @click="goToSearch">
        <div class="search-content">
          <van-icon name="search" class="search-icon" />
          <span class="search-placeholder">标签搜索用户</span>
        </div>
        <div class="search-arrow">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="index-container container">
      <!-- 心动模式开关 -->
      <div class="match-mode-card">
        <van-cell center class="match-mode-switch">
          <template #title>
            <div class="mode-title">
              <van-icon name="fire" class="mode-icon" />
              <span>心动模式</span>
            </div>
          </template>
          <template #label>
            <span class="mode-description">
              {{ isMatchMode ? '根据标签智能匹配用户' : '浏览推荐用户' }}
            </span>
          </template>
          <template #right-icon>
            <van-switch 
              v-model="isMatchMode" 
              size="26" 
              active-color="#ff6b6b" 
              inactive-color="#e8e8e8"
            />
          </template>
        </van-cell>
      </div>
      
      <!-- 用户卡片列表 -->
      <div class="user-list-section">
        <div class="section-header">
          <h3 class="section-title">
            {{ isMatchMode ? '为你推荐' : '用户推荐' }}
            <div class="title-decoration"></div>
          </h3>
        </div>
        
        <user-card-list 
          :user-list="userList" 
          :loading="loading" 
          :is-match-mode="isMatchMode" 
          class="user-card-list"
        />
        
        <!-- 空状态 -->
        <div v-if="!userList || userList.length < 1" class="empty-state">
          <van-empty 
            description="暂无用户数据" 
            image="https://cdn.jsdelivr.net/gh/vantjs/vant@dev/packages/vant/src/empty/local.png"
          >
            <template #description>
              <div class="empty-description">
                <p>{{ isMatchMode ? '暂无匹配用户' : '暂无推荐用户' }}</p>
                <p class="empty-tip">试试切换模式或稍后再来</p>
              </div>
            </template>
          </van-empty>
        </div>
      </div>
    </div>
    
    <!-- 底部装饰 -->
    <div class="bottom-decoration">
      <div class="wave-decoration"></div>
    </div>
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
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

/* 顶部装饰背景 */
.top-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  overflow: hidden;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: -60px;
  left: 20%;
  animation-delay: 0s;
}

.circle-2 {
  width: 80px;
  height: 80px;
  top: 30px;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 60px;
  height: 60px;
  top: 80px;
  left: 70%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 搜索区域 */
.search-section {
  position: relative;
  z-index: 2;
  padding: 20px 16px 20px;
}

.home-search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 14px 20px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.home-search-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.home-search-bar:hover::before {
  left: 100%;
}

.home-search-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.5);
}

.search-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.search-icon {
  margin-right: 12px;
  font-size: 20px;
  color: #667eea;
}

.search-placeholder {
  color: #667eea;
  font-weight: 500;
}

.search-arrow {
  opacity: 0.6;
  transition: all 0.3s ease;
}

.home-search-bar:hover .search-arrow {
  opacity: 1;
  transform: translateX(3px);
}

.arrow-icon {
  font-size: 16px;
  color: #667eea;
}

/* 主要内容区域 */
.index-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 28px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 0 16px;
  margin-top: 0;
  position: relative;
  z-index: 2;
}

.user-list-section,
.match-mode-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
}

/* 心动模式卡片 */
.match-mode-card {
  margin-bottom: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.match-mode-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.match-mode-switch {
  padding: 20px;
  background: transparent;
}

.mode-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.mode-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #ff6b6b;
}

.mode-description {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 用户列表区域 */
.user-list-section {
  padding: 24px;
  margin-bottom: 80px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
  position: relative;
  display: inline-block;
}

.title-decoration {
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

/* 空状态样式 */
.empty-state {
  margin-top: 40px;
  text-align: center;
}

.empty-description {
  color: #666;
}

.empty-description p {
  margin: 8px 0;
}

.empty-tip {
  font-size: 14px;
  color: #999;
}

/* 底部装饰 */
.bottom-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1;
}

.wave-decoration {
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.wave-decoration::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E") no-repeat;
  background-size: cover;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section {
    padding: 16px 12px 16px;
  }
  
  .home-search-bar {
    padding: 12px 16px;
  }
  
  .index-container {
    padding: 0 12px;
  }
  
  .user-list-section {
    padding: 20px;
  }
  
  .section-title {
    font-size: 18px;
  }
}

/* 动画增强 */
@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.match-mode-card,
.user-list-section {
  animation: slideInUp 0.6s ease-out;
}

.user-list-section {
  animation-delay: 0.2s;
}

/* 深度样式覆盖 */
.match-mode-switch :deep(.van-cell__title) {
  flex: none;
  margin-right: 12px;
}

.match-mode-switch :deep(.van-cell__label) {
  margin-top: 8px;
}

.match-mode-switch :deep(.van-switch) {
  transform: scale(1.1);
}
</style>