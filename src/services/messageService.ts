import axios from 'axios';
import { MessageItem, GroupItem } from '../models/message';

// 基础URL，实际项目中请替换为后端API地址
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * 获取私信列表
 * @param page 页码
 * @returns 私信列表数据
 */
export const getPrivateMessages = async (page: number): Promise<{ data: MessageItem[] }> => {
  try {
    console.log('Fetching private messages - URL:', `${API_BASE_URL}/messages/private`);
const response = await axios.get(`${API_BASE_URL}/messages/private`, {
      params: { page, size: 10, t: new Date().getTime() }
    });
    return response.data;
  } catch (error) {
    console.error('获取私信列表失败:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

/**
 * 获取群聊列表
 * @param page 页码
 * @returns 群聊列表数据
 */
export const getGroupMessages = async (page: number): Promise<{ data: GroupItem[] }> => {
  try {
    console.log('Fetching group messages - URL:', `${API_BASE_URL}/messages/group`);
const response = await axios.get(`${API_BASE_URL}/messages/group`, {
      params: { page, size: 10, t: new Date().getTime() }
    });
    return response.data;
  } catch (error) {
    console.error('获取群聊列表失败:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

/**
 * 发送私信
 * @param toUserId 接收用户ID
 * @param content 消息内容
 * @returns 发送结果
 */
export const sendPrivateMessage = async (toUserId: number, content: string): Promise<{ success: boolean }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages/private`, {
      toUserId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('发送私信失败:', error);
    throw error;
  }
};

/**
 * 发送群聊消息
 * @param groupId 群ID
 * @param content 消息内容
 * @returns 发送结果
 */
export const sendGroupMessage = async (groupId: number, content: string): Promise<{ success: boolean }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages/group`, {
      groupId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('发送群聊消息失败:', error);
    throw error;
  }
};

/**
 * 标记消息为已读
 * @param messageId 消息ID
 * @param type 消息类型：'private'或'group'
 * @returns 标记结果
 */
export const markAsRead = async (messageId: number, type: 'private' | 'group'): Promise<{ success: boolean }> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/messages/${type}/${messageId}/read`);
    return response.data;
  } catch (error) {
    console.error('标记消息已读失败:', error);
    throw error;
  }
};