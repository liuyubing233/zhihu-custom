

export interface IZhihuArticlesDataItem {
  updated: number;
  author: Author;
  is_labeled: boolean;
  vessay_info: VessayInfo;
  excerpt: string;
  admin_closed_comment: boolean;
  article_type: string;
  reaction_instruction: ReactionInstruction;
  id: number;
  voteup_count: number;
  upvoted_followees: any[];
  can_comment: CanComment;
  title: string;
  url: string;
  comment_permission: string;
  copyright_permission: string;
  created: number;
  content: string;
  comment_count: number;
  image_url: string;
  excerpt_title: string;
  voting: number;
  type: string;
  suggest_edit: SuggestEdit;
  is_normal: boolean;
}

export interface Author {
  avatar_url_template: string;
  badge: Badge[];
  badge_v2: BadgeV2;
  name: string;
  is_advertiser: boolean;
  url: string;
  gender: number;
  user_type: string;
  vip_info: VipInfo;
  headline: string;
  avatar_url: string;
  is_org: boolean;
  type: string;
  url_token: string;
  id: string;
}

export interface Badge {
  topics: Topic[];
  type: string;
  description: string;
}

export interface Topic {
  name: string;
  introduction: string;
  excerpt: string;
  url: string;
  followers_count: number;
  avatar_url: string;
  type: string;
  id: string;
  questions_count: number;
}

export interface BadgeV2 {
  icon: string;
  detail_badges: DetailBadgeElement[];
  night_icon: string;
  merged_badges: DetailBadgeElement[];
  title: string;
}

export interface DetailBadgeElement {
  description: string;
  title: string;
  url: string;
  sources: Source[];
  night_icon: string;
  detail_type: string;
  type: string;
  icon: string;
}

export interface Source {
  avatar_path: string;
  name: string;
  url: string;
  priority: number;
  token: string;
  avatar_url: string;
  type: string;
  id: string;
  description: string;
}

export interface VipInfo {
  is_vip: boolean;
  vip_icon: VipIcon;
}

export interface VipIcon {
  url: string;
  night_mode_url: string;
}

export interface CanComment {
  status: boolean;
  reason: string;
}

export interface ReactionInstruction {}

export interface SuggestEdit {
  status: boolean;
  url: string;
  reason: string;
  tip: string;
  title: string;
}

export interface VessayInfo {
  enable_video_translate: boolean;
}
