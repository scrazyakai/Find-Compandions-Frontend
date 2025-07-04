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
              <span>{{ user.username }}</span>
              <span v-if="user.userRole === 1" class="admin-tag">管理员</span>
            </div>
          </template>

        <template #tags>
          <van-tag :type="tag === '男' ? 'info' : tag === '女' ? 'danger' : 'primary'" v-for="tag in user.tags" :key="tag" style="margin-right: 6px; margin-top: 6px; padding: 2px 8px; font-size: 12px">
            {{ tag }}
          </van-tag>
        </template>
        <template #footer>
          <van-button size="mini" type="primary" style="background: linear-gradient(135deg, #007bff 0%, #0056d2 100%); border: none;">联系我</van-button>
        </template>
      </van-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";

interface UserCardListProps {
  userList: UserType[];
  isMatchMode?: boolean;
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  userList: () => [] as UserType[],
  isMatchMode: false,
});

console.log('UserCardList props.userList:', props.userList);
</script>

<style scoped>
/* 修复头像区域光标问题 */
.van-card { cursor: default; user-select: none; background-color: #fff !important; border-radius: 16px !important; border: none; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); transition: transform 0.2s ease; }
.van-card:hover { transform: translateY(-3px); }
.van-card__thumb img { pointer-events: none; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); border: 2px solid #fff; border-radius: 50%; margin: 6px; width: 60px; height: 60px; object-fit: cover; }
.card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px; }
@media (max-width: 768px) { .card-grid { grid-template-columns: 1fr; } }
.card-item { width: 100%; }
.van-card__title { font-weight: 600; color: #333; }
.title-container { display: flex; align-items: center; gap: 8px; }
.admin-tag { background-color: #ff4d4f; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
.match-mode-card { border: 2px solid #ff4d4f !important; }
.match-mode-card .van-tag { animation: pulse 2s infinite; }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
.van-card__content, .van-card__footer { user-select: none; }
</style>
