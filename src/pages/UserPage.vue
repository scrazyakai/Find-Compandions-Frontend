<template>
  <template v-if="user">
  <div class="user-page-container">
    <div class="user-info card-container">
      <van-image round :src="user.avatarUrl || defaultAvatar" class="avatar" />
      <div class="user-name" :class="{ 'highlighted-role': user.userRole === 1 }">
        {{ user.username || '未登录' }}
        <!-- 添加角色标识 -->
        <span v-if="user.userRole === 1" class="role-tag">管理员</span>
      </div>
      <van-button type="primary" size="small" @click="toEdit" class="edit-btn">编辑信息</van-button>
    </div>
    <van-cell-group class="cell-group card-container">
      <van-cell title="我的队伍" is-link @click="toMyTeam" class="cell-item" />
      <van-cell title="我加入的队伍" is-link @click="toJoinTeam" class="cell-item" />
      <!-- 修改为van-cell组件并应用cell-item样式 -->
      <van-cell title="退出登录" is-link @click="handleLogout" class="cell-item logout-btn" />
      <van-cell title="切换账号" is-link @click="handleSwitchAccount" class="cell-item switch-btn" />
    </van-cell-group>
  </div>
</template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

// const user = {
//   id: 1,
//   username: '鱼皮',
//   userAccount: 'dogYupi',
//   avatarUrl: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/logo.png',
//   gender: '男',
//   phone: '123112312',
//   email: '12345@qq.com',
//   planetCode: '1234',
//   createTime: new Date(),
// }

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
    // 调用后端退出登录接口
    await myAxios.post('/user/logout');
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 重置用户状态
    user.value = null;
    // 跳转到登录页
    router.push('/user/login');
    Toast.success('退出登录成功');
  } catch (error) {
    Toast.fail('退出登录失败，请重试');
    console.error('Logout error:', error);
  }
};

const handleSwitchAccount = () => {
  // 清除本地存储
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // 重置用户状态
  user.value = null;
  // 跳转到登录页
  router.push('/user/login');
};
</script>

<style scoped>
/* 个人页面容器样式 */
.user-page-container {
  padding: 16px;
}

/* 用户信息区域样式 */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  margin-bottom: 16px;
}

.avatar {
  width: 96px;
  height: 96px;
  border: 3px solid var(--primary-light);
}

.user-name {
  margin-top: 16px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 角色突出显示样式 */
.highlighted-role {
  color: #ff7d00; /* 橙色文字 */
  font-weight: bold;
}

/* 角色标签样式 */
.role-tag {
  background-color: #ff7d00;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: normal;
}

.edit-btn {
  padding: 6px 20px;
  border-radius: 20px;
}

/* 单元格组样式 */
.cell-group {
  margin-top: 16px;
  padding: 8px 0;
}

.cell-item {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
}

.cell-item:last-child {
  border-bottom: none;
}

/* 移除原有的action-buttons相关样式 */
/* 删除以下代码块 */
/*
.action-buttons {
  display: flex;
  gap: 10px;
  margin: 16px;
  justify-content: center;
}

.logout-btn {
  padding: 6px 16px;
  border-radius: 20px;
}

.switch-btn {
  padding: 6px 16px;
  border-radius: 20px;
}
*/

/* 添加退出登录按钮文本颜色 */
.logout-btn .van-cell__title {
  color: #f53f3f; /* 使用vant的danger颜色 */
}
</style>
