/**
 * 私信消息类型定义
 */
export interface MessageItem {
  id: number;
  senderName: string;
  avatarUrl: string;
  content: string;
  time: string;
  unread: number;
}

/**
 * 群聊消息类型定义
 */
export interface GroupItem {
  id: number;
  groupName: string;
  groupAvatar: string;
  lastMessage: string;
  updateTime: string;
  unread: number;
}

/**
 * 后端Message类型（用于获取聊天记录）
 */
export interface Message {
  fromUserId: number;
  toUserId: number;
}