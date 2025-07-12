<template>
  <div id="teamCardList" class="team-card-container">
    <div
        v-for="team in props.teamList"
        :key="team.id"
        class="team-card-wrapper"
    >
      <div class="team-card">
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="team-avatar">
            <img :src="ikun" class="avatar-image" />
            <div class="avatar-ring"></div>
          </div>
          <div class="team-header-info">
            <h3 class="team-title">{{ team.name }}</h3>
            <div class="status-badge" :class="`status-${team.status}`">
              <div class="status-icon">
                <svg v-if="team.status === 0" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else-if="team.status === 1" width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 1Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="status-text">{{ teamStatusEnum[team.status as 0 | 1 | 2] }}</span>
            </div>
          </div>
        </div>
        
        <!-- 队伍描述 -->
        <div class="team-description">
          <p>{{ team.description || '暂无描述' }}</p>
        </div>
        
        <!-- 队伍信息 -->
        <div class="team-info">
          <div class="info-item">
            <div class="info-icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="info-label">成员</span>
            <span class="info-value">{{ team.hasJoinNum }}/{{ team.maxNum }}</span>
          </div>
          <div v-if="team.expireTime" class="info-item">
            <div class="info-icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="info-label">过期</span>
            <span class="info-value">{{ formatTime(team.expireTime) }}</span>
          </div>
          <div class="info-item">
            <div class="info-icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="info-label">创建</span>
            <span class="info-value">{{ formatTime(team.createTime) }}</span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button
            v-if="team.userId !== currentUser?.id && !team.hasJoin"
            class="action-btn join-btn"
            @click="preJoinTeam(team)"
          >
            <div class="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="btn-text">加入队伍</span>
          </button>
          
          <button
            v-if="team.userId !== currentUser?.id && team.hasJoin"
            class="action-btn quit-btn"
            @click="doQuitTeam(team.id)"
          >
            <div class="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="btn-text">退出队伍</span>
          </button>
          
          <button
            v-if="team.userId === currentUser?.id"
            class="action-btn update-btn"
            @click="doUpdateTeam(team.id)"
          >
            <div class="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="btn-text">编辑队伍</span>
          </button>
          
          <button
            v-if="team.userId === currentUser?.id"
            class="action-btn delete-btn"
            @click="doDeleteTeam(team.id)"
          >
            <div class="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="btn-text">解散队伍</span>
          </button>
        </div>
      </div>
    </div>
    
    <van-dialog 
      v-model="showPasswordDialog" 
      title="🔐 请输入密码" 
      show-cancel-button 
      @confirm="doJoinTeam" 
      @cancel="doJoinCancel"
      class="password-dialog"
      confirm-button-text="加入"
      cancel-button-text="取消"
    >
      <div class="password-input-container">
        <van-field 
          v-model="password" 
          placeholder="请输入队伍密码"
          type="password"
          left-icon="lock"
          class="password-field"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team";
import ikun from '../assets/ikun.png';
import myAxios from "../plugins/myAxios";
import {Dialog, Toast} from "vant";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import {useRouter} from "vue-router";

interface TeamCardListProps {
  teamList: TeamType[];
  showJoin: boolean;
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  // @ts-ignore
  teamList: [] as TeamType[],
  showJoin: true,
});

const showPasswordDialog = ref(false);
const password = ref('');
const joinTeamId = ref(0);
const currentUser = ref();

const router = useRouter();

onMounted(async () => {
  currentUser.value = await getCurrentUser();
})

// 时间格式化
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) { // 1分钟内
    return '刚刚';
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) { // 24小时内
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else if (diff < 2592000000) { // 30天内
    return `${Math.floor(diff / 86400000)}天前`;
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

// 获取状态标签类型
const getTagType = (status: number) => {
  const typeMap = {
    0: 'success',
    1: 'warning', 
    2: 'danger'
  };
  return typeMap[status as keyof typeof typeMap] || 'default';
}

const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;
  if (team.status === 0) {
    doJoinTeam()
  } else {
    showPasswordDialog.value = true;
  }
}

const doJoinCancel = () => {
  joinTeamId.value = 0;
  password.value = '';
}

/**
 * 加入队伍
 */
const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  const res: any = await myAxios.post('/team/join', {
    teamId: joinTeamId.value,
    password: password.value
  });
  if (res.code === 0) {
    Toast.success('🎉 加入成功');
    doJoinCancel();
    window.location.reload();
  } else {
    Toast.fail('❌ 加入失败' + (res.description ? `，${res.description}` : ''));
  }
}

/**
 * 跳转至更新队伍页
 * @param id
 */
const doUpdateTeam = (id: number) => {
  router.push({
    path: '/team/update',
    query: {
      id,
    }
  })
}

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res: any = await myAxios.post('/team/quit', {
    teamId: id
  });
  if (res.code === 0) {
    Toast.success('✅ 退出成功');
    window.location.reload();
  } else {
    Toast.fail('❌ 退出失败' + (res.description ? `，${res.description}` : ''));
  }
}

/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post('/team/delete', {
    id,
  });
  if (res.code === 0) {
    Toast.success('✅ 操作成功');
    doJoinCancel();
  } else {
    Toast.fail('❌ 操作失败' + (res.description ? `，${res.description}` : ''));
  }
}
</script>

<style scoped>
.team-card-container {
  padding: 20px 16px;
  background: transparent;
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.team-card-wrapper {
  position: relative;
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.team-card-wrapper:nth-child(1) { animation-delay: 0.1s; }
.team-card-wrapper:nth-child(2) { animation-delay: 0.2s; }
.team-card-wrapper:nth-child(3) { animation-delay: 0.3s; }
.team-card-wrapper:nth-child(4) { animation-delay: 0.4s; }
.team-card-wrapper:nth-child(5) { animation-delay: 0.5s; }
.team-card-wrapper:nth-child(6) { animation-delay: 0.6s; }

.team-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.team-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  pointer-events: none;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.team-card:hover::before {
  opacity: 1;
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.team-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-image {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 6px 20px rgba(255, 254, 254, 0.539);
  transition: transform 0.3s ease;
}

.team-card:hover .avatar-image {
  transform: scale(1.05);
}

.avatar-ring {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  opacity: 0;
  animation: pulse-ring 2s infinite;
  transition: opacity 0.3s ease;
}

.team-card:hover .avatar-ring {
  opacity: 0.3;
}

.team-header-info {
  flex: 1;
  min-width: 0;
}

.team-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.3;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.status-badge.status-0 {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.status-badge.status-1 {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.status-badge.status-2 {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  font-size: 11px;
}

/* 队伍描述 */
.team-description {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(248, 250, 252, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.team-description p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  font-style: italic;
}

/* 信息区域 */
.team-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(248, 250, 252, 0.4);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: #667eea;
  flex-shrink: 0;
}

.info-label {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  min-width: 40px;
}

.info-value {
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  flex: 1;
}

/* 按钮区域 */
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 120px;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.action-btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-text {
  font-size: 13px;
  letter-spacing: 0.3px;
}

.join-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.join-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.quit-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.3);
}

.quit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.4);
}

.update-btn {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.action-btn:active {
  transform: translateY(0);
}

/* 密码对话框 */
.password-dialog :deep(.van-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

.password-dialog :deep(.van-dialog__header) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  font-size: 16px;
  font-weight: 600;
}

.password-input-container {
  padding: 20px;
}

.password-field {
  border-radius: 12px;
  overflow: hidden;
}

.password-field :deep(.van-field__control) {
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  padding: 12px;
}

.password-dialog :deep(.van-dialog__footer) {
  background: rgba(248, 250, 252, 0.5);
  padding: 16px 20px;
}

.password-dialog :deep(.van-button--primary) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 8px;
}

.password-dialog :deep(.van-button--default) {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-ring {
  0% { 
    transform: scale(1); 
    opacity: 0.3; 
  }
  50% { 
    transform: scale(1.1); 
    opacity: 0.1; 
  }
  100% { 
    transform: scale(1); 
    opacity: 0.3; 
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .team-card-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .team-card-container {
    grid-template-columns: 1fr;
    padding: 16px 12px;
    gap: 16px;
  }
  
  .team-card {
    padding: 20px;
  }
  
  .card-header {
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .avatar-image {
    width: 56px;
    height: 56px;
  }
  
  .team-title {
    font-size: 18px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    min-width: auto;
    width: 100%;
  }
  
  .team-info {
    padding: 12px;
  }
  
  .team-description {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .team-card-container {
    padding: 12px 8px;
  }
  
  .team-card {
    padding: 16px;
    border-radius: 20px;
  }
  
  .card-header {
    gap: 10px;
    margin-bottom: 12px;
  }
  
  .avatar-image {
    width: 48px;
    height: 48px;
  }
  
  .team-title {
    font-size: 16px;
  }
  
  .info-icon-wrapper {
    width: 28px;
    height: 28px;
  }
  
  .action-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .btn-text {
    font-size: 12px;
  }
}

/* 空状态样式 */
.team-card-container:empty::before {
  content: '🔍 暂无队伍数据';
  display: block;
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  font-weight: 600;
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 加载骨架屏效果 */
.team-card.loading {
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .team-card {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .team-title {
    color: #f1f5f9;
  }
  
  .team-description p {
    color: #94a3b8;
  }
  
  .info-label {
    color: #94a3b8;
  }
  
  .info-value {
    color: #e2e8f0;
  }
  
  .team-info {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .team-description {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>