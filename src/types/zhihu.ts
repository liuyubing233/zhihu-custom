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
