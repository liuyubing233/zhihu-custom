export interface IZhihuRecommendItem {
  id: string;
  type: string;
  offset: number;
  verb: string;
  created_time: number;
  updated_time: number;
  target: Target;
  brief: string;
  attached_info: string;
  action_card: boolean;
}

interface Target {
  id: number;
  type: string;
  url: string;
  author: Author;
  created_time: number;
  updated_time: number;
  voteup_count: number;
  thanks_count: number;
  comment_count: number;
  is_copyable: boolean;
  question: Question;
  thumbnail: string;
  excerpt: string;
  excerpt_new: string;
  preview_type: string;
  preview_text: string;
  reshipment_settings: string;
  content: string;
  relationship: TargetRelationship;
  is_labeled: boolean;
  visited_count: number;
  thumbnails: string[];
  favorite_count: number;
  answer_type: string;
  paid_info?: PaidInfo;
}

interface Author {
  id: string;
  url: string;
  user_type: string;
  url_token: string;
  name: string;
  headline: string;
  avatar_url: string;
  is_org: boolean;
  gender: number;
  followers_count: number;
  is_following: boolean;
  is_followed: boolean;
}

interface PaidInfo {
  type: string;
  content: string;
  has_purchased: boolean;
}

interface Question {
  id: number;
  type: string;
  url: string;
  author: Author;
  title: string;
  created: number;
  answer_count: number;
  follower_count: number;
  comment_count: number;
  bound_topic_ids: number[];
  is_following: boolean;
  excerpt: string;
  relationship: QuestionRelationship;
  detail: string;
  question_type: string;
}

interface QuestionRelationship {
  is_author: boolean;
}

interface TargetRelationship {
  is_thanked: boolean;
  is_nothelp: boolean;
  voting: number;
}
