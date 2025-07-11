<template>
  <div class="edit-form-page">
    <!-- 固定返回按钮 -->
    <div class="fixed-back-button">
      <van-button icon="arrow-left" class="back-btn" type="default" size="small" @click="goBack" />
    </div>
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">编辑信息</div>
      <div class="page-subtitle">修改您的个人信息</div>
    </div>

    <!-- 表单内容 -->
    <div class="form-container">
      <van-form @submit="onSubmit" class="custom-form">
        <!-- 表单项容器 -->
        <div class="form-item-container">
          <template v-if="editUser.editKey === 'gender'">
            <div class="form-item gender-item">
              <div class="field-label">
                <span class="label-icon">👤</span>
                <span class="label-text">{{ editUser.editName }}</span>
              </div>
              <van-field
                  :value="editUser.currentValue"
                  :name="editUser.editKey"
                  :label="editUser.editName"
                  is-link
                  readonly
                  @click="showGenderPicker = true"
                  class="custom-field"
                  :placeholder="`请选择${editUser.editName}`"
              />
              <div class="field-hint">点击选择您的性别</div>
            </div>
            <van-popup :show="showGenderPicker" @update:show="showGenderPicker = $event" position="bottom" class="custom-popup">
              <van-picker
                  :columns="genderOptions"
                  @confirm="onGenderConfirm"
                  @cancel="showGenderPicker = false"
                  title="选择性别"
                  class="custom-picker"
              />
            </van-popup>
          </template>
          <template v-else>
            <div class="form-item text-item">
              <div class="field-label">
                <span class="label-icon">{{ getFieldIcon(editUser.editKey) }}</span>
                <span class="label-text">{{ editUser.editName }}</span>
              </div>
              <van-field
                  v-model="editUser.currentValue"
                  :name="editUser.editKey"
                  :label="editUser.editName"
                  :placeholder="`请输入${editUser.editName}`"
                  class="custom-field"
                  :maxlength="getFieldMaxLength(editUser.editKey)"
              />
              <div class="field-hint">{{ getFieldHint(editUser.editKey) }}</div>
            </div>
          </template>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-container">
          <van-button round block type="primary" native-type="submit" class="submit-btn">
            <span class="btn-text">保存修改</span>
            <span class="btn-icon">✓</span>
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import { ref, watch, computed } from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const route = useRoute();
const router = useRouter();

// 性别选择器相关
const showGenderPicker = ref(false);

interface GenderOption {
  text: string;
  value: number;
}

const genderOptions: GenderOption[] = [
  { text: '男', value: 0 },
  { text: '女', value: 1 }
];

// 性别映射
const genderMap: Record<number, string> = {
  0: '男',
  1: '女'
};

interface EditUser {
  editKey: string;
  currentValue: string;
  editName: string;
  rawValue: number | string;
}

// 获取字段图标
const getFieldIcon = (key: string): string => {
  const iconMap: Record<string, string> = {
    'username': '🏷️',
    'phone': '📱',
    'email': '📧',
    'profile': '📝',
    'gender': '👤',
    'avatarUrl': '🖼️'
  };
  return iconMap[key] || '📝';
};

// 获取字段最大长度
const getFieldMaxLength = (key: string): number => {
  const lengthMap: Record<string, number> = {
    'username': 20,
    'phone': 11,
    'email': 50,
    'profile': 200
  };
  return lengthMap[key] || 50;
};

// 获取字段提示
const getFieldHint = (key: string): string => {
  const hintMap: Record<string, string> = {
    'username': '用户名长度不超过20个字符',
    'phone': '请输入正确的手机号码',
    'email': '请输入正确的邮箱地址',
    'profile': '简单介绍一下自己吧'
  };
  return hintMap[key] || '请输入准确的信息';
};

// 获取路由查询参数
const getQueryParam = (key: string): string => {
  const value = route.query[key];
  return Array.isArray(value) ? value[0] || '' : value || '';
};

const rawGender = Number(getQueryParam('currentValue'));

const editUser = ref<EditUser>({
  editKey: getQueryParam('editKey'),
  currentValue: getQueryParam('editKey') === 'gender'
    ? genderMap[rawGender] ?? ''
    : getQueryParam('currentValue'),
  editName: getQueryParam('editName'),
  rawValue: getQueryParam('editKey') === 'gender'
    ? (rawGender === 0 || rawGender === 1 ? rawGender : '')
    : getQueryParam('currentValue')
});

// 添加对 editUser.currentValue 的监听
watch(() => editUser.value.currentValue, (newValue, oldValue) => {
  
});

const onGenderConfirm = (value: GenderOption) => {
  editUser.value.currentValue = value.text;
  editUser.value.rawValue = value.value;
  showGenderPicker.value = false;
};

const onSubmit = async () => {
  if (!editUser.value.currentValue.trim()) {
    Toast.fail(`请输入${editUser.value.editName}`);
    return;
  }
  
  // 验证特定字段
  if (editUser.value.editKey === 'phone' && !/^1[3-9]\d{9}$/.test(editUser.value.currentValue)) {
    Toast.fail('请输入正确的手机号码');
    return;
  }
  
  if (editUser.value.editKey === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.value.currentValue)) {
    Toast.fail('请输入正确的邮箱地址');
    return;
  }
  
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }

  // 构造请求数据
  const requestData = {
    'id': currentUser.id,
    [editUser.value.editKey]: editUser.value.editKey === 'gender' 
      ? Number(editUser.value.rawValue)  // 确保性别是数字类型
      : editUser.value.currentValue,
  };

  const res = await myAxios.post('/user/update', requestData);
  
  if (res.data > 0) {
    Toast.success('修改成功');
    router.back();
  } else {
    Toast.fail('修改错误');
  }
};

// 判断当前页面是编辑主页面还是字段编辑页面
const isEditFieldPage = computed(() => !!route.query.editKey);

// 返回按钮逻辑
const goBack = () => {
  if (isEditFieldPage.value) {
    router.push("/user/update");
  } else {
    router.push("/user");
  }
};
</script>

<style scoped>
/* 页面基础样式 */
.edit-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* 页面标题 */
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

/* 表单容器 */
.form-container {
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.custom-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 表单项容器 */
.form-item-container {
  margin-bottom: 40px;
}

.form-item {
  margin-bottom: 25px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-left: 5px;
}

.label-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.label-text {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.field-hint {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  padding-left: 5px;
  opacity: 0.8;
}

/* 自定义输入框样式 */
.custom-field {
  border-radius: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 2px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.custom-field:focus-within {
  border-color: rgba(102, 126, 234, 0.4);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

/* 自定义输入框内部样式 */
.custom-field :deep(.van-field__control) {
  font-size: 16px;
  color: #333;
  background: transparent;
}

.custom-field :deep(.van-field__label) {
  display: none;
}

.custom-field :deep(.van-field__body) {
  padding: 15px 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.8);
}

.custom-field :deep(.van-field__control::placeholder) {
  color: #999;
  opacity: 0.7;
}

/* 性别选择特殊样式 */
.gender-item .custom-field {
  cursor: pointer;
}

.gender-item .custom-field :deep(.van-field__control) {
  cursor: pointer;
}

.gender-item .custom-field :deep(.van-field__right-icon) {
  color: #667eea;
  font-size: 18px;
}

/* 弹出层样式 */
.custom-popup {
  border-radius: 25px 25px 0 0;
  overflow: hidden;
}

.custom-popup :deep(.van-popup__content) {
  border-radius: 25px 25px 0 0;
}

.custom-picker {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

.custom-picker :deep(.van-picker__toolbar) {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.custom-picker :deep(.van-picker__confirm),
.custom-picker :deep(.van-picker__cancel) {
  color: white;
  font-weight: bold;
}

.custom-picker :deep(.van-picker__title) {
  color: white;
  font-weight: bold;
}

.custom-picker :deep(.van-picker-column__item--selected) {
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: #667eea;
  font-weight: bold;
}

/* 提交按钮容器 */
.submit-container {
  margin-top: 40px;
}

.submit-btn {
  height: 52px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 26px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.btn-text {
  font-size: 16px;
  z-index: 2;
  position: relative;
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
  z-index: 2;
  position: relative;
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-icon {
  transform: scale(1.2);
}

/* 按钮波纹效果 */
.submit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.submit-btn:active::before {
  width: 300px;
  height: 300px;
}

/* 背景装饰 */
.bg-decoration {
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
  backdrop-filter: blur(5px);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: -60px;
  animation-delay: 0s;
}

.circle-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: -40px;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  right: 20px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 响应式设计 */
@media (max-width: 375px) {
  .form-container {
    padding: 0 15px;
  }
  
  .custom-form {
    padding: 25px 20px;
  }
  
  .page-header {
    padding: 70px 15px 15px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .custom-field :deep(.van-field__control) {
    color: #333;
  }
  
  .field-hint {
    color: #666;
  }
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