/**
 * 黑名单模块的类型定义
 */

/** 黑名单 */
export interface IBlacklistItem {
  id: string;
  name: string;
  token: string;
  types: string[]; // 标签
}