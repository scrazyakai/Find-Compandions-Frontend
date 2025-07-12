import myAxios from "../plugins/myAxios";

// 好友请求相关类型定义
interface FriendRequestDTO {
  fromUserId: number;
  toUserId: number;
  sendTime: Date;
}

interface HandleFriendRequestDTO {
  requestId: number;
  status: number; // 1-同意，2-拒绝
}

interface FriendRequestVO {
  id: number;
  fromUserId: number;
  toUserId: number;
  status: number;
  sendTime: Date;
}

interface FriendVO {
  id: number;
  username: string;
  avatarUrl: string;
  profile: string;
}

/**
 * 发送好友申请
 */
export const sendFriendRequest = async (friendRequestDTO: FriendRequestDTO): Promise<boolean> => {
    try {
        const res = await myAxios.post('/friends/request', friendRequestDTO);
        return res.code === 0;
    } catch (error) {
        console.error('发送好友申请失败:', error);
        return false;
    }
}

/**
 * 处理好友申请
 */
export const handleFriendRequest = async (handleFriendRequestDTO: HandleFriendRequestDTO): Promise<boolean> => {
    try {
        const res = await myAxios.post('/friends/handle', handleFriendRequestDTO);
        return res.code === 0;
    } catch (error) {
        console.error('处理好友申请失败:', error);
        return false;
    }
}

/**
 * 获取好友列表
 */
export const getFriendList = async (): Promise<FriendVO[]> => {
    try {
        const res = await myAxios.get('/friends/list');
        if (res.code === 0) {
            return res.data || [];
        }
        return [];
    } catch (error) {
        console.error('获取好友列表失败:', error);
        return [];
    }
}

/**
 * 获取收到的好友申请列表
 */
export const getReceivedFriendRequests = async (): Promise<FriendRequestVO[]> => {
    try {
        const res = await myAxios.get('/friends/requests/received');
        if (res.code === 0) {
            return res.data || [];
        }
        return [];
    } catch (error) {
        console.error('获取好友申请列表失败:', error);
        return [];
    }
}