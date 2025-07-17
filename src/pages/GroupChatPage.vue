<template>
  <div class="group-chat-page">
    <!-- 顶部导航栏 -->
    <div class="chat-header">
      <button class="back-btn" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回
      </button>
      <h3 class="chat-title">公共聊天室</h3>
      <div class="online-indicator">
        <div class="status-dot"></div>
        <span>在线</span>
      </div>
    </div>

    <!-- 聊天历史区域 -->
    <div class="chat-history" ref="chatHistory">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['chat-message', msg.userId === currentUserId ? 'my-message' : 'other-message']"
      >
        <template v-if="msg.userId === currentUserId">
          <div class="message-wrapper">
            <div class="msg-header">
              <span class="username">{{ msg.username }}</span>
              <span class="time">{{ formatTime(msg.sendTime) }}</span>
            </div>
            <div class="msg-content">
              <div class="content">
                <span v-for="(line, index) in splitMessage(msg.content)" :key="index">{{ line }}</span>
              </div>
              <div class="message-tail my-tail"></div>
            </div>
          </div>
          <div class="avatar-container">
            <img :src="msg.avatarUrl" class="avatar avatar-right" />
            <div class="avatar-ring"></div>
          </div>
        </template>

        <template v-else>
          <div class="avatar-container">
            <img :src="msg.avatarUrl" class="avatar" />
            <div class="avatar-ring"></div>
          </div>
          <div class="message-wrapper">
            <div class="msg-header">
              <span class="username">{{ msg.username }}</span>
              <span class="time">{{ formatTime(msg.sendTime) }}</span>
            </div>
            <div class="msg-content">
              <div class="content">
                <span v-for="(line, index) in splitMessage(msg.content)" :key="index">{{ line }}</span>
              </div>
              <div class="message-tail other-tail"></div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <div class="input-wrapper">
        <!-- 输入框 -->
        <input 
          v-model="input" 
          placeholder="输入消息..." 
          @keyup.enter="sendMessage"
          @focus="onInputFocus"
          @blur="onInputBlur"
          :class="{ 'focused': isInputFocused }"
        />
        
        <!-- 表情包按钮 -->
        <button @click="toggleEmojiPicker" class="emoji-btn" :class="{ 'active': showEmojiPicker }">
          <div class="emoji-icon">😊</div>
        </button>
        
        <!-- 发送按钮 -->
        <button @click="sendMessage" :disabled="!input.trim()" class="send-btn">
          <svg class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 11L11 13"/>
          </svg>
        </button>
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

    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-bubble bubble-1"></div>
      <div class="decoration-bubble bubble-2"></div>
      <div class="decoration-bubble bubble-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import myAxios from '../plugins/myAxios'
import { getCurrentUserState } from '../states/user'
import { useRouter } from 'vue-router'

// 消息数据类型定义
interface ChatGroupVO {
  id: number;
  userId: number;
  username: string;
  avatarUrl: string;
  content: string;
  sendTime: string;
}

// 状态定义
const messages = ref<ChatGroupVO[]>([])
const input = ref('')
const isInputFocused = ref(false)
const showEmojiPicker = ref(false)
const emojiCategory = ref('smileys')
const user = getCurrentUserState()
const currentUserId = user?.id
const chatHistory = ref<HTMLElement>()
const router = useRouter()

// 表情包数据
const emojiCategories = ref({
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️'],
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥙', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🤹‍♀️', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🪘', '🎸', '🪕', '🎺', '🎷', '🪗', '🎻', '🪈']
})

// 消息处理方法
const splitMessage = (content: string) => {
  return [content]
}

// 输入框焦点事件
const onInputFocus = () => {
  isInputFocused.value = true
}

const onInputBlur = () => {
  isInputFocused.value = false
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
  input.value += emoji
  showEmojiPicker.value = false
}

// 滚动到底部函数
const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistory.value) {
      chatHistory.value.scrollTo({
        top: chatHistory.value.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
};

// 获取历史消息
const fetchHistory = async () => {
  try {
    const currentUser = getCurrentUserState()
    const res = await myAxios.get('/chat/group/history', {
      params: {
        type: 'group',
        fromUserId: currentUser?.id || undefined
      }
    })
    messages.value = Array.isArray(res.data) ? res.data : []
    scrollToBottom();
  } catch (e) {
    console.error('获取历史消息失败', e)
    messages.value = []
  }
}

// 发送消息
const sendMessage = async () => {
  const currentUser = getCurrentUserState()
  if (!input.value.trim() || !currentUser?.id) {
    return
  }
  try {
    await myAxios.post('/chat/group/send', {
      userId: currentUser.id,
      content: input.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    input.value = ''
    await fetchHistory()
  } catch (e) {
    console.error('发送消息失败', e)
  }
}

// 时间格式化
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 24小时内
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

// 返回按钮点击事件
const goBack = () => {
  router.push('/');
}

// 组件挂载时获取历史消息
onMounted(() => {
  fetchHistory();
});
</script>

<style scoped>
/* 主容器样式 */
.group-chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.decoration-bubble {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 70%, transparent 100%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
  backdrop-filter: blur(2px);
}

.bubble-1 {
  width: 120px;
  height: 120px;
  top: 15%;
  left: 8%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 80px;
  height: 80px;
  top: 55%;
  right: 12%;
  animation-delay: 2.5s;
}

.bubble-3 {
  width: 60px;
  height: 60px;
  top: 75%;
  left: 65%;
  animation-delay: 5s;
}

.background-decoration::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(103, 126, 234, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1); 
    opacity: 0.7;
  }
  33% { 
    transform: translateY(-15px) rotate(120deg) scale(1.1); 
    opacity: 1;
  }
  66% { 
    transform: translateY(-30px) rotate(240deg) scale(0.9); 
    opacity: 0.8;
  }
}

/* 顶部导航栏样式 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 70px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.back-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(103, 126, 234, 0.1);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(103, 126, 234, 0.2);
  transform: translateY(-2px);
}

.back-icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
}

.chat-title {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.online-indicator {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  background: rgba(76, 175, 80, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4CAF50;
  border-radius: 50%;
  margin-right: 6px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

/* 聊天历史区域 */
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-top: 90px;
  padding-bottom: 100px;
  z-index: 10;
  position: relative;
}

.chat-message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
  animation: messageSlideIn 0.5s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 消息容器样式 */
.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 75%;
  position: relative;
}

/* 自己的消息样式 */
.my-message {
  flex-direction: row-reverse;
  padding-left: 60px;
  justify-content: flex-start;
}

.my-message .message-wrapper {
  align-items: flex-end;
  order: 1;
}

.my-message .msg-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 5px 20px;
  position: relative;
  box-shadow: 0 4px 15px rgba(103, 126, 234, 0.3);
  transform: translateZ(0);
  transition: transform 0.3s ease;
}

.my-message .msg-content:hover {
  transform: translateY(-2px);
}

/* 他人的消息样式 */
.other-message {
  padding-right: 60px;
}

.other-message .message-wrapper {
  align-items: flex-start;
  margin-left: 15px;
}

.other-message .msg-content {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 20px 20px 20px 5px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateZ(0);
  transition: transform 0.3s ease;
}

.other-message .msg-content:hover {
  transform: translateY(-2px);
}

/* 头像容器样式 */
.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
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
  width: 55px;
  height: 55px;
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

.my-message .avatar-container {
  margin-left: 15px;
  order: 0;
}

.other-message .avatar-container {
  margin-right: 15px;
}

/* 消息头部样式 */
.msg-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
}

.my-message .msg-header {
  justify-content: flex-end;
}

.username {
  color: #666;
  font-weight: 500;
  margin-right: 8px;
}

.my-message .username {
  margin-right: 0;
  margin-left: 8px;
  color: #888;
}

.time {
  color: #999;
  font-size: 11px;
  font-weight: 400;
}

/* 消息内容样式 */
.msg-content {
  padding: 12px 16px;
  max-width: 300px;
  word-wrap: break-word;
  white-space: pre-wrap;
  position: relative;
  z-index: 1;
}

.content {
  line-height: 1.5;
  font-size: 15px;
  word-break: break-word;
  font-weight: 400;
}

.content span {
  display: inline;
  word-break: break-word;
}

/* 消息尾巴样式 */
.message-tail {
  position: absolute;
  bottom: 8px;
  width: 0;
  height: 0;
  z-index: 0;
}

.my-tail {
  right: -8px;
  border-left: 8px solid transparent;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid #667eea;
}

.other-tail {
  left: -8px;
  border-right: 8px solid transparent;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid rgba(255, 255, 255, 0.95);
}

/* 输入区域样式 */
.chat-input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
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
}

.input-wrapper:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

input {
  flex: 1;
  padding: 12px 18px;
  border: none;
  border-radius: 25px;
  outline: none;
  font-size: 15px;
  background: transparent;
  color: #333;
  transition: all 0.3s ease;
}

input.focused {
  transform: scale(1.02);
}

input::placeholder {
  color: #aaa;
}

.send-btn {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(103, 126, 234, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(103, 126, 234, 0.4);
}

.send-btn:active {
  transform: translateY(0) scale(0.95);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.send-icon {
  width: 20px;
  height: 20px;
  color: white;
}

/* 表情包按钮样式 */
.emoji-btn {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(103, 126, 234, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-right: 8px;
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
  font-size: 20px;
  transition: all 0.3s ease;
}

/* 表情包选择器样式 */
.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px 20px 20px 20px;
  border: 2px solid rgba(103, 126, 234, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
  animation: emojiPickerSlideUp 0.3s ease-out;
  z-index: 1000;
  max-height: 320px;
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
  max-height: 220px;
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
  width: 40px;
  height: 40px;
  font-size: 22px;
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

/* 滚动条美化 */
.chat-history::-webkit-scrollbar {
  width: 8px;
}

.chat-history::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

.chat-history::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: 10px 15px;
    height: 60px;
  }
  
  .chat-title {
    font-size: 18px;
  }
  
  .chat-history {
    padding: 15px;
    padding-top: 75px;
    padding-bottom: 90px;
  }
  
  .message-wrapper {
    max-width: 85%;
  }
  
  .msg-content {
    max-width: 260px;
    padding: 10px 14px;
  }
  
  .chat-input {
    padding: 15px;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
  }
  
  .avatar-ring {
    width: 48px;
    height: 48px;
  }
  
  .emoji-btn {
    width: 40px;
    height: 40px;
  }
  
  .send-btn {
    width: 40px;
    height: 40px;
  }
  
  .emoji-picker {
    max-height: 280px;
  }
  
  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
    padding: 12px 15px;
  }
  
  .emoji-item {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
  
  .bubble-1 {
    width: 80px;
    height: 80px;
  }
  
  .bubble-2 {
    width: 60px;
    height: 60px;
  }
  
  .bubble-3 {
    width: 40px;
    height: 40px;
  }
}

/* 更小屏幕优化 */
@media (max-width: 480px) {
  .back-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .back-icon {
    width: 16px;
    height: 16px;
  }
  
  .online-indicator {
    font-size: 10px;
    padding: 4px 8px;
  }
  
  .status-dot {
    width: 6px;
    height: 6px;
    margin-right: 4px;
  }
  
  .my-message {
    padding-left: 40px;
  }
  
  .other-message {
    padding-right: 40px;
  }
  
  .emoji-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .emoji-category {
    padding: 8px 6px;
  }
  
  .category-icon {
    font-size: 16px;
  }
  
  .category-name {
    font-size: 10px;
  }
}

/* 高分辨率屏幕优化 */
@media (min-width: 1200px) {
  .group-chat-page {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 0 0 0 0;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }
  
  .chat-header {
    border-radius: 0 0 0 0;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .emoji-picker {
    background: rgba(30, 30, 30, 0.98);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .emoji-item {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .emoji-category {
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .category-name {
    color: #ccc;
  }
}
</style>