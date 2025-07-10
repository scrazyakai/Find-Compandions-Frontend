<template>
  <div id="teamCardList" class="team-card-container">
    <van-card
        v-for="team in props.teamList"
        :key="team.id"
        :thumb="ikun"
        :desc="team.description"
        :title="`${team.name}`"
        class="team-card"
    >
      <template #tags>
        <van-tag 
          plain 
          :type="getTagType(team.status)" 
          class="status-tag"
          :class="`status-${team.status}`"
        >
          {{ teamStatusEnum[team.status as 0 | 1 | 2] }}
        </van-tag>
      </template>
      
      <template #bottom>
        <div class="team-info">
          <div class="info-item">
            <van-icon name="friends-o" class="info-icon" />
            <span class="info-text">{{ `${team.hasJoinNum}/${team.maxNum}` }}</span>
          </div>
          <div v-if="team.expireTime" class="info-item">
            <van-icon name="clock-o" class="info-icon" />
            <span class="info-text">{{ team.expireTime }}</span>
          </div>
          <div class="info-item">
            <van-icon name="calendar-o" class="info-icon" />
            <span class="info-text">{{ team.createTime }}</span>
          </div>
        </div>
      </template>
      
      <template #footer>
        <div class="action-buttons">
          <van-button
            size="small"
            type="primary"
            v-if="team.userId !== currentUser?.id && !team.hasJoin"
            class="join-btn"
            @click="preJoinTeam(team)"
            round
            icon="plus"
          >
            加入队伍
          </van-button>
          
          <van-button
            size="small"
            type="warning"
            v-if="team.userId !== currentUser?.id && team.hasJoin"
            class="quit-btn"
            @click="doQuitTeam(team.id)"
            round
            icon="minus"
          >
            退出队伍
          </van-button>
          
          <van-button
            v-if="team.userId === currentUser?.id"
            size="small"
            type="primary"
            class="update-btn"
            @click="doUpdateTeam(team.id)"
            round
            icon="edit"
          >
            更新队伍
          </van-button>
          
          <van-button
            v-if="team.userId === currentUser?.id"
            size="small"
            type="danger"
            class="delete-btn"
            @click="doDeleteTeam(team.id)"
            round
            icon="delete"
          >
            解散队伍
          </van-button>
        </div>
      </template>
    </van-card>
    
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
  padding: 16px;
  background: none;
  min-height: 100vh;
}

.team-card {
  margin-bottom: 20px;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: none !important;
  backdrop-filter: none;
  background: #fff !important;
  border: none;
  transition: none;
  position: relative;
}

#teamCardList :deep(.van-card) {
  border: none !important;
  border-radius: 16px !important;
  background: #fff !important;
  box-shadow: none !important;
}

/* 头像样式 */
#teamCardList :deep(.van-image__img) {
  height: 120px;
  width: 120px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 标题样式 */
#teamCardList :deep(.van-card__title) {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 描述样式 */
#teamCardList :deep(.van-card__desc) {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 8px;
}

/* 状态标签样式 */
.status-tag {
  margin: 8px 8px 0 0;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none !important;
}

.status-0 {
  background: linear-gradient(135deg, #11998e, #38ef7d) !important;
  color: white !important;
}

.status-1 {
  background: linear-gradient(135deg, #f093fb, #f5576c) !important;
  color: white !important;
}

.status-2 {
  background: linear-gradient(135deg, #4facfe, #00f2fe) !important;
  color: white !important;
}

/* 信息区域 */
.team-info {
  padding: 12px 0;
  background: rgba(248, 250, 252, 0.6);
  border-radius: 16px;
  margin: 8px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 0 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  margin-right: 8px;
  color: #667eea;
  font-size: 16px;
}

.info-text {
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
}

/* 按钮区域 */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px 0 8px;
}

.action-buttons .van-button {
  flex: 1;
  min-width: 90px;
  height: 36px;
  border-radius: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.join-btn {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: white !important;
}

.join-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.quit-btn {
  background: linear-gradient(135deg, #f093fb, #f5576c) !important;
  color: white !important;
}

.quit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 147, 251, 0.4);
}

.update-btn {
  background: linear-gradient(135deg, #11998e, #38ef7d) !important;
  color: white !important;
}

.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(17, 153, 142, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #fc4a1a, #f7b733) !important;
  color: white !important;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(252, 74, 26, 0.4);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .team-card-container {
    padding: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .van-button {
    flex: none;
    width: 100%;
    margin-bottom: 8px;
  }
  
  .info-item {
    font-size: 13px;
  }
  
  #teamCardList :deep(.van-image__img) {
    height: 100px;
    width: 100px;
  }
}

/* 加载动画 */
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

.team-card {
  animation: fadeInUp 0.6s ease-out;
}

/* 空状态样式 */
.team-card-container:empty::before {
  content: '🔍 暂无队伍数据';
  display: block;
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 500;
}
</style>