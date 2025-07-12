<template>
  <div class="card-grid">
    <div v-for="user in props.userList" :key="user.id" class="card-item">
      <van-card
        :desc="user.profile"
        :thumb="user.avatarUrl"
        :class="{'match-mode-card': props.isMatchMode}"
      >
        <template #title>
          <div class="title-container">
            <span class="username">{{ user.username }}</span>
            <span v-if="user.userRole === 1" class="admin-tag">
              <van-icon name="manager" size="12" />
              管理员
            </span>
          </div>
        </template>

        <template #tags>
          <div class="tags-container">
            <van-tag 
              v-for="tag in user.tags" 
              :key="tag"
              :type="getTagType(tag)"
              class="user-tag"
            >
              {{ tag }}
            </van-tag>
          </div>
        </template>

        <template #footer>
          <div class="footer-actions">
            <van-button 
              size="small" 
              type="primary" 
              class="contact-btn"
              @click="handleContact(user)"
              icon="chat-o"
            >
              联系我
            </van-button>
            <van-button 
              size="small" 
              plain 
              class="detail-btn"
              @click="handleViewDetail(user)"
            >
              查看详情
            </van-button>
          </div>
        </template>
      </van-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserType } from "../models/user";

interface UserCardListProps {
  userList: UserType[];
  isMatchMode?: boolean;
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  userList: () => [] as UserType[],
  isMatchMode: false,
});

const emit = defineEmits<{
  contact: [user: UserType];
  viewDetail: [user: UserType];
}>();

// 获取标签类型
const getTagType = (tag: string) => {
  switch (tag) {
    case '男':
      return 'primary';
    case '女':
      return 'danger';
    default:
      return 'default';
  }
};

// 处理联系事件
const handleContact = (user: UserType) => {
  emit('contact', user);
};

// 处理查看详情事件
const handleViewDetail = (user: UserType) => {
  emit('viewDetail', user);
};

</script>

<style scoped>
/* 卡片网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 0 16px 16px;
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 12px 12px;
  }
}

/* 卡片项 */
.card-item {
  width: 100%;
  transition: all 0.3s ease;
}

/* 卡片样式 - 性能优化版 */
.van-card {
  cursor: default;
  user-select: none;
  background: #fff;
  border-radius: 20px !important;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 24px;
  min-height: 180px;
  position: relative;
  overflow: hidden;
  /* 性能优化 */
  contain: layout style paint;
  will-change: transform;
}

.van-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #007bff 0%, #0056d2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.van-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.van-card:hover::before {
  opacity: 1;
}

/* 头像样式 - 简化动画 */
.van-card__thumb img {
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #fff;
  border-radius: 50%;
  margin: 6px;
  width: 90px;
  height: 90px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.van-card:hover .van-card__thumb img {
  transform: scale(1.02);
}

/* 标题样式 */
.van-card__title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.username {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.admin-tag {
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  /* 移除复杂动画，提升性能 */
}

/* 标签容器 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.user-tag {
  margin: 0;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 16px;
  transition: all 0.2s ease;
}

.user-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 底部操作区 */
.footer-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.contact-btn {
  background: linear-gradient(135deg, #007bff 0%, #0056d2 100%);
  border: none;
  border-radius: 20px;
  font-weight: 500;
  flex: 1;
  height: 36px;
  transition: all 0.2s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
}

.detail-btn {
  border: 2px solid #007bff;
  color: #007bff;
  border-radius: 20px;
  font-weight: 500;
  background: transparent;
  height: 36px;
  transition: all 0.2s ease;
}

.detail-btn:hover {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
}

/* 匹配模式特殊样式 */
.match-mode-card {
  border: 2px solid #ff4757 !important;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%) !important;
  position: relative;
}

.match-mode-card::after {
  content: '推荐';
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-4px); }
  60% { transform: translateY(-2px); }
}

/* 移除标签的脉冲动画，减少CPU占用 */
.match-mode-card .user-tag {
  /* 静态样式，性能更好 */
  box-shadow: 0 2px 4px rgba(255, 71, 87, 0.2);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .van-card {
    padding: 20px;
    min-height: 160px;
  }
  
  .van-card__thumb img {
    width: 80px;
    height: 80px;
  }
  
  .username {
    font-size: 16px;
  }
  
  .footer-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .contact-btn,
  .detail-btn {
    height: 32px;
    font-size: 14px;
  }
}

/* 防止内容选择 */
.van-card__content,
.van-card__footer {
  user-select: none;
}

/* 加载动画 */
.card-item {
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 简化延迟动画，减少重绘 */
.card-item:nth-child(odd) { animation-delay: 0.1s; }
.card-item:nth-child(even) { animation-delay: 0.2s; }
</style>