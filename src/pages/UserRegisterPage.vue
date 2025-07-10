<template>
  <div class="register-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
      <div class="floating-particles">
        <div class="particle" v-for="i in 12" :key="i"></div>
      </div>
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
      <p class="slogan">每一次寻觅，都是为了遇见同行的光</p>
    </div>

    <!-- 表单区域 -->
    <div class="register-form card-container">
      <div class="form-header">
        <h2 class="form-title">创建账号</h2>
        <p class="form-subtitle">开始你的寻伴之旅</p>
      </div>

      <van-form @submit="onSubmit">
        <!-- 账号输入框 -->
        <div class="form-item">
          <div class="input-wrapper">
            <div class="input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <van-field
              v-model="form.userAccount"
              name="userAccount"
              placeholder="请输入账号"
              class="register-input"
              :rules="[{ required: true, message: '请填写账号' }]"
            />
          </div>
        </div>

        <!-- 密码输入框 -->
        <div class="form-item">
          <div class="input-wrapper">
            <div class="input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
              </svg>
            </div>
            <van-field
              v-model="form.userPassword"
              type="password"
              name="userPassword"
              placeholder="请输入密码"
              class="register-input"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </div>
        </div>

        <!-- 确认密码输入框 -->
        <div class="form-item">
          <div class="input-wrapper">
            <div class="input-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            </div>
            <van-field
              v-model="form.checkPassword"
              type="password"
              name="checkPassword"
              placeholder="请确认密码"
              class="register-input"
              :rules="[{ required: true, message: '请确认密码' }, { validator: validatePassword }]"
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
            class="register-btn submit-btn"
          >
            <span class="btn-text">注册并登录</span>
          </van-button>
        </div>
      </van-form>

      <!-- 底部链接 -->
      <div class="form-footer">
        <p class="footer-text">
          已有账号？
          <a href="#" @click="goLogin" class="link">立即登录</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Toast, Field, Form, Button } from 'vant';
import { useRouter } from 'vue-router';
import myAxios from '../plugins/myAxios';
import { setCurrentUserState } from '../states/user';

const router = useRouter();
const form = ref({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
});
const loading = ref(false);

// 密码验证
const validatePassword = (val: string) => {
  if (val !== form.value.userPassword) {
    return '两次密码输入不一致';
  }
  return true;
};

const onSubmit = async () => {
  // 前端基础校验（保持不变）
  if (!form.value.userAccount || !form.value.userPassword) {
    Toast('请填写完整账号密码');
    return;
  }
  if (form.value.userPassword !== form.value.checkPassword) {
    Toast('两次密码输入不一致');
    return;
  }
  loading.value = true;
  try {
    // 直接调用"注册并登录"接口，一次请求完成两个操作
    const res = await myAxios.post('/user/registerAndLogin', {
      userAccount: form.value.userAccount, // 账号
      userPassword: form.value.userPassword, // 密码
      checkPassword: form.value.checkPassword // 确认密码
    });

    // 接口返回成功处理
    if (res?.code === 0 && res.data) {
      // 存储用户信息到本地存储和全局状态
      localStorage.setItem('user', JSON.stringify(res.data));
      setCurrentUserState(res.data);
      Toast.success('注册并登录成功');
      // 跳转至标签选择页
      router.push('/user/tag-select');
    } else {
      // 接口返回失败（如参数错误、账号已存在等）
      Toast.fail(res?.message || '注册并登录失败');
    }
  } catch (e: any) {
    // 网络异常等错误处理
    Toast.fail(e?.message || '网络异常');
  } finally {
    // 无论成功/失败，关闭加载状态
    loading.value = false;
  }
};

const goLogin = () => {
  router.push('/user/login');
};
</script>

<style scoped>
/* CSS 变量定义 */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --success-color: #4facfe;
  --bg-light: #f8fafc;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
  --text-tertiary: #718096;
  --border-color: #e2e8f0;
  --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-heavy: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* 全局布局 */
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
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

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: -50px;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: -30px;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float 8s linear infinite;
}

.particle:nth-child(odd) {
  animation-duration: 10s;
}

.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 1s; }
.particle:nth-child(3) { left: 30%; animation-delay: 2s; }
.particle:nth-child(4) { left: 40%; animation-delay: 3s; }
.particle:nth-child(5) { left: 50%; animation-delay: 4s; }
.particle:nth-child(6) { left: 60%; animation-delay: 5s; }
.particle:nth-child(7) { left: 70%; animation-delay: 6s; }
.particle:nth-child(8) { left: 80%; animation-delay: 7s; }
.particle:nth-child(9) { left: 90%; animation-delay: 8s; }
.particle:nth-child(10) { left: 25%; animation-delay: 9s; }
.particle:nth-child(11) { left: 75%; animation-delay: 10s; }
.particle:nth-child(12) { left: 15%; animation-delay: 11s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes particle-float {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}

/* 图标与标语 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0 30px;
  z-index: 2;
  position: relative;
}

.logo-container {
  position: relative;
  margin-bottom: 20px;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.logo-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from { opacity: 0.5; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1.05); }
}

.slogan {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  text-align: center;
  padding: 0 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* 表单容器 */
.card-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 32px 28px;
  z-index: 2;
  position: relative;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
}

/* 表单项 */
.form-item {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-wrapper:hover {
  border-color: rgba(102, 126, 234, 0.3);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.input-wrapper:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 56px;
  color: var(--text-tertiary);
  transition: color 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: var(--primary-color);
}

.register-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0;
  height: 56px;
}

.register-input :deep(.van-field__control) {
  background: transparent;
  border: none;
  font-size: 16px;
  color: var(--text-primary);
  padding: 0 16px 0 0;
}

.register-input :deep(.van-field__control):focus {
  outline: none;
}

.register-input :deep(.van-field__control)::placeholder {
  color: var(--text-tertiary);
  font-size: 14px;
}

/* 按钮样式 */
.button-group {
  margin-top: 32px;
  margin-bottom: 24px;
}

.submit-btn {
  height: 56px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

.btn-text {
  position: relative;
  z-index: 1;
}

/* 表单底部 */
.form-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.footer-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.link:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

/* 加载状态 */
.submit-btn.van-button--loading {
  background: #ccc;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-page {
    padding: 16px;
  }
  
  .register-form {
    padding: 24px 20px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .logo {
    width: 80px;
    height: 80px;
  }
  
  .slogan {
    font-size: 14px;
  }
}

/* 动画增强 */
.register-form {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-item {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.form-item:nth-child(1) { animation-delay: 0.1s; }
.form-item:nth-child(2) { animation-delay: 0.2s; }
.form-item:nth-child(3) { animation-delay: 0.3s; }
.form-item:nth-child(4) { animation-delay: 0.4s; }

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
</style>