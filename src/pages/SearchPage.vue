<template>
  <div class="search-page-bg">
    <div class="partner-page">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">找到你的学习伙伴</h1>
        <p class="page-subtitle">通过标签筛选，发现志同道合的同学</p>
      </div>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <input
            v-model="searchText"
            type="text"
            placeholder="搜索标签关键词..."
            class="search-input"
        />
        <button class="cancel-btn" @click="onCancel()">取消</button>
      </div>

      <!-- 已选标签 -->
      <div class="section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 12.9949 20.8709 12.745 20.8709C12.4951 20.8709 12.2557 20.766 12.07 20.58L2.29 10.8C2.19896 10.7094 2.12759 10.6022 2.08 10.4845C2.03241 10.3669 2.00961 10.2413 2.01 10.115V4C2.01 3.73478 2.11536 3.48043 2.30289 3.29289C2.49043 3.10536 2.74478 3 3.01 3H9.125C9.25133 2.99961 9.37685 3.02241 9.49455 3.07C9.61225 3.11759 9.71941 3.18896 9.81 3.28L19.58 13.05C19.766 13.2357 19.8709 13.4751 19.8709 13.725C19.8709 13.9749 19.766 14.2143 19.58 14.4L20.59 13.41Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <p class="section-title">已选标签</p>
          <span class="tag-count">{{ activeTags.length }}</span>
        </div>
        <div class="tag-list">
          <div
              v-for="(tag, index) in activeTags"
              :key="index"
              class="selected-tag"
              :class="{ 'grade-tag': isGradeTag(tag) }"
          >
            {{ tag }}
            <span class="tag-close" @click="removeTag(index)">×</span>
          </div>
          <div v-if="activeTags.length === 0" class="empty-tip">
            <div class="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>点击下方标签进行选择</span>
          </div>
        </div>
      </div>

      <!-- 选择标签 -->
      <div class="section select-section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="section-title">选择标签</p>
        </div>
        <div class="tags-container">
          <div
              v-for="(group, groupIndex) in filteredTagGroups"
              :key="groupIndex"
              class="tag-group"
              :class="{ 'grade-group': group.name === '年级' }"
          >
            <div class="group-header">
              <span class="group-name">{{ group.name }}</span>
              <span class="group-badge">{{ group.tags.length }}个选项</span>
              <span v-if="group.name === '年级'" class="single-select-badge">单选</span>
            </div>
            <div class="tag-options">
              <div
                  v-for="(tag, tagIndex) in group.tags"
                  :key="tagIndex"
                  class="tag-item"
                  :class="{
                    active: activeTags.includes(tag),
                    'grade-tag': group.name === '年级'
                  }"
                  @click="toggleTag(tag, group.name)"
              >
                <span class="tag-text">{{ tag }}</span>
                <span v-if="activeTags.includes(tag)" class="tag-check">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索按钮 -->
      <div class="search-btn-container">
        <button
            class="search-btn"
            @click="doSearch"
            :disabled="activeTags.length === 0"
        >
          <div class="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          开始搜索 ({{ activeTags.length }}个标签)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchText = ref('');

// 原始标签数据
const tagGroups = ref([
  {
    name: '年级',
    tags: ['大一', '大二', '大三', '大四'],
  },
  {
    name: '编程语言',
    tags: ['Java', 'Python', 'C++', 'C', 'JavaScript', 'Go', 'Rust', 'TypeScript', 'PHP', 'Swift'],
  },
  {
    name: '技术方向',
    tags: ['前端开发', '后端开发', '移动开发', '算法竞赛', '数据科学', '人工智能', '机器学习', '区块链', '游戏开发', '测试开发'],
  },
  {
    name: '学习时间',
    tags: ['工作日', '周末', '晚上', '全天候', '早上', '下午'],
  },
  {
    name: '兴趣爱好',
    tags: ['音乐', '电影', '运动', '旅行', '摄影', '阅读', '游戏', '美食'],
  },
]);

// 已选标签
const activeTags = ref<string[]>([]);

// 年级标签列表
const gradeTags = ['大一', '大二', '大三', '大四'];

// 判断是否为年级标签
const isGradeTag = (tag: string) => {
  return gradeTags.includes(tag);
};

// 过滤后的标签组
const filteredTagGroups = computed(() => {
  if (!searchText.value) {
    return tagGroups.value;
  }
  
  return tagGroups.value.map(group => ({
    ...group,
    tags: group.tags.filter(tag => 
      tag.toLowerCase().includes(searchText.value.toLowerCase())
    )
  })).filter(group => group.tags.length > 0);
});

// 取消搜索，跳转到首页
const onCancel = () => {
  router.push('/');
};

// 切换标签选中状态
const toggleTag = (tag: string, groupName: string) => {
  if (groupName === '年级') {
    // 年级标签只能选一个
    if (activeTags.value.includes(tag)) {
      // 如果已选中，则取消选中
      activeTags.value = activeTags.value.filter((t) => t !== tag);
    } else {
      // 如果未选中，先移除其他年级标签，再添加当前标签
      activeTags.value = activeTags.value.filter((t) => !isGradeTag(t));
      activeTags.value.push(tag);
    }
  } else {
    // 其他标签可以多选
    if (activeTags.value.includes(tag)) {
      activeTags.value = activeTags.value.filter((t) => t !== tag);
    } else {
      activeTags.value.push(tag);
    }
  }
};

// 移除已选标签
const removeTag = (index: number) => {
  activeTags.value.splice(index, 1);
};

// 执行搜索
const doSearch = () => {
  if (activeTags.value.length === 0) return;
  router.push({
    path: '/user/list',
    query: { tags: activeTags.value.join(',') },
  });
};
</script>

<style scoped>
/* 页面背景 */
.search-page-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
  padding: 20px 0;
  box-sizing: border-box;
}

/* 背景装饰 */
.search-page-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* 主要内容容器 */
.partner-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  z-index: 1;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 16px 20px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.search-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.search-bar:hover::before {
  left: 100%;
}

.search-bar:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #667eea;
  transition: color 0.3s ease;
}

.search-bar:focus-within .search-icon {
  color: #5a6fd8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #333;
  padding: 0 8px;
  font-weight: 500;
}

.search-input::placeholder {
  color: #999;
}

.cancel-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
}

/* Section 样式 */
.section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  transition: color 0.3s ease;
}

.section-title {
  font-size: 20px;
  color: #333;
  margin: 0;
  font-weight: 700;
  flex: 1;
}

.tag-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* 已选标签区域 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 60px;
  align-items: center;
  justify-content: flex-start;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  animation: slideIn 0.3s ease;
}

.selected-tag.grade-tag {
  background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%);
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
}

.selected-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.selected-tag.grade-tag:hover {
  box-shadow: 0 6px 16px rgba(255, 167, 38, 0.4);
}

.tag-close {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s ease;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.1);
}

.empty-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #999;
  font-size: 16px;
  width: 100%;
  justify-content: center;
  font-weight: 500;
  padding: 20px;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  transition: color 0.3s ease;
}

.empty-tip:hover .empty-icon {
  color: #667eea;
}

/* 标签容器 */
.tags-container {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

/* 滚动条样式 */
.tags-container::-webkit-scrollbar {
  width: 6px;
}

.tags-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.tags-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
}

.tags-container::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

/* 标签组 */
.tag-group {
  margin-bottom: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.tag-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.grade-group {
  border: 2px solid rgba(255, 167, 38, 0.3);
  background: rgba(255, 167, 38, 0.05);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 8px;
}

.group-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.group-badge {
  font-size: 12px;
  color: #666;
  background: rgba(108, 117, 125, 0.1);
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: 500;
}

.single-select-badge {
  background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
  box-shadow: 0 2px 6px rgba(255, 167, 38, 0.3);
}

.tag-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

/* 标签项 */
.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  user-select: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.tag-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.tag-item:hover::before {
  left: 100%;
}

.tag-item:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.tag-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tag-item.grade-tag.active {
  background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%);
  border-color: #ffa726;
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
}

.tag-item.grade-tag:hover {
  border-color: #ffa726;
  background: rgba(255, 167, 38, 0.1);
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.2);
}

.tag-text {
  flex: 1;
}

.tag-check {
  font-size: 14px;
  color: white;
  font-weight: 700;
}

/* 搜索按钮 */
.search-btn-container {
  margin-top: 32px;
  margin-bottom: 80px;
}

.search-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  font-size: 18px;
  height: 56px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.search-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.search-btn:hover::before {
  left: 100%;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.search-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .partner-page {
    padding: 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .tag-group {
    padding: 18px;
  }

  .search-bar {
    padding: 14px 18px;
  }

  .tag-options {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }

  .section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .partner-page {
    padding: 12px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .tag-group {
    padding: 16px;
  }

  .search-bar {
    padding: 12px 16px;
  }

  .tag-options {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 8px;
  }

  .tag-item {
    padding: 10px 14px;
    font-size: 13px;
  }

  .section {
    padding: 16px;
  }

  .search-btn-container {
    margin-bottom: 40px;
  }
}
</style>