<template>
  <div class="search-result-bg">
    <div class="result-card-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">
              <van-icon name="friends-o" class="title-icon" />
              搜索结果
            </h1>
            <p class="page-subtitle" v-if="tags">
              基于标签 "{{ Array.isArray(tags) ? tags.join(', ') : tags }}" 的搜索结果
            </p>
          </div>
          <div class="result-stats" v-if="userList && userList.length > 0">
            <div class="stats-item">
              <span class="stats-number">{{ userList.length }}</span>
              <span class="stats-label">位用户</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <van-button
              icon="arrow-left"
              type="default"
              size="small"
              @click="$router.go(-1)"
              class="back-btn"
          >
            返回搜索
          </van-button>
          <van-button
              icon="replay"
              type="primary"
              size="small"
              @click="refreshResults"
              class="refresh-btn"
          >
            刷新
          </van-button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <van-loading color="#667eea" size="24px">搜索中...</van-loading>
      </div>

      <!-- 用户列表 -->
      <div v-else-if="userList && userList.length > 0" class="user-list-container">
        <div class="list-header">
          <van-icon name="user-o" class="list-icon" />
          <span class="list-title">找到的学习伙伴</span>
        </div>
  <user-card-list :user-list="userList" @contact="handleContactUser" />
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-illustration">
          <van-icon name="search" class="empty-icon" />
          <div class="empty-circles">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
          </div>
        </div>
        <div class="empty-content">
          <h3 class="empty-title">未找到匹配的学习伙伴</h3>
          <p class="empty-description">
            尝试调整搜索条件或<br>
            选择不同的标签组合
          </p>
          <div class="empty-actions">
            <van-button
                type="primary"
                @click="$router.push('/user/search')"
                class="empty-btn"
            >
              <van-icon name="search" />
              重新搜索
            </van-button>
          </div>
        </div>
      </div>

      <!-- 搜索提示 -->
      <div class="search-tips" v-if="userList && userList.length > 0">
        <div class="tip-item">
          <van-icon name="info-o" class="tip-icon" />
          <span class="tip-text">点击用户卡片查看详细信息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from "vue-router";
import myAxios from "../plugins/myAxios";
import {Toast, Dialog} from "vant";
import qs from 'qs';
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";
import { sendFriendRequest } from "../services/friendService";

const route = useRoute();
const {tags} = route.query;

const userList = ref([]);
const isLoading = ref(true);

const loadUserList = async () => {
  isLoading.value = true;
  try {
  const userListData = await myAxios.get('/user/search/tags', {
    params: {
      tagNameList: tags
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
      .then(function (response) {
        console.log('/user/search/tags succeed', response);
        return response?.data;
      })
      .catch(function (error) {
        console.error('/user/search/tags error', error);
        Toast.fail('请求失败');
          throw error;
      })

  console.log(userListData)
  if (userListData) {
    userListData.forEach((user: any) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  } catch (error) {
    userList.value = [];
  } finally {
    isLoading.value = false;
  }
}

const refreshResults = () => {
  loadUserList();
}

/**
 * 处理联系用户事件
 */
const handleContactUser = async (user: UserType) => {
  try {
    // 确认发送好友请求
    await Dialog.confirm({
      title: '发送好友申请',
      message: `确定要向 ${user.username} 发送好友申请吗？`,
      confirmButtonText: '发送',
      cancelButtonText: '取消',
    });
    
    // 发送好友请求
    const result = await sendFriendRequest({
      fromUserId: getCurrentUserId(), // 发送方ID
      toUserId: user.id, // 接收方ID
      sendTime: new Date()
    });
    
    if (result) {
      Toast.success('好友申请发送成功');
    } else {
      Toast.fail('发送好友申请失败，请稍后再试');
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('发送好友申请失败:', error);
      Toast.fail('发送好友申请失败，请稍后再试');
    }
  }
};

/**
 * 获取当前用户ID
 */
const getCurrentUserId = (): number => {
  // 从本地存储或状态管理中获取当前用户ID
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id;
    } catch (e) {
      console.error('获取用户信息失败:', e);
    }
  }
  return 0; // 返回默认值
};

onMounted(() => {
  loadUserList();
})

</script>

<style scoped>
.search-result-bg {
  min-height: 100vh;
  width: 100vw;
  background: #f8fafc;
  position: relative;
  overflow: auto;
}

.result-card-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  margin: 20px;
  padding: 32px 24px 40px 24px;
  max-width: 480px;
  width: calc(100% - 40px);
  min-height: calc(100vh - 80px);
  box-sizing: border-box;
  position: relative;
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 页面头部 */
.page-header {
  margin-bottom: 32px;
  animation: fadeIn 0.8s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 24px;
  color: #667eea;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.result-stats {
  display: flex;
  gap: 16px;
  margin-left: 16px;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background: #667eea;
  border-radius: 16px;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.stats-number {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.stats-label {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 2px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.back-btn {
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  border-radius: 8px;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
}

.refresh-btn {
  background: #667eea;
  border: none;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}

/* 用户列表 */
.user-list-container {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

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

.list-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.list-icon {
  color: #667eea;
  font-size: 18px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-illustration {
  position: relative;
  margin-bottom: 32px;
}

.empty-icon {
  font-size: 64px;
  color: #d1d5db;
  position: relative;
  z-index: 2;
}

.empty-circles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 3s ease-in-out infinite;
}

.circle-1 {
  width: 100px;
  height: 100px;
  background: #667eea;
  top: -50px;
  left: -50px;
  animation-delay: 0s;
}

.circle-2 {
  width: 60px;
  height: 60px;
  background: #764ba2;
  top: -30px;
  left: -30px;
  animation-delay: 1s;
}

.circle-3 {
  width: 80px;
  height: 80px;
  background: #a855f7;
  top: -40px;
  left: -40px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
  }
}

.empty-content {
  max-width: 280px;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px 0;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  justify-content: center;
}

.empty-btn {
  background: #667eea;
  border: none;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 搜索提示 */
.search-tips {
  margin-top: 32px;
  padding: 16px;
  background: #fef3c7;
  border-radius: 12px;
  border: 1px solid #fbbf24;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-icon {
  color: #d97706;
  font-size: 16px;
}

.tip-text {
  font-size: 14px;
  color: #92400e;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .result-card-content {
    margin: 16px;
    padding: 24px 20px 32px 20px;
    width: calc(100% - 32px);
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .result-stats {
    margin-left: 0;
  }

  .page-title {
    font-size: 20px;
  }

  .action-buttons {
    width: 100%;
    justify-content: center;
  }

  .empty-icon {
    font-size: 48px;
  }

  .circle-1 {
    width: 80px;
    height: 80px;
  }
}
</style>