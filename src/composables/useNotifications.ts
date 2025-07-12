import { ref, computed } from 'vue'
import myAxios from '../plugins/myAxios'

// 全局状态管理
const unreadMessages = ref<Map<number, number>>(new Map())
const unreadRequests = ref<number>(0)

/**
 * 消息通知管理 Composable
 */
export function useNotifications() {
  
  // 获取指定好友的未读消息数
  const getUnreadCount = (friendId: number): number => {
    return unreadMessages.value.get(friendId) || 0
  }

  // 设置指定好友的未读消息数
  const setUnreadCount = (friendId: number, count: number) => {
    unreadMessages.value.set(friendId, count)
  }

  // 清除指定好友的未读消息数
  const clearUnreadCount = (friendId: number) => {
    unreadMessages.value.set(friendId, 0)
  }

  // 增加指定好友的未读消息数
  const incrementUnreadCount = (friendId: number, increment: number = 1) => {
    const current = getUnreadCount(friendId)
    setUnreadCount(friendId, current + increment)
  }

  // 获取总未读消息数
  const totalUnreadMessages = computed(() => {
    let total = 0
    unreadMessages.value.forEach(count => {
      total += count
    })
    return total
  })

  // 获取未读好友申请数
  const getUnreadRequestCount = () => unreadRequests.value

  // 设置未读好友申请数
  const setUnreadRequestCount = (count: number) => {
    unreadRequests.value = count
  }

  // 加载所有未读消息数据
  const loadUnreadMessages = async () => {
    try {
      // 这里应该调用实际的API获取未读消息数
      // const res = await myAxios.get('/messages/unread')
      // const data = res.data || []
      
      // 临时模拟数据 - 实际项目中替换为真实API调用
      const mockUnreadData = new Map()
      // 可以根据实际需要设置一些测试数据
      // mockUnreadData.set(1, 3) // 用户ID 1 有3条未读消息
      // mockUnreadData.set(2, 1) // 用户ID 2 有1条未读消息
      
      unreadMessages.value = mockUnreadData
      
      return mockUnreadData
    } catch (error) {
      console.error('获取未读消息失败:', error)
      return new Map()
    }
  }

  // 加载未读好友申请数据
  const loadUnreadRequests = async () => {
    try {
      const res = await myAxios.get('/friends/list/requests')
      const requests = res.data || []
      // 过滤未处理的申请
      const unhandledRequests = requests.filter((req: any) => req.status === 0)
      setUnreadRequestCount(unhandledRequests.length)
      return unhandledRequests.length
    } catch (error) {
      console.error('获取未读好友申请失败:', error)
      setUnreadRequestCount(0)
      return 0
    }
  }

  // 全量刷新通知数据
  const refreshNotifications = async () => {
    await Promise.all([
      loadUnreadMessages(),
      loadUnreadRequests()
    ])
  }

  // 标记消息为已读
  const markAsRead = async (friendId: number) => {
    try {
      // 调用API标记消息为已读
      // await myAxios.post('/messages/mark-read', { friendId })
      
      // 本地清除未读数
      clearUnreadCount(friendId)
      
      return true
    } catch (error) {
      console.error('标记消息已读失败:', error)
      return false
    }
  }

  // 启动定期检查（可选）
  let intervalId: number | null = null
  
  const startPeriodicCheck = (intervalMs: number = 30000) => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    
    intervalId = setInterval(() => {
      refreshNotifications()
    }, intervalMs)
  }

  const stopPeriodicCheck = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return {
    // 状态
    unreadMessages: readonly(unreadMessages),
    unreadRequests: readonly(unreadRequests),
    totalUnreadMessages,
    
    // 方法
    getUnreadCount,
    setUnreadCount,
    clearUnreadCount,
    incrementUnreadCount,
    getUnreadRequestCount,
    setUnreadRequestCount,
    loadUnreadMessages,
    loadUnreadRequests,
    refreshNotifications,
    markAsRead,
    startPeriodicCheck,
    stopPeriodicCheck
  }
}

// 默认导出单例
export const notifications = useNotifications()