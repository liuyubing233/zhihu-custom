/** 隐藏内容模块默认为 true 的配置 */
export const CONFIG_HIDDEN_DEFAULT = {
  /** 隐藏回答页面右侧内容 */
  hiddenAnswerRightFooter: true,
  /** 隐藏阅读全文文字 */
  hiddenReadMoreText: true,
  /** 隐藏广告 */
  hiddenAD: true,
  /** 隐藏详情回答人关注按钮 */
  hiddenDetailFollow: true,
  /** 隐藏618红包链接（临时补充） */
  hidden618HongBao: true,
};

/** 屏蔽内容模块默认配置 */
export const CONFIG_FILTER_DEFAULT = {
  /** 屏蔽知乎官方账号回答 */
  removeZhihuOfficial: false,
  /** 屏蔽故事档案局回答 */
  removeStoryAnswer: true,
  /** 屏蔽盐选科普回答 */
  removeYanxuanAnswer: true,
  /** 屏蔽盐选推荐 */
  removeYanxuanRecommend: true,
  /** 屏蔽盐选测评室 */
  removeYanxuanCPRecommend: true,
  /** 屏蔽选自盐选专栏的回答 */
  removeFromYanxuan: true,
  /** 屏蔽带有虚构内容的回答 */
  removeUnrealAnswer: false,
  /** 屏蔽关注人赞同回答 */
  removeFollowVoteAnswer: false,
  /** 屏蔽关注人赞同文章 */
  removeFollowVoteArticle: false,
  /** 屏蔽关注人关注问题 */
  removeFollowFQuestion: false,
  /** 屏蔽不再显示黑名单用户发布的内容 */
  removeBlockUserContent: true,
  /** 屏蔽已屏蔽用户列表 */
  removeBlockUserContentList: [],
  /** 屏蔽商业推广 */
  removeItemAboutAD: false,
  /** 屏蔽文章 */
  removeItemAboutArticle: false,
  /** 屏蔽视频 */
  removeItemAboutVideo: false,
  /** 屏蔽列表提问 */
  removeItemQuestionAsk: false,
  /** 关注列表过滤低于以下赞的内容 */
  removeLessVote: false,
  /** 关注列表过滤低于以下赞的内容 */
  lessVoteNumber: 100,
  /** 回答低赞内容屏蔽 */
  removeLessVoteDetail: false,
  /** 回答详情屏蔽以下赞的内容 */
  lessVoteNumberDetail: 100,
  /** 屏蔽匿名用户回答 */
  removeAnonymousAnswer: false,
  /** 关注列表屏蔽自己的操作 */
  removeMyOperateAtFollow: false,
};

/** 悬浮模块默认配置 */
export const CONFIG_SUSPENSION = {
  suspensionHomeTab: false, // 问题列表切换
  suspensionHomeTabPo: 'left: 20px; top: 100px;', // 定位
  suspensionHomeTabFixed: true,
  suspensionFind: false, // 顶部发现模块
  suspensionFindPo: 'left: 10px; top: 380px;',
  suspensionFindFixed: true,
  suspensionSearch: false, // 搜索栏
  suspensionSearchPo: 'left: 10px; top: 400px;',
  suspensionSearchFixed: true,
  suspensionUser: false, // 个人中心
  suspensionUserPo: 'right: 60px; top: 100px;',
  suspensionUserFixed: true,
  suspensionPickUp: true, // 长回答和列表收起按钮
};

/** 极简模式配置 */
export const CONFIG_SIMPLE = {
  hiddenAnswerRightFooter: true,
  hiddenFixedActions: true,
  hiddenLogo: true,
  hiddenHeader: true,
  hiddenHeaderScroll: true,
  hiddenItemActions: true,
  hiddenAnswerText: true,
  hiddenQuestionShare: true,
  hiddenQuestionTag: true,
  hiddenQuestionActions: true,
  hiddenReward: true,
  hiddenZhuanlanTag: true,
  hiddenListImg: true,
  hiddenReadMoreText: true,
  hiddenAD: true,
  hiddenAnswers: true,
  hiddenZhuanlanActions: true,
  hiddenZhuanlanTitleImage: true,
  hiddenHotItemMetrics: true,
  hiddenHotItemIndex: true,
  hiddenHotItemLabel: true,
  hiddenDetailAvatar: true,
  hiddenDetailBadge: true,
  hiddenDetailVoters: true,
  hiddenDetailName: true,
  hiddenDetailFollow: true,
  hiddenHomeTab: false,
  hiddenQuestionSide: true,
  hiddenQuestionFollowing: true,
  hiddenQuestionAnswer: true,
  hiddenQuestionInvite: true,
  hiddenSearchBoxTopSearch: true,
  hiddenSearchPageTopSearch: true,
  hiddenSearchPageFooter: true,
  hiddenZhuanlanShare: true,
  hiddenZhuanlanVoters: true,
  hiddenListAnswerInPerson: true,
  hiddenFollowAction: true,
  hiddenFollowChooseUser: true,
  hidden618HongBao: true,
  hiddenZhuanlanFollowButton: true,
  hiddenZhuanlanAvatarWrapper: true,
  hiddenZhuanlanAuthorInfoHead: true,
  hiddenZhuanlanAuthorInfoDetail: true,
  hiddenQuestionSpecial: true,
  hiddenListVideoContent: true,
  hiddenHomeCreatorEntrance: true,
  hiddenHomeRecommendFollow: true,
  hiddenHomeCategory: true,
  hiddenHomeCategoryMore: true,
  hiddenHomeFooter: true,
  removeZhihuOfficial: false,
  removeStoryAnswer: true,
  removeYanxuanAnswer: true,
  removeYanxuanRecommend: true,
  removeYanxuanCPRecommend: true,
  removeFromYanxuan: true,
  removeUnrealAnswer: false,
  removeFollowVoteAnswer: false,
  removeFollowVoteArticle: false,
  removeFollowFQuestion: false,
  removeBlockUserContent: true,
  removeItemAboutAD: false,
  removeItemAboutArticle: false,
  removeItemAboutVideo: false,
  removeItemQuestionAsk: false,
  removeLessVote: false,
  lessVoteNumber: 100,
  removeLessVoteDetail: false,
  lessVoteNumberDetail: 100,
  suspensionHomeTab: false,
  suspensionHomeTabPo: 'left: 20px; top: 100px;',
  suspensionHomeTabFixed: true,
  suspensionFind: false,
  suspensionFindPo: 'left: 10px; top: 380px;',
  suspensionFindFixed: true,
  suspensionSearch: true,
  suspensionSearchPo: 'left: 10px; top: 400px;',
  suspensionSearchFixed: true,
  suspensionUser: true,
  suspensionUserPo: 'right: 60px; top: 100px;',
  suspensionUserFixed: true,
  suspensionPickUp: true,
  answerOpen: 'off',
  showBlockUser: false,
  zoomImageType: '2',
  zoomImageSize: '200',
  showGIFinDialog: true,
  questionTitleTag: true,
  listOutPutNotInterested: true,
  fixedListItemMore: true,
  highlightOriginal: true,
  highlightListItem: true,
  listItemCreatedAndModifiedTime: true,
  answerItemCreatedAndModifiedTime: true,
  questionCreatedAndModifiedTime: true,
  articleCreateTimeToTop: true,
  linkShopping: '1',
  linkAnswerVideo: '1',
  hiddenAnswerItemActions: true,
  hiddenAnswerItemTime: true,
};

/** 配置项 */
export let pfConfig = {
  ...CONFIG_HIDDEN_DEFAULT,
  ...CONFIG_FILTER_DEFAULT,
  ...CONFIG_SUSPENSION,
  /** 自定义样式 */
  customizeCss: '',
  /** 知乎默认 | 自动展开所有回答 | 默认收起所有长回答 */
  answerOpen: '',
  filterKeywords: [],
  /** 列表用户名后显示「屏蔽用户」按钮 */
  showBlockUser: true,
  /** 背景色 */
  colorBackground: '#ffffff',
  /** 列表版心宽度 */
  versionHome: '1000',
  /** 回答版心宽度 */
  versionAnswer: '1000',
  /** 文章版心宽度 */
  versionArticle: '690',
  /** 图片尺寸自定义类型 0 1 2 */
  zoomImageType: '0',
  /** 图片尺寸自定义大小 */
  zoomImageSize: '600',
  /** 使用弹窗打开动图 */
  showGIFinDialog: true,
  /** 网页标题 */
  globalTitle: '',
  /** 网页标题logo图 */
  titleIco: '',
  /** 内容标题添加类别标签 */
  questionTitleTag: true,
  /** 推荐列表外置「不感兴趣」按钮 */
  listOutPutNotInterested: false,
  /** 列表更多按钮固定至题目右侧 */
  fixedListItemMore: false,
  /** 关注列表高亮原创内容 */
  highlightOriginal: true,
  /** 列表内容点击高亮边框 */
  highlightListItem: false,
  /** 列表内容显示发布与最后修改时间 */
  listItemCreatedAndModifiedTime: true,
  /** 回答列表显示创建与最后修改时间 */
  answerItemCreatedAndModifiedTime: true,
  /** 问题显示创建和最后修改时间 */
  questionCreatedAndModifiedTime: true,
  /** 文章发布时间置顶 */
  articleCreateTimeToTop: true,
  /** 购物链接显示设置 0 1 2 */
  linkShopping: '0',
  /** 回答视频显示设置  0 1 2 */
  linkAnswerVideo: '0',
  /** 列表内容标准文字大小 */
  fontSizeForList: 15,
  /** 回答内容标准文字大小 */
  fontSizeForAnswer: 15,
  /** 文章内容标准文字大小 */
  fontSizeForArticle: 16,
  /** 列表视频回答内容尺寸 */
  zoomListVideoType: '0',
  /** 列表视频回答内容缩放 */
  zoomListVideoSize: '500',
  /** 唤醒快捷键是否开启 */
  hotKey: true,
};

/** 用户信息 */
export let userInfo = {};

export const findEvent = {
  header: { fun: null, num: 0, isFind: false },
};

/** 脚本内配置缓存 */
export const storageConfig = {
  cachePfConfig: {}, // 缓存初始配置
  cacheTitle: '', // 缓存页面原标题
  fetchHeaders: {}, // fetch 的 headers 内容, 获取下来以供使用
  heightForList: 0, // 列表缓存高度
  headerDoms: {}, // header内元素
};
