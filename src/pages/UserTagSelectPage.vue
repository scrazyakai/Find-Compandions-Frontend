<template>
  <div class="tag-select-page">
    <!-- 页面标题 -->
    <div class="page-title">完善个人信息</div>

    <!-- 已选标签 -->
    <div class="section">
      <p class="section-title">已选标签</p>
      <div class="tag-list">
        <!-- 年级标签单独显示 -->
        <span v-if="selectedGrade" class="selected-tag">
          {{ selectedGrade }}
          <van-icon name="close" class="tag-close" @click="removeGrade" />
        </span>
        <!-- 其他标签 -->
        <span v-for="(tag, index) in activeTags" :key="index" class="selected-tag">
          {{ tag }}
          <van-icon name="close" class="tag-close" @click="removeTag(index)" />
        </span>
        <div v-if="!selectedGrade && activeTags.length === 0" class="empty-tip">请选择标签</div>
      </div>
    </div>

    <!-- 选择标签 -->
    <div class="section">
      <p class="section-title">选择标签</p>

      <!-- 性别选择 -->
      <div class="tag-group">
        <p class="group-name">性别</p>
        <div class="tag-options">
          <span v-for="(tag, index) in genderTags" :key="index" class="tag-item" :class="{ active: selectedGender === tag.value }" @click="selectGender(tag.value, tag.label)">
            {{ tag.label }}
          </span>
        </div>
      </div>

      <!-- 年级选择 -->
      <div class="tag-group">
        <p class="group-name">年级</p>
        <div class="tag-options">
          <span v-for="(tag, index) in gradeTags" :key="index" class="tag-item" :class="{ active: selectedGrade === tag }" @click="selectGrade(tag)">
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 编程语言选择 -->
      <div class="tag-group">
        <p class="group-name">编程语言</p>
        <div class="tag-options">
          <span v-for="(tag, index) in languageTags" :key="index" class="tag-item" :class="{ active: activeTags.includes(tag) }" @click="toggleTag(tag)">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <van-button block type="primary" class="submit-btn" @click="submitTags">
      完成
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon, Button, Toast } from 'vant';
import myAxios from '../plugins/myAxios';

const router = useRouter();

// 组件挂载时初始化
onMounted(() => {
  // 清除activeTags中可能存在的年级标签
  activeTags.value = activeTags.value.filter(tag => !['大一', '大二', '大三', '大四'].includes(tag));
});

// 性别选项（后端需要整数）
const genderTags = [
  { label: '男', value: 0 },
  { label: '女', value: 1 }
];

// 年级选项（只能选一个）
const gradeTags = ['大一', '大二', '大三', '大四'];

// 编程语言选项（可多选）
const languageTags = ['Java', 'Python', 'C++', 'C', '其他'];

// 已选标签状态
const activeTags = ref<string[]>([]);
const selectedGender = ref<number | null>(null);
const selectedGrade = ref<string | null>(null);

// 切换标签选择
const toggleTag = (tag: string) => {
  if (activeTags.value.includes(tag)) {
    activeTags.value = activeTags.value.filter(t => t !== tag);
  } else {
    activeTags.value.push(tag);
  }
};

// 选择性别
const selectGender = (value: number, label: string) => {
  selectedGender.value = value;
};

// 选择年级（只能选一个）
  const selectGrade = (grade: string) => {
    selectedGrade.value = grade;
    // 清除activeTags中可能残留的年级标签
    activeTags.value = activeTags.value.filter(tag => !['大一', '大二', '大三', '大四'].includes(tag));
  };

  // 移除年级标签
  const removeGrade = () => {
    selectedGrade.value = null;
  };

// 移除已选标签
  const removeTag = (index: number) => {
    activeTags.value.splice(index, 1);
  };

// 提交标签数据
const submitTags = async () => {
  // 验证必填项
  if (selectedGender.value === null) {
    Toast('请选择性别');
    return;
  }
  if (selectedGrade.value === null) {
    Toast('请选择年级');
    return;
  }

  try {
    // 构造提交数据
    // 合并年级和其他标签
    const allTags = [...activeTags.value];
    if (selectedGrade.value) {
      allTags.unshift(selectedGrade.value);
    }

    // 从本地存储获取用户ID
    const userJson = localStorage.getItem('user');
    console.log('本地存储的用户数据:', userJson);
    const user = userJson ? JSON.parse(userJson) : {};
    console.log('解析后的用户对象:', user);
    const userId = Number(user.id);
    console.log('转换后的用户ID:', userId);
    if (isNaN(userId) || !user.id) {
      Toast.fail('用户信息不存在或ID格式错误，请重新登录');
      return;
    }
    const tagData = {
      id: userId,
      gender: selectedGender.value,
      tags: allTags.join(',')
    };
    

    // 调用后端更新接口
    const res = await myAxios.post('/user/update', tagData);
    if (res?.code === 0) {
      Toast.success('信息完善成功');
      // 跳转到首页
      router.push('/');
    } else {
      Toast.fail('信息提交失败，请重试');
    }
  } catch (error) {
      // 增强错误信息显示
      const errorMsg = error instanceof Error ? error.message : String(error);
      const statusText = error.response?.statusText || '未知错误';
      const statusCode = error.response?.status || '无状态码';
      Toast.fail(`网络错误: ${statusText} (${statusCode})`);
      console.error('提交标签失败详情:', {
        message: errorMsg,
        status: statusCode,
        response: error.response?.data,
        requestUrl: error.config?.url
      });
    }
};
</script>

<style scoped>
/* 页面基础样式 */
.tag-select-page {
  background-color: #fff;
  min-height: 100vh;
  padding: 20px 16px 80px;
}

/* 页面标题 */
.page-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0 30px;
  color: #333;
}

/* 标签区域样式 */
.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
  padding-left: 5px;
}

/* 已选标签 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  background-color: #f0f7ff;
  color: #0066ff;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.tag-close {
  margin-left: 5px;
  font-size: 12px;
}

.empty-tip {
  color: #999;
  font-size: 14px;
  padding: 10px;
}

/* 标签组样式 */
.tag-group {
  margin-bottom: 25px;
}

.group-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 12px;
  padding-left: 5px;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-item.active {
  background-color: #0066ff;
  color: white;
}

/* 提交按钮 */
.submit-btn {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  height: 50px;
  font-size: 16px;
  border-radius: 25px;
}
</style>