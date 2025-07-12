/**
 * 好友申请请求DTO
 */
export type FriendRequestDTO = {
    fromUserId: number;
    toUserId: number;
}

/**
 * 处理好友申请DTO  
 */
export type HandleFriendRequestDTO = {
    fromUserId: number;
    toUserId: number;
    status: number; // 0=未处理, 1=拒绝, 2=同意
}

/**
 * 好友申请VO
 */
export type FriendRequestVO = {
    fromUserId: number;
    fromUsername: string;
    fromAvatarUrl?: string;
    toUserId: number; 
    toUsername: string;
    toAvatarUrl?: string;
    createTime: Date;
    status: number; // 0=未处理, 1=拒绝, 2=同意
}

/**
 * 好友VO
 */
export type FriendVO = {
    fromUserId: number;
    fromUsername: string;
    fromAvatarUrl?: string;
    toUserId: number;
    toUsername: string; 
    toAvatarUrl?: string;
}

/**
 * 好友申请状态枚举
 */
export enum FriendRequestStatus {
    PENDING = 0,  // 未处理
    REJECTED = 1, // 拒绝
    ACCEPTED = 2  // 同意
}