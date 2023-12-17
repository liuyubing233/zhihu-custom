export interface IZhihuListJsonTargetItem {
  id: number;
  type: string;
  url: string;
  author: Author;
  createdTime: number;
  updatedTime: number;
  voteupCount: number;
  thanksCount: number;
  commentCount: number;
  isCopyable: boolean;
  question: Question;
  excerpt: string;
  excerptNew: string;
  previewType: string;
  previewText: string;
  reshipmentSettings: string;
  content: string;
  relationship: Untitled1_Relationship;
  isLabeled: boolean;
  visitedCount: number;
  favoriteCount: number;
  answerType: string;
}

export interface Author {
  id: string;
  url: string;
  userType: string;
  urlToken: string;
  name: string;
  headline: string;
  avatarUrl: string;
  isOrg: boolean;
  gender: number;
  followersCount: number;
  isFollowing: boolean;
  isFollowed: boolean;
}

export interface Question {
  id: number;
  type: string;
  url: string;
  author: Author;
  title: string;
  created: number;
  answerCount: number;
  followerCount: number;
  commentCount: number;
  boundTopicIds: number[];
  isFollowing: boolean;
  excerpt: string;
  relationship: QuestionRelationship;
  detail: string;
  questionType: string;
}

export interface QuestionRelationship {
  isAuthor: boolean;
}

export interface Untitled1_Relationship {
  isThanked: boolean;
  isNothelp: boolean;
  voting: number;
}
