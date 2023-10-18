import { ETheme, EThemeDark, EThemeLight } from './variable-background.type';

/** 隐藏内容模块配置 */
export interface IConfigHidden {
  /** 隐藏回答页面右侧内容 */
  hiddenAnswerRightFooter?: boolean;
  /** 隐藏回答下方悬浮操作条 */
  hiddenFixedActions?: boolean;
  /** 隐藏logo */
  hiddenLogo?: boolean;
  /** 隐藏header */
  hiddenHeader?: boolean;
  /** 隐藏顶部滚动header */
  hiddenHeaderScroll?: boolean;
  /** 隐藏列表回答操作 */
  hiddenItemActions?: boolean;
  /** 隐藏回答操作文字 */
  hiddenAnswerText?: boolean;
  /** 隐藏问题分享 */
  hiddenQuestionShare?: boolean;
  /** 隐藏问题话题 */
  hiddenQuestionTag?: boolean;
  /** 隐藏问题操作栏 */
  hiddenQuestionActions?: boolean;
  /** 隐藏赞赏按钮 */
  hiddenReward?: boolean;
  /** 隐藏专栏关联话题 */
  hiddenZhuanlanTag?: boolean;
  /** 隐藏问题列表图片 */
  hiddenListImg?: boolean;
  /** 隐藏阅读全文文字 */
  hiddenReadMoreText?: boolean;
  /** 隐藏广告 */
  hiddenAD?: boolean;
  /** 隐藏问题列表回答内容 */
  hiddenAnswers?: boolean;
  /** 隐藏专栏下方操作条 */
  hiddenZhuanlanActions?: boolean;
  /** 隐藏专栏标题图片 */
  hiddenZhuanlanTitleImage?: boolean;
  /** 隐藏热门热度值 */
  hiddenHotItemMetrics?: boolean;
  /** 隐藏热门排序 */
  hiddenHotItemIndex?: boolean;
  /** 热门"新"隐藏元素 */
  hiddenHotItemLabel?: boolean;
  /** 隐藏详情回答人头像 */
  hiddenDetailAvatar?: boolean;
  /** 隐藏详情回答人简介 */
  hiddenDetailBadge?: boolean;
  // /** 隐藏详情回答人下赞同数 */
  // hiddenDetailVoters?: boolean;
  /** 隐藏详情回答人下赞同用户和「你赞同过」 */
  hiddenWhoVoters?: boolean;
  /** 隐藏详情回答人姓名 */
  hiddenDetailName?: boolean;
  /** 隐藏详情回答人关注按钮 */
  hiddenDetailFollow?: boolean;
  /** 隐藏首页问题列表切换模块 */
  hiddenHomeTab?: boolean;
  /** 隐藏问题关注和被浏览数 */
  hiddenQuestionSide?: boolean;
  /** 隐藏关注问题按钮 */
  hiddenQuestionFollowing?: boolean;
  /** 隐藏写回答按钮 */
  hiddenQuestionAnswer?: boolean;
  /** 隐藏邀请回答按钮 */
  hiddenQuestionInvite?: boolean;
  /** 隐藏搜索栏知乎热搜 */
  hiddenSearchBoxTopSearch?: boolean;
  /** 隐藏搜索页知乎热搜 */
  hiddenSearchPageTopSearch?: boolean;
  /** 隐藏搜索页知乎指南 */
  hiddenSearchPageFooter?: boolean;
  /** 隐藏专栏悬浮分享按钮 */
  hiddenZhuanlanShare?: boolean;
  /** 隐藏专栏悬浮赞同按钮 */
  hiddenZhuanlanVoters?: boolean;
  /** 列表[亲自答]隐藏标签 */
  hiddenListAnswerInPerson?: boolean;
  /** 隐藏关注列表关注人操作栏 */
  hiddenFollowAction?: boolean;
  /** 隐藏关注列表用户信息 */
  hiddenFollowChooseUser?: boolean;
  /** 隐藏信息栏关于作者 */
  hiddenAnswerRightFooterAnswerAuthor?: boolean;
  /** 隐藏信息栏被收藏次数 */
  hiddenAnswerRightFooterFavorites?: boolean;
  /** 隐藏信息栏相关问题 */
  hiddenAnswerRightFooterRelatedQuestions?: boolean;
  /** 隐藏信息栏相关推荐 */
  hiddenAnswerRightFooterContentList?: boolean;
  /** 隐藏信息栏知乎指南 */
  hiddenAnswerRightFooterFooter?: boolean;
  /** 隐藏618红包链接（临时补充） */
  hidden618HongBao?: boolean;
  /** 隐藏文章作者关注按钮 */
  hiddenZhuanlanFollowButton?: boolean;
  /** 隐藏文章作者头像 */
  hiddenZhuanlanAvatarWrapper?: boolean;
  /** 隐藏文章作者姓名 */
  hiddenZhuanlanAuthorInfoHead?: boolean;
  /** 隐藏文章作者简介 */
  hiddenZhuanlanAuthorInfoDetail?: boolean;
  /** 隐藏详情顶部专题收录标签 */
  hiddenQuestionSpecial?: boolean;
  /** 隐藏列表视频回答的内容 */
  hiddenListVideoContent?: boolean;
  /** 隐藏主页创作中心 */
  hiddenHomeCreatorEntrance?: boolean;
  /** 隐藏主页推荐关注 */
  hiddenHomeRecommendFollow?: boolean;
  /** 隐藏主页分类圆桌 */
  hiddenHomeCategory?: boolean;
  /** 隐藏主页更多分类 */
  hiddenHomeCategoryMore?: boolean;
  /** 隐藏主页知乎指南 */
  hiddenHomeFooter?: boolean;
  /** 隐藏回答内容操作栏 */
  hiddenAnswerItemActions?: boolean;
  /** 隐藏回答下方发布编辑时间 */
  hiddenAnswerItemTime?: boolean;
  /** 发现模块-隐藏首页 */
  hiddenAppHeaderTabHome?: boolean;
  /** 发现模块-隐藏知学堂 */
  hiddenAppHeaderTabZhi?: boolean;
  /** 发现模块-隐藏会员 */
  hiddenAppHeaderTabVIP?: boolean;
  /** 发现模块-隐藏发现 */
  hiddenAppHeaderTabFind?: boolean;
  /** 发现模块-隐藏等你来答 */
  hiddenAppHeaderTabWaitingForYou?: boolean;
  /** 隐藏全部问题列表切换模块 */
  hiddenHomeListTab?: boolean;
  /** 问题列表切换 - 隐藏关注 */
  hiddenHomeListTabFollow?: boolean;
  /** 问题列表切换 - 隐藏推荐 */
  hiddenHomeListTabRecommend?: boolean;
  /** 问题列表切换 - 隐藏热榜 */
  hiddenHomeListTabHot?: boolean;
  /** 问题列表切换 - 隐藏视频 */
  hiddenHomeListTabVideo?: boolean;
  /** 隐藏「好问题」按钮 */
  hiddenQuestionGoodQuestion?: boolean;
  /** 隐藏添加评论按钮 */
  hiddenQuestionComment?: boolean;
  /** 问题「...隐藏」按钮 */
  hiddenQuestionMore?: boolean;
  /** 隐藏不显示修改器唤醒图标 */
  hiddenOpenButton?: boolean;
  /** 是否隐藏 - 评论「回复」按钮 */
  hiddenCommitReply?: boolean;
  /** 是否隐藏 - 评论「点赞」按钮 */
  hiddenCommitVote?: boolean;
  /** 是否隐藏 - 评论底部信息 */
  hiddenCommitBottom?: boolean;
}

/** 自定义黑名单列表内容 */
export interface IBlockUserItem {
  avatar?: string;
  id?: string;
  name?: string;
  urlToken?: string;
  userType?: string;
}

/** 屏蔽内容模块默认配置 */
export interface IConfigFilter {
  /** 屏蔽知乎官方账号回答 */
  removeZhihuOfficial?: boolean;
  /** 屏蔽故事档案局回答 */
  removeStoryAnswer?: boolean;
  /** 屏蔽盐选科普回答 */
  removeYanxuanAnswer?: boolean;
  /** 屏蔽盐选推荐 */
  removeYanxuanRecommend?: boolean;
  /** 屏蔽盐选测评室 */
  removeYanxuanCPRecommend?: boolean;
  /** 屏蔽选自盐选专栏的回答 */
  removeFromYanxuan?: boolean;
  /** 屏蔽带有虚构内容的回答 */
  removeUnrealAnswer?: boolean;
  /** 屏蔽关注人赞同回答 */
  removeFollowVoteAnswer?: boolean;
  /** 屏蔽关注人赞同文章 */
  removeFollowVoteArticle?: boolean;
  /** 屏蔽关注人关注问题 */
  removeFollowFQuestion?: boolean;
  /** 屏蔽不再显示黑名单用户发布的内容 */
  removeBlockUserContent?: boolean;
  /** 屏蔽已屏蔽用户列表 */
  removeBlockUserContentList?: IBlockUserItem[];
  /** 屏蔽商业推广 */
  removeItemAboutAD?: boolean;
  /** 屏蔽文章 */
  removeItemAboutArticle?: boolean;
  /** 屏蔽视频 */
  removeItemAboutVideo?: boolean;
  /** 屏蔽列表提问 */
  removeItemQuestionAsk?: boolean;
  /** 关注列表过滤低于以下赞的内容 */
  removeLessVote?: boolean;
  /** 关注列表过滤低于以下赞的内容 */
  lessVoteNumber?: number;
  /** 回答低赞内容屏蔽 */
  removeLessVoteDetail?: boolean;
  /** 回答详情屏蔽以下赞的内容 */
  lessVoteNumberDetail?: number;
  /** 屏蔽匿名用户回答 */
  removeAnonymousAnswer?: boolean;
  /** 关注列表屏蔽自己的操作 */
  removeMyOperateAtFollow?: boolean;
}

/** 悬浮模块默认配置 */
export interface IConfigSuspension {
  /** 问题列表切换 */
  suspensionHomeTab?: boolean;
  /** 问题列表切换定位 */
  suspensionHomeTabPo?: string;
  /** 问题列表切换是否固定 */
  suspensionHomeTabFixed?: boolean;
  /** 顶部发现模块 */
  suspensionFind?: boolean;
  /** 顶部发现模块定位 */
  suspensionFindPo?: string;
  /** 顶部发现模块是否固定 */
  suspensionFindFixed?: boolean;
  /** 搜索栏 */
  suspensionSearch?: boolean;
  /** 搜索栏定位 */
  suspensionSearchPo?: string;
  /** 搜索栏是否固定 */
  suspensionSearchFixed?: boolean;
  /** 个人中心 */
  suspensionUser?: boolean;
  /** 个人中心定位 */
  suspensionUserPo?: string;
  /** 个人中心是否固定 */
  suspensionUserFixed?: boolean;
  /** 长回答和列表收起按钮*/
  suspensionPickUp?: boolean;
}

/** 配置参数 */
export interface IPfConfig extends IConfigHidden, IConfigFilter, IConfigSuspension {
  [key: string]: any;
  /** 自定义样式 */
  customizeCss?: string;
  /** 知乎默认 | 自动展开所有回答 | 默认收起所有长回答 */
  answerOpen?: '' | 'on' | 'off';
  filterKeywords?: string[];
  /** 列表用户名后显示「屏蔽用户」按钮 */
  showBlockUser?: boolean;
  /** 列表版心宽度 */
  versionHome?: string;
  /** 回答版心宽度 */
  versionAnswer?: string;
  /** 文章版心宽度 */
  versionArticle?: string;
  /** 图片尺寸自定义类型 0 1 2 */
  zoomImageType?: '0' | '1' | '2';
  /** 图片尺寸自定义大小 */
  zoomImageSize?: string;
  /** 使用弹窗打开动图 */
  showGIFinDialog?: boolean;
  /** 网页标题 */
  globalTitle?: string;
  /** 网页标题logo图 */
  titleIco?: string;
  /** 内容标题添加类别标签 */
  questionTitleTag?: boolean;
  /** 推荐列表外置「不感兴趣」按钮 */
  listOutPutNotInterested?: boolean;
  /** 列表更多按钮固定至题目右侧 */
  fixedListItemMore?: boolean;
  /** 关注列表高亮原创内容 */
  highlightOriginal?: boolean;
  /** 列表内容点击高亮边框 */
  highlightListItem?: boolean;
  /** 列表内容显示发布与最后修改时间 */
  listItemCreatedAndModifiedTime?: boolean;
  /** 回答列表显示创建与最后修改时间 */
  answerItemCreatedAndModifiedTime?: boolean;
  /** 问题显示创建和最后修改时间 */
  questionCreatedAndModifiedTime?: boolean;
  /** 文章发布时间置顶 */
  articleCreateTimeToTop?: boolean;
  /** 购物链接显示设置 0 1 2 */
  linkShopping?: '0' | '1' | '2';
  /** 回答视频显示设置  0 1 2 */
  linkAnswerVideo?: '0' | '1' | '2';
  /** 列表内容标准文字大小 */
  fontSizeForList?: number;
  /** 回答内容标准文字大小 */
  fontSizeForAnswer?: number;
  /** 文章内容标准文字大小 */
  fontSizeForArticle?: number;
  /** 列表视频回答内容尺寸 */
  zoomListVideoType?: string;
  /** 列表视频回答内容缩放 */
  zoomListVideoSize?: string;
  /** 唤醒快捷键是否开启 */
  hotKey?: boolean;
  /** 颜色主题 浅色、深色、自动 */
  theme?: ETheme;
  /** 浅色主题选择的样式 */
  themeLight?: EThemeLight;
  /** 深色主题选择的样式 */
  themeDark?: EThemeDark;
  /** 字体颜色 */
  colorText1?: '';
  /** 回答操作 - 赞同按钮仅显示赞同数 */
  justVoteNum?: boolean;
  /** 回答操作 - 评论按钮仅显示评论数 */
  justCommitNum?: boolean;
}
