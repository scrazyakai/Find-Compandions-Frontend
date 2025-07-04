<template>
  <div class="partner-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-icon name="search" class="search-icon" />
      <input
        v-model="searchText"
        type="text"
        placeholder="请输入要搜索的标签"
        class="search-input"
      />
      <van-button size="small" type="default" @click="onCancel">取消</van-button>
    </div>

    <!-- 已选标签 -->
    <div class="section">
      <p class="section-title">已选标签</p>
      <div class="tag-list">
        <span
          v-for="(tag, index) in activeTags"
          :key="index"
          class="selected-tag"
        >
          {{ tag }}
          <van-icon name="close" class="tag-close" @click="removeTag(index)" />
        </span>
        <div v-if="activeTags.length === 0" class="empty-tip">请选择标签</div>
      </div>
    </div>

    <!-- 选择标签 -->
    <div class="section">
      <p class="section-title">选择标签</p>
      <div
        v-for="(group, groupIndex) in tagGroups"
        :key="groupIndex"
        class="tag-group"
      >
        <p class="group-name">{{ group.name }}</p>
        <div class="tag-options">
          <span
            v-for="(tag, tagIndex) in group.tags"
            :key="tagIndex"
            class="tag-item"
            :class="{ active: activeTags.includes(tag) }"
            @click.native="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 搜索按钮 -->
    <van-button block type="primary" class="search-btn" @click="doSearch">
      搜索
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon, Button } from 'vant';

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
    tags: ['Java', 'Python', 'C++', 'C', '其他'],
  },
]);

// 已选标签
const activeTags = ref<string[]>([]);

// 搜索过滤（可选）
const onSearch = () => {
  // 这里可实现搜索逻辑，比如过滤标签
  console.log('搜索内容:', searchText.value);
};

// 取消搜索
const onCancel = () => {
  searchText.value = '';
};

// 切换标签选中状态
const toggleTag = (tag: string) => {
  if (activeTags.value.includes(tag)) {
    activeTags.value = activeTags.value.filter((t) => t !== tag);
  } else {
    activeTags.value.push(tag);
  }
};

// 移除已选标签
const removeTag = (index: number) => {
  activeTags.value.splice(index, 1);
};

// 执行搜索
const doSearch = () => {
  router.push({
    path: '/user/list',
    query: { tags: activeTags.value.join(',') },
  });
};
</script>

<style scoped>
/* 页面基础样式 */
.partner-page {
  background-color: #fff;
  min-height: 100vh;
  padding: 16px;
  font-family: 'PingFang SC', sans-serif;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 16px;
}

.search-icon {
  color: #999;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  border: none;
  background-color: transparent;
  outline: none;
  font-size: 14px;
}

/* section 标题 */
.section-title {
  font-size: 14px;
  color: #999;
  margin: 8px 0;
}

/* 已选标签区域 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  background-color: #d1ecf1; /* 浅蓝 */
  color: #0c5460;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tag-close {
  color: #0c5460;
  margin-left: 4px;
  font-size: 12px;
  cursor: pointer;
}

.empty-tip {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

/* 标签组 */
.tag-group {
  margin-bottom: 16px;
}

.group-name {
  font-size: 14px;
  font-weight: 500;
  margin: 8px 0;
  color: #333;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 标签项（核心发亮逻辑） */
.tag-item {
  display: inline-block;
  padding: 6px 12px;
  background-color: #e9ecef; /* 灰色默认 */
  color: #495057;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 添加关键帧动画 */
@keyframes glow {
  0% {
    box-shadow: 0 0 0 rgba(0, 123, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 12px rgba(0, 123, 255, 0.3);
  }
}

/* 替换 active 样式 */
.tag-item.active {
  background-color: #007bff; /* 蓝色高亮 */
  color: #fff;
  transform: scale(1.05); /* 轻微放大 */
  animation: glow 0.6s ease; /* 点击时播放一次动画 */
}

/* 搜索按钮 */
.search-btn {
  background-color: #007bff;
  border-radius: 8px;
  font-size: 14px;
  height: 44px;
}
</style>