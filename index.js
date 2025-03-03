// ==UserScript==
// @name         知乎修改器🤜持续更新🤛努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      5.5.0
// @description  知乎高性能模式，页面模块自定义隐藏，列表及回答内容过滤，保存浏览历史记录，推荐页内容缓存，一键邀请，复制代码块删除版权信息，列表种类和关键词强过滤并自动调用「不感兴趣」接口，屏蔽用户回答，视频下载，设置自动收起所有长回答或自动展开所有回答，移除登录提示弹窗，设置过滤故事档案局和盐选科普回答等知乎官方账号回答，手动调节文字大小，切换主题及深色模式调整，隐藏知乎热搜，列表添加标签种类，去除广告，设置购买链接显示方式，收藏夹内容、回答、文章导出为PDF，一键移除所有屏蔽选项，外链直接打开，键盘左右切换预览图片，更多功能请在插件里体验...
// @compatible   edge Violentmonkey
// @compatible   edge Tampermonkey
// @compatible   chrome Violentmonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Violentmonkey
// @compatible   firefox Tampermonkey
// @compatible   safari Violentmonkey
// @compatible   safari Tampermonkey
// @author       lyb233
// @license      MIT
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

"use strict";
(() => {
  var THEMES = [
    { label: "浅色", value: 0 /* 浅色 */, background: "#fff", color: "#69696e" },
    { label: "深色", value: 1 /* 深色 */, background: "#000", color: "#fff" },
    { label: "自动", value: 2 /* 自动 */, background: "linear-gradient(to right, #fff, #000)", color: "#000" }
  ];
  var THEME_CONFIG_LIGHT = {
    [0 /* 默认 */]: { name: "默认", background: "#ffffff", background2: "", primary: "rgb(0, 122, 255)" },
    [2 /* 黄 */]: { name: "黄", background: "#faf9de", background2: "#fdfdf2", primary: "rgb(160, 90, 0)" },
    [3 /* 绿 */]: { name: "绿", background: "#cce8cf", background2: "#e5f1e7", primary: "rgb(0, 125, 27)" },
    [4 /* 灰 */]: { name: "灰", background: "#eaeaef", background2: "#f3f3f5", primary: "rgb(142, 142, 147)" },
    [5 /* 紫 */]: { name: "紫", background: "#e9ebfe", background2: "#f2f3fb", primary: "rgb(175, 82, 222)" },
    [6 /* 橙 */]: { name: "橙", background: "#FFD39B", background2: "#ffe4c4", primary: "rgb(201, 52, 0)" },
    [7 /* 浅橙 */]: { name: "浅橙", background: "#ffe4c4", background2: "#fff4e7", primary: "rgb(255, 159, 10)" },
    [1 /* 红 */]: { name: "红", background: "#ffd6d4", background2: "#f8ebeb", primary: "rgb(255, 59, 48)" }
  };
  var THEME_CONFIG_DARK = {
    [0 /* 默认 */]: { name: "默认", background: "#121212", background2: "#333333", primary: "#121212" },
    [1 /* 深色一 */]: { name: "深色一", background: "#15202b", background2: "#38444d", primary: "#15202b" },
    [2 /* 深色二 */]: { name: "深色二", background: "#1f1f1f", background2: "#303030", primary: "#1f1f1f" },
    [3 /* 深色三 */]: { name: "深色三", background: "#272822", background2: "#383932", primary: "#272822" },
    [4 /* 高对比度蓝 */]: { name: "高对比度蓝", background: "#1c0c59", background2: "#191970", primary: "#1c0c59" },
    [5 /* 高对比度红 */]: { name: "高对比度红", background: "#570D0D", background2: "#8B0000", primary: "#570D0D" },
    [6 /* 高对比度绿 */]: { name: "高对比度绿", background: "#093333", background2: "#0c403f", primary: "#093333" }
  };
  var INPUT_NAME_THEME = "theme";
  var INPUT_NAME_THEME_DARK = "themeDark";
  var INPUT_NAME_ThEME_LIGHT = "themeLight";
  var CONFIG_HIDDEN_DEFAULT = {
    hiddenAnswerRightFooter: true,
    hiddenReadMoreText: true,
    hiddenAD: true,
    hiddenDetailFollow: true,
    hidden618HongBao: true,
    hiddenZhihuZhiShop: true,
    hiddenQuestionAD: true
  };
  var CONFIG_FILTER_DEFAULT = {
    removeFromYanxuan: true,
    removeFromEBook: true,
    removeUnrealAnswer: false,
    removeFollowVoteAnswer: false,
    removeFollowVoteArticle: false,
    removeFollowFQuestion: false,
    removeBlockUserContent: true,
    blockedUsers: [],
    removeItemAboutAD: false,
    removeItemAboutArticle: false,
    removeItemAboutVideo: false,
    removeItemAboutPin: false,
    removeItemQuestionAsk: false,
    removeLessVote: false,
    lessVoteNumber: 100,
    removeLessVoteDetail: false,
    lessVoteNumberDetail: 100,
    removeAnonymousAnswer: false,
    removeMyOperateAtFollow: false,
    removeTopAD: true
  };
  var CONFIG_SUSPENSION = {
    suspensionHomeTab: false,
    suspensionHomeTabPo: "left: 20px; top: 100px;",
    suspensionHomeTabFixed: true,
    suspensionFind: false,
    suspensionFindPo: "left: 10px; top: 380px;",
    suspensionFindFixed: true,
    suspensionSearch: false,
    suspensionSearchPo: "left: 10px; top: 400px;",
    suspensionSearchFixed: true,
    suspensionUser: false,
    suspensionUserPo: "right: 60px; top: 100px;",
    suspensionUserFixed: true,
    suspensionPickUp: true,
    suspensionPickupRight: 0
  };
  var CONFIG_SIMPLE = {
    hiddenAnswerRightFooter: true,
    hiddenFixedActions: true,
    hiddenLogo: true,
    hiddenHeader: true,
    hiddenHeaderScroll: true,
    hiddenItemActions: true,
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
    hiddenDetailVoters: false,
    hiddenWhoVoters: true,
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
    removeFromYanxuan: true,
    removeUnrealAnswer: false,
    removeFollowVoteAnswer: false,
    removeFollowVoteArticle: false,
    removeFollowFQuestion: false,
    removeBlockUserContent: true,
    removeItemAboutAD: false,
    removeItemQuestionAsk: false,
    removeLessVote: false,
    lessVoteNumber: 100,
    removeLessVoteDetail: false,
    lessVoteNumberDetail: 100,
    suspensionHomeTab: false,
    suspensionHomeTabPo: "left: 20px; top: 100px;",
    suspensionHomeTabFixed: true,
    suspensionFind: false,
    suspensionFindPo: "left: 10px; top: 380px;",
    suspensionFindFixed: true,
    suspensionSearch: true,
    suspensionSearchPo: "left: 10px; top: 400px;",
    suspensionSearchFixed: true,
    suspensionUser: true,
    suspensionUserPo: "right: 60px; top: 100px;",
    suspensionUserFixed: true,
    suspensionPickUp: true,
    answerOpen: "off" /* 默认收起长回答 */,
    showBlockUser: false,
    zoomImageType: "2" /* 自定义尺寸 */,
    zoomImageSize: "200",
    questionTitleTag: true,
    listOutPutNotInterested: true,
    fixedListItemMore: true,
    highlightOriginal: true,
    highlightListItem: true,
    listItemCreatedAndModifiedTime: true,
    answerItemCreatedAndModifiedTime: true,
    questionCreatedAndModifiedTime: true,
    articleCreateTimeToTop: true,
    linkShopping: "1" /* 仅文字 */,
    hiddenAnswerItemActions: true,
    hiddenAnswerItemTime: true,
    videoUseLink: true,
    commitModalSizeSameVersion: true
  };
  var CONFIG_DEFAULT = {
    ...CONFIG_HIDDEN_DEFAULT,
    ...CONFIG_FILTER_DEFAULT,
    ...CONFIG_SUSPENSION,
    fetchInterceptStatus: true,
    customizeCss: "",
    answerOpen: "default" /* 默认 */,
    filterKeywords: [],
    blockWordsAnswer: [],
    showBlockUser: true,
    versionHome: "1000",
    versionAnswer: "1000",
    versionArticle: "1000",
    versionHomeIsPercent: false,
    versionHomePercent: "70",
    versionAnswerIsPercent: false,
    versionAnswerPercent: "70",
    versionArticleIsPercent: false,
    versionArticlePercent: "70",
    zoomImageType: "0" /* 默认尺寸 */,
    zoomImageSize: "600",
    showGIFinDialog: false,
    globalTitle: "",
    titleIco: "",
    questionTitleTag: true,
    listOutPutNotInterested: false,
    fixedListItemMore: false,
    highlightOriginal: true,
    highlightListItem: false,
    listItemCreatedAndModifiedTime: true,
    answerItemCreatedAndModifiedTime: true,
    questionCreatedAndModifiedTime: true,
    articleCreateTimeToTop: true,
    linkShopping: "0" /* 默认 */,
    fontSizeForList: "",
    fontSizeForAnswer: "",
    fontSizeForArticle: "",
    fontSizeForListTitle: "",
    fontSizeForAnswerTitle: "",
    fontSizeForArticleTitle: "",
    contentLineHeight: "",
    zoomListVideoType: "0" /* 默认尺寸 */,
    zoomListVideoSize: "500",
    hotKey: true,
    theme: 2 /* 自动 */,
    themeLight: 0 /* 默认 */,
    themeDark: 1 /* 深色一 */,
    colorText1: "",
    commitModalSizeSameVersion: true,
    listOutputToQuestion: false,
    userHomeContentTimeTop: true,
    userHomeTopBlockUser: true,
    copyAnswerLink: true,
    topExportContent: true,
    zoomImageHeight: "0" /* 关闭 */,
    zoomImageHeightSize: "100",
    highPerformanceRecommend: true,
    highPerformanceAnswer: true,
    suspensionOpen: "0" /* 左右 */,
    showBlockUserCommentTag: true,
    showBlockUserTag: true,
    commentImageFullPage: true,
    keyEscCloseCommentDialog: true,
    replaceZhidaToSearch: "default" /* 不替换 */
  };
  var SAVE_HISTORY_NUMBER = 500;
  var HTML_HOOTS = ["www.zhihu.com", "zhuanlan.zhihu.com"];
  var CLASS_INPUT_CLICK = "ctz-i";
  var CLASS_INPUT_CHANGE = "ctz-i-change";
  var CLASS_NOT_INTERESTED = "ctz-not-interested";
  var CLASS_TO_QUESTION = "ctz-to-question";
  var CLASS_TIME_ITEM = "ctz-list-item-time";
  var CLASS_SELECT = "ctz-select";
  var CLASS_LISTENED = "ctz-listened";
  var CLASS_MESSAGE = "ctz-message";
  var ID_MESSAGE_BOX = "CTZ_MESSAGE_BOX";
  var ID_EXTRA_DIALOG = "CTZ_EXTRA_OUTPUT_DIALOG";
  var CLASS_ZHIHU_COMMENT_DIALOG = "css-1aq8hf9";
  var OB_CLASS_FOLD = {
    on: "ctz-fold-open",
    off: "ctz-fold-close"
  };
  var EXTRA_CLASS_HTML = {
    "zhuanlan.zhihu.com": "zhuanlan",
    "www.zhihu.com": "zhihu"
  };
  var FONT_SIZE_INPUT = [
    { value: "fontSizeForListTitle", label: "列表标题文字大小" },
    { value: "fontSizeForList", label: "列表内容文字大小" },
    { value: "fontSizeForAnswerTitle", label: "回答标题文字大小" },
    { value: "fontSizeForAnswer", label: "回答内容文字大小" },
    { value: "fontSizeForArticleTitle", label: "文章标题文字大小" },
    { value: "fontSizeForArticle", label: "文章内容文字大小" },
    { value: "contentLineHeight", label: "内容行高" }
  ];
  var VERSION_MIN_WIDTH = 600;
  var VERSION_RANGE = [
    {
      label: "列表宽度",
      value: "versionHome",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionHomeIsPercent",
      percentChooseLabel: "列表宽度使用百分比",
      desc: "最小显示宽度为600像素，设置低于此值将按照600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentValue: "versionHomePercent"
    },
    {
      label: "回答宽度",
      value: "versionAnswer",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionAnswerIsPercent",
      percentChooseLabel: "回答宽度使用百分比",
      desc: "最小显示宽度为600像素，设置低于此值将按照600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentValue: "versionAnswerPercent"
    },
    {
      label: "文章宽度",
      value: "versionArticle",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionArticleIsPercent",
      percentChooseLabel: "文章宽度使用百分比",
      desc: "最小显示宽度为600像素，设置低于此值将按照600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentValue: "versionArticlePercent"
    }
  ];
  var FILTER_FOLLOWER_OPERATE = [
    { key: "removeFollowVoteAnswer", rep: "赞同了回答" },
    { key: "removeFollowVoteArticle", rep: "赞同了文章" },
    { key: "removeFollowFQuestion", rep: "关注了问题" }
  ];
  var HIDDEN_ARRAY = [
    {
      key: "CTZ_HIDDEN_COMMON",
      name: "",
      desc: "",
      content: [
        [
          {
            label: "隐藏修改器弹出图标 ⚙︎",
            value: "hiddenOpenButton",
            css: "#CTZ_OPEN_CLOSE{display:none!important;}"
          }
        ],
        [
          {
            label: "广告",
            value: "hiddenAD",
            css: ".TopstoryItem--advertCard,.Pc-card,.Pc-word,.RichText-ADLinkCardContainer,.Pc-Business-Card-PcTopFeedBanner{display: none!important;}"
          }
        ],
        [
          {
            label: "logo",
            value: "hiddenLogo",
            css: '.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"],.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo{display: none!important;}'
          },
          {
            label: "顶部悬浮模块",
            value: "hiddenHeader",
            css: ".AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}"
          },
          {
            label: "滚动顶部悬浮模块/问题名称",
            value: "hiddenHeaderScroll",
            css: ".AppHeader.is-fixed{display:none!important;}"
          }
        ],
        [
          {
            label: "发现模块-首页",
            value: "hiddenAppHeaderTabHome",
            css: ".AppHeader-Tab:nth-of-type(1){display: none}"
          },
          {
            label: "发现模块-知学堂",
            value: "hiddenAppHeaderTabZhi",
            css: ".AppHeader-Tab:nth-of-type(2){display: none}"
          },
          {
            label: "发现模块-等你来答",
            value: "hiddenAppHeaderTabWaitingForYou",
            css: ".AppHeader-Tab:nth-of-type(3){display: none}"
          },
          {
            label: "发现模块-知乎直达",
            value: "hiddenAppHeaderTabFind",
            css: ".AppHeader-Tab:nth-of-type(4){display: none}"
          }
        ],
        [
          {
            label: "回答隐藏用户信息下的附加信息，比如：你赞同过、XXX赞同了等...",
            value: "hiddenWhoVoters",
            css: ".css-1vqda4a{display: none!important;}"
          }
        ],
        [
          {
            label: "评论「回复」按钮",
            value: "hiddenCommitReply",
            css: ".Comments-container .css-140jo2 button:first-of-type{display:none;}"
          },
          {
            label: "评论「点赞」按钮",
            value: "hiddenCommitVote",
            css: ".Comments-container .css-140jo2 button:last-of-type{display:none;}"
          },
          {
            label: "评论底部信息",
            value: "hiddenCommitBottom",
            css: ".Comments-container .css-140jo2{display:none;}"
          }
        ],
        [
          {
            label: "知乎知学堂教育推广商品模块",
            value: "hiddenZhihuZhiShop",
            css: ".RichText-EduCardContainer{display:none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_ACTION",
      name: "操作栏",
      desc: "",
      content: [
        [
          {
            label: "推荐、关注列表操作栏",
            value: "hiddenItemActions",
            css: "#TopstoryContent .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;padding:0;}"
          },
          {
            label: "推荐、关注列表操作栏 - 底部悬浮",
            value: "hiddenItemActionsIsFixed",
            css: "#TopstoryContent .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}"
          }
        ],
        [
          {
            label: "搜索页列表操作栏",
            value: "hiddenItemActionsSearch",
            css: "#SearchMain .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}"
          },
          {
            label: "搜索页列表操作栏 - 底部悬浮",
            value: "hiddenItemActionsIsFixedSearch",
            css: "#SearchMain .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}"
          }
        ],
        [
          {
            label: "回答页问题操作栏",
            value: "hiddenQuestionActions",
            css: ".QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}"
          }
        ],
        [
          {
            label: "回答页回答内容操作栏",
            value: "hiddenAnswerItemActions",
            css: ".Question-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}"
          },
          {
            label: "回答页回答内容操作栏 - 底部悬浮",
            value: "hiddenFixedActions",
            css: ".Question-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}"
          }
        ],
        [
          {
            label: "文章底部悬浮操作栏",
            value: "hiddenZhuanlanActions",
            css: ".zhuanlan .RichContent-actions.is-fixed>.ContentItem-actions{display: none;}"
          }
        ],
        [
          {
            label: "收藏夹列表操作栏",
            value: "hiddenItemActionsCollection",
            css: ".CollectionsDetailPage-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}"
          },
          {
            label: "收藏夹列表操作栏 - 底部悬浮",
            value: "hiddenItemActionsIsFixedCollection",
            css: ".CollectionsDetailPage-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}"
          }
        ],
        [
          {
            label: "个人主页动态、回答、文章等操作栏",
            value: "hiddenItemActionsUser",
            css: ".Profile-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}"
          },
          {
            label: "个人主页动态、回答、文章等操作栏 - 底部悬浮",
            value: "hiddenItemActionsIsFixedUser",
            css: ".Profile-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_LIST",
      name: "列表页面",
      desc: "只在列表中隐藏相应内容",
      content: [
        [
          {
            label: "创作中心",
            value: "hiddenHomeCreatorEntrance",
            css: ".Topstory .css-19idom{display: none;}"
          },
          {
            label: "推荐关注",
            value: "hiddenHomeRecommendFollow",
            css: ".Topstory .css-173vipd{display: none;}"
          },
          {
            label: "分类圆桌",
            value: "hiddenHomeCategory",
            css: ".Topstory .GlobalSideBar-category{display: none;}"
          },
          {
            label: "更多分类",
            value: "hiddenHomeCategoryMore",
            css: '.Topstory .Card[aria-label="更多分类入口"]{display:none;}'
          },
          {
            label: "知乎指南",
            value: "hiddenHomeFooter",
            css: ".Topstory .Footer,.Topstory footer{display: none;}"
          },
          {
            label: "盐选作者平台",
            value: "hiddenYanXuanWriter",
            css: ".KfeCollection-CreateSaltCard{display:none!important;}"
          }
        ],
        [
          {
            label: "首页列表切换模块",
            value: "hiddenHomeListTab",
            css: ".Topstory-container .TopstoryTabs{display: none}"
          },
          {
            label: "首页列表切换 - 关注",
            value: "hiddenHomeListTabFollow",
            css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-follow"]{display: none}'
          },
          {
            label: "首页列表切换 - 推荐",
            value: "hiddenHomeListTabRecommend",
            css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-recommend"]{display: none}'
          },
          {
            label: "首页列表切换 - 热榜",
            value: "hiddenHomeListTabHot",
            css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-hot"]{display: none}'
          },
          {
            label: "首页列表切换 - 视频",
            value: "hiddenHomeListTabVideo",
            css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-zvideo"]{display: none}'
          }
        ],
        [
          {
            label: "列表内容",
            value: "hiddenAnswers",
            css: ".Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine,.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt,.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer{display: none;}"
          },
          {
            label: "推荐、关注列表的视频",
            value: "hiddenListVideoContent",
            css: ".Topstory-recommend .ZVideoItem-video,.Topstory-recommend .VideoAnswerPlayer,.Topstory-recommend .ZVideoItem .RichContent{display: none;}"
          },
          {
            label: "列表图片",
            value: "hiddenListImg",
            css: ".RichContent-cover,.HotItem-img,.TopstoryItem .Image-Wrapper-Preview{display:none!important;}.HotItem-metrics--bottom{position: initial!important;}"
          },
          {
            label: "问题列表阅读全文文字",
            value: "hiddenReadMoreText",
            css: ".ContentItem-more{font-size:0!important;}"
          },
          {
            label: "列表「亲自答」标签",
            value: "hiddenListAnswerInPerson",
            css: ".Topstory-mainColumn .LabelContainer{display: none;}"
          }
        ],
        [
          {
            label: "关注列表关注人操作",
            value: "hiddenFollowAction",
            css: ".TopstoryItem-isFollow .FeedSource-firstline{display: none;}"
          },
          {
            label: "关注列表用户信息",
            value: "hiddenFollowChooseUser",
            css: ".TopstoryItem-isFollow .AuthorInfo{display: none;}"
          }
        ],
        [
          {
            label: "热门排序编号",
            value: "hiddenHotItemIndex",
            css: ".HotItem-index{display: none;}.HotItem{padding: 16px!important;}"
          },
          {
            label: '热门"新"元素',
            value: "hiddenHotItemLabel",
            css: ".HotItem-label{display: none;}"
          },
          {
            label: "热门热度值",
            value: "hiddenHotItemMetrics",
            css: ".HotItem-content .HotItem-metrics{display: none;}"
          }
        ],
        [
          {
            label: "搜索栏知乎热搜",
            value: "hiddenSearchBoxTopSearch",
            css: ".SearchBar-noValueMenu .AutoComplete-group:first-child{display:none;}"
          },
          {
            label: "搜索页知乎热搜",
            value: "hiddenSearchPageTopSearch",
            css: ".Search-container .TopSearch{display: none;}"
          },
          {
            label: "搜索页知乎指南",
            value: "hiddenSearchPageFooter",
            css: ".Search-container .Footer,.Search-container footer{display: none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_ANSWER",
      name: "回答页面",
      desc: "只在回答页面中隐藏相应内容",
      content: [
        [
          {
            label: "问题话题",
            value: "hiddenQuestionTag",
            css: ".QuestionHeader-tags,.QuestionHeader .css-wmwsyx{display: none!important;}"
          },
          {
            label: "问题分享",
            value: "hiddenQuestionShare",
            css: ".zhihu .Popover.ShareMenu{display: none!important;}"
          },
          {
            label: "「好问题」按钮",
            value: "hiddenQuestionGoodQuestion",
            css: ".QuestionPage .QuestionHeader .GoodQuestionAction{display: none}"
          },
          {
            label: "添加评论",
            value: "hiddenQuestionComment",
            css: ".QuestionPage .QuestionHeader .QuestionHeader-Comment{display: none}"
          },
          {
            label: "问题更多「...」按钮",
            value: "hiddenQuestionMore",
            css: '.QuestionPage .QuestionHeader [aria-label="更多"]{display: none;}'
          },
          {
            label: "问题专题收录标签",
            value: "hiddenQuestionSpecial",
            css: ".QuestionHeader .LabelContainer-wrapper{display: none;}"
          },
          {
            label: "问题关注按钮",
            value: "hiddenQuestionFollowing",
            css: ".QuestionHeader .FollowButton{display: none;}"
          },
          {
            label: "问题写回答按钮",
            value: "hiddenQuestionAnswer",
            css: ".QuestionHeader .FollowButton ~ a{display: none;}"
          },
          {
            label: "问题邀请回答按钮",
            value: "hiddenQuestionInvite",
            css: ".QuestionHeader .QuestionHeaderActions>button:first-child{display: none;}"
          },
          {
            label: "问题标题卡片广告和榜单",
            value: "hiddenQuestionAD",
            css: ".css-e69dqy,.Card.css-15hh8yc{display: none;}"
          }
        ],
        [
          {
            label: "查看全部回答按钮",
            value: "hiddenQuestionViewAll",
            css: ".Question-mainColumn .ViewAll{display:none;}"
          }
        ],
        [
          {
            label: "回答人头像",
            value: "hiddenDetailAvatar",
            css: ".AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}"
          },
          {
            label: "回答人姓名",
            value: "hiddenDetailName",
            css: ".AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}"
          },
          {
            label: "回答人简介",
            value: "hiddenDetailBadge",
            css: ".AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}"
          },
          {
            label: "回答人关注按钮",
            value: "hiddenDetailFollow",
            css: ".AnswerItem .AuthorInfo .FollowButton{display: none;}"
          },
          {
            label: "回答人下赞同数",
            value: "hiddenDetailVoters",
            css: ".AnswerItem .css-dvccr2{display: none;}"
          },
          {
            label: "问题关注和被浏览数",
            value: "hiddenQuestionSide",
            css: ".QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}"
          },
          {
            label: "赞赏按钮",
            value: "hiddenReward",
            css: ".Reward{display: none!important;}"
          },
          {
            label: "618红包链接",
            value: "hidden618HongBao",
            css: '.MCNLinkCard[data-mcn-source="淘宝"],.MCNLinkCard[data-mcn-source="京东"],.MCNLinkCard[data-mcn-source="知乎"]{display:none;}'
          }
        ],
        [
          {
            label: "回答底部发布编辑时间和IP",
            value: "hiddenAnswerItemTime",
            css: ".Question-main .ContentItem-time{display: none;margin: 0;}"
          },
          {
            label: "回答底部发布编辑时间（保留IP）",
            value: "hiddenAnswerItemTimeButHaveIP",
            css: ".Question-main .ContentItem-time>a{display: none;}.Question-main .ContentItem-time:empty{display: none;margin: 0;}"
          },
          {
            label: "回答底部「继续追问」模块",
            value: "hiddenAnswerKeepAsking",
            css: ".css-jghqwm{display: none!important;}"
          }
        ],
        [
          {
            label: "详情右侧信息栏",
            value: "hiddenAnswerRightFooter",
            css: ".Question-sideColumn{display: none!important;}.Question-main .Question-mainColumn,.ListShortcut{width: inherit;}"
          },
          {
            label: "信息栏关于作者",
            value: "hiddenAnswerRightFooterAnswerAuthor",
            css: ".Question-sideColumn .AnswerAuthor{display: none;}"
          },
          {
            label: "信息栏被收藏次数",
            value: "hiddenAnswerRightFooterFavorites",
            css: ".Question-sideColumn .AnswerAuthor + .Card{display: none;}"
          },
          {
            label: "信息栏相关问题",
            value: "hiddenAnswerRightFooterRelatedQuestions",
            css: '.Question-sideColumn [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}'
          },
          {
            label: "信息栏相关推荐",
            value: "hiddenAnswerRightFooterContentList",
            css: '.Question-sideColumn [data-za-detail-view-path-module="ContentList"]{display: none;}'
          },
          {
            label: "信息栏知乎指南",
            value: "hiddenAnswerRightFooterFooter",
            css: ".Question-sideColumn .Footer{display: none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_ARTICLE",
      name: "文章专栏",
      desc: "只在文章页面中隐藏相应内容",
      content: [
        [
          {
            label: "文章关联话题",
            value: "hiddenZhuanlanTag",
            css: ".Post-topicsAndReviewer{display: none!important;}"
          },
          {
            label: "文章标题图片",
            value: "hiddenZhuanlanTitleImage",
            css: ".css-1ntkiwo,.TitleImage,.css-78p1r9,.ArticleItem .RichContent>div:first-of-type:not(.RichContent-cover)>div:last-of-type{display: none!important;}"
          },
          {
            label: "文章悬浮分享按钮",
            value: "hiddenZhuanlanShare",
            css: ".zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}"
          },
          {
            label: "文章悬浮赞同按钮",
            value: "hiddenZhuanlanVoters",
            css: ".zhuanlan .Post-SideActions .like{display: none!important;}"
          },
          {
            label: "文章作者头像",
            value: "hiddenZhuanlanAvatarWrapper",
            css: ".zhuanlan .AuthorInfo-avatarWrapper{display: none;}.zhuanlan .AuthorInfo-content{margin-left:0;}"
          },
          {
            label: "文章作者姓名",
            value: "hiddenZhuanlanAuthorInfoHead",
            css: ".zhuanlan .AuthorInfo-head{display: none;}"
          },
          {
            label: "文章作者简介",
            value: "hiddenZhuanlanAuthorInfoDetail",
            css: ".zhuanlan .AuthorInfo-detail{display: none;}"
          },
          {
            label: "文章作者关注按钮",
            value: "hiddenZhuanlanFollowButton",
            css: ".zhuanlan .FollowButton{display: none;}"
          },
          {
            label: "文章底部知乎热榜",
            value: "hiddenZhuanlanButtonHot",
            css: ".zhuanlan .Post-Sub .css-1ildg7g{display: none;}"
          },
          {
            label: "内容所属专栏",
            value: "hiddenZhuanlanContributions",
            css: ".zhuanlan .PostIndex-Contributions{display: none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_USER_HOME",
      name: "用户主页",
      desc: "只在用户主页隐藏相应内容",
      content: [
        [
          {
            label: "用户主页付费咨询、认证和成就",
            value: "hiddenUserHomeOtherCard",
            css: ".Profile-sideColumn .Card:not(.Publications):not(.FollowshipCard){display:none;}"
          },
          {
            label: "用户主页出版作品",
            value: "hiddenUserHomePublications",
            css: ".Profile-sideColumn .Card.Publications{display:none;}"
          },
          {
            label: "用户主页创作中心",
            value: "hiddenUserHomeCreateEntrance",
            css: ".Profile-sideColumn .CreatorEntrance{display:none;}"
          },
          {
            label: "用户主页关注和关注者卡片",
            value: "hiddenUserHomeFollow",
            css: ".Profile-sideColumn .FollowshipCard{display:none;}"
          },
          {
            label: "用户主页关注的内容和赞助",
            value: "hiddenUserHomeLightList",
            css: ".Profile-sideColumn .Profile-lightList{display:none;}"
          },
          {
            label: "用户主页右侧屏蔽·举报用户、个人主页被浏览次数",
            value: "hiddenUserHomeFooterOperate",
            css: ".Profile-sideColumn .Profile-footerOperations{display:none;}"
          },
          {
            label: "用户主页知乎指南",
            value: "hiddenUserHomeFooter",
            css: ".Profile-sideColumn footer{display:none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_USER_COLLECTIONS",
      name: "收藏夹",
      desc: "只在我的收藏夹隐藏相应内容",
      content: [
        [
          {
            label: "收藏夹创作中心",
            value: "hiddenCollectionsCreate",
            css: ".Collections-container .Card.CreatorEntrance{display:none;}"
          },
          {
            label: "收藏夹推荐关注",
            value: "hiddenCollectionsRecommendFollow",
            css: '.Collections-container [data-za-detail-view-path-module="RightSideBar"]>div:last-of-type>.Card{display:none;}'
          },
          {
            label: "收藏夹圆桌入口",
            value: "hiddenCollectionsCategory",
            css: ".Collections-container .Card.GlobalSideBar-category{display:none;}"
          },
          {
            label: "收藏夹更多分类",
            value: "hiddenCollectionsComplementary",
            css: '.Collections-container .Card[aria-label="更多分类入口"]{display:none;}'
          },
          {
            label: "收藏夹知乎指南",
            value: "hiddenCollectionsFooter",
            css: ".Collections-container footer{display:none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_TOPIC",
      name: "话题",
      desc: "只在话题隐藏相应内容",
      content: [
        [
          {
            label: "话题主页右侧浏览/讨论量模块",
            value: "hiddenTopicRightNumberBoard",
            css: '[data-za-detail-view-path-module="TopicItem"] .Card .NumberBoard{display:none;}'
          },
          {
            label: "话题主页右侧父子话题模块",
            value: "hiddenTopicRightParentChild",
            css: '[data-za-detail-view-path-module="TopicItem"] .Card .Card-section{display:none;}'
          },
          {
            label: "话题主页右侧知乎指南",
            value: "hiddenTopicRightFooter",
            css: '[data-za-detail-view-path-module="TopicItem"] footer{display:none;}'
          }
        ]
      ]
    }
  ];
  var HIDDEN_ARRAY_MORE = [
    {
      keys: [
        "hiddenUserHomeOtherCard",
        "hiddenUserHomePublications",
        "hiddenUserHomeCreateEntrance",
        "hiddenUserHomeFollow",
        "hiddenUserHomeLightList",
        "hiddenUserHomeFooterOperate",
        "hiddenUserHomeFooter"
      ],
      value: ".Profile-sideColumn{display: none}"
    },
    {
      keys: ["hiddenSearchPageTopSearch", "hiddenSearchPageFooter"],
      value: ".SearchSideBar{display: none}"
    },
    {
      keys: ["hiddenHomeCreatorEntrance", "hiddenHomeRecommendFollow", "hiddenHomeCategory", "hiddenHomeCategoryMore", "hiddenHomeFooter"],
      value: ".Topstory-mainColumn{margin: 0 auto;}"
    },
    {
      keys: ["hiddenHomeListTabFollow", "hiddenHomeListTabRecommend", "hiddenHomeListTabHot", "hiddenHomeListTabVideo"],
      value: ".Topstory-container .TopstoryTabs{display: none}"
    },
    {
      keys: ["hiddenTopicRightNumberBoard", "hiddenTopicRightParentChild", "hiddenTopicRightFooter"],
      value: '[data-za-detail-view-path-module="TopicItem"]>div:nth-child(2){display: none;}'
    }
  ];
  var DE = [
    {
      title: "外部链接直接跳转",
      commit: "知乎里所有外部链接的重定向页面去除，点击将直接跳转到外部链接，不再打开知乎外部链接提示页面"
    },
    {
      title: "移除登录提示弹窗"
    },
    {
      title: "一键移除所有屏蔽话题，点击「话题黑名单」编辑按钮出现按钮",
      commit: '知乎<a href="https://www.zhihu.com/settings/filter" target="_blank">屏蔽页面</a>每次只显示部分内容，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽标签'
    },
    {
      title: "视频下载",
      commit: "可下载视频内容左上角将会生成一个下载按钮，点击即可下载视频"
    },
    {
      title: "收藏夹内容导出为 PDF（需开启接口拦截）",
      commit: "点击收藏夹名称上方「导出当前页内容」按钮，可导出当前页码的收藏夹详细内容"
    },
    {
      title: "个人主页关注订阅快捷取消关注",
      commit: "由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面<br>目前仅支持「我关注的问题」、「我关注的收藏」一键移除或添回关注"
    },
    {
      title: "预览静态图片键盘快捷切换",
      commit: "静态图片点击查看大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示"
    },
    {
      title: "用户主页-回答-导出当前页回答的功能（需开启接口拦截）"
    },
    {
      title: "用户主页-文章-导出当前页文章的功能（需开启接口拦截）"
    },
    {
      title: "一键邀请",
      commit: "问题邀请用户添加一键邀请按钮，点击可邀请所有推荐用户"
    }
  ];
  var BASIC_SHOW_CONTENT = [
    [
      {
        label: `列表标题类别显示<b style="color: #ec7259">「问题」</b><b style="color: #00965e">「文章」</b><b style="color: #12c2e9">「视频」</b><b style="color: #9c27b0">「想法」</b>`,
        value: "questionTitleTag"
      },
      { label: "列表点击高亮边框", value: "highlightListItem" },
      { label: "列表更多「···」按钮移动到最右侧", value: "fixedListItemMore" },
      { label: "推荐列表「不感兴趣」按钮", value: "listOutPutNotInterested", needFetch: true },
      { label: "推荐列表「直达问题」按钮", value: "listOutputToQuestion" }
    ],
    [
      { label: "赞同按钮仅显示数字", value: "justVoteNum" },
      { label: "评论按钮仅显示数字", value: "justCommitNum" }
    ],
    [
      { label: "回答顶部显示赞同人数", value: "topVote" },
      { label: "回答一键获取回答链接", value: "copyAnswerLink" },
      { label: "回答、文章顶部显示导出当前内容/回答按钮", value: "topExportContent" },
      { label: "回答、文章中视频替换为链接", value: "videoUseLink" }
    ],
    [
      { label: "用户主页内容置顶发布、修改时间", value: "userHomeContentTimeTop" },
      { label: "用户主页置顶「屏蔽用户」按钮", value: "userHomeTopBlockUser" }
    ],
    [
      { label: "推荐、关注列表内容置顶发布时间和最后修改时间", value: "listItemCreatedAndModifiedTime" },
      { label: "问题详情置顶创建时间和最后修改时间", value: "questionCreatedAndModifiedTime" },
      { label: "回答置顶创建时间与最后修改时间", value: "answerItemCreatedAndModifiedTime" },
      { label: "文章发布时间置顶", value: "articleCreateTimeToTop" }
    ],
    [
      { label: "取消评论输入框自动聚焦", value: "cancelCommentAutoFocus" },
      { label: "键盘ESC键关闭评论弹窗", value: "keyEscCloseCommentDialog" },
      { label: "点击空白处关闭评论弹窗", value: "clickMarkCloseCommentDialog" }
    ]
  ];
  var HIGH_PERFORMANCE = [
    [
      { label: "推荐列表高性能模式", value: "highPerformanceRecommend", tooltip: "推荐列表内容最多保留50条，超出则删除之前内容" },
      { label: "回答页高性能模式", value: "highPerformanceAnswer", tooltip: "回答列表最多保留30条回答，超出则删除之前回答" }
    ]
  ];
  var OPTIONS_MAP = {
    replaceZhidaToSearch: [
      { label: "不替换", value: "default" /* 不替换 */ },
      { label: "去除知乎直达跳转", value: "removeLink" /* 去除知乎直达跳转 */ },
      { label: "知乎", value: "zhihu" /* 知乎 */ },
      { label: "必应", value: "bing" /* 必应 */ },
      { label: "百度", value: "baidu" /* 百度 */ },
      { label: "谷歌", value: "google" /* 谷歌 */ }
    ],
    linkShopping: [
      { label: "默认", value: "0" /* 默认 */ },
      { label: "仅文字", value: "1" /* 仅文字 */ },
      { label: "隐藏", value: "2" /* 隐藏 */ }
    ],
    answerOpen: [
      { label: "默认", value: "default" /* 默认 */ },
      { label: "自动展开所有回答", value: "on" /* 自动展开所有回答 */ },
      { label: "默认收起长回答", value: "off" /* 默认收起长回答 */ }
    ],
    suspensionOpen: [
      { label: "左右", value: "0" /* 左右 */ },
      { label: "上下", value: "1" /* 上下 */ }
    ],
    zoomImageType: [
      { label: "默认尺寸", value: "0" /* 默认尺寸 */ },
      { label: "自定义尺寸", value: "2" /* 自定义尺寸 */ },
      { label: "原图尺寸", value: "1" /* 原图尺寸 */ }
    ],
    zoomImageHeight: [
      { label: "关闭", value: "0" /* 关闭 */ },
      { label: "开启", value: "1" /* 开启 */ }
    ],
    zoomListVideoType: [
      { label: "默认尺寸", value: "0" /* 默认尺寸 */ },
      { label: "自定义尺寸", value: "2" /* 自定义尺寸 */ }
    ]
  };
  var ICO_URL = {
    zhihu: "https://static.zhihu.com/heifetz/favicon.ico",
    github: "https://github.githubassets.com/pinned-octocat.svg",
    juejin: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png",
    csdn: "https://g.csdnimg.cn/static/logo/favicon32.ico",
    bilibili: "https://www.bilibili.com/favicon.ico",
    lanhu: "https://sso-cdn.lanhuapp.com/ssoweb/favicon.ico",
    yuque: "https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*vMxOQIh4KBMAAAAAAAAAAAAADvuFAQ/original",
    mailQQ: "https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_96h.png",
    mail163: "https://mail.163.com/favicon.ico",
    weibo: "https://weibo.com/favicon.ico",
    qzone: "https://qzonestyle.gtimg.cn/aoi/img/logo/favicon.ico?max_age=31536000",
    baidu: "https://www.baidu.com/favicon.ico"
  };
  var myStorage = {
    set: async function(name, value) {
      value.t = +/* @__PURE__ */ new Date();
      const v = JSON.stringify(value);
      localStorage.setItem(name, v);
      await GM.setValue(name, v);
    },
    get: async function(name) {
      const config = await GM.getValue(name);
      const configLocal = localStorage.getItem(name);
      const cParse = config ? JSON.parse(config) : null;
      const cLParse = configLocal ? JSON.parse(configLocal) : null;
      if (!cParse && !cLParse) return "";
      if (!cParse) return configLocal;
      if (!cLParse) return config;
      if (cParse.t < cLParse.t) return configLocal;
      return config;
    },
    getConfig: async function() {
      const nConfig = await this.get("pfConfig");
      return Promise.resolve(nConfig ? JSON.parse(nConfig) : {});
    },
    getHistory: async function() {
      const nHistory = await myStorage.get("pfHistory");
      const h = nHistory ? JSON.parse(nHistory) : { list: [], view: [] };
      return Promise.resolve(h);
    },
    updateConfigItem: async function(key, value) {
      const config = await this.getConfig();
      if (typeof key === "string") {
        config[key] = value;
      } else {
        for (let itemKey in key) {
          config[itemKey] = key[itemKey];
        }
      }
      await this.updateConfig(config);
    },
    updateConfig: async function(params) {
      await this.set("pfConfig", params);
    },
    updateHistoryItem: async function(key, params) {
      const pfHistory = await this.getHistory();
      pfHistory[key] = params.slice(0, SAVE_HISTORY_NUMBER);
      await this.set("pfHistory", pfHistory);
    },
    updateHistory: async function(value) {
      await this.set("pfHistory", value);
    }
  };
  var Store = class {
    constructor() {
      this.userinfo = void 0;
      this.findEvent = {
        header: { fun: null, num: 0, isFind: false }
      };
      this.storageConfig = {
        cacheTitle: "",
        fetchHeaders: {},
        headerDoms: {}
      };
      this.removeRecommends = [];
      this.commendAuthors = [];
      this.userAnswers = [];
      this.userArticle = [];
      this.removeAnswers = [];
      this.setUserinfo = this.setUserinfo.bind(this);
      this.getUserinfo = this.getUserinfo.bind(this);
      this.setFindEventItem = this.setFindEventItem.bind(this);
      this.getFindEventItem = this.getFindEventItem.bind(this);
      this.setStorageConfigItem = this.setStorageConfigItem.bind(this);
      this.getStorageConfigItem = this.getStorageConfigItem.bind(this);
      this.findRemoveRecommends = this.findRemoveRecommends.bind(this);
      this.getRemoveRecommends = this.getRemoveRecommends.bind(this);
      this.setUserAnswer = this.setUserAnswer.bind(this);
      this.getUserAnswer = this.getUserAnswer.bind(this);
      this.setUserArticle = this.setUserArticle.bind(this);
      this.getUserArticle = this.getUserArticle.bind(this);
      this.setCommentAuthors = this.setCommentAuthors.bind(this);
      this.getCommentAuthors = this.getCommentAuthors.bind(this);
      this.findRemoveAnswers = this.findRemoveAnswers.bind(this);
      this.getRemoveAnswers = this.getRemoveAnswers.bind(this);
    }
    setUserinfo(inner) {
      this.userinfo = inner;
    }
    getUserinfo() {
      return this.userinfo;
    }
    setFindEventItem(key, content) {
      this.findEvent[key] = content;
    }
    getFindEventItem(key) {
      return this.findEvent[key];
    }
    setStorageConfigItem(key, content) {
      this.storageConfig[key] = content;
    }
    getStorageConfigItem(key) {
      return this.storageConfig[key];
    }
    async findRemoveRecommends(recommends) {
      const { removeAnonymousQuestion, removeFromYanxuan } = await myStorage.getConfig();
      recommends.forEach((item) => {
        const target = item.target;
        if (!target) return;
        let message2 = "";
        if (removeFromYanxuan && target.paid_info) {
          message2 = "选自盐选专栏的回答";
        }
        if (removeAnonymousQuestion && target.question && target.question.author && !target.question.author.id) {
          message2 = "匿名用户的提问";
        }
        if (message2) {
          this.removeRecommends.push({
            id: String(item.target.id),
            message: message2
          });
        }
      });
    }
    getRemoveRecommends() {
      return this.removeRecommends;
    }
    setUserAnswer(data) {
      this.userAnswers = data;
    }
    getUserAnswer() {
      return this.userAnswers;
    }
    setUserArticle(data) {
      this.userArticle = data;
    }
    getUserArticle() {
      return this.userArticle;
    }
    async setCommentAuthors(authors) {
      this.commendAuthors = authors;
    }
    getCommentAuthors() {
      return this.commendAuthors;
    }
    async findRemoveAnswers(answers) {
      const { removeFromYanxuan } = await myStorage.getConfig();
      answers.forEach((item) => {
        let message2 = "";
        if (removeFromYanxuan && item.answerType === "paid" && item.labelInfo) {
          message2 = "已删除一条选自盐选专栏的回答";
        }
        if (message2) {
          this.removeAnswers.push({
            id: item.id,
            message: message2
          });
        }
      });
    }
    getRemoveAnswers() {
      return this.removeAnswers;
    }
  };
  var store = new Store();
  var dom = (n) => document.querySelector(n);
  var domById = (id) => document.getElementById(id);
  var domA = (n) => document.querySelectorAll(n);
  var domC = (name, attrObjs) => {
    const node = document.createElement(name);
    for (let key in attrObjs) {
      node[key] = attrObjs[key];
    }
    return node;
  };
  var domP = (node, attrName, attrValue) => {
    const nodeP = node.parentElement;
    if (!nodeP) return void 0;
    if (!attrName || !attrValue) return nodeP;
    if (nodeP === document.body) return void 0;
    const attrValueList = (nodeP.getAttribute(attrName) || "").split(" ");
    return attrValueList.includes(attrValue) ? nodeP : domP(nodeP, attrName, attrValue);
  };
  var insertAfter = (newElement, targetElement) => {
    const parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  };
  var fnReturnStr = (str, isHave = false, strFalse = "") => isHave ? str : strFalse;
  var fnLog = (...str) => console.log("%c「知乎修改器」", "color: green;font-weight: bold;", ...str);
  var fnAppendStyle = (id, innerHTML) => {
    const element = domById(id);
    element ? element.innerHTML = innerHTML : document.head.appendChild(domC("style", { id, type: "text/css", innerHTML }));
  };
  var fnDomReplace = (node, attrObjs) => {
    if (!node) return;
    for (let key in attrObjs) {
      node[key] = attrObjs[key];
    }
  };
  function throttle(fn, time = 300) {
    let tout = void 0;
    return function() {
      clearTimeout(tout);
      tout = setTimeout(() => {
        fn.apply(this, arguments);
      }, time);
    };
  }
  var pathnameHasFn = (obj) => {
    const { pathname } = location;
    for (let name in obj) {
      pathname.includes(name) && obj[name]();
    }
  };
  var windowResize = () => {
    window.dispatchEvent(new Event("resize"));
  };
  var mouseEventClick = (element) => {
    if (!element) return;
    const myWindow = isSafari ? window : unsafeWindow;
    const event = new MouseEvent("click", {
      view: myWindow,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  };
  var copy = async (value) => {
    if (navigator.clipboard && navigator.permissions) {
      await navigator.clipboard.writeText(value);
    } else {
      const domTextarea = domC("textArea", {
        value,
        style: "width: 0px;position: fixed;left: -999px;top: 10px;"
      });
      domTextarea.setAttribute("readonly", "readonly");
      document.body.appendChild(domTextarea);
      domTextarea.select();
      document.execCommand("copy");
      document.body.removeChild(domTextarea);
    }
  };
  var messageDoms = [];
  var message = (value, t = 3e3) => {
    const time = +/* @__PURE__ */ new Date();
    const classTime = `ctz-message-${time}`;
    const nDom = domC("div", {
      innerHTML: value,
      className: `${CLASS_MESSAGE} ${classTime}`
    });
    const domBox = domById(ID_MESSAGE_BOX);
    if (!domBox) return;
    domBox.appendChild(nDom);
    messageDoms.push(nDom);
    if (messageDoms.length > 3) {
      const prevDom = messageDoms.shift();
      prevDom && domBox.removeChild(prevDom);
    }
    setTimeout(() => {
      const nPrevDom = dom(`.${classTime}`);
      if (nPrevDom) {
        domById(ID_MESSAGE_BOX).removeChild(nPrevDom);
        messageDoms.shift();
      }
    }, t);
  };
  var createButtonFontSize12 = (innerHTML, extraCLass = "", extra = {}) => domC("button", {
    innerHTML,
    className: `ctz-button ${extraCLass}`,
    style: "margin-left: 8px;font-size: 12px;",
    ...extra
  });
  var judgeBrowserType = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Chrome")) return "Chrome";
    return "Safari";
  };
  var isSafari = judgeBrowserType() === "Safari";
  function formatDataToHump(data) {
    if (!data) return data;
    if (Array.isArray(data)) {
      return data.map((item) => {
        return typeof item === "object" ? formatDataToHump(item) : item;
      });
    } else if (typeof data === "object") {
      const nData = {};
      Object.keys(data).forEach((prevKey) => {
        const nKey = prevKey.replace(/\_(\w)/g, (_, $1) => $1.toUpperCase());
        nData[nKey] = formatDataToHump(data[prevKey]);
      });
      return nData;
    }
    return data;
  }
  var doFetchNotInterested = ({ id, type }) => {
    const nHeader = store.getStorageConfigItem("fetchHeaders");
    delete nHeader["vod-authorization"];
    delete nHeader["content-encoding"];
    delete nHeader["Content-Type"];
    delete nHeader["content-type"];
    const idToNum = +id;
    if (String(idToNum) === "NaN") {
      fnLog(`调用不感兴趣接口错误，id为NaN, 原ID：${id}`);
      return;
    }
    fetch("/api/v3/feed/topstory/uninterestv2", {
      body: `item_brief=${encodeURIComponent(JSON.stringify({ source: "TS", type, id: idToNum }))}`,
      method: "POST",
      headers: new Headers({
        ...nHeader,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      })
    }).then((res) => res.json());
  };
  var interceptionResponse = (res, pathRegexp, fn) => {
    if (pathRegexp.test(res.url)) {
      res.clone().json().then((r) => fn(r));
    }
  };
  var CTZ_HIDDEN_ITEM_CLASS = "ctz-hidden-item";
  var fnHidden = (ev, msg) => {
    ev.style.display = "none";
    ev.classList.add(CTZ_HIDDEN_ITEM_CLASS);
    fnLog(msg);
  };
  var fnJustNum = async (element) => {
    if (!element) return;
    const { justVoteNum, justCommitNum } = await myStorage.getConfig();
    const nodeVoteUp = element.querySelector(".VoteButton--up");
    if (justVoteNum && nodeVoteUp) {
      nodeVoteUp.style.cssText = "font-size: 14px!important;";
      nodeVoteUp.innerHTML = nodeVoteUp.innerHTML.replace("赞同 ", "");
    }
    if (justCommitNum) {
      const buttons = element.querySelectorAll(".ContentItem-actions button");
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        if (btn.innerHTML.includes("条评论")) {
          btn.style.cssText = "font-size: 14px!important;margin-top:-5px;";
          btn.innerHTML = btn.innerHTML.replace("条评论", "");
        }
      }
    }
  };
  var echoData = async () => {
    const pfConfig = await myStorage.getConfig();
    const textSameName = {
      globalTitle: (e) => e.value = pfConfig.globalTitle || document.title,
      customizeCss: (e) => e.value = pfConfig.customizeCss || ""
    };
    const echoText = (even) => textSameName[even.name] ? textSameName[even.name](even) : even.value = pfConfig[even.name] || "";
    const echo = {
      radio: (even) => pfConfig.hasOwnProperty(even.name) && String(even.value) === String(pfConfig[even.name]) && (even.checked = true),
      checkbox: (even) => even.checked = pfConfig[even.name] || false,
      text: echoText,
      number: echoText,
      range: (even) => {
        const nValue = pfConfig[even.name];
        const nodeRange = dom(`[name="${even.name}"]`);
        const min = nodeRange && nodeRange.min;
        const rangeNum = isNaN(+nValue) || !(+nValue > 0) ? min : nValue;
        even.value = rangeNum;
        const nodeNewOne = domById(even.name);
        nodeNewOne && (nodeNewOne.innerText = rangeNum);
      }
    };
    const doEcho = (item) => {
      echo[item.type] && echo[item.type](item);
    };
    const nodeArrInputClick = domA(`.${CLASS_INPUT_CLICK}`);
    for (let i = 0, len = nodeArrInputClick.length; i < len; i++) {
      doEcho(nodeArrInputClick[i]);
    }
    const nodeArrInputChange = domA(`.${CLASS_INPUT_CHANGE}`);
    for (let i = 0, len = nodeArrInputChange.length; i < len; i++) {
      doEcho(nodeArrInputChange[i]);
    }
    const nodeArrSelect = domA(`.${CLASS_SELECT}`);
    for (let i = 0, len = nodeArrSelect.length; i < len; i++) {
      const item = nodeArrSelect[i];
      item.value = pfConfig[item.name];
    }
    echo.text(dom('[name="globalTitle"]'));
    VERSION_RANGE.forEach((item) => {
      const isPercent = pfConfig[item.percentChooseValue];
      const domRange = dom(`.ctz-range-${item.value}`);
      const domRangePercent = dom(`.ctz-range-${item.percentValue}`);
      if (domRange && domRangePercent) {
        domRange.style.display = isPercent ? "none" : "flex";
        domRangePercent.style.display = !isPercent ? "none" : "flex";
      }
    });
  };
  var REGEXP_MESSAGE = /^\([^()]+\)/;
  var changeTitle = async () => {
    const { getStorageConfigItem } = store;
    const { globalTitle, globalTitleRemoveMessage } = await myStorage.getConfig();
    const cacheTitle = getStorageConfigItem("cacheTitle");
    let prevTitle = globalTitle || cacheTitle;
    if (globalTitleRemoveMessage) {
      if (REGEXP_MESSAGE.test(prevTitle)) {
        prevTitle = prevTitle.replace(REGEXP_MESSAGE, "").trim();
      }
    }
    document.title = prevTitle;
  };
  var changeICO = async () => {
    const { titleIco = "" } = await myStorage.getConfig();
    const nId = "CTZ_ICO";
    if (!ICO_URL[titleIco]) return;
    const nodeXIcon = dom('[type="image/x-icon"]');
    const nodeId = domById(nId);
    nodeXIcon && nodeXIcon.remove();
    nodeId && nodeId.remove();
    dom("head").appendChild(
      domC("link", {
        type: "image/x-icon",
        href: ICO_URL[titleIco],
        id: nId,
        rel: "icon"
      })
    );
  };
  var myLock = {
    append: async function(e, name) {
      if (!e) return;
      const lock = this.lock.class;
      const unlock = this.unlock.class;
      const lockMask = this.lockMask.class;
      const classRemove = "ctz-move-this";
      const iLock = domC("i", { className: `${this.lock.name}`, innerHTML: "☑︎" });
      const iUnlock = domC("i", { className: `${this.unlock.name}`, innerHTML: "☒" });
      const dLockMask = domC("div", { className: this.lockMask.name });
      !e.querySelector(lock) && e.appendChild(iLock);
      !e.querySelector(unlock) && e.appendChild(iUnlock);
      !e.querySelector(lockMask) && e.appendChild(dLockMask);
      const pfConfig = await myStorage.getConfig();
      e.querySelector(lock).onclick = async () => {
        await myStorage.updateConfigItem(name + "Fixed", true);
        e.classList.remove(classRemove);
      };
      e.querySelector(unlock).onclick = async () => {
        await myStorage.updateConfigItem(name + "Fixed", false);
        e.classList.add(classRemove);
      };
      if (pfConfig[name + "Fixed"] === false) {
        e.classList.add(classRemove);
      }
    },
    remove: function(e) {
      if (!e) return;
      const nodeLock = e.querySelector(this.lock.class);
      const nodeUnlock = e.querySelector(this.unlock.class);
      const nodeLockMask = e.querySelector(this.lockMask.class);
      nodeLock && nodeLock.remove();
      nodeUnlock && nodeUnlock.remove();
      nodeLockMask && nodeLockMask.remove();
    },
    lock: { class: ".ctz-lock", name: "ctz-lock" },
    unlock: { class: ".ctz-unlock", name: "ctz-unlock" },
    lockMask: { class: ".ctz-lock-mask", name: "ctz-lock-mask" }
  };
  var myScroll = {
    stop: () => dom("body").classList.add("ctz-stop-scroll"),
    on: () => dom("body").classList.remove("ctz-stop-scroll")
  };
  var echoHistory = async () => {
    const history = await myStorage.getHistory();
    const { list, view } = history;
    const nodeList = dom("#CTZ_HISTORY_LIST .ctz-set-content");
    const nodeView = dom("#CTZ_HISTORY_VIEW .ctz-set-content");
    nodeList && (nodeList.innerHTML = list.join(""));
    nodeView && (nodeView.innerHTML = view.join(""));
  };
  var initMenu = () => {
    const { hash } = location;
    const arrayHash = [...domA("#CTZ_DIALOG_MENU>div")].map((i) => i.getAttribute("data-href"));
    const chooseId = arrayHash.find((i) => i === hash || hash.replace(i, "") !== hash);
    fnChangeMenu(dom(`#CTZ_DIALOG_MENU>div[data-href="${chooseId || arrayHash[0]}"]`));
  };
  var CLASS_OPENED = "ctz-dropdown-open";
  var onChangeMenu = (event) => {
    const target = event.target;
    if (target.getAttribute("data-href")) {
      const dataHref = target.getAttribute("data-href") || "";
      location.hash = dataHref;
      fnChangeMenu(target);
      return;
    }
  };
  var fnChangeMenu = (target) => {
    const chooseId = (target.getAttribute("data-href") || "").replace(/#/, "");
    if (!chooseId) return;
    domA("#CTZ_DIALOG_MENU>div").forEach((item) => item.classList.remove("target"));
    domA("#CTZ_DIALOG_MAIN>div").forEach((item) => item.style.display = chooseId === item.id ? "block" : "none");
    target.classList.add("target");
    const commit = target.getAttribute("data-commit") || "";
    domById("CTZ_DIALOG_RIGHT_TITLE").innerHTML = `${target.innerText}<span>${commit}</span>`;
  };
  var openChange = () => {
    const nodeButton = domById("CTZ_OPEN_CLOSE");
    if (nodeButton.dataset.close === "1") {
      echoData();
      echoHistory();
      domById("CTZ_DIALOG").style.display = "flex";
      nodeButton.dataset.close = "0";
      myScroll.stop();
    } else {
      domA(".ctz-dropdown-icon").forEach((item) => item.classList.remove(CLASS_OPENED));
      const nodeDialog = domById("CTZ_DIALOG");
      nodeDialog.style.display = "none";
      nodeDialog.style.height = "";
      dom(`button[name="dialogBig"]`).innerText = "+";
      nodeButton.dataset.close = "1";
      myScroll.on();
    }
  };
  var openExtra = (type) => {
    const extra = domById(ID_EXTRA_DIALOG);
    const extraCover = domById("CTZ_EXTRA_OUTPUT_COVER");
    const elementsTypes = extra.children;
    for (let i = 0, len = elementsTypes.length; i < len; i++) {
      const item = elementsTypes[i];
      item.style.display = item.dataset.type === type ? "block" : "none";
    }
    extra.style.display = "block";
    extraCover.style.display = "block";
    extra.dataset.status = "open";
  };
  var closeExtra = () => {
    const extra = domById(ID_EXTRA_DIALOG);
    extra.dataset.status = "close";
    extra.style.display = "none";
    domById("CTZ_EXTRA_OUTPUT_COVER").style.display = "none";
  };
  var myMove = {
    init: function(eventName, configName, name) {
      const e = dom(eventName);
      if (e) {
        this.clicks[configName] = e.click;
        e.onmousedown = async (ev) => {
          const pfConfig = await myStorage.getConfig();
          if (pfConfig[`${name}Fixed`]) return;
          const event = window.event || ev;
          const bodyW = document.body.offsetWidth;
          const windowW = window.innerWidth;
          const windowH = window.innerHeight;
          const eW = e.offsetWidth;
          const eH = e.offsetHeight;
          const eL = e.offsetLeft;
          const eT = e.offsetTop;
          const evX = event.clientX;
          const evY = event.clientY;
          const dx = evX - eL;
          const dy = evY - eT;
          const rx = eW + eL - evX;
          document.onmousemove = (ev2) => {
            const eventN = window.event || ev2;
            const evNX = eventN.clientX;
            let evenLeft = 0;
            let evenRight = 0;
            const isR = this.useR.some((i) => i === name);
            if (isR) {
              const right = bodyW - evNX - rx;
              evenRight = right <= 0 ? 0 : right >= bodyW - eW ? bodyW - eW : right;
              e.style.right = evenRight + "px";
            } else {
              const left = evNX - dx;
              evenLeft = left <= 0 ? 0 : left >= windowW - eW ? windowW - eW : left;
              e.style.left = evenLeft + "px";
            }
            const top = eventN.clientY - dy;
            const evenTop = top <= 0 ? 0 : top >= windowH - eH ? windowH - eH : top;
            e.style.top = evenTop + "px";
            this.isMove = true;
            this.timer[configName] && clearTimeout(this.timer[configName]);
            this.timer[configName] = setTimeout(async () => {
              clearTimeout(this.timer[configName]);
              await myStorage.updateConfigItem(configName, `${isR ? `right: ${evenRight}px;` : `left: ${evenLeft}px;`}top: ${evenTop}px;`);
            }, 500);
          };
          document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            e.onclick = (e2) => {
              if (this.isMove) {
                this.isMove = false;
                return e2.preventDefault && e2.preventDefault();
              } else {
                return this.clicks[configName];
              }
            };
          };
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            return false;
          }
        };
      }
    },
    destroy: function(eventName) {
      const e = dom(eventName);
      e && (e.onmousedown = null);
    },
    isMove: false,
    clicks: {},
    timer: {},
    useL: ["suspensionHomeTab", "suspensionFind", "suspensionSearch"],
    useR: ["suspensionUser"]
  };
  var moveAndOpen = async () => {
    const openButton = domById("CTZ_OPEN_CLOSE");
    const prevConfig = await myStorage.getConfig();
    if (prevConfig.suspensionOpen === "1" /* 上下 */) {
      if (prevConfig.suspensionOpenUseTop) {
        openButton.style.top = "0";
      } else {
        openButton.style.bottom = "0";
      }
      if (prevConfig.suspensionOpenLeft) {
        openButton.style.top = prevConfig.suspensionOpenLeft;
      } else {
        openButton.style.bottom = prevConfig.suspensionOpenRight || "0";
      }
    } else {
      if (prevConfig.suspensionOpenUseLeft) {
        openButton.style.left = "0";
      } else {
        openButton.style.right = "0";
      }
      if (prevConfig.suspensionOpenTop) {
        openButton.style.top = prevConfig.suspensionOpenTop;
      } else {
        openButton.style.bottom = prevConfig.suspensionOpenBottom || "0";
      }
    }
    const formatPosition = (me, moveEvent, prevX, prevY) => {
      const realInnerWidth = domById("CTZ_COVER").offsetWidth;
      const realInnerHeight = domById("CTZ_COVER").offsetHeight;
      const left = moveEvent.clientX - prevX;
      const eventLeft = left <= 0 ? 0 : left;
      const right = realInnerWidth - eventLeft - 48;
      const eventRight = right <= 0 ? 0 : right;
      const top = moveEvent.clientY - prevY;
      const eventTop = top <= 0 ? 0 : top;
      const bottom = realInnerHeight - eventTop - 48;
      const eventBottom = bottom <= 0 ? 0 : bottom;
      const useTop = eventTop < realInnerHeight / 2;
      const useLeft = eventLeft < realInnerWidth / 2;
      return {
        useTop,
        useLeft,
        left: eventLeft,
        right: eventRight,
        top: eventTop,
        bottom: eventBottom
      };
    };
    openButton.onmousedown = async function(ev) {
      let isMove = false;
      const me = this;
      const config = await myStorage.getConfig();
      const eL = me.offsetLeft;
      const eT = me.offsetTop;
      const dx = ev.clientX - eL;
      const dy = ev.clientY - eT;
      me.style.transitionProperty = "none";
      document.onmousemove = (moveEvent) => {
        const { useTop, useLeft, top, left, bottom, right } = formatPosition(me, moveEvent, dx, dy);
        me.style.left = useLeft ? `${left}px` : "";
        me.style.right = !useLeft ? `${right}px` : "";
        me.style.top = useTop ? `${top}px` : "";
        me.style.bottom = !useTop ? `${bottom}px` : "";
        isMove = true;
      };
      document.onmouseup = (eventFinally) => {
        const { useTop, useLeft, top, left, bottom, right } = formatPosition(me, eventFinally, dx, dy);
        const isUpDown = config.suspensionOpen === "1" /* 上下 */;
        me.style.left = useLeft ? isUpDown ? `${left}px` : "0" : "";
        me.style.right = !useLeft ? isUpDown ? `${right}px` : "0" : "";
        me.style.top = useTop ? !isUpDown ? `${top}px` : "0" : "";
        me.style.bottom = !useTop ? !isUpDown ? `${bottom}px` : "0" : "";
        me.style.transitionProperty = "all";
        const suspension = {
          suspensionOpen: config.suspensionOpen || "0" /* 左右 */,
          suspensionOpenUseTop: useTop,
          suspensionOpenUseLeft: useLeft,
          suspensionOpenLeft: useLeft ? isUpDown ? `${left}px` : "0" : "",
          suspensionOpenRight: !useLeft ? isUpDown ? `${right}px` : "0" : "",
          suspensionOpenTop: useTop ? !isUpDown ? `${top}px` : "0" : "",
          suspensionOpenBottom: !useTop ? !isUpDown ? `${bottom}px` : "0" : ""
        };
        myStorage.updateConfig({
          ...config,
          ...suspension
        });
        document.onmousemove = null;
        document.onmouseup = null;
        me.onclick = (e) => {
          if (isMove) {
            e.preventDefault && e.preventDefault();
            return;
          } else {
            openChange();
            return;
          }
        };
      };
    };
  };
  var appendClassStart = (str) => appendPrefix(str, (i) => `[class|="${i}"]`);
  var appendPrefix = (str, mapCB) => str.split(",").map(mapCB).join(",");
  var myBackground = {
    init: async function() {
      const { themeDark = 1 /* 深色一 */, themeLight = 0 /* 默认 */, colorText1 } = await myStorage.getConfig();
      const useDark = await isDark();
      fnAppendStyle(
        "CTZ_STYLE_BACKGROUND",
        (useDark ? this.dark(themeDark) : this.light(themeLight)) + fnReturnStr(`.ContentItem-title, body{color: ${colorText1}!important;}`, !!colorText1)
      );
      const domHTML = dom("html");
      if (useDark) {
        domHTML.setAttribute("theme-dark", `${themeDark}`);
        domHTML.removeAttribute("theme-light");
      } else {
        domHTML.setAttribute("theme-light", `${themeLight}`);
        domHTML.removeAttribute("theme-dark");
      }
    },
    doSetCSS: function(bg1, bg2) {
      return `${this.cssBG1}{background-color: ${bg1}!important;}${this.cssBG2}{background-color:${bg2}!important;background:${bg2}!important;}${this.cssBGTransparent}{background-color: transparent!important;background: transparent!important;}${this.cssBG1Color}{color: ${bg1}!important}.SignContainer-content input:-webkit-autofill{-webkit-box-shadow: inset 0 0 0 30px ${bg2}!important;}`;
    },
    light: function(lightKey) {
      if (+lightKey === +0 /* 默认 */) return "";
      const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
      const nodeAppHeader = dom(".AppHeader");
      const nodeTopStoryC = dom(".Topstory>div:not(.Topstory-container)");
      const elementHC = nodeAppHeader ? nodeAppHeader.classList || [] : [];
      const haveTopAD = nodeTopStoryC && nodeTopStoryC.childElementCount;
      const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : "";
      return this.doSetCSS(background, background2) + `.MenuBar-root-rQeFm{border-color: ${background}!important;}${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : ".AppHeader"}{background-color:${background2}!important;background:${background2}!important;}`;
    },
    dark: function(darkKey) {
      const { background, background2 } = THEME_CONFIG_DARK[darkKey];
      return appendPrefix(
        this.doSetCSS(background, background2) + `.${CLASS_MESSAGE},.ctz-export-collection-box p,.Modal-content,.Modal-content div,.Menu-item.is-active,.Select-list button:active,.Select-list button:hover,.Popover-content button,.Modal-title,.zu-main div,.modal-dialog,.zh-profile-card div,.QuestionAnswers-answerAdd div,.QuestionAnswers-answerAdd label,.Tabs-link,.toolbar-section button,.css-yd95f6,.css-g9ynb2,.css-i9srcr,.css-i9srcr div,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 label,.css-arjme8 h1,.css-13brsx3,.css-1ta275q div,.Creator-mainColumn .Card div,.Comments-container div,.SettingsMain div,.KfeCollection-PayModal-modal div,.KfeCollection-CouponCard-selectLabel,.KfeCollection-CouponCard-optionItem-text,.KfeCollection-PayModal-modal-icon,.NavItemClassName,.LinkCard-title,.Creator div,.Creator span,.Modal-wrapper textarea,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.FeedbackModal-title,.css-r38x5n div,.css-1dwlho,.LiveDetailsPage-root-aLVPj div,.css-1b0ypf8 div,.css-1b0ypf8 a,.css-np3nxw div,.css-10ub9de,.css-1wbvd3d,.css-1f4cz9u,.css-y42e6l,.css-jiu0xt,.css-1myqwel,.PostEditor-wrapper>div:last-of-type div,.PostEditor-wrapper>div:last-of-type label,.ToolsQuestion a,.ToolsQuestion font,.utils-frostedGlassEffect-2unM div,.utils-frostedGlassEffect-2unM span,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.aria-primary-color-style.aria-secondary-background p,.aria-primary-color-style.aria-secondary-background h2,#feedLives div,#feedLives a,.Card-card-2K6v,.Card-card-2K6v div,.Card-card-2K6v h3,._Invite_container_30SP h2,._Invite_container_30SP h1,.ChatListGroup-SectionTitle .Zi,.Qrcode-container>div,.Qrcode-guide-message>div,.signQr-leftContainer button,.signQr-leftContainer a,.ExploreHomePage-square div,.ExploreHomePage-square a,.jsNavigable a,#TopstoryContent h2,[role="contentinfo"] div,.css-1e1wubc,.css-1e1wubc div,.css-12kq1qx,.css-172osot div,.css-172osot a:last-child,.css-f2jj4r,.css-10u695f,.css-wqf2py,.css-wmwsyx,.css-wmwsyx div,.CreatorSalt-personalInfo-name,.css-c3gbo3,.css-1ygg4xu blockquote,.css-r8ate4,.ant-collapse>.ant-collapse-item>.ant-collapse-header,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover,.Creator-salt-author-welfare .Creator-salt-author-welfare-card h1,.css-u56wtg,.css-1hrberl,.css-13e6wvn,.css-i0heim,.CommentContent,${appendClassStart(
          "index-title,CourseConsultation-tip,index-text,index-number,CourseDescription-playCount,LecturerList-title,LearningRouteCard-title,index-tabItemLabel,VideoCourseCard-module,TextTruncation-module"
        )}{color: #f7f9f9!important}css-1x3upj1,.PlaceHolder-inner,.PlaceHolder-mask path,.css-1kxql2v{color: ${background2}!important}.css-1esjagr,.css-ruirke,.css-117anjg a.UserLink-link,.RichContent--unescapable.is-collapsed .ContentItem-rightButton,.css-1qap1n7,.ContentItem-more,.ContentItem-title a:hover,.Profile-lightItem:hover,.Profile-lightItem:hover .Profile-lightItemValue,.css-p54aph:hover,.PushNotifications-item a:hover,.PushNotifications-item a,.NotificationList-Item-content .NotificationList-Item-link:hover,.SettingsQA a,a.QuestionMainAction:hover,.SimilarQuestions-item .Button,.CreatorSalt-IdentitySelect-Button,.signQr-leftContainer button:hover,.signQr-leftContainer a:hover,.Profile-sideColumnItemLink:hover,.FollowshipCard-link,.css-zzimsj:hover,.css-vphnkw,.css-1aqu4xd,.css-6m0nd1,.NumberBoard-item.Button:hover .NumberBoard-itemName, .NumberBoard-item.Button:hover .NumberBoard-itemValue, .NumberBoard-itema:hover .NumberBoard-itemName, .NumberBoard-itema:hover .NumberBoard-itemValue,a.external,.RichContent-EntityWord,.SideBarCollectionItem-title,.Tag-content,.LabelContainer div,.LabelContainer a,.KfeCollection-OrdinaryLabel-newStyle-mobile .KfeCollection-OrdinaryLabel-content,.KfeCollection-OrdinaryLabel-newStyle-pc .KfeCollection-OrdinaryLabel-content,.KfeCollection-CreateSaltCard-button,.KfeCollection-PcCollegeCard-searchMore{color: deepskyblue!important;}.css-1tu59u4,.ZDI,.ZDI--PencilCircleFill24,.Zi,.Zi--ArrowDown{fill: deepskyblue!important;}.ztext pre,.ztext code{background: ${background}!important;}.ctz-button{background: ${background2};border-color: #f7f9f9;color: #f7f9f9;}`,
        (i) => `html[data-theme=dark] ${i}`
      );
    },
    cssBG1: `body,.Input-wrapper,.toolbar-section button:hover,.VideoAnswerPlayer-stateBar,.skeleton,.Community-ContentLayout,.css-i9srcr,.css-i9srcr div,.css-127i0sx,.css-1wi7vwy,.css-1ta275q,.css-mk7s6o,.css-1o83xzo .section div,.PostItem,.Report-list tr:nth-child(odd),.LinkCard.new,.Post-content,.Post-content .ContentItem-actions,.Messages-newItem,.Modal-wrapper textarea,.New-RightCard-Outer-Dark,.WriteIndexLayout-main,.Messages-item:hover,.Menu-item.is-active,.css-djayhh,.css-5i468k,.css-1iazx5e div,.LiveDetailsPage-root-aLVPj,.WikiLanding,.GlobalSideBar-navLink:hover,.Popover-arrow:after,.Sticky button:hover,.Sticky button:hover div,.Sticky button:hover span,.Sticky a:hover,.Sticky a:hover button,.Sticky a:hover div,.Sticky a:hover span,.Sticky li:hover,.Popover-content button:hover,.css-1j8bif6>.css-11v6bw0,.css-1e1wubc,.css-1svx44c,.css-5d3bqp,.index-videoCardItem-bzeJ1,.KfeCollection-IntroCard-newStyle-mobile,.KfeCollection-IntroCard-newStyle-pc,.FeeConsultCard,.Avatar,.TextMessage-sender,.ChatUserListItem--active,.css-yoby3j,.css-wmwsyx,.css-wmwsyx button,.css-82b621,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-item:hover,.index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza,.index-courseCard-ebw4r,${appendClassStart("Tabs-container,EpisodeList-sectionItem")}`,
    cssBG2: `.${CLASS_MESSAGE},.Card,.HotItem,.AppHeader,.Topstory-content>div,.PlaceHolder-inner,.PlaceHolder-bg,.ContentItem-actions,.QuestionHeader,.QuestionHeader-footer ,.QZcfWkCJoarhIYxlM_sG,.Sticky,.SearchTabs,.Modal-inner,.Modal-content,.Modal-content div,.Select-list button:active,.Select-list button:hover,.modal-dialog,.modal-dialog-buttons,.zh-profile-card div,.QuestionAnswers-answerAdd div,.css-1j23ebo,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 h1,.css-2lvw8d,.css-1os3m0m,.css-r38x5n div,.css-1mbpn2d,.css-1yjqd5z,.Creator-mainColumn .Card>div,.Creator-mainColumn section,.Topbar,.AutoInviteItem-wrapper--desktop,.ProfileHeader-wrapper,.NotificationList,.SettingsFAQ,.SelectorField-options .Select-option.is-selected,.SelectorField-options .Select-option:focus,.KfeCollection-PayModal-modal,.KfeCollection-PayModal-modal div,.Community,.Report-header th,.Report-list tr:nth-child(2n),.Report-Pagination,.CreatorIndex-BottomBox-Item,.CreatorSalt-letter-wrapper,.ColumnPageHeader,.WriteIndexLayout-main>div,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.PostEditor-wrapper>div:last-of-type div,.Creator-salt-new-author-content,.Select-option:focus,.ToolsQuestion div,[role="tablist"],.Topic-bar,.List-item .ZVideoToolbar button,.Creator-salt-author-welfare .Creator-salt-author-welfare-card,.Creator-salt-author-welfare-banner,#AnswerFormPortalContainer div,.CreatorTable-tableHead,.BalanceTransactionList-Item,.utils-frostedGlassEffect-2unM,#feedLives,#feedLives div,#feedLives a,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.css-1o83xzo,.css-1o83xzo .section,.css-1cr4989,.css-xoei2t,.css-slqtjm,.css-1615dnb div,.css-1oqbvad,.css-1oqbvad div,.css-lxxesj div:not(.css-zprod5),.Card-card-2K6v,.Card-card-2K6v div,.LiveDetailsPage-root-aLVPj div,.LiveFooter-root-rXuoG,.css-1b0ypf8 div,.css-np3nxw div,.css-1i12cbe,.PubIndex-CategoriesHeader,.ColumnHomeColumnCard,.Home-tabs,.Home-tabs div,.Home-swiper-container,.Home-swiper-container div,.BottomBarContainer,.ResponderPage-root div,.WikiLandingItemCard,.WikiLandingEntryCard,._Invite_container_30SP,._Invite_container_30SP div,._Coupon_intro_1kIo,._Coupon_list_2uTb div,.ExploreHomePage-square div,.ExploreHomePage-ContentSection-moreButton a,.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreColumnCard,.Notification-white,.QuestionAnswers-answerAdd .InputLike,.QuestionAnswers-answerAdd .InputLike div,.InputLike,.CreatorSalt-community-story-wrapper .CreatorSalt-community-story-table,.Popover-content,.Notifications-footer,.Messages-footer,.Popover-arrow:after,.css-97fdvh>div,.css-4lspwd,.css-1e6hvbc,.css-k32okj,.ant-table-tbody>tr.ant-table-placeholder:hover>td,.SettingsMain>div div:not(.StickerItem-Border):not(.SettingsMain-sideColumn):not(.UserHeader-VipBtn):not(.UserHeader-VipTip):not(.css-60n72z div),.CreatorSalt-community-story-wrapper,.css-guh6n2,.css-yqosku,.css-kt4t4n,.css-1j8bif6>div,.css-nffy12:hover,.css-1eltcns,.css-9kvgnm,.css-jd7qm7,.css-19vq0tc,.css-rzwcnm,.css-1akh9z6,.ListShortcut>div:not(.Question-mainColumn),.Chat,.ActionMenu,.Recommendations-Main,.KfeCollection-PcCollegeCard-root,.CreatorSalt-sideBar-wrapper,.ant-menu,.signQr-container,.signQr-rightContainer>div,.Login-options,.Input-wrapper>input,.SignFlowInput-errorMask,.Write-school-search-bar .CreatorSalt-management-search,.CreatorSalt-Content-Management-Index,.Topstory-container .TopstoryTabs>a::after,.ZVideo,.KfeCollection-CreateSaltCard,.CreatorSalt-personalInfo,.CreatorSalt-sideBar-item,.css-d1sc5t,.css-1gvsmgz,.css-u56wtg,.css-1hrberl,.CreatorSalt-community-story-wrapper .CreatorSalt-community-story-header,.ant-table-tbody>tr>td,.CreatorSalt-management-wrapper .CreatorSalt-management-search,.ant-table-thead .ant-table-cell,.QuestionWaiting-typesTopper,${appendClassStart(
      "App-root,PcContent-root,TopNavBar-root,CourseConsultation-corner,CourseConsultation-cornerButton,CornerButtonToTop-cornerButton,LearningRouteCard-pathContent,index-item,index-hoverCard,ShelfTopNav-root,ProductCard-root,NewOrderedLayout-root,Tabs-tabHeader,ButtonBar-root,WebPage-root,LearningPathWayCard-pathItem,VideoCourseList-title,Article-header,PcContent-coverFix,index-module,TopNavBar-module,PcContent-module,CourseRecord-module,Learned-module,Tab-module,PcContentBought-module,Media-module"
    )}`,
    cssBGTransparent: `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn,.css-3dzt4y,.css-u4sx7k,.VideoPlaceholderContainer>section,.MoreAnswers .List-headerText,.ColumnHomeTop:before,.ColumnHomeBottom,.Popover button,.ChatUserListItem .Chat-ActionMenuPopover-Button`,
    cssBG1Color: `.css-z0izby`
  };
  var myCustomStyle = {
    init: async function() {
      const { customizeCss = "" } = await myStorage.getConfig();
      dom('[name="textStyleCustom"]').value = customizeCss;
      this.change(customizeCss);
    },
    change: (innerCus) => fnAppendStyle("CTZ_STYLE_CUSTOM", innerCus)
  };
  var onUseThemeDark = async () => {
    dom("html").setAttribute("data-theme", await isDark() ? "dark" : "light");
  };
  var checkThemeDarkOrLight = () => {
    onUseThemeDark();
    const elementHTML = dom("html");
    const muConfig = { attribute: true, attributeFilter: ["data-theme"] };
    if (!elementHTML) return;
    const muCallback = async function() {
      const themeName = elementHTML.getAttribute("data-theme");
      const dark = await isDark();
      if (themeName === "dark" && !dark || themeName === "light" && dark) {
        onUseThemeDark();
      }
    };
    const muObserver = new MutationObserver(muCallback);
    muObserver.observe(elementHTML, muConfig);
  };
  var isDark = async () => {
    const { theme = 2 /* 自动 */ } = await myStorage.getConfig();
    if (+theme === 2 /* 自动 */) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return +theme === 1 /* 深色 */;
  };
  var addBackgroundSetting = () => {
    const radioBackground = (name, value, background, color, label, primary) => `<label class="ctz-background-item">${`<input class="${CLASS_INPUT_CLICK}" name="${name}" type="radio" value="${value}"/><div class="ctz-background-item-div" style="background: ${primary || background};color: ${color}"></div><div class="ctz-background-item-border"></div><div class="ctz-background-item-name">${label}</div>`}</label>`;
    const themeToRadio = (o, className, color) => Object.keys(o).map((key) => radioBackground(className, key, o[key].background, color, o[key].name, o[key].primary)).join("");
    dom(".ctz-set-background").innerHTML = `<div class="ctz-form-box-item">${`<div>主题</div><div id="CTZ_BACKGROUND">${THEMES.map((i) => radioBackground(INPUT_NAME_THEME, i.value, i.background, i.color, i.label, i.background)).join("")}</div>`}</div><div class="ctz-form-box-item">${`<div>浅色主题</div><div id="CTZ_BACKGROUND_LIGHT">${themeToRadio(THEME_CONFIG_LIGHT, INPUT_NAME_ThEME_LIGHT, "#000")}</div>`}</div><div class="ctz-form-box-item">${`<div>深色主题</div><div id="CTZ_BACKGROUND_DARK">${themeToRadio(THEME_CONFIG_DARK, INPUT_NAME_THEME_DARK, "#f7f9f9")}</div>`}</div>`;
  };
  var doHighlightOriginal = async (backgroundHighlightOriginal = "", themeDark, themeLight) => "background: " + (backgroundHighlightOriginal ? `${backgroundHighlightOriginal}!important;` : await isDark() ? `${THEME_CONFIG_DARK[themeDark].background2}!important;` : +themeLight === 0 /* 默认 */ ? "rgb(251,248,241)!important;" : `${THEME_CONFIG_LIGHT[themeLight].background}!important;`);
  var CLASS_VIDEO_ONE = ".css-1h1xzpn";
  var CLASS_VIDEO_TWO = ".VideoAnswerPlayer-video";
  var NEED_LINK_CLASS = [CLASS_VIDEO_ONE, CLASS_VIDEO_TWO];
  var findDoms = (nodeFound, domNames) => {
    const doms = domNames.map((i) => nodeFound.querySelectorAll(i));
    for (let i = 0, len = doms.length; i < len; i++) {
      if (doms[i].length) {
        return doms[i];
      }
    }
    return doms[doms.length - 1];
  };
  var initVideoDownload = async (nodeFound) => {
    if (!nodeFound) return;
    const { videoUseLink } = await myStorage.getConfig();
    const domVideos = findDoms(
      nodeFound,
      [".ZVideo-player>div", CLASS_VIDEO_ONE, CLASS_VIDEO_TWO].filter((i) => {
        return videoUseLink ? !NEED_LINK_CLASS.includes(i) : true;
      })
    );
    for (let i = 0, len = domVideos.length; i < len; i++) {
      const domVideoBox = domVideos[i];
      const nDomDownload = domC("i", { className: "ctz-video-download", innerHTML: "⤓" });
      const nDomLoading = domC("i", { className: "ctz-loading", innerHTML: "↻", style: "color: #fff;position: absolute;top: 20px;left: 20px;" });
      nDomDownload.onclick = function() {
        const me = this;
        const srcVideo = domVideoBox.querySelector("video").src;
        if (srcVideo) {
          me.style.display = "none";
          domVideoBox.appendChild(nDomLoading);
          videoDownload(srcVideo, `video${+/* @__PURE__ */ new Date()}`).then(() => {
            me.style.display = "block";
            nDomLoading.remove();
          });
        }
      };
      const nodeDownload = domVideoBox.querySelector(".ctz-video-download");
      nodeDownload && nodeDownload.remove();
      domVideoBox.style.cssText += `position: relative;`;
      domVideoBox.appendChild(nDomDownload);
    }
  };
  var videoDownload = async (url, name) => {
    return fetch(url).then((res) => res.blob()).then((blob) => {
      const objectUrl = window.URL.createObjectURL(blob);
      const elementA = domC("a", {
        download: name,
        href: objectUrl
      });
      elementA.click();
      window.URL.revokeObjectURL(objectUrl);
      elementA.remove();
    });
  };
  var fixVideoAutoPlay = () => {
    var originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      if (!this.offsetHeight) {
        return;
      }
      return originalPlay.apply(this, arguments);
    };
  };
  var myVersion = {
    init: async function() {
      fnAppendStyle("CTZ_STYLE_VERSION", await this.content());
    },
    change: function() {
      this.initAfterLoad();
      this.init();
    },
    initAfterLoad: async function() {
      const pfConfig = await myStorage.getConfig();
      domById("CTZ_IMAGE_SIZE_CUSTOM").style.display = pfConfig.zoomImageType === "2" /* 自定义尺寸 */ ? "flex" : "none";
      domById("CTZ_IMAGE_HEIGHT_CUSTOM").style.display = pfConfig.zoomImageHeight === "1" /* 开启 */ ? "flex" : "none";
      domById("CTZ_LIST_VIDEO_SIZE_CUSTOM").style.display = pfConfig.zoomListVideoType === "2" /* 自定义尺寸 */ ? "flex" : "none";
    },
    content: async function() {
      const {
        commitModalSizeSameVersion,
        versionHome,
        versionAnswer,
        versionArticle,
        versionHomeIsPercent,
        versionHomePercent,
        versionAnswerIsPercent,
        versionAnswerPercent,
        versionArticleIsPercent,
        versionArticlePercent,
        zoomImageType,
        zoomImageHeight,
        zoomImageHeightSize,
        zoomImageSize,
        zoomListVideoSize,
        zoomListVideoType,
        fixedListItemMore,
        questionTitleTag,
        themeDark = 1 /* 深色一 */,
        themeLight = 0 /* 默认 */,
        suspensionHomeTabPo,
        suspensionHomeTab,
        suspensionFindPo,
        suspensionUserPo,
        suspensionSearchPo,
        highlightListItem,
        linkShopping,
        fontSizeForList,
        fontSizeForAnswer,
        fontSizeForArticle,
        fontSizeForListTitle,
        fontSizeForAnswerTitle,
        fontSizeForArticleTitle,
        contentLineHeight,
        videoUseLink,
        suspensionPickUp,
        suspensionPickupRight
      } = await myStorage.getConfig();
      const dark = await isDark();
      const versionSizeHome = !versionHomeIsPercent ? `${versionHome || "1000"}px` : `${versionHomePercent || "70"}vw`;
      const versionSizeAnswer = !versionAnswerIsPercent ? `${versionAnswer || "1000"}px` : `${versionAnswerPercent || "70"}vw`;
      const versionSizeArticle = !versionArticleIsPercent ? `${versionArticle || "1000"}px` : `${versionArticlePercent || "70"}vw`;
      const xxxWidth = `.Topstory-mainColumn,.SearchMain{width: ${versionSizeHome}!important;}.Question-main,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content{width: ${versionSizeAnswer}!important;}.Post-NormalMain .Post-Header,.Post-NormalMain>div,.Post-NormalSub>div,.zhuanlan .css-1xy3kyp,.zhuanlan .css-1voxft1,.zhuanlan .css-9w3zhd{width: ${versionSizeArticle}!important;}.zhuanlan .Post-SideActions{right: ${!versionArticleIsPercent ? `calc(50vw - ${+(versionArticle || "1000") / 2 + 150}px)` : `calc(50vw - ${+(versionArticlePercent || "70") / 2}vw + 150px)`}}.Topstory-mainColumn,.SearchMain,.Question-main,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content,.Post-NormalMain .Post-Header,.Post-NormalMain>div,.Post-NormalSub>div,.${CLASS_ZHIHU_COMMENT_DIALOG},.Topstory-body .${CLASS_ZHIHU_COMMENT_DIALOG},.PostIndex-body .${CLASS_ZHIHU_COMMENT_DIALOG}{min-width: ${VERSION_MIN_WIDTH}px!important;}` + fnReturnStr(
        `.Topstory-body .${CLASS_ZHIHU_COMMENT_DIALOG}{width: ${versionSizeHome}!important;}.PostIndex-body .${CLASS_ZHIHU_COMMENT_DIALOG}{width: ${versionSizeArticle}!important;}` + fnReturnStr(`.${CLASS_ZHIHU_COMMENT_DIALOG}{width: ${versionSizeAnswer}!important;}`, location.pathname.includes("question")) + commitModalSizeSameVersion
      );
      const xxxImage = `img.lazy,img.origin_image,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image,.ztext figure .origin_image,.TitleImage{${(zoomImageHeight === "1" /* 开启 */ ? `max-height: ${zoomImageHeightSize}px!important;width: auto!important;` : "") || (zoomImageType === "2" /* 自定义尺寸 */ ? `width: ${zoomImageSize}px!important;cursor: zoom-in!important;max-width: 100%!important;` : "")}}`;
      const xxxVideo = `.ZVideoItem>div:first-of-type{${fnReturnStr(`width: ${zoomListVideoSize}px!important;`, zoomListVideoType === "2" /* 自定义尺寸 */)}}`;
      const xxxListMore = fnReturnStr(
        `.Topstory-container .ContentItem-actions .ShareMenu ~ div.ContentItem-action{visibility: visible!important;position: absolute;top: 20px;right: 10px;}`,
        fixedListItemMore
      );
      const xxxTitleTag = fnReturnStr(
        `.AnswerItem .ContentItem-title::before{content:'「问答」';color:#ec7259;font-size:14px;}.TopstoryItem .PinItem::before{content:'「想法」';font-size:14px;color:#9c27b0;margin-right:6px;font-weight:normal;display:inline;}.PinItem>.ContentItem-title{margin-top:4px;}.ZvideoItem .ContentItem-title::before{content:'「视频」';font-size:14px;color:#12c2e9}.ZVideoItem .ContentItem-title::before{content:'「视频」';font-size:14px;color:#12c2e9}.ArticleItem .ContentItem-title::before{content:'「文章」';font-size:14px;color:#00965e}.TopstoryQuestionAskItem .ContentItem-title::before{content:'「提问」';font-size:14px;color:#533b77}`,
        questionTitleTag
      );
      const xxxSusHomeTab = fnReturnStr(
        `.Topstory-container .TopstoryTabs{${suspensionHomeTabPo}position:fixed;z-index:100;display:flex;flex-direction:column;height:initial!important;}.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}.Topstory-container .TopstoryTabs>a::after{font-size:16px !important;display:inline-block;padding:6px 8px;margin-bottom:4px;border:1px solid #999999;color:#999999;background: ${dark ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background || "transparent"};}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link {margin:0!important}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after{color:#0066ff!important;border-color:#0066ff!important;}.Topstory [aria-controls='Topstory-recommend']::after{content:'推';}.Topstory [aria-controls='Topstory-follow']::after{content:'关';border-top-left-radius:4px;border-top-right-radius:4px;}.Topstory [aria-controls='Topstory-hot']::after{content:'热';}.Topstory [aria-controls="Topstory-zvideo"]::after{content:'视';border-bottom-left-radius:4px;border-bottom-right-radius:4px}.Topstory-tabs{border-color: transparent!important;}`,
        suspensionHomeTab
      );
      const xxxSusHeader = `.position-suspensionFind{${suspensionFindPo}}.position-suspensionUser{${suspensionUserPo}}.position-suspensionSearch{${suspensionSearchPo}}.position-suspensionFind .Tabs-link{border:1px solid #999999;color:#999999;background: ${dark ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background || "transparent"};}.position-suspensionFind .Tabs-link.is-active{color:#0066ff!important;border-color:#0066ff!important;}.position-suspensionUser .css-1m60na {display: none;}.position-suspensionUser .css-1n0eufo{margin-right: 0;}`;
      const xxxHighlight = highlightListItem ? `.List-item:focus,.TopstoryItem:focus,.HotItem:focus{box-shadow:0 0 0 2px #fff,0 0 0 5px rgba(0, 102, 255, 0.3)!important;outline:none!important;transition:box-shadow 0.3s!important;}` : `.List-item:focus,.Card:focus::before{box-shadow: none!important;}`;
      const cssShoppingLinkObj = {
        ["0" /* 默认 */]: "",
        ["1" /* 仅文字 */]: '.MCNLinkCard-imageContainer,.MCNLinkCard-button,.MCNLinkCard-source,.ecommerce-ad-commodity-img,.ecommerce-ad-commodity-box-icon,.RichText-MCNLinkCardContainer .BottomInfo,.CPSCommonCard-imageBox,.RedPacketCard-imageBox,.CPSCommonCard-tool,.CPSCommonCard-subtitle,.RedPacketCard-subtitle,.RedPacketCard-tool{display: none!important;}.MCNLinkCard,.MCNLinkCard-card,.ecommerce-ad-commodity,.RichText-MCNLinkCardContainer .GoodsRecommendCard,.CPSCommonCard,.RedPacketCard-info,.RedPacketCard{min-height: 0!important;background: transparent!important;width:100%!important;max-width:100%!important;}.MCNLinkCard-cardContainer,.ecommerce-ad-commodity,.ecommerce-ad-commodity-main,.RedPacketCard,.CPSCommonCard{padding: 0!important;}.MCNLinkCard,.MCNLinkCard-info{margin: 0!important;}.MCNLinkCard-info,.ecommerce-ad-commodity-main{flex-direction: row!important;}.MCNLinkCard-price{padding-left: 12px;}.ecommerce-ad-commodity-box .ecommerce-ad-commodity{height: auto!important;}.ecommerce-ad-commodity-box-main-second{width: auto!important;}.MCNLinkCard-titleContainer,.ecommerce-ad-commodity-main-content-des span,.CPSCommonCard-title,.RedPacketCard-title{color: #fd8d55!important;justify-content: start!important;}.MCNLinkCard-titleContainer::before,.ecommerce-ad-commodity-main-content-des span::before,.CPSCommonCard-title::before,.RedPacketCard-title::before{content: "购物链接："}.MCNLinkCard-title{color: #fd8d55!important;}',
        ["2" /* 隐藏 */]: "a.MCNLinkCard,.RichText-ADLinkCardContainer,.ecommerce-ad-commodity-box,.ecommerce-ad-box,.RichText-MCNLinkCardContainer{display: none!important;}"
      };
      const xxxShoppingLink = cssShoppingLinkObj[linkShopping || "0" /* 默认 */];
      const xxxFontSize = fnReturnStr(
        `.Topstory-body .RichContent-inner,.Topstory-body .ctz-list-item-time,.Topstory-body .CommentContent,.SearchResult-Card .RichContent-inner,.SearchResult-Card .CommentContent,.HotItem-excerpt--multiLine{font-size: ${fontSizeForList}px!important;}`,
        !!fontSizeForList
      ) + fnReturnStr(`.Question-main .RichContent-inner,.Question-main .ctz-list-item-time,.Question-main .CommentContent{font-size: ${fontSizeForAnswer}px}`, !!fontSizeForAnswer) + fnReturnStr(`.zhuanlan .Post-RichTextContainer,.zhuanlan .ctz-article-create-time,.zhuanlan .CommentContent{font-size: ${fontSizeForArticle}px}`, !!fontSizeForArticle) + fnReturnStr(`.zhuanlan .Post-Main .Post-Title{font-size: ${fontSizeForArticleTitle}px;}`, !!fontSizeForArticleTitle) + fnReturnStr(`.ContentItem-title,.HotItem-title{font-size: ${fontSizeForListTitle}px!important;}`, !!fontSizeForListTitle) + fnReturnStr(`.QuestionHeader-title{font-size: ${fontSizeForAnswerTitle}px!important;}`, !!fontSizeForAnswerTitle) + fnReturnStr(`p {line-height: ${contentLineHeight}px;}`, !!contentLineHeight);
      const xxxVideoLink = fnReturnStr(
        `${CLASS_VIDEO_ONE}>div,${CLASS_VIDEO_ONE}>i{display: none;}${CLASS_VIDEO_ONE}{padding: 0!important;height:24px!important;width: fit-content!important;}${CLASS_VIDEO_ONE}::before{content: '视频链接，点击跳转 >>';cursor:pointer;color: #1677ff}${CLASS_VIDEO_ONE}:hover::before{color: #b0b0b0}${CLASS_VIDEO_TWO}::before,${CLASS_VIDEO_TWO}>i{display: none;}`,
        videoUseLink
      );
      const nodeContentBox = domById("TopstoryContent") || dom(".Question-mainColumn") || domById("SearchMain") || dom(".Profile-mainColumn") || dom(".CollectionsDetailPage-mainColumn") || document.body;
      let suspensionRight = +(suspensionPickupRight || 0);
      if (nodeContentBox) {
        suspensionRight = window.innerWidth - nodeContentBox.getBoundingClientRect().width - nodeContentBox.getBoundingClientRect().left + +(suspensionPickupRight || 0);
      }
      const xxxSuspensionPickUp = fnReturnStr(`.ContentItem-actions.Sticky.is-fixed button[data-zop-retract-question="true"]{right: ${suspensionRight}px;}`, suspensionPickUp);
      return xxxFontSize + xxxHighlight + xxxImage + xxxListMore + xxxShoppingLink + xxxShoppingLink + xxxSusHeader + xxxSusHomeTab + xxxTitleTag + xxxVideo + xxxVideoLink + xxxWidth + xxxSuspensionPickUp;
    }
  };
  var suspensionPickupAttribute = async () => {
    const { suspensionPickUp } = await myStorage.getConfig();
    if (suspensionPickUp) {
      dom("body").setAttribute("data-suspension-pickup", "true");
    } else {
      dom("body").removeAttribute("data-suspension-pickup");
    }
    myVersion.change();
  };
  var changeSuspensionTab = async () => {
    const name = "suspensionHomeTab";
    const pfConfig = await myStorage.getConfig();
    cSuspensionStyle(name);
    const even = dom(".Topstory-container .TopstoryTabs");
    if (!even) return;
    pfConfig[name] ? myLock.append(even, name) : myLock.remove(even);
  };
  var cacheHeader = async () => {
    const headerEventNames = ["suspensionFind", "suspensionSearch", "suspensionUser"];
    const { getFindEventItem, setFindEventItem, setStorageConfigItem, getStorageConfigItem } = store;
    const pfConfig = await myStorage.getConfig();
    const eventHeader = getFindEventItem("header");
    if (!eventHeader.isFind) {
      eventHeader.fun && clearTimeout(eventHeader.fun);
      eventHeader.fun = setTimeout(() => {
        if (eventHeader.num < 100) {
          if (dom(".AppHeader-inner")) {
            eventHeader.isFind = true;
            setStorageConfigItem("headerDoms", {
              suspensionFind: {
                class: ".AppHeader-inner .AppHeader-Tabs",
                even: dom(".AppHeader-inner .AppHeader-Tabs"),
                index: 1
              },
              suspensionSearch: {
                class: ".AppHeader-inner .SearchBar",
                even: dom(".AppHeader-inner .SearchBar"),
                index: 2
              },
              suspensionUser: {
                class: ".AppHeader-inner .AppHeader-userInfo",
                even: dom(".AppHeader-inner .AppHeader-userInfo"),
                index: 3
              }
            });
          }
          eventHeader.num++;
          setFindEventItem("header", eventHeader);
          cacheHeader();
        }
      }, 100);
      return;
    }
    const classIcon = ".ctz-search-icon";
    const classPickup = ".ctz-search-pick-up";
    const classNameFocus = "focus";
    headerEventNames.forEach((name) => {
      const headerDoms = getStorageConfigItem("headerDoms");
      const { even } = headerDoms[name];
      if (pfConfig[name]) {
        if (name === "suspensionSearch") {
          !dom(classIcon) && even.appendChild(domC("i", { className: "ctz-search-icon", innerHTML: "⚲" }));
          !dom(classPickup) && even.appendChild(domC("i", { className: "ctz-search-pick-up", innerHTML: "⇤" }));
          if (dom(classIcon)) {
            dom(classIcon).onclick = () => even.classList.add(classNameFocus);
          }
          if (dom(classPickup)) {
            dom(classPickup).onclick = () => even.classList.remove(classNameFocus);
          }
        }
        myLock.append(even, name);
        even.classList.add(`position-${name}`);
        const nodeRoot = dom("#root");
        nodeRoot && nodeRoot.appendChild(even);
      } else {
        if (name === "suspensionSearch") {
          const nodeIcon = dom(classIcon);
          const nodePickup = dom(classPickup);
          nodeIcon && nodeIcon.remove();
          nodePickup && nodePickup.remove();
          even.classList.remove(classNameFocus);
        }
        myLock.remove(even);
        even.classList.remove(`position-${name}`);
        even.setAttribute("style", "");
        const nodeHeaderInner = dom(".AppHeader-inner");
        nodeHeaderInner && nodeHeaderInner.appendChild(even);
      }
      cSuspensionStyle(name);
    });
    myVersion.change();
  };
  var cSuspensionStyle = async (name) => {
    const cssObj = {
      suspensionHomeTab: ".Topstory-container .TopstoryTabs",
      suspensionFind: ".AppHeader-Tabs",
      suspensionSearch: ".SearchBar",
      suspensionUser: ".AppHeader-userInfo"
    };
    const nodeCTZName = dom(`.ctz-${name}`);
    const pfConfig = await myStorage.getConfig();
    nodeCTZName && (nodeCTZName.style.cssText = pfConfig[name] ? "display: inline-block;" : "display: none;");
    if (cssObj[name]) {
      pfConfig[name] ? myMove.init(cssObj[name], `${name}Po`, name) : myMove.destroy(cssObj[name]);
    }
  };
  var initData = () => {
    store.setStorageConfigItem("cacheTitle", document.title);
    echoData();
    changeICO();
    changeTitle();
    changeSuspensionTab();
    suspensionPickupAttribute();
    setTimeout(() => {
      cacheHeader();
    }, 300);
  };
  var initHistoryView = async () => {
    const { href, origin, pathname } = location;
    setTimeout(async () => {
      let name = "";
      const isQuestion = href.includes("www.zhihu.com/question/");
      isQuestion && dom('.QuestionPage [itemprop="name"]') && (name = `<b style="color: #ec7259">「问题」</b>${dom('.QuestionPage [itemprop="name"]').content}`);
      href.includes("zhuanlan.zhihu.com/p/") && dom(".Post-Title") && (name = `<b style="color: #00965e">「文章」</b>${dom(".Post-Title").innerText}`);
      href.includes("www.zhihu.com/zvideo/") && dom(".ZVideo .ZVideo-title") && (name = `<b style="color: #12c2e9">「视频」</b>${dom(".ZVideo .ZVideo-title").innerText}`);
      if (!name) {
        initHistoryView();
        return;
      }
      let extra = "";
      const questionAnswerId = pathname.replace(/\/question\/\d+\/answer\//, "");
      if (isQuestion && questionAnswerId) {
        extra = ` ---- 回答: ${questionAnswerId}`;
      }
      const nA = `<a href="${origin + pathname}" target="_blank">${name + extra}</a>`;
      const { view } = await myStorage.getHistory();
      if (!view.includes(nA)) {
        view.unshift(nA);
        myStorage.updateHistoryItem("view", view);
      }
    }, 500);
  };
  var CLASS_REMOVE_BLOCK = "ctz-remove-block";
  var ID_BLOCK_LIST = "CTA_BLOCKED_USERS";
  var ID_BLOCKED_USERS_TAGS = "CTZ_BLOCKED_USERS_TAGS";
  var CLASS_REMOVE_BLOCKED_TAG = "ctz-remove-blocked-tag";
  var CLASS_EDIT_USER_TAG = "ctz-edit-user-tag";
  var CLASS_BLACK_TAG = "ctz-black-tag";
  var initBlockedUserTags = async () => {
    const config = await myStorage.getConfig();
    const nodeBlockedUsersTags = domById(ID_BLOCKED_USERS_TAGS);
    nodeBlockedUsersTags.innerHTML = (config.blockedUsersTags || []).map(
      (i) => `<span class="ctz-blocked-users-tag" data-info="${i}">${i + `<i class="${CLASS_REMOVE_BLOCKED_TAG}" style="margin-left:4px;cursor:pointer;font-style: normal;font-size:12px;">✕</i>`}</span>`
    ).join("");
    nodeBlockedUsersTags.onclick = async (event) => {
      const { blockedUsers = [], blockedUsersTags = [] } = await myStorage.getConfig();
      const target = event.target;
      if (!target || !target.classList.contains(CLASS_REMOVE_BLOCKED_TAG)) return;
      const item = target.parentElement;
      const info = item.dataset.info || "";
      const isUsed = blockedUsers.some((item2) => {
        if (item2.tags && item2.tags.length) {
          return item2.tags.some((i) => i === info);
        }
        return false;
      });
      if (isUsed) {
        message("此标签有黑名单用户正在使用");
        return;
      }
      item.remove();
      const index = blockedUsersTags.findIndex((i) => i === info);
      blockedUsersTags.splice(index, 1);
      myStorage.updateConfigItem("blockedUsersTags", blockedUsersTags);
    };
    dom('input[name="inputBlockedUsersTag"]').onchange = async (e) => {
      const { blockedUsersTags = [] } = await myStorage.getConfig();
      const target = e.target;
      const value = target.value.toLowerCase();
      if (blockedUsersTags.includes(value)) {
        message("该标签已经存在");
        return;
      }
      blockedUsersTags.push(value);
      await myStorage.updateConfigItem("blockedUsersTags", blockedUsersTags);
      const domItem = domC("span", {
        innerHTML: value + `<i class="${CLASS_REMOVE_BLOCKED_TAG}" style="margin-left:4px;cursor:pointer;font-style: normal;font-size:12px;">✕</i>`,
        className: "ctz-blocked-users-tag"
      });
      domItem.dataset.info = value;
      domById(ID_BLOCKED_USERS_TAGS).appendChild(domItem);
      target.value = "";
    };
  };
  var blackItemContent = ({ id, name, tags = [] }) => `<a href="https://www.zhihu.com/people/${id}" target="_blank">${name}</a>` + tags.map((tag) => `<span class="ctz-in-blocked-user-tag">${tag}</span>`).join("") + `<span class="${CLASS_EDIT_USER_TAG}">✎</span><i class="${CLASS_REMOVE_BLOCK}">✕</i>`;
  var initBlockedUsers = async () => {
    const config = await myStorage.getConfig();
    const nodeBlockedUsers = domById(ID_BLOCK_LIST);
    nodeBlockedUsers.innerHTML = (config.blockedUsers || []).map((info) => `<div class="ctz-black-item ctz-black-id-${info.id}" data-info='${JSON.stringify(info)}'>${blackItemContent(info)}</div>`).join("");
    nodeBlockedUsers.onclick = async (event) => {
      const target = event.target;
      const item = target.parentElement;
      const info = item.dataset.info ? JSON.parse(item.dataset.info) : {};
      if (target.classList.contains(CLASS_REMOVE_BLOCK)) {
        removeBlockUser(info);
        return;
      }
      if (target.classList.contains(CLASS_EDIT_USER_TAG)) {
        openExtra("chooseBlockedUserTags");
        const { blockedUsers = [], blockedUsersTags = [] } = await myStorage.getConfig();
        const currentTags = info.tags || [];
        dom('[data-type="chooseBlockedUserTags"] .ctz-title').innerText = `设置标签：${info.name}`;
        const boxTags = dom(".ctz-choose-blocked-user-tags");
        boxTags.innerHTML = blockedUsersTags.map((i) => `<span data-type="blockedUserTag" data-name="${i}" data-choose="${currentTags.includes(i)}">${i}</span>`).join("");
        boxTags.onclick = (event2) => {
          const target2 = event2.target;
          if (target2.dataset.type === "blockedUserTag") {
            target2.dataset.choose = target2.dataset.choose === "true" ? "false" : "true";
          }
        };
        dom('[name="choose-blocked-user-tags-finish"]').onclick = async () => {
          const chooseTags = [...dom(".ctz-choose-blocked-user-tags").children].filter((i) => i.dataset.choose === "true").map((i) => i.dataset.name);
          info.tags = chooseTags;
          blockedUsers.forEach((item2) => {
            if (item2.id === info.id) {
              item2.tags = chooseTags;
            }
          });
          item.innerHTML = blackItemContent(info);
          await myStorage.updateConfigItem("blockedUsers", blockedUsers);
          closeExtra();
        };
        return;
      }
    };
  };
  function syncBlackList(offset = 0, l = []) {
    const nodeList = domById(ID_BLOCK_LIST);
    if (!l.length && nodeList) {
      nodeList.innerHTML = "黑名单列表加载中...";
    }
    const buttonSync = dom('button[name="syncBlack"]');
    if (!buttonSync.querySelector("ctz-loading")) {
      fnDomReplace(buttonSync, { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
    }
    const limit = 20;
    const headers = store.getStorageConfigItem("fetchHeaders");
    fetch(`https://www.zhihu.com/api/v3/settings/blocked_users?offset=${offset}&limit=${limit}`, {
      method: "GET",
      headers: new Headers(headers),
      credentials: "include"
    }).then((response) => response.json()).then(async ({ data, paging }) => {
      const prevConfig = await myStorage.getConfig();
      const { blockedUsers = [] } = prevConfig;
      data.forEach(({ id, name, url_token }) => {
        const findItem = blockedUsers.find((i) => i.id === id);
        l.push({ id, name, urlToken: url_token, tags: findItem && findItem.tags || [] });
      });
      if (!paging.is_end) {
        syncBlackList(offset + limit, l);
        if (nodeList) {
          nodeList.innerHTML = `黑名单列表加载中（${l.length} / ${paging.totals}）...`;
        }
      } else {
        await myStorage.updateConfigItem("blockedUsers", l);
        initBlockedUsers();
        fnDomReplace(buttonSync, { innerHTML: "同步黑名单", disabled: false });
      }
    });
  }
  var addBlockUser = (userInfo) => {
    const { name, urlToken } = userInfo;
    const message2 = `是否要屏蔽${name}？
屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。`;
    if (!confirm(message2)) return Promise.reject();
    return new Promise((resolve) => {
      const headers = store.getStorageConfigItem("fetchHeaders");
      fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
        method: "POST",
        headers: new Headers({
          ...headers,
          "x-xsrftoken": document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0] || ""
        }),
        credentials: "include"
      }).then(async () => {
        const blockedUsers = (await myStorage.getConfig()).blockedUsers || [];
        blockedUsers.unshift(userInfo);
        myStorage.updateConfigItem("blockedUsers", blockedUsers);
        const nodeUserItem = domC("div", {
          className: `ctz-black-item ctz-black-id-${userInfo.id}`,
          innerHTML: blackItemContent(userInfo)
        });
        nodeUserItem.dataset.info = JSON.stringify(userInfo);
        const nodeUsers = domById(ID_BLOCK_LIST);
        nodeUsers.insertBefore(nodeUserItem, nodeUsers.children[0]);
        resolve();
      });
    });
  };
  var removeBlockUser = (info, needConfirm = true) => {
    if (needConfirm) {
      const message2 = "取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。";
      if (!confirm(message2)) return Promise.reject();
    }
    return new Promise((resolve) => {
      const { urlToken, id } = info;
      const headers = store.getStorageConfigItem("fetchHeaders");
      fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
        method: "DELETE",
        headers: new Headers({
          ...headers,
          "x-xsrftoken": document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0] || ""
        }),
        credentials: "include"
      }).then(async () => {
        const blockedUsers = (await myStorage.getConfig()).blockedUsers || [];
        const itemIndex = blockedUsers.findIndex((i) => i.id === info.id);
        if (itemIndex >= 0) {
          blockedUsers.splice(itemIndex, 1);
          const removeItem = dom(`.ctz-black-id-${id}`);
          removeItem && removeItem.remove();
          myStorage.updateConfigItem("blockedUsers", blockedUsers);
        }
        resolve();
      });
    });
  };
  var CLASS_ANSWER_BLACK_BOX = "ctz-answer-black-box";
  var CLASS_BTN_BLACK = "ctz-answer-black-add";
  var CLASS_BTN_BLACK_REMOVE = "ctz-answer-black-remove";
  var answerAddBlockButton = async (event) => {
    if (event.querySelector(`.${CLASS_ANSWER_BLACK_BOX}`)) return;
    const nodeUser = event.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
    if (!nodeUser || !nodeUser.offsetHeight) return;
    const userUrl = nodeUser.querySelector('meta[itemprop="url"]').content;
    const userName = nodeUser.querySelector('meta[itemprop="name"]').content;
    const nodeAnswerItem = event.querySelector(".AnswerItem");
    const mo = nodeAnswerItem ? nodeAnswerItem.getAttribute("data-za-extra-module") || "{}" : "{}";
    if (!JSON.parse(mo).card) return;
    const aContent = JSON.parse(mo).card.content;
    const userId = aContent.author_member_hash_id || "";
    if (!userUrl.replace(/https:\/\/www.zhihu.com\/people\//, "")) return;
    const { blockedUsers = [] } = await myStorage.getConfig();
    const isBlocked = blockedUsers.findIndex((i) => i.id === userId) >= 0;
    const nBlackBox = domC("div", { className: CLASS_ANSWER_BLACK_BOX, innerHTML: await changeBoxHTML(isBlocked) });
    nBlackBox.onclick = async function(ev) {
      const target = ev.target;
      const matched = userUrl.match(/(?<=people\/)[\w\W]+/);
      const urlToken = matched ? matched[0] : "";
      const me = this;
      if (target.classList.contains(CLASS_BTN_BLACK)) {
        await addBlockUser({ id: userId, name: userName, urlToken });
        me.innerHTML = await changeBoxHTML(true);
        return;
      }
      if (target.classList.contains(CLASS_BTN_BLACK_REMOVE)) {
        await removeBlockUser({ id: userId, name: userName, urlToken });
        me.innerHTML = await changeBoxHTML(false);
        return;
      }
    };
    nodeUser.appendChild(nBlackBox);
  };
  var changeBoxHTML = async (isBlocked) => {
    const { showBlockUserTag, showBlockUser } = await myStorage.getConfig();
    if (isBlocked) {
      return fnReturnStr(`<span class="${CLASS_BLACK_TAG}">黑名单</span>`, showBlockUserTag) + fnReturnStr(`<button class="${CLASS_BTN_BLACK_REMOVE} ctz-button">解除屏蔽</button>`, showBlockUser);
    } else {
      return fnReturnStr(`<button class="${CLASS_BTN_BLACK} ctz-button">屏蔽</button>`, showBlockUser);
    }
  };
  var syncRemoveBlockedUsers = () => {
    if (!confirm("您确定要取消屏蔽所有黑名单用户吗？")) return;
    if (!confirm("确定清空所有屏蔽用户？")) return;
    const buttonSync = dom('button[name="syncBlackRemove"]');
    if (!buttonSync.querySelector("ctz-loading")) {
      fnDomReplace(buttonSync, { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
    }
    const removeButtons = domA(".ctz-remove-block");
    const len = removeButtons.length;
    let finishNumber = 0;
    if (!removeButtons.length) return;
    for (let i = 0; i < len; i++) {
      const item = removeButtons[i];
      const itemParent = item.parentElement;
      const info = itemParent.dataset.info ? JSON.parse(itemParent.dataset.info) : {};
      if (info.id) {
        removeBlockUser(info, false).then(async () => {
          finishNumber++;
          itemParent.remove();
          if (finishNumber === len) {
            fnDomReplace(buttonSync, { innerHTML: "清空黑名单列表", disabled: false });
            await myStorage.updateConfigItem("blockedUsers", []);
            initBlockedUsers();
          }
        });
      }
    }
  };
  var initFetchInterceptStatus = async () => {
    const { fetchInterceptStatus } = await myStorage.getConfig();
    domById("CTZ_FETCH_STATUS").innerHTML = fetchInterceptStatus ? '<b style="color: #00bfa5;">已开启接口拦截</b>，若页面无法显示数据请尝试关闭' : '<b style="color: #d50000;">已关闭接口拦截</b>，部分功能不可用';
    if (!fetchInterceptStatus) {
      domA(".ctz-fetch-intercept").forEach((item) => {
        item.classList.add("ctz-fetch-intercept-close");
        item.querySelectorAll("input").forEach((it) => {
          it.disabled = true;
        });
        item.querySelectorAll("button").forEach((it) => {
          it.disabled = true;
        });
      });
    }
  };
  var INNER_HTML = `<div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_IMAGE"><div><img src="" /></div></div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_VIDEO"><div><video src="" autoplay loop></video></div></div><iframe class="ctz-pdf-box-content" style="display: none"></iframe><div id="CTZ_MESSAGE_BOX"></div><div id="CTZ_OPEN_CLOSE" data-close="1"><div class="gear"><div class="gear_line_1"></div><div class="gear_line_2"></div><div class="gear_line_3"></div><div class="gear_line_4"></div></div></div><div id="CTZ_DIALOG" style="display: none"><div id="CTZ_DIALOG_CONTENT"><div id="CTZ_DIALOG_LEFT"><div id="CTZ_LEFT_BUTTONS"><button class="ctz-button" name="dialogClose">✕</button><button class="ctz-button" name="dialogBig">+</button></div><div id="CTZ_DIALOG_MENU"><div data-href="#CTZ_BASIS">通用</div><div data-href="#CTZ_HIGH_PERFORMANCE">高性能</div><div data-href="#CTZ_POSITION">悬浮模块</div><div data-href="#CTZ_HIDDEN">隐藏模块</div><div data-href="#CTZ_FILTER" data-commit="更改后请重新刷新页面">屏蔽内容</div><div data-href="#CTZ_BLOCK_WORDS" data-commit="更改后请重新刷新页面, 点击屏蔽词删除">屏蔽词</div><div data-href="#CTZ_BLACKLIST" data-commit="更改后请重新刷新页面, 需开启接口拦截">黑名单</div><div data-href="#CTZ_VERSION">页面尺寸</div><div data-href="#CTZ_THEME">颜色</div><div data-href="#CTZ_CONFIG">配置操作</div><div data-href="#CTZ_HISTORY_LIST" data-commit="最多缓存500条, 包含已过滤项">推荐列表缓存</div><div data-href="#CTZ_HISTORY_VIEW" data-commit="最多缓存500条">浏览历史记录</div><div data-href="#CTZ_DEFAULT" data-commit="修改器自带功能, 不需要额外开启">默认功能</div><div data-href="#CTZ_CHANGELOG">更新日志</div></div></div><div id="CTZ_DIALOG_RIGHT"><div id="CTZ_DIALOG_RIGHT_TITLE"></div><div id="CTZ_DIALOG_MAIN"><div id="CTZ_BASIS" style="display: none"><div id="CTZ_BASIS_DEFAULT"><div class="ctz-form-box"><div class="ctz-form-box-item"><div id="CTZ_FETCH_STATUS">状态获取中...</div><div><input id="CTZ_CHANGE_FETCH" class="ctz-i ctz-switch" name="fetchInterceptStatus" type="checkbox" value="on" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>快捷键打开修改器<span class="key-shadow">></span>(<span class="key-shadow">Shift</span>+<span class="key-shadow">.</span>)</div><div><input class="ctz-i ctz-switch" name="hotKey" type="checkbox" value="on" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>去除浏览器标签上XX条私信/未读消息的提示</div><div><input class="ctz-i ctz-switch" name="globalTitleRemoveMessage" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>网页标签名称</div><div><input type="text" name="globalTitle" style="width: 278px" /><button class="ctz-button" name="buttonConfirmTitle" style="margin: 0 8px">确认</button><button class="ctz-button" name="buttonResetTitle">还原</button></div></div><div class="ctz-form-box-item"><div>网页标签图标</div><div id="CTZ_TITLE_ICO"></div></div></div></div><div class="ctz-title">显示修改<span class="ctz-commit" style="color: red">修改后刷新页面生效</span></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>购物链接显示方式</div><div><select class="ctz-select" name="linkShopping"></select></div></div><div class="ctz-form-box-item"><div>回答内容收起/展开状态</div><div><select class="ctz-select" name="answerOpen"></select></div></div><div class="ctz-form-box-item"><div>替换<span class="ctz-zhida">知乎直达<span>✦</span></span>为搜索</div><div><select class="ctz-select" name="replaceZhidaToSearch"></select></div></div></div><div id="CTZ_BASIS_SHOW_CONTENT"></div></div><div id="CTZ_POSITION" style="display: none"><div class="ctz-form-box"><div class="ctz-form-box-item"><div>修改器弹出图标 ⚙︎ 定位方式</div><div><select class="ctz-select" name="suspensionOpen"></select></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>回答内容「收起」按钮悬浮</div><div><input class="ctz-i ctz-switch" name="suspensionPickUp" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>悬浮收起按钮位置，数字越大离右侧越远：</div><div><input name="suspensionPickupRight" type="number" class="ctz-i-change" style="width: 80px" /></div></div></div><div class="ctz-title">信息模块悬浮<span>拖动悬浮模块定位位置，鼠标放置显示点击 ☒ 按钮即可拖动</span></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>首页列表切换</div><div><input class="ctz-i ctz-switch" name="suspensionHomeTab" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>顶部发现模块</div><div><input class="ctz-i ctz-switch" name="suspensionFind" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>个人中心模块</div><div><input class="ctz-i ctz-switch" name="suspensionUser" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>搜索栏模块</div><div><input class="ctz-i ctz-switch" name="suspensionSearch" type="checkbox" value="on" /></div></div></div></div><div id="CTZ_HIGH_PERFORMANCE" style="display: none"></div><div id="CTZ_HIDDEN" style="display: none"></div><div id="CTZ_FILTER" style="display: none"><div id="CTZ_FILTER_COMMEN"><div class="ctz-form-box"><div class="ctz-form-box-item ctz-fetch-intercept"><div>屏蔽选自盐选专栏的内容<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span></div><div><input class="ctz-i ctz-switch" name="removeFromYanxuan" type="checkbox" value="on" /></div></div></div></div><div id="CTZ_FILTER_LIST"><div class="ctz-title">列表内容屏蔽<span>此部分设置只在首页列表生效</span></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>屏蔽顶部活动推广</div><div><input class="ctz-i ctz-switch" name="removeTopAD" type="checkbox" value="on" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item ctz-fetch-intercept"><div>屏蔽匿名用户提问<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span></div><div><input class="ctz-i ctz-switch" name="removeAnonymousQuestion" type="checkbox" value="on" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>关注列表屏蔽自己的操作</div><div><input class="ctz-i ctz-switch" name="removeMyOperateAtFollow" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>关注列表过滤关注人赞同回答</div><div><input class="ctz-i ctz-switch" name="removeFollowVoteAnswer" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>关注列表过滤关注人赞同文章</div><div><input class="ctz-i ctz-switch" name="removeFollowVoteArticle" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>关注列表过滤关注人关注问题</div><div><input class="ctz-i ctz-switch" name="removeFollowFQuestion" type="checkbox" value="on" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>列表低赞内容屏蔽</div><div><input class="ctz-i ctz-switch" name="removeLessVote" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>关注、推荐、搜索屏蔽小于的点赞数量</div><div><input name="lessVoteNumber" class="ctz-i-change" type="number" style="width: 80px" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>列表过滤邀请回答</div><div><input class="ctz-i ctz-switch" name="removeItemQuestionAsk" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>列表过滤商业推广</div><div><input class="ctz-i ctz-switch" name="removeItemAboutAD" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>列表过滤文章</div><div><input class="ctz-i ctz-switch" name="removeItemAboutArticle" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>列表过滤视频</div><div><input class="ctz-i ctz-switch" name="removeItemAboutVideo" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>列表过滤想法</div><div><input class="ctz-i ctz-switch" name="removeItemAboutPin" type="checkbox" value="on" /></div></div></div></div><div id="CTZ_FILTER_ANSWER"><div class="ctz-title">回答内容屏蔽<span>此部分设置只在回答页面生效</span></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>屏蔽匿名用户回答</div><div><input class="ctz-i ctz-switch" name="removeAnonymousAnswer" type="checkbox" value="on" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>回答页面低赞回答屏蔽</div><div><input class="ctz-i ctz-switch" name="removeLessVoteDetail" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>问题回答屏蔽小于的点赞数量</div><div><input name="lessVoteNumberDetail" class="ctz-i-change" type="number" style="width: 80px" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>屏蔽带有虚构创作标签的回答</div><div><input class="ctz-i ctz-switch" name="removeUnrealAnswer" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>屏蔽选自电子书标签的回答</div><div><input class="ctz-i ctz-switch" name="removeFromEBook" type="checkbox" value="on" /></div></div></div></div></div><div id="CTZ_BLOCK_WORDS" style="display: none"><div class="ctz-title">标题屏蔽词<span>匹配位置：列表标题</span></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div></div><div><input name="inputBlockedWord" type="text" placeholder="输入后回车添加（不区分大小写）" style="width: 256px" /></div></div><div class="ctz-form-box-item" id="CTZ_FILTER_BLOCK_WORDS"><div class="ctz-block-words-content"></div></div></div><div class="ctz-title">内容屏蔽词<span>匹配位置：列表、回答页内容</span></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div></div><div><input name="inputBlockedWordAnswer" type="text" placeholder="输入后回车添加（不区分大小写）" style="width: 256px" /></div></div><div class="ctz-form-box-item" id="CTZ_FILTER_BLOCK_WORDS_CONTENT"><div class="ctz-block-words-content"></div></div></div></div><div id="CTZ_BLACKLIST" class="ctz-fetch-intercept" style="display: none"><div class="ctz-form-box"><div class="ctz-form-box-item"><div>回答列表用户名后显示"屏蔽用户"按钮</div><div><input class="ctz-i ctz-switch" name="showBlockUser" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>屏蔽黑名单用户发布的内容</div><div><input class="ctz-i ctz-switch" name="removeBlockUserContent" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>列表和回答显示黑名单用户标识<div class="ctz-black-tag">黑名单</div></div><div><input class="ctz-i ctz-switch" name="showBlockUserTag" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>评论区显示"屏蔽用户"按钮</div><div><input class="ctz-i ctz-switch" name="showBlockUserComment" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>屏蔽黑名单用户评论</div><div><input class="ctz-i ctz-switch" name="removeBlockUserComment" type="checkbox" value="on" /></div></div><div class="ctz-form-box-item"><div>评论区显示黑名单用户标识<div class="ctz-black-tag">黑名单</div></div><div><input class="ctz-i ctz-switch" name="showBlockUserCommentTag" type="checkbox" value="on" /></div></div></div><div class="ctz-title">黑名单标签</div><div class="ctz-form-box"><div class="ctz-form-box-item"><div></div><div><input name="inputBlockedUsersTag" type="text" placeholder="输入后回车添加（不区分大小写）" style="width: 256px" /></div></div><div class="ctz-form-box-item"><div id="CTZ_BLOCKED_USERS_TAGS"></div></div></div><div class="ctz-title">黑名单列表</div><div class="ctz-form-box"><div class="ctz-form-box-item"><div></div><div><button name="syncBlack" class="ctz-button">同步黑名单</button></div></div><div class="ctz-form-box-item"><div></div><div><button name="syncBlackRemove" class="ctz-button">清空黑名单列表</button></div></div><div class="ctz-form-box-item"><div id="CTA_BLOCKED_USERS"></div></div></div></div><div id="CTZ_HISTORY_LIST" style="display: none"><div style="margin-bottom: 12px; text-align: right"><button class="ctz-button" name="button_history_clear" data-id="list">清空列表缓存</button></div><div class="ctz-set-content"></div></div><div id="CTZ_HISTORY_VIEW" style="display: none"><div style="margin-bottom: 12px; text-align: right"><button class="ctz-button" name="button_history_clear" data-id="view">清空历史记录</button></div><div class="ctz-set-content"></div></div><div id="CTZ_DEFAULT" style="display: none"><div id="CTZ_DEFAULT_SELF" class="ctz-form-box"></div><div class="ctz-zhihu-self" style="margin-top: 18px"><div class="ctz-zhihu-key">更加方便的浏览，按<span class="key-shadow">?</span>（<span class="key-shadow">Shift</span>+<span class="key-shadow">/</span>） 查看所有快捷键。<a href="/settings/preference" target="_blank">前往开启快捷键功能</a></div></div></div><div id="CTZ_THEME" style="display: none"><div class="ctz-set-background ctz-form-box"></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>修改文字颜色</div><div><input type="text" class="ctz-i-change" name="colorText1" style="width: 148px; margin-right: 8px" placeholder="例如：#f7f9f9" /><button class="ctz-button ctz-reset-font-size" name="reset-colorText1">↺</button></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>关注列表高亮原创内容</div><div><div><input class="ctz-i ctz-switch" name="highlightOriginal" type="checkbox" value="on" /></div></div></div><div class="ctz-form-box-item"><div>关注列表高亮原创内容背景色</div><div><div><input type="text" class="ctz-i-change" name="backgroundHighlightOriginal" style="width: 148px; margin-right: 8px" placeholder="例如：#fbf8f1" /><button class="ctz-button ctz-reset-font-size" name="reset-backgroundHighlightOriginal">↺</button></div></div></div></div></div><div id="CTZ_VERSION" style="display: none"><div id="CTZ_VERSION_RANGE_ZHIHU" class="ctz-form-box"></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>评论弹窗匹配页面宽度</div><div><input class="ctz-i ctz-switch" name="commitModalSizeSameVersion" type="checkbox" value="on" /></div></div></div><div class="ctz-title">字体大小</div><div id="CTZ_FONT_SIZE_IN_ZHIHU" class="ctz-form-box"></div><div class="ctz-title">图片尺寸</div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>回答和文章图片尺寸</div><div><select class="ctz-select" name="zoomImageType"></select></div></div><div id="CTZ_IMAGE_SIZE_CUSTOM" class="ctz-form-box-item" style="display: none"></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>图片最大高度限制<span class="ctz-tooltip"><span>?</span><span>开启高度限制后，图片将按照高度等比例缩放，宽度限制将失效</span></span></div><div><select class="ctz-select" name="zoomImageHeight"></select></div></div><div id="CTZ_IMAGE_HEIGHT_CUSTOM" class="ctz-form-box-item" style="display: none"></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>弹窗打开动图</div><div><input class="ctz-i ctz-switch" name="showGIFinDialog" type="checkbox" value="on" /></div></div></div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>评论图片预览不超出页面</div><div><input class="ctz-i ctz-switch" name="commentImageFullPage" type="checkbox" value="on" /></div></div></div><div class="ctz-title">视频尺寸</div><div class="ctz-form-box"><div class="ctz-form-box-item"><div>列表视频回答尺寸</div><div><select class="ctz-select" name="zoomListVideoType"></select></div></div><div id="CTZ_LIST_VIDEO_SIZE_CUSTOM" class="ctz-form-box-item" style="display: none"></div></div></div><div id="CTZ_CONFIG" style="display: none"><div class="ctz-config-buttons"><button class="ctz-button" name="useSimple">启用极简模式</button><button class="ctz-button" name="configReset">恢复默认配置</button><button class="ctz-button" name="configExport">配置导出</button><!-- <button class="ctz-button" name="configRemove">清空配置</button> --><div id="IMPORT_BY_FILE"><input type="file" class="ctz-input-config-import" id="readTxt" accept=".txt" /><button class="ctz-button" name="configImport">配置导入</button></div></div><div class="ctz-title">自定义样式</div><div style="align-items: start; padding: 0; text-align: right"><textarea name="textStyleCustom" placeholder="内容为CSS"></textarea><button class="ctz-button" name="styleCustom">确定</button></div></div><div id="CTZ_CHANGELOG" style="display: none"><h2 id="550">5.5.0</h2><p><code>2025-03-02</code></p><ul><li>🆕 添加 <code>替换知乎直达✦为搜索</code> 设置，可去除知乎直达，替换为知乎、百度、谷歌、必应搜索；</li><li>🆕 添加 <code>点击空白处关闭评论弹窗</code>，开启后点击评论弹窗背景即可关闭弹窗；</li><li>🐞 修复通过屏蔽黑名单用户发布的内容屏蔽错误的问题；</li><li>🐞 修复用户主页重置的情况 &amp; 修复用户主页自添加的屏蔽用户按钮监听次数指数型增长的问题；</li><li>🐞 修复部分情况下遍历评论区出现错误的问题；</li><li>🎨 删除无用的样式设置部分；</li></ul><h2 id="540">5.4.0</h2><p><code>2025-02-27</code></p><ul><li>🆕 添加 <code>取消评论输入框的自动聚焦</code> 功能；</li><li>🆕 添加 <code>键盘ESC键关闭评论弹窗</code> 功能；</li><li>♿️ 黑名单添加用户改为添加到列表最前（旧版本为添加到列表最后），便于查看和操作；</li><li>🐞 修复评论区预览图片位置错误的问题；</li><li>🐞 修复高性能模式下当前阅读内容滚动到上方的问题；</li><li>🐞 修复回答列表<code>屏蔽选自盐选专栏的内容</code>偶尔失效的问题；</li></ul><h2 id="531">5.3.1</h2><p><code>2025-02-25</code></p><ul><li>🐞 修复评论区内容未扫描到的问题；</li><li>🐞 修复小屏幕下问题详情内容错位的问题；</li></ul><h2 id="530">5.3.0</h2><p><code>2025-02-24</code></p><ul><li>🆕 添加黑名单用户标签功能，可以给黑名单用户打标，用来表明拉黑用户的原因等；</li><li>🆕 添加清空黑名单列表按钮，用来批量清空黑名单，慎用哦；</li><li>🐞 修改评论区内容扫描时机，解决出现未扫描到的情况；</li></ul><h2 id="521">5.2.1</h2><p><code>2025-02-21</code></p><ul><li>🐞 修复推荐列表开启高性能模式无限下拉的问题；</li><li>⚡ 修改列表回答监听方式，减少计算时间；</li><li>⚡ 调整推荐列表高性能模式处理时间；</li><li>💄 统一按钮文字粗细；</li></ul><h2 id="520">5.2.0</h2><p><code>2025-02-19</code></p><ul><li>🆕 黑名单添加 <code>评论区显示"屏蔽用户"按钮</code> 功能；</li><li>🆕 黑名单添加 <code>屏蔽黑名单用户评论</code> 功能；</li><li>🆕 黑名单部分添加 <code>列表和回答用户显示黑名单标签</code>，<code>评论区显示黑名单标签</code> 功能；</li><li>🆕 屏蔽内容添加 <code>屏蔽匿名用户提问</code> 功能；</li><li>🆕 主题颜色添加自定义<code>高亮原创内容背景色</code>；</li><li>🆕 列表屏蔽过滤内容后自动调用不感兴趣接口；</li><li>🆕 页面尺寸添加 <code>评论图片预览不超出页面</code> 设置，开启后评论区的弹窗图片预览将不超出页面最大尺寸；</li><li>🆕 修改器中添加更新日志菜单；</li><li>🐞 <code>问题话题</code>也可隐藏问题栏大块话题模块；</li><li>🐞 修复自定义修改颜色部分输入框失效的问题；</li><li>🐞 修复<code>高亮原创内容</code>切换失效的问题，高亮原创内容移动到<code>主题颜色</code>模块；</li><li>🐞 修复左右切换图片大小显示错误的问题；</li><li>⚡ 解决搜索列表、回答列表和评论列表重复处理的问题；</li><li>💄 自定义齿轮唤醒齿轮，解决不同系统下的位置错误问题；</li><li>💄 修改器放大缩小时按钮的变化，关闭修改器时大小返回原状；</li><li>💄 添加图片切换到开头和结尾时候的提示；</li><li>💄 修改范围选择器样式；</li><li>💄 修改配置操作页面样式；</li><li>💄 导出配置添加格式化的时间，方便查看；</li><li>💄 删除新版本提示；</li><li>📝 更新说明文档；</li></ul><h2 id="510">5.1.0</h2><p><code>2025-02-14</code></p><ul><li>🆕 根据反馈使用将修改器抽屉修改回弹窗，样式参考 MACOS 设置；</li><li>🆕 添加开关选择框，将修改器中多选框替换为开关；</li><li>🆕 弹窗唤起按钮设置拖动变更位置；</li><li>🆕 弹窗添加缩小放大按钮；</li><li>💄 修改单选按钮样式；</li><li>💄 修改 checkbox 选择器样式设置；</li><li>💄 修改 range 选择器样式设置；</li><li>💄 修改器内样式调整；</li><li>📝 更新说明文档；</li></ul><h2 id="501">5.0.1</h2><p><code>2025-02-12</code></p><ul><li>📝 删除 Q&amp;A 文件部分无用信息；</li><li>📝 在修改器抽屉下添加<code>修改器介绍</code>、<code>更新日志</code>按钮；</li></ul><h2 id="500">5.0.0</h2><p><code>2025-02-11</code></p><ul><li>♻️ 重构修改器样式为抽屉，显示内容更多，重新设置了菜单分类；</li><li>♻️ 重构收起按钮悬浮方法，使其更加精准；</li><li>🆕 添加隐藏模块 <code>操作栏</code> 分类，细分推荐关注列表、搜索列表、回答页面、收藏夹页面、文章页面和个人主页的操作栏；</li><li>🆕 添加隐藏模块 <code>查看全部回答</code>、<code>内容所属专栏</code> 设置；</li><li>🆕 移除了部分隐藏模块，<code>隐藏回答操作文字</code>；</li><li>🆕 由于官方账号可以设置到黑名单中，所以移除了屏蔽知乎官方账号的选项；</li><li>🆕 优化部分隐藏模块时的显示；</li><li>🆕 文字大小设置添加重置按钮；</li><li>👽 知乎搜索页标题下的 XXX 回答·XXX 浏览 样式错位调整；</li><li>🐞 解决列表高性能模式下的跳页问题，删除旧的内容后页面位置不会再变化，优化体验；</li><li>🐞 推荐列表高性能模式扩大为 50 条后再启用，列表和回答高性能模式默认开启；</li><li>🐞 解决左右切换图片预览时偶尔失效的问题；</li><li>🐞 调整切换图片逻辑，解决大小错乱位置错误的问题；</li><li>🐞 修复从修改器跳转到黑名单可能会出现的 404 错误；</li><li>🐞 修复视频没有下载按钮和点击下载按钮没反应的问题；</li><li>🐞 修复导出内容标签错误的问题；</li><li>🐞 修复推荐列表展开回答后，没有导出、屏蔽用户、一键获取链接等按钮的问题；</li></ul><h2 id="">历史版本更新日志</h2><p><a href="https://github.com/liuyubing233/zhihu-custom/blob/v4.25.0/CHANGELOG.md" target="_blank">查看 4.x 版本的更新日志</a></p><p><a href="https://github.com/liuyubing233/zhihu-custom/blob/v3.16.7/CHANGELOG.md" target="_blank">查看 3.x 版本的更新日志</a></p><p><a href="https://github.com/liuyubing233/zhihu-custom/blob/v2.8.0/development/changelog.md" target="_blank">查看 2.x 版本的更新日志</a></p><p><a href="https://github.com/liuyubing233/zhihu-custom/blob/v1.8.0/doc/changelog.md" target="_blank">查看 1.x 版本的更新日志</a></p></div></div></div></div><div id="CTZ_DIALOG_FOOTER"><div class="ctz-to-zhihu"><a href="https://www.zhihu.com" target="_self">返回主页</a></div><a href="https://github.com/liuyubing233/zhihu-custom" target="_blank">Github⭐</a><a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8" target="_blank">GreasyFork</a><a href="https://github.com/liuyubing233/zhihu-custom/blob/main/README.md" target="_blank">修改器介绍</a><div class="ctz-version"></div></div></div><div id="CTZ_COVER"></div><!--<span class="ctz-tooltip"><span>?</span><span>hhhahahhahahahhahahahahhahaha</span></span>--><div id="CTZ_EXTRA_OUTPUT_COVER" style="display: none"></div><div id="CTZ_EXTRA_OUTPUT_DIALOG" style="display: none" data-status="close"><div data-type="chooseBlockedUserTags"><div class="ctz-title">选择标签</div><div class="ctz-choose-blocked-user-tags"></div><div class="ctz-choose-blocked-user-tags-operate"><button class="ctz-button" name="choose-blocked-user-tags-finish">完成</button></div></div></div>`;
  var INNER_CSS = `.marginTB8{margin:8px 0}.PositionCenter{position:fixed;left:50%;top:50%;transform:translate(-50%, -50%)}.CommonTransition{transition-property:transform;transition-duration:500ms;transition-timing-function:cubic-bezier(.2, 0, 0, 1)}[theme-light='1'] #CTZ_DIALOG_MENU>div.target,[theme-light='1'] .ctz-switch:checked{background:#ff3b30}[theme-light='1'] #CTZ_DEFAULT_SELF a,[theme-light='1'] .ctz-zhihu-key a,[theme-light='1'] #CTZ_DIALOG_FOOTER a:hover,[theme-light='1'] #CTZ_HISTORY_LIST a:hover,[theme-light='1'] #CTZ_HISTORY_VIEW a:hover,[theme-light='1'] .ctz-black-item a:hover,[theme-light='1'] .ctz-edit-user-tag:hover,[theme-light='1'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover{color:#ff3b30 !important}[theme-light='1'] #CTZ_TITLE_ICO label input:checked+img,[theme-light='1'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div{border-color:#ff3b30}[theme-light='1'] .ctz-in-blocked-user-tag,[theme-light='1'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#ff3b30;color:#ff3b30;background:rgba(255,59,48,0.1)}[theme-light='2'] #CTZ_DIALOG_MENU>div.target,[theme-light='2'] .ctz-switch:checked{background:#a05a00}[theme-light='2'] #CTZ_DEFAULT_SELF a,[theme-light='2'] .ctz-zhihu-key a,[theme-light='2'] #CTZ_DIALOG_FOOTER a:hover,[theme-light='2'] #CTZ_HISTORY_LIST a:hover,[theme-light='2'] #CTZ_HISTORY_VIEW a:hover,[theme-light='2'] .ctz-black-item a:hover,[theme-light='2'] .ctz-edit-user-tag:hover,[theme-light='2'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover{color:#a05a00 !important}[theme-light='2'] #CTZ_TITLE_ICO label input:checked+img,[theme-light='2'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div{border-color:#a05a00}[theme-light='2'] .ctz-in-blocked-user-tag,[theme-light='2'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#a05a00;color:#a05a00;background:rgba(160,90,0,0.1)}[theme-light='3'] #CTZ_DIALOG_MENU>div.target,[theme-light='3'] .ctz-switch:checked{background:#007d1b}[theme-light='3'] #CTZ_DEFAULT_SELF a,[theme-light='3'] .ctz-zhihu-key a,[theme-light='3'] #CTZ_DIALOG_FOOTER a:hover,[theme-light='3'] #CTZ_HISTORY_LIST a:hover,[theme-light='3'] #CTZ_HISTORY_VIEW a:hover,[theme-light='3'] .ctz-black-item a:hover,[theme-light='3'] .ctz-edit-user-tag:hover,[theme-light='3'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover{color:#007d1b !important}[theme-light='3'] #CTZ_TITLE_ICO label input:checked+img,[theme-light='3'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div{border-color:#007d1b}[theme-light='3'] .ctz-in-blocked-user-tag,[theme-light='3'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#007d1b;color:#007d1b;background:rgba(0,125,27,0.1)}[theme-light='4'] #CTZ_DIALOG_MENU>div.target,[theme-light='4'] .ctz-switch:checked{background:#8e8e93}[theme-light='4'] #CTZ_DEFAULT_SELF a,[theme-light='4'] .ctz-zhihu-key a,[theme-light='4'] #CTZ_DIALOG_FOOTER a:hover,[theme-light='4'] #CTZ_HISTORY_LIST a:hover,[theme-light='4'] #CTZ_HISTORY_VIEW a:hover,[theme-light='4'] .ctz-black-item a:hover,[theme-light='4'] .ctz-edit-user-tag:hover,[theme-light='4'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover{color:#8e8e93 !important}[theme-light='4'] #CTZ_TITLE_ICO label input:checked+img,[theme-light='4'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div{border-color:#8e8e93}[theme-light='4'] .ctz-in-blocked-user-tag,[theme-light='4'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#8e8e93;color:#8e8e93;background:rgba(142,142,147,0.1)}[theme-light='5'] #CTZ_DIALOG_MENU>div.target,[theme-light='5'] .ctz-switch:checked{background:#af52de}[theme-light='5'] #CTZ_DEFAULT_SELF a,[theme-light='5'] .ctz-zhihu-key a,[theme-light='5'] #CTZ_DIALOG_FOOTER a:hover,[theme-light='5'] #CTZ_HISTORY_LIST a:hover,[theme-light='5'] #CTZ_HISTORY_VIEW a:hover,[theme-light='5'] .ctz-black-item a:hover,[theme-light='5'] .ctz-edit-user-tag:hover,[theme-light='5'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover{color:#af52de !important}[theme-light='5'] #CTZ_TITLE_ICO label input:checked+img,[theme-light='5'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div{border-color:#af52de}[theme-light='5'] .ctz-in-blocked-user-tag,[theme-light='5'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#af52de;color:#af52de;background:rgba(175,82,222,0.1)}[theme-light='6'] #CTZ_DIALOG_MENU>div.target,[theme-light='6'] .ctz-switch:checked{background:#ff9500}[theme-light='6'] #CTZ_DEFAULT_SELF a,[theme-light='6'] .ctz-zhihu-key a,[theme-light='6'] #CTZ_DIALOG_FOOTER a:hover,[theme-light='6'] #CTZ_HISTORY_LIST a:hover,[theme-light='6'] #CTZ_HISTORY_VIEW a:hover,[theme-light='6'] .ctz-black-item a:hover,[theme-light='6'] .ctz-edit-user-tag:hover,[theme-light='6'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover{color:#ff9500 !important}[theme-light='6'] #CTZ_TITLE_ICO label input:checked+img,[theme-light='6'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div{border-color:#ff9500}[theme-light='6'] .ctz-in-blocked-user-tag,[theme-light='6'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#ff9500;color:#ff9500;background:rgba(255,179,64,0.1)}[theme-light='7'] #CTZ_DIALOG_MENU>div.target,[theme-light='7'] .ctz-switch:checked{background:#ff9500}[theme-light='7'] #CTZ_DEFAULT_SELF a,[theme-light='7'] .ctz-zhihu-key a,[theme-light='7'] #CTZ_DIALOG_FOOTER a:hover,[theme-light='7'] #CTZ_HISTORY_LIST a:hover,[theme-light='7'] #CTZ_HISTORY_VIEW a:hover,[theme-light='7'] .ctz-black-item a:hover,[theme-light='7'] .ctz-edit-user-tag:hover,[theme-light='7'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover{color:#ff9500 !important}[theme-light='7'] #CTZ_TITLE_ICO label input:checked+img,[theme-light='7'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div{border-color:#ff9500}[theme-light='7'] .ctz-in-blocked-user-tag,[theme-light='7'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#ff9500;color:#ff9500;background:rgba(255,179,64,0.1)}[theme-dark='0'] #CTZ_DIALOG{color:#dfdfdf;box-shadow:2px 2px 4px #4a4848,-2px -2px 4px #4a4848}[theme-dark='0'] #CTZ_DIALOG,[theme-dark='0'] #CTZ_DIALOG_LEFT,[theme-dark='0'] #CTZ_DIALOG_FOOTER,[theme-dark='0'] #CTZ_EXTRA_OUTPUT_DIALOG,[theme-dark='0'] .ctz-black-item,[theme-dark='0'] .ctz-blocked-users-tag,[theme-dark='0'] .ctz-in-blocked-user-tag,[theme-dark='0'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{background:#504e4e}[theme-dark='0'] #CTZ_DIALOG_RIGHT{background:#2f2c2b}[theme-dark='0'] .ctz-form-box{background:#312e2e}[theme-dark='0'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div+div{color:#b8b7b7}[theme-dark='0'] #CTZ_BACKGROUND .ctz-background-item-name,[theme-dark='0'] #CTZ_BACKGROUND_LIGHT .ctz-background-item-name,[theme-dark='0'] #CTZ_BACKGROUND_DARK .ctz-background-item-name{color:#989796}[theme-dark='0'] .ctz-switch{background:#474443}[theme-dark='0'] #CTZ_DIALOG_MENU>div.target,[theme-dark='0'] .ctz-switch:checked{background:#175ac0}[theme-dark='0'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div,[theme-dark='0'] #CTZ_TITLE_ICO label input:checked+img,[theme-dark='0'] .ctz-in-blocked-user-tag,[theme-dark='0'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#175ac0}[theme-dark='0'] #CTZ_DEFAULT_SELF a,[theme-dark='0'] .ctz-zhihu-key a,[theme-dark='0'] #CTZ_DIALOG_FOOTER a:hover,[theme-dark='0'] #CTZ_HISTORY_LIST a:hover,[theme-dark='0'] #CTZ_HISTORY_VIEW a:hover,[theme-dark='0'] .ctz-black-item a:hover,[theme-dark='0'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover,[theme-dark='0'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true'],[theme-dark='0'] .ctz-in-blocked-user-tag{color:#175ac0 !important}[theme-dark='0'] .ctz-form-box{border-color:#514e4e}[theme-dark='0'] .ctz-form-box .ctz-form-box-item::after,[theme-dark='0'] .key-shadow{background:#383534}[theme-dark='0'] #CTZ_DIALOG input[type='range']{background:#474443;box-shadow:inset 1px 1px 2px #474443,inset -1px -1px 2px #474443}[theme-dark='0'] #CTZ_DIALOG input[type='range']::before,[theme-dark='0'] #CTZ_DIALOG input[type='range']::after{background:#5a5958}[theme-dark='0'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb{background:#989797;border:1px solid #b0b0af}[theme-dark='0'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb:active{background:#b0b0af}[theme-dark='0'] .ctz-button{background:#62605e;border-color:#62605e;color:#dcdcdc}[theme-dark='1'] #CTZ_DIALOG{color:#dfdfdf;box-shadow:2px 2px 4px #4a4848,-2px -2px 4px #4a4848}[theme-dark='1'] #CTZ_DIALOG,[theme-dark='1'] #CTZ_DIALOG_LEFT,[theme-dark='1'] #CTZ_DIALOG_FOOTER,[theme-dark='1'] #CTZ_EXTRA_OUTPUT_DIALOG,[theme-dark='1'] .ctz-black-item,[theme-dark='1'] .ctz-blocked-users-tag,[theme-dark='1'] .ctz-in-blocked-user-tag,[theme-dark='1'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{background:#504e4e}[theme-dark='1'] #CTZ_DIALOG_RIGHT{background:#2f2c2b}[theme-dark='1'] .ctz-form-box{background:#312e2e}[theme-dark='1'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div+div{color:#b8b7b7}[theme-dark='1'] #CTZ_BACKGROUND .ctz-background-item-name,[theme-dark='1'] #CTZ_BACKGROUND_LIGHT .ctz-background-item-name,[theme-dark='1'] #CTZ_BACKGROUND_DARK .ctz-background-item-name{color:#989796}[theme-dark='1'] .ctz-switch{background:#474443}[theme-dark='1'] #CTZ_DIALOG_MENU>div.target,[theme-dark='1'] .ctz-switch:checked{background:#175ac0}[theme-dark='1'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div,[theme-dark='1'] #CTZ_TITLE_ICO label input:checked+img,[theme-dark='1'] .ctz-in-blocked-user-tag,[theme-dark='1'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#175ac0}[theme-dark='1'] #CTZ_DEFAULT_SELF a,[theme-dark='1'] .ctz-zhihu-key a,[theme-dark='1'] #CTZ_DIALOG_FOOTER a:hover,[theme-dark='1'] #CTZ_HISTORY_LIST a:hover,[theme-dark='1'] #CTZ_HISTORY_VIEW a:hover,[theme-dark='1'] .ctz-black-item a:hover,[theme-dark='1'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover,[theme-dark='1'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true'],[theme-dark='1'] .ctz-in-blocked-user-tag{color:#175ac0 !important}[theme-dark='1'] .ctz-form-box{border-color:#514e4e}[theme-dark='1'] .ctz-form-box .ctz-form-box-item::after,[theme-dark='1'] .key-shadow{background:#383534}[theme-dark='1'] #CTZ_DIALOG input[type='range']{background:#474443;box-shadow:inset 1px 1px 2px #474443,inset -1px -1px 2px #474443}[theme-dark='1'] #CTZ_DIALOG input[type='range']::before,[theme-dark='1'] #CTZ_DIALOG input[type='range']::after{background:#5a5958}[theme-dark='1'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb{background:#989797;border:1px solid #b0b0af}[theme-dark='1'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb:active{background:#b0b0af}[theme-dark='1'] .ctz-button{background:#62605e;border-color:#62605e;color:#dcdcdc}[theme-dark='2'] #CTZ_DIALOG{color:#dfdfdf;box-shadow:2px 2px 4px #4a4848,-2px -2px 4px #4a4848}[theme-dark='2'] #CTZ_DIALOG,[theme-dark='2'] #CTZ_DIALOG_LEFT,[theme-dark='2'] #CTZ_DIALOG_FOOTER,[theme-dark='2'] #CTZ_EXTRA_OUTPUT_DIALOG,[theme-dark='2'] .ctz-black-item,[theme-dark='2'] .ctz-blocked-users-tag,[theme-dark='2'] .ctz-in-blocked-user-tag,[theme-dark='2'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{background:#504e4e}[theme-dark='2'] #CTZ_DIALOG_RIGHT{background:#2f2c2b}[theme-dark='2'] .ctz-form-box{background:#312e2e}[theme-dark='2'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div+div{color:#b8b7b7}[theme-dark='2'] #CTZ_BACKGROUND .ctz-background-item-name,[theme-dark='2'] #CTZ_BACKGROUND_LIGHT .ctz-background-item-name,[theme-dark='2'] #CTZ_BACKGROUND_DARK .ctz-background-item-name{color:#989796}[theme-dark='2'] .ctz-switch{background:#474443}[theme-dark='2'] #CTZ_DIALOG_MENU>div.target,[theme-dark='2'] .ctz-switch:checked{background:#175ac0}[theme-dark='2'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div,[theme-dark='2'] #CTZ_TITLE_ICO label input:checked+img,[theme-dark='2'] .ctz-in-blocked-user-tag,[theme-dark='2'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#175ac0}[theme-dark='2'] #CTZ_DEFAULT_SELF a,[theme-dark='2'] .ctz-zhihu-key a,[theme-dark='2'] #CTZ_DIALOG_FOOTER a:hover,[theme-dark='2'] #CTZ_HISTORY_LIST a:hover,[theme-dark='2'] #CTZ_HISTORY_VIEW a:hover,[theme-dark='2'] .ctz-black-item a:hover,[theme-dark='2'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover,[theme-dark='2'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true'],[theme-dark='2'] .ctz-in-blocked-user-tag{color:#175ac0 !important}[theme-dark='2'] .ctz-form-box{border-color:#514e4e}[theme-dark='2'] .ctz-form-box .ctz-form-box-item::after,[theme-dark='2'] .key-shadow{background:#383534}[theme-dark='2'] #CTZ_DIALOG input[type='range']{background:#474443;box-shadow:inset 1px 1px 2px #474443,inset -1px -1px 2px #474443}[theme-dark='2'] #CTZ_DIALOG input[type='range']::before,[theme-dark='2'] #CTZ_DIALOG input[type='range']::after{background:#5a5958}[theme-dark='2'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb{background:#989797;border:1px solid #b0b0af}[theme-dark='2'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb:active{background:#b0b0af}[theme-dark='2'] .ctz-button{background:#62605e;border-color:#62605e;color:#dcdcdc}[theme-dark='3'] #CTZ_DIALOG{color:#dfdfdf;box-shadow:2px 2px 4px #4a4848,-2px -2px 4px #4a4848}[theme-dark='3'] #CTZ_DIALOG,[theme-dark='3'] #CTZ_DIALOG_LEFT,[theme-dark='3'] #CTZ_DIALOG_FOOTER,[theme-dark='3'] #CTZ_EXTRA_OUTPUT_DIALOG,[theme-dark='3'] .ctz-black-item,[theme-dark='3'] .ctz-blocked-users-tag,[theme-dark='3'] .ctz-in-blocked-user-tag,[theme-dark='3'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{background:#504e4e}[theme-dark='3'] #CTZ_DIALOG_RIGHT{background:#2f2c2b}[theme-dark='3'] .ctz-form-box{background:#312e2e}[theme-dark='3'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div+div{color:#b8b7b7}[theme-dark='3'] #CTZ_BACKGROUND .ctz-background-item-name,[theme-dark='3'] #CTZ_BACKGROUND_LIGHT .ctz-background-item-name,[theme-dark='3'] #CTZ_BACKGROUND_DARK .ctz-background-item-name{color:#989796}[theme-dark='3'] .ctz-switch{background:#474443}[theme-dark='3'] #CTZ_DIALOG_MENU>div.target,[theme-dark='3'] .ctz-switch:checked{background:#175ac0}[theme-dark='3'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div,[theme-dark='3'] #CTZ_TITLE_ICO label input:checked+img,[theme-dark='3'] .ctz-in-blocked-user-tag,[theme-dark='3'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#175ac0}[theme-dark='3'] #CTZ_DEFAULT_SELF a,[theme-dark='3'] .ctz-zhihu-key a,[theme-dark='3'] #CTZ_DIALOG_FOOTER a:hover,[theme-dark='3'] #CTZ_HISTORY_LIST a:hover,[theme-dark='3'] #CTZ_HISTORY_VIEW a:hover,[theme-dark='3'] .ctz-black-item a:hover,[theme-dark='3'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover,[theme-dark='3'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true'],[theme-dark='3'] .ctz-in-blocked-user-tag{color:#175ac0 !important}[theme-dark='3'] .ctz-form-box{border-color:#514e4e}[theme-dark='3'] .ctz-form-box .ctz-form-box-item::after,[theme-dark='3'] .key-shadow{background:#383534}[theme-dark='3'] #CTZ_DIALOG input[type='range']{background:#474443;box-shadow:inset 1px 1px 2px #474443,inset -1px -1px 2px #474443}[theme-dark='3'] #CTZ_DIALOG input[type='range']::before,[theme-dark='3'] #CTZ_DIALOG input[type='range']::after{background:#5a5958}[theme-dark='3'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb{background:#989797;border:1px solid #b0b0af}[theme-dark='3'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb:active{background:#b0b0af}[theme-dark='3'] .ctz-button{background:#62605e;border-color:#62605e;color:#dcdcdc}[theme-dark='4'] #CTZ_DIALOG{color:#dfdfdf;box-shadow:2px 2px 4px #4a4848,-2px -2px 4px #4a4848}[theme-dark='4'] #CTZ_DIALOG,[theme-dark='4'] #CTZ_DIALOG_LEFT,[theme-dark='4'] #CTZ_DIALOG_FOOTER,[theme-dark='4'] #CTZ_EXTRA_OUTPUT_DIALOG,[theme-dark='4'] .ctz-black-item,[theme-dark='4'] .ctz-blocked-users-tag,[theme-dark='4'] .ctz-in-blocked-user-tag,[theme-dark='4'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{background:#504e4e}[theme-dark='4'] #CTZ_DIALOG_RIGHT{background:#2f2c2b}[theme-dark='4'] .ctz-form-box{background:#312e2e}[theme-dark='4'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div+div{color:#b8b7b7}[theme-dark='4'] #CTZ_BACKGROUND .ctz-background-item-name,[theme-dark='4'] #CTZ_BACKGROUND_LIGHT .ctz-background-item-name,[theme-dark='4'] #CTZ_BACKGROUND_DARK .ctz-background-item-name{color:#989796}[theme-dark='4'] .ctz-switch{background:#474443}[theme-dark='4'] #CTZ_DIALOG_MENU>div.target,[theme-dark='4'] .ctz-switch:checked{background:#175ac0}[theme-dark='4'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div,[theme-dark='4'] #CTZ_TITLE_ICO label input:checked+img,[theme-dark='4'] .ctz-in-blocked-user-tag,[theme-dark='4'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#175ac0}[theme-dark='4'] #CTZ_DEFAULT_SELF a,[theme-dark='4'] .ctz-zhihu-key a,[theme-dark='4'] #CTZ_DIALOG_FOOTER a:hover,[theme-dark='4'] #CTZ_HISTORY_LIST a:hover,[theme-dark='4'] #CTZ_HISTORY_VIEW a:hover,[theme-dark='4'] .ctz-black-item a:hover,[theme-dark='4'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover,[theme-dark='4'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true'],[theme-dark='4'] .ctz-in-blocked-user-tag{color:#175ac0 !important}[theme-dark='4'] .ctz-form-box{border-color:#514e4e}[theme-dark='4'] .ctz-form-box .ctz-form-box-item::after,[theme-dark='4'] .key-shadow{background:#383534}[theme-dark='4'] #CTZ_DIALOG input[type='range']{background:#474443;box-shadow:inset 1px 1px 2px #474443,inset -1px -1px 2px #474443}[theme-dark='4'] #CTZ_DIALOG input[type='range']::before,[theme-dark='4'] #CTZ_DIALOG input[type='range']::after{background:#5a5958}[theme-dark='4'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb{background:#989797;border:1px solid #b0b0af}[theme-dark='4'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb:active{background:#b0b0af}[theme-dark='4'] .ctz-button{background:#62605e;border-color:#62605e;color:#dcdcdc}[theme-dark='5'] #CTZ_DIALOG{color:#dfdfdf;box-shadow:2px 2px 4px #4a4848,-2px -2px 4px #4a4848}[theme-dark='5'] #CTZ_DIALOG,[theme-dark='5'] #CTZ_DIALOG_LEFT,[theme-dark='5'] #CTZ_DIALOG_FOOTER,[theme-dark='5'] #CTZ_EXTRA_OUTPUT_DIALOG,[theme-dark='5'] .ctz-black-item,[theme-dark='5'] .ctz-blocked-users-tag,[theme-dark='5'] .ctz-in-blocked-user-tag,[theme-dark='5'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{background:#504e4e}[theme-dark='5'] #CTZ_DIALOG_RIGHT{background:#2f2c2b}[theme-dark='5'] .ctz-form-box{background:#312e2e}[theme-dark='5'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div+div{color:#b8b7b7}[theme-dark='5'] #CTZ_BACKGROUND .ctz-background-item-name,[theme-dark='5'] #CTZ_BACKGROUND_LIGHT .ctz-background-item-name,[theme-dark='5'] #CTZ_BACKGROUND_DARK .ctz-background-item-name{color:#989796}[theme-dark='5'] .ctz-switch{background:#474443}[theme-dark='5'] #CTZ_DIALOG_MENU>div.target,[theme-dark='5'] .ctz-switch:checked{background:#570d0d}[theme-dark='5'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div,[theme-dark='5'] #CTZ_TITLE_ICO label input:checked+img,[theme-dark='5'] .ctz-in-blocked-user-tag,[theme-dark='5'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#570d0d}[theme-dark='5'] #CTZ_DEFAULT_SELF a,[theme-dark='5'] .ctz-zhihu-key a,[theme-dark='5'] #CTZ_DIALOG_FOOTER a:hover,[theme-dark='5'] #CTZ_HISTORY_LIST a:hover,[theme-dark='5'] #CTZ_HISTORY_VIEW a:hover,[theme-dark='5'] .ctz-black-item a:hover,[theme-dark='5'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover,[theme-dark='5'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true'],[theme-dark='5'] .ctz-in-blocked-user-tag{color:#570d0d !important}[theme-dark='5'] .ctz-form-box{border-color:#514e4e}[theme-dark='5'] .ctz-form-box .ctz-form-box-item::after,[theme-dark='5'] .key-shadow{background:#383534}[theme-dark='5'] #CTZ_DIALOG input[type='range']{background:#474443;box-shadow:inset 1px 1px 2px #474443,inset -1px -1px 2px #474443}[theme-dark='5'] #CTZ_DIALOG input[type='range']::before,[theme-dark='5'] #CTZ_DIALOG input[type='range']::after{background:#5a5958}[theme-dark='5'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb{background:#989797;border:1px solid #b0b0af}[theme-dark='5'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb:active{background:#b0b0af}[theme-dark='5'] .ctz-button{background:#62605e;border-color:#62605e;color:#dcdcdc}[theme-dark='6'] #CTZ_DIALOG{color:#dfdfdf;box-shadow:2px 2px 4px #4a4848,-2px -2px 4px #4a4848}[theme-dark='6'] #CTZ_DIALOG,[theme-dark='6'] #CTZ_DIALOG_LEFT,[theme-dark='6'] #CTZ_DIALOG_FOOTER,[theme-dark='6'] #CTZ_EXTRA_OUTPUT_DIALOG,[theme-dark='6'] .ctz-black-item,[theme-dark='6'] .ctz-blocked-users-tag,[theme-dark='6'] .ctz-in-blocked-user-tag,[theme-dark='6'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{background:#504e4e}[theme-dark='6'] #CTZ_DIALOG_RIGHT{background:#2f2c2b}[theme-dark='6'] .ctz-form-box{background:#312e2e}[theme-dark='6'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div+div{color:#b8b7b7}[theme-dark='6'] #CTZ_BACKGROUND .ctz-background-item-name,[theme-dark='6'] #CTZ_BACKGROUND_LIGHT .ctz-background-item-name,[theme-dark='6'] #CTZ_BACKGROUND_DARK .ctz-background-item-name{color:#989796}[theme-dark='6'] .ctz-switch{background:#474443}[theme-dark='6'] #CTZ_DIALOG_MENU>div.target,[theme-dark='6'] .ctz-switch:checked{background:#093333}[theme-dark='6'] #CTZ_BACKGROUND .ctz-background-item input:checked+div+div,[theme-dark='6'] #CTZ_TITLE_ICO label input:checked+img,[theme-dark='6'] .ctz-in-blocked-user-tag,[theme-dark='6'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{border-color:#093333}[theme-dark='6'] #CTZ_DEFAULT_SELF a,[theme-dark='6'] .ctz-zhihu-key a,[theme-dark='6'] #CTZ_DIALOG_FOOTER a:hover,[theme-dark='6'] #CTZ_HISTORY_LIST a:hover,[theme-dark='6'] #CTZ_HISTORY_VIEW a:hover,[theme-dark='6'] .ctz-black-item a:hover,[theme-dark='6'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover,[theme-dark='6'] [data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true'],[theme-dark='6'] .ctz-in-blocked-user-tag{color:#093333 !important}[theme-dark='6'] .ctz-form-box{border-color:#514e4e}[theme-dark='6'] .ctz-form-box .ctz-form-box-item::after,[theme-dark='6'] .key-shadow{background:#383534}[theme-dark='6'] #CTZ_DIALOG input[type='range']{background:#474443;box-shadow:inset 1px 1px 2px #474443,inset -1px -1px 2px #474443}[theme-dark='6'] #CTZ_DIALOG input[type='range']::before,[theme-dark='6'] #CTZ_DIALOG input[type='range']::after{background:#5a5958}[theme-dark='6'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb{background:#989797;border:1px solid #b0b0af}[theme-dark='6'] #CTZ_DIALOG input[type='range']::-webkit-slider-thumb:active{background:#b0b0af}[theme-dark='6'] .ctz-button{background:#62605e;border-color:#62605e;color:#dcdcdc}.ctz-button{outline:none;position:relative;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;user-select:none;touch-action:manipulation;font-size:14px;height:24px;padding:0px 8px;border-radius:6px;border:1px solid transparent;background-color:#fff;border-color:rgba(150,162,170,0.4);font-weight:400}.ctz-button:hover{font-weight:600}.ctz-button:active{background:#f0f0f0;font-weight:400}.ctz-button.ctz-button-primary{background:#007aff;color:#fff;border-color:transparent}.ctz-button.ctz-button-primary:hover{background:#0040dd}.ctz-button.ctz-button-primary:active{background:#007aff}.ctz-button-red{color:#ff3b30 !important;border:1px solid #ff3b30 !important}.ctz-button-red:hover{color:#ff453a !important;border:1px solid #ff453a !important}.ctz-button:disabled{border-color:#d0d0d0;background-color:rgba(0,0,0,0.08);color:#b0b0b0;cursor:not-allowed}.Profile-mainColumn,.Collections-mainColumn{flex:1}#root .css-1liaddi{margin-right:0}.ContentItem-title div{display:inline}.css-1acwmmj:empty{display:none !important}.css-hr0k1l::after{content:'点击键盘左、右按键切换图片';position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#fff}.HotLanding-contentItemCount.HotLanding-contentItemCountWithoutSub{margin-top:12px}body[data-suspension-pickup='true'] .ContentItem-actions.Sticky.is-fixed button[data-zop-retract-question='true']{position:fixed;bottom:50px;background:#fff;padding:12px;box-shadow:-6px 6px 12px #c9c9c9,6px -6px 12px #ffffff;border-radius:12px}body[data-suspension-pickup='true'] .ContentItem-actions.Sticky.is-fixed button[data-zop-retract-question='true']:hover{background:#fff;color:#007aff !important;font-weight:600}body[data-suspension-pickup='true'] .ContentItem-actions.Sticky.is-fixed button[data-zop-retract-question='true']:active{font-weight:200 !important}.Topstory-container,.css-knqde,.Search-container{width:fit-content !important}.Question-main .Question-mainColumn,.QuestionHeader-main{flex:1}.Question-main .List-item{border-bottom:1px dashed #ddd}.Question-main .Question-sideColumn{margin-left:12px}.QuestionHeader{min-width:auto}.QuestionHeader .QuestionHeader-content{margin:0 auto;padding:0;max-width:initial !important}.zhuanlan .AuthorInfo,.zhuanlan .css-1xy3kyp{max-width:initial}.GifPlayer.isPlaying img{cursor:pointer !important}#CTZ_DIALOG{transition-property:transform;transition-duration:500ms;transition-timing-function:cubic-bezier(.2, 0, 0, 1);position:fixed;left:50%;top:50%;transform:translate(-50%, -50%);transition-property:height;width:800px;height:600px;max-width:100vw;max-height:100vh;border-radius:8px;box-shadow:2px 2px 4px #dbdbdb,-2px -2px 4px #dbdbdb;background:#e1e0e0;flex-direction:column;overflow:hidden;z-index:202;font-size:14px;border:1px solid rgba(142,142,147,0.1)}#CTZ_DIALOG input[type='text'],#CTZ_DIALOG input[type='number'],#CTZ_DIALOG textarea{box-sizing:border-box;margin:0;padding:1px 4px;font-size:14px;line-height:1.5;list-style:none;position:relative;display:inline-block;min-width:0;border:1px solid rgba(150,162,170,0.4);border-radius:4px;transition:all .2s;background:transparent}#CTZ_DIALOG label{cursor:pointer;transition:all .2s}#CTZ_DIALOG label:hover{color:#007aff !important}#CTZ_DIALOG label .ctz-i[type='checkbox']~div{margin-left:8px;display:inline-block}#CTZ_DIALOG ::-webkit-scrollbar{width:8px;height:8px;background:transparent}#CTZ_DIALOG ::-webkit-scrollbar-track{border-radius:0}#CTZ_DIALOG ::-webkit-scrollbar-thumb{background:#bbb;transition:all .2s;border-radius:8px}#CTZ_DIALOG ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}#CTZ_DIALOG a{transition:all .2s;text-decoration:none}#CTZ_DIALOG .ctz-button{min-width:68px}#CTZ_DIALOG_LEFT{width:160px;display:flex;flex-direction:column;overflow:hidden;background:#e1e0e0}#CTZ_DIALOG_MENU{flex:1;overflow:hidden auto;padding:8px 12px 0}#CTZ_DIALOG_MENU>div{box-sizing:border-box;line-height:38px;padding-left:12px;border-radius:6px;font-size:14px;margin-bottom:2px;cursor:pointer}#CTZ_DIALOG_MENU>div:active{font-weight:200 !important}#CTZ_DIALOG_MENU>div:hover{background:rgba(77,66,86,0.08)}#CTZ_DIALOG_MENU>div.target{color:#fff !important;background:#007aff}#CTZ_DIALOG_RIGHT{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#ededec}#CTZ_DIALOG_RIGHT_TITLE{height:52px;line-height:52px;font-size:16px;font-weight:600;box-sizing:border-box;padding-left:18px;border-bottom:1px solid rgba(150,162,170,0.2)}#CTZ_DIALOG_RIGHT_TITLE>span{font-size:12px;color:#ff3b30;padding-left:8px}#CTZ_DIALOG_MAIN{flex:1;overflow-y:auto}#CTZ_DIALOG_MAIN>div{box-sizing:border-box;width:100%;padding:18px}#CTZ_DIALOG_CONTENT{flex:1;display:flex;overflow:hidden}#CTZ_DIALOG_FOOTER{border-top:1px solid rgba(150,162,170,0.2);box-sizing:border-box;padding:6px 12px}#CTZ_DIALOG_FOOTER>div{display:inline-block}#CTZ_DIALOG_FOOTER .ctz-version{float:right;line-height:24px}#CTZ_DIALOG_FOOTER a{display:inline-block;border-radius:8px;height:24px;line-height:24px;padding:0 12px}#CTZ_DIALOG_FOOTER a:hover{background:rgba(77,66,86,0.08);color:#007aff !important;font-weight:600}#CTZ_OPEN_CLOSE{transition-property:none;transition-duration:300ms;transition-timing-function:cubic-bezier(.2, 0, 0, 1);user-select:none;width:48px;height:48px;display:flex;align-items:center;justify-content:center;text-align:center;background:rgba(150,162,170,0.4);border-radius:8px;opacity:.8;font-size:44px;cursor:pointer;z-index:201;position:fixed;bottom:0;right:0;box-sizing:border-box;border:2px solid rgba(150,162,170,0.2)}#CTZ_OPEN_CLOSE:hover{opacity:1}#CTZ_LEFT_BUTTONS{margin:8px 0 0 8px}#CTZ_LEFT_BUTTONS button{height:20px;width:20px;border-radius:6px;padding:0;border:0;transform:scale(.75);color:#fff;font-size:12px;line-height:20px;min-width:0 !important}#CTZ_LEFT_BUTTONS [name='dialogClose']{background:#fe6059}#CTZ_LEFT_BUTTONS [name='dialogClose']:hover{background:#d70015;color:#fff !important;font-weight:600}#CTZ_LEFT_BUTTONS [name='dialogBig']{background:#27c93f}#CTZ_LEFT_BUTTONS [name='dialogBig']:hover{background:#28cd41;color:#fff !important;font-weight:600}.gear{width:24px;height:24px;position:relative;border-radius:50%;box-sizing:border-box;border:6px solid #8e8e93;background:transparent}.gear_line_1,.gear_line_2,.gear_line_3,.gear_line_4{position:absolute;box-sizing:border-box;width:30px;height:6px;border-radius:2px;border-left:6px solid #8e8e93;border-right:6px solid #8e8e93;left:50%;top:50%;transform:translate(-50%, -50%)}.gear_line_2{transform:translate(-50%, -50%) rotate(45deg)}.gear_line_3{transform:translate(-50%, -50%) rotate(90deg)}.gear_line_4{transform:translate(-50%, -50%) rotate(135deg)}#CTZ_EXTRA_OUTPUT_COVER{position:fixed;left:50%;top:50%;transform:translate(-50%, -50%);width:800px;height:600px;background:rgba(0,0,0,0.4);z-index:203;border-radius:8px}#CTZ_EXTRA_OUTPUT_DIALOG{position:fixed;left:50%;top:50%;transform:translate(-50%, -50%);z-index:204;background:#fff;border-radius:8px;overflow:hidden;min-width:420px}#CTZ_EXTRA_OUTPUT_DIALOG .ctz-button{min-width:68px}.ctz-zhida{color:#09408e;margin:0 2px}.ctz-zhida span{font-size:10px;display:inline-block;vertical-align:top;height:15px;line-height:15px}.ctz-radio-group{display:flex}.ctz-radio-group label{cursor:pointer;position:relative;margin:0 !important}.ctz-radio-group label div{box-sizing:border-box;padding:0 8px;height:24px;display:flex;align-items:center;justify-content:center;border-top:1px solid rgba(150,162,170,0.4);border-bottom:1px solid rgba(150,162,170,0.4);position:relative}.ctz-radio-group label div::after{content:'';position:absolute;height:100%;width:1px;background:rgba(150,162,170,0.4);right:0;top:0}.ctz-radio-group label:first-of-type div{border-radius:8px 0 0 8px;border-left:1px solid rgba(150,162,170,0.4)}.ctz-radio-group label:first-of-type div::before{display:none}.ctz-radio-group label:last-of-type div{border-radius:0 8px 8px 0;border-right:1px solid rgba(150,162,170,0.4)}.ctz-radio-group label:last-of-type div::after{display:none}.ctz-radio-group label:hover div{background:rgba(0,122,255,0.1)}.ctz-radio-group input{visibility:hidden;position:absolute}.ctz-radio-group input:checked+div{background:#007aff;color:#fff;border-color:#007aff;z-index:1}.ctz-radio-group input:checked+div::after{background:#007aff;z-index:1}.ctz-radio-group input:checked+div::before{content:'';position:absolute;height:100%;width:1px;background:#007aff;left:0;top:0;z-index:1}.ctz-radio{display:inline-block;padding-left:24px;line-height:24px}.ctz-radio input[type='radio']{display:none}.ctz-radio input[type='radio']+div{position:relative;cursor:pointer}.ctz-radio input[type='radio']+div::before{content:'';position:absolute;left:-20px;top:4px;border-radius:50%;border:1px solid #cecece;width:14px;height:14px;background:#fff;box-shadow:inset 5px 5px 5px #f0f0f0,inset -5px -5px 5px #ffffff}.ctz-radio input[type='radio']+div::after{content:'';position:absolute;left:-16px;top:8px;border-radius:50%;width:8px;height:8px}.ctz-radio input[type='radio']:checked+div::before{background:#007aff;border-color:#007aff;box-shadow:none}.ctz-radio input[type='radio']:checked+div::after{background:#fff}.ctz-radio input[type='radio']:focus+div::before{box-shadow:0 0 8px #007aff}.ctz-radio input[type='radio']:disabled+div::before{border:1px solid #cecece;box-shadow:0 0 4px #ddd}.ctz-i:not(.ctz-switch)[type='checkbox']{appearance:none;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;-o-appearance:none;transition:all .2s;width:22px;height:22px;margin:0;position:relative;border-radius:4px;box-sizing:border-box;border:none;cursor:pointer}.ctz-i:not(.ctz-switch)[type='checkbox']::after{cursor:pointer;transition:all .2s;content:' ';width:22px;height:22px;border-radius:4px;border:1px solid rgba(150,162,170,0.4);box-sizing:border-box;left:0px;top:0px;z-index:1;position:absolute;font-weight:600;display:flex;align-items:center;justify-content:center}.ctz-i:not(.ctz-switch)[type='checkbox']:hover::after{border-color:#007aff}.ctz-i:not(.ctz-switch)[type='checkbox']:checked::after{content:'✓';font-size:16px;font-weight:600;color:#fff;background:#007aff;border-color:#007aff}.ctz-checkbox-group label{display:inline-flex !important;padding-right:12px}.ctz-checkbox-group label div{margin-right:12px}.ctz-checkbox-group label::after{content:'';height:12px;width:1px;background:rgba(150,162,170,0.4)}.ctz-checkbox-group label:last-of-type::after{display:none}.ctz-tooltip{position:relative;display:inline-block;margin-left:4px}.ctz-tooltip>span:first-child{display:inline-block;font-size:12px;border-radius:50%;border:1px solid #98989d;color:#98989d;width:12px;height:12px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}.ctz-tooltip>span:last-child{display:none;position:absolute;top:30px;left:-50px;background-color:rgba(0,0,0,0.65);color:#fff;padding:8px 12px;z-index:10;border-radius:6px;width:max-content;line-height:24px}.ctz-tooltip>span:last-child::after{content:'';width:0;height:0;position:absolute;border-bottom:6px solid rgba(0,0,0,0.65);border-left:8px solid transparent;border-right:8px solid transparent;top:-6px;left:50px}.ctz-tooltip:hover>span:first-child{border-color:#007aff;color:#007aff}.ctz-tooltip:hover>span:last-child{display:block}.ctz-form-box,#CTZ_CHANGELOG ul{background:#e9e9e8;border:1px solid #dfdfde;border-radius:8px;margin-bottom:14px}.ctz-form-box .ctz-form-box-item,#CTZ_CHANGELOG ul .ctz-form-box-item{display:flex;padding:8px 12px;min-height:24px;position:relative}.ctz-form-box .ctz-form-box-item>div:first-of-type,#CTZ_CHANGELOG ul .ctz-form-box-item>div:first-of-type{flex:1;line-height:24px;word-break:keep-all;padding-right:12px}.ctz-form-box .ctz-form-box-item>div:nth-child(2),#CTZ_CHANGELOG ul .ctz-form-box-item>div:nth-child(2){display:flex;flex-wrap:wrap;align-items:center}.ctz-form-box .ctz-form-box-item::after,#CTZ_CHANGELOG ul .ctz-form-box-item::after{content:'';position:absolute;background:#e0e0df;height:1px;width:96%;bottom:0;left:50%;transform:translateX(-50%)}.ctz-form-box .ctz-form-box-item:last-of-type::after,#CTZ_CHANGELOG ul .ctz-form-box-item:last-of-type::after{display:none}.ctz-form-box .ctz-form-box-item.ctz-form-box-item-vertical,#CTZ_CHANGELOG ul .ctz-form-box-item.ctz-form-box-item-vertical{display:block}.ctz-form-box .ctz-form-box-item.ctz-form-box-item-vertical>div:nth-child(2),#CTZ_CHANGELOG ul .ctz-form-box-item.ctz-form-box-item-vertical>div:nth-child(2){display:block;padding-top:4px}.ctz-title,#CTZ_CHANGELOG h2{font-weight:bold;font-size:14px;display:flex;align-items:center;height:42px;line-height:42px;padding-left:10px}.ctz-title>span,#CTZ_CHANGELOG h2>span{font-size:12px;color:#999;padding-left:8px}.ctz-title>span b,#CTZ_CHANGELOG h2>span b{color:#ff3b30}.ctz-switch{width:40px;height:24px;position:relative;background-color:#dcdfe6;border-radius:20px;background-clip:content-box;display:inline-block;appearance:none;-webkit-appearance:none;-moz-appearance:none;user-select:none;outline:none;margin:0;cursor:pointer}.ctz-switch::before{content:'';position:absolute;width:22px;height:22px;background-color:#ffffff;border-radius:50%;left:2px;top:0;bottom:0;margin:auto;transition:.3s}.ctz-switch:checked{background-color:#007aff;transition:.6s}.ctz-switch:checked::before{left:17px;transition:.3s}.ctz-fetch-intercept .ctz-need-fetch{display:none}.ctz-fetch-intercept.ctz-fetch-intercept-close{color:#b0b0b0 !important;cursor:not-allowed !important;text-decoration:line-through}.ctz-fetch-intercept.ctz-fetch-intercept-close span.ctz-need-fetch{display:inline}.ctz-fetch-intercept.ctz-fetch-intercept-close div.ctz-need-fetch{display:block}.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-remove-block{cursor:not-allowed !important}.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-black-item .ctz-remove-block:hover,.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-black-item a:hover{background:transparent !important;color:#b0b0b0 !important}.ctz-fetch-intercept.ctz-fetch-intercept-close:hover{color:#b0b0b0 !important}.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-switch{background-color:rgba(0,0,0,0.08)}#CTZ_DIALOG input[type='range']{outline:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:6px;border-radius:8px;background:#dddddc;position:relative;box-shadow:inset 1px 1px 2px #d4d4d3,inset -1px -1px 2px #d4d4d3}#CTZ_DIALOG input[type='range']::before,#CTZ_DIALOG input[type='range']::after{content:'';background:#c6c6c5;position:absolute;height:10px;width:3px;border-radius:4px;top:-2px}#CTZ_DIALOG input[type='range']::before{left:-2px}#CTZ_DIALOG input[type='range']::after{right:-2px}#CTZ_DIALOG input[type='range']::-webkit-slider-thumb{-webkit-appearance:none;-moz-appearance:none;appearance:none;transition:all .2s;width:10px;height:25px;border-radius:16px;background:#fff;border:1px solid #c7c7c6;z-index:5}#CTZ_DIALOG input[type='range']::-webkit-slider-thumb:active{background:#f0f0f0}.ctz-select{border:0;background:transparent;text-align:right}#CTZ_BACKGROUND{gap:12px}#CTZ_BACKGROUND .ctz-background-item{position:relative}#CTZ_BACKGROUND .ctz-background-item input{position:absolute;visibility:hidden}#CTZ_BACKGROUND .ctz-background-item input:checked+div+div{border-color:#007aff}#CTZ_BACKGROUND .ctz-background-item input:checked+div+div+div{color:#272726}#CTZ_BACKGROUND .ctz-background-item-div{border-radius:8px;height:46px;width:68px;margin:4px}#CTZ_BACKGROUND .ctz-background-item-border{height:46px;width:68px;border-radius:12px;position:absolute;top:0;left:0;border:4px solid transparent}#CTZ_BACKGROUND .ctz-background-item-name{font-size:12px;text-align:center;padding-top:8px;color:#777776}#CTZ_BACKGROUND_LIGHT{padding-right:4px}#CTZ_BACKGROUND_DARK{padding-right:32px}#CTZ_BACKGROUND_LIGHT,#CTZ_BACKGROUND_DARK{gap:10px;padding-top:4px;padding-bottom:24px}#CTZ_BACKGROUND_LIGHT .ctz-background-item,#CTZ_BACKGROUND_DARK .ctz-background-item{position:relative}#CTZ_BACKGROUND_LIGHT .ctz-background-item input,#CTZ_BACKGROUND_DARK .ctz-background-item input{position:absolute;visibility:hidden}#CTZ_BACKGROUND_LIGHT .ctz-background-item input:checked+div+div,#CTZ_BACKGROUND_DARK .ctz-background-item input:checked+div+div,#CTZ_BACKGROUND_LIGHT .ctz-background-item input:checked+div+div+div,#CTZ_BACKGROUND_DARK .ctz-background-item input:checked+div+div+div{opacity:1}#CTZ_BACKGROUND_LIGHT .ctz-background-item-div,#CTZ_BACKGROUND_DARK .ctz-background-item-div{height:18px;width:18px;border-radius:50%}#CTZ_BACKGROUND_LIGHT .ctz-background-item-border,#CTZ_BACKGROUND_DARK .ctz-background-item-border{height:calc(18px / 2);width:calc(18px / 2);border-radius:50%;position:absolute;top:calc(18px / 4);left:calc(18px / 4);background:#fff;opacity:0}#CTZ_BACKGROUND_LIGHT .ctz-background-item-name,#CTZ_BACKGROUND_DARK .ctz-background-item-name{font-size:12px;text-align:center;padding-top:8px;color:#777776;opacity:0;position:absolute;word-break:keep-all;left:50%;transform:translateX(-50%)}#CTZ_CONFIG .ctz-title{padding-left:0}#CTZ_CONFIG .ctz-config-buttons{text-align:right}#CTZ_CONFIG .ctz-config-buttons button{margin-left:12px}#CTZ_CONFIG textarea{resize:vertical;width:100%;margin-bottom:6px}#CTZ_DEFAULT_SELF a{color:#007aff}#CTZ_DEFAULT_SELF a:hover{color:#bbb}#CTZ_BLOCK_WORDS{padding-top:0 !important}.ctz-block-words-content{display:flex;flex-wrap:wrap;cursor:default;margin-bottom:-4px}.ctz-block-words-content>span{padding:0px 6px;border-radius:4px;font-size:14px;margin:0 4px 4px 0;border:1px solid rgba(150,162,170,0.4);cursor:pointer}.ctz-block-words-content>span:hover{color:#ff3b30;border-color:#ff3b30}#CTA_BLOCKED_USERS,#CTZ_BLOCKED_USERS_TAGS{display:flex;flex-wrap:wrap;margin:0 -8px -8px 0}.ctz-black-item{height:24px;line-height:24px;box-sizing:content-box;padding:2px 6px;margin:0 8px 8px 0;display:flex;align-items:center;border-radius:4px;border:1px solid #8e8e93;background:#fff;transition:all .2s}.ctz-black-item a:hover{color:#007aff}.ctz-black-item .ctz-remove-block{width:24px;height:24px;text-align:center;border-radius:8px;cursor:pointer;font-style:normal}.ctz-black-item .ctz-remove-block:hover{background:rgba(142,142,147,0.1)}.ctz-black-box>button,.ctz-button-black{margin-left:8px}.ctz-blocked-users-tag{height:24px;line-height:24px;box-sizing:content-box;padding:0 6px;margin:0 8px 8px 0;display:flex;align-items:center;border-radius:6px;border:1px solid #8e8e93;background:#fff}.ctz-remove-blocked-tag:hover{color:#ff3b30;font-weight:600}.ctz-remove-blocked-tag:active{font-weight:200 !important}.ctz-black-tag{padding:0 6px;background:#000;color:#fff;font-size:12px;border-radius:4px;margin-left:8px;display:inline-block;line-height:22px}.ctz-in-blocked-user-tag{margin-left:4px;border-radius:4px;font-size:12px;border:1px solid #007aff;color:#007aff;background:rgba(0,122,255,0.1);height:16px;line-height:16px;padding:0 4px}.ctz-edit-user-tag{display:inline-block;font-size:14px;margin-left:4px;cursor:pointer}.ctz-edit-user-tag:hover{font-weight:600 !important;color:#007aff}.ctz-edit-user-tag:active{font-weight:200 !important}[data-type='chooseBlockedUserTags']{padding-top:4px}[data-type='chooseBlockedUserTags'] .ctz-title{padding-left:14px;height:auto}[data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags{width:420px;padding:6px 6px 6px 14px}[data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span{cursor:pointer;display:inline-block;border-radius:6px;margin:0 8px 8px 0;border:1px solid rgba(150,162,170,0.4);padding:0 8px}[data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span:hover{background:rgba(77,66,86,0.08);color:#007aff !important;font-weight:600}[data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags>span[data-choose='true']{color:#007aff;border-color:#007aff;background:rgba(0,122,255,0.1)}[data-type='chooseBlockedUserTags'] .ctz-choose-blocked-user-tags-operate{text-align:right;padding:14px;border-top:1px solid rgba(142,142,147,0.1)}#CTZ_CHANGELOG h2{height:32px;line-height:32px}#CTZ_CHANGELOG code{color:#e98e22}#CTZ_CHANGELOG>p>code{display:block;font-size:12px;padding:0 0 8px 10px}#CTZ_CHANGELOG ul{padding:8px 12px}#CTZ_CHANGELOG li{padding-bottom:4px}#CTZ_CHANGELOG li:last-of-type{padding-bottom:0}#CTZ_CHANGELOG a{display:inline-block;padding:2px 6px;border-radius:4px}#CTZ_CHANGELOG a:hover{background:rgba(77,66,86,0.08);color:#007aff !important;font-weight:600}#CTZ_CHANGELOG a:active{font-weight:200 !important}.ctz-set-content:not(.ctz-flex-wrap)>div,.ctz-set-content:not(.ctz-flex-wrap)>label{margin-bottom:18px}.ctz-commit{font-size:12px;color:#999}.ctz-commit b{color:#ff3b30}.ctz-flex-wrap{display:flex;flex-wrap:wrap;min-height:24px;align-items:center}.ctz-flex-wrap label{margin-right:4px;display:flex;align-items:center}.ctz-flex-wrap label input[type='radio']{margin:0 4px 0 0}.ctz-video-download{position:absolute;top:20px;left:20px;font-size:24px;color:#fff;cursor:pointer}.ctz-loading{animation:loadingAnimation 2s infinite;font-size:24px;color:#91919d;cursor:none}@keyframes loadingAnimation{from{transform:rotate(0)}to{transform:rotate(360deg)}}.ctz-preview{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;overflow-y:auto;z-index:200;background-color:rgba(18,18,18,0.4)}.ctz-preview div{display:flex;justify-content:center;align-items:center;min-height:100%;width:100%}.ctz-preview div img{cursor:zoom-out;user-select:none}#CTZ_TITLE_ICO label input{display:none}#CTZ_TITLE_ICO label input:checked+img{border-color:#007aff}#CTZ_TITLE_ICO label img{width:28px;height:28px;border:4px solid transparent;border-radius:8px}.ctz-question-time{color:#999 !important;font-size:14px !important;font-weight:normal !important;line-height:24px}.ctz-stop-scroll{height:100% !important;overflow:hidden !important}.ctz-export-collection-box{float:right;text-align:right}.ctz-export-collection-box button{font-size:16px}.ctz-export-collection-box p{font-size:14px;color:#666;margin:4px 0}.ctz-pdf-dialog-item{padding:12px;border-bottom:1px solid #eee;margin:12px;background:#ffffff}.ctz-pdf-dialog-title{margin:0 0 1.4em;font-size:20px;font-weight:bold}.ctz-pdf-box-content{width:100%;background:#ffffff}.ctz-pdf-view{width:100%;background:#ffffff;word-break:break-all;white-space:pre-wrap;font-size:14px;overflow-x:hidden}.ctz-pdf-view a{color:#0066ff}.ctz-pdf-view img{max-width:100%}.ctz-pdf-view p{margin:1.4em 0}.ctz-unlock,.ctz-lock,.ctz-lock-mask{display:none;color:#999;cursor:pointer}.ctz-unlock,.ctz-lock{font-size:20px;align-items:center;justify-content:center}.ctz-lock-mask{position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:198}.position-suspensionSearch,.position-suspensionFind,.position-suspensionUser{position:fixed;z-index:100}.position-suspensionSearch:hover .ctz-unlock,.position-suspensionFind:hover .ctz-unlock,.position-suspensionUser:hover .ctz-unlock,.Topstory-container .TopstoryTabs:hover .ctz-unlock{display:flex}.position-suspensionSearch.ctz-move-this .ctz-unlock,.position-suspensionFind.ctz-move-this .ctz-unlock,.position-suspensionUser.ctz-move-this .ctz-unlock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-unlock{display:none !important}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock,.position-suspensionSearch.ctz-move-this .ctz-lock-mask,.position-suspensionFind.ctz-move-this .ctz-lock-mask,.position-suspensionUser.ctz-move-this .ctz-lock-mask,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock-mask{display:flex}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock{z-index:199;color:#cccccc}.position-suspensionFind{display:flex;flex-direction:column;margin:0 !important}.position-suspensionFind .Tabs-item{padding:0 !important;margin-bottom:4px}.position-suspensionFind .Tabs-item .Tabs-link{padding:8px !important;border-radius:4px}.position-suspensionFind .Tabs-item .Tabs-link::after{content:'' !important;display:none !important}.position-suspensionUser{width:fit-content !important;margin:0 !important;display:flex;flex-direction:column}.position-suspensionUser .AppHeader-messages,.position-suspensionUser .AppHeader-notifications,.position-suspensionUser .css-18vqx7l{margin-right:0 !important;margin-bottom:12px}.position-suspensionUser .AppHeader-login,.position-suspensionUser .AppHeader-login~button{display:none}.position-suspensionSearch{line-height:30px;border-radius:16px;width:20px;transition:width .5s}.position-suspensionSearch .ctz-search-icon{font-size:24px;transform:rotate(-60deg)}.position-suspensionSearch .SearchBar-input-focus .ctz-search-pick-up{display:none}.position-suspensionSearch.focus{width:300px}.position-suspensionSearch.focus>form,.position-suspensionSearch.focus>button,.position-suspensionSearch.focus .ctz-search-pick-up{display:block}.position-suspensionSearch.focus .ctz-search-icon{display:none}.position-suspensionSearch.focus:hover{width:324px}.position-suspensionSearch .ctz-search-icon,.position-suspensionSearch .ctz-search-pick-up{cursor:pointer;color:#0066ff}.position-suspensionSearch .ctz-search-icon:hover,.position-suspensionSearch .ctz-search-pick-up:hover{color:#005ce6}.position-suspensionSearch .ctz-search-pick-up{font-size:24px;margin-left:4px}.position-suspensionSearch>form,.position-suspensionSearch>button,.position-suspensionSearch .ctz-search-pick-up{display:none}.position-suspensionSearch .ctz-search-icon{display:block}.key-shadow{border:1px solid #e0e0e0;border-radius:4px;box-shadow:rgba(0,0,0,0.06) 0 1px 1px 0;font-weight:600;min-width:26px;height:26px;padding:0px 6px;text-align:center;margin:0 4px}#CTZ_HISTORY_LIST a,#CTZ_HISTORY_VIEW a{word-break:break-all;display:block;margin-bottom:8px;padding:6px 12px;border:1px solid rgba(150,162,170,0.4);border-radius:8px;cursor:pointer}#CTZ_HISTORY_LIST a:hover,#CTZ_HISTORY_VIEW a:hover{background:rgba(77,66,86,0.08);color:#007aff !important;font-weight:600}.ctz-zhihu-key a{color:#007aff !important}.ctz-zhihu-key a:hover{color:#bbb !important}.ctz-video-link{border:1px solid #ccc;display:inline-block;height:98px;width:fit-content;border-radius:4px;box-sizing:border-box;overflow:hidden;transition:all .3s}.ctz-video-link img{width:98px;height:98px;vertical-align:bottom}.ctz-video-link span{padding:4px 12px;display:inline-block}.ctz-video-link:hover{border-color:#005ce6;color:#005ce6}#CTZ_MESSAGE_BOX{position:fixed;left:0;top:10px;width:100%;z-index:1000}.ctz-message{margin:0 auto;width:500px;height:48px;display:flex;align-items:center;justify-content:center;font-size:14px;border-radius:8px;box-shadow:0 0 8px #d0d4d6,0 0 8px #e6eaec;margin-bottom:12px;background:#fff}#IMPORT_BY_FILE{display:inline-flex}#IMPORT_BY_FILE input{display:none}#CTZ_FILTER_BLOCK_WORDS input,#CTZ_FILTER_BLOCK_WORDS_CONTENT input{width:100%}#CTZ_COVER{position:fixed;top:0;left:-200%;width:100%;height:100%;pointer-events:none}.ctz-answer-black-box button,.ctz-comment-block-box button{font-size:12px;margin-left:8px}`;
  var tooltipHTML = (value) => `<span class="ctz-tooltip"><span>?</span><span>${value}</span></span>`;
  var range = (v, min, max, unit = "") => `<div class="ctz-flex-wrap ctz-range-${v}">${`<span style="font-size: 12px;margin-right: 8px;">当前：<span id="${v}">0</span>${unit}</span><span style="margin-right: 2px;color: #757575;font-size: 12px;">${min}${unit}</span><input class="ctz-i" type="range" min="${min}" max="${max}" name="${v}" style="width: 200px" /><span style="margin-left: 2px;color: #757575;font-size: 12px;">${max}${unit}</span>`}</div>`;
  var commonFormBoxItem = (con) => con.map(
    (item) => `<div class="ctz-form-box">${item.map(
      ({ label, value, needFetch, tooltip }) => `<div class="ctz-form-box-item ${needFetch ? "ctz-fetch-intercept" : ""}">${`<div>${label + (needFetch ? '<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span>' : "") + (tooltip ? tooltipHTML(tooltip) : "")}</div><div><input class="ctz-i ctz-switch" name="${value}" type="checkbox" value="on" /></div>`}</div>`
    ).join("")}</div>`
  ).join("");
  var initHTML = () => {
    document.body.appendChild(domC("div", { id: "CTZ_MAIN", innerHTML: INNER_HTML }));
    dom(".ctz-version").innerText = GM_info.script.version;
    addBackgroundSetting();
    domById("CTZ_VERSION_RANGE_ZHIHU").innerHTML = VERSION_RANGE.map(
      (item) => `<div class="ctz-form-box-item">${`<div>${item.label}${tooltipHTML(item.desc)}</div><div>${range(item.value, item.min, item.max) + range(item.percentValue, item.percentMin, item.percentMax, "%")}</div>`}</div><div class="ctz-form-box-item">${`<div>${item.percentChooseLabel}</div><div><input class="ctz-i ctz-switch" name="${item.percentChooseValue}" type="checkbox" value="on" /></div>`}</div>`
    ).join("");
    domById("CTZ_IMAGE_SIZE_CUSTOM").innerHTML = `<div>回答和文章图片宽度</div>` + range("zoomImageSize", 0, 1e3);
    domById("CTZ_IMAGE_HEIGHT_CUSTOM").innerHTML = `<div>图片最大高度</div>` + range("zoomImageHeightSize", 0, 1e3);
    domById("CTZ_LIST_VIDEO_SIZE_CUSTOM").innerHTML = `<div>列表视频回答宽度</div>` + range("zoomListVideoSize", 0, 1e3);
    domById("CTZ_FONT_SIZE_IN_ZHIHU").innerHTML = FONT_SIZE_INPUT.map(
      (item) => `<div class="ctz-form-box-item">${`<div>${item.label}</div><div>${`<input type="number" name="${item.value}" class="ctz-i-change" style="width: 100px;margin-right: 8px;" placeholder="例：18" /><button class="ctz-button ctz-reset-font-size" name="reset-${item.value}">↺</button>`}</div>`}</div>`
    ).join("");
    domById("CTZ_HIDDEN").innerHTML = HIDDEN_ARRAY.map(
      (item) => (item.name ? `<div class="ctz-title">${item.name}<span>${item.desc}</span></div>` : "") + commonFormBoxItem(item.content)
    ).join("");
    domById("CTZ_TITLE_ICO").innerHTML = Object.keys(ICO_URL).map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`).join("");
    domById("CTZ_DEFAULT_SELF").innerHTML = DE.map(
      ({ title, commit }) => `<div class="ctz-form-box-item ctz-form-box-item-vertical">${`<div>${title}</div><div style="font-size: 12px;color:#999;">${commit || ""}</div>`}</div>`
    ).join("");
    dom("#CTZ_BASIS_SHOW_CONTENT").innerHTML += commonFormBoxItem(BASIC_SHOW_CONTENT);
    dom("#CTZ_HIGH_PERFORMANCE").innerHTML += commonFormBoxItem(HIGH_PERFORMANCE);
    domA(".ctz-select").forEach((item) => {
      const name = item.name;
      if (OPTIONS_MAP[name]) {
        item.innerHTML = OPTIONS_MAP[name].map(({ value, label }) => `<option value="${value}">${label}</option>`).join("");
      }
    });
    initFetchInterceptStatus();
    initBlockedUsers();
    initBlockedUserTags();
    initMenu();
  };
  var appendHomeLink = (userinfo) => {
    if (dom(".ctz-home-link")) return;
    const hrefUser = userinfo.url ? userinfo.url.replace("/api/v4", "") : "";
    if (!hrefUser) return;
    dom(".ctz-to-zhihu").appendChild(
      domC("a", {
        href: hrefUser,
        target: "_blank",
        innerText: "前往个人主页",
        className: "ctz-home-link"
      })
    );
  };
  var myPreview = {
    open: function(src, even, isVideo) {
      const nameDom = isVideo ? this.evenPathVideo : this.evenPathImg;
      const idDom = isVideo ? this.idVideo : this.idImg;
      const nodeName = dom(nameDom);
      const nodeId = domById(idDom);
      nodeName && (nodeName.src = src);
      nodeId && (nodeId.style.display = "block");
      even && (this.even = even);
      myScroll.stop();
    },
    hide: function(pEvent) {
      if (this.even) {
        this.even.click();
        this.even = null;
      }
      pEvent.style.display = "none";
      const nodeImg = dom(this.evenPathImg);
      const nodeVideo = dom(this.evenPathVideo);
      nodeImg && (nodeImg.src = "");
      nodeVideo && (nodeVideo.src = "");
      myScroll.on();
    },
    even: null,
    evenPathImg: "#CTZ_PREVIEW_IMAGE img",
    evenPathVideo: "#CTZ_PREVIEW_VIDEO video",
    idImg: "CTZ_PREVIEW_IMAGE",
    idVideo: "CTZ_PREVIEW_VIDEO"
  };
  var callbackGIF = async (mutationsList) => {
    const target = mutationsList[0].target;
    const targetClassList = target.classList;
    const { showGIFinDialog } = await myStorage.getConfig();
    if (!(targetClassList.contains("isPlaying") && !targetClassList.contains("css-1isopsn") && showGIFinDialog)) return;
    const nodeVideo = target.querySelector("video");
    const nodeImg = target.querySelector("img");
    const srcImg = nodeImg ? nodeImg.src : "";
    nodeVideo ? myPreview.open(nodeVideo.src, target, true) : myPreview.open(srcImg, target);
  };
  var observerGIF = new MutationObserver(callbackGIF);
  async function previewGIF() {
    const { showGIFinDialog } = await myStorage.getConfig();
    if (showGIFinDialog) {
      const nodeGIFs = domA(".GifPlayer:not(.ctz-processed)");
      for (let i = 0, len = nodeGIFs.length; i < len; i++) {
        const item = nodeGIFs[i];
        item.classList.add("ctz-processed");
        observerGIF.observe(item, { attributes: true, attributeFilter: ["class"] });
      }
    } else {
      observerGIF.disconnect();
    }
  }
  var formatPreviewSize = (nodeImage) => {
    const { innerWidth, innerHeight } = window;
    const DIALOG_INNER_WIDTH = 240;
    const ralWidth = +`${nodeImage.getAttribute("data-rawwidth") || nodeImage.getAttribute("width")}`;
    const ralHeight = +`${nodeImage.getAttribute("data-rawheight") || nodeImage.getAttribute("height")}`;
    const originSrc = nodeImage.getAttribute("data-original") || nodeImage.src;
    const aspectRatioWindow = innerWidth / innerHeight;
    const aspectRatioImage = ralWidth / ralHeight;
    let scaleY = 1;
    let finallyWidth = ralWidth;
    let finallyHeight = ralHeight;
    if (ralHeight >= innerHeight && ralWidth < innerWidth) {
      finallyHeight = innerHeight;
      scaleY = ralHeight / innerHeight;
      finallyWidth = innerHeight * aspectRatioImage;
    }
    if (ralHeight >= innerHeight && ralWidth >= innerWidth) {
      if (aspectRatioImage > aspectRatioWindow) {
        finallyWidth = innerWidth;
        finallyHeight = finallyWidth / aspectRatioImage;
        scaleY = finallyHeight / ralHeight;
      } else {
        finallyHeight = innerHeight;
        scaleY = ralHeight / innerHeight;
        finallyWidth = innerHeight * aspectRatioImage;
      }
    }
    if (ralHeight < innerHeight && ralWidth >= innerWidth) {
      finallyWidth = innerWidth;
      finallyHeight = finallyWidth / aspectRatioImage;
      scaleY = finallyHeight / ralHeight;
    }
    if (ralHeight < innerHeight && ralWidth < innerWidth) {
      finallyWidth = ralWidth;
      finallyHeight = ralHeight;
      scaleY = 1;
    }
    const scaleX = finallyWidth / DIALOG_INNER_WIDTH;
    const top = document.documentElement.scrollTop + (innerHeight / 2 - finallyHeight / 2);
    const left = innerWidth / 2 - finallyWidth / 2;
    return {
      width: DIALOG_INNER_WIDTH,
      height: finallyHeight / scaleY,
      top,
      left,
      scaleX,
      scaleY
    };
  };
  var keydownNextImage = (event) => {
    const { key } = event;
    const nodeImgDialog = dom(".css-ypb3io");
    if ((key === "ArrowRight" || key === "ArrowLeft") && nodeImgDialog) {
      const src = nodeImgDialog.src;
      const nodeImage = domById("root").querySelector(`img[src="${src}"]`) || domById("root").querySelector(`img[data-original="${src}"]`);
      const nodeContentInner = domP(nodeImage, "class", "RichContent-inner") || domP(nodeImage, "class", "Post-RichTextContainer") || domP(nodeImage, "class", "QuestionRichText");
      if (nodeContentInner) {
        const images = Array.from(nodeContentInner.querySelectorAll("img"));
        const index = images.findIndex((i) => i.src === src || i.getAttribute("data-original") === src);
        const dialogChange = (nodeDialog, nodeImage2) => {
          const originSrc = nodeImage2.getAttribute("data-original") || nodeImage2.src;
          const { width, height, top, left, scaleX, scaleY } = formatPreviewSize(nodeImage2);
          nodeDialog.src = originSrc;
          nodeDialog.style.cssText = nodeDialog.style.cssText + `width: ${width}px;height: ${height}px;top: ${top}px;left: ${left}px;transform: translateX(0) translateY(0) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0px);will-change:unset;transform-origin: 0 0;`;
        };
        if (key === "ArrowRight" && index < images.length - 1) {
          dialogChange(nodeImgDialog, images[index + 1]);
          return;
        }
        if (key === "ArrowLeft" && index > 0) {
          dialogChange(nodeImgDialog, images[index - 1]);
          return;
        }
        if (index === images.length - 1) {
          message("已经是最后一张了");
          return;
        }
        if (index === 0) {
          message("已经是第一张了");
          return;
        }
      }
    }
  };
  var initLinkChanger = () => {
    const esName = ["a.external", "a.LinkCard"];
    const operaLink = "ctz-link-changed";
    const hrefChanger = (item) => {
      const hrefFormat = item.href.replace(/^(https|http):\/\/link\.zhihu\.com\/\?target\=/, "") || "";
      let href = "";
      try {
        href = decodeURIComponent(hrefFormat);
      } catch {
        href = hrefFormat;
      }
      item.href = href;
      item.classList.add(operaLink);
    };
    for (let i = 0, len = esName.length; i < len; i++) {
      const name = esName[i];
      const links = domA(`${name}:not(.${operaLink})`);
      for (let index = 0, linkLen = links.length; index < linkLen; index++) {
        hrefChanger(links[index]);
      }
    }
  };
  var CLASS_COPY_LINK = "ctz-copy-answer-link";
  var addAnswerCopyLink = async (nodeItem) => {
    const { copyAnswerLink } = await myStorage.getConfig();
    if (!copyAnswerLink) return;
    const prevButton = nodeItem.querySelector(`.${CLASS_COPY_LINK}`);
    prevButton && prevButton.remove();
    const nodeUser = nodeItem.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
    if (!nodeUser) return;
    const nDomButton = createButtonFontSize12("获取回答链接", CLASS_COPY_LINK);
    nDomButton.onclick = function() {
      const metaUrl = nodeItem.querySelector('.ContentItem>[itemprop="url"]');
      if (!metaUrl) return;
      const link = metaUrl.getAttribute("content") || "";
      if (link) {
        copy(link);
        message("链接复制成功");
        return;
      }
    };
    nodeUser.appendChild(nDomButton);
  };
  var loadIframePrint = (eventBtn, arrHTML, btnText) => {
    let max = 0;
    let finish = 0;
    let error = 0;
    const innerHTML = arrHTML.join("");
    const iframe = dom(".ctz-pdf-box-content");
    if (!iframe.contentWindow) return;
    const doc = iframe.contentWindow.document;
    doc.body.innerHTML = "";
    if (!doc.head.querySelector("style")) {
      doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
    }
    doc.write(`<div class="ctz-pdf-view"></div>`);
    const nodePDFView = doc.querySelector(".ctz-pdf-view");
    const domInner = domC("div", { innerHTML });
    max = domInner.querySelectorAll("img").length;
    domInner.querySelectorAll("img").forEach((imageItem) => {
      const dataOriginal = imageItem.getAttribute("data-original");
      if (!dataOriginal) {
        imageItem.setAttribute("data-original", imageItem.src);
      }
      imageItem.src = "";
    });
    nodePDFView.appendChild(domInner);
    const doPrint = () => {
      eventBtn.innerText = btnText;
      eventBtn.disabled = false;
      iframe.contentWindow.print();
    };
    const imageLoaded = () => {
      eventBtn.innerText = `资源加载进度 ${Math.floor(finish / max * 100)}%：${finish}/${max}${error > 0 ? `，${error}张图片资源已失效` : ""}`;
      if (finish + error === max) {
        doPrint();
      }
    };
    if (nodePDFView.querySelectorAll("img").length) {
      nodePDFView.querySelectorAll("img").forEach((imageItem, index) => {
        setTimeout(function() {
          imageItem.src = imageItem.getAttribute("data-original");
          imageItem.onload = function() {
            finish++;
            imageLoaded();
          };
          imageItem.onerror = function() {
            error++;
            imageLoaded();
          };
        }, Math.floor(index / 5) * 100);
      });
    } else {
      doPrint();
    }
  };
  var myCollectionExport = {
    init: async function() {
      const { fetchInterceptStatus } = await myStorage.getConfig();
      if (!fetchInterceptStatus) return;
      const { pathname } = location;
      const elementBox = domC("div", { className: `${this.className}`, innerHTML: this.element });
      const nodeThis = dom(`.${this.className}`);
      nodeThis && nodeThis.remove();
      const elementTypeSpan = this.elementTypeSpan;
      const nodeCollection = elementBox.querySelector('[name="ctz-export-collection"]');
      nodeCollection && (nodeCollection.onclick = function() {
        const me = this;
        me.innerText = "加载中...";
        me.disabled = true;
        const matched = pathname.match(/(?<=\/collection\/)\d+/);
        const id = matched ? matched[0] : "";
        if (!id) return;
        const nodeCurrent = dom(".Pagination .PaginationButton--current");
        const offset = 20 * (nodeCurrent ? Number(nodeCurrent.innerText) - 1 : 0);
        const fetchHeaders = store.getStorageConfigItem("fetchHeaders");
        fetch(`/api/v4/collections/${id}/items?offset=${offset}&limit=20`, {
          method: "GET",
          headers: new Headers(fetchHeaders)
        }).then((response) => {
          return response.json();
        }).then((res) => {
          const collectionsHTMLMap = (res.data || []).map((item) => {
            const { type, url, question, content, title } = item.content;
            switch (type) {
              case "zvideo":
                return `<div class="ctz-pdf-dialog-item"><div class="ctz-pdf-dialog-title">${elementTypeSpan(type)}${title}</div><div>视频链接：<a href="${url}" target="_blank">${url}</a></div></div>`;
              case "answer":
              case "article":
              default:
                return `<div class="ctz-pdf-dialog-item"><div class="ctz-pdf-dialog-title">${elementTypeSpan(type)}${title || question.title}</div><div>内容链接：<a href="${url}" target="_blank">${url}</a></div><div>${content}</div></div>`;
            }
          });
          loadIframePrint(me, collectionsHTMLMap, "导出此页内容");
        });
      });
      const nodePageHeaderTitle = dom(".CollectionDetailPageHeader-title");
      nodePageHeaderTitle && nodePageHeaderTitle.appendChild(elementBox);
    },
    className: "ctz-export-collection-box",
    element: `<button class="ctz-button" name="ctz-export-collection">导出此页内容</button><p>仅对此页内容进行导出</p>`,
    elementTypeSpan: (type) => {
      const typeObj = {
        answer: '<b style="color: #ec7259">「问题」</b>',
        zvideo: '<b style="color: #12c2e9">「视频」</b>',
        article: '<b style="color: #00965e">「文章」</b>'
      };
      return typeObj[type] || "";
    }
  };
  var printAnswer = (e) => {
    const prevButton = e.querySelector(".ctz-answer-print");
    if (prevButton) return;
    const nodeUser = e.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
    if (!nodeUser) return;
    const nButton = createButtonFontSize12("导出回答", "ctz-answer-print");
    nButton.onclick = function() {
      const nodeUser2 = e.querySelector(".AuthorInfo-name .UserLink-link");
      const nodeContent = e.querySelector(".RichContent-inner");
      const innerHTML = `<h1>${JSON.parse(e.querySelector(".AnswerItem").getAttribute("data-zop") || "{}").title}</h1>${nodeUser2.outerHTML + nodeContent.innerHTML}`;
      loadIframePrint(this, [innerHTML], "导出回答");
    };
    nodeUser.appendChild(nButton);
  };
  var printArticle = async (e) => {
    const { topExportContent } = await myStorage.getConfig();
    const prevButton = e.querySelector(".ctz-article-print");
    if (prevButton || !topExportContent) return;
    const nodeHeader = e.querySelector(".ArticleItem-authorInfo") || e.querySelector(".Post-Header .Post-Title");
    if (!nodeHeader) return;
    const nButton = createButtonFontSize12("导出文章", "ctz-article-print", { style: "margin: 12px 0;" });
    nButton.onclick = function() {
      const nodeTitle = e.querySelector(".ContentItem.ArticleItem .ContentItem-title>span") || e.querySelector(".Post-Header .Post-Title");
      const nodeUser = e.querySelector(".AuthorInfo-name");
      const nodeContent = e.querySelector(".RichContent-inner") || e.querySelector(".Post-RichTextContainer");
      const innerHTML = `<h1>${nodeTitle.innerHTML}</h1>${nodeUser.innerHTML + nodeContent.innerHTML}`;
      loadIframePrint(this, [innerHTML], "导出文章");
    };
    insertAfter(nButton, nodeHeader);
    setTimeout(() => {
      printArticle(e);
    }, 500);
  };
  var printPeopleAnswer = async () => {
    const { fetchInterceptStatus } = await myStorage.getConfig();
    const nodeListHeader = dom(".Profile-main .List-headerText");
    const prevButton = dom(`.ctz-people-answer-print`);
    if (!nodeListHeader || prevButton || !fetchInterceptStatus) return;
    const nButton = createButtonFontSize12("导出此页回答", "ctz-people-answer-print");
    nButton.onclick = async function() {
      const eventBtn = this;
      eventBtn.innerText = "加载回答内容中...";
      eventBtn.disabled = true;
      const data = store.getUserAnswer();
      const content = data.map((item) => `<h1>${item.question.title}</h1><div>${item.content}</div>`);
      loadIframePrint(eventBtn, content, "导出此页回答");
    };
    nodeListHeader.appendChild(nButton);
    setTimeout(() => {
      printPeopleAnswer();
    }, 500);
  };
  var printPeopleArticles = async () => {
    const { fetchInterceptStatus } = await myStorage.getConfig();
    const nodeListHeader = dom(".Profile-main .List-headerText");
    const prevButton = dom(".ctz-people-export-articles-once");
    if (!nodeListHeader || prevButton || !fetchInterceptStatus) return;
    const nButton = createButtonFontSize12("导出此页文章", "ctz-people-export-articles-once");
    nButton.onclick = async function() {
      const eventBtn = this;
      eventBtn.innerText = "加载文章内容中...";
      eventBtn.disabled = true;
      const data = store.getUserArticle();
      const content = data.map((item) => `<h1>${item.title}</h1><div>${item.content}</div>`);
      loadIframePrint(eventBtn, content, "导出此页文章");
    };
    nodeListHeader.appendChild(nButton);
    setTimeout(() => {
      printPeopleArticles();
    }, 500);
  };
  var formatTime = (t, f = "YYYY-MM-DD HH:mm:ss") => {
    if (!t) return "";
    const d = new Date(t);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();
    const preArr = (num) => String(num).length !== 2 ? "0" + String(num) : String(num);
    return f.replace(/YYYY/g, String(year)).replace(/MM/g, preArr(month)).replace(/DD/g, preArr(day)).replace(/HH/g, preArr(hour)).replace(/mm/g, preArr(min)).replace(/ss/g, preArr(sec));
  };
  var updateItemTime = (e) => {
    const nodeCreated = e.querySelector('[itemprop="dateCreated"]');
    const nodePublished = e.querySelector('[itemprop="datePublished"]');
    const nodeModified = e.querySelector('[itemprop="dateModified"]');
    const crTime = nodeCreated ? nodeCreated.content : "";
    const puTime = nodePublished ? nodePublished.content : "";
    const muTime = nodeModified ? nodeModified.content : "";
    const timeCreated = formatTime(crTime || puTime);
    const timeModified = formatTime(muTime);
    const nodeBox = e.querySelector(".ContentItem-meta");
    if (!timeCreated || !nodeBox) return;
    const innerHTML = `<div>创建时间：${timeCreated}</div><div>最后修改时间：${timeModified}</div>`;
    const domTime = e.querySelector(`.${CLASS_TIME_ITEM}`);
    if (domTime) {
      domTime.innerHTML = innerHTML;
    } else {
      nodeBox.appendChild(
        domC("div", {
          className: CLASS_TIME_ITEM,
          innerHTML,
          style: "line-height: 24px;padding-top: 2px;font-size: 14px;"
        })
      );
    }
  };
  var questionTimeout;
  var questionFindIndex = 0;
  var resetQuestionTime = () => {
    if (questionFindIndex > 5 || !dom(".ctz-question-time")) {
      return;
    }
    questionFindIndex++;
    clearTimeout(questionTimeout);
    questionTimeout = setTimeout(addQuestionTime, 500);
  };
  var addQuestionTime = async () => {
    const nodeTime = dom(".ctz-question-time");
    nodeTime && nodeTime.remove();
    const { questionCreatedAndModifiedTime } = await myStorage.getConfig();
    const nodeCreated = dom('[itemprop="dateCreated"]');
    const nodeModified = dom('[itemprop="dateModified"]');
    const nodeBox = dom(".QuestionPage .QuestionHeader-title");
    if (!questionCreatedAndModifiedTime || !nodeCreated || !nodeModified || !nodeBox) {
      resetQuestionTime();
      return;
    }
    nodeBox && nodeBox.appendChild(
      domC("div", {
        className: "ctz-question-time",
        innerHTML: `<div>创建时间：${formatTime(nodeCreated.content)}</div><div>最后修改时间：${formatTime(nodeModified.content)}</div>`
      })
    );
    resetQuestionTime();
  };
  var C_ARTICLE_TIME = "ctz-article-time";
  var addArticleTime = async () => {
    const { articleCreateTimeToTop } = await myStorage.getConfig();
    const nodeT = dom(`.${C_ARTICLE_TIME}`);
    if (nodeT) return;
    const nodeContentTime = dom(".ContentItem-time");
    const nodeBox = dom(".Post-Header");
    if (!articleCreateTimeToTop || !nodeContentTime || !nodeBox) return;
    nodeBox.appendChild(
      domC("span", {
        className: C_ARTICLE_TIME,
        style: "color: #8590a6;line-height: 30px;",
        innerHTML: nodeContentTime.innerText || ""
      })
    );
    setTimeout(() => {
      addArticleTime();
    }, 500);
  };
  var updateTopVote = async (nodeItem) => {
    if (!nodeItem) return;
    const nodeItemMeta = nodeItem.querySelector(".ContentItem-meta");
    const nodeVote = nodeItem.querySelector('[itemprop="upvoteCount"]');
    const { topVote } = await myStorage.getConfig();
    if (!nodeVote || !topVote || !nodeItemMeta) return;
    const vote = nodeVote.content;
    if (+vote === 0) return;
    const className = "ctz-top-vote";
    const domVotePrev = nodeItemMeta.querySelector(`.${className}`);
    const innerHTML = `${vote} 人赞同了该回答`;
    if (domVotePrev) {
      domVotePrev.innerHTML = innerHTML;
    } else {
      const domVote = domC("div", {
        className,
        innerHTML,
        style: "font-size: 14px;padding-top: 2px;color: rgb(132, 145, 165);margin: 8px 0;"
      });
      nodeItemMeta.appendChild(domVote);
      const metaObserver = new MutationObserver(() => {
        updateTopVote(nodeItem);
      });
      metaObserver.observe(nodeVote, {
        attributes: true,
        childList: false,
        characterData: false,
        characterDataOldValue: false,
        subtree: false
      });
    }
  };
  var fnReplaceZhidaToSearch = async (domFind = document.body) => {
    const { replaceZhidaToSearch = "default" /* 不替换 */ } = await myStorage.getConfig();
    if (replaceZhidaToSearch === "default" /* 不替换 */) return;
    const domsZhida = domFind.querySelectorAll(".RichContent-EntityWord");
    for (let i = 0, len = domsZhida.length; i < len; i++) {
      const domItem = domsZhida[i];
      if (domItem.classList.contains(CLASS_LISTENED)) continue;
      domItem.classList.add(CLASS_LISTENED);
      const domSvg = domItem.querySelector("svg");
      if (domSvg) {
        domSvg.style.display = "none";
      }
      if (replaceZhidaToSearch === "removeLink" /* 去除知乎直达跳转 */) {
        domItem.onclick = function(e) {
          e.preventDefault();
        };
        domItem.style.cssText = `color: inherit!important; cursor: text!important;background: transparent!important;`;
        continue;
      }
      const prevTextContent = domItem.textContent || "";
      domItem.innerHTML = prevTextContent + '<span style="transform: rotate(-45deg);display: inline-block;">⚲</span>';
      domItem.href = SEARCH_PATH[replaceZhidaToSearch] + encodeURIComponent(prevTextContent);
    }
  };
  var SEARCH_PATH = {
    ["zhihu" /* 知乎 */]: "https://www.zhihu.com/search?type=content&q=",
    ["baidu" /* 百度 */]: "https://www.baidu.com/s?wd=",
    ["google" /* 谷歌 */]: "https://www.google.com.hk/search?q=",
    ["bing" /* 必应 */]: "https://www.bing.com/search?q="
  };
  var classTarget = ["RichContent-cover", "RichContent-inner", "ContentItem-more", "ContentItem-arrowIcon", "ContentItem-expandButton", "is-collapsed"];
  var verifyClickReadMore = (e) => {
    let isFind = false;
    classTarget.forEach((item) => {
      (e.classList.contains(item) || e.parentElement.classList.contains(item)) && (isFind = true);
    });
    return isFind;
  };
  var initRootEvent = async () => {
    const domRoot = dom("#root");
    if (!domRoot) return;
    const classForVideoOne = CLASS_VIDEO_ONE.replace(".", "");
    domRoot.addEventListener("click", async function(event) {
      const config = await myStorage.getConfig();
      const { videoUseLink, fetchInterceptStatus } = config;
      const target = event.target;
      if (videoUseLink) {
        if (target.classList.contains(classForVideoOne)) {
          const domVideo = target.querySelector("video");
          const videoSrc = domVideo ? domVideo.src : "";
          if (!videoSrc) return;
          window.open(videoSrc, "_blank");
        }
      }
      if (target.classList.contains(CLASS_TO_QUESTION)) {
        const { path } = target._params;
        path && window.open(path);
      }
      if (target.classList.contains(CLASS_NOT_INTERESTED) && fetchInterceptStatus) {
        const { id, type } = target._params;
        doFetchNotInterested({ id, type });
        const nodeTopStoryItem = domP(target, "class", "TopstoryItem");
        nodeTopStoryItem && (nodeTopStoryItem.style.display = "none");
      }
      if (verifyClickReadMore(target)) {
        const nodeItem = domP(target, "class", "ContentItem");
        const isRecommend = !!(dom(".Topstory-recommend") || dom(".Topstory-follow") || dom(".zhuanlan .css-1voxft1"));
        const isQuestion = !!dom(".Question-main");
        if (isRecommend || isQuestion) {
          doContentItem(config, isRecommend, nodeItem, true);
        }
      }
    });
  };
  var doContentItem = async (config, isRecommend, nodeItem, needTimeout = false) => {
    if (!nodeItem) return;
    const { topExportContent, fetchInterceptStatus, listItemCreatedAndModifiedTime, videoUseLink, answerItemCreatedAndModifiedTime } = config;
    const doFun = (nodeItem2, parentItem2) => {
      updateTopVote(nodeItem2);
      if (isRecommend) {
        listItemCreatedAndModifiedTime && updateItemTime(nodeItem2);
      } else if (answerItemCreatedAndModifiedTime) {
        updateItemTime(nodeItem2);
      }
      initVideoDownload(nodeItem2);
      addAnswerCopyLink(nodeItem2);
      fnReplaceZhidaToSearch(nodeItem2);
      if (fetchInterceptStatus) {
        answerAddBlockButton(parentItem2);
        if (topExportContent) {
          printAnswer(parentItem2);
          printArticle(parentItem2);
        }
      }
    };
    const parentItem = isRecommend ? nodeItem.parentElement : nodeItem;
    if (needTimeout) {
      setTimeout(() => {
        doFun(nodeItem, parentItem);
      }, 500);
    } else {
      doFun(nodeItem, parentItem);
    }
  };
  var myListenAnswerItem = {
    initTimestamp: 0,
    init: async function() {
      const currentTime = +/* @__PURE__ */ new Date();
      if (currentTime - this.initTimestamp < 500) {
        setTimeout(() => this.init(), 500);
        return;
      }
      const nodes = domA(`.AnswersNavWrapper .List-item:not(.${CLASS_LISTENED})`);
      const removeAnswers = store.getRemoveAnswers();
      const config = await myStorage.getConfig();
      const {
        removeFromYanxuan,
        removeUnrealAnswer,
        removeFromEBook,
        removeAnonymousAnswer,
        removeLessVoteDetail,
        lessVoteNumberDetail = 0,
        answerOpen = "default" /* 默认 */,
        removeBlockUserContent,
        blockedUsers,
        blockWordsAnswer = [],
        highPerformanceAnswer
      } = config;
      doContentItem(config, false, dom(".QuestionAnswer-content"));
      for (let i = 0, len = nodes.length; i < len; i++) {
        let message2 = "";
        const nodeItem = nodes[i];
        nodeItem.classList.add(CLASS_LISTENED);
        nodeItem.dataset.code = `${+/* @__PURE__ */ new Date()}-${i}`;
        if (nodeItem.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;
        const nodeItemContent = nodeItem.querySelector(".ContentItem");
        if (!nodeItemContent) continue;
        let dataZop = {};
        let dataCardContent = {};
        try {
          dataZop = JSON.parse(nodeItemContent.getAttribute("data-zop") || "{}");
          dataCardContent = JSON.parse(nodeItemContent.getAttribute("data-za-extra-module") || "{}").card.content;
        } catch {
        }
        (dataCardContent["upvote_num"] || 0) < lessVoteNumberDetail && removeLessVoteDetail && (message2 = `过滤低赞回答: ${dataCardContent["upvote_num"]}赞`);
        if (!message2 && removeFromYanxuan) {
          const itemId = String(dataZop.itemId || "");
          const findItem = removeAnswers.find((i2) => i2.id === itemId);
          findItem && (message2 = findItem.message);
        }
        if (!message2) {
          const nodeTag1 = nodeItem.querySelector(".KfeCollection-AnswerTopCard-Container");
          const nodeTag2 = nodeItem.querySelector(".LabelContainer-wrapper");
          const tagNames = (nodeTag1 ? nodeTag1.innerText : "") + (nodeTag2 ? nodeTag2.innerText : "");
          if (removeUnrealAnswer) {
            tagNames.includes("虚构创作") && (message2 = "已删除一条虚构创作的回答");
          }
          if (removeFromEBook) {
            tagNames.includes("电子书") && (message2 = "已删除一条来自电子书的回答");
          }
        }
        if (!message2 && removeBlockUserContent && blockedUsers && blockedUsers.length) {
          const findBlocked = blockedUsers.find((i2) => i2.urlToken === dataCardContent.author_member_hash_id);
          findBlocked && (message2 = `已删除黑名单用户${findBlocked.name}的回答`);
        }
        if (!message2 && removeAnonymousAnswer) {
          const userName = nodeItem.querySelector('[itemprop="name"]').content;
          userName === "匿名用户" && (message2 = `已屏蔽一条「匿名用户」回答`);
        }
        if (!message2) {
          const domRichContent = nodeItem.querySelector(".RichContent");
          const innerText = domRichContent ? domRichContent.innerText : "";
          if (innerText) {
            let matchedWord = "";
            for (let itemWord of blockWordsAnswer) {
              const rep = new RegExp(itemWord.toLowerCase());
              if (rep.test(innerText.toLowerCase())) {
                matchedWord += `「${itemWord}」`;
                break;
              }
            }
            if (matchedWord) {
              message2 = `匹配到屏蔽词${matchedWord}，已屏蔽该回答内容`;
            }
          }
        }
        if (message2) {
          fnHidden(nodeItem, message2);
        } else {
          doContentItem(config, false, nodeItem);
          fnJustNum(nodeItem);
          if (answerOpen !== "default" /* 默认 */) {
            const buttonUnfold = nodeItem.querySelector(".ContentItem-expandButton");
            const buttonFold = nodeItem.querySelector(".RichContent-collapsedText");
            if (answerOpen === "on" /* 自动展开所有回答 */ && !nodeItem.classList.contains(OB_CLASS_FOLD.on)) {
              buttonUnfold && buttonUnfold.click();
              nodeItem.classList.add(OB_CLASS_FOLD.on);
            }
            const isF = buttonFold && nodeItem.offsetHeight > 939;
            const isFC = buttonUnfold;
            if (answerOpen === "off" /* 默认收起长回答 */ && !nodeItem.classList.contains(OB_CLASS_FOLD.off) && (isF || isFC)) {
              nodeItem.classList.add(OB_CLASS_FOLD.off);
              isF && buttonFold && buttonFold.click();
            }
          }
        }
      }
      if (highPerformanceAnswer) {
        setTimeout(() => {
          const nodes2 = domA(".AnswersNavWrapper .List-item");
          if (nodes2.length > 30) {
            const nIndex = nodes2.length - 30;
            nodes2.forEach((item, index) => {
              if (index < nIndex) {
                item.remove();
              }
            });
            fnLog(`已开启高性能模式，删除${nIndex}条回答`);
          }
        }, 500);
      }
    },
    reset: function() {
      domA(`.AnswersNavWrapper .List-item.${CLASS_LISTENED}`).forEach((item) => {
        item.classList.remove(CLASS_LISTENED);
      });
    },
    restart: function() {
      this.reset();
      this.init();
    }
  };
  var formatCommentAuthors = (data) => {
    const { setCommentAuthors, getCommentAuthors } = store;
    const commentAuthors = [...getCommentAuthors()];
    const fnAuthor = (data2) => {
      if (!data2) return;
      data2.forEach((item) => {
        const author = item.author;
        const replyToAuthor = item.reply_to_author;
        if (author && !commentAuthors.some((i) => i.id === author.id)) {
          commentAuthors.push({
            id: author.id,
            name: author.name,
            urlToken: author.url_token
          });
        }
        if (replyToAuthor && !commentAuthors.some((i) => i.id === replyToAuthor.id)) {
          commentAuthors.push({
            id: replyToAuthor.id,
            name: replyToAuthor.name,
            urlToken: replyToAuthor.url_token
          });
        }
        if (item.child_comments) {
          fnAuthor(item.child_comments);
        }
      });
    };
    fnAuthor(data);
    setCommentAuthors(commentAuthors);
    doListenComment();
  };
  var commentMarkListen = (event) => {
    closeCommentDialog();
  };
  var doListenComment = async () => {
    const { cancelCommentAutoFocus, clickMarkCloseCommentDialog } = await myStorage.getConfig();
    if (cancelCommentAutoFocus) {
      domA(".notranslate").forEach((item) => {
        item.blur();
        const parentBox = domP(item, "class", "QuestionAnswer-content") || domP(item, "class", "List-item") || domP(item, "class", "TopstoryItem");
        parentBox && parentBox.focus();
      });
    }
    const { setCommentAuthors } = store;
    const nodeCommentInPages = domA(`.css-18ld3w0`);
    const nodeCommentDialogs = domA(`.css-16zdamy`);
    if (!nodeCommentInPages.length && !nodeCommentDialogs.length) {
      setCommentAuthors([]);
      return;
    }
    nodeCommentInPages.forEach((item) => formatComments(item));
    nodeCommentInPages.forEach((item) => formatComments(item, ".css-13445jb"));
    nodeCommentDialogs.forEach((item) => formatComments(item));
    nodeCommentDialogs.forEach((item) => formatComments(item, ".css-13445jb"));
    if (clickMarkCloseCommentDialog) {
      const nodeCommentMark = dom(".css-5ym188");
      if (nodeCommentMark) {
        nodeCommentMark.removeEventListener("click", commentMarkListen);
        nodeCommentMark.addEventListener("click", commentMarkListen);
      }
    }
  };
  var CLASS_BLOCK_ADD = "ctz-comment-block-add";
  var CLASS_BLOCK_REMOVE = "ctz-comment-block-remove";
  var CLASS_BLOCK_BOX = "ctz-comment-block-box";
  var ATTR_ID = "data-id";
  var buttonListener = () => setTimeout(doListenComment, 500);
  var formatComments = async (nodeComments, commentBoxClass = ".css-jp43l4") => {
    if (!nodeComments) return;
    if (nodeComments.querySelector(".css-1t6pvna") || nodeComments.querySelector(".BounceLoading")) {
      setTimeout(() => {
        formatComments(nodeComments, commentBoxClass);
      }, 500);
      return;
    }
    const commentAuthors = store.getCommentAuthors();
    const { removeBlockUserComment, blockedUsers } = await myStorage.getConfig();
    const comments = nodeComments.children;
    for (let i = 0, len = comments.length; i < len; i++) {
      const item = comments[i];
      if (item.nodeName === "BUTTON") {
        item.removeEventListener("click", buttonListener);
        item.addEventListener("click", buttonListener);
        continue;
      }
      if (!item.getAttribute(ATTR_ID) || item.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;
      const itemUserBox = item.querySelector(`${commentBoxClass} .css-14nvvry .css-swj9d4`);
      if (!itemUserBox) continue;
      const itemCommentUsers = itemUserBox.querySelectorAll(".css-1tww9qq");
      let isHidden = false;
      itemCommentUsers.forEach(async (userOne) => {
        if (isHidden) return;
        const userLink = userOne.querySelector(".css-1gomreu a");
        if (!userLink) return;
        const userId = userLink.href.replace(/[\w\W]+\/people\//, "");
        const findUser = (blockedUsers || []).find((i2) => i2.id === userId);
        const isBlocked = !!findUser;
        if (removeBlockUserComment && isBlocked) {
          isHidden = true;
          fnLog(`已隐藏一个黑名单用户的评论，${findUser.name}`);
          return;
        }
        if (userOne.querySelector(`.${CLASS_BLOCK_BOX}`)) return;
        const commentUserInfo = commentAuthors.find((i2) => i2.id === userId);
        if (!commentUserInfo) return;
        const nBox = domC("div", {
          className: CLASS_BLOCK_BOX,
          innerHTML: await changeBoxHTML2(isBlocked)
        });
        nBox.onclick = async function(event) {
          const me = this;
          const target = event.target;
          if (target.classList.contains(CLASS_BLOCK_REMOVE)) {
            await removeBlockUser(commentUserInfo);
            me.innerHTML = await changeBoxHTML2(false);
            return;
          }
          if (target.classList.contains(CLASS_BLOCK_ADD)) {
            await addBlockUser(commentUserInfo);
            me.innerHTML = await changeBoxHTML2(true);
            return;
          }
        };
        userOne.append(nBox);
      });
      if (isHidden) {
        item.style.display = "none";
        item.classList.add(CTZ_HIDDEN_ITEM_CLASS);
        continue;
      }
      item.querySelectorAll(".comment_img img").forEach((itemImage) => {
        itemImage.onclick = () => {
          setTimeout(commentImagePreview, 100);
        };
      });
      formatComments(item, ".css-1kwt8l8");
    }
  };
  var changeBoxHTML2 = async (isBlocked) => {
    const { showBlockUserComment, showBlockUserCommentTag } = await myStorage.getConfig();
    if (isBlocked) {
      return fnReturnStr(`<div class="${CLASS_BLACK_TAG}">黑名单</div>`, showBlockUserCommentTag) + fnReturnStr(`<button class="${CLASS_BLOCK_REMOVE} ctz-button">解除屏蔽</button>`, showBlockUserComment);
    } else {
      return fnReturnStr(`<button class="${CLASS_BLOCK_ADD} ctz-button">屏蔽</button>`, showBlockUserComment);
    }
  };
  var commentPreviewObserver = void 0;
  var commentImagePreview = async () => {
    const { commentImageFullPage } = await myStorage.getConfig();
    if (commentImageFullPage) {
      const commentPreviewImage = dom(".ImageView-img");
      if (!commentPreviewImage) return;
      const imageSrc = commentPreviewImage.src.replace("_r", "");
      const commentImage = dom(`.comment_img img[data-original="${imageSrc}"]`);
      if (!commentImage) return;
      const { width, height, scaleX, scaleY } = formatPreviewSize(commentImage);
      const { innerWidth, innerHeight } = window;
      commentPreviewImage.style.cssText = `width: ${width}px;height: ${height}px;transform: translateX(${innerWidth / 2 - width * scaleX / 2}px) translateY(${innerHeight / 2 - height * scaleY / 2}px) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0px);will-change:unset;transform-origin: 0 0;transition: none;`;
      const nodeImageBox = domP(commentPreviewImage, "class", "ImageView");
      commentPreviewObserver && commentPreviewObserver.disconnect();
      commentPreviewObserver = new MutationObserver((records) => {
        if (!nodeImageBox.classList.contains("is-active")) {
          commentPreviewImage.style.transition = "";
        }
      });
      commentPreviewObserver.observe(nodeImageBox, { characterData: true, attributes: true });
    }
  };
  var closeCommentDialog = () => {
    const button = dom(`.${CLASS_ZHIHU_COMMENT_DIALOG} button[aria-label="关闭"]`);
    button && button.click();
  };
  var myListenListItem = {
    initTimestamp: 0,
    init: async function() {
      const nodeLoading = dom(".Topstory-recommend .List-item.List-item");
      const currentTime = +/* @__PURE__ */ new Date();
      if (nodeLoading || currentTime - this.initTimestamp < 500) {
        setTimeout(() => this.init(), 500);
        return;
      }
      this.initTimestamp = currentTime;
      await this.traversal(domA(`.TopstoryItem:not(.${CLASS_LISTENED})`));
      setTimeout(async () => {
        await this.traversal(domA(`.TopstoryItem:not(.${CLASS_LISTENED})`));
      }, 500);
      await recommendHighPerformance();
    },
    traversal: async function(nodes) {
      if (!nodes.length) return;
      const userinfo = store.getUserinfo();
      const removeRecommends = store.getRemoveRecommends();
      const pfConfig = await myStorage.getConfig();
      const {
        filterKeywords = [],
        blockWordsAnswer = [],
        removeItemAboutVideo,
        removeItemAboutPin,
        removeItemAboutArticle,
        removeLessVote,
        lessVoteNumber = 0,
        removeItemQuestionAsk,
        removeFollowVoteAnswer,
        removeFollowVoteArticle,
        removeFollowFQuestion,
        listOutPutNotInterested,
        highlightOriginal,
        backgroundHighlightOriginal,
        themeDark = 1 /* 深色一 */,
        themeLight = 0 /* 默认 */,
        removeMyOperateAtFollow,
        listOutputToQuestion,
        fetchInterceptStatus,
        removeBlockUserContent,
        blockedUsers = []
      } = pfConfig;
      const pfHistory = await myStorage.getHistory();
      const historyList = pfHistory.list;
      const highlight = await doHighlightOriginal(backgroundHighlightOriginal, themeDark, themeLight);
      for (let i = 0, len = nodes.length; i < len; i++) {
        const nodeItem = nodes[i];
        if (nodeItem.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;
        nodeItem.classList.add(CLASS_LISTENED);
        nodeItem.dataset.code = `${+/* @__PURE__ */ new Date()}-${i}`;
        const nodeContentItem = nodeItem.querySelector(".ContentItem");
        if (!nodeItem.scrollHeight || !nodeContentItem) continue;
        let message2 = "";
        let dataZop = {};
        let cardContent = {};
        const isVideo = nodeContentItem.classList.contains("ZVideoItem");
        const isArticle = nodeContentItem.classList.contains("ArticleItem");
        const isTip = nodeContentItem.classList.contains("PinItem");
        try {
          dataZop = JSON.parse(nodeContentItem.getAttribute("data-zop") || "{}");
          cardContent = JSON.parse(nodeContentItem.getAttribute("data-za-extra-module") || "{}").card.content;
        } catch {
        }
        const { title = "", itemId } = dataZop || {};
        if (removeMyOperateAtFollow && nodeItem.classList.contains("TopstoryItem-isFollow")) {
          try {
            const findUserId = nodeItem.querySelector(".UserLink .UserLink-link").href.match(/[^\/]+$/)[0];
            const myUserId = userinfo.url.match(/[^\/]+$/)[0];
            findUserId === myUserId && (message2 = "关注列表屏蔽自己的操作");
          } catch {
          }
        }
        if (!message2) {
          const removeItem = removeRecommends.find((i2) => i2.id === String(itemId));
          removeItem && (message2 = `推荐列表已屏蔽${removeItem.message}: ${title}`);
        }
        if (!message2 && removeBlockUserContent && blockedUsers && blockedUsers.length) {
          const findBlocked = blockedUsers.find((i2) => i2.urlToken === cardContent.author_member_hash_id);
          findBlocked && (message2 = `已删除黑名单用户${findBlocked.name}发布的内容：${title}`);
        }
        if (!message2 && (isVideo && removeItemAboutVideo || isArticle && removeItemAboutArticle || isTip && removeItemAboutPin)) {
          message2 = `列表种类屏蔽，${nodeContentItem.classList.value}`;
        }
        if (!message2 && removeLessVote && (cardContent["upvote_num"] || 0) < lessVoteNumber) {
          message2 = `屏蔽低赞内容: ${title}, ${cardContent["upvote_num"] || 0}`;
        }
        if (!message2 && removeItemQuestionAsk && nodeItem.querySelector(".TopstoryQuestionAskItem")) {
          message2 = "屏蔽邀请回答";
        }
        if (!message2 && (removeFollowVoteAnswer || removeFollowVoteArticle || removeFollowFQuestion) && nodeItem.classList.contains("TopstoryItem-isFollow")) {
          const nodeFirstLine = nodeItem.querySelector(".FeedSource-firstline");
          const textFollowerOperate = nodeFirstLine ? nodeFirstLine.innerText : "";
          for (let itemOperate of FILTER_FOLLOWER_OPERATE) {
            const thisRep = new RegExp(itemOperate.rep);
            if (pfConfig[itemOperate.key] && thisRep.test(textFollowerOperate)) {
              message2 = `屏蔽关注人操作: ${textFollowerOperate}`;
              break;
            }
          }
        }
        !message2 && (message2 = this.replaceBlockWord(title, nodeContentItem, filterKeywords, title, "标题"));
        if (!message2) {
          const domRichContent = nodeItem.querySelector(".RichContent");
          const innerText = domRichContent ? domRichContent.innerText : "";
          message2 = this.replaceBlockWord(innerText, nodeContentItem, blockWordsAnswer, title, "内容");
        }
        if (message2) {
          fnHidden(nodeItem, message2);
          const { itemId: itemId2, type } = dataZop;
          doFetchNotInterested({ id: `${itemId2 || ""}`, type: `${type}` });
        } else {
          const userNameE = nodeItem.querySelector(".FeedSource-firstline .UserLink-link");
          const userName = userNameE ? userNameE.innerText : "";
          if (dataZop && dataZop.authorName === userName) {
            const nodeActions = nodeItem.querySelector(".ContentItem-actions");
            nodeItem.style.cssText = highlightOriginal ? `${highlight}border: 1px solid #aaa;` : "";
            nodeActions && (nodeActions.style.cssText = highlightOriginal ? highlight : "");
          }
          const nodeItemTitle = nodeItem.querySelector(".ContentItem-title");
          if (nodeItemTitle) {
            if (listOutPutNotInterested && fetchInterceptStatus && !nodeItem.querySelector(`.${CLASS_NOT_INTERESTED}`)) {
              nodeItemTitle.appendChild(createButtonFontSize12("不感兴趣", CLASS_NOT_INTERESTED, { _params: { id: dataZop.itemId, type: dataZop.type } }));
            }
            if (listOutputToQuestion && !isVideo && !isArticle && !isTip && !nodeItem.querySelector(`.${CLASS_TO_QUESTION}`)) {
              const domUrl = nodeContentItem.querySelector('[itemprop="url"]');
              const pathAnswer = domUrl ? domUrl.getAttribute("content") || "" : "";
              nodeItemTitle.appendChild(createButtonFontSize12("直达问题", CLASS_TO_QUESTION, { _params: { path: pathAnswer.replace(/\/answer[\W\w]+/, "") } }));
            }
          }
        }
        if (domP(nodeItem, "class", "Topstory-recommend") && nodeItem.querySelector(".ContentItem-title a")) {
          const nodeA = nodeItem.querySelector(".ContentItem-title a");
          if (nodeA) {
            const typeObj = isVideo ? RECOMMEND_TYPE.zvideo : isArticle ? RECOMMEND_TYPE.article : isTip ? RECOMMEND_TYPE.pin : RECOMMEND_TYPE.answer;
            const historyItem = `<a href="${nodeA.href}" target="_blank"><b style="${typeObj.style}">「${typeObj.name}」</b>${nodeA.innerText}</a>`;
            !historyList.includes(historyItem) && historyList.unshift(historyItem);
          }
        }
        fnJustNum(nodeItem);
        if (i === len - 1) {
          myStorage.updateHistoryItem("list", historyList);
        }
      }
    },
    reset: function() {
      domA(`.TopstoryItem.${CLASS_LISTENED}`).forEach((item) => {
        item.classList.remove(CLASS_LISTENED);
      });
    },
    restart: function() {
      this.reset();
      this.init();
    },
    replaceBlockWord: function(innerText, nodeItemContent, blockWords, title, byWhat) {
      if (innerText) {
        let matchedWord = "";
        for (let word of blockWords) {
          const rep = new RegExp(word.toLowerCase());
          if (rep.test(innerText.toLowerCase())) {
            matchedWord += `「${word}」`;
            break;
          }
        }
        if (matchedWord) {
          const elementItemProp = nodeItemContent.querySelector('[itemprop="url"]');
          const routeURL = elementItemProp && elementItemProp.getAttribute("content");
          return `${byWhat}屏蔽词匹配，匹配内容：${matchedWord}，《${title}》，链接：${routeURL}`;
        }
      }
      return "";
    }
  };
  var RECOMMEND_TYPE = {
    answer: {
      name: "问题",
      style: "color: #ec7259"
    },
    article: {
      name: "文章",
      style: "color: #00965e"
    },
    zvideo: {
      name: "视频",
      style: "color: #12c2e9"
    },
    pin: {
      name: "想法",
      style: "color: #9c27b0"
    }
  };
  var recommendHighPerformance = async () => {
    const { highPerformanceRecommend } = await myStorage.getConfig();
    if (!highPerformanceRecommend) return;
    setTimeout(() => {
      const nodes = domA(`.${CLASS_LISTENED}`);
      if (nodes.length > 50) {
        const nodeLast = nodes[nodes.length - 1];
        const yLastPrev = nodeLast.offsetTop;
        const yDocument = document.documentElement.scrollTop;
        const code = nodeLast.dataset.code;
        const nIndex = nodes.length - 50;
        nodes.forEach((item, index) => {
          index < nIndex && item.remove();
        });
        const nNodeLast = dom(`[data-code="${code}"]`);
        if (nNodeLast) {
          const nYLast = nNodeLast.offsetTop;
          window.scrollTo({ top: yDocument - (yLastPrev - nYLast) });
        }
        fnLog(`已开启高性能模式，删除${nIndex}条推荐内容`);
      }
    }, 100);
  };
  var myListenSearchListItem = {
    initTimestamp: 0,
    init: async function() {
      const currentTime = +/* @__PURE__ */ new Date();
      if (currentTime - this.initTimestamp < 500) {
        setTimeout(() => this.init(), 500);
        return;
      }
      const nodes = domA(`.SearchResult-Card[role="listitem"]:not(.${CLASS_LISTENED})`);
      if (this.index + 1 === nodes.length) return;
      const { removeItemAboutVideo, removeItemAboutArticle, removeItemAboutAD, removeLessVote, lessVoteNumber = 0 } = await myStorage.getConfig();
      for (let i = 0, len = nodes.length; i < len; i++) {
        let message2 = "";
        const nodeItem = nodes[i];
        nodeItem.classList.add(CLASS_LISTENED);
        if (!nodeItem || nodeItem.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;
        const haveAD = removeItemAboutAD && nodeItem.querySelector(".KfeCollection-PcCollegeCard-root");
        const haveArticle = removeItemAboutArticle && nodeItem.querySelector(".ArticleItem");
        const haveVideo = removeItemAboutVideo && nodeItem.querySelector(".ZvideoItem");
        (haveAD || haveArticle || haveVideo) && (message2 = "列表种类屏蔽");
        if (removeLessVote && !message2) {
          const elementUpvote = nodeItem.querySelector(".ContentItem-actions .VoteButton--up");
          if (elementUpvote) {
            const ariaLabel = elementUpvote.getAttribute("aria-label");
            if (ariaLabel) {
              const upvoteText = ariaLabel.trim().replace(/\W+/, "");
              const upvote = upvoteText.includes("万") ? +upvoteText.replace("万", "").trim() * 1e4 : +upvoteText;
              if (upvote > -1 && upvote < lessVoteNumber) {
                message2 = `屏蔽低赞内容: ${upvote || 0}赞`;
              }
            }
          }
        }
        fnJustNum(nodeItem);
        message2 && fnHidden(nodeItem, message2);
      }
    },
    reset: function() {
      domA(`.SearchResult-Card[role="listitem"].${CLASS_LISTENED}`).forEach((item) => {
        item.classList.remove(CLASS_LISTENED);
      });
    },
    restart: function() {
      this.reset();
      this.init();
    }
  };
  var initImagePreview = async () => {
    const { zoomImageType } = await myStorage.getConfig();
    const images = [domA(".TitleImage:not(.ctz-processed)"), domA(".ArticleItem-image:not(.ctz-processed)"), domA(".ztext figure .content_image:not(.ctz-processed)")];
    for (let i = 0, imageLen = images.length; i < imageLen; i++) {
      const ev = images[i];
      for (let index = 0, len = ev.length; index < len; index++) {
        const nodeItem = ev[index];
        nodeItem.classList.add("ctz-processed");
        const src = nodeItem.src || nodeItem.style.backgroundImage && nodeItem.style.backgroundImage.split('("')[1].split('")')[0];
        nodeItem.onclick = () => myPreview.open(src);
      }
    }
    if (zoomImageType === "2" /* 自定义尺寸 */) {
      const originImages = domA(".origin_image:not(.ctz-processed)");
      for (let i = 0, len = originImages.length; i < len; i++) {
        const nodeItem = originImages[i];
        nodeItem.src = nodeItem.getAttribute("data-original") || nodeItem.src;
        nodeItem.classList.add("ctz-processed");
        nodeItem.style.cssText = "max-width: 100%;";
      }
    }
  };
  var initResizeObserver = () => {
    const resizeObserver = new ResizeObserver(throttle(resizeFun));
    resizeObserver.observe(document.body);
  };
  async function resizeFun() {
    if (!HTML_HOOTS.includes(location.hostname)) return;
    const { hiddenSearchBoxTopSearch, contentRemoveKeywordSearch, globalTitle } = await myStorage.getConfig();
    const nodeTopStoryC = domById("TopstoryContent");
    if (nodeTopStoryC) {
      const heightTopStoryContent = nodeTopStoryC.offsetHeight;
      if (heightTopStoryContent < 200) {
        myListenListItem.restart();
      } else {
        myListenListItem.init();
      }
      heightTopStoryContent < window.innerHeight && windowResize();
    }
    initLinkChanger();
    previewGIF();
    initImagePreview();
    doListenComment();
    myListenSearchListItem.init();
    myListenAnswerItem.init();
    pathnameHasFn({
      collection: () => myCollectionExport.init()
    });
    globalTitle !== document.title && changeTitle();
    const nodeSearchBarInput = dom(".SearchBar-input input");
    if (hiddenSearchBoxTopSearch && nodeSearchBarInput) {
      nodeSearchBarInput.placeholder = "";
    }
  }
  var appendHiddenStyle = async () => {
    const config = await myStorage.getConfig();
    let hiddenContent = "";
    HIDDEN_ARRAY.forEach((item) => {
      item.content.forEach((content) => {
        content.forEach((hiddenItem) => {
          config[hiddenItem.value] && (hiddenContent += hiddenItem.css);
        });
      });
    });
    HIDDEN_ARRAY_MORE.forEach(({ keys, value }) => {
      let trueNumber = 0;
      keys.forEach((key) => config[key] && trueNumber++);
      trueNumber === keys.length && (hiddenContent += value);
    });
    fnAppendStyle("CTZ_STYLE_HIDDEN", hiddenContent);
  };
  var fnChanger = async (ev) => {
    const doCssVersion = [
      "questionTitleTag",
      "fixedListItemMore",
      "linkShopping",
      "highlightListItem",
      "zoomImageSize",
      "zoomImageHeight",
      "zoomImageHeightSize",
      "versionHome",
      "versionAnswer",
      "versionArticle",
      "versionHomePercent",
      "versionAnswerPercent",
      "versionArticlePercent",
      "fontSizeForListTitle",
      "fontSizeForAnswerTitle",
      "fontSizeForArticleTitle",
      "fontSizeForList",
      "fontSizeForAnswer",
      "fontSizeForArticle",
      "contentLineHeight",
      "zoomListVideoType",
      "zoomListVideoSize",
      "commitModalSizeSameVersion",
      "videoUseLink"
    ];
    const { name, value, checked, type } = ev;
    const changeBackground = () => {
      myVersion.change();
      myBackground.init();
      myListenListItem.restart();
      onUseThemeDark();
    };
    const rangeChoosePercent = () => {
      const rangeName = name.replace("IsPercent", "");
      const rangeNamePercent = `${rangeName}Percent`;
      const domRange = dom(`.ctz-range-${rangeName}`);
      const domRangePercent = dom(`.ctz-range-${rangeNamePercent}`);
      if (domRange && domRangePercent) {
        domRange.style.display = checked ? "none" : "flex";
        domRangePercent.style.display = !checked ? "none" : "flex";
      }
      myVersion.change();
    };
    const ob = {
      [INPUT_NAME_THEME]: changeBackground,
      [INPUT_NAME_ThEME_LIGHT]: changeBackground,
      [INPUT_NAME_THEME_DARK]: changeBackground,
      colorText1: changeBackground,
      backgroundHighlightOriginal: changeBackground,
      suspensionHomeTab: () => {
        myVersion.change();
        changeSuspensionTab();
      },
      suspensionFind: cacheHeader,
      suspensionSearch: cacheHeader,
      suspensionUser: cacheHeader,
      titleIco: changeICO,
      showGIFinDialog: previewGIF,
      questionCreatedAndModifiedTime: addQuestionTime,
      highlightOriginal: () => myListenListItem.restart(),
      listOutPutNotInterested: () => myListenListItem.restart(),
      articleCreateTimeToTop: addArticleTime,
      versionHomeIsPercent: rangeChoosePercent,
      versionAnswerIsPercent: rangeChoosePercent,
      versionArticleIsPercent: rangeChoosePercent,
      zoomImageType: () => {
        myVersion.change();
        initImagePreview();
      },
      globalTitleRemoveMessage: changeTitle,
      suspensionPickUp: suspensionPickupAttribute,
      suspensionPickupRight: suspensionPickupAttribute
    };
    if (name === "fetchInterceptStatus") {
      if (confirm(
        !checked ? "关闭接口拦截，确认后将刷新页面。\n「黑名单设置；外置不感兴趣；快速屏蔽用户；回答、文章和收藏夹导出」功能将不可用。" : "开启接口拦截，确认后将刷新页面。\n如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。"
      )) {
        myStorage.updateConfigItem("fetchInterceptStatus", checked);
        window.location.reload();
      } else {
        ev.checked = !checked;
      }
      return;
    }
    await myStorage.updateConfigItem(name, type === "checkbox" ? checked : value);
    if (type === "range") {
      const nodeName = domById(name);
      nodeName && (nodeName.innerText = value);
    }
    if (/^hidden/.test(name)) {
      appendHiddenStyle();
      return;
    }
    if (doCssVersion.includes(name)) {
      myVersion.change();
      return;
    }
    ob[name] && ob[name]();
  };
  var initOperate = () => {
    const nodeContent = domById("CTZ_DIALOG");
    nodeContent.onclick = (e) => {
      const target = e.target;
      if (target.classList.contains(CLASS_INPUT_CLICK)) {
        fnChanger(target);
        return;
      }
      if (target.classList.contains("ctz-reset-font-size")) {
        const inputName = target.name.replace("reset-", "");
        const nodeInput = dom(`[name="${inputName}"]`);
        nodeInput.value = "";
        fnChanger(nodeInput);
        return;
      }
      if (target.classList.contains("ctz-button")) {
        myButtonOperation[target.name] && myButtonOperation[target.name]();
        return;
      }
    };
    nodeContent.onchange = (e) => {
      const target = e.target;
      if (target.classList.contains(CLASS_INPUT_CHANGE) || target.classList.contains(CLASS_SELECT)) {
        fnChanger(target);
        return;
      }
      if (target.classList.contains("ctz-input-config-import")) {
        configImport(e);
        return;
      }
    };
    dom("#CTZ_DIALOG_MENU").onclick = onChangeMenu;
    domA(".ctz-preview").forEach((item) => {
      item.onclick = function() {
        myPreview.hide(this);
      };
    });
    domA('[name="button_history_clear"]').forEach((item) => {
      item.onclick = async (event) => {
        const prevHistory = await myStorage.getHistory();
        const target = event.target;
        const dataId = target.getAttribute("data-id");
        const isClear = confirm(`是否清空${target.innerText}`);
        if (!isClear) return;
        prevHistory[dataId] = [];
        await myStorage.updateHistory(prevHistory);
        echoHistory();
      };
    });
    moveAndOpen();
    initRootEvent();
  };
  var myButtonOperation = {
    configExport: async () => {
      const config = await myStorage.get("pfConfig") || "{}";
      const dateNumber = +/* @__PURE__ */ new Date();
      const link = domC("a", {
        href: "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(config),
        download: `知乎编辑器配置-${formatTime(dateNumber, "YYYY-MM-DD_HH-mm-ss")}-${dateNumber}.txt`
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    configRemove: async () => {
      GM.deleteValue("pfConfig");
      localStorage.removeItem("pfConfig");
    },
    configReset: async function() {
      const isUse = confirm("是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存");
      if (!isUse) return;
      const { filterKeywords = [], blockedUsers = [] } = await myStorage.getConfig();
      await myStorage.updateConfig({
        ...CONFIG_DEFAULT,
        filterKeywords,
        blockedUsers
      });
      setTimeout(() => {
        location.reload();
      }, 300);
    },
    styleCustom: async function() {
      const nodeText = dom('[name="textStyleCustom"]');
      const value = nodeText ? nodeText.value : "";
      await myStorage.updateConfigItem("customizeCss", value);
      myCustomStyle.change(value);
    },
    syncBlack: () => syncBlackList(0),
    syncBlackRemove: () => syncRemoveBlockedUsers(),
    buttonConfirmTitle: async function() {
      const nodeTitle = dom('[name="globalTitle"]');
      await myStorage.updateConfigItem("globalTitle", nodeTitle ? nodeTitle.value : "");
      changeTitle();
      message("网页标题修改成功");
    },
    buttonResetTitle: async function() {
      const { getStorageConfigItem } = store;
      const nodeTitle = dom('[name="globalTitle"]');
      nodeTitle && (nodeTitle.value = getStorageConfigItem("cacheTitle"));
      await myStorage.updateConfigItem("globalTitle", "");
      changeTitle();
      message("网页标题已还原");
    },
    configImport: () => {
      dom("#IMPORT_BY_FILE input").click();
    },
    dialogClose: openChange,
    dialogBig: () => {
      const nodeDialog = domById("CTZ_DIALOG");
      const isHeight = nodeDialog.style.height === "100vh";
      nodeDialog.style.height = isHeight ? "" : "100vh";
      dom(`button[name="dialogBig"]`).innerText = isHeight ? "+" : "-";
    },
    useSimple: async () => {
      const isUse = confirm("是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存");
      if (!isUse) return;
      const prevConfig = await myStorage.getConfig();
      myStorage.updateConfig({
        ...prevConfig,
        ...CONFIG_SIMPLE
      });
      setTimeout(() => {
        location.reload();
      }, 300);
    }
  };
  var configImport = (e) => {
    const target = e.target;
    const configFile = (target.files || [])[0];
    if (!configFile) return;
    const reader = new FileReader();
    reader.readAsText(configFile);
    reader.onload = async (oFREvent) => {
      let config = oFREvent.target ? oFREvent.target.result : "";
      if (typeof config === "string") {
        const nConfig = JSON.parse(config);
        await myStorage.updateConfig(nConfig);
        setTimeout(() => {
          location.reload();
        }, 300);
      }
    };
    target.value = "";
  };
  var needRedirect = () => {
    const { pathname, origin } = location;
    const phoneQuestion = "/tardis/sogou/qus/";
    const phoneArt = "/tardis/zm/art/";
    if (pathname.includes(phoneQuestion)) {
      const questionId = pathname.replace(phoneQuestion, "");
      location.href = origin + "/question/" + questionId;
      return true;
    }
    if (pathname.includes(phoneArt)) {
      const questionId = pathname.replace(phoneArt, "");
      location.href = "https://zhuanlan.zhihu.com/p/" + questionId;
      return true;
    }
    return false;
  };
  var BLOCK_WORDS_LIST = `#CTZ_FILTER_BLOCK_WORDS .ctz-block-words-content`;
  var BLOCK_WORDS_ANSWER = `#CTZ_FILTER_BLOCK_WORDS_CONTENT .ctz-block-words-content`;
  var NAME_BY_KEY = {
    filterKeywords: BLOCK_WORDS_LIST,
    blockWordsAnswer: BLOCK_WORDS_ANSWER
  };
  var onRemove = async (e, key) => {
    const domItem = e.target;
    if (!domItem.classList.contains("ctz-filter-word-remove")) return;
    const title = domItem.innerText;
    const config = await myStorage.getConfig();
    domItem.remove();
    myStorage.updateConfigItem(
      key,
      (config[key] || []).filter((i) => i !== title)
    );
  };
  var onAddWord = async (target, key) => {
    const word = target.value;
    const configChoose = (await myStorage.getConfig())[key];
    if (!Array.isArray(configChoose)) return;
    if (configChoose.includes(word)) {
      message("屏蔽词已存在");
      return;
    }
    configChoose.push(word);
    await myStorage.updateConfigItem(key, configChoose);
    const domItem = domC("span", { innerText: word });
    domItem.classList.add("ctz-filter-word-remove");
    const nodeFilterWords = dom(NAME_BY_KEY[key]);
    nodeFilterWords && nodeFilterWords.appendChild(domItem);
    target.value = "";
  };
  var initBlockedWords = async () => {
    const config = await myStorage.getConfig();
    const arr = [
      { domFind: dom(BLOCK_WORDS_LIST), name: "filterKeywords", domInput: dom('[name="inputBlockedWord"]') },
      { domFind: dom(BLOCK_WORDS_ANSWER), name: "blockWordsAnswer", domInput: dom('[name="inputBlockedWordAnswer"]') }
    ];
    for (let i = 0, len = arr.length; i < len; i++) {
      const { domFind, name, domInput } = arr[i];
      if (domFind) {
        const children = (config[name] || []).map((i2) => `<span class="ctz-filter-word-remove">${i2}</span>`).join("");
        domFind.innerHTML = children || "";
        domFind.onclick = (e) => onRemove(e, name);
      }
      domInput && (domInput.onchange = (e) => onAddWord(e.target, name));
    }
  };
  var myCtzTypeOperation = {
    init: function() {
      const params = new URLSearchParams(location.search);
      let ctzType = params.get("ctzType");
      this[ctzType] && this[ctzType]();
    },
    "1": function() {
      const domQuestion = dom(".QuestionPage");
      if (domQuestion && domQuestion.getAttribute("data-za-extra-module")) {
        this.clickAndClose(".QuestionButtonGroup button");
      } else {
        setTimeout(() => {
          this["1"]();
        }, 500);
      }
    },
    "2": function() {
      this.clickAndClose(".TopicActions .FollowButton");
    },
    "3": function() {
      const domQuestion = dom(".CollectionsDetailPage");
      if (domQuestion && domQuestion.getAttribute("data-za-extra-module")) {
        this.clickAndClose(".CollectionDetailPageHeader-actions .FollowButton");
      } else {
        setTimeout(() => {
          this["3"]();
        }, 500);
      }
    },
    clickAndClose: function(eventname) {
      const nodeItem = dom(eventname);
      if (nodeItem) {
        nodeItem.click();
        setTimeout(() => {
          window.close();
        }, 300);
      }
    }
  };
  var myFollowRemove = {
    init: function() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        pathnameHasFn({
          questions: () => this.addButtons(this.classOb.questions),
          collections: () => this.addButtons(this.classOb.collections)
        });
      }, 500);
    },
    addButtons: function(initTypeOb) {
      const me = this;
      const { classNameItem, classHref, ctzType } = initTypeOb;
      if (dom(`div.PlaceHolder.${classNameItem}`)) {
        this.init();
        return;
      }
      domA(`.${classNameItem}`).forEach((item) => {
        const elementButton = domC("button", {
          className: `${me.className} ${me.classNameRemove} ctz-button-black ctz-button`,
          innerText: "移除关注",
          style: "position: absolute;right: 16px;bottom: 16px;background: transparent;"
        });
        elementButton.onclick = function() {
          const nodeThis = this;
          const nItem = domP(nodeThis, "class", classNameItem);
          const nodeHref = nItem ? nItem.querySelector(classHref) : void 0;
          const qHref = nodeHref ? nodeHref.href : "";
          if (!qHref) return;
          const nHref = qHref + `?ctzType=${ctzType}`;
          window.open(nHref);
          if (nodeThis.classList.contains(me.classNameRemove)) {
            nodeThis.innerText = "添加关注";
            nodeThis.classList.remove(me.classNameRemove);
          } else {
            nodeThis.innerText = "移除关注";
            nodeThis.classList.add(me.classNameRemove);
          }
        };
        const nodeClassName = item.querySelector(`.${me.className}`);
        nodeClassName && nodeClassName.remove();
        item.appendChild(elementButton);
      });
    },
    className: "ctz-remove-follow",
    classNameRemove: "ctz-button-red",
    classOb: {
      questions: {
        classNameItem: "List-item",
        classHref: ".QuestionItem-title a",
        ctzType: 1
      },
      topics: {
        classNameItem: "List-item",
        classHref: ".ContentItem-title .TopicLink",
        ctzType: 2
      },
      collections: {
        classNameItem: "List-item",
        classHref: ".ContentItem-title a",
        ctzType: 3
      }
    },
    timer: void 0
  };
  var initOneClickInvitation = () => {
    setTimeout(() => {
      const domInvitation = dom(".QuestionInvitation");
      if (!domInvitation || dom(".ctz-invite-once")) return;
      const nButton = domC("button", {
        className: "ctz-button ctz-invite-once",
        innerHTML: "一键邀请",
        style: "margin-left: 12px;"
      });
      nButton.onclick = () => {
        const fnToMore = () => {
          const moreAction = dom(".QuestionMainAction");
          if (moreAction) {
            moreAction.click();
            setTimeout(() => {
              fnToMore();
            }, 50);
          } else {
            fnToInviteAll();
          }
        };
        const fnToInviteAll = () => {
          const nodeInvites = domA(".QuestionInvitation .ContentItem-extra button");
          nodeInvites.forEach((item) => {
            !item.disabled && !item.classList.contains("AutoInviteItem-button--closed") && item.click();
          });
        };
        fnToMore();
      };
      const nodeTopBar = domInvitation.querySelector(".Topbar");
      nodeTopBar && nodeTopBar.appendChild(nButton);
    }, 500);
  };
  var myPageFilterSetting = {
    timeout: void 0,
    init: function() {
      clearTimeout(this.timeout);
      if (/\/settings\/filter/.test(location.pathname)) {
        this.timeout = setTimeout(() => {
          this.addHTML();
          this.init();
        }, 500);
      }
    },
    addHTML: () => {
      const nButton = domC("button", {
        className: "ctz-button",
        style: "margin-left: 12px;",
        innerHTML: "移除当前页所有屏蔽话题"
      });
      nButton.onclick = () => {
        domA(".Tag button").forEach((item) => item.click());
      };
      domA(".css-j2uawy").forEach((item) => {
        if (/已屏蔽话题/.test(item.innerText) && !item.querySelector(".ctz-button")) {
          item.appendChild(nButton);
        }
      });
    }
  };
  var timer = void 0;
  var userHomeAnswers = async () => {
    const { userHomeContentTimeTop } = await myStorage.getConfig();
    if (!userHomeContentTimeTop) return;
    const doContent = (domList) => {
      for (let i = 0, len = domList.length; i < len; i++) {
        const nodeItem = domList[i];
        const nodeTitle = nodeItem.querySelector(".ContentItem-title");
        if (!nodeTitle || nodeItem.querySelector(`.${CLASS_TIME_ITEM}`)) continue;
        const nodeDateCreate = nodeItem.querySelector('[itemprop="dateCreated"]');
        const nodeDatePublished = nodeItem.querySelector('[itemprop="datePublished"]');
        const nodeDateModified = nodeItem.querySelector('[itemprop="dateModified"]');
        let innerHTML = "";
        if (nodeDateCreate) {
          const dateCreate = nodeDateCreate.getAttribute("content") || "";
          const dateCreateFormatter = formatTime(dateCreate);
          innerHTML += `<div>创建时间：${dateCreateFormatter}</div>`;
        }
        if (nodeDatePublished) {
          const datePublished = nodeDatePublished.getAttribute("content") || "";
          const datePublishedFormatter = formatTime(datePublished);
          innerHTML += `<div>发布时间：${datePublishedFormatter}</div>`;
        }
        if (nodeDateModified) {
          const dateModified = nodeDateModified.getAttribute("content") || "";
          const dateModifiedFormatter = formatTime(dateModified);
          innerHTML += `<div>最后修改时间：${dateModifiedFormatter}</div>`;
        }
        insertAfter(
          domC("div", {
            className: CLASS_TIME_ITEM,
            innerHTML,
            style: "line-height: 24px;padding-top: 2px;font-size: 14px;"
          }),
          nodeTitle
        );
      }
    };
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      const domPlaceHolder = dom(".List-item.PlaceHolder");
      const domList = domA(".List-item:not(.PlaceHolder)");
      !domPlaceHolder ? doContent(domList) : userHomeAnswers();
    }, 500);
  };
  var CLASS_TOP_BLOCK = "ctz-top-block-in-user-home";
  var blockObserver;
  var topBlockUser = async () => {
    const { userHomeTopBlockUser } = await myStorage.getConfig();
    const nodeUserHeaderOperate = dom(".ProfileHeader-contentFooter .MemberButtonGroup");
    const nodeFooterOperations = dom(".Profile-footerOperations");
    if (!nodeUserHeaderOperate || !userHomeTopBlockUser || !nodeFooterOperations) return;
    const isMe = nodeUserHeaderOperate.innerText.includes("编辑个人资料");
    if (isMe) return;
    const domProfileHeader = domById("ProfileHeader");
    if (!domProfileHeader || !domProfileHeader.dataset.zaExtraModule) {
      setTimeout(topBlockUser, 500);
      return;
    }
    const isBlocked = nodeUserHeaderOperate.innerText.includes("已屏蔽");
    const domFind = dom(`.${CLASS_TOP_BLOCK}`);
    domFind && domFind.remove();
    const nDomButton = domC("button", {
      className: `Button Button--primary Button--red ${CLASS_TOP_BLOCK}`,
      innerText: isBlocked ? "解除屏蔽" : "屏蔽用户"
    });
    const domUnblock = nodeUserHeaderOperate.firstChild;
    const domBlock = nodeFooterOperations.firstChild;
    nDomButton.onclick = function() {
      isBlocked ? domUnblock.click() : domBlock.click();
    };
    nodeUserHeaderOperate.insertBefore(nDomButton, domUnblock);
    blockObserver && blockObserver.disconnect();
    blockObserver = new MutationObserver(() => {
      topBlockUser();
    });
    blockObserver.observe(nodeFooterOperations, {
      attributes: false,
      childList: true,
      characterData: false,
      characterDataOldValue: false,
      subtree: true
    });
  };
  (function() {
    if (needRedirect()) return;
    GM_registerMenuCommand("⚙️ 设置", () => {
      openChange();
    });
    const T0 = performance.now();
    const { hostname, href } = location;
    const { setStorageConfigItem, getStorageConfigItem, findRemoveRecommends, setUserAnswer, setUserArticle, setUserinfo, findRemoveAnswers } = store;
    async function onDocumentStart() {
      if (!HTML_HOOTS.includes(hostname) || window.frameElement) return;
      if (!document.head) {
        setTimeout(onDocumentStart, 100);
        return;
      }
      fixVideoAutoPlay();
      fnAppendStyle("CTZ_STYLE", INNER_CSS);
      let config = await myStorage.getConfig();
      if (!config || config.fetchInterceptStatus === void 0) {
        fnLog("您好，欢迎使用本插件，第一次进入，初始化中...");
        config = CONFIG_DEFAULT;
      } else {
        config = {
          ...CONFIG_DEFAULT,
          ...config
        };
      }
      await myStorage.updateConfig(config);
      if (config.removeBlockUserContentList && config.removeBlockUserContentList.length) {
        config.blockedUsers = [...config.removeBlockUserContentList];
        delete config.removeBlockUserContentList;
        await myStorage.updateConfig(config);
      }
      initHistoryView();
      appendHiddenStyle();
      myBackground.init();
      myVersion.init();
      checkThemeDarkOrLight();
      dom("html").classList.add(/www\.zhihu\.com\/column/.test(href) ? "zhuanlan" : EXTRA_CLASS_HTML[hostname]);
      const { fetchInterceptStatus } = config;
      if (fetchInterceptStatus) {
        fnLog("已开启接口拦截");
        const prevHeaders = getStorageConfigItem("fetchHeaders");
        const originFetch = fetch;
        const myWindow = isSafari ? window : unsafeWindow;
        myWindow.fetch = (url, opt) => {
          if (opt && opt.headers) {
            setStorageConfigItem("fetchHeaders", {
              ...prevHeaders,
              ...opt.headers
            });
          }
          return originFetch(url, opt).then((res) => {
            interceptionResponse(res, /\/api\/v3\/feed\/topstory\/recommend/, (r) => findRemoveRecommends(r.data));
            interceptionResponse(res, /\api\/v4\/members\/[^/]+\/answers/, (r) => setUserAnswer(r.data));
            interceptionResponse(res, /\api\/v4\/members\/[^/]+\/articles/, (r) => setUserArticle(r.data));
            interceptionResponse(res, /\/api\/v4\/me\?/, (r) => {
              appendHomeLink(r);
              setUserinfo(r);
            });
            interceptionResponse(res, /\/api\/v4\/comment_v5/, (r) => formatCommentAuthors(r.data));
            interceptionResponse(res, /\/api\/v4\/questions\/[^/]+\/feeds/, (r) => {
              const answerTargets = r.data.map((i) => formatDataToHump(i.target));
              findRemoveAnswers(answerTargets);
            });
            return res;
          });
        };
      }
      onBodyLoad();
    }
    onDocumentStart();
    const onBodyLoad = async () => {
      if (!document.body) {
        setTimeout(onBodyLoad, 100);
        return;
      }
      if (HTML_HOOTS.includes(hostname) && !window.frameElement) {
        const JsData = JSON.parse(domById("js-initialData") ? domById("js-initialData").innerText : "{}");
        try {
          const prevRecommend = JsData.initialState.topstory.recommend.serverPayloadOrigin.data;
          findRemoveRecommends(prevRecommend || []);
        } catch {
        }
        try {
          const prevAnswers = JsData.initialState.entities.answers;
          const answerTargets = Object.values(prevAnswers);
          answerTargets.length && findRemoveAnswers(answerTargets);
        } catch {
        }
        const { removeTopAD } = await myStorage.getConfig();
        initHTML();
        initOperate();
        initData();
        myVersion.initAfterLoad();
        myCustomStyle.init();
        initBlockedWords();
        initResizeObserver();
        myCtzTypeOperation.init();
        echoHistory();
        if (removeTopAD) {
          setTimeout(() => {
            mouseEventClick(dom("svg.css-1p094v5"));
          }, 300);
        }
      }
      historyToChangePathname();
      if (hostname === "zhuanlan.zhihu.com") {
        addArticleTime();
        const nodeArticle = dom(".Post-content");
        if (nodeArticle) {
          printArticle(nodeArticle);
          initVideoDownload(nodeArticle);
        }
      }
      fnLog(`加载完毕, 加载时长: ${Math.floor((performance.now() - T0) / 10) / 100}s, 可使用 shift + . 或点击左侧眼睛按钮唤起修改器弹窗`);
    };
    const historyToChangePathname = () => {
      pathnameHasFn({
        question: () => {
          addQuestionTime();
          const nodeQuestionAnswer = dom(".QuestionAnswer-content");
          nodeQuestionAnswer && fnJustNum(nodeQuestionAnswer);
          initOneClickInvitation();
        },
        filter: () => myPageFilterSetting.init(),
        collection: () => myCollectionExport.init(),
        following: () => myFollowRemove.init(),
        answers: () => {
          throttle(printPeopleAnswer)();
          userHomeAnswers();
        },
        posts: () => {
          throttle(printPeopleArticles)();
          userHomeAnswers();
        },
        people: topBlockUser
      });
    };
    const changeHistory = () => {
      historyToChangePathname();
      myListenListItem.reset();
      myListenSearchListItem.reset();
      myListenAnswerItem.reset();
    };
    window.addEventListener("popstate", throttle(changeHistory));
    window.addEventListener("pushState", throttle(changeHistory));
    window.addEventListener("load", () => {
      const nodeSignModal = dom(".signFlowModal");
      const nodeSignClose = nodeSignModal && nodeSignModal.querySelector(".Modal-closeButton");
      nodeSignClose && nodeSignClose.click();
      if (hostname === "zhuanlan.zhihu.com") {
        setTimeout(() => {
          initVideoDownload(dom(".Post-content"));
          fnReplaceZhidaToSearch();
        }, 500);
      }
      pathnameHasFn({
        zvideo: () => {
          setTimeout(() => {
            initVideoDownload(dom(".ZVideo-mainColumn"));
          }, 500);
        }
      });
    });
    window.addEventListener("keydown", async (event) => {
      const { hotKey, keyEscCloseCommentDialog } = await myStorage.getConfig();
      if (hotKey) {
        if (event.key === ">" || event.key === "》") {
          openChange();
        }
      }
      if (event.key === "Escape") {
        if (domById(ID_EXTRA_DIALOG).dataset.status === "open") {
          closeExtra();
        } else if (domById("CTZ_OPEN_CLOSE").getAttribute("data-close") === "0") {
          openChange();
        }
        keyEscCloseCommentDialog && closeCommentDialog();
      }
      keydownNextImage(event);
    });
    document.addEventListener("copy", function(event) {
      let clipboardData = event.clipboardData || window.clipboardData;
      if (!clipboardData) return;
      const selection = window.getSelection();
      let text = selection ? selection.toString() : "";
      if (text) {
        event.preventDefault();
        clipboardData.setData("text/plain", text);
      }
    });
  })();
})();
