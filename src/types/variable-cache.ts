import { IPfConfig } from './variable-configs';
import { IMyElement } from './variable-dom-name';

/** 用户信息 */
export interface IUserinfo {
  id: string;
  url_token: string;
  name: string;
  use_default_avatar: boolean;
  avatar_url: string;
  avatar_url_template: string;
  is_org: boolean;
  type: string;
  url: string;
  user_type: string;
  headline: string;
  headline_render: string;
  gender: number;
  is_advertiser: boolean;
  ad_type: string;
  ip_info: string;
  vip_info: IVipInfo;
  account_status: any[];
  is_force_renamed: boolean;
  is_destroy_waiting: boolean;
  answer_count: number;
  question_count: number;
  articles_count: number;
  columns_count: number;
  zvideo_count: number;
  favorite_count: number;
  pins_count: number;
  voteup_count: number;
  thanked_count: number;
  following_question_count: number;
  available_medals_count: number;
  uid: string;
  email: string;
  renamed_fullname: string;
  default_notifications_count: number;
  follow_notifications_count: number;
  vote_thank_notifications_count: number;
  messages_count: number;
  creation_count: number;
  is_bind_phone: boolean;
  is_realname: boolean;
  has_applying_column: boolean;
  has_add_baike_summary_permission: boolean;
  editor_info: string[];
  available_message_types: string[];
}

export interface IVipInfo {
  is_vip: boolean;
  vip_type: number;
  rename_days: string[];
  entrance_v2: any;
  rename_frequency: number;
  rename_await_days: number;
}

/** 查找到的元素内容 */
export interface IFindEvent {
  header: IFindEventEntries;
}

export interface IFindEventEntries {
  fun: NodeJS.Timer | null | undefined;
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
  suspensionFind?: IHeaderDomEntries;
  suspensionSearch?: IHeaderDomEntries;
  suspensionUser?: IHeaderDomEntries;
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
