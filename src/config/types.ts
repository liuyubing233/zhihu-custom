import { ETheme, EThemeDark, EThemeLight } from '../components/background';
import { IConfigBlackList } from '../components/black-list';
import {
  EAnswerOpen,
  EHomeContentOpen,
  ELinkShopping,
  EReplaceZhidaToSearch,
  ESuspensionOpen,
  EVideoInAnswerArticle,
  EZoomImageHeight,
  EZoomImageType,
  EZoomListVideoType,
} from '../components/select';

/** 隐藏内容模块配置 */
export interface IConfigHidden {
  /** 隐藏回答底部「继续追问」模块 */
  hiddenAnswerKeepAsking?: boolean;
  /** 隐藏问题标题卡片广告和榜单 */
  hiddenQuestionAD?: boolean;
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
  /** 隐藏列表回答操作栏 - 底部悬浮 */
  hiddenItemActionsIsFixed?: boolean;
  // /** 隐藏回答操作文字 */
  // hiddenAnswerText?: boolean;
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
  /** 隐藏文章底部知乎热榜 */
  // hiddenZhuanlanButtonHot?: boolean;
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
  /** 隐藏详情回答人下赞同数 */
  hiddenDetailVoters?: boolean;
  /** 回答隐藏用户信息下的附加信息，例如：「你赞同过」 */
  // hiddenWhoVoters?: boolean;
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
  /** 隐藏搜索结果知乎直达 */
  hiddenSearchResultZhida?: boolean;
  // /** 隐藏专栏悬浮分享按钮 */
  // hiddenZhuanlanShare?: boolean;
  // /** 隐藏专栏悬浮赞同按钮 */
  // hiddenZhuanlanVoters?: boolean;
  /** 列表[亲自答]隐藏标签 */
  hiddenListAnswerInPerson?: boolean;
  /** 隐藏关注列表关注人操作栏 */
  // hiddenFollowAction?: boolean;
  /** 隐藏关注列表用户信息 */
  // hiddenFollowChooseUser?: boolean;
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
  /** 隐藏主页圈子 */
  hiddenHomeQuanzi?: boolean;
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
  /** 回答底部发布编辑时间（保留IP） */
  hiddenAnswerItemTimeButHaveIP?: boolean;
  // /** 发现模块-隐藏首页 */
  // hiddenAppHeaderTabHome?: boolean;
  // /** 发现模块-隐藏知学堂 */
  // hiddenAppHeaderTabZhi?: boolean;
  // /** 发现模块-隐藏会员 */
  // // hiddenAppHeaderTabVIP?: boolean;
  // // /** 发现模块-隐藏发现 */
  // /** 发现模块-知乎直答 */
  // hiddenAppHeaderTabFind?: boolean;
  // /** 发现模块-隐藏等你来答 */
  // hiddenAppHeaderTabWaitingForYou?: boolean;
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
  /** 用户主页付费咨询、认证和成就 */
  hiddenUserHomeOtherCard?: boolean;
  /** 用户主页出版作品 */
  hiddenUserHomePublications?: boolean;
  /** 用户主页创作中心 */
  hiddenUserHomeCreateEntrance?: boolean;
  /** 用户主页关注和关注者卡片 */
  hiddenUserHomeFollow?: boolean;
  /** 用户主页关注的内容和赞助 */
  hiddenUserHomeLightList?: boolean;
  /** 用户主页右侧屏蔽·举报用户、个人主页被浏览次数 */
  hiddenUserHomeFooterOperate?: boolean;
  /** 用户主页知乎指南 */
  hiddenUserHomeFooter?: boolean;
  /** 收藏夹创作中心 */
  hiddenCollectionsCreate?: boolean;
  /** 收藏夹推荐关注 */
  hiddenCollectionsRecommendFollow?: boolean;
  /** 收藏夹圆桌入口 */
  hiddenCollectionsCategory?: boolean;
  /** 收藏夹更多分类 */
  hiddenCollectionsComplementary?: boolean;
  /** 收藏夹知乎指南 */
  hiddenCollectionsFooter?: boolean;
  /** 知乎知学堂教育推广商品模块 */
  // hiddenZhihuZhiShop?: boolean;
  /** 话题主页右侧浏览/讨论量模块 */
  hiddenTopicRightNumberBoard?: boolean;
  /** 话题主页右侧父子话题模块 */
  hiddenTopicRightParentChild?: boolean;
  /** 话题主页右侧知乎指南 */
  hiddenTopicRightFooter?: boolean;
  /** 盐选作者平台 */
  hiddenYanXuanWriter?: boolean;
  /** 问题查看全部回答 */
  hiddenQuestionViewAll?: boolean;
  /** 文章内容所属专栏 */
  hiddenZhuanlanContributions?: boolean;
  /** 收藏夹列表操作栏 */
  hiddenItemActionsCollection?: boolean;
  /** 收藏夹列表操作栏 - 底部悬浮 */
  hiddenItemActionsIsFixedCollection?: boolean;
  /** 搜索页列表操作栏 */
  hiddenItemActionsSearch?: boolean;
  /** 搜索页列表操作栏 - 底部悬浮 */
  hiddenItemActionsIsFixedSearch?: boolean;
  /** 个人主页动态、回答、文章等操作栏 */
  hiddenItemActionsUser?: boolean;
  /** 个人主页动态、回答、文章等操作栏 - 底部悬浮 */
  hiddenItemActionsIsFixedUser?: boolean;
  /** 隐藏热榜顶部滚动新闻 */
  hiddenHotTopNews?: boolean;
  /** 隐藏文章详情关于作者 */
  hiddenZhuanlanAuthorCard?: boolean;
  /** 隐藏文章底部推荐阅读 */
  hiddenZhuanlan?: boolean;
  /** 隐藏回答内容「所属专栏」模块 */
  hiddenAnswerBelongZhuanlan?: boolean;
  /** 隐藏回答人下方标签 */
  hiddenAnswerDownTags?: boolean;
  /** 隐藏回答「谢邀」标签 */
  hiddenThanksInvite?: boolean;
  /** 隐藏首页分享想法模块 */
  hiddenHomeWriteArea?: boolean;
}

/** 屏蔽内容模块默认配置 */
export interface IConfigFilter {
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
  /** 屏蔽商业推广 */
  removeItemAboutAD?: boolean;
  /** 屏蔽文章 */
  removeItemAboutArticle?: boolean;
  /** 屏蔽视频 */
  removeItemAboutVideo?: boolean;
  /** 列表屏蔽想法 */
  removeItemAboutPin?: boolean;
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
  /** 屏蔽顶部活动推广 */
  removeTopAD?: boolean;
  /** 屏蔽标签选自电子书的回答 */
  removeFromEBook?: boolean;
  /** 屏蔽匿名用户提问 */
  removeAnonymousQuestion?: boolean;
  /** 「不感兴趣」按钮 */
  listOutPutNotInterested?: boolean;
  /** 不感兴趣的内容题目 */
  notInterestedList?: string[];
}

/** 悬浮模块默认配置 */
export interface IConfigSuspension {
  // /** 问题列表切换 */
  // suspensionHomeTab?: boolean;
  // /** 问题列表切换定位 */
  // suspensionHomeTabPo?: string;
  // /** 问题列表切换是否固定 */
  // suspensionHomeTabFixed?: boolean;
  // /** 顶部发现模块 */
  // suspensionFind?: boolean;
  // /** 顶部发现模块定位 */
  // suspensionFindPo?: string;
  // /** 顶部发现模块是否固定 */
  // suspensionFindFixed?: boolean;
  // /** 搜索栏 */
  // suspensionSearch?: boolean;
  // /** 搜索栏定位 */
  // suspensionSearchPo?: string;
  // /** 搜索栏是否固定 */
  // suspensionSearchFixed?: boolean;
  // /** 个人中心 */
  // suspensionUser?: boolean;
  // /** 个人中心定位 */
  // suspensionUserPo?: string;
  // /** 个人中心是否固定 */
  // suspensionUserFixed?: boolean;
  /** 长回答和列表收起按钮*/
  suspensionPickUp?: boolean;
  /** 悬浮收起按钮位置，数字越大离右侧越远 */
  suspensionPickupRight?: number;
  /** 修改器弹出图标定位方式 */
  suspensionOpen?: ESuspensionOpen;
  suspensionOpenRight?: string;
  suspensionOpenLeft?: string;
  suspensionOpenBottom?: string;
  suspensionOpenTop?: string;
  suspensionOpenUseLeft?: boolean;
  suspensionOpenUseTop?: boolean;
}

/** 配置参数 */
export interface IPfConfig extends IConfigHidden, IConfigFilter, IConfigSuspension, IConfigBlackList {
  [key: string]: any;
  /** 是否开启接口拦截，默认开启 */
  fetchInterceptStatus?: boolean;
  /** 自定义样式 */
  customizeCss?: string;
  /** 知乎默认 | 自动展开所有回答 | 默认收起所有长回答 */
  answerOpen?: EAnswerOpen;
  /** 屏蔽词方法：列表标题屏蔽 */
  filterKeywords?: string[];
  /** 屏蔽词方法：回答内容屏蔽 */
  blockWordsAnswer?: string[];
  /** 列表页面内容宽度 */
  versionHome?: string;
  /** 列表页面内容宽度是否使用百分比 */
  versionHomeIsPercent?: boolean;
  /** 列表页面内容宽度百分比内容 */
  versionHomePercent?: string;
  /** 回答页面内容宽度 */
  versionAnswer?: string;
  /** 回答页面内容宽度是否使用百分比 */
  versionAnswerIsPercent?: boolean;
  /** 回答页面内容宽度百分比内容 */
  versionAnswerPercent?: string;
  /** 文章页面内容宽度 */
  versionArticle?: string;
  /** 文章页面内容宽度是否使用百分比 */
  versionArticleIsPercent?: boolean;
  /** 文章页面内容宽度百分比内容 */
  versionArticlePercent?: string;
  /** 图片尺寸自定义类型 0 1 2 */
  zoomImageType?: EZoomImageType;
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
  /** 列表更多按钮固定至题目右侧 */
  fixedListItemMore?: boolean;
  /** 关注列表高亮原创内容 */
  highlightOriginal?: boolean;
  /** 关注列表高亮原创内容背景色 */
  backgroundHighlightOriginal?: string;
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
  linkShopping?: ELinkShopping;
  /** 列表标题文字大小 */
  fontSizeForListTitle?: string;
  /** 回答标题文字大小 */
  fontSizeForAnswerTitle?: string;
  /** 文章标题文字大小 */
  fontSizeForArticleTitle?: string;
  /** 列表内容标准文字大小 */
  fontSizeForList?: string;
  /** 回答内容标准文字大小 */
  fontSizeForAnswer?: string;
  /** 文章内容标准文字大小 */
  fontSizeForArticle?: string;
  /** 内容行高 */
  contentLineHeight?: string;
  /** 列表视频回答内容尺寸 */
  zoomListVideoType?: EZoomListVideoType;
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
  // /** 回答操作 - 赞同按钮仅显示赞同数 */
  // justVoteNum?: boolean;
  // /** 回答操作 - 评论按钮仅显示评论数 */
  // justCommitNum?: boolean;
  /** 操作栏仅显示数字和图标 */
  justNumberInAction?: boolean;
  /** 内容顶部是否显示赞同数 */
  topVote?: boolean;
  /** 文档或回答顶部显示导出当前内容/回答按钮 */
  topExportContent?: boolean;
  // /** 回答内容中的视频回答替换为视频链接 */
  // videoUseLink?: boolean;
  /** 弹窗宽度匹配相应页面 */
  commitModalSizeSameVersion?: boolean;
  /** 推荐列表显示「直达问题」按钮 */
  listOutputToQuestion?: boolean;
  /** 用户主页内容发布、修改时间置顶 */
  userHomeContentTimeTop?: boolean;
  /** 一键获取回答链接 */
  copyAnswerLink?: boolean;
  /** 时间戳 */
  t?: number;
  // /** 去除热词点击搜索 */
  // contentRemoveKeywordSearch?: boolean;
  /** 去除浏览器标签上XX条私信/未读消息的提示 */
  globalTitleRemoveMessage?: boolean;
  /** 图片最大高度限制 */
  zoomImageHeight?: EZoomImageHeight;
  /** 图片最大高度限制数 */
  zoomImageHeightSize?: string;
  /** 推荐列表高性能模式 */
  highPerformanceRecommend?: boolean;
  /** 回答页高性能模式 */
  highPerformanceAnswer?: boolean;
  /** 评论图片预览不超出页面 */
  commentImageFullPage?: boolean;
  /** 取消评论输入框自动聚焦 */
  cancelCommentAutoFocus?: boolean;
  /** 键盘ESC键关闭评论弹窗 */
  keyEscCloseCommentDialog?: boolean;
  /** 替换知乎直达为搜索 */
  replaceZhidaToSearch?: EReplaceZhidaToSearch;
  /** 点击空白处关闭评论弹窗 */
  clickMarkCloseCommentDialog?: boolean;
  /** 用户主页宽度 */
  versionUserHome?: string;
  /** 用户主页宽度使用百分比 */
  versionUserHomeIsPercent?: boolean;
  /** 用户主页宽度百分比 */
  versionUserHomePercent?: string;
  /** 收藏夹宽度 */
  versionCollection?: string;
  /** 收藏夹宽度使用百分比 */
  versionCollectionIsPercent?: boolean;
  /** 收藏夹宽度百分比 */
  versionCollectionPercent?: string;
  /** 回答和文章中的视频显示方式 */
  videoInAnswerArticle?: EVideoInAnswerArticle;
  /** 用户主页 - 动态、回答、文章收起/展开状态 */
  homeContentOpen?: EHomeContentOpen;
}

/** 缓存浏览历史记录 */
export interface IPfHistory {
  list: string[];
  view: string[];
}

export type IKeyofHistory = keyof IPfHistory;
