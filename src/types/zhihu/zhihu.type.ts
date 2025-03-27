export type IZhihuDataZaExtraModule = Record<'card', IZhihuDataZaExtraModuleCard>;

export interface IZhihuDataZaExtraModuleCard {
  has_image?: boolean;
  has_video?: boolean;
  content?: IZhihuCardContent;
}

export interface IZhihuCardContent {
  type?: string;
  token?: string;
  upvote_num?: number;
  comment_num?: number;
  publish_timestamp?: any;
  parent_token?: string;
  author_member_hash_id?: string;
}

export interface IZhihuDataZop {
  authorName?: string;
  itemId?: number;
  title?: string;
  type?: string;
}

/** 用户信息 */
export interface IZhihuUserInfo {
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
  vip_info: IZhihuVipInfo;
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

export interface IZhihuVipInfo {
  is_vip: boolean;
  vip_type: number;
  rename_days: string[];
  entrance_v2: any;
  rename_frequency: number;
  rename_await_days: number;
}
