<template>
  <div class="friends-page">
    <!-- 头部 -->
    <div class="header">
      <h2>好友</h2>
      <div class="notification-icon" @click="onBellClick">
        <van-icon name="bell" size="24" />
        <div v-if="unreadRequestCount > 0" class="red-dot request-dot">
          <span v-if="unreadRequestCount <= 99" class="dot-text">{{ unreadRequestCount }}</span>
          <span v-else class="dot-text">99+</span>
        </div>
      </div>
    </div>

    <!-- 好友聊天列表 -->
    <div class="friends-list">
      <div v-if="friendList.length === 0" class="empty-state">
        <van-empty description="暂无好友" />
      </div>
      <div 
        v-for="friend in friendList" 
        :key="friend.toUserId"
        class="friend-item"
        @click="startChat(friend)"
      >
        <div class="avatar-container">
        <van-image
          round
          width="50"
          height="50"
          :src="friend.toAvatarUrl || '/default-avatar.png'"
          class="avatar"
        />
          <div v-if="getUnreadCount(friend.toUserId) > 0" class="red-dot message-dot">
            <span v-if="getUnreadCount(friend.toUserId) <= 99" class="dot-text">{{ getUnreadCount(friend.toUserId) }}</span>
            <span v-else class="dot-text">99+</span>
          </div>
        </div>
        <div class="friend-info">
          <div class="friend-name">{{ friend.toUsername }}</div>
          <div class="last-message">点击开始聊天</div>
        </div>
        <van-icon name="arrow" class="arrow-icon" />
      </div>
    </div>

    <!-- 好友申请弹窗 -->
    <van-popup v-model:show="showRequestModal" position="right" :style="{ width: '80%', height: '100%' }">
      <div class="request-modal">
        <div class="modal-header">
          <h3>好友申请</h3>
          <van-icon name="cross" @click="showRequestModal = false" />
        </div>
        
        <div class="request-list">
          <div v-if="friendRequests.length === 0" class="empty-state">
            <van-empty description="暂无好友申请" />
          </div>
          
          <div 
            v-for="request in friendRequests" 
            :key="`${request.fromUserId}-${request.toUserId}`"
            class="request-item"
          >
            <van-image
              round
              width="45"
              height="45"
              :src="request.fromAvatarUrl || '/default-avatar.png'"
              class="avatar"
            />
            <div class="request-info">
              <div class="request-name">{{ request.fromUsername }}</div>
              <div class="request-time">{{ formatTime(request.createTime) }}</div>
            </div>
            <div class="request-actions">
              <van-button 
                size="small" 
                type="primary" 
                @click="handleRequest(request, 2)"
                :loading="processingRequestId === request.fromUserId"
              >
                同意
              </van-button>
              <van-button 
                size="small" 
                @click="handleRequest(request, 1)"
                :loading="processingRequestId === request.fromUserId"
              >
                拒绝
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Toast } from 'vant'
import { getFriendList, getReceivedFriendRequests, handleFriendRequest } from '../services/friendService'
import type { FriendVO, FriendRequestVO } from '../models/friend'
import { getCurrentUser } from '../services/user'
import { useRouter } from 'vue-router'
import myAxios from '../plugins/myAxios'

const router = useRouter()

// 响应式数据
const friendList = ref<FriendVO[]>([])
const friendRequests = ref<FriendRequestVO[]>([])
const showRequestModal = ref(false)
const processingRequestId = ref<number | null>(null)
const unreadMessages = ref<Map<number, number>>(new Map()) // 存储每个好友的未读消息数
const unreadRequestCount = computed(() => friendRequests.value.length)

// 加载好友列表
const loadFriendList = async () => {
  try {
    const friends = await getFriendList()
    friendList.value = friends
  } catch (error) {
    Toast.fail('加载好友列表失败')
  }
}

// 加载好友申请列表
const loadFriendRequests = async () => {
  try {
    const res = await myAxios.get('/friends/list/requests')
    friendRequests.value = res.data || []
  } catch (error) {
    Toast.fail('加载好友申请失败')
  }
}

// 处理好友申请
const handleRequest = async (request: FriendRequestVO, status: number) => {
  processingRequestId.value = request.fromUserId
  
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      Toast.fail('请先登录')
      return
    }

    const success = await handleFriendRequest({
      fromUserId: request.fromUserId,
      toUserId: currentUser.id,
      status
    })

    if (success) {
      Toast.success(status === 2 ? '已同意好友申请' : '已拒绝好友申请')
      // 刷新列表
      await loadFriendRequests()
      if (status === 2) {
        await loadFriendList() // 同意后刷新好友列表
      }
    } else {
      Toast.fail('操作失败')
    }
  } catch (error) {
    Toast.fail('操作失败')
  } finally {
    processingRequestId.value = null
  }
}

// 开始聊天
const startChat = (friend: FriendVO) => {
  // 清除该好友的未读消息数
  clearUnreadCount(friend.toUserId)
  
  // 跳转到聊天页面，传入好友信息
  router.push({ 
    path: '/chat', 
    query: { 
      friendId: friend.toUserId.toString(),
      friendName: friend.toUsername,
      friendAvatar: friend.toAvatarUrl || ''
    }
  })
}

// 格式化时间
const formatTime = (time: Date | string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 1天内
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return `${Math.floor(diff / 86400000)}天前`
  }
}

// 修改铃铛点击事件，点击时加载好友申请
const onBellClick = async () => {
  await loadFriendRequests()
  showRequestModal.value = true
}

// 获取指定好友的未读消息数
const getUnreadCount = (friendId: number): number => {
  return unreadMessages.value.get(friendId) || 0
}

// 清除指定好友的未读消息数
const clearUnreadCount = (friendId: number) => {
  unreadMessages.value.set(friendId, 0)
}

// 模拟获取未读消息数据（实际项目中应该从API获取）
const loadUnreadMessages = async () => {
  try {
    // 这里应该调用实际的API获取未读消息数
    // const res = await myAxios.get('/messages/unread')
    // 临时模拟数据
    const mockUnreadData = new Map()
    // 可以根据实际需要设置一些测试数据
    // mockUnreadData.set(1, 3) // 用户ID 1 有3条未读消息
    // mockUnreadData.set(2, 1) // 用户ID 2 有1条未读消息
    unreadMessages.value = mockUnreadData
  } catch (error) {
    console.error('获取未读消息失败:', error)
  }
}

// 添加一些测试数据来演示红点功能
const addTestData = () => {
  // 模拟一些未读消息数据
  const testUnreadMessages = new Map()
  
  // 为了演示，给前几个好友添加未读消息数
  if (friendList.value.length > 0) {
    testUnreadMessages.set(friendList.value[0]?.toUserId, 3) // 第一个好友3条未读
  }
  if (friendList.value.length > 1) {
    testUnreadMessages.set(friendList.value[1]?.toUserId, 1) // 第二个好友1条未读
  }
  
  unreadMessages.value = testUnreadMessages
  
  // 模拟一些好友申请数据来测试小铃铛红点
  // 你可以手动取消这行注释来测试
  // friendRequests.value = [{ fromUserId: 999, fromUsername: '测试用户', createTime: new Date() }]
}

// 页面加载时获取数据
onMounted(() => {
  loadFriendList().then(() => {
    // 好友列表加载完成后添加测试数据
    setTimeout(() => {
      addTestData()
    }, 1000)
  })
  loadUnreadMessages()
  // 定期检查未读消息和好友申请（可选）
  setInterval(() => {
    loadUnreadMessages()
  }, 30000) // 每30秒检查一次
})
</script>

<style scoped>
.friends-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  padding: 12px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.notification-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 红点样式 */
.red-dot {
  position: absolute;
  background: linear-gradient(45deg, #ff4757, #ff3838);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
  animation: pulse 2s infinite;
}

.red-dot .dot-text {
  color: white;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  padding: 0 2px;
}

/* 好友申请红点位置 */
.request-dot {
  top: -8px;
  right: -8px;
}

/* 好友消息红点位置 */
.message-dot {
  top: -5px;
  right: -5px;
  min-width: 16px;
  height: 16px;
}

.message-dot .dot-text {
  font-size: 9px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
  }
}

.friends-list {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  margin: 20px 16px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.friend-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.friend-item:hover::before {
  opacity: 1;
}

.friend-item:hover {
  transform: translateX(4px);
}

.friend-item:last-child {
  border-bottom: none;
}

.avatar-container {
  position: relative;
  margin-right: 16px;
}

.avatar {
  border: 3px solid transparent;
  background: linear-gradient(45deg, #667eea, #764ba2);
  background-clip: padding-box;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.friend-info {
  flex: 1;
  z-index: 1;
}

.friend-name {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 6px;
}

.last-message {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.arrow-icon {
  color: #a0aec0;
  font-size: 18px;
  z-index: 1;
}

.request-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-header .van-icon {
  cursor: pointer;
  padding: 12px;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: #718096;
}

.modal-header .van-icon:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.request-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.request-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.request-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.request-item:last-child {
  margin-bottom: 0;
}

.request-info {
  flex: 1;
  margin-left: 16px;
}

.request-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 6px;
}

.request-time {
  font-size: 12px;
  color: #718096;
  font-weight: 500;
}

.request-actions {
  display: flex;
  gap: 12px;
}

.request-actions .van-button {
  min-width: 70px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.request-actions .van-button--primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.request-actions .van-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.request-actions .van-button--default {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #718096;
}

.request-actions .van-button--default:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  margin: 40px 20px;
  backdrop-filter: blur(10px);
}
</style> 