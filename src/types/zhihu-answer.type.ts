export interface IResponseZhihuAnswer {
  paging: IZhihuAnswerPaging;
  data: IZhihuAnswerDataItem[];
}

export interface IZhihuAnswerDataItem {
  suggest_edit: SuggestEdit;
  editable_content: string;
  mark_infos: any[];
  excerpt: string;
  admin_closed_comment: boolean;
  biz_ext: BizEXT;
  created_time: number;
  id: number;
  voteup_count: number;
  collapse_reason: string;
  is_labeled: boolean;
  author: Author;
  question: Question;
  content: string;
  comment_count: number;
  reshipment_settings: ReshipmentSettings;
  attachment: Attachment;
  answer_type: Type;
  reward_info: RewardInfo;
  type: AttachmentType;
  thumbnail: string;
  relationship: Relationship;
  vessay_info: VessayInfo;
  annotation_action: any[];
  collapsed_by: CollapsedBy;
  is_copyable: boolean;
  is_collapsed: boolean;
  url: string;
  comment_permission: CommentPermission;
  reaction_instruction: ReactionInstruction;
  updated_time: number;
  extras: string;
  same_video_answers: any[];
  can_comment: CanComment;
  is_normal: boolean;
}

export enum Type {
  Normal = 'normal',
}

export interface Attachment {
  attachment_id: Record<string, string>;
  type: AttachmentType;
  video?: Video;
}

export enum AttachmentType {
  Answer = 'answer',
  Video = 'video',
}

export interface Video {
  zvideo_id: string;
  title: string;
  start_time: number;
  play_count: number;
  video_info: VideoInfo;
  parent_video_id: Record<string, string>;
  end_time: number;
  sub_video_id: Record<string, string>;
  voteup_count: number;
}

export interface VideoInfo {
  status: string;
  playlist: Playlist;
  is_deleted: boolean;
  created_at: number;
  has_related_videos: boolean;
  updated_at: number;
  play_count: number;
  width: number;
  id: number;
  duration: number;
  height: number;
  thumbnail: string;
}

export interface Playlist {
  ld: HD;
  hd: HD;
  sd: HD;
}

export interface HD {
  width: number;
  format: string;
  play_url: string;
  duration: number;
  height: number;
  size: number;
}

export interface Author {
  avatar_url_template: string;
  badge: Badge[];
  badge_v2: BadgeV2;
  name: Record<string, string>;
  headline: Record<string, string>;
  url_token: Record<string, string>;
  user_type: Record<string, string>;
  vip_info: VipInfo;
  is_advertiser: boolean;
  avatar_url: string;
  url: string;
  gender: number;
  type: Record<string, string>;
  id: Record<string, string>;
  is_org: boolean;
}

export interface Badge {
  topics: Topic[];
  type: DetailTypeEnum;
  description: Record<string, string>;
}

export interface Topic {
  introduction: string;
  avatar_url: string;
  name: Record<string, string>;
  url: string;
  type: Record<string, string>;
  excerpt: string;
  id: string;
}

export enum DetailTypeEnum {
  Best = 'best',
  BestAnswerer = 'best_answerer',
}

export interface BadgeV2 {
  icon: string;
  detail_badges: DetailBadgeElement[];
  night_icon: string;
  merged_badges: DetailBadgeElement[];
  title: Record<string, string>;
}

export interface DetailBadgeElement {
  description: Record<string, string>;
  title: Record<string, string>;
  url: string;
  sources: Source[];
  night_icon: string;
  detail_type: DetailTypeEnum;
  type: DetailTypeEnum;
  icon: string;
}

export interface Source {
  avatar_path: Record<string, string>;
  name: Record<string, string>;
  url: string;
  priority: number;
  token: string;
  avatar_url: string;
  type: Record<string, string>;
  id: string;
  description: string;
}

export interface VipInfo {
  is_vip: boolean;
}

export interface BizEXT {
  creation_relationship: CreationRelationship;
}

export interface CreationRelationship {}

export interface CanComment {
  status: boolean;
  reason: Reason;
}

export enum Reason {
  Empty = '',
  你的评论将会由作者筛选后显示 = '你的评论将会由作者筛选后显示',
}

export enum CollapsedBy {
  Nobody = 'nobody',
}

export enum CommentPermission {
  All = 'all',
  Censor = 'censor',
}

export interface Question {
  relationship: CreationRelationship;
  created: number;
  url: string;
  title: string;
  updated_time: number;
  has_publishing_draft: boolean;
  question_type: Type;
  type: QuestionType;
  id: number;
}

export enum QuestionType {
  Question = 'question',
}

export interface ReactionInstruction {
  REACTION_CONTENT_SEGMENT_LIKE?: string;
}

export interface Relationship {
  is_authorized: boolean;
  is_author: boolean;
  is_thanked: boolean;
  is_nothelp: boolean;
  voting: number;
}

export enum ReshipmentSettings {
  Allowed = 'allowed',
}

export interface RewardInfo {
  reward_member_count: number;
  is_rewardable: boolean;
  reward_total_money: number;
  can_open_reward: boolean;
  tagline: Tagline;
}

export enum Tagline {
  Empty = '',
  真诚赞赏手留余香 = '真诚赞赏，手留余香',
}

export interface SuggestEdit {
  status: boolean;
  reason: string;
  title: string;
  url: string;
  unnormal_details: CreationRelationship;
  tip: string;
}

export interface VessayInfo {
  enable_video_translate: boolean;
}

export interface IZhihuAnswerPaging {
  is_end: boolean;
  totals: number;
  previous: string;
  is_start: boolean;
  next: string;
}
