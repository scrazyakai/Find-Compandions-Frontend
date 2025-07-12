/**
 * API 响应类型定义
 */

// 通用API响应结构
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 分页数据结构
export interface PageData<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 用户推荐接口响应
export interface UserRecommendResponse {
  records: import('../models/user').UserType[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 用户匹配接口响应
export type UserMatchResponse = import('../models/user').UserType[];

// API 错误码定义
export enum ApiErrorCode {
  SUCCESS = 0,
  PARAMS_ERROR = 40000,
  NOT_LOGIN = 40100,
  NO_AUTH = 40101,
  FORBIDDEN = 40301,
  NOT_FOUND = 40400,
  SYSTEM_ERROR = 50000,
}