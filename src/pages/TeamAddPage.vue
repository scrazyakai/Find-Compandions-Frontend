<template>
  <div id="teamAddPage" class="team-add-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="page-title">创建队伍</h1>
        <p class="page-subtitle">组建你的学习团队，共同成长</p>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-container">
      <div class="form-wrapper">
        <van-form @submit="onSubmit" class="team-form">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="section-title">基本信息</h3>
            </div>
            
            <div class="form-group">
              <div class="field-wrapper">
                <label class="field-label">
                  <span class="label-icon">📝</span>
                  <span class="label-text">队伍名称</span>
                  <span class="required">*</span>
                </label>
                <div class="input-container">
                  <input 
                    v-model="addTeamData.name"
                    type="text"
                    placeholder="请输入队伍名称"
                    class="custom-input"
                    :class="{ 'error': errors.name }"
                    @blur="validateName"
                  />
                  <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
                </div>
              </div>
              
              <div class="field-wrapper">
                <label class="field-label">
                  <span class="label-icon">💬</span>
                  <span class="label-text">队伍描述</span>
                </label>
                <div class="input-container">
                  <textarea 
                    v-model="addTeamData.description"
                    placeholder="请输入队伍描述，让大家了解你的队伍..."
                    class="custom-textarea"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 队伍设置 -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="section-title">队伍设置</h3>
            </div>
            
            <div class="form-group">
              <div class="field-wrapper">
                <label class="field-label">
                  <span class="label-icon">⏰</span>
                  <span class="label-text">过期时间</span>
                </label>
                <div class="input-container">
                  <div class="datetime-input" @click="showPicker = true">
                    <input 
                      :value="formatExpireTime"
                      readonly
                      placeholder="点击选择过期时间"
                      class="custom-input datetime-display"
                    />
                    <div class="datetime-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                  </div>
                  <van-popup v-model:show="showPicker" position="bottom" class="datetime-picker-popup">
                    <van-datetime-picker
                        v-model="addTeamData.expireTime"
                        @confirm="showPicker = false"
                        type="datetime"
                        title="请选择过期时间"
                        :min-date="minDate"
                        class="custom-datetime-picker"
                    />
                  </van-popup>
                </div>
              </div>
              
              <div class="field-wrapper">
                <label class="field-label">
                  <span class="label-icon">👥</span>
                  <span class="label-text">最大人数</span>
                </label>
                <div class="input-container">
                  <div class="stepper-container">
                    <button type="button" @click="decreaseMaxNum" class="stepper-btn" :disabled="addTeamData.maxNum <= 3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                    <div class="stepper-value">{{ addTeamData.maxNum }}</div>
                    <button type="button" @click="increaseMaxNum" class="stepper-btn" :disabled="addTeamData.maxNum >= 10">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                  </div>
                  <div class="stepper-hint">人数范围：3-10人</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 私密性设置 -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <h3 class="section-title">私密性设置</h3>
            </div>
            
            <div class="form-group">
              <div class="field-wrapper">
                <label class="field-label">
                  <span class="label-icon">🔒</span>
                  <span class="label-text">队伍状态</span>
                </label>
                <div class="radio-group">
                  <div 
                    v-for="option in statusOptions" 
                    :key="option.value"
                    class="radio-option"
                    :class="{ 'active': addTeamData.status == option.value }"
                    @click="addTeamData.status = option.value"
                  >
                    <div class="radio-icon">{{ option.icon }}</div>
                    <div class="radio-content">
                      <div class="radio-title">{{ option.label }}</div>
                      <div class="radio-desc">{{ option.desc }}</div>
                    </div>
                    <div class="radio-indicator">
                      <div class="radio-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="Number(addTeamData.status) === 2" class="field-wrapper password-field">
                <label class="field-label">
                  <span class="label-icon">🔑</span>
                  <span class="label-text">队伍密码</span>
                  <span class="required">*</span>
                </label>
                <div class="input-container">
                  <input 
                    v-model="addTeamData.password"
                    type="password"
                    placeholder="请输入队伍密码"
                    class="custom-input"
                    :class="{ 'error': errors.password }"
                    @blur="validatePassword"
                  />
                  <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                  <div class="field-hint">密码用于保护队伍隐私，仅邀请人员加入</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 提交按钮 -->
          <div class="submit-section">
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <div class="btn-content">
                <div v-if="isSubmitting" class="loading-spinner"></div>
                <div class="btn-icon" v-else>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4889 2.02168 11.3363C2.16356 9.18377 2.99721 7.13729 4.39828 5.49695C5.79935 3.85661 7.69279 2.71477 9.79619 2.24001C11.8996 1.76525 14.1003 1.98242 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span class="btn-text">{{ isSubmitting ? '创建中...' : '创建队伍' }}</span>
              </div>
            </button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {ref, computed} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const router = useRouter();
// 展示日期选择器
const showPicker = ref(false);
const isSubmitting = ref(false);
const errors = ref({
  name: '',
  password: ''
});

const initFormData = {
  "name": "",
  "description": "",
  "expireTime": null,
  "maxNum": 3,
  "password": "",
  "status": 0,
}

const minDate = new Date();

// 需要用户填写的表单数据
const addTeamData = ref({...initFormData});

// 状态选项
const statusOptions = [
  {
    value: 0,
    label: '公开',
    desc: '任何人都可以加入',
    icon: '🌍'
  },
  {
    value: 1,
    label: '私有',
    desc: '仅邀请人员可见',
    icon: '🔒'
  },
  {
    value: 2,
    label: '加密',
    desc: '需要密码才能加入',
    icon: '🔑'
  }
];

// 格式化过期时间
const formatExpireTime = computed(() => {
  if (!addTeamData.value.expireTime) return '';
  const date = new Date(addTeamData.value.expireTime);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
});

// 验证函数
const validateName = () => {
  if (!addTeamData.value.name.trim()) {
    errors.value.name = '请输入队伍名称';
  } else if (addTeamData.value.name.length > 20) {
    errors.value.name = '队伍名称不能超过20个字符';
  } else {
    errors.value.name = '';
  }
};

const validatePassword = () => {
  if (Number(addTeamData.value.status) === 2) {
    if (!addTeamData.value.password.trim()) {
      errors.value.password = '请输入队伍密码';
    } else if (addTeamData.value.password.length < 4) {
      errors.value.password = '密码至少需要4个字符';
    } else {
      errors.value.password = '';
    }
  } else {
    errors.value.password = '';
  }
};

// 数量控制
const increaseMaxNum = () => {
  if (addTeamData.value.maxNum < 10) {
    addTeamData.value.maxNum++;
  }
};

const decreaseMaxNum = () => {
  if (addTeamData.value.maxNum > 3) {
    addTeamData.value.maxNum--;
  }
};

// 提交
const onSubmit = async () => {
  // 验证表单
  validateName();
  validatePassword();
  
  if (errors.value.name || errors.value.password) {
    Toast.fail('请检查表单信息');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const postData = {
      ...addTeamData.value,
      status: Number(addTeamData.value.status)
    };
    
    const res = await myAxios.post("/team/add", postData);
    if (res?.code === 0 && res.data) {
      Toast.success('🎉 队伍创建成功！');
      router.push({
        path: '/team',
        replace: true,
      });
    } else {
      Toast.fail('❗ 创建失败：' + (res.description || '未知错误'));
    }
  } catch (error) {
    Toast.fail('❗ 网络错误，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.team-add-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow-x: hidden;
}

/* 页面头部 */
.page-header {
  position: relative;
  padding: 40px 20px 60px;
  text-align: center;
  overflow: hidden;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 70%, transparent 100%);
  animation: float 8s ease-in-out infinite;
  backdrop-filter: blur(2px);
}

.circle-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1); 
    opacity: 0.7;
  }
  33% { 
    transform: translateY(-15px) rotate(120deg) scale(1.1); 
    opacity: 1;
  }
  66% { 
    transform: translateY(-30px) rotate(240deg) scale(0.9); 
    opacity: 0.8;
  }
}

.header-content {
  position: relative;
  z-index: 10;
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 表单容器 */
.form-container {
  padding: 0 20px 40px;
  position: relative;
  z-index: 10;
}

.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.team-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.team-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
  pointer-events: none;
}

/* 表单分区 */
.form-section {
  margin-bottom: 32px;
  position: relative;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 50%;
  color: #667eea;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 字段样式 */
.field-wrapper {
  position: relative;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.label-icon {
  font-size: 16px;
}

.label-text {
  flex: 1;
}

.required {
  color: #ef4444;
  font-weight: 700;
}

.input-container {
  position: relative;
}

.custom-input,
.custom-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.8);
  font-size: 14px;
  color: #374151;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
}

.custom-input:focus,
.custom-textarea:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.custom-input.error,
.custom-textarea.error {
  border-color: #ef4444;
  background: rgba(254, 242, 242, 0.8);
}

.custom-input::placeholder,
.custom-textarea::placeholder {
  color: #9ca3af;
}

.custom-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-message::before {
  content: '⚠️';
  font-size: 10px;
}

/* 日期时间选择器 */
.datetime-input {
  position: relative;
  cursor: pointer;
}

.datetime-display {
  cursor: pointer;
  padding-right: 40px;
}

.datetime-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.datetime-picker-popup :deep(.van-popup) {
  border-radius: 20px 20px 0 0;
}

.custom-datetime-picker :deep(.van-datetime-picker) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

.custom-datetime-picker :deep(.van-picker__toolbar) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.custom-datetime-picker :deep(.van-picker__confirm),
.custom-datetime-picker :deep(.van-picker__cancel) {
  color: white;
  font-weight: 600;
}

.custom-datetime-picker :deep(.van-picker__title) {
  color: white;
  font-weight: 600;
}

/* 步进器 */
.stepper-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  background: rgba(248, 250, 252, 0.8);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  width: fit-content;
}

.stepper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stepper-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.stepper-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.stepper-value {
  min-width: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.stepper-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

/* 单选组 */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.radio-option:hover {
  border-color: rgba(102, 126, 234, 0.3);
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.radio-option.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.radio-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.radio-content {
  flex: 1;
}

.radio-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.radio-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.radio-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.radio-option.active .radio-indicator {
  border-color: #667eea;
  background: #667eea;
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.radio-option.active .radio-dot {
  opacity: 1;
}

/* 密码字段动画 */
.password-field {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.field-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  font-style: italic;
}

/* 提交按钮 */
.submit-section {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.submit-btn {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) .btn-icon {
  transform: scale(1.1);
}

.btn-text {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 30px 16px 40px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .form-container {
    padding: 0 16px 30px;
  }
  
  .team-form {
    padding: 24px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .radio-group {
    gap: 8px;
  }
  
  .radio-option {
    padding: 12px;
    gap: 12px;
  }
  
  .radio-title {
    font-size: 14px;
  }
  
  .radio-desc {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 20px 12px 30px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .header-icon {
    width: 56px;
    height: 56px;
  }
  
  .form-container {
    padding: 0 12px 20px;
  }
  
  .team-form {
    padding: 20px;
    border-radius: 20px;
  }
  
  .form-section {
    margin-bottom: 24px;
  }
  
  .section-header {
    margin-bottom: 16px;
  }
  
  .custom-input,
  .custom-textarea {
    padding: 12px 14px;
    font-size: 14px;
  }
  
  .submit-btn {
    padding: 14px 20px;
    font-size: 15px;
  }
  
  .decoration-circle {
    display: none;
  }
}</style>
