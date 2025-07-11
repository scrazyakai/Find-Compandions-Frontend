<template>
  <div class="search-page-bg">
    <div class="partner-page card-content">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">找到你的学习伙伴</h1>
        <p class="page-subtitle">通过标签筛选，发现志同道合的同学</p>
      </div>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input
            v-model="searchText"
            type="text"
            placeholder="搜索标签关键词..."
            class="search-input"
        />
        <button class="cancel-btn" @click="onCancel()">取消</button>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 已选标签 -->
        <div class="section">
          <div class="section-header">
            <span class="section-icon">🏷️</span>
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
              <span class="empty-icon">➕</span>
              <span>点击下方标签进行选择</span>
            </div>
          </div>
        </div>

        <!-- 选择标签 -->
        <div class="section select-section">
          <div class="section-header">
            <span class="section-icon">📱</span>
            <p class="section-title">选择标签</p>
          </div>
          <div
              v-for="(group, groupIndex) in tagGroups"
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
          <span class="btn-icon">🔍</span>
          开始搜索 ({{ activeTags.length }}个标签)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
    tags: ['Java', 'Python', 'C++', 'C', 'JavaScript', 'Go', 'Rust'],
  },
  {
    name: '技术方向',
    tags: ['前端开发', '后端开发', '移动开发', '算法竞赛', '数据科学', '人工智能'],
  },
  {
    name: '学习时间',
    tags: ['工作日', '周末', '晚上', '全天候'],
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

// 搜索过滤（可选）
const onSearch = () => {
  // 这里可实现搜索逻辑，比如过滤标签
  console.log('搜索内容:', searchText.value);
};

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
  height: auto;
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0;
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

/* 调整内容卡片以适应屏幕 */
.card-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  margin: 20px;
  padding: 32px 24px;
  max-width: 100%;
  width: calc(100% - 40px);
  min-height: calc(100vh - 40px);
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.partner-page {
  background: transparent;
  min-height: unset;
  padding: 0;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  flex: 1;
  display: flex;
  flex-direction: column;
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
  color: #666;
  margin: 0;
  font-weight: 400;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 32px;
  overflow: visible;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-bar:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: 12px;
  font-size: 18px;
}

.search-input {
  flex: 1 1 0%;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #333;
  padding: 0 8px;
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

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Section 样式 */
.section {
  display: flex;
  flex-direction: column;
}

.select-section {
  flex: 1;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  gap: 10px;
}

.section-icon {
  font-size: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

/* 已选标签区域 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 90px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
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
}

.empty-icon {
  font-size: 20px;
  color: #ccc;
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

.tag-options {
  display: flex;
  flex-wrap: wrap;
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
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
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
}

.search-btn:hover {
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
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-content {
    margin: 15px;
    padding: 24px 18px;
    width: calc(100% - 30px);
    min-height: calc(100vh - 30px);
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

  .tag-list {
    min-height: 80px;
    padding: 18px;
  }
}

@media (max-width: 480px) {
  .card-content {
    margin: 10px;
    padding: 20px 16px;
    width: calc(100% - 20px);
    min-height: calc(100vh - 20px);
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

  .tag-list {
    min-height: 70px;
    padding: 16px;
  }

  .tag-item {
    padding: 10px 14px;
    font-size: 13px;
  }
}
</style>