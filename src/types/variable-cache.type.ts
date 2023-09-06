import { IMyElement } from './dom.type';
import { IPfConfig } from './variable-configs.type';

/** 查找到的元素内容 */
export interface IFindEvent {
  header: IFindEventEntries;
}

export interface IFindEventEntries {
  fun: NodeJS.Timeout | null | undefined;
  num: number;
  isFind: boolean;
}

/** 脚本内配置缓存 */
export interface IStorageConfig {
  /** 缓存初始配置 */
  cachePfConfig: IPfConfig;
  /** 缓存页面原标题 */
  cacheTitle: string;
  /** 接口的 headers 内容, 获取下来以供使用 */
  fetchHeaders: HeadersInit;
  /** 列表缓存高度 */
  heightForList: number;
  /** header内元素 */
  headerDoms: IHeaderDoms;
}

/** 缓存顶部的元素 */
export interface IHeaderDoms {
  // suspensionFind: IHeaderDomEntries;
  // suspensionSearch: IHeaderDomEntries;
  // suspensionUser: IHeaderDomEntries;
  [key: string]: IHeaderDomEntries;
}

export interface IHeaderDomEntries {
  /** 定位元素的类名 */
  class: string;
  /** 定位的元素 */
  even: IMyElement;
  /** 元素位置 */
  index: number;
}

/** 缓存浏览历史记录 */
export interface IPfHistory {
  list: string[];
  view: string[];
}


export type IKeyofHistory = keyof IPfHistory;
export type IKeyofFindEvent = keyof IFindEvent;
export type IKeyofStorageConfig = keyof IStorageConfig;
export type IContentStorageConfig = string | number | IPfConfig | HeadersInit | IHeaderDoms;