/**
 * 黑名单模块的类型定义
 */

/** 黑名单 */
export interface IBlockedUser {
  id: string;
  name: string;
  urlToken: string;
  tags?: string[]; // 标签
}