/** 脚本内配置缓存 */
export interface IStorageConfig {
  /** 缓存页面原标题 */
  cacheTitle: string;
  /** 接口的 headers 内容, 获取下来以供使用 */
  fetchHeaders: HeadersInit;
}

/** 缓存浏览历史记录 */
export interface IPfHistory {
  list: string[];
  view: string[];
}

export type IKeyofHistory = keyof IPfHistory;
export type IKeyofStorageConfig = keyof IStorageConfig;
export type IContentStorageConfig = string | HeadersInit;
