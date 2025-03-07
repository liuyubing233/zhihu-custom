export interface IZhihuAnswerTarget {
  adminClosedComment: boolean;
  annotationAction: null;
  answerType: string;
  attachedInfo: string;
  author: Author;
  canComment: CanComment;
  collapseReason: string;
  collapsedBy: string;
  commentCount: number;
  commentPermission: string;
  content: string;
  contentMark: ContentMark;
  contentNeedTruncated: boolean;
  createdTime: number;
  decorativeLabels: any[];
  editableContent: string;
  excerpt: string;
  extras: string;
  favlistsCount: number;
  forceLoginWhenClickReadMore: boolean;
  id: string;
  isCollapsed: boolean;
  isCopyable: boolean;
  isJumpNative: boolean;
  isLabeled: boolean;
  isMine: boolean;
  isNormal: boolean;
  isSticky: boolean;
  isVisible: boolean;
  matrixTips: string;
  question: Question;
  reactionInstruction: ContentMark;
  relationship: Relationship;
  relevantInfo: RelevantInfo;
  reshipmentSettings: string;
  rewardInfo: RewardInfo;
  stickyInfo: string;
  suggestEdit: SuggestEdit;
  thanksCount: number;
  thumbnailInfo: ThumbnailInfo;
  type: string;
  updatedTime: number;
  url: string;
  visibleOnlyToAuthor: boolean;
  voteupCount: number;
  labelInfo?: LabelInfo;
  attachment?: IAttachment;
}

interface LabelInfo {
  foregroundColor: {
    alpha: number;
    group: string;
  };
  iconUrl: string;
  text: string;
  type: string;
}

interface Author {
  avatarUrl: string;
  avatarUrlTemplate: string;
  badge: any[];
  badgeV2: BadgeV2;
  exposedMedal: ExposedMedal;
  followerCount: number;
  gender: number;
  headline: string;
  id: string;
  isAdvertiser: boolean;
  isFollowed: boolean;
  isFollowing: boolean;
  isOrg: boolean;
  isPrivacy: boolean;
  name: string;
  type: string;
  url: string;
  urlToken: string;
  userType: string;
}

interface BadgeV2 {
  detailBadges: any[];
  icon: string;
  mergedBadges: any[];
  nightIcon: string;
  title: string;
}

interface ExposedMedal {
  avatarUrl: string;
  description: string;
  medalAvatarFrame: string;
  medalId: string;
  medalName: string;
  miniAvatarUrl: string;
}

interface CanComment {
  reason: string;
  status: boolean;
}

interface ContentMark {}

interface Question {
  created: number;
  id: string;
  questionType: string;
  relationship: ContentMark;
  title: string;
  type: string;
  updatedTime: number;
  url: string;
}

interface Relationship {
  isAuthor: boolean;
  isAuthorized: boolean;
  isNothelp: boolean;
  isThanked: boolean;
  upvotedFollowees: any[];
  voting: number;
}

interface RelevantInfo {
  isRelevant: boolean;
  relevantText: string;
  relevantType: string;
}

interface RewardInfo {
  canOpenReward: boolean;
  isRewardable: boolean;
  rewardMemberCount: number;
  rewardTotalMoney: number;
  tagline: string;
}

interface SuggestEdit {
  reason: string;
  status: boolean;
  tip: string;
  title: string;
  unnormalDetails: UnnormalDetails;
  url: string;
}

interface UnnormalDetails {
  description: string;
  note: string;
  reason: string;
  reasonId: number;
  status: string;
}

interface ThumbnailInfo {
  count: number;
  thumbnails: Thumbnail[];
  type: string;
}

interface Thumbnail {
  height: number;
  token: string;
  type: string;
  url: string;
  width: number;
}

interface IAttachment {
  attachmentId: string;
  type: string;
  video: Video;
}

interface Video {
  endTime: number;
  parentVideoId: string;
  playCount: number;
  startTime: number;
  subVideoId: string;
  title: string;
  videoInfo: VideoInfo;
  voteupCount: number;
  zvideoId: string;
}

interface VideoInfo {
  duration: number;
  height: number;
  isPaid: boolean;
  isTrial: boolean;
  playCount: number;
  playlist: Playlist;
  thumbnail: string;
  type: string;
  videoId: number;
  width: number;
}

interface Playlist {
  fhd: Fhd;
  hd: Fhd;
  ld: Fhd;
  sd: Fhd;
}

interface Fhd {
  bitrate: number;
  height: number;
  url: string;
  width: number;
}
