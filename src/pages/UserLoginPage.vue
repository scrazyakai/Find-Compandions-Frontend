<template>
  <div class="login-page">
    <!-- 图标与标语 -->
    <div class="logo-section">
      <img
        src="../assets/Find-Compandions.png"
        alt="寻伴图标"
        class="logo"
      />
      <p class="slogan">每一次寻觅，都是为了遇见同行的光</p>
    </div>

    <!-- 表单区域 -->
    <div class="login-form card-container">
      <van-form @submit="onSubmit">
        <!-- 账号输入框 -->
        <div class="form-item">
          <label class="label">账号</label>
          <van-field
            v-model="form.userAccount"
            name="userAccount"
            placeholder="请输入账号"
            class="login-input"
            :rules="[{ required: true, message: '请填写账号' }]"
          />
        </div>

        <!-- 密码输入框 -->
        <div class="form-item">
          <label class="label">密码</label>
          <van-field
            v-model="form.userPassword"
            type="password"
            name="userPassword"
            placeholder="请输入密码"
            class="login-input"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
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
            登录
          </van-button>
          <van-button
            round
            block
            type="info"
            @click="goRegister"
            class="register-btn"
          >
            注册新账号
          </van-button>
        </div>

        <!-- 辅助链接 -->
        <div class="extra-links login-footer">
          <span class="link-text register-button" @click="goRegister">注册账号</span>
          <span class="link-text forget-password" @click="forgetPassword">忘记密码？</span>
        </div>
      </van-form>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Toast, Button, Field, Form, Tabbar, TabbarItem } from 'vant';
import { useRouter } from 'vue-router';
import myAxios from '../plugins/myAxios';

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
      console.log('Login request URL:', myAxios.defaults.baseURL + '/user/login');
      console.log('Login request params:', form.value);
    console.log('Login response data:', res);
      if (res?.code === 0 && res.data && res.data.id) { console.log('Login success condition met (code=0)');
        console.log('Login success detected with response:', res);
      Toast.success('登录成功');
      console.log('Attempting redirect to http://localhost:3000/');
      router.push('/');
      console.log('Redirect executed');
    } else {
      Toast.fail('账号或密码错误');
        console.error('Login failed details:', res);
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
/* 全局布局 - 背景改为白色 */
.login-page {
  min-height: 100vh;
  background-color: var(--bg-light); 
  color: #333; 
  font-family: 'PingFang SC', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center; 
  overflow: hidden; /* 禁止页面滚动 */
  position: fixed; /* 固定页面位置 */
  width: 100%; /* 确保宽度充满屏幕 */
  padding-top: 46px; /* 为导航栏预留空间 */
}

/* 图标与标语 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60px 0 30px; /* 调整间距 */
}

.logo {
  width: 120px; 
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.slogan {
  margin-top: 20px;
  font-size: 15px; 
  color: var(--text-secondary); 
  line-height: 1.6;
  text-align: center;
  padding: 0 20px;
}

/* 表单容器 */
.login-form {
  width: 100%;
  max-width: 400px; 
  padding: 24px;
  margin-bottom: 20px;
}

/* 表单项（核心对齐逻辑） */
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.label {
  width: 60px; 
  font-size: 15px;
  color: var(--text-secondary); 
}

.login-input {
  flex: 1;
  margin-bottom: 16px;
  --van-field-background: #f8f8f8; 
  --van-field-color: var(--text-primary);
  --van-field-placeholder-color: var(--text-tertiary);
  --van-field-border-color: #ddd; 
  border-radius: 8px;
}

/* 按钮组 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.login-btn {
  --van-button-background-color: #007aff;
  --van-button-border-color: #007aff;
  height: 48px;
  font-size: 16px;
  border-radius: var(--border-radius);
}

.register-btn {
  --van-button-background-color: #f8f8f8; 
  --van-button-border-color: #ddd; 
  --van-button-text-color: #333; 
  --van-button-active-background-color: #f0f0f0; 
  height: 48px;
  font-size: 16px;
  border-radius: var(--border-radius);
}

/* 辅助链接（修改后的样式） */
.extra-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 16px;
}

.link-text {
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.register-button {
  color: var(--primary-color);
  font-weight: 500;
}

.forget-password {
  color: var(--text-secondary);
}

.link-text:hover {
  color: #005ee6; 
}

/* 底部导航 */
.bottom-tabbar {
  --van-tabbar-background: #fff; 
  --van-tabbar-item-text-color: #999;
  --van-tabbar-item-active-text-color: #007aff;
  --van-tabbar-item-icon-size: 22px;
  border-top: 1px solid #ddd; 
  width: 100%; 
}

/* 错误提示样式 */
.van-form__error-message {
  color: var(--error-color) !important;
}
</style>