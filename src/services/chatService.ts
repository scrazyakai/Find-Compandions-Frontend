import myAxios from "../plugins/myAxios";
import type { Message } from "../models/message";

/**
 * 私聊消息类型
 */
export type PrivateMessage = {
    id?: number;
    fromUserId: number;
    toUserId: number;
    content: string;
    createTime?: Date;
}

/**
 * 聊天记录VO类型
 */
export type ChatPrivateVO = {
    id: number;
    fromUserId: number;
    toUserId: number;
    content: string;
    sendTime: Date;
}

/**
 * 发送私聊消息
 */
export const sendPrivateMessage = async (message: Omit<PrivateMessage, 'id' | 'createTime'>): Promise<boolean> => {
    try {
        const res = await myAxios.post('/chat/private/send', message);
        return res.code === 0;
    } catch (error) {
        console.error('发送私聊消息失败:', error);
        return false;
    }
}

/**
 * 获取私聊记录
 * 后端接口：GET /chat/private/history?fromUserId=xx&toUserId=xx
 */
export const getPrivateMessages = async (fromUserId: number, toUserId: number): Promise<ChatPrivateVO[]> => {
    try {
        const res = await myAxios.get('/chat/private/history', {
            params: {
                fromUserId,
                toUserId
            }
        });
        if (res.code === 0) {
            return res.data || [];
        }
        return [];
    } catch (error) {
        console.error('获取聊天记录失败:', error);
        return [];
    }
}