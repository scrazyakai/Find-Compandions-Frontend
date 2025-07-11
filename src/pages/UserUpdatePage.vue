<template>
  <div v-if="user" class="profile-container">
    <!-- 固定返回按钮 -->
    <div class="fixed-back-button">
      <van-button icon="arrow-left" class="back-btn" type="default" size="small" @click="goBack" />
    </div>
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">个人信息</div>
      <div class="page-subtitle">查看和编辑您的个人信息</div>
    </div>

    <!-- 头像区域 -->
    <div class="avatar-section">
      <div class="avatar-container">
        <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleFileChange"/>
        <van-image
            round
            width="120" height="120"
            :src="user.avatarUrl"
            class="avatar-image"
            @click="handleAvatarClick"
        />
        <div class="avatar-overlay" @click="handleAvatarClick">
          <van-icon name="photograph" size="24" color="#fff"/>
        </div>
      </div>
      <div class="user-name">{{ user.username }}</div>
      <div class="user-account">@{{ user.userAccount }}</div>
    </div>

    <!-- 用户信息区域 -->
    <div class="info-section">
      <div class="section-title">基本信息</div>
      <div class="info-card">
        <van-cell 
          title="昵称" 
          is-link 
          :value="user.username" 
          @click="toEdit('username', '昵称', user.username)"
          class="info-cell"
        >
          <template #icon>
            <van-icon name="user-o" class="cell-icon"/>
          </template>
        </van-cell>
        
        <van-cell 
          title="性别" 
          is-link 
          :value="genderMap[Number(user.gender)]" 
          @click="toEdit('gender', '性别', user.gender)"
          class="info-cell"
        >
          <template #icon>
            <van-icon name="friends-o" class="cell-icon"/>
          </template>
        </van-cell>
        
        <van-cell 
          title="电话" 
          is-link 
          :value="user.phone" 
          @click="toEdit('phone', '电话', user.phone)"
          class="info-cell"
        >
          <template #icon>
            <van-icon name="phone-o" class="cell-icon"/>
          </template>
        </van-cell>
        
        <van-cell 
          title="邮箱" 
          is-link 
          :value="user.email" 
          @click="toEdit('email', '邮箱', user.email)"
          class="info-cell"
        >
          <template #icon>
            <van-icon name="envelop-o" class="cell-icon"/>
          </template>
        </van-cell>
      </div>
    </div>

    <!-- 其他信息区域 -->
    <div class="info-section">
      <div class="section-title">其他信息</div>
      <div class="info-card">
        <van-cell 
          title="星球编号" 
          :value="user.planetCode"
          class="info-cell"
        >
          <template #icon>
            <van-icon name="star-o" class="cell-icon"/>
          </template>
        </van-cell>
        
        <van-cell 
          title="标签" 
          is-link 
          :value="userTags" 
          @click="toEditTags"
          class="info-cell"
        >
          <template #icon>
            <van-icon name="label-o" class="cell-icon"/>
          </template>
        </van-cell>
        
        <van-cell 
          title="注册时间" 
          :value="user.createTime"
          class="info-cell"
        >
          <template #icon>
            <van-icon name="calendar-o" class="cell-icon"/>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast, Image} from "vant";
import {getCurrentUser} from "../services/user";

const user = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
})

const router = useRouter();

const fileInput = ref<HTMLInputElement>();

const handleAvatarClick = () => {
  fileInput.value?.click();
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    Toast.loading('上传中...');
    const response = await myAxios.post<string>('http://localhost:8080/api/upload/image', formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
    if (response.code === 0) {
      user.value.avatarUrl = response.data;
      Toast.success('上传成功');
    } else {
      Toast.fail(response.message || '上传失败');
    }
  } catch (error) {
    console.error('上传失败:', error);
    Toast.fail('上传失败，请重试');
  } finally {
    target.value = '';
  }
};

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    }
  })
}

const userTags = ref('');

const toEditTags = () => {
  router.push('/user/edit-tags');
};

// 解析用户标签
const parseUserTags = (tagsStr: string) => {
  if (!tagsStr) return '';
  const tags = tagsStr.split(',');
  return tags.join(' ');
};

const genderMap: Record<number, string> = {
  0: '男',
  1: '女'
};

const goBack = () => {
  router.push("/user");
};
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 20px;
  position: relative;
}

.avatar-section {
  text-align: center;
  padding: 40px 20px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 30px;
  margin: 0 16px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.avatar-image {
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-account {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 400;
}

.info-section {
  margin: 0 16px 24px;
  padding-top: 10px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 4px;
}

.info-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.info-cell {
  --van-cell-font-size: 16px;
  --van-cell-vertical-padding: 16px;
  --van-cell-horizontal-padding: 20px;
  transition: all 0.3s ease;
}

.info-cell:hover {
  background: rgba(102, 126, 234, 0.05);
}

.info-cell:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.cell-icon {
  color: #667eea;
  margin-right: 12px;
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .page-header {
    padding: 70px 15px 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .avatar-section {
    padding: 30px 16px 24px;
  }
  
  .user-name {
    font-size: 22px;
  }
  
  .info-section {
    margin: 0 12px 20px;
  }
  
  .section-title {
    font-size: 16px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .profile-container {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  }
  
  .info-card {
    background: rgba(45, 55, 72, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .section-title {
    color: #e2e8f0;
  }
  
  .info-cell {
    --van-cell-text-color: #e2e8f0;
    --van-cell-value-color: #a0aec0;
  }
  
  .info-cell:hover {
    background: rgba(102, 126, 234, 0.1);
  }
}

/* 添加一些动画效果 */
.info-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.avatar-section {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 页面标题样式 */
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 80px 20px 20px;
  text-align: center;
  border-radius: 0 0 25px 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  position: relative;
  z-index: 10;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  opacity: 0.8;
}

/* 固定返回按钮样式 */
.fixed-back-button {
  position: fixed;
  left: 16px;
  top: 32px;
  z-index: 9999;
  pointer-events: auto;
}

.back-btn {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
  color: #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  z-index: 9999;
}

.back-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
}

.back-btn:active {
  background: rgba(243, 244, 246, 0.95);
  transform: scale(0.95);
}
</style>