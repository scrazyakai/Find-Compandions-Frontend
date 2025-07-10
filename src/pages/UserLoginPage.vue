<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 图标与标语 -->
    <div class="logo-section">
      <div class="logo-container">
        <img
          src="../assets/Find-Compandions.png"
          alt="寻伴图标"
          class="logo"
        />
        <div class="logo-glow"></div>
      </div>
      <h1 class="app-title">寻伴</h1>
      <p class="slogan">每一次寻觅，都是为了遇见同行的光</p>
    </div>

    <!-- 表单区域 -->
    <div class="login-form card-container">
      <van-form @submit="onSubmit">
        <!-- 账号输入框 -->
        <div class="form-item">
          <div class="input-wrapper">
            <van-icon name="user-o" class="input-icon" />
            <van-field
              v-model="form.userAccount"
              name="userAccount"
              placeholder="请输入账号"
              class="login-input"
              :rules="[{ required: true, message: '请填写账号' }]"
            />
          </div>
        </div>

        <!-- 密码输入框 -->
        <div class="form-item">
          <div class="input-wrapper">
            <van-icon name="lock" class="input-icon" />
            <van-field
              v-model="form.userPassword"
              type="password"
              name="userPassword"
              placeholder="请输入密码"
              class="login-input"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="button-group">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            class="login-btn submit-btn"
          >
            <span class="btn-text">登录</span>
          </van-button>
          
          <div class="divider">
            <span class="divider-text">或者</span>
          </div>
          
          <van-button
            round
            block
            type="info"
            @click="goRegister"
            class="register-btn"
          >
            <van-icon name="user-plus-o" class="btn-icon" />
            <span class="btn-text">注册新账号</span>
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 辅助链接 -->
    <div class="extra-links">
      <span class="link-text forget-password" @click="forgetPassword">
        <van-icon name="question-o" />
        忘记密码？
      </span>
    </div>

    <!-- 装饰性元素 -->
    <div class="floating-elements">
      <div class="floating-dot dot-1"></div>
      <div class="floating-dot dot-2"></div>
      <div class="floating-dot dot-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Toast, Button, Field, Form, Tabbar, TabbarItem } from 'vant';
import { useRouter } from 'vue-router';
import myAxios from '../plugins/myAxios';
import { setCurrentUserState } from '../states/user';

const router = useRouter();
const form = ref({
  userAccount: '',
  userPassword: '',
});
const loading = ref(false);

const onSubmit = async () => {
  if (!form.value.userAccount || !form.value.userPassword) {
    Toast('请填写完整账号密码');
    return;
  }
  loading.value = true;
  try {
    const res = await myAxios.post('/user/login', {
        userAccount: form.value.userAccount,
        userPassword: form.value.userPassword,
      });
    if (res?.code === 0 && res.data && res.data.id) {
      Toast.success('登录成功');
      setCurrentUserState(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      router.push('/');
    } else {
      Toast.fail('账号或密码错误');
    }
  } catch (e: any) {
    Toast.fail(e?.message || '网络异常');
  } finally {
    loading.value = false;
  }
};

const goRegister = () => {
  router.push('/register');
};

const forgetPassword = () => {
  Toast('忘记密码功能即将上线');
};

const goHelpCenter = () => {
  Toast('帮助中心即将上线');
};
</script>

<style scoped>
/* CSS 变量定义 */
:root {
  --primary-color: #667eea;
  --primary-dark: #5a6fd8;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --text-tertiary: #bdc3c7;
  --bg-light: #f8f9fa;
  --bg-card: rgba(255, 255, 255, 0.9);
  --border-radius: 16px;
  --shadow-light: 0 4px 20px rgba(0, 0, 0, 0.1);
  --shadow-heavy: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* 全局布局 */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--text-primary);
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  padding: 20px;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -75px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: -50px;
  animation: float 10s ease-in-out infinite;
}

/* 图标与标语 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  z-index: 2;
  position: relative;
}

.logo-container {
  position: relative;
  margin-bottom: 16px;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: var(--shadow-heavy);
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--accent-color), var(--primary-color));
  opacity: 0.3;
  animation: pulse 2s infinite;
  z-index: 1;
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slogan {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  text-align: center;
  padding: 0 20px;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 表单容器 */
.login-form {
  width: 100%;
  max-width: 360px;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  padding: 32px 24px;
  box-shadow: var(--shadow-heavy);
  z-index: 2;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 表单项 */
.form-item {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  background: white;
}

.input-icon {
  color: var(--text-secondary);
  font-size: 18px;
  margin-right: 12px;
  transition: color 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: var(--primary-color);
}

.login-input {
  flex: 1;
  background: transparent;
  border: none;
  height: 48px;
  font-size: 16px;
  color: var(--text-primary);
}

.login-input :deep(.van-field__body) {
  background: transparent;
  border: none;
  padding: 0;
}

.login-input :deep(.van-field__control) {
  background: transparent;
  border: none;
  font-size: 16px;
  color: var(--text-primary);
}

.login-input :deep(.van-field__control::placeholder) {
  color: var(--text-tertiary);
}

/* 按钮组 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px 0;
}

.login-btn {
  height: 52px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.login-btn:active {
  transform: translateY(0);
}

.register-btn {
  height: 52px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--primary-color);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.register-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.btn-text {
  font-weight: 500;
}

.btn-icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 分割线 */
.divider {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(102, 126, 234, 0.3), transparent);
}

.divider-text {
  margin: 0 16px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 0 8px;
}

/* 辅助链接 */
.extra-links {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  z-index: 2;
  position: relative;
}

.link-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
}

.link-text:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 浮动装饰元素 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float-dot 4s ease-in-out infinite;
}

.dot-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.dot-2 {
  top: 60%;
  right: 20%;
  animation-delay: 1s;
}

.dot-3 {
  bottom: 30%;
  left: 10%;
  animation-delay: 2s;
}

/* 动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

@keyframes float-dot {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }
  
  .login-form {
    padding: 24px 20px;
  }
  
  .app-title {
    font-size: 24px;
  }
  
  .slogan {
    font-size: 13px;
  }
  
  .login-btn,
  .register-btn {
    height: 48px;
    font-size: 15px;
  }
}

/* 错误提示样式 */
.van-form__error-message {
  color: #ff4757 !important;
  font-size: 12px;
  margin-top: 4px;
}

/* 加载状态 */
.van-loading {
  color: white;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-card: rgba(45, 55, 72, 0.9);
    --text-primary: #e2e8f0;
    --text-secondary: #a0aec0;
    --text-tertiary: #718096;
  }
  
  .input-wrapper {
    background: rgba(45, 55, 72, 0.8);
  }
  
  .input-wrapper:focus-within {
    background: rgba(45, 55, 72, 0.9);
  }
  
  .register-btn {
    background: rgba(45, 55, 72, 0.8);
    color: #e2e8f0;
  }
  
  .register-btn:hover {
    background: rgba(45, 55, 72, 0.9);
  }
}
</style>