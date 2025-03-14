export interface IJsInitialData {
  initialState?: InitialState;
  subAppName?: string;
  spanName?: string;
  canaryConfig?: CanaryConfig;
}

interface CanaryConfig {
  test_canary: string;
  use_new_player: string;
  player_vendor: string;
  use_hevc: string;
  upload_use_signature: string;
  use_backdrop_blur: string;
  article_title_imagex: string;
  play_station: string;
  use_cached_supported_countries: string;
}

interface InitialState {
  common: InitialStateCommon;
  loading: Loading;
  entities: InitialStateEntities;
  currentUser: string;
  account: InitialStateAccount;
  settings: Settings;
  notification: Banner;
  people: People;
  env: Env;
  me: Me;
  label: Banner;
  ecommerce: Banner;
  comments: Comments;
  commentsV2: CommentsV2;
  pushNotifications: PushNotifications;
  messages: Messages;
  register: Register;
  login: Login;
  switches: Switches;
  captcha: CAPTCHA;
  sms: SMS;
  chat: Chat;
  emoticons: Emoticons;
  creator: Creator;
  creators: Creators;
  question: InitialStateQuestion;
  shareTexts: Banner;
  answers: Answers;
  banner: Banner;
  topic: Topic;
  explore: Explore;
  articles: Articles;
  favlists: Favlists;
  pins: Pins;
  topstory: Topstory;
  upload: Banner;
  video: InitialStateVideo;
  zvideos: Zvideos;
  guide: InitialStateGuide;
  reward: Reward;
  search: Search;
  creatorSalt: CreatorSalt;
  publicEditPermission: Banner;
  readStatus: Banner;
  draftHistory: DraftHistory;
  notifications: Notifications;
  specials: Specials;
  collections: Collections;
  userProfit: UserProfit;
  mcn: Mcn;
  mcnActivity: McnActivity;
  brand: Brand;
  host: Host;
  campaign: Campaign;
  knowledgePlan: KnowledgePlan;
  wallE: WallE;
  roundtables: InitialStateRoundtables;
  helpCenter: HelpCenter;
  republish: Banner;
  commercialReport: CommercialReport;
  creatorMCN: CreatorMCN;
  commentManage: CommentManage;
  commentPermission: Banner;
  creatorRightStatus: CreatorRightStatus;
  zhiPlus: ZhiPlus;
  streaming: Banner;
  creationRanking: Banner;
  eduSections: EduSections;
  adPromotion: AdPromotion;
  editVideo: EditVideo;
  zhidaEntry: ZhidaEntry;
  guideZhidaCard: GuideZhidaCard;
  hotSpot: Banner;
  contentColumnCard: Banner;
}

interface InitialStateAccount {
  unlockTicketStatus: boolean;
  unlockTicket: null;
  challenge: any[];
  errorStatus: boolean;
  message: string;
  isFetching: boolean;
  accountInfo: Banner;
  urlToken: URLToken;
  cardUserInfo: CardUserInfo;
  handleWidget: Banner;
  widgetList: any[];
  userWidgetId: string;
}

interface Banner {}

interface CardUserInfo {
  vipInfo: Banner;
}

interface URLToken {
  loading: boolean;
}

interface AdPromotion {
  answer: Banner;
  article: Banner;
}

interface Answers {
  voters: Banner;
  upvoters: Banner;
  copyrightApplicants: Banner;
  favlists: Banner;
  newAnswer: Banner;
  entityWords: Banner;
  paidContent: Banner;
  settings: Banner;
  relationEndorsement: Banner;
  growthCardOrder: Banner;
}

interface Articles {
  voters: Banner;
  upvoters: Banner;
  relationEndorsement: Banner;
}

interface Brand {
  contentPlugin: Banner;
}

interface Campaign {
  single: Banner;
  list: Banner;
  videoMakerAcq: Banner;
  vote: Banner;
  cardCollecting: CardCollecting;
  zhiboPandian2020: null;
  boarding: Banner;
  searchGaokaoSubPage: Banner;
  searchHealth: Banner;
}

interface CardCollecting {
  message: null;
  profile: Profile;
  sharePoster: SharePoster;
  shareLink: null;
  shareIntention: string;
  shareKey: null;
  shareCardId: null;
  inviterInfo: null;
  giverInfo: null;
  prize: null;
  receivedCard: null;
  newCoinCount: null;
  newCardList: any[];
  newUserCardCount: number;
  taskList: any[];
  prizeList: null;
  cardList: null;
  panel: Panel;
  modal: Modal;
}

interface Modal {
  showWelcomeModal: boolean;
  showFusionModal: boolean;
  showFusionPromptModal: boolean;
  showShareModal: boolean;
  showBackModal: boolean;
}

interface Panel {
  showTaskPanel: boolean;
  showRewardPanel: boolean;
}

interface Profile {
  balance: string;
  chance: number;
  coinNum: number;
  gatherClose: boolean;
  isGotMagicCard: boolean;
  isPay: boolean;
  partitionStart: boolean;
  totalDone: number;
  withdrawStart: boolean;
}

interface SharePoster {
  share: string;
  sendCard: string;
  invite: string;
}

interface CAPTCHA {
  captchaNeeded: boolean;
  captchaValidated: boolean;
}

interface Chat {
  chats: Banner;
  inbox: Inbox;
  global: ChatGlobal;
}

interface ChatGlobal {
  isChatMqttExisted: boolean;
}

interface Inbox {
  recents: History;
  strangers: History;
  friends: History;
  search: History;
  config: InboxConfig;
}

interface InboxConfig {
  newCount: number;
  strangerMessageSwitch: boolean;
  strangerMessageUnread: boolean;
  friendCount: number;
}

interface History {
  isFetching: boolean;
  isDrained: boolean;
  isPrevDrained: boolean;
  result: any[];
  next: null;
  key: null;
}

interface Collections {
  hot: Hot;
  collectionFeeds: Banner;
}

interface Hot {
  data: any[];
  paging: Banner;
  isLoading: boolean;
}

interface CommentManage {
  commentList: CommentList;
  subCommentList: SubCommentList;
}

interface CommentList {
  ids: any[];
  entities: Banner;
  nextOffset: number;
  urlToken: string;
}

interface SubCommentList {
  ids: any[];
  entities: Banner;
  paging: SubCommentListPaging;
}

interface SubCommentListPaging {
  next: string;
  isEnd: boolean;
}

interface Comments {
  pagination: Banner;
  collapsed: Banner;
  reverse: Banner;
  reviewing: Banner;
  conversation: Banner;
  parent: Banner;
}

interface CommentsV2 {
  stickers: any[];
  commentWithPicPermission: Banner;
  notificationsComments: Banner;
  pagination: Banner;
  collapsed: Banner;
  reverse: Banner;
  reviewing: Banner;
  conversation: Banner;
  conversationMore: Banner;
  parent: Banner;
}

interface CommercialReport {
  commercialTypes: any[];
}

interface InitialStateCommon {
  ask: Banner;
  cities: Cities;
}

interface Cities {
  cityData: any[];
}

interface Creator {
  tools: Tools;
  explore: Banner;
  levelUpperLimit: number;
  mcn: Banner;
  mcnManage: Banner;
  tasks: Banner;
  announcement: Banner;
  creatorsRecommendInfo: Banner;
}

interface Tools {
  question: ToolsQuestion;
  recommend: Recommend;
}

interface ToolsQuestion {
  invitationCount: InvitationCount;
}

interface InvitationCount {
  questionFolloweeCount: number;
  questionTotalCount: number;
}

interface Recommend {
  recommendTimes: Banner;
}

interface CreatorMCN {
  mcn: Banner;
  mcnStatistics: Banner;
  mcnRight: McnRight;
  isNoAuth: boolean;
  creatorManageData: any[];
  creatorManageDataTotal: number;
  mcnDomains: any[];
  bill: Bill;
  healthScore: HealthScore;
  healthScoreRecordInfo: Banner;
  beforeDownloadCheckResult: Banner;
  beforePromotionData: any[];
  afterPromotionData: any[];
}

interface Bill {
  list: Banner;
  detail: Banner;
}

interface HealthScore {
  healthScore: string;
  updateTime: string;
  evaluate: string;
}

interface McnRight {
  bind: boolean;
  coupon: boolean;
}

interface CreatorRightStatus {
  list: any[];
}

interface CreatorSalt {
  recommendQuestionList: any[];
  bannerList: any[];
  claimBannerList: any[];
  sites: any[];
  domains: Banner;
  hasRecored: boolean;
  hasClaim: boolean;
  hasContributedList: any[];
  notContributedList: any[];
  contributesTotal: null;
  previewPageTitle: string;
  previewPageContent: string;
  restContributionNumber: string;
}

interface Creators {
  common: CreatorsCommon;
  bayesDomains: BayesDomains;
  school: School;
  faq: FAQ;
  knowledgeIncome: Banner;
  safeguardRights: Banner;
  analytics: Analytics;
  account: CreatorsAccount;
  KMResource: Banner;
  training: Banner;
  ToolsQuestion: ToolsQuestionClass;
  ToolsHotspot: ToolsHotspot;
  ToolsRecommend: Banner;
  ToolsCustomPromotion: ToolsCustomPromotion;
  ToolsSearchQuestion: Banner;
  editorSetting: Banner;
  MCNManage: Banner;
  knowledgeTasks: Banner;
  incomeAnalysis: IncomeAnalysis;
  creationManage: CreationManage;
  activity: Banner;
  announcement: Banner;
  home: Home;
  videoSupport: VideoSupport;
  videoDistribution: Banner;
  profilePoster: ProfilePoster;
}

interface ToolsCustomPromotion {
  itemLists: Banner;
  baseInfo: Banner;
}

interface ToolsHotspot {
  domains: any[];
}

interface ToolsQuestionClass {
  goodatTopics: any[];
}

interface CreatorsAccount {
  growthLevel: Banner;
}

interface Analytics {
  all: Banner;
  answer: Banner;
  zvideo: Banner;
  article: Banner;
  pin: Banner;
  singleContent: Banner;
}

interface BayesDomains {
  status: Banner;
  options: Options;
  contents: null;
}

interface Options {
  topDomains: null;
  allDomains: null;
  editable: number;
}

interface CreatorsCommon {
  applyStatus: Banner;
  rightsStatus: Banner;
}

interface CreationManage {
  editModal: EditModal;
}

interface EditModal {
  status: boolean;
}

interface FAQ {
  tabs: any[];
  article: Banner;
}

interface Home {
  currentCreatorUrlToken: null;
  rights: any[];
  newRights: any[];
  scoreInfo: Banner;
  menusShowControlByServer: MenusShowControlByServer;
  newTasks: NewTasks;
  bannerList: any[];
  recentlyCreated: any[];
  homecard: Banner;
  homeData: Banner;
}

interface MenusShowControlByServer {
  bVipRecomend: boolean;
  creationRelationship: boolean;
}

interface NewTasks {
  creatorTask: CreatorTask;
}

interface CreatorTask {
  tasks: any[];
  des: any[];
}

interface IncomeAnalysis {
  income: Income;
}

interface Income {
  aggregation: Banner;
}

interface ProfilePoster {
  creatorPosterConfig: Banner;
  creatorPosterData: Banner;
}

interface School {
  tabs: any[];
  contents: any[];
  banner: null;
  entities: Banner;
}

interface VideoSupport {
  textBenefit: Banner;
}

interface DraftHistory {
  history: Banner;
  drafts: Banner;
}

interface EditVideo {
  editVideoEnabled: boolean;
}

interface EduSections {
  eduSectionState: Banner;
}

interface Emoticons {
  emoticonGroupList: any[];
  emoticonGroupDetail: Banner;
}

interface InitialStateEntities {
  users: Users;
  questions: Banner;
  answers: Banner;
  articles: Banner;
  columns: Banner;
  topics: Banner;
  roundtables: Banner;
  favlists: Banner;
  comments: Banner;
  notifications: Banner;
  ebooks: Banner;
  activities: Banner;
  feeds: Banner;
  pins: Banner;
  promotions: Banner;
  drafts: Banner;
  chats: Banner;
  posts: Banner;
  zvideos: Banner;
  eduCourses: Banner;
}

interface Users {
  [tokenOrMineId: string]: IJsInitialDataUsersAnSENI | E70F6A3A705944E97B40Cda9C54A732E;
}

export interface IJsInitialDataUsersAnSENI {
  id: string;
  urlToken: string;
  name: string;
  useDefaultAvatar: boolean;
  avatarUrl: string;
  avatarUrlTemplate: string;
  isOrg: boolean;
  type: string;
  url: string;
  userType: string;
  headline: string;
  headlineRender: string;
  isActive: number;
  description: string;
  gender: number;
  isAdvertiser: boolean;
  ipInfo: string;
  vipInfo: VipInfo;
  kvipInfo: KvipInfo;
  badge: any[];
  badgeV2: BadgeV2;
  accountStatus: any[];
  messageThreadToken: string;
  allowMessage: boolean;
  isFollowing: boolean;
  isFollowed: boolean;
  isBlocking: boolean;
  isBlocked: boolean;
  isForceRenamed: boolean;
  followerCount: number;
  followingCount: number;
  mutualFolloweesCount: number;
  answerCount: number;
  questionCount: number;
  commercialQuestionCount: number;
  articlesCount: number;
  columnsCount: number;
  zvideoCount: number;
  favoriteCount: number;
  favoritedCount: number;
  pinsCount: number;
  logsCount: number;
  voteupCount: number;
  thankedCount: number;
  hostedLiveCount: number;
  participatedLiveCount: number;
  includedAnswersCount: number;
  includedArticlesCount: number;
  includedText: string;
  followingColumnsCount: number;
  followingTopicCount: number;
  followingQuestionCount: number;
  followingFavlistsCount: number;
  voteToCount: number;
  voteFromCount: number;
  thankToCount: number;
  thankFromCount: number;
  availableMedalsCount: number;
  business: Business;
  locations: Business[];
  employments: Employment[];
  educations: Education[];
  coverUrl: string;
  avatarHue: string;
  juror: Juror;
  isPrivacyProtected: boolean;
  isRealname: boolean;
  hasApplyingColumn: boolean;
  isIntelligence: boolean;
}

interface BadgeV2 {
  title: string;
  mergedBadges: any[];
  detailBadges: any[];
  icon: string;
  nightIcon: string;
}

interface Business {
  id: string;
  type: string;
  url: string;
  name: string;
  avatarUrl: string;
}

interface Education {
  school: Business;
  diploma: number;
}

interface Employment {
  job: Business;
  company: Business;
}

interface Juror {
  isJuror: boolean;
  voteCount: number;
  reviewCount: number;
  reviewLikedCount: number;
}

interface KvipInfo {
  isVip: boolean;
}

interface VipInfo {
  isVip: boolean;
  vipType: number;
  renameDays: string;
  entranceV2: null;
  renameFrequency: number;
  renameAwaitDays: number;
}

interface E70F6A3A705944E97B40Cda9C54A732E {
  uid: number;
  userType: string;
  id: string;
}

interface Env {
  abV2: AbV2;
  userAgent: UserAgent;
  appViewConfig: Banner;
  ctx: Ctx;
  trafficSource: string;
  edition: { [key: string]: boolean };
  theme: string;
  appHeaderTheme: AppHeaderTheme;
  enableShortcut: boolean;
  referer: string;
  xUDId: string;
  mode: string;
  conf: Banner;
  xTrafficFreeOrigin: string;
  ipInfo: Banner;
  logged: boolean;
  query: Banner;
  vars: Vars;
}

interface AbV2 {
  config: AbV2Config;
  triggers: Banner;
}

interface AbV2Config {
  paramMap: ParamMap;
  abMap: AbMap;
}

interface AbMap {
  'rl-zhishiku1-1': Rl;
  'rl-mou_create_remove-1': Rl;
  'pop_activate-1': PopActivate1;
  'rl-mobileweb_call-1': PopActivate1;
}

interface PopActivate1 {
  abId: string;
  layerId: string;
}

interface Rl {
  abId: string;
  layerId: string;
  diversionType: number;
}

interface ParamMap {
  ws_zhishiku: PCMouCreRemove;
  pc_mou_cre_remove: PCMouCreRemove;
  ws_hot_activate: WsHotActivate;
  ws_pop_activate: PCMouCreRemove;
  ws_new_call: PCMouCreRemove;
}

interface PCMouCreRemove {
  value: string;
  abId: string;
}

interface WsHotActivate {
  value: string;
}

interface AppHeaderTheme {
  current: string;
  disable: boolean;
  normal: Custom;
  custom: Custom;
}

interface Custom {
  bgColor: string;
}

interface Ctx {
  path: string;
  query: Banner;
  href: string;
  host: string;
}

interface UserAgent {
  Edge: boolean;
  IE: boolean;
  Wechat: boolean;
  Weibo: boolean;
  QQ: boolean;
  MQQBrowser: boolean;
  Qzone: boolean;
  Mobile: boolean;
  Android: boolean;
  HarmonyOS: boolean;
  iOS: boolean;
  isAppleDevice: boolean;
  Zhihu: boolean;
  ZhihuHybrid: boolean;
  isBot: boolean;
  Tablet: boolean;
  UC: boolean;
  Quark: boolean;
  Sogou: boolean;
  Qihoo: boolean;
  Baidu: boolean;
  BaiduApp: boolean;
  Safari: boolean;
  GoogleBot: boolean;
  AndroidDaily: boolean;
  iOSDaily: boolean;
  WxMiniProgram: boolean;
  BaiduMiniProgram: boolean;
  QQMiniProgram: boolean;
  JDMiniProgram: boolean;
  isWebView: boolean;
  isMiniProgram: boolean;
  origin: string;
}

interface Vars {
  passThroughHeaders: Banner;
}

interface Explore {
  recommendations: Banner;
  specials: SpecialsClass;
  roundtables: SpecialsClass;
  collections: Banner;
  columns: Banner;
  square: Square;
}

interface SpecialsClass {
  entities: Banner;
  order: any[];
}

interface Square {
  hotQuestionList: any[];
  potentialList: any[];
}

interface Favlists {
  relations: Banner;
}

interface InitialStateGuide {
  guide: GuideGuide;
}

interface GuideGuide {
  isFetching: boolean;
  isShowGuide: boolean;
}

interface GuideZhidaCard {
  cardStatus: CardStatus;
}

interface CardStatus {
  isShowGuideZhidaCard: boolean;
  guideZhidaCardInView: boolean;
  isClickedBeforeAbIndex: boolean;
  isManualClose: boolean;
  clickedPosition: number;
}

interface HelpCenter {
  entities: HelpCenterEntities;
  categories: any[];
  commonQuestions: any[];
  relatedQuestions: Banner;
  faqTypes: any[];
}

interface HelpCenterEntities {
  question: Banner;
  category: Banner;
}

interface Host {
  roundtable: Roundtable;
  special: Special;
}

interface Roundtable {
  subjects: Banner;
  applications: Applications;
  online: Applications;
  applies: Banner;
  details: Banner;
  includedResource: Banner;
  hotQuestions: Banner;
  warmupContents: Banner;
  batchInclude: Banner;
}

interface Applications {
  total: number;
}

interface Special {
  applications: ProtectHistory;
  censorHistory: Banner;
  drafts: Banner;
}

interface ProtectHistory {
  total: number;
  pages: Banner;
  entities: Banner;
}

interface KnowledgePlan {
  lists: Banner;
  allCreationRankList: Banner;
  featuredQuestions: Banner;
}

interface Loading {
  global: LoadingGlobal;
  local: Local;
}

interface LoadingGlobal {
  count: number;
}

interface Local {
  'people/get/': boolean;
  'switches/getVipSwitches/': boolean;
}

interface Login {
  loginUnregisteredError: boolean;
  loginBindWechatError: boolean;
  loginConfirmError: null;
  sendDigitsError: null;
  needSMSIdentify: boolean;
  validateDigitsError: boolean;
  loginConfirmSucceeded: null;
  qrcodeLoginToken: string;
  qrcodeLoginScanStatus: number;
  qrcodeLoginError: null;
  qrcodeLoginReturnNewToken: boolean;
}

interface Mcn {
  bindInfo: Banner;
  memberCategoryList: any[];
  producerList: any[];
  categoryList: any[];
  lists: Banner;
  banners: Banner;
  protocolStatus: ProtocolStatus;
  probationCountdownDays: number;
}

interface ProtocolStatus {
  isAgreedNew: boolean;
  isAgreedOld: boolean;
}

interface McnActivity {
  household: Household;
}

interface Household {
  products: Banner;
  rankList: RankList;
}

interface RankList {
  total: Banner;
  yesterday: Banner;
}

interface Me {
  columnContributions: any[];
}

interface Messages {
  data: Banner;
  currentTab: string;
  messageCount: number;
}

interface Notifications {
  recent: History;
  history: History;
  notificationActors: History;
  recentNotificationEntry: string;
}

interface People {
  profileStatus: ProfileStatus;
  activitiesByUser: Banner;
  answersByUser: Banner;
  answersSortByVotesByUser: Banner;
  answersIncludedByUser: Banner;
  votedAnswersByUser: Banner;
  thankedAnswersByUser: Banner;
  voteAnswersByUser: Banner;
  thankAnswersByUser: Banner;
  topicAnswersByUser: Banner;
  zvideosByUser: Banner;
  articlesByUser: Banner;
  articlesSortByVotesByUser: Banner;
  articlesIncludedByUser: Banner;
  pinsByUser: Banner;
  questionsByUser: Banner;
  commercialQuestionsByUser: Banner;
  favlistsByUser: Banner;
  followingByUser: Banner;
  followersByUser: Banner;
  mutualsByUser: Banner;
  followingColumnsByUser: Banner;
  followingQuestionsByUser: Banner;
  followingFavlistsByUser: Banner;
  followingTopicsByUser: Banner;
  publicationsByUser: Banner;
  columnsByUser: Banner;
  allFavlistsByUser: Banner;
  brands: null;
  creationsByUser: Banner;
  creationsSortByVotesByUser: Banner;
  creationsFeed: Banner;
  infinity: Banner;
  batchUsers: Banner;
  profileInfinity: null;
}

interface ProfileStatus {
  'an-se-ni': ProfileStatusAnSENI;
}

interface ProfileStatusAnSENI {
  token: Token;
  isFetching: boolean;
  isDrained: boolean;
}

interface Token {
  id: string;
  urlToken: string;
}

interface Pins {
  reviewing: Banner;
}

interface PushNotifications {
  default: Default;
  follow: Default;
  vote_thank: Default;
  currentTab: string;
  notificationsCount: NotificationsCount;
}

interface Default {
  isFetching: boolean;
  isDrained: boolean;
  ids: any[];
}

interface NotificationsCount {
  default: number;
  follow: number;
  vote_thank: number;
}

interface InitialStateQuestion {
  followers: Banner;
  concernedFollowers: Banner;
  answers: Banner;
  hiddenAnswers: Banner;
  updatedAnswers: Banner;
  ariaAnswers: Banner;
  collapsedAnswers: Banner;
  notificationAnswers: Banner;
  invitedQuestions: InvitedQuestions;
  laterQuestions: LaterQuestions;
  waitingQuestions: WaitingQuestions;
  invitationCandidates: Banner;
  inviters: Banner;
  invitees: Banner;
  similarQuestions: Banner;
  questionBanners: Banner;
  relatedCommodities: Banner;
  bio: Banner;
  brand: Banner;
  permission: Banner;
  adverts: Banner;
  advancedStyle: Banner;
  commonAnswerCount: number;
  hiddenAnswerCount: number;
  topicMeta: TopicMeta;
  bluestarRanklist: Banner;
  relatedSearch: Banner;
  autoInvitation: Banner;
  simpleConcernedFollowers: Banner;
  draftStatus: Banner;
  disclaimers: Banner;
  isShowMobileSignInModal: boolean;
}

interface InvitedQuestions {
  total: LaterQuestions;
  followees: LaterQuestions;
}

interface LaterQuestions {
  count?: null;
  isEnd: boolean;
  isLoading: boolean;
  questions: any[];
}

interface TopicMeta {
  isLoading: Banner;
}

interface WaitingQuestions {
  recommend: LaterQuestions;
  invite: LaterQuestions;
  newest: LaterQuestions;
  hot: LaterQuestions;
}

interface Register {
  registerValidateSucceeded: null;
  registerValidateErrors: Banner;
  registerConfirmError: null;
  sendDigitsError: null;
  registerConfirmSucceeded: null;
}

interface Reward {
  answer: Banner;
  article: Banner;
  question: Banner;
}

interface InitialStateRoundtables {
  hotQuestions: Banner;
  warmupContents: Banner;
  hotDiscussions: Banner;
  selectedContents: Banner;
  roundtables: Banner;
}

interface Search {
  recommendSearch: any[];
  topSearch: Banner;
  searchValue: Banner;
  suggestSearch: Banner;
  attachedInfo: AttachedInfo;
  nextOffset: AttachedInfo;
  topicReview: Banner;
  sidebar: Banner;
  calendar: Banner;
  scores: null;
  majors: Banner;
  university: Banner;
  generalByQuery: Banner;
  generalByQueryInADay: Banner;
  generalByQueryInAWeek: Banner;
  generalByQueryInThreeMonths: Banner;
  peopleByQuery: Banner;
  topicByQuery: Banner;
  zvideoByQuery: Banner;
  scholarByQuery: Banner;
  columnByQuery: Banner;
  liveByQuery: Banner;
  albumByQuery: Banner;
  eBookByQuery: Banner;
  kmGeneralByQuery: Banner;
  kmCourseByQuery: Banner;
  favlistByQuery: Banner;
  customFilter: CustomFilter;
  zhidaRelatedQuestions: ZhidaRelatedQuestions;
}

interface AttachedInfo {
  generalByQuery: Banner;
}

interface CustomFilter {
  requestFinished: boolean;
  keys: any[];
  tags: any[];
}

interface ZhidaRelatedQuestions {
  isLoading: boolean;
  data: any[];
  showZhidaRelatedQuestionsCard: boolean;
}

interface Settings {
  socialBind: null;
  inboxMsg: null;
  notification: Banner;
  email: Banner;
  privacyFlag: null;
  blockedUsers: BlockedFollowees;
  blockedFollowees: BlockedFollowees;
  ignoredTopics: BlockedFollowees;
  restrictedTopics: null;
  laboratory: Banner;
}

interface BlockedFollowees {
  isFetching: boolean;
  paging: BlockedFolloweesPaging;
  data: any[];
}

interface BlockedFolloweesPaging {
  pageNo: number;
  pageSize: number;
}

interface SMS {
  supportedCountries: any[];
}

interface Specials {
  entities: Banner;
  all: Hot;
}

interface Switches {
  vipSwitches: { [key: string]: boolean };
}

interface Topic {
  bios: Banner;
  hot: Banner;
  newest: Banner;
  top: Banner;
  sticky: Banner;
  pin: Banner;
  unanswered: Banner;
  questions: Banner;
  zivdeo: Banner;
  'zvideo-new': Banner;
  pin20: Banner;
  'pin20-new': Banner;
  followers: Banner;
  contributors: Banner;
  parent: Banner;
  children: Banner;
  bestAnswerers: Banner;
  wikiMeta: Banner;
  index: Banner;
  intro: Banner;
  meta: Banner;
  schema: Banner;
  creatorWall: Banner;
  wikiEditInfo: Banner;
  committedWiki: Banner;
  landingBasicData: Banner;
  landingExcellentItems: any[];
  landingExcellentEditors: any[];
  landingCatalog: any[];
  landingEntries: Banner;
}

interface Topstory {
  recommend: Follow;
  follow: Follow;
  followWonderful: Follow;
  sidebar: null;
  announcement: Banner;
  hotList: any[];
  hotListHeadZone: any[];
  guestFeeds: Follow;
  followExtra: FollowExtra;
  hotDaily: HotDaily;
  hotHighlight: HotHighlight;
  banner: Banner;
  commercialBanner: CommercialBanner;
  video: TopstoryVideo;
}

interface CommercialBanner {
  show: boolean;
  banner: Banner;
  trackData: Banner;
}

interface Follow {
  isFetching: boolean;
  isDrained: boolean;
  afterId: number;
  items: any[];
  next: null;
}

interface FollowExtra {
  isNewUser: null;
  isFetched: boolean;
  followCount: number;
  followers: any[];
}

interface HotDaily {
  data: any[];
  paging: Banner;
}

interface HotHighlight {
  isFetching: boolean;
  isDrained: boolean;
  data: any[];
  paging: Banner;
}

interface TopstoryVideo {
  items: any[];
  next: null;
  isLoading: boolean;
  isDrained: boolean;
}

interface UserProfit {
  permission: Permission;
  linkCardLimit: number;
}

interface Permission {
  permissionStatus: PermissionStatus;
  visible: boolean;
}

interface PermissionStatus {
  zhiZixuan: number;
  recommend: number;
  task: number;
  plugin: number;
  infinity: number;
}

interface InitialStateVideo {
  data: Banner;
  shareVideoDetail: Banner;
  last: Banner;
}

interface WallE {
  protectHistory: ProtectHistory;
}

interface ZhiPlus {
  permissionStatus: number;
}

interface ZhidaEntry {
  sidebar: Sidebar;
  answerBottom: Banner;
}

interface Sidebar {
  answer: Banner;
  question: Banner;
}

interface Zvideos {
  campaignVideoList: Banner;
  campaigns: Banner;
  tagoreCategory: any[];
  recommendations: Banner;
  insertable: Banner;
  recruit: Recruit;
  qyActivityData: Banner;
  talkActivityData: Banner;
  party2022ActivityData: Banner;
  batchVideos: Banner;
  creationReferences: Banner;
  zvideoCollection: Banner;
  zvideoGrant: Banner;
  collectData: CollectData;
  videoSource: VideoSource;
  paidColumnInfo: Banner;
}

interface CollectData {
  isFetching: boolean;
  list: any[];
}

interface Recruit {
  form: Form;
  submited: boolean;
  ranking: any[];
}

interface Form {
  platform: string;
  nickname: string;
  followerCount: string;
  domain: string;
  contact: string;
}

interface VideoSource {
  isLoaded: boolean;
}
