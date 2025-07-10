<template>
  <template v-if="user">
    <div class="user-page-container">
      <!-- 背景装饰 -->
      <div class="bg-decoration">
        <div class="bg-circle bg-circle-1"></div>
        <div class="bg-circle bg-circle-2"></div>
        <div class="bg-circle bg-circle-3"></div>
      </div>
      
      <!-- 用户信息卡片 -->
      <div class="user-info card-container">
        <div class="avatar-container">
          <van-image round :src="user.avatarUrl || defaultAvatar" class="avatar" />
          <div class="avatar-ring"></div>
        </div>
        
        <div class="user-details">
          <div class="user-name" :class="{ 'highlighted-role': user.userRole === 1 }">
            {{ user.username || '未登录' }}
            <span v-if="user.userRole === 1" class="role-tag">
              <van-icon name="diamond" size="12" />
              管理员
            </span>
          </div>
          
          <div class="user-stats">
            <div class="stat-item">
              
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              
            </div>
          </div>
        </div>
        
        <van-button type="primary" size="small" @click="toEdit" class="edit-btn">
          <van-icon name="edit" size="14" />
          编辑信息
        </van-button>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-container">
        <van-cell-group class="cell-group card-container">
          <van-cell 
            title="我的队伍" 
            is-link 
            @click="toMyTeam" 
            class="cell-item"
            center
          >
            <template #icon>
              <div class="cell-icon team-icon">
                <van-icon name="flag-o" size="20" />
              </div>
            </template>
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#c8c9cc" />
            </template>
          </van-cell>
          
          <van-cell 
            title="我加入的队伍" 
            is-link 
            @click="toJoinTeam" 
            class="cell-item"
            center
          >
            <template #icon>
              <div class="cell-icon join-icon">
                <van-icon name="friends-o" size="20" />
              </div>
            </template>
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#c8c9cc" />
            </template>
          </van-cell>
        </van-cell-group>

        <!-- 账户操作 -->
        <van-cell-group class="cell-group card-container account-actions">
          <van-cell 
            title="切换账号" 
            is-link 
            @click="handleSwitchAccount" 
            class="cell-item switch-btn"
            center
          >
            <template #icon>
              <div class="cell-icon switch-icon">
                <van-icon name="exchange" size="20" />
              </div>
            </template>
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#c8c9cc" />
            </template>
          </van-cell>
          
          <van-cell 
            title="退出登录" 
            is-link 
            @click="handleLogout" 
            class="cell-item logout-btn"
            center
          >
            <template #icon>
              <div class="cell-icon logout-icon">
                <van-icon name="warning-o" size="20" />
              </div>
            </template>
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#c8c9cc" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const user = ref();
const router = useRouter();

onMounted(async () => {
  user.value = await getCurrentUser();
})

const toEdit = () => {
  router.push('/user/update');
};

const toMyTeam = () => {
  router.push('/user/team/create');
};

const toJoinTeam = () => {
  router.push('/user/team/join');
};

const handleLogout = async () => {
  try {
    await myAxios.post('/user/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    user.value = null;
    router.push('/user/login');
    Toast.success('退出登录成功');
  } catch (error) {
    Toast.fail('退出登录失败，请重试');
    console.error('Logout error:', error);
  }
};

const handleSwitchAccount = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  user.value = null;
  router.push('/user/login');
};
</script>

<style scoped>
/* 页面容器 */
.user-page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.bg-circle-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  right: -60px;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: -40px;
  animation-delay: 2s;
}

.bg-circle-3 {
  width: 60px;
  height: 60px;
  top: 30%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 通用卡片样式 */
.card-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

/* 用户信息区域 */
.user-info {
  margin: 20px 16px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.user-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff7d00, #ffb347);
  border-radius: 20px 20px 0 0;
}

.avatar-container {
  position: relative;
  margin-bottom: 24px;
}

.avatar {
  width: 100px;
  height: 100px;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
}

.avatar-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 116px;
  height: 116px;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff7d00, #ffb347, #ff7d00);
  animation: rotate 3s linear infinite;
  z-index: 1;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.user-details {
  text-align: center;
  margin-bottom: 24px;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.highlighted-role {
  color: #ff7d00;
}

.role-tag {
  background: linear-gradient(45deg, #ff7d00, #ffb347);
  color: white;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(255, 125, 0, 0.3);
}

.user-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #8e9aaf;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: #e1e8ed;
}

.edit-btn {
  padding: 12px 24px;
  border-radius: 25px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* 菜单容器 */
.menu-container {
  padding: 0 16px 20px;
  position: relative;
  z-index: 1;
}

.cell-group {
  margin-bottom: 16px;
  overflow: hidden;
}

.cell-item {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

.cell-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.cell-item:last-child {
  border-bottom: none;
}

.cell-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(45deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.cell-item:hover::before {
  width: 4px;
}

.cell-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.team-icon {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
}

.join-icon {
  background: linear-gradient(45deg, #43e97b, #38f9d7);
  color: white;
}

.switch-icon {
  background: linear-gradient(45deg, #fa709a, #fee140);
  color: white;
}

.logout-icon {
  background: linear-gradient(45deg, #ff6b6b, #ffa726);
  color: white;
}

.account-actions {
  margin-top: 8px;
}

.logout-btn .van-cell__title {
  color: #ff4757;
  font-weight: 600;
}

.switch-btn .van-cell__title {
  color: #5f27cd;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .user-info {
    padding: 24px 16px;
  }
  
  .user-name {
    font-size: 20px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .avatar-ring {
    width: 96px;
    height: 96px;
    top: -8px;
    left: -8px;
  }
}
</style>