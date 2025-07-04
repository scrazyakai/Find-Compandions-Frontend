<template>
  <div class="register-page">
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
    <div class="register-form card-container">
      <van-form @submit="onSubmit">
        <!-- 账号输入框 -->
        <div class="form-item">
          <label class="label">账号</label>
          <van-field
            v-model="form.userAccount"
            name="userAccount"
            placeholder="请输入账号"
            class="register-input"
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
            class="register-input"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </div>

        <!-- 确认密码输入框 -->
        <div class="form-item">
          <label class="label">确认密码</label>
          <van-field
            v-model="form.checkPassword"
            type="password"
            name="checkPassword"
            placeholder="请确认密码"
            class="register-input"
            :rules="[{ required: true, message: '请确认密码' }, { validator: validatePassword }]"
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
            class="register-btn submit-btn"
          >
            注册并登录
          </van-button>
        </div>
      </van-form>
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
    // 直接调用“注册并登录”接口，一次请求完成两个操作
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
/* 全局布局 */
.register-page {
  min-height: 100vh;
  background-color: var(--bg-light);
  color: #333;
  font-family: 'PingFang SC', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: fixed;
  width: 100%;
  padding-top: 46px;
}

/* 图标与标语 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60px 0 30px;
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
.register-form {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  margin-bottom: 20px;
}

/* 表单项 */
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.label {
  width: 80px;
  font-size: 15px;
  color: var(--text-secondary);
}

.register-input {
  flex: 1;
  margin-bottom: 16px;
  --van-field-background: #f8f8f8;
  --van-field-color: var(--text-primary);
  --van-field-placeholder-color: var(--text-tertiary);
  --van-field-border-color: #ddd;
}

/* 按钮样式 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.submit-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.login-btn {
  background-color: #fff;
  color: var(--primary-color);
  border-color: var(--primary-color);
}
</style>    