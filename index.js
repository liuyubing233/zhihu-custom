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

const dom = (n) => document.querySelector(n);
const domById = (id) => document.getElementById(id);
const domA = (n) => document.querySelectorAll(n);
const domC = (name, attrObjs) => {
  const element = document.createElement(name);
  Object.keys(attrObjs).forEach((key) => {
    element[key] = attrObjs[key];
  });
  return element;
};
const myLog = (str) => console.log('「知乎修改器」', str);

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
/** 插入的元素顶层 id */
const ID_MAIN = 'CTZ_MAIN';
/** 插入的默认样式 id */
const ID_STYLE = 'CTZ_STYLE';
/** 背景色 style id */
const ID_STYLE_BG = 'CTZ_STYLE_BACKGROUND';
/** 自定义样式 style id */
const ID_STYLE_CUSTOM = 'CTZ_STYLE_CUSTOM';
/** 弹窗关闭按钮 id */
const ID_CLOSE = 'CTZ_CLOSE_DIALOG';
/** 背景色元素 id */
const ID_BG = 'CTZ_BACKGROUND';

/** INPUT 元素类名 */
const CLASS_INPUT = 'ctz-i';
/** BUTTON 元素类名 */
const CLASS_BUTTON = 'ctz-button';

/** 底部跳转链接 */
const HREF_LIST = [
  {
    name: 'Github 您的star⭐是我更新的动力',
    href: 'https://github.com/superPufferfish/custom-zhihu',
  },
  {
    name: 'GreasyFork',
    href: 'https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8',
  },
];

(function () {
  'use strict';
  const INNER_HTML = ``;
  const INNER_CSS = ``;

  /** 插入的默认样式属性 */
  const ATTR_INNER_CSS = {
    id: ID_STYLE,
    type: 'text/css',
    innerHTML: INNER_CSS,
  };
  /** 插入的元素顶层属性 */
  const ATTR_INNER_HTML = {
    id: ID_MAIN,
    innerHTML: INNER_HTML,
  };

  let pfConfig = {
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
    answerUnfold: false, // 自动展开所有回答
    answerFoldStart: true, // 默认收起所有长回答
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
    // 悬浮模块 end ------------------
    // 隐藏内容模块 start --------
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
    hiddenHotListWrapper: false, // 热榜榜单TAG
    hiddenZhuanlanActions: false, // 专栏下方操作条
    hiddenZhuanlanTitleImage: false, // 专栏标题图片
    hiddenHotItemMetrics: false, // 热门热度值
    hiddenHotItemIndex: false, // 热门排序
    hiddenHotItemLabel: false, // 热门"新"元素
    hiddenDetailAvatar: false, // 详情回答人头像
    hiddenDetailBadge: false, // 详情回答人简介
    hiddenDetailVoters: false, // 详情回答人下赞同数
    hiddenDetailName: false, // 详情回答人姓名
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
    hiddenCollegeEntranceExamination: true, // 列表顶部活动推荐
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
    hiddenHomeTopAD: true, // 知乎首页顶部活动推广
    hiddenListVideoContent: false, // 列表视频回答的内容
    // 隐藏内容模块 end --------
    // 删除内容模块 start --------
    removeStoryAnswer: true, // 故事档案局回答
    removeYanxuanAnswer: true, // 盐选科普回答
    removeYanxuanRecommend: true, // 盐选推荐
    removeYanxuanCPRecommend: true, // 盐选测评室
    removeFromYanxuan: true, // 选自盐选专栏的回答
    removeZhihuOfficial: false, // 知乎官方账号回答
    removeItemAboutArticle: false, // 文章
    removeItemAboutVideo: false, // 视频
    removeItemAboutAsk: true, // 提问
    removeFollowVoteAnswer: false, // 关注人赞同回答
    removeFollowVoteArticle: false, // 关注人赞同文章
    removeFollowFQuestion: false, // 关注人关注问题
    removeBlockUserContent: true, // 不再显示「已屏蔽」用户发布的内容
    removeUnrealAnswer: false, // 带有虚构内容的回答
    removeSearchListAD: false, // 搜索页商业推广
    removeSearchListArticle: false, // 搜索页文章
    removeSearchListVideo: false, // 搜索页视频
    removeLessVote: false, // 关注列表过滤低于以下赞的内容
    // 删除内容模块 end --------
    removeBlockUserContentList: [], // 已屏蔽用户列表
    lessVoteNumber: 100, // 关注列表过滤低于以下赞的内容
  };

  /** 脚本内配置缓存 */
  const storageConfig = {
    cachePfConfig: {}, // 缓存初始配置
    cacheTitle: '', // 缓存页面原标题
    bodySize: 0,
    bodySizePrev: 0,
    fetchHeaders: {}, // fetch的headers内容，获取下来以供使用
    xZst81: '',
    cssDark: '', // 黑暗模式缓存
  };

  /** 启用知乎默认的黑暗模式 */
  const onUseThemeDark = (isUse) => {
    dom('html').setAttribute('data-theme', isUse ? 'dark' : 'light');
  };

  /** 修改页面背景的css */
  const myBackground = {
    init: function () {
      domById(ID_STYLE_BG) && domById(ID_STYLE_BG).remove();
      document.head.appendChild(
        domC('style', {
          id: ID_STYLE_BG,
          type: 'text/css',
          innerHTML: this.chooseBG(pfConfig.colorBackground),
        })
      );
    },
    chooseBG: function (bg) {
      return pfConfig.isUseThemeDark
        ? storageConfig.cssDark || this.dark()
        : bg !== '#ffffff'
        ? this.normal(bg)
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
      const color333 = `css-1x3upj1,#CTZ_BACKGROUND>label>div,.ctz-content-left>a:hover{color: #333!important}`;
      const color999 = `.css-o7lu8j{color: #999!important}`;

      /** 添加 html[data-theme=dark] 前缀*/
      const addPrefix = (cssStr) => {
        const darkPrefix = 'html[data-theme=dark]';
        return cssStr
          .split(',')
          .map((i) => `${darkPrefix} ${i}`)
          .join(',');
      };

      const cssDarkStr =
        '#CTZ_DIALOG_MAIN{background: #121212!important;border: 1px solid #eee}' +
        addPrefix(background121212 + colorWhite + color333 + color999 + background333 + backgroundTransparent + borderColor121212);

      // 缓存黑暗模式数据
      storageConfig.cssDark = cssDarkStr;
      myLog('黑暗模式初始化完成');
      return cssDarkStr;
    },
    normal: (bg) => {
      // 普通背景色
      const background =
        `#CTZ_DIALOG_MAIN` +
        `,body,.Post-content,.HotList,.HotListNavEditPad,.ColumnPageHeader,.ZVideoToolbar` +
        `,.position-suspensionSearch.focus,.Modal-modal-wf58,.Community-ContentLayout,.App-root-8rX7N` +
        `,.MenuBar-root-rQeFm,.TopNavBar-fixMode-4nQmh,.App-active-dPFhH,.CategorySection-categoryList-mrt3Z` +
        `,.zhuanlan .Post-content .ContentItem-actions,.zhuanlan .ContentItem-actions` +
        `{background-color: ${bg}!important;}`;
      const backgroundOpacity =
        `#CTZ_DIALOG_MAIN select,#CTZ_DIALOG_MAIN input,#CTZ_DIALOG_MAIN textarea` +
        `,.QuestionHeader,.Card,.HotItem,.Recommendations-Main,.GlobalSideBar-navList` +
        `,.CommentsV2-withPagination,.QuestionHeader-footer,.HoverCard,.ContentItem-actions` +
        `,.MoreAnswers .List-headerText,.Topbar,.CommentsV2-footer,.Select-plainButton` +
        `,.AppHeader:not(.css-19nsrfi),.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreSpecialCard` +
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
        `,.css-1clwviw,.css-ndqbqd,.css-19v79p5,.css-f7rzgf,.css-106u01g,.css-c29erj` +
        `{background-color:${BACKGROUND_CONFIG[bg].opacity}!important;background:${BACKGROUND_CONFIG[bg].opacity}!important;}`;
      const backgroundTransparent =
        `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper` +
        `{background-color: transparent!important;}`;
      const borderColor = `.MenuBar-root-rQeFm{border-color: ${bg}!important;}`;
      return background + backgroundOpacity + backgroundTransparent + borderColor;
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
      radio: (even) => pfConfig[even.name] && even.value === pfConfig[even.name] && (even.checked = true),
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
    } else if (/^hidden/.test(name) || doCssVersion.includes(name)) {
      // versionCSS.init();
    } else {
      ob[name] && ob[name]();
    }
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
    change: () => {
      domById(ID_STYLE_CUSTOM) && domById(ID_STYLE_CUSTOM).remove();
      const innerHTML = pfConfig.customizeCss;
      if (!innerHTML) return;
      const elementStyle = domC('style', {
        type: 'text/css',
        id: ID_STYLE_CUSTOM,
        innerHTML,
      });
      dom('head').appendChild(elementStyle);
    },
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
      myCustomStyle.change()
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

  /** 加载基础样式 */
  const initStyle = () => {
    const element = domC('style', ATTR_INNER_CSS);
    document.head.appendChild(element);
  };

  /** 加载基础元素及绑定方法 */
  const initHTML = () => {
    const element = domC('div', ATTR_INNER_HTML);
    document.body.appendChild(element);

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
            class: 'ctz-bg-choose-label',
            innerHTML:
              `<input class="${CLASS_INPUT}" name="colorBackground" type="radio" value="${key}"/>` +
              `<div style="background: ${key}; border: 2px solid ${key}">${BACKGROUND_CONFIG[key].name}</div>`,
          })
        );
      });
    };

    try {
      dom('.ctz-version').innerText = `version: ${GM_info.script.version}`;
      appendFooter();
      appendBackground();
    } catch {}
  };

  /** 编辑器操作集合 */
  const myOperation = {
    [CLASS_INPUT]: fnChanger,
    [CLASS_BUTTON]: ({ name }) => myButtonOperation[name](),
  };

  /** 加载绑定方法 */
  const initChanger = () => {
    dom('.ctz-content').onclick = (even) => {
      Object.keys(myOperation).forEach((key) => {
        if (even.target.classList.contains(key)) {
          myOperation[key](even.target);
        }
      });
    };
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
    // if (HTML_HOOTS.includes(location.hostname)) {
    // versionCSS.init();
    myBackground.init();
    findTheme();
    // }
  };

  /** 在启动时注入的内容 */
  async function onDocumentStart() {
    initStyle();
    if (!HTML_HOOTS.includes(location.hostname) || window.frameElement) return;
    // timeStart = performance.now();
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

    // 拦截fetch方法 获取option中的值
    // const originFetch = fetch;
    // unsafeWindow.fetch = (url, opt) => {
    //   if (
    //     /\/answers\?/.test(url) &&
    //     (answerSortBy === 'vote' || answerSortBy === 'comment') &&
    //     isFirstToSort
    //   ) {
    //     // 如果是自定义排序则知乎回答页码增加到20条
    //     url = url.replace(/(?<=limit=)\d+(?=&)/, '20');
    //   }
    //   if (!storageConfig.fetchHeaders['x-ab-param'] && opt && opt.headers) {
    //     storageConfig.fetchHeaders = opt.headers;
    //   }

    //   if (opt && opt.headers && opt.headers['x-zst-81']) {
    //     // 存储x-zst-81供不感兴趣接口使用
    //     storageConfig.xZst81 = opt.headers['x-zst-81'];
    //   }
    //   return originFetch(url, opt);
    // };

    // if (
    //   /\/question/.test(location.pathname) &&
    //   location.search.match(/(?<=sort=)\w+/)
    // ) {
    //   answerSortBy = location.search.match(/(?<=sort=)\w+/)[0];
    // }
  }
  onDocumentStart();

  /** 网页加载完成后操作 */
  window.onload = () => {
    // 不考虑在 iframe 中的情况
    if (!HTML_HOOTS.includes(location.hostname) || window.frameElement) return;
    initHTML();
    initChanger();
    initData();

    myCustomStyle.init();
    myLog('加载完毕');
  };
})();
