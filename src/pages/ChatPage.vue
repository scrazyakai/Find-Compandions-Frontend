<template>
  <div class="chat-page">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <div class="friend-info">
        <van-image
          round
          width="32"
          height="32"
          :src="friendAvatar || '/default-avatar.png'"
          class="avatar"
        />
        <span class="friend-name">{{ friendName }}</span>
      </div>
    </div>

    <!-- 聊天消息列表 -->
    <div class="message-list" ref="messageListRef">
      <div v-if="messages.length === 0" class="empty-state">
        <van-empty description="暂无聊天记录" />
      </div>
      
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message-item"
        :class="{ 'own-message': message.fromUserId === currentUserId }"
      >
        <!-- 自己的消息：内容在左边，头像在右边 -->
        <template v-if="message.fromUserId === currentUserId">
          <div class="message-wrapper">
            <div class="message-content">
              {{ message.content }}
            </div>
            <div class="message-time">
              {{ formatTime(message.sendTime) }}
            </div>
          </div>
          <div class="avatar-container">
            <van-image
              round
              width="40"
              height="40"
              :src="currentUserAvatar"
              class="avatar"
            />
            <div class="avatar-ring"></div>
          </div>
        </template>

        <!-- 对方的消息：头像在左边，内容在右边 -->
        <template v-else>
          <div class="avatar-container">
            <van-image
              round
              width="40"
              height="40"
              :src="friendAvatar || '/default-avatar.png'"
              class="avatar"
            />
            <div class="avatar-ring"></div>
          </div>
          <div class="message-wrapper">
            <div class="message-content">
              {{ message.content }}
            </div>
            <div class="message-time">
              {{ formatTime(message.sendTime) }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 消息输入框 -->
    <div class="message-input">
      <div class="input-wrapper">
        <van-field
          v-model="inputMessage"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
          class="input-field"
        />
        
        <!-- 表情包按钮 -->
        <button @click="toggleEmojiPicker" class="emoji-btn" :class="{ 'active': showEmojiPicker }">
          <div class="emoji-icon">😊</div>
        </button>
        
        <!-- 发送按钮 -->
        <van-button 
          type="primary" 
          size="small"
          @click="sendMessage"
          :loading="sending"
          :disabled="!inputMessage.trim()"
          class="send-btn"
        >
          发送
        </van-button>
      </div>

      <!-- 表情包选择器 -->
      <div class="emoji-picker" v-if="showEmojiPicker">
        <div class="emoji-header">
          <div class="emoji-category" @click="setEmojiCategory('smileys')" :class="{ 'active': emojiCategory === 'smileys' }">
            <span class="category-icon">😊</span>
            <span class="category-name">笑脸</span>
          </div>
          <div class="emoji-category" @click="setEmojiCategory('animals')" :class="{ 'active': emojiCategory === 'animals' }">
            <span class="category-icon">🐱</span>
            <span class="category-name">动物</span>
          </div>
          <div class="emoji-category" @click="setEmojiCategory('food')" :class="{ 'active': emojiCategory === 'food' }">
            <span class="category-icon">🍎</span>
            <span class="category-name">食物</span>
          </div>
          <div class="emoji-category" @click="setEmojiCategory('activities')" :class="{ 'active': emojiCategory === 'activities' }">
            <span class="category-icon">⚽</span>
            <span class="category-name">活动</span>
          </div>
        </div>
        <div class="emoji-grid">
          <div
            v-for="(emoji, index) in currentEmojis"
            :key="index"
            class="emoji-item"
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { Toast } from 'vant'
import { sendPrivateMessage, getPrivateMessages, type ChatPrivateVO } from '../services/chatService'
import { getCurrentUser } from '../services/user'

const route = useRoute()
const router = useRouter()

// 从路由参数获取好友信息
const friendId = ref<number>(parseInt(route.query.friendId as string))
const friendName = ref<string>(route.query.friendName as string || '好友')
const friendAvatar = ref<string>(route.query.friendAvatar as string || '')

// 响应式数据
const messages = ref<ChatPrivateVO[]>([])
const inputMessage = ref('')
const sending = ref(false)
const currentUserId = ref<number>(0)
const currentUserAvatar = ref<string>('')
const messageListRef = ref<HTMLElement>()
const showEmojiPicker = ref(false)
const emojiCategory = ref('smileys')

// 表情包数据
const emojiCategories = ref({
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️'],
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥙', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🤹‍♀️', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🪘', '🎸', '🪕', '🎺', '🎷', '🪗', '🎻', '🪈']
})

// 获取当前用户ID和头像
const getCurrentUserId = async () => {
  const user = await getCurrentUser()
  if (user) {
    currentUserId.value = user.id
    currentUserAvatar.value = user.avatarUrl || '/default-avatar.png'
  }
}

// 表情包相关方法
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const setEmojiCategory = (category: string) => {
  emojiCategory.value = category
}

const currentEmojis = computed(() => {
  return emojiCategories.value[emojiCategory.value] || []
})

const insertEmoji = (emoji: string) => {
  inputMessage.value += emoji
  showEmojiPicker.value = false
}

// 加载聊天记录
const loadMessages = async () => {
  try {
    const messageList = await getPrivateMessages(currentUserId.value, friendId.value)
    messages.value = messageList
    await nextTick()
    scrollToBottom()
  } catch (error) {
    Toast.fail('加载聊天记录失败')
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  sending.value = true
  
  try {
    const success = await sendPrivateMessage({
      fromUserId: currentUserId.value,
      toUserId: friendId.value,
      content: inputMessage.value.trim()
    })

    if (success) {
      // 发送成功，清空输入框并刷新消息列表
      inputMessage.value = ''
      await loadMessages()
      Toast.success('发送成功')
    } else {
      Toast.fail('发送失败')
    }
  } catch (error) {
    Toast.fail('发送失败')
  } finally {
    sending.value = false
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// 格式化时间
const formatTime = (time: Date | string) => {
  const date = new Date(time)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 保存原始样式用于恢复
const originalBodyOverflow = ref('')
const originalTabbarDisplay = ref('')

// 页面加载时初始化
onMounted(async () => {
  await getCurrentUserId()
  await loadMessages()
  
  // 保存原始样式
  originalBodyOverflow.value = document.body.style.overflow || ''
  
  // 隐藏底部导航栏
  const tabbar = document.querySelector('.van-tabbar')
  if (tabbar) {
    originalTabbarDisplay.value = tabbar.style.display || ''
    tabbar.style.display = 'none'
  }
  
  // 防止页面滚动
  document.body.style.overflow = 'hidden'
})

// 恢复页面样式的函数
const restorePageStyles = () => {
  // 恢复底部导航栏
  const tabbar = document.querySelector('.van-tabbar')
  if (tabbar) {
    tabbar.style.display = originalTabbarDisplay.value
  }
  
  // 恢复页面滚动
  document.body.style.overflow = originalBodyOverflow.value
}

// 页面卸载时恢复
onBeforeUnmount(() => {
  restorePageStyles()
})

// 路由离开时恢复
onBeforeRouteLeave(() => {
  restorePageStyles()
})
</script>


<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.chat-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.02)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.02)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.01)"/><circle cx="20" cy="80" r="0.5" fill="rgba(255,255,255,0.01)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.back-icon {
  margin-right: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #667eea;
  transition: all 0.3s ease;
}

.back-icon:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.1);
}

.friend-info {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 12px;
  border: 3px solid transparent;
  background: linear-gradient(45deg, #667eea, #764ba2);
  background-clip: padding-box;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.friend-name {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px 120px 16px;
  position: relative;
  z-index: 1;
  height: 0;
  min-height: 0;
}

.message-item {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.own-message {
  justify-content: flex-end;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.own-message .message-wrapper {
  align-items: flex-end;
}

.message-content {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  word-wrap: break-word;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  font-size: 15px;
  line-height: 1.4;
  transition: all 0.3s ease;
  border-radius: 6px 20px 20px 20px;
}

.own-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.3);
  border-radius: 20px 6px 20px 20px;
}

.message-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.own-message .message-content:hover {
  box-shadow: 0 8px 35px rgba(102, 126, 234, 0.4);
}

.message-time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 6px;
  padding: 0 8px;
  font-weight: 500;
  text-align: left;
}

.own-message .message-time {
  text-align: right;
  color: rgba(255, 255, 255, 0.7);
}

.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: -20px;
}

.avatar {
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  z-index: 2;
  position: relative;
}

.avatar:hover {
  transform: scale(1.1);
}

.avatar-ring {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  opacity: 0.3;
  animation: pulse-ring 2s infinite;
  z-index: 1;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
  100% { transform: scale(1); opacity: 0.3; }
}

.message-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 25px;
  padding: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  gap: 8px;
}

.input-wrapper:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.input-field {
  flex: 1;
}

.input-field :deep(.van-field__control) {
  background: transparent;
  border: none;
  border-radius: 20px;
  padding: 12px 16px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.input-field :deep(.van-field__control):focus {
  outline: none;
}

.emoji-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(103, 126, 234, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.emoji-btn:hover {
  transform: translateY(-2px) scale(1.05);
  border-color: rgba(103, 126, 234, 0.4);
  box-shadow: 0 6px 20px rgba(103, 126, 234, 0.2);
}

.emoji-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(103, 126, 234, 0.3);
}

.emoji-btn.active .emoji-icon {
  filter: grayscale(1) brightness(2);
}

.emoji-icon {
  font-size: 18px;
  transition: all 0.3s ease;
}

.send-btn {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  border: none !important;
  border-radius: 20px !important;
  padding: 12px 20px !important;
  font-weight: 600 !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
}

.send-btn:disabled {
  background: rgba(160, 174, 192, 0.5) !important;
  box-shadow: none !important;
}

/* 表情包选择器样式 */
.emoji-picker {
  position: fixed;
  bottom: 100px;
  left: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 2px solid rgba(103, 126, 234, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: emojiPickerSlideUp 0.3s ease-out;
  z-index: 1001;
  max-height: 300px;
  overflow: hidden;
}

@keyframes emojiPickerSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.emoji-header {
  display: flex;
  padding: 15px 20px 10px;
  border-bottom: 1px solid rgba(103, 126, 234, 0.1);
  gap: 5px;
}

.emoji-category {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  border: 2px solid transparent;
}

.emoji-category:hover {
  background: rgba(103, 126, 234, 0.1);
  transform: translateY(-2px);
}

.emoji-category.active {
  background: linear-gradient(135deg, rgba(103, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-color: rgba(103, 126, 234, 0.3);
  box-shadow: 0 4px 12px rgba(103, 126, 234, 0.2);
}

.category-icon {
  font-size: 18px;
  margin-bottom: 4px;
  transition: transform 0.3s ease;
}

.emoji-category.active .category-icon {
  transform: scale(1.2);
}

.category-name {
  font-size: 11px;
  color: #666;
  font-weight: 500;
  transition: color 0.3s ease;
}

.emoji-category.active .category-name {
  color: #667eea;
  font-weight: 600;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  padding: 15px 20px;
  max-height: 180px;
  overflow-y: auto;
}

.emoji-grid::-webkit-scrollbar {
  width: 6px;
}

.emoji-grid::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.emoji-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.emoji-item:hover {
  background: rgba(103, 126, 234, 0.1);
  transform: scale(1.2);
  border-color: rgba(103, 126, 234, 0.3);
  box-shadow: 0 4px 12px rgba(103, 126, 234, 0.2);
}

.emoji-item:active {
  transform: scale(1.1);
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin: 40px 20px;
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.8);
}

.empty-state :deep(.van-empty__description) {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* 聊天区域滚动条美化 */
.message-list::-webkit-scrollbar {
  width: 8px;
}

.message-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.message-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .message-input {
    padding: 12px 16px;
  }
  
  .message-list {
    padding: 16px 12px 100px 12px;
  }
  
  .emoji-picker {
    left: 16px;
    right: 16px;
    bottom: 80px;
    max-height: 250px;
  }
  
  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>