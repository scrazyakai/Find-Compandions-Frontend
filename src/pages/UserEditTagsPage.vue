<template>
  <div class="tag-select-page container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">修改标签</div>
      <div class="page-subtitle">选择适合您的学习标签</div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 已选标签 -->
      <div class="section selected-section">
        <div class="section-header">
          <div class="section-title">
            <span class="title-icon">✓</span>
            已选标签
          </div>
          <div class="tag-count">{{ getTotalTagCount() }}</div>
        </div>
        <div class="tag-list">
          <!-- 年级标签单独显示 -->
          <span v-if="selectedGrade" class="selected-tag grade-tag">
            <span class="tag-icon">🎓</span>
            {{ selectedGrade }}
            <van-icon name="close" class="tag-close" @click="removeGrade" />
          </span>
          <!-- 其他标签 -->
          <span v-for="(tag, index) in activeTags" :key="index" class="selected-tag language-tag">
            <span class="tag-icon">💻</span>
            {{ tag }}
            <van-icon name="close" class="tag-close" @click="removeTag(index)" />
          </span>
          <div v-if="!selectedGrade && activeTags.length === 0" class="empty-tip">
            <div class="empty-icon">🏷️</div>
            <div class="empty-text">请选择标签</div>
          </div>
        </div>
      </div>

      <!-- 选择标签 -->
      <div class="section">
        <div class="section-title">
          <span class="title-icon">🎯</span>
          选择标签
        </div>

        <!-- 年级选择 -->
        <div class="tag-group">
          <div class="group-header">
            <div class="group-name">
              <span class="group-icon">🎓</span>
              年级
            </div>
            <div class="group-desc">请选择您的年级</div>
          </div>
          <div class="tag-options">
            <span v-for="(tag, index) in gradeTags" :key="index" 
                  class="tag-item grade-item" 
                  :class="{ active: selectedGrade === tag }" 
                  @click="selectGrade(tag)">
              {{ tag }}
              <span v-if="selectedGrade === tag" class="check-icon">✓</span>
            </span>
          </div>
        </div>

        <!-- 编程语言选择 -->
        <div class="tag-group">
          <div class="group-header">
            <div class="group-name">
              <span class="group-icon">💻</span>
              编程语言
            </div>
            <div class="group-desc">可多选您熟悉的编程语言</div>
          </div>
          <div class="tag-options">
            <span v-for="(tag, index) in languageTags" :key="index" 
                  class="tag-item language-item" 
                  :class="{ active: activeTags.includes(tag) }" 
                  @click="toggleTag(tag)">
              {{ tag }}
              <span v-if="activeTags.includes(tag)" class="check-icon">✓</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="button-container">
      <van-button block type="primary" class="submit-btn" @click="submitTags">
        <span class="btn-text">完成设置</span>
        <span class="btn-icon">→</span>
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon, Button, Toast } from 'vant';
import myAxios from '../plugins/myAxios';
import { getCurrentUser } from '../services/user';

const router = useRouter();

// 组件挂载时初始化
onMounted(async () => {
  try {
    console.log('开始获取用户信息...');
    const userInfo = await getCurrentUser();
    console.log('获取到的用户信息:', userInfo);
    
    if (userInfo) {
      console.log('用户信息存在，tags字段:', userInfo.tags);
      console.log('tags类型:', typeof userInfo.tags);
      let tags: string[] = [];
      if (typeof userInfo.tags === 'string') {
        if (userInfo.tags.trim().startsWith('[')) {
          // JSON数组字符串
          tags = JSON.parse(userInfo.tags);
        } else {
          // 普通逗号分隔字符串
          tags = userInfo.tags.split(',');
        }
      } else if (Array.isArray(userInfo.tags)) {
        tags = userInfo.tags;
      }
      console.log('最终解析得到的标签数组:', tags);
      // 分离年级标签和其他标签
      const gradeTag = tags.find(tag => ['大一', '大二', '大三', '大四'].includes(tag));
      console.log('找到的年级标签:', gradeTag);
      if (gradeTag) {
        selectedGrade.value = gradeTag;
        activeTags.value = tags.filter(tag => tag !== gradeTag);
        console.log('设置年级标签:', selectedGrade.value);
        console.log('设置其他标签:', activeTags.value);
      } else {
        activeTags.value = tags;
        console.log('未找到年级标签，设置所有标签:', activeTags.value);
      }
    } else {
      console.log('获取用户信息失败，userInfo为null');
    }
  } catch (error) {
    console.error('获取用户标签失败:', error);
    Toast.fail('加载标签失败');
  }
});

// 年级选项（只能选一个）
const gradeTags = ['大一', '大二', '大三', '大四'];

// 编程语言选项（可多选）
const languageTags = ['Java', 'Python', 'C++', 'C', 'JavaScript', 'Rust', 'Go', 'PHP', 'TypeScript', '其他'];

// 已选标签状态
const activeTags = ref<string[]>([]);
const selectedGrade = ref<string | null>(null);

// 获取总标签数量
const getTotalTagCount = () => {
  return (selectedGrade.value ? 1 : 0) + activeTags.value.length;
};

// 切换标签选择
const toggleTag = (tag: string) => {
  if (activeTags.value.includes(tag)) {
    activeTags.value = activeTags.value.filter(t => t !== tag);
  } else {
    activeTags.value.push(tag);
  }
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
  if (selectedGrade.value === null) {
    Toast('请选择年级');
    return;
  }

  try {
    // 合并年级和其他标签
    const allTags = [...activeTags.value];
    if (selectedGrade.value) {
      allTags.unshift(selectedGrade.value);
    }

    // 优先用本地 user，没有就用 getCurrentUser
    let userJson = localStorage.getItem('user');
    let user = userJson ? JSON.parse(userJson) : null;
    if (!user || !user.id) {
      user = await getCurrentUser();
    }
    const userId = Number(user?.id);
    if (isNaN(userId) || !userId) {
      Toast.fail('用户信息不存在或ID格式错误，请重新登录');
      return;
    }
    const tagData = {
      id: userId,
      tags: allTags.join(',')
    };

    // 调用后端更新接口
    const res = await myAxios.post('/user/update', tagData);
    if (res?.code === 0) {
      Toast.success('标签修改成功');
      // 更新本地 user 信息
      const newUser = { ...user, tags: tagData.tags };
      localStorage.setItem('user', JSON.stringify(newUser));
      // 返回个人信息页
      router.push('/user');
    } else {
      Toast.fail('标签提交失败，请重试');
    }
  } catch (error) {
    Toast.fail('网络错误，请重试');
    console.error('提交标签失败详情:', error);
  }
};
</script>

<style scoped>
/* 页面基础样式 */
.tag-select-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 页面标题 */
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30px 20px 20px;
  text-align: center;
  border-radius: 0 0 25px 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  padding-bottom: 140px;
}

/* 标签区域样式 */
.section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.selected-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(240, 247, 255, 0.98));
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.tag-count {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* 已选标签 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  gap: 8px;
}

.selected-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.grade-tag {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
}

.language-tag {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
}

.tag-icon {
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.tag-close {
  margin-left: 8px;
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.tag-close:hover {
  opacity: 1;
}

.empty-tip {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  opacity: 0.8;
}

/* 标签组样式 */
.tag-group {
  margin-bottom: 30px;
}

.group-header {
  margin-bottom: 20px;
}

.group-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-icon {
  font-size: 18px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.group-desc {
  font-size: 13px;
  color: #666;
  opacity: 0.9;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  position: relative;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #f8f9fa;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.grade-item.active {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border-color: #ff6b6b;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.language-item.active {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  border-color: #4ecdc4;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
}

.check-icon {
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
}

/* 按钮容器 */
.button-container {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
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
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-text {
  font-size: 16px;
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-icon {
  transform: translateX(3px);
}

/* 滚动条样式 */
.content-area::-webkit-scrollbar {
  width: 6px;
}

.content-area::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.content-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>