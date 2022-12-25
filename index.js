// ==UserScript==
// @name         知乎修改器✈持续更新✈努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  页面模块可配置化|列表种类和关键词强过滤内容，关键词过滤后自动调用“不感兴趣”的接口，防止在其他设备上出现同样内容|视频一键下载|回答内容按照点赞数和评论数排序|设置自动收起所有长回答或自动展开所有回答|移除登录弹窗|设置过滤故事档案局和盐选科普回答等知乎官方账号回答|首页切换模块，发现切换模块、个人中心、搜素栏可悬浮并自定义位置|夜间模式开关及背景色修改|收藏夹导出为PDF|隐藏知乎热搜，体验纯净搜索|列表添加标签种类|去除广告|设置购买链接显示方式|外链直接打开|屏蔽用户回答|更多功能请在插件里体验...
// @compatible   edge Violentmonkey
// @compatible   edge Tampermonkey
// @compatible   chrome Violentmonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Violentmonkey
// @compatible   firefox Tampermonkey
// @author       super pufferfish
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_log
// @grant        GM_download
// @run-at       document-start
// ==/UserScript==

/** 获取元素 */
const dom = (n) => document.querySelector(n);
/** 使用 Id 获取元素 */
const domById = (id) => document.getElementById(id);
/** 获取所有元素 */
const domA = (n) => document.querySelectorAll(n);
/** 创建元素 */
const domC = (name, attrObjs) => {
  const element = document.createElement(name);
  Object.keys(attrObjs).forEach((key) => {
    element[key] = attrObjs[key];
  });
  return element;
};
/** 查找父级元素 */
const domP = (element, attrName, attrValue) => {
  const elementParent = element.parentElement;
  if (!attrName || !attrValue) {
    return elementParent;
  }
  if (elementParent === document.body) {
    return undefined;
  }
  const attrValueList = (elementParent.getAttribute(attrName) || '').split(' ');
  return attrValueList.includes(attrValue) ? elementParent : domP(elementParent, attrName, attrValue);
};

const fnLog = (str) => console.log('「知乎修改器」', str);

/** 背景色设置 */
const BACKGROUND_CONFIG = {
  '#ffffff': { name: '默认', opacity: '' },
  '#ffe4c4': { name: '护眼红', opacity: '#fff4e7' },
  '#FAF9DE': { name: '杏仁黄', opacity: '#fdfdf2' },
  '#cce8cf': { name: '青草绿', opacity: '#e5f1e7' },
  '#EAEAEF': { name: '极光灰', opacity: '#f3f3f5' },
  '#E9EBFE': { name: '葛巾紫', opacity: '#f2f3fb' },
};

const HTML_HOOTS = ['www.zhihu.com', 'zhuanlan.zhihu.com'];

/** 设置弹窗 */
const ID_DIALOG = 'CTZ_DIALOG_MAIN';
/** 展示按钮 */
const ID_OPEN_BUTTON = 'CTZ_OPEN_BUTTON';
/** 插入的元素顶层 ID */
const ID_MAIN = 'CTZ_MAIN';
/** 默认 样式 ID */
const ID_STYLE = 'CTZ_STYLE';
/** 背景色 样式 ID */
const ID_STYLE_BG = 'CTZ_STYLE_BACKGROUND';
/** 自定义样式 样式 ID */
const ID_STYLE_CUSTOM = 'CTZ_STYLE_CUSTOM';
/** 隐藏元素模块的 样式 ID */
const ID_STYLE_HIDDEN = 'CTZ_STYLE_HIDDEN';
/** 弹窗关闭按钮 ID */
const ID_CLOSE = 'CTZ_CLOSE_DIALOG';
/** 背景色元素 ID */
const ID_BG = 'CTZ_BACKGROUND';
/** 隐藏元素模块 ID */
const ID_BLOCK_HIDDEN = 'CTZ_SET_HIDDEN';
/** 屏蔽内容模块 ID */
const ID_BLOCK_FILTER = 'CTZ_SET_FILTER';
/** 屏蔽词 ID */
const ID_FILTER_WORDS = 'CTZ_FILTER_WORDS';

/** INPUT 元素类名 */
const CLASS_INPUT = 'ctz-i';
/** BUTTON 元素类名 */
const CLASS_BUTTON = 'ctz-button';

/** 回答收起展开插入的类名 */
const OB_CLASS_FOLD = {
  on: 'ctz-fold-open',
  off: 'ctz-fold-close',
};

/** 不感兴趣接口 */
const API_NOT_INTERESTED = '/api/v3/feed/topstory/uninterestv2';

/** 底部跳转链接 */
const HREF_LIST = [
  {
    name: 'Github⭐',
    href: 'https://github.com/superPufferfish/custom-zhihu',
  },
  {
    name: 'GreasyFork',
    href: 'https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8',
  },
];

/** 隐藏内容列表 */
const HIDDEN_LIST = [];

/** 隐藏内容模块默认配置 */
const CONFIG_HIDDEN_DEFAULT = {
  hiddenAnswerRightFooter: true, // 回答页面右侧内容
  hiddenFixedActions: false, // 回答下方悬浮操作条
  hiddenLogo: false, // logo
  hiddenHeader: false, // header
  hiddenHeaderScroll: false, // 顶部滚动header
  hiddenItemActions: false, // 列表回答操作
  hiddenAnswerText: false, // 回答操作文字
  hiddenQuestionShare: false, // 问题分享
  hiddenQuestionTag: false, // 问题话题
  hiddenQuestionActions: false, // 问题操作栏
  hiddenReward: false, // 赞赏按钮
  hiddenZhuanlanTag: false, // 专栏关联话题
  hiddenListImg: false, // 问题列表图片
  hiddenReadMoreText: true, // 阅读全文文字
  hiddenAD: true, // 广告
  hiddenAnswerRights: false, // 收藏喜欢举报按钮
  hiddenAnswerRightsText: false, // 收藏喜欢举报按钮文字
  hiddenAnswers: false, // 问题列表回答内容
  hiddenZhuanlanActions: false, // 专栏下方操作条
  hiddenZhuanlanTitleImage: false, // 专栏标题图片
  hiddenHotItemMetrics: false, // 热门热度值
  hiddenHotItemIndex: false, // 热门排序
  hiddenHotItemLabel: false, // 热门"新"元素
  hiddenDetailAvatar: false, // 详情回答人头像
  hiddenDetailBadge: false, // 详情回答人简介
  hiddenDetailVoters: false, // 详情回答人下赞同数
  hiddenDetailName: false, // 详情回答人姓名
  hiddenDetailFollow: true, // 详情回答人关注按钮
  hiddenHomeTab: false, // 首页问题列表切换模块
  hiddenQuestionSide: false, // 问题关注和被浏览数
  hiddenQuestionFollowing: false, // 关注问题按钮
  hiddenQuestionAnswer: false, // 写回答按钮
  hiddenQuestionInvite: false, // 邀请回答按钮
  hiddenSearchBoxTopSearch: false, // 搜索栏知乎热搜
  hiddenSearchPageTopSearch: false, // 搜索页知乎热搜
  hiddenSearchPageFooter: false, // 搜索页知乎指南
  hiddenZhuanlanShare: false, // 专栏悬浮分享按钮
  hiddenZhuanlanVoters: false, // 专栏悬浮赞同按钮
  hiddenListAnswerInPerson: false, // 列表[亲自答]标签
  hiddenFollowAction: false, // 关注列表关注人操作栏
  hiddenFollowChooseUser: false, // 关注列表用户信息
  hiddenAnswerRightFooterAnswerAuthor: false, // 信息栏关于作者
  hiddenAnswerRightFooterFavorites: false, // 信息栏被收藏次数
  hiddenAnswerRightFooterRelatedQuestions: false, // 信息栏相关问题
  hiddenAnswerRightFooterContentList: false, // 信息栏相关推荐
  hiddenAnswerRightFooterFooter: false, // 信息栏知乎指南
  hidden618HongBao: true, // 618红包链接（临时补充）
  hiddenZhuanlanFollowButton: false, // 文章作者关注按钮
  hiddenZhuanlanAvatarWrapper: false, // 文章作者头像
  hiddenZhuanlanAuthorInfoHead: false, // 文章作者姓名
  hiddenZhuanlanAuthorInfoDetail: false, // 文章作者简介
  hiddenQuestionSpecial: false, // 详情顶部专题收录标签
  hiddenListVideoContent: false, // 列表视频回答的内容
};

/** 屏蔽内容模块默认配置 */
const CONFIG_FILTER_DEFAULT = {
  removeStoryAnswer: true, // 故事档案局回答
  removeYanxuanAnswer: true, // 盐选科普回答
  removeYanxuanRecommend: true, // 盐选推荐
  removeYanxuanCPRecommend: true, // 盐选测评室
  removeFromYanxuan: true, // 选自盐选专栏的回答
  removeZhihuOfficial: false, // 知乎官方账号回答

  removeFollowVoteAnswer: false, // 关注人赞同回答
  removeFollowVoteArticle: false, // 关注人赞同文章
  removeFollowFQuestion: false, // 关注人关注问题
  removeBlockUserContent: true, // 不再显示「已屏蔽」用户发布的内容
  removeUnrealAnswer: false, // 带有虚构内容的回答

  removeBlockUserContentList: [], // 已屏蔽用户列表

  removeItemAboutAD: false, // 商业推广
  removeItemAboutArticle: false, // 文章
  removeItemAboutVideo: false, // 视频
  removeItemQuestionAsk: false, // 列表提问
  removeLessVote: false, // 关注列表过滤低于以下赞的内容
  lessVoteNumber: 100, // 关注列表过滤低于以下赞的内容
  removeLessVoteDetail: false, // 回答低赞内容屏蔽
  lessVoteNumberDetail: 100, // 回答详情屏蔽以下赞的内容
};

/** 屏蔽关注列表关注人操作 */
const FILTER_FOLLOWER_OPERATE = [
  { key: 'removeFollowVoteAnswer', rep: '赞同了回答' },
  { key: 'removeFollowVoteArticle', rep: '赞同了文章' },
  { key: 'removeFollowFQuestion', rep: '关注了问题' },
];

/** 顶部菜单哈希 */
const MENU_IDS = ['#CTZ_SET_BASIS', '#CTZ_SET_LIST', '#CTZ_SET_ANSWER', '#CTZ_SET_ARTICLE'];

/** 设置指向 */
const SET_DIRECTION = {
  /** 基础设置 */
  CTZ_SET_BASIS: {
    /** 通用模块隐藏 */
    _HIDDEN: [
      [{ value: 'hiddenAD', label: '广告' }],
      [
        { value: 'hiddenLogo', label: 'logo' },
        { value: 'hiddenHeader', label: '顶部悬浮模块' },
        { value: 'hiddenHeaderScroll', label: '滚动顶部悬浮模块/问题名称' },
      ],
      [
        { value: 'hiddenAnswerRights', label: '收藏/喜欢/举报' },
        { value: 'hiddenAnswerRightsText', label: '收藏/喜欢/举报 文字' },
      ],
      [
        { value: 'hiddenSearchBoxTopSearch', label: '搜索栏知乎热搜' },
        { value: 'hiddenSearchPageTopSearch', label: '搜索页知乎热搜' },
        { value: 'hiddenSearchPageFooter', label: '搜索页知乎指南' },
      ],
    ],
  },
  /** 首页列表设置 */
  CTZ_SET_LIST: {
    /** 首页列表设置 - 隐藏模块 */
    _HIDDEN: [
      [
        { value: 'hiddenHotItemIndex', label: '热门排序编号' },
        { value: 'hiddenHotItemLabel', label: '热门"新"元素' },
        { value: 'hiddenHotItemMetrics', label: '热门热度值' },
      ],
      [
        { value: 'hiddenAnswers', label: '列表回答内容' },
        { value: 'hiddenListVideoContent', label: '列表视频回答的内容' },
        { value: 'hiddenItemActions', label: '列表回答操作' },
        { value: 'hiddenAnswerText', label: '回答操作文字' },
        { value: 'hiddenListImg', label: '列表图片' },
        { value: 'hiddenReadMoreText', label: '问题列表阅读全文文字' },
        { value: 'hiddenListAnswerInPerson', label: '列表「亲自答」标签' },
      ],
      [
        { value: 'hiddenFollowAction', label: '关注列表关注人操作栏' },
        { value: 'hiddenFollowChooseUser', label: '关注列表用户信息' },
      ],
    ],
  },
  /** 回答详情设置 */
  CTZ_SET_ANSWER: {
    /** 回答详情设置 - 隐藏模块 */
    _HIDDEN: [
      [
        { value: 'hiddenDetailAvatar', label: '详情回答人头像' },
        { value: 'hiddenDetailName', label: '详情回答人姓名' },
        { value: 'hiddenDetailBadge', label: '详情回答人简介' },
        { value: 'hiddenDetailFollow', label: '详情回答人关注按钮' },
        { value: 'hiddenDetailVoters', label: '详情回答人下赞同数' },
        { value: 'hiddenReward', label: '赞赏按钮' },
        { value: 'hiddenQuestionSide', label: '问题关注和被浏览数' },
        { value: 'hiddenFixedActions', label: '回答悬浮操作条' },
        { value: 'hiddenQuestionTag', label: '问题话题' },
        { value: 'hiddenQuestionShare', label: '问题分享' },
        { value: 'hiddenQuestionActions', label: '问题详情操作栏' },
        { value: 'hiddenQuestionFollowing', label: '关注问题按钮' },
        { value: 'hiddenQuestionAnswer', label: '写回答按钮' },
        { value: 'hiddenQuestionInvite', label: '邀请回答按钮' },
        { value: 'hiddenQuestionSpecial', label: '详情顶部专题收录标签' },
        { value: 'hidden618HongBao', label: '618红包链接' },
      ],
      [
        { value: 'hiddenAnswerRightFooter', label: '详情右侧信息栏' },
        { value: 'hiddenAnswerRightFooterAnswerAuthor', label: '信息栏关于作者' },
        { value: 'hiddenAnswerRightFooterFavorites', label: '信息栏被收藏次数' },
        { value: 'hiddenAnswerRightFooterRelatedQuestions', label: '信息栏相关问题' },
        { value: 'hiddenAnswerRightFooterContentList', label: '信息栏相关推荐' },
        { value: 'hiddenAnswerRightFooterFooter', label: '信息栏知乎指南' },
      ],
    ],
  },
  /** 文章专栏设置 */
  CTZ_SET_ARTICLE: {
    /** 文章专栏设置 - 隐藏模块 */
    _HIDDEN: [
      [
        { value: 'hiddenZhuanlanTag', label: '文章关联话题' },
        { value: 'hiddenZhuanlanActions', label: '文章操作条' },
        { value: 'hiddenZhuanlanTitleImage', label: '文章标题图片' },
        { value: 'hiddenZhuanlanShare', label: '文章悬浮分享按钮' },
        { value: 'hiddenZhuanlanVoters', label: '文章悬浮赞同按钮' },
        { value: 'hiddenZhuanlanAvatarWrapper', label: '文章作者头像' },
        { value: 'hiddenZhuanlanAuthorInfoHead', label: '文章作者姓名' },
        { value: 'hiddenZhuanlanAuthorInfoDetail', label: '文章作者简介' },
        { value: 'hiddenZhuanlanFollowButton', label: '文章作者关注按钮' },
      ],
    ],
  },
};

(function () {
  'use strict';
  const INNER_HTML = ``;
  const INNER_CSS = ``;

  let pfConfig = {
    ...CONFIG_HIDDEN_DEFAULT,
    ...CONFIG_FILTER_DEFAULT,
    answerOpen: '', // 知乎默认 | 自动展开所有回答 | 默认收起所有长回答

    chooseHeart: 'system', // 设置版心的方式
    versionHeart: '1200', // 版心宽度
    versionHeartSelf: '1200', // 自定义版心宽度
    versionHeartZhuanlan: '1000', // 文章、专栏宽度
    positionCreation: 'right',
    positionCreationIndex: '1',
    positionTable: 'right',
    positionTableIndex: '2',
    positionFavorites: 'left',
    positionFavoritesIndex: '3',
    positionFooter: 'right',
    positionFooterIndex: '4',
    stickyLeft: false, // 首页左侧栏是否固定
    stickyRight: false, // 首页右侧栏是否固定
    zoomAnswerImage: '', // 默认 原图
    titleIco: '', // 网页标题logo图
    title: '', // 网页标题
    colorBackground: '#ffffff', // 背景色
    customizeCss: '',
    questionTitleTag: true, // 内容标题添加类别标签
    fixedListItemMore: false, // 列表更多按钮固定至题目右侧
    shoppingLink: 'default', // 购物链接显示设置
    answerVideoLink: 'default', // 回答视频显示设置
    filterKeywords: [],
    showGIFinDialog: true, // 动图弹窗显示
    zoomAnswerText: false, // 回答操作文字缩放
    isUseThemeDark: false, // 是否开启夜间模式
    notificationAboutFilter: false, // 屏蔽内容后显示通知提醒框
    questionCreatedAndModifiedTime: true, // 问题显示创建和最后修改时间
    highlightOriginal: true, // 关注列表高亮原创内容
    listOutPutNotInterested: false, // 推荐列表外置[不感兴趣]按钮
    highlightListItem: false, // 列表内容点击高亮边框
    articleCreateTimeToTop: true, // 文章发布时间置顶
    listItemCreatedAndModifiedTime: true, // 列表内容显示发布与最后修改时间
    answerItemCreatedAndModifiedTime: true, // 回答列表显示创建与最后修改时间
    indexPathnameRedirect: 'n', // 首页重定向 follow 关注, hot 热榜
    showBlockUser: true, // 列表用户名后显示「屏蔽用户」按钮

    // 悬浮模块 start ----------------
    suspensionHomeTab: false, // 问题列表切换
    suspensionHomeTabPo: 'left: 20px; top: 100px;', // 定位
    suspensionHomeTabFixed: true,
    suspensionHomeTabStyle: 'transparent', // 样式
    suspensionFind: false, // 顶部发现模块
    suspensionFindPo: 'left: 10px; top: 380px;',
    suspensionFindFixed: true,
    suspensionFindStyle: 'transparent',
    suspensionSearch: false, // 搜索栏
    suspensionSearchPo: 'left: 200px; top: 100px;',
    suspensionSearchFixed: true,
    suspensionUser: false, // 个人中心
    suspensionUserPo: 'right: 60px; top: 100px;',
    suspensionUserFixed: true,
    suspensionPickUp: true, // 长回答和列表收起按钮
    previewOpenGIF: true, // 动图弹窗显示
    toHomeButton: true, // 页面右下停靠返回主页按钮
    toHomeButtonZhuanlan: 'zhihu', // toHomeButtonZhuanlan
    // 悬浮模块 end -----------------
  };

  /** 脚本内配置缓存 */
  const storageConfig = {
    cachePfConfig: {}, // 缓存初始配置
    cacheTitle: '', // 缓存页面原标题
    // bodySize: 0,
    // bodySizePrev: 0,
    fetchHeaders: {}, // fetch 的 headers 内容, 获取下来以供使用
    xZst81: '',
    cssDark: '', // 黑暗模式缓存
  };

  /** 启用知乎默认的黑暗模式 */
  const onUseThemeDark = (isUse) => {
    dom('html').setAttribute('data-theme', isUse ? 'dark' : 'light');
  };

  /** 注入样式文件的方法 */
  const initDomStyle = (id, innerHTML) => {
    const element = domById(id);
    element
      ? (element.innerHTML = innerHTML)
      : document.head.appendChild(
          domC('style', {
            id,
            type: 'text/css',
            innerHTML,
          })
        );
  };

  /** 修改页面背景的 css */
  const myBackground = {
    init: function () {
      const innerHTML = this.change(pfConfig.colorBackground);
      initDomStyle(ID_STYLE_BG, innerHTML);
    },
    change: function (bg) {
      return pfConfig.isUseThemeDark
        ? storageConfig.cssDark || this.dark()
        : bg !== '#ffffff'
        ? this.normal(bg) + this.normalAppHeader(bg)
        : '.GlobalSideBar-navList{background: #fff}';
    },
    dark: () => {
      // 夜间模式
      const background121212 =
        `.css-ul9l2m,.css-mq2czy,.css-1da4iq8,.css-oqge09,.css-lpo24q,.css-16zrry9,.css-u8y4hj` +
        `,.css-1yq3jl6,.css-mzh2tk,.css-6mdg56,.CreatorRecruitFooter--fix,body .Recruit-buttonFix-placeholder` +
        `,.css-ovbogu,.css-1v840mj,.css-huwkhm,.css-akuk2k,.css-ygii7h,.css-1h84h63,.css-1bwzp6r,.css-w215gm` +
        `,.css-1117lk0:hover,.zhi,.Modal-modal-wf58,.css-1j5d3ll,.GlobalSideBar-navList` +
        `,.css-iebf30,.css-1qjzmdv,.AnswerForm-footer,.css-g3xs10,.css-jlyj5p,.ContentItem-rightButton` +
        `,.css-12yl4eo,.css-1ggwojn,.css-xqep55,.css-mjg7l1,.css-q2yfd6,.css-1ulkprw` +
        `{background: #121212!important;}`;
      const background333 =
        `.css-1vwmxb4:hover,.css-1xegbra,.css-xevy9w tbody tr:nth-of-type(odd)` +
        `,.css-1stnbni:hover,.css-5abu0r,.css-n7efg0,.css-ssvpr2,.css-m9gn5f,.FeedbackForm-inputBox-15yJ` +
        `,.FeedbackForm-canvasContainer-mrde,._Invite_container_30SP,.utils-frostedGlassEffect-2unM` +
        `,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448` +
        `,.PubIndex-CategoriesHeader,.AppHeader,.css-r9mkgf,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1gnqr8i,#PF-BLOCK-LIST` +
        `,.css-16eulm,.index-root-3h4H5,.css-106u01g,.css-c29erj` +
        `{background:#333333!important;}`;
      const backgroundTransparent =
        `.Community-ContentLayout,._AccountSettings_accountLine_3HJS,.css-1gfpqrv,.css-13dk2dh` +
        `,.css-u6lvao,.css-u6lvao:before,.css-u6lvao:after` +
        `{background: transparent!important;}`;
      const colorWhite =
        `.ctz-footer` +
        `,.css-1204lgo,.css-1ng3oge,.css-5abu0r,.css-p52k8h,.css-1dpmqsl,.css-1myqwel` +
        `,.TopNavBar-inner-baxks .TopNavBar-tab-hBAaU a,.css-1ykn8va` +
        `,.TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f,.css-11nn00q` +
        `,.TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7,.css-1117lk0,.css-m9gn5f` +
        `,.css-oqge09,.css-8u7moq,.css-k0fmhp,css-bc6idi,.css-nsw6sf,.css-25wprl,.css-294ohd,.css-1nmddht` +
        `,.css-1c4skpi,.zu-main-content,.zu-main-sidebar,.FeedbackForm-form-1uUg,.CopyrightSettings h1` +
        `,.CopyrightSettings h2,.CopyrightSettings,.LiveItem-title-2qes,.GlobalSidebar-introItem-24PB h3` +
        `,.Card-card-2K6v,.LiveItem-description-Tliw,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448` +
        `,.GlobalSidebar-appDownloadTip-33iw,.css-pgcb4h,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-jwse5c,.css-hd7egx` +
        `,.css-1zcaix,.css-4a3k6y,.css-eonief,.css-dy7bva,.css-sthon2,.css-teb1rp,.css-uq88u1,.css-nymych` +
        `,.css-jt1vdv,.css-tfs9zi,.ZVideo-body .UserLink,.ZVideo-body .CommentRichText,.css-1m2h1o9,.css-16p5ii9` +
        `,.css-kkim14,.css-1mx84bz,.RichContent-collapsedText,.ContentItem-arrowIcon,.css-74475r` +
        `,.css-1l1sy07,.index-root-3h4H5,.css-1bbvash,.css-1stnbni:hover,.css-tad50r` +
        `{color: #fff!important}`;
      const borderColor121212 = `.MenuBar-root-rQeFm{border-color: #121212!important;}`;
      const color333 = `css-1x3upj1,#CTZ_BACKGROUND>label>div,.ctz-content-left>a:hover,.ctz-button{color: #333!important}`;
      const color999 = `.css-o7lu8j{color: #999!important}`;

      // 添加 html[data-theme=dark] 前缀
      const addPrefix = (cssStr) => {
        const darkPrefix = 'html[data-theme=dark]';
        return cssStr
          .split(',')
          .map((i) => `${darkPrefix} ${i}`)
          .join(',');
      };

      const cssDarkStr =
        `#${ID_DIALOG}{background: #121212!important;border: 1px solid #eee}` +
        addPrefix(background121212 + colorWhite + color333 + color999 + background333 + backgroundTransparent + borderColor121212);

      // 缓存黑暗模式数据
      storageConfig.cssDark = cssDarkStr;
      fnLog('黑暗模式初始化完成');
      return cssDarkStr;
    },
    normal: (bg) => {
      // 普通背景色
      const background =
        `body,.Post-content,.HotList,.HotListNavEditPad,.ColumnPageHeader,.ZVideoToolbar` +
        `,.position-suspensionSearch.focus,.Modal-modal-wf58,.Community-ContentLayout,.App-root-8rX7N` +
        `,.MenuBar-root-rQeFm,.TopNavBar-fixMode-4nQmh,.App-active-dPFhH,.CategorySection-categoryList-mrt3Z` +
        `,.zhuanlan .Post-content .ContentItem-actions,.zhuanlan .ContentItem-actions` +
        `{background-color: ${bg}!important;}`;
      const backgroundOpacity =
        `#${ID_DIALOG}` +
        `,#${ID_DIALOG} select,#${ID_DIALOG} input,#${ID_DIALOG} textarea,#${ID_BLOCK_FILTER}` +
        `,.QuestionHeader,.Card,.HotItem,.Recommendations-Main,.GlobalSideBar-navList` +
        `,.CommentsV2-withPagination,.QuestionHeader-footer,.HoverCard,.ContentItem-actions` +
        `,.MoreAnswers .List-headerText,.Topbar,.CommentsV2-footer,.Select-plainButton` +
        `,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreSpecialCard` +
        `,.ExploreColumnCard,.ExploreHomePage-ContentSection-moreButton a,.QuestionWaiting-types` +
        `,.AutoInviteItem-wrapper--desktop,.Popover-content,.Notifications-footer,.SettingsFAQ` +
        `,.Popover-arrow:after,.Messages-footer,.Modal-inner,.RichContent-actions,.KfeCollection-FeedBlockSetting` +
        `,.CommentListV2-header-divider,.Input-wrapper:not(.Input-wrapper--grey),.TopstoryItem .ZVideoToolbar,.SearchTabs,.Topic-bar` +
        `,.VotableTopicCard,textarea.FeedbackForm-inputBox-15yJ,.FeedbackForm-canvasContainer-mrde` +
        `,.css-mq2czy,.css-lpo24q,.css-16zrry9,.css-1v840mj,.css-ovbogu,.css-1h84h63,.css-u8y4hj` +
        `,.css-1bwzp6r,.css-w215gm,.InputLike,.AnswerForm-footer,.Editable-toolbar,.Chat,.css-ul9l2m` +
        `,.Balance-Main .Tabs,.Community,.Report-list tr:nth-child(2n),.Report-Pagination,.Report-list,.Report-header th` +
        `,._Invite_container_30SP,.css-ssvpr2,.css-1p1lrh0,.zu-main,.utils-frostedGlassEffect-2unM` +
        `,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448` +
        `,.PubIndex-CategoriesHeader,.css-r9mkgf,.CornerButton,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z` +
        `,.WikiLandingHeader,.WikiLanding,.WikiLandingItemCard,.WikiLandingEntryCard,.SideNavs-navContainer-6VkAT` +
        `,.App-root-cPFwn,.TopNavs-root-rwAr7,.App-root-qzkuH,.App-actionTrigger-cCyD7,.ProductTrigger-root-amaSi` +
        `,.App-infiniteContainer-nrxGj,.ActionTrigger-content-dPn6H,.App-card-pkbhv,.css-zvnmar,.Login-options` +
        `,.SignFlowInput-errorMask,.ColumnHomeColumnCard,.KfeCollection-PcCollegeCard-root,.KfeCollection-PcCollegeCard-wrapper` +
        `,.css-1j5d3ll,.css-iebf30,.css-1qjzmdv,.AnswerForm-footer,.css-g3xs10,.css-jlyj5p,.CommentEditorV2-inputUpload` +
        `,.css-805ti0,.css-10fqe38,.css-n9os37,.css-sdgtgb,.css-f955pw,.css-6tr06j,.css-pslzz3,.css-10rrwst` +
        `,.css-mjg7l1,.css-1ulkprw,.css-1k8sxfm,.css-a9sbyu,.CreatorIndex-BottomBox-Item,.css-1r9j229,.css-wgpue5` +
        `,.css-1clwviw,.css-ndqbqd,.css-19v79p5,.css-f7rzgf,.css-106u01g,.css-c29erj,.css-tpyajk` +
        `{background-color:${BACKGROUND_CONFIG[bg].opacity}!important;background:${BACKGROUND_CONFIG[bg].opacity}!important;}`;
      const backgroundTransparent =
        `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper` +
        `{background-color: transparent!important;}`;
      const borderColor = `.MenuBar-root-rQeFm{border-color: ${bg}!important;}`;
      return background + backgroundOpacity + backgroundTransparent + borderColor;
    },
    normalAppHeader: (bg) => {
      // header 颜色变化
      const elementHC = dom('.AppHeader') && dom('.AppHeader').classList;
      const haveTopAD = dom('.Topstory>div:not(.Topstory-container)') && dom('.Topstory>div:not(.Topstory-container)').childElementCount;
      const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : '';
      return (
        `${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : '.AppHeader'}` +
        `{background-color:${BACKGROUND_CONFIG[bg].opacity}!important;background:${BACKGROUND_CONFIG[bg].opacity}!important;}`
      );
    },
  };

  /** 隐藏元素的 css */
  const myHidden = {
    init: function () {
      initDomStyle(ID_STYLE_HIDDEN, this.change() || '');
    },
    change: () => {
      // 隐藏的模块
      return (
        (pfConfig.hiddenLogo
          ? `.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"]` +
            ',.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo' +
            `{display: none!important;}`
          : '') +
        (pfConfig.hiddenHeader
          ? `.AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}`
          : '') +
        (pfConfig.hiddenHeaderScroll ? `.AppHeader.is-fixed{display:none!important;}` : '') +
        (pfConfig.hiddenItemActions
          ? `.Topstory-container .ContentItem-actions>span,.Topstory-container .ContentItem-actions>button` +
            `,.Topstory-container .ContentItem-actions>div,.Topstory-container .ContentItem-actions>a` +
            `,.TopstoryQuestionAskItem-writeAnswerButton,.TopstoryQuestionAskItem-hint` +
            `{visibility:hidden!important;height:0!important;padding:0!important;}` +
            `.TopstoryQuestionAskItem-hint{margin: 0!important;}` +
            `.ContentItem-actions{padding-top: 0 !important;}` +
            `.SearchResult-Card .ContentItem-actions{display: none;}`
          : '') +
        (pfConfig.hiddenAnswerText
          ? `.ContentItem-actions{padding: 0 20px!important;line-height: 38px!important;}` +
            `.ContentItem-action,.ContentItem-action button,.ContentItem-actions button` +
            `{font-size: 0!important;padding: 0!important;background: none!important;line-height:inherit!important;}` +
            `.ContentItem-action span,.ContentItem-actions button span{font-size: 16px!important;}` +
            `.ContentItem-action svg,.ContentItem-actions svg{width: 16px!important;height:16px!important;}` +
            `.VoteButton{color: #8590a6!important; }` +
            `.VoteButton.is-active{color: #0066ff!important;}` +
            `.ContentItem-action{margin-left:8px!important;}` +
            `.Search-questionFollowButton{display: none}`
          : '') +
        (pfConfig.hiddenQuestionTag ? '.QuestionHeader-tags{display: none!important;}' : '') +
        (pfConfig.hiddenQuestionShare ? '.zhihu .Popover.ShareMenu{display: none!important;}' : '') +
        (pfConfig.hiddenQuestionActions ? '.QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}' : '') +
        (pfConfig.hiddenReward ? '.Reward{display: none!important;}' : '') +
        (pfConfig.hiddenZhuanlanTag ? '.Post-topicsAndReviewer{display: none!important;}' : '') +
        (pfConfig.hiddenListImg
          ? `.RichContent-cover,.HotItem-img{display:none!important;}` + `.HotItem-metrics--bottom{position: initial!important;}`
          : '') +
        (pfConfig.hiddenReadMoreText ? '.ContentItem-more{font-size:0!important;}' : '') +
        (pfConfig.hiddenAD ? '.TopstoryItem--advertCard,.Pc-card,.Pc-word{display: none!important;}' : '') +
        (pfConfig.hiddenAnswerRights
          ? `.ContentItem-actions .ShareMenu ~ button.ContentItem-action{display: none;}` +
            `.ContentItem-rightButton{display:block!important;}`
          : '') +
        (pfConfig.hiddenAnswerRightsText
          ? `.ContentItem-actions .ShareMenu ~ .ContentItem-action{font-size: 0!important;}` +
            `.ContentItem-actions .ShareMenu ~ .ContentItem-action>span{font-size:12px!important;}`
          : '') +
        (pfConfig.hiddenAnswers
          ? `.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine` +
            `,.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt` +
            `,.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer` +
            `{display: none;}`
          : '') +
        (pfConfig.hiddenListVideoContent
          ? `.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer` +
            `,.Topstory-recommend .ZVideoItem .RichContent` +
            `{display: none;}`
          : '') +
        (pfConfig.hiddenZhuanlanActions ? '.RichContent-actions.is-fixed>.ContentItem-actions{display: none;}' : '') +
        (pfConfig.hiddenZhuanlanTitleImage ? '.TitleImage,.css-78p1r9{display: none;!important}' : '') +
        (pfConfig.hiddenFixedActions
          ? `.ContentItem .RichContent-actions.is-fixed, .List-item .RichContent-actions.is-fixed` + `{visibility: hidden!important;}`
          : '') +
        (pfConfig.hiddenHotItemMetrics ? '.HotItem-content .HotItem-metrics{display: none;}' : '.HotItem-content {padding-bottom: 24px;}') +
        (pfConfig.hiddenHotItemIndex ? '.HotItem-index{display: none;}.HotItem{padding: 16px!important;}' : '') +
        (pfConfig.hiddenHotItemLabel ? '.HotItem-label{display: none;}' : '') +
        (pfConfig.hiddenDetailAvatar
          ? '.AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}' +
            '.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}'
          : '') +
        (pfConfig.hiddenDetailBadge ? '.AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}' : '') +
        (pfConfig.hiddenDetailVoters ? '.AnswerItem .Voters button{display: none;}' : '') +
        (pfConfig.hiddenDetailName ? '.AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}' : '') +
        (pfConfig.hiddenDetailFollow ? '.AnswerItem .AuthorInfo .FollowButton{display: none;}' : '') +
        (pfConfig.hiddenHomeTab ? '.Topstory-container .TopstoryTabs{display: none!important;}' : '') +
        (pfConfig.hiddenQuestionSide ? '.QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}' : '') +
        (pfConfig.hiddenQuestionFollowing ? '.QuestionHeader .FollowButton{display: none;}' : '') +
        (pfConfig.hiddenQuestionAnswer ? '.QuestionHeader .FollowButton ~ a{display: none;}' : '') +
        (pfConfig.hiddenQuestionInvite ? '.QuestionHeader .QuestionHeaderActions>button:first-child{display: none;}' : '') +
        (pfConfig.hiddenSearchPageTopSearch ? '.Search-container .TopSearch{display: none;}' : '') +
        (pfConfig.hiddenSearchPageFooter ? '.Search-container .Footer{display: none;}' : '') +
        (pfConfig.hiddenSearchPageTopSearch && pfConfig.hiddenSearchPageFooter ? '.SearchSideBar{display: none}' : '') +
        (pfConfig.hiddenSearchBoxTopSearch ? '.SearchBar-noValueMenu .AutoComplete-group:first-child{display:none;}' : '') +
        (pfConfig.hiddenZhuanlanShare ? '.zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}' : '') +
        (pfConfig.hiddenZhuanlanVoters ? '.zhuanlan .Post-SideActions .like{display: none!important;}' : '') +
        (pfConfig.hiddenFollowAction ? '.TopstoryItem-isFollow .FeedSource-firstline{display: none;}' : '') +
        (pfConfig.hiddenFollowChooseUser ? '.TopstoryItem-isFollow .AuthorInfo{display: none;}' : '') +
        (pfConfig.hiddenAnswerRightFooter
          ? '.Question-sideColumn{display: none!important;}.Question-main .Question-mainColumn,.ListShortcut{width: inherit;}'
          : '') +
        (pfConfig.hiddenAnswerRightFooterAnswerAuthor ? '.Question-sideColumn .AnswerAuthor{display: none;}' : '') +
        (pfConfig.hiddenAnswerRightFooterFavorites ? '.Question-sideColumn .AnswerAuthor + .Card{display: none;}' : '') +
        (pfConfig.hiddenAnswerRightFooterRelatedQuestions
          ? '.Question-sideColumn [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}'
          : '') +
        (pfConfig.hiddenAnswerRightFooterContentList
          ? '.Question-sideColumn [data-za-detail-view-path-module="ContentList"]{display: none;}'
          : '') +
        (pfConfig.hiddenAnswerRightFooterFooter ? '.Question-sideColumn .Footer{display: none;}' : '') +
        (pfConfig.hidden618HongBao
          ? '.MCNLinkCard[data-mcn-source="淘宝"],.MCNLinkCard[data-mcn-source="京东"],.MCNLinkCard[data-mcn-source="知乎"]{display:none;}'
          : '') +
        (pfConfig.hiddenZhuanlanFollowButton ? '.zhuanlan .FollowButton{display: none;}' : '') +
        (pfConfig.hiddenZhuanlanAvatarWrapper ? '.zhuanlan .AuthorInfo-avatarWrapper{display: none;}' : '') +
        (pfConfig.hiddenZhuanlanAuthorInfoHead ? '.zhuanlan .AuthorInfo-head{display: none;}' : '') +
        (pfConfig.hiddenZhuanlanAuthorInfoDetail ? '.zhuanlan .AuthorInfo-detail{display: none;}' : '') +
        (pfConfig.hiddenListAnswerInPerson ? '.Topstory-mainColumn .LabelContainer{display: none;}' : '') +
        (pfConfig.hiddenQuestionSpecial ? '.QuestionHeader .LabelContainer-wrapper{display: none;}' : '') +
        ''
      );
    },
  };

  /** 回填数据，供每次打开使用 */
  const echoData = () => {
    const textSameName = {
      title: (e) => (e.value = pfConfig.title || document.title),
      customizeCss: (e) => (e.value = pfConfig['customizeCss']),
    };
    const echoText = (even) => {
      textSameName[even.name] ? textSameName[even.name](even) : (even.value = pfConfig[even.name]);
    };
    const echo = {
      radio: (even) => pfConfig.hasOwnProperty(even.name) && even.value === pfConfig[even.name] && (even.checked = true),
      checkbox: (even) => (even.checked = pfConfig[even.name] || false),
      'select-one': (even) => {
        if (pfConfig[even.name]) {
          for (let i = 0; i < even.length; i++) {
            if (even[i].value === pfConfig[even.name]) {
              even[i].selected = true;
            }
          }
        }
      },
      text: echoText,
      number: echoText,
      range: (even) => {
        const nValue = pfConfig[even.name];
        if (isNaN(+nValue)) {
          // 不存在值则显示拖动条取最小值
          even.value = $(`[name="${even.name}"]`)[0].min;
          return;
        }
        echoText(even);
      },
    };

    domA(`.${CLASS_INPUT}`).forEach((item) => {
      echo[item.type] && echo[item.type](item);
    });

    // domA('.ctz-i-input').forEach((item) => {
    //   echo[item.type] && echo[item.type](item);
    // });

    // const zoomV = pfConfig.zoomAnswerImage;
    // const nValue = isNaN(+zoomV)
    //   ? ZOOM_DEFAULT_OBJ[zoomV]
    //     ? ZOOM_DEFAULT_OBJ[zoomV]
    //     : ''
    //   : zoomV;
    // $('#IMAGE_SIZE')[0].innerText = nValue;
  };

  /** 更改编辑器方法 */
  const fnChanger = async (ev) => {
    // onchange 时只调用 cssVersion 的 name
    const doCssVersion = [
      'versionHeart',
      'versionHeartSelf',
      'versionHeartZhuanlan',
      'suspensionHomeTabStyle',
      'suspensionFindStyle',
      'questionTitleTag',
      'fixedListItemMore',
      'shoppingLink',
      'answerVideoLink',
      'toHomeButton',
      'zoomAnswerText',
      'listOutPutNotInterested',
      'highlightListItem',
    ];
    const { name, value, checked, type } = ev;
    const ob = {
      chooseHeart: () => {
        // onChooseHeart();
        // versionCSS.init();
      },
      // stickyLeft: stickyB.scroll,
      // stickyRight: stickyB.scroll,
      suspensionHomeTab: () => {
        // versionCSS.init();
        // changeSuspensionTab();
      },
      isUseThemeDark: () => {
        // versionCSS.init();
        myBackground.init();
        onUseThemeDark(checked);
        // followingListChanger(true);
      },
      colorBackground: () => {
        myBackground.init();
        // followingListChanger(true);
      },
      // suspensionFind: cacheHeader,
      // suspensionSearch: cacheHeader,
      // suspensionUser: cacheHeader,
      // removeZhihuOfficial: onChangeOfficialRemove,
      // titleIco: changeTitleIco,
      // title: changeTitle,
      // customizeCss: changeCustomCSS,
      // toHomeButtonZhuanlan: onToHomeHref,
      // indexPathnameRedirect: onToHomeHref,
      // answerUnfold: () => answerFoldOrNot('answerUnfold', checked),
      // answerFoldStart: () => answerFoldOrNot('answerFoldStart', checked),
      // showGIFinDialog: previewGIF,
      // questionCreatedAndModifiedTime: addQuestionCreatedAndModifiedTime,
      // highlightOriginal: () => followingListChanger(true),
      // articleCreateTimeToTop: addArticleCreateTimeToTop,
      // zoomAnswerImage: () => {
      //   const nValue = isNaN(+ev.value)
      //     ? ZOOM_DEFAULT_OBJ[ev.value]
      //       ? ZOOM_DEFAULT_OBJ[ev.value]
      //       : ''
      //     : ev.value;
      //   $('#IMAGE_SIZE')[0].innerText = nValue;
      //   versionCSS.init();
      // },
    };

    pfConfig[name] = type === 'checkbox' ? checked : value;
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    if (/^position/.test(name)) {
      // initPositionPage();
      return;
    }

    if (/^hidden/.test(name)) {
      myHidden.init();
      return;
    }
    if (doCssVersion.includes(name)) {
      // versionCSS.init();
      return;
    }

    ob[name] && ob[name]();
  };

  /** 在重置数据时调用 */
  const resetData = () => {
    onInitStyleExtra();
    initData();
    onUseThemeDark(pfConfig.isUseThemeDark);
  };

  /** 自定义样式方法 */
  const myCustomStyle = {
    init: function () {
      const { customizeCss = '' } = pfConfig;
      dom('[name="textStyleCustom"]').value = customizeCss;
      this.change();
    },
    change: () => initDomStyle(ID_STYLE_CUSTOM, pfConfig.customizeCss || ''),
  };

  /** 编辑器按钮点击事件集合 */
  const myButtonOperation = {
    configExport: async () => {
      // 导出配置
      const config = await myStorage.get('pfConfig');
      const link = domC('a', {
        href: 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(config),
        download: `知乎编辑器配置-${+new Date()}.txt`,
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    configImport: async () => {
      // 导入配置
      const configImport = dom('[name=textConfigImport]').value;
      pfConfig = JSON.parse(configImport);
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      resetData();
    },
    configReset: async () => {
      const isUse = confirm('是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存');
      if (isUse) {
        const { filterKeywords = [], removeBlockUserContentList = [] } = pfConfig;
        pfConfig = {
          ...storageConfig.cachePfConfig,
          filterKeywords,
          removeBlockUserContentList,
        };
        await myStorage.set('pfConfig', JSON.stringify(pfConfig));
        resetData();
      }
    },
    styleCustom: async () => {
      // 自定义样式
      const value = dom('[name="textStyleCustom"]').value || '';
      pfConfig.customizeCss = value;
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      myCustomStyle.change();
    },
  };

  /** 存储使用油猴自己的GM存储，解决数据不共通的问题，添加localStorage与GM判断，获取最新存储 */
  const myStorage = {
    set: async (name, value) => {
      let v = value;
      if (name === 'pfConfig') {
        // 如果是 pfConfig 则添加时间戳
        const valueParse = JSON.parse(value);
        valueParse.t = +new Date();
        v = JSON.stringify(valueParse);
      }
      localStorage.setItem(name, v);
      await GM_setValue(name, v);
    },
    get: async (name) => {
      const config = await GM_getValue(name);
      const configLocal = localStorage.getItem(name);
      let c = config;
      if (name === 'pfConfig') {
        // 如果是 pfConfig 则通过时间戳t来获取最新配置
        const cParse = config ? JSON.parse(config) : null;
        const cLParse = configLocal ? JSON.parse(configLocal) : null;
        if (!cParse && !cLParse) return '';
        if (!cParse) return configLocal;
        if (!cLParse) return config;
        if (cParse.t < cLParse.t) return configLocal;
        return config;
      }
      return c;
    },
  };

  /** 在打开弹窗时候停止页面滚动，只允许弹窗滚动 */
  const myScroll = {
    stop: () => dom('body').classList.add('ctz-stop-scroll'),
    on: () => dom('body').classList.remove('ctz-stop-scroll'),
  };

  /** 编辑器弹窗打开关闭方法 */
  const myDialog = {
    open: async () => {
      domById(ID_DIALOG).style.display = 'flex';
      const nConfig = await myStorage.get('pfConfig');
      const c = nConfig ? JSON.parse(nConfig) : {};
      if (nConfig !== JSON.stringify(pfConfig)) {
        pfConfig = { ...pfConfig, ...c };
        echoData();
      }
      myScroll.stop();
    },
    hide: () => {
      domById(ID_DIALOG).style.display = 'none';
      myScroll.on();
    },
  };

  /** 屏蔽词方法 */
  const myFilterWord = {
    add: async function (target) {
      // 添加屏蔽词
      const w = target.value;
      const { filterKeywords } = pfConfig;
      filterKeywords.push(w);
      pfConfig = {
        ...pfConfig,
        filterKeywords,
      };
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      const item = domC('span', {
        innerHTML: this.evenText(w),
      });
      item.dataset.title = w;
      domById(ID_FILTER_WORDS).appendChild(item);
      target.value = '';
    },
    remove: (event) => {
      // 删除屏蔽词
      const title = event.dataset.title;
      const { filterKeywords } = pfConfig;
      pfConfig = {
        ...pfConfig,
        filterKeywords: filterKeywords.filter((i) => i !== title),
      };
      event.remove();
      myStorage.set('pfConfig', JSON.stringify(pfConfig));
    },
    init: function () {
      // 初始化
      const children = (pfConfig.filterKeywords || []).map((i) => this.evenTextBlock(i)).join('');
      domById(ID_FILTER_WORDS).innerHTML = children || '';
      domById(ID_FILTER_WORDS).onclick = (e) => {
        if (e.target.classList.contains('ctz-filter-word-remove')) {
          this.remove(e.target.parentElement);
        }
      };
      dom('[name="inputFilterWord"]').onchange = (e) => {
        this.add.call(this, e.target);
      };
    },
    evenText: (w) => {
      return `<span>${w}</span><i class="ctz-icon ctz-filter-word-remove">&#xe602;</i>`;
    },
    evenTextBlock: function (w) {
      return `<span data-title="${w}">${this.evenText(w)}</span>`;
    },
  };

  /** 设置菜单方法 */
  const myMenu = {
    init: function () {
      // 匹配顶部菜单项或者匹配菜单子项
      const { hash } = window.location;
      const chooseId = MENU_IDS.find((i) => i === hash || hash.replace(i) !== hash);
      if (chooseId) {
        this.click({ target: dom(`a[href="${chooseId}"]`) });
        return;
      }
      this.click({ target: dom('a[href="#CTZ_SET_BASIS"]') });
    },
    click: function ({ target }) {
      if (!(target.hash && target.tagName === 'A')) return;
      const isThis = target.hash.replace(/#/, '');
      if (!isThis) return;
      domA('.ctz-menu-top>a').forEach((itemA) => {
        itemA.style = '';
      });
      target.style = 'border-bottom: 4px solid #2e2e2e;color: #2e2e2e;';
      domA('.ctz-content>div').forEach((item) => {
        item.style.display = isThis === item.id ? 'flex' : 'none';
      });
    },
  };

  /** 加载基础元素及绑定方法 */
  const initHTML = () => {
    document.body.appendChild(
      domC('div', {
        id: ID_MAIN,
        innerHTML: INNER_HTML,
      })
    );

    // 绑定元素事件
    domById(ID_OPEN_BUTTON).onclick = myDialog.open;
    domById(ID_CLOSE).onclick = myDialog.hide;

    /** 添加弹窗底部信息 */
    const appendFooter = () => {
      HREF_LIST.forEach(({ name, href }) => {
        const tagA = domC('a', {
          href,
          target: '_blank',
          innerText: name,
        });
        dom('.ctz-footer').appendChild(tagA);
      });
    };

    /** 添加背景色选择 */
    const appendBackground = () => {
      domById(ID_BG).innerHTML = '';
      Object.keys(BACKGROUND_CONFIG).forEach((key) => {
        domById(ID_BG).appendChild(
          domC('label', {
            className: 'ctz-bg-choose-label',
            innerHTML:
              `<input class="${CLASS_INPUT}" name="colorBackground" type="radio" value="${key}"/>` +
              `<div style="background: ${key}; border: 2px solid ${key}">${BACKGROUND_CONFIG[key].name}</div>`,
          })
        );
      });
    };

    /** 添加隐藏元素 */
    const appendHidden = () => {
      Object.keys(SET_DIRECTION).forEach((key) => {
        const elementItem = dom(`#${key}_HIDDEN>.ctz-set-content`);
        const arrHidden = SET_DIRECTION[key]['_HIDDEN'];
        if (!arrHidden || !arrHidden.length) return;
        elementItem.innerHTML = arrHidden
          .map(
            (i) =>
              `${i
                .map(({ label, value }) => `<label><input class="ctz-i" name="${value}" type="checkbox" value="on" />${label}</label>`)
                .join('')}` + `<span style="width: 100%; margin: 8px 0; background: #ddd; height: 1px; display:block"></span>`
          )
          .join('');
      });
    };

    try {
      myMenu.init();
      dom('.ctz-version').innerText = `version: ${GM_info.script.version}`;
      appendFooter();
      appendBackground();
      appendHidden();
    } catch {}
  };

  /** 加载设置弹窗绑定方法 */
  const initOperate = () => {
    const myOperation = {
      [CLASS_INPUT]: fnChanger,
      [CLASS_BUTTON]: (even) => myButtonOperation[even.name](),
    };
    // 绑定点击事件
    dom('.ctz-content').onclick = (even) => {
      Object.keys(myOperation).forEach((key) => {
        if (even.target.classList.contains(key)) {
          myOperation[key](even.target);
        }
      });
    };
    // 绑定菜单事件
    dom('.ctz-menu-top').onclick = myMenu.click;
  };

  /** 加载数据 */
  const initData = () => {
    // storageConfig.cacheTitle = document.title;
    echoData();
    // $('.pf-modal-content')[0].onchange = (even) => {
    //   if ($(even.target).hasClass('pf-i')) {
    //     return myChanger(even.target, even.target.type);
    //   }
    // };
    // $('.pf-i-input')[0].oninput = (even) => {
    //   return myChanger(even.target, even.target.type);
    // };
    // initPositionPage();
    // onChooseHeart();
    // cacheHeader();
    // changeTitleIco();
    // changeTitle();
    // changeSuspensionTab();
    // onToHomeHref();
    // if (isLoading) {
    //   isLoading = false;
    //   GM_log(
    //     '[customize]修改器加载完毕，加载时间：' +
    //       (performance.now() - timeStart).toFixed(2) +
    //       'ms'
    //   );
    // }
  };

  /** 查找是否使用主题 */
  const findTheme = () => {
    // 开始进入先修改一次
    onUseThemeDark(pfConfig.isUseThemeDark);
    const elementHTML = dom('html');
    const muConfig = { attribute: true, attributeFilter: ['data-theme'] };
    // 监听 html 元素属性变化
    const muCallback = function () {
      const { isUseThemeDark } = pfConfig;
      const themeName = elementHTML.getAttribute('data-theme');
      if ((themeName === 'dark' && !isUseThemeDark) || (themeName === 'light' && isUseThemeDark)) {
        onUseThemeDark(isUseThemeDark);
      }
    };
    const muObserver = new MutationObserver(muCallback);
    muObserver.observe(elementHTML, muConfig);
  };

  /** 加载额外的样式文件 */
  const onInitStyleExtra = () => {
    // versionCSS.init();
    myHidden.init();
    myBackground.init();
    findTheme();
  };

  /** 在启动时注入的内容 */
  async function onDocumentStart() {
    initDomStyle(ID_STYLE, INNER_CSS);
    if (!HTML_HOOTS.includes(location.hostname) || window.frameElement) return;
    storageConfig.cachePfConfig = pfConfig;
    const config = await myStorage.get('pfConfig');
    const c = config ? JSON.parse(config) : {};
    pfConfig = { ...pfConfig, ...c };
    // 首页重定向
    // if (
    //   pfConfig.indexPathnameRedirect &&
    //   pfConfig.indexPathnameRedirect !== 'n' &&
    //   location.host === 'www.zhihu.com' &&
    //   location.pathname === '/'
    // ) {
    //   location.href = `https://www.zhihu.com/${pfConfig.indexPathnameRedirect}`;
    // }

    onInitStyleExtra();

    const host = location.host;

    if (host === 'zhuanlan.zhihu.com') {
      dom('html').classList.add('zhuanlan');
    } else if (host === 'www.zhihu.com') {
      dom('html').classList.add('zhihu');
    }

    // 拦截 fetch 方法, 获取 option 中的值
    const originFetch = fetch;
    unsafeWindow.fetch = (url, opt) => {
      // if (
      //   /\/answers\?/.test(url) &&
      //   (answerSortBy === 'vote' || answerSortBy === 'comment') &&
      //   isFirstToSort
      // ) {
      //   // 如果是自定义排序则知乎回答页码增加到20条
      //   url = url.replace(/(?<=limit=)\d+(?=&)/, '20');
      // }

      if (!storageConfig.fetchHeaders['x-ab-param'] && opt && opt.headers) {
        storageConfig.fetchHeaders = opt.headers;
      }

      // 存储x-zst-81供「不感兴趣」接口使用
      storageConfig.xZst81 = (opt && opt.headers && opt.headers['x-zst-81']) || '';
      return originFetch(url, opt);
    };

    // if (
    //   /\/question/.test(location.pathname) &&
    //   location.search.match(/(?<=sort=)\w+/)
    // ) {
    //   answerSortBy = location.search.match(/(?<=sort=)\w+/)[0];
    // }
  }
  onDocumentStart();

  /** 监听过滤内容 */
  const fnHiddenDom = (lessNum, ev, log) => {
    ev.style.display = 'none';
    log && fnLog(log);
    return ++lessNum;
  };

  /** 计算过滤起始位置 */
  const fnIndexMath = (index, i, len, lessNum) => {
    return i + 1 === len ? i + 1 - lessNum : index;
  };

  /** 调用「不感兴趣」接口 */
  const doFetchNotInterested = ({ id, type }) => {
    const data = new FormData();
    data.append('item_brief', JSON.stringify({ source: 'TS', type: type, id: id }));
    fetch(API_NOT_INTERESTED, {
      body: data,
      method: 'POST',
      headers: new Headers({
        ...storageConfig.fetchHeaders,
        'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0],
        'x-zst-81': storageConfig.xZst81,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fnLog('已调用「不感兴趣」接口');
      });
  };

  /** 监听列表内容 - 过滤  */
  const myListenListItem = {
    index: 0,
    init: function () {
      const {
        filterKeywords = [],
        removeItemAboutVideo,
        removeItemAboutArticle,
        removeLessVote,
        lessVoteNumber,
        removeItemQuestionAsk,
        removeFollowVoteAnswer,
        removeFollowVoteArticle,
        removeFollowFQuestion,
      } = pfConfig;
      if (!filterKeywords.length && !removeItemAboutVideo && !removeItemAboutArticle && !removeLessVote && !removeItemQuestionAsk) return;
      const elements = domA('.TopstoryItem');
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = ''; // 屏蔽信息
        let dataZop = {};
        let cardContent = {};
        const elementThis = elements[i];
        const elementContent = elementThis.querySelector('.ContentItem');

        if (!elementThis.scrollHeight || !elementContent) continue;
        try {
          dataZop = JSON.parse(elementContent.getAttribute('data-zop'));
          cardContent = JSON.parse(elementContent.getAttribute('data-za-extra-module')).card.content;
        } catch {}
        const { itemId = '', title = '', type = '' } = dataZop || {};
        let matchedWord = ''; // 匹配到的内容, 仅匹配第一个
        for (let itemWord of filterKeywords) {
          const rep = new RegExp(itemWord.toLowerCase());
          if (rep.test(title.toLowerCase())) {
            matchedWord += `「${itemWord}」`;
            break;
          }
        }

        // FIRST
        // 匹配到屏蔽词, 屏蔽词过滤
        if (matchedWord) {
          const elementItemProp = elementContent.querySelector('[itemprop="url"]');
          const routeURL = elementItemProp && elementItemProp.getAttribute('content');
          doFetchNotInterested({ id: itemId, type });
          message = `屏蔽列表内容: ${title},匹配屏蔽词：${matchedWord}, 链接：${routeURL}`;
        }

        // 列表种类过滤
        const haveVideo = elementContent.classList.contains('ZVideoItem') && removeItemAboutVideo;
        const haveArticle = elementContent.classList.contains('ArticleItem') && removeItemAboutArticle;
        (haveVideo || haveArticle) && !message && (message = '列表种类屏蔽');

        // 屏蔽低赞内容
        if (removeLessVote && !message) {
          cardContent['upvote_num'] < lessVoteNumber && (message = `屏蔽低赞内容: ${title}, ${cardContent['upvote_num']}`);
        }

        // 屏蔽邀请回答
        const elementQuestionAsk = elementThis.querySelector('.TopstoryQuestionAskItem');
        if (removeItemQuestionAsk && elementQuestionAsk && !message) {
          message = '屏蔽邀请回答';
        }

        // 关注列表屏蔽关注人操作
        const isFilterFollowerOperate = removeFollowVoteAnswer || removeFollowVoteArticle || removeFollowFQuestion;
        if (isFilterFollowerOperate && !message && elementThis.classList.contains('TopstoryItem-isFollow')) {
          const textFollowerOperate = elementThis.querySelector('.FeedSource-firstline').innerText;
          for (let itemOperate of FILTER_FOLLOWER_OPERATE) {
            const thisRep = new RegExp(itemOperate.rep);
            if (pfConfig[itemOperate.key] && thisRep.test(textFollowerOperate)) {
              message = `屏蔽关注人操作: ${textFollowerOperate}`;
              break;
            }
          }
        }

        // 最后信息 & 起点位置处理
        message && (lessNum = fnHiddenDom(lessNum, elementThis, message));
        this.index = fnIndexMath(this.index, i, len, lessNum);
      }
    },
    reset: function () {
      // 重置起点
      this.index = 0;
    },
  };

  /** 监听搜索列表 - 过滤  */
  const myListenSearchListItem = {
    index: 0,
    init: function () {
      const { removeItemAboutVideo, removeItemAboutArticle, removeItemAboutAD, removeLessVote, lessVoteNumber } = pfConfig;
      if (!removeItemAboutVideo && !removeItemAboutArticle && !removeItemAboutAD && !removeLessVote) return;
      const elements = domA('.SearchResult-Card[role="listitem"]');
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = ''; // 屏蔽信息
        const elementThis = elements[i];
        if (!elementThis) continue;

        // FIRST
        // 列表种类屏蔽
        const haveAD = removeItemAboutAD && elementThis.querySelector('.KfeCollection-PcCollegeCard-root');
        const haveArticle = removeItemAboutArticle && elementThis.querySelector('.ArticleItem');
        const haveVideo = removeItemAboutVideo && elementThis.querySelector('.ZvideoItem');
        (haveAD || haveArticle || haveVideo) && (message = '列表种类屏蔽');

        // 低赞内容过滤
        if (removeLessVote && !message) {
          const elementUpvote = elementThis.querySelector('.ContentItem-actions .VoteButton--up');
          const ariaLabel = elementUpvote ? elementUpvote.getAttribute('aria-label') : '';
          const upvoteText = ariaLabel ? ariaLabel.trim().replace(/\W+/, '') : '0';
          const upvote = upvoteText.includes('万') ? upvoteText.replace('万', '').trim() * 10000 : +upvoteText;
          if (upvote > -1 && upvote < lessVoteNumber) {
            message = `屏蔽低赞内容: ${upvote}赞`;
          }
        }

        // 最后信息 & 起点位置处理
        message && (lessNum = fnHiddenDom(lessNum, elementThis, message));
        this.index = fnIndexMath(this.index, i, len, lessNum);
      }
    },
    reset: function () {
      this.index = 0;
    },
  };

  /** 监听详情回答 - 过滤 */
  const myListenAnswerItem = {
    index: 0,
    init: function () {
      //sortAnswer()
      //   if ($('.QuestionAnswer-content')[0]) {
      //     pfConfig.answerItemCreatedAndModifiedTime && addTimes($('.QuestionAnswer-content'));
      //     pfConfig.showBlockUser && addBlockUser($('.QuestionAnswer-content'));
      //   }

      const { removeLessVoteDetail, lessVoteNumberDetail, answerOpen } = pfConfig;
      if (!removeLessVoteDetail && !answerOpen) return;
      const elements = domA('.AnswersNavWrapper .List-item');
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = '';
        const elementThis = elements[i];
        const elementInfo = elementThis.querySelector('.ContentItem');
        let dataZop = {};
        let dataCardContent = {}; // 回答扩展信息
        try {
          dataZop = JSON.parse(elementInfo.getAttribute('data-zop'));
          dataCardContent = JSON.parse(elementInfo.getAttribute('data-za-extra-module')).card.content;
        } catch {}

        // FIRST
        // 低赞回答过滤
        dataCardContent['upvote_num'] < lessVoteNumberDetail &&
          removeLessVoteDetail &&
          (message = `过滤低赞回答: ${dataCardContent['upvote_num']}赞`);

        // data-za-extra-module
        //     const that = events[i];
        //     if (that) {
        //       const eventThat = $(that);
        //       if (pfConfig.removeZhihuOfficial) {
        //         // 知乎官方账号优先级最高
        //         const label = eventThat.find('.AuthorInfo-name .css-n99yhz').attr('aria-label');
        //         if (/知乎[\s]*官方帐号/.test(label)) {
        //           lessNum = fnHiddenDom(lessNum, that, '已删除一条知乎官方帐号的回答');
        //           isRemoved = true;
        //         }
        //       } else {
        //         const dataZop = eventThat.children('.AnswerItem').attr('data-zop');
        //         REMOVE_ANSWER_BY_NAME.forEach((item) => {
        //           const reg = new RegExp(`['"]authorName['":]*` + item.name);
        //           if (pfConfig[item.id] && reg.test(dataZop)) {
        //             lessNum = fnHiddenDom(lessNum, that, `已删除一条${item.name}的回答`);
        //             isRemoved = true;
        //           }
        //         });
        //       }
        //       // 删除选自盐选专栏的回答
        //       if (pfConfig.removeFromYanxuan && !isRemoved) {
        //         const formYanxuan =
        //           eventThat.find('.KfeCollection-OrdinaryLabel-content')[0] || eventThat.find('.KfeCollection-IntroCard p:first-of-type')[0];
        //         if (formYanxuan) {
        //           const formYanxuanText = formYanxuan ? formYanxuan.innerText : '';
        //           if (/盐选专栏/.test(formYanxuanText)) {
        //             lessNum = fnHiddenDom(lessNum, that, `已删除一条来自盐选专栏的回答`);
        //             isRemoved = true;
        //           }
        //         }
        //       }
        //       // 隐藏「含有虚构内容」的回答
        //       if (pfConfig.removeUnrealAnswer && !isRemoved) {
        //         const aTag = eventThat.find('.KfeCollection-FabledStatement')[0];
        //         const aTag2 = eventThat.find('.css-140fcia')[0];
        //         if (REP_UNREAL.test(aTag ? aTag.innerText : '') || REP_UNREAL.test(aTag2 ? aTag2.innerText : '')) {
        //           lessNum = fnHiddenDom(lessNum, that, `已删除一条内容包含虚构创作的回答`);
        //           isRemoved = true;
        //         }
        //       }
        //       // 如果 不再显示「已屏蔽」用户发布的内容 为 true 并且列表不为 0
        //       if (pfConfig.removeBlockUserContent && pfConfig.removeBlockUserContentList.length && !isRemoved) {
        //         const aContent = eventThat.find('.AnswerItem').attr('data-za-extra-module')
        //           ? JSON.parse(eventThat.find('.AnswerItem').attr('data-za-extra-module')).card.content
        //           : {};
        //         const userId = aContent.author_member_hash_id || '';
        //         if (pfConfig.removeBlockUserContentList.find((i) => i.id === userId)) {
        //           lessNum = fnHiddenDom(lessNum, that, `已屏蔽一个用户的回答`);
        //           isRemoved = true;
        //         }
        //       }
        //       pfConfig.answerItemCreatedAndModifiedTime && addTimes(eventThat);
        //       pfConfig.showBlockUser && addBlockUser(eventThat);

        // 自动展开回答 和 默认收起长回答
        if (!message && answerOpen) {
          const unFoldButton = elementThis.querySelector('.ContentItem-expandButton');
          const foldButton = elementThis.querySelector('.RichContent-collapsedText');
          const isNotOpen = !elementThis.classList.contains(OB_CLASS_FOLD.on);
          const isNotClose = !elementThis.classList.contains(OB_CLASS_FOLD.off);
          if (answerOpen === 'on' && isNotOpen) {
            unFoldButton.click();
            elementThis.classList.add(OB_CLASS_FOLD.on);
            lessNum++;
          }

          const isF = foldButton && elementThis.offsetHeight > 939;
          const isFC = unFoldButton; // 已经收起的回答
          if (answerOpen === 'off' && isNotClose && (isF || isFC)) {
            elementThis.classList.add(OB_CLASS_FOLD.off);
            isF && foldButton.click();
            lessNum++;
          }
        }

        // 最后信息 & 起点位置处理
        message && (lessNum = fnHiddenDom(lessNum, elementThis, message));
        this.index = fnIndexMath(this.index, i, len, lessNum);
      }
    },
    reset: function () {
      this.index = 0;
    },
  };

  /** 节流, 使用时 fn 需要为 function () {} */
  function throttle(fn, time = 300) {
    let timeout = null;
    return function () {
      if (timeout) return;
      timeout = setTimeout(() => {
        timeout = null;
        fn.apply(this, arguments);
      }, time);
    };
  }

  /** 手动调用页面大小变动 */
  const doResizePage = () => {
    const myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  };

  /** 使用 ResizeObserver 监听body高度 */
  const resizeObserver = new ResizeObserver(throttle(resizeFun, 500));
  function resizeFun() {
    if (!HTML_HOOTS.includes(location.hostname)) return;

    //   // 页面高度发生改变
    //   if (myLocalC.bodySize === myLocalC.bodySizePrev) {
    //     // 重新赋值img预览
    //     initPreviewImg();
    //     previewGIF();
    //     // 外链直接打开
    //     initLinkChanger();
    myListenListItem.init();
    myListenSearchListItem.init();
    myListenAnswerItem.init();
    //     // 关注人列表修改
    //     followingListChanger();
    //     topStoryRecommendEvent();
    //     pathnameHasFn({
    //       question: () => {
    //         zoomVideos();
    //         storyHidden();
    //         listenSelectButton();
    //         listenQuestionSideColumn();
    //       },
    //       search: searchPageHidden,
    //       collection: collectionExport,
    //     });
    //   } else {
    //     myLocalC.bodySizePrev = myLocalC.bodySize;
    //   }

    // body 高度变更后比较「推荐」模块内容高度与网页高度
    // 如果模块高度小于网页高度则手动触发 resize 使其加载数据
    const recommendHeightLess = dom('.Topstory-recommend') && dom('.Topstory-recommend').offsetHeight < window.innerHeight;
    const contentHeightLess = dom('.Topstory-content') && dom('.Topstory-content').offsetHeight < window.innerHeight;
    if (recommendHeightLess || contentHeightLess) {
      doResizePage();
    }

    //   // 判断body变化后的页面title是否变化
    //   // 原逻辑是在body变化后会请求查看是否有新的消息后再更改title
    //   pfConfig.title !== document.title && changeTitle();

    //   if (pfConfig.hiddenSearchBoxTopSearch && $('.SearchBar-input input')[0]) {
    //     $('.SearchBar-input input')[0].placeholder = '';
    //   }

    // pathnameHasFn({
    //   video: () => videoFns.init(),
    // });
  }

  /** 网页加载完成后操作 */
  window.onload = () => {
    // 不考虑在 iframe 中的情况
    if (!HTML_HOOTS.includes(location.hostname) || window.frameElement) return;
    initHTML();
    initOperate();
    initData();
    // 页面加载完成后再进行加载背景色, 解决存在顶部推广的 header 颜色
    myBackground.init();
    myCustomStyle.init();
    myFilterWord.init();
    resizeObserver.observe(document.body);
    fnLog('加载完毕');
  };

  /** 页面路由变化, 部分操作方法 */
  const changeHistory = () => {
    // 重置监听起点
    myListenListItem.reset();
    myListenSearchListItem.reset();
    myListenAnswerItem.reset();
  };

  /** history 变化 */
  window.addEventListener('popstate', changeHistory);
  window.addEventListener('pushState', changeHistory);
})();
