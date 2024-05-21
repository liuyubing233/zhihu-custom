// ==UserScript==
// @name         知乎修改器🤜持续更新🤛努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      4.16.1
// @description  页面模块自定义隐藏，列表及回答内容过滤，保存浏览历史记录，推荐页内容缓存，一键邀请，复制代码块删除版权信息，列表种类和关键词强过滤并自动调用「不感兴趣」接口，屏蔽用户回答，视频下载，设置自动收起所有长回答或自动展开所有回答，移除登录提示弹窗，设置过滤故事档案局和盐选科普回答等知乎官方账号回答，手动调节文字大小，切换主题及深色模式调整，隐藏知乎热搜，列表添加标签种类，去除广告，设置购买链接显示方式，收藏夹内容、回答、文章导出为PDF，一键移除所有屏蔽选项，外链直接打开，键盘左右切换预览图片，更多功能请在插件里体验...
// @compatible   edge Violentmonkey
// @compatible   edge Tampermonkey
// @compatible   chrome Violentmonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Violentmonkey
// @compatible   firefox Tampermonkey
// @compatible   safari Violentmonkey
// @compatible   safari Tampermonkey
// @author       liuyubing
// @license      MIT
// @match        *://*.zhihu.com/*
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

"use strict";
(() => {
  var CONFIG_HIDDEN_DEFAULT = {
    hiddenAnswerRightFooter: true,
    hiddenReadMoreText: true,
    hiddenAD: true,
    hiddenDetailFollow: true,
    hidden618HongBao: true,
    hiddenZhihuZhiShop: true
  };
  var CONFIG_FILTER_DEFAULT = {
    removeZhihuOfficial: false,
    removeStoryAnswer: true,
    removeYanxuanAnswer: true,
    removeYanxuanRecommend: true,
    removeYanxuanCPRecommend: true,
    removeFromYanxuan: true,
    removeFromEBook: true,
    removeUnrealAnswer: false,
    removeFollowVoteAnswer: false,
    removeFollowVoteArticle: false,
    removeFollowFQuestion: false,
    removeBlockUserContent: true,
    removeBlockUserContentList: [],
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
    suspensionPickUp: true
  };
  var CONFIG_SIMPLE = {
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
    answerOpen: "off",
    showBlockUser: false,
    zoomImageType: "2",
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
    linkShopping: "1",
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
    answerOpen: "",
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
    zoomImageType: "0",
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
    linkShopping: "0",
    fontSizeForList: 15,
    fontSizeForAnswer: 15,
    fontSizeForArticle: 16,
    fontSizeForListTitle: 18,
    fontSizeForAnswerTitle: 22,
    fontSizeForArticleTitle: 24,
    zoomListVideoType: "0",
    zoomListVideoSize: "500",
    hotKey: true,
    theme: 2 /* 自动 */,
    themeLight: 0 /* 默认 */,
    themeDark: 1 /* 深色护眼一 */,
    colorText1: "",
    commitModalSizeSameVersion: true,
    listOutputToQuestion: false,
    userHomeContentTimeTop: true,
    userHomeTopBlockUser: true,
    copyAnswerLink: true,
    contentRemoveKeywordSearch: false
  };
  var SAVE_HISTORY_NUMBER = 500;
  var Store = class {
    constructor() {
      /** 修改器配置 */
      this.pfConfig = CONFIG_DEFAULT;
      /** 缓存浏览历史记录 */
      this.pfHistory = {
        view: [],
        list: []
      };
      /** 用户信息 更改prev: userInfo */
      this.userinfo = void 0;
      this.findEvent = {
        header: { fun: null, num: 0, isFind: false }
      };
      /** 脚本内配置缓存 */
      this.storageConfig = {
        cachePfConfig: {},
        cacheTitle: "",
        fetchHeaders: {},
        heightForList: 0,
        headerDoms: {}
      };
      /** 用户页面列表接口缓存 */
      this.homeFetch = {};
      /** 知乎列表接口或JSON内容缓存 */
      this.zhihuListTargets = [];
      this.setConfig = this.setConfig.bind(this);
      this.getConfig = this.getConfig.bind(this);
      this.setHistory = this.setHistory.bind(this);
      this.getHistory = this.getHistory.bind(this);
      this.setUserinfo = this.setUserinfo.bind(this);
      this.getUserinfo = this.getUserinfo.bind(this);
      this.setFindEvent = this.setFindEvent.bind(this);
      this.setFindEventItem = this.setFindEventItem.bind(this);
      this.getFindEvent = this.getFindEvent.bind(this);
      this.getFindEventItem = this.getFindEventItem.bind(this);
      this.setStorageConfig = this.setStorageConfig.bind(this);
      this.setStorageConfigItem = this.setStorageConfigItem.bind(this);
      this.getStorageConfig = this.getStorageConfig.bind(this);
      this.getStorageConfigItem = this.getStorageConfigItem.bind(this);
      this.getHomeFetch = this.getHomeFetch.bind(this);
      this.setHomeFetch = this.setHomeFetch.bind(this);
      this.setZhihuListTargets = this.setZhihuListTargets.bind(this);
      this.getZhihuListTargets = this.getZhihuListTargets.bind(this);
      this.clearZhihuListTargets = this.clearZhihuListTargets.bind(this);
    }
    /** 仅在 commons/storage 文件中使用 */
    setConfig(inner) {
      this.pfConfig = inner;
    }
    getConfig() {
      return this.pfConfig;
    }
    /** 仅在 commons/storage 文件中使用 */
    setHistory(inner) {
      this.pfHistory = inner;
    }
    getHistory() {
      return this.pfHistory;
    }
    setUserinfo(inner) {
      this.userinfo = inner;
    }
    getUserinfo() {
      return this.userinfo;
    }
    setFindEvent(inner) {
      this.findEvent = inner;
    }
    setFindEventItem(key, content) {
      this.findEvent[key] = content;
    }
    getFindEvent() {
      return this.findEvent;
    }
    getFindEventItem(key) {
      return this.findEvent[key];
    }
    setStorageConfig(inner) {
      this.storageConfig = inner;
    }
    setStorageConfigItem(key, content) {
      this.storageConfig[key] = content;
    }
    getStorageConfig() {
      return this.storageConfig;
    }
    getStorageConfigItem(key) {
      return this.storageConfig[key];
    }
    getHomeFetch(key) {
      return this.homeFetch[key];
    }
    setHomeFetch(key, content) {
      this.homeFetch[key] = content;
    }
    setZhihuListTargets(data) {
      this.zhihuListTargets = this.zhihuListTargets.concat(data);
    }
    clearZhihuListTargets() {
      this.zhihuListTargets = [];
    }
    getZhihuListTargets() {
      return this.zhihuListTargets;
    }
  };
  var store = new Store();
  var THEMES = [
    { label: "浅色", value: 0 /* 浅色 */, background: "#fff", color: "#000" },
    { label: "深色", value: 1 /* 深色 */, background: "#000", color: "#fff" },
    { label: "自动", value: 2 /* 自动 */, background: "linear-gradient(to right, #fff, #000)", color: "#000" }
  ];
  var THEME_CONFIG_LIGHT = {
    [0 /* 默认 */]: { name: "默认", background: "#ffffff", background2: "" },
    [1 /* 红 */]: { name: "红", background: "#ffe4c4", background2: "#fff4e7" },
    [2 /* 黄 */]: { name: "黄", background: "#faf9de", background2: "#fdfdf2" },
    [3 /* 绿 */]: { name: "绿", background: "#cce8cf", background2: "#e5f1e7" },
    [4 /* 灰 */]: { name: "灰", background: "#eaeaef", background2: "#f3f3f5" },
    [5 /* 紫 */]: { name: "紫", background: "#e9ebfe", background2: "#f2f3fb" },
    [6 /* 落日黄 */]: { name: "落日黄", background: "#FFD39B", background2: "#ffe4c4" }
  };
  var THEME_CONFIG_DARK = {
    [0 /* 深色模式默认 */]: { name: "默认", color: "#fff", color2: "#999", background: "#121212", background2: "#333333" },
    [1 /* 深色护眼一 */]: { name: "深色护眼一", color: "#f7f9f9", color2: "#161d23", background: "#15202b", background2: "#38444d" },
    [2 /* 深色护眼二 */]: { name: "深色护眼二", color: "#f7f9f9", color2: "#161d23", background: "#1f1f1f", background2: "#303030" },
    [3 /* 深色护眼三 */]: { name: "深色护眼三", color: "#f7f9f9", color2: "#161d23", background: "#272822", background2: "#383932" },
    [4 /* 深色蓝 */]: { name: "深色蓝", color: "#f7f9f9", color2: "#161d23", background: "#1c0c59", background2: "#191970" },
    [5 /* 深色红 */]: { name: "深色红", color: "#f7f9f9", color2: "#161d23", background: "#570D0D", background2: "#8B0000" },
    [6 /* 深色绿 */]: { name: "深色绿", color: "#f7f9f9", color2: "#161d23", background: "#093333", background2: "#0c403f" }
  };
  var INPUT_NAME_THEME = "theme";
  var INPUT_NAME_THEME_DARK = "themeDark";
  var INPUT_NAME_ThEME_LIGHT = "themeLight";
  var HTML_HOOTS = ["www.zhihu.com", "zhuanlan.zhihu.com"];
  var ID_DIALOG = "CTZ_DIALOG_MAIN";
  var ID_BUTTON_SYNC_BLOCK = "CTZ-BUTTON-SYNC-BLOCK";
  var CLASS_INPUT_CLICK = "ctz-i";
  var CLASS_INPUT_CHANGE = "ctz-i-change";
  var CLASS_REMOVE_BLOCK = "ctz-remove-block";
  var CLASS_NOT_INTERESTED = "ctz-not-interested";
  var CLASS_TO_QUESTION = "ctz-to-question";
  var CLASS_TIME_ITEM = "ctz-list-item-time";
  var CLASS_MESSAGE = "ctz-message";
  var ID_MESSAGE_BOX = "CTZ_MESSAGE_BOX";
  var OB_CLASS_FOLD = {
    on: "ctz-fold-open",
    off: "ctz-fold-close"
  };
  var EXTRA_CLASS_HTML = {
    "zhuanlan.zhihu.com": "zhuanlan",
    "www.zhihu.com": "zhihu"
  };
  var HEADER = [
    { href: "#CTZ_BASIS", value: "基础设置" },
    { href: "#CTZ_HIDDEN", value: "隐藏模块设置" },
    { href: "#CTZ_FILTER", value: "屏蔽内容设置" },
    { href: "#CTZ_BLOCK_WORD", value: "屏蔽词设置" },
    { href: "#CTZ_BLACKLIST", value: "黑名单设置" },
    { href: "#CTZ_HISTORY", value: "历史记录" },
    { href: "#CTZ_DEFAULT", value: "默认功能" }
  ];
  var FONT_SIZE_INPUT = [
    [
      { value: "fontSizeForListTitle", label: "列表标题文字大小" },
      { value: "fontSizeForList", label: "列表内容文字大小" }
    ],
    [
      { value: "fontSizeForAnswerTitle", label: "回答标题文字大小" },
      { value: "fontSizeForAnswer", label: "回答内容文字大小" }
    ],
    [
      { value: "fontSizeForArticleTitle", label: "文章标题文字大小" },
      { value: "fontSizeForArticle", label: "文章内容文字大小" }
    ]
  ];
  var VERSION_MIN_WIDTH = 600;
  var VERSION_RANGE = [
    {
      label: "列表页内容宽度",
      value: "versionHome",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionHomeIsPercent",
      percentChooseLabel: "列表页内容宽度用百分比设置",
      desc: "列表页内容宽度最小为600像素，设置宽度小于此则会用600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentLabel: "列表页内容宽度（百分比）",
      percentValue: "versionHomePercent"
    },
    {
      label: "回答页内容宽度",
      value: "versionAnswer",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionAnswerIsPercent",
      percentChooseLabel: "回答页内容宽度用百分比设置",
      desc: "回答页内容宽度最小为600像素，设置宽度小于此则会用600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentLabel: "回答页内容宽度（百分比）",
      percentValue: "versionAnswerPercent"
    },
    {
      label: "文章页内容宽度",
      value: "versionArticle",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionArticleIsPercent",
      percentChooseLabel: "文章页内容宽度用百分比设置",
      desc: "文章页内容宽度最小为600像素，设置宽度小于此则会用600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentLabel: "文章页内容宽度（百分比）",
      percentValue: "versionArticlePercent"
    }
  ];
  var FILTER_FOLLOWER_OPERATE = [
    { key: "removeFollowVoteAnswer", rep: "赞同了回答" },
    { key: "removeFollowVoteArticle", rep: "赞同了文章" },
    { key: "removeFollowFQuestion", rep: "关注了问题" }
  ];
  var HIDDEN_ANSWER_TAG = {
    removeFromYanxuan: "盐选专栏",
    removeUnrealAnswer: "虚构创作",
    removeFromEBook: "电子书"
  };
  var HIDDEN_ANSWER_ACCOUNT = {
    removeStoryAnswer: "故事档案局",
    removeYanxuanAnswer: "盐选科普",
    removeYanxuanRecommend: "盐选推荐",
    removeYanxuanCPRecommend: "盐选测评室"
  };
  var HIDDEN_ARRAY = [
    {
      key: "CTZ_HIDDEN_COMMON",
      name: "通用隐藏",
      desc: "",
      content: [
        [{ value: "hiddenAD", label: "广告" }],
        // [{ value: 'hiddenTopAD', label: '顶部推广（只能物理隐藏，会存在颜色错误）' }],
        [
          { value: "hiddenLogo", label: "logo" },
          { value: "hiddenHeader", label: "顶部悬浮模块" },
          { value: "hiddenHeaderScroll", label: "滚动顶部悬浮模块/问题名称" }
        ],
        [
          { value: "hiddenAppHeaderTabHome", label: "发现模块-首页" },
          { value: "hiddenAppHeaderTabZhi", label: "发现模块-知学堂" },
          { value: "hiddenAppHeaderTabVIP", label: "发现模块-会员" },
          { value: "hiddenAppHeaderTabFind", label: "发现模块-发现" },
          { value: "hiddenAppHeaderTabWaitingForYou", label: "发现模块-等你来答" }
        ],
        [
          { value: "hiddenAnswerText", label: "回答操作文字" },
          { value: "hiddenWhoVoters", label: "回答隐藏用户信息下的附加信息，比如：你赞同过、XXX赞同了等..." }
        ],
        [
          { value: "hiddenCommitReply", label: "评论「回复」按钮" },
          { value: "hiddenCommitVote", label: "评论「点赞」按钮" },
          { value: "hiddenCommitBottom", label: "评论底部信息" }
        ],
        [{ value: "hiddenZhihuZhiShop", label: "知乎知学堂教育推广商品模块" }]
      ]
    },
    {
      key: "CTZ_HIDDEN_LIST",
      name: "列表",
      desc: "只在列表中隐藏相应内容",
      content: [
        [
          { value: "hiddenHomeCreatorEntrance", label: "创作中心" },
          { value: "hiddenHomeRecommendFollow", label: "推荐关注" },
          { value: "hiddenHomeCategory", label: "分类圆桌" },
          { value: "hiddenHomeCategoryMore", label: "更多分类" },
          { value: "hiddenHomeFooter", label: "知乎指南" }
        ],
        [
          { value: "hiddenHomeListTab", label: "首页列表切换模块" },
          { value: "hiddenHomeListTabFollow", label: "首页列表切换 - 关注" },
          { value: "hiddenHomeListTabRecommend", label: "首页列表切换 - 推荐" },
          { value: "hiddenHomeListTabHot", label: "首页列表切换 - 热榜" },
          { value: "hiddenHomeListTabVideo", label: "首页列表切换 - 视频" }
        ],
        [
          { value: "hiddenHotItemIndex", label: "热门排序编号" },
          { value: "hiddenHotItemLabel", label: '热门"新"元素' },
          { value: "hiddenHotItemMetrics", label: "热门热度值" }
        ],
        [
          { value: "hiddenAnswers", label: "列表回答内容" },
          { value: "hiddenListVideoContent", label: "列表视频回答的内容" },
          { value: "hiddenItemActions", label: "列表回答操作" },
          { value: "hiddenListImg", label: "列表图片" },
          { value: "hiddenReadMoreText", label: "问题列表阅读全文文字" },
          { value: "hiddenListAnswerInPerson", label: "列表「亲自答」标签" }
        ],
        [
          { value: "hiddenFollowAction", label: "关注列表关注人操作栏" },
          { value: "hiddenFollowChooseUser", label: "关注列表用户信息" }
        ],
        [
          { value: "hiddenSearchBoxTopSearch", label: "搜索栏知乎热搜" },
          { value: "hiddenSearchPageTopSearch", label: "搜索页知乎热搜" },
          { value: "hiddenSearchPageFooter", label: "搜索页知乎指南" }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_ANSWER",
      name: "问答",
      desc: "只在回答页面中隐藏相应内容",
      content: [
        [
          { value: "hiddenQuestionTag", label: "问题话题" },
          { value: "hiddenQuestionShare", label: "问题分享" },
          { value: "hiddenQuestionGoodQuestion", label: "「好问题」按钮" },
          { value: "hiddenQuestionComment", label: "添加评论" },
          { value: "hiddenQuestionMore", label: "问题更多「...」按钮" },
          { value: "hiddenQuestionActions", label: "问题操作栏" },
          { value: "hiddenQuestionSpecial", label: "问题专题收录标签" },
          { value: "hiddenQuestionFollowing", label: "问题关注按钮" },
          { value: "hiddenQuestionAnswer", label: "问题写回答按钮" },
          { value: "hiddenQuestionInvite", label: "问题邀请回答按钮" }
        ],
        [
          { value: "hiddenDetailAvatar", label: "回答人头像" },
          { value: "hiddenDetailName", label: "回答人姓名" },
          { value: "hiddenDetailBadge", label: "回答人简介" },
          { value: "hiddenDetailFollow", label: "回答人关注按钮" },
          { value: "hiddenDetailVoters", label: "回答人下赞同数" },
          { value: "hiddenQuestionSide", label: "问题关注和被浏览数" },
          { value: "hiddenFixedActions", label: "回答悬浮操作栏" },
          { value: "hiddenAnswerItemActions", label: "回答内容操作栏" },
          { value: "hiddenReward", label: "赞赏按钮" },
          { value: "hidden618HongBao", label: "618红包链接" }
        ],
        [
          { value: "hiddenAnswerItemTime", label: "回答底部发布编辑时间和IP" },
          { value: "hiddenAnswerItemTimeButHaveIP", label: "回答底部发布编辑时间（保留IP）" }
        ],
        [
          { value: "hiddenAnswerRightFooter", label: "详情右侧信息栏" },
          { value: "hiddenAnswerRightFooterAnswerAuthor", label: "信息栏关于作者" },
          { value: "hiddenAnswerRightFooterFavorites", label: "信息栏被收藏次数" },
          { value: "hiddenAnswerRightFooterRelatedQuestions", label: "信息栏相关问题" },
          { value: "hiddenAnswerRightFooterContentList", label: "信息栏相关推荐" },
          { value: "hiddenAnswerRightFooterFooter", label: "信息栏知乎指南" }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_ARTICLE",
      name: "文章",
      desc: "只在文章页面中隐藏相应内容",
      content: [
        [
          { value: "hiddenZhuanlanTag", label: "文章关联话题" },
          { value: "hiddenZhuanlanActions", label: "文章操作条" },
          { value: "hiddenZhuanlanTitleImage", label: "文章标题图片" },
          { value: "hiddenZhuanlanShare", label: "文章悬浮分享按钮" },
          { value: "hiddenZhuanlanVoters", label: "文章悬浮赞同按钮" },
          { value: "hiddenZhuanlanAvatarWrapper", label: "文章作者头像" },
          { value: "hiddenZhuanlanAuthorInfoHead", label: "文章作者姓名" },
          { value: "hiddenZhuanlanAuthorInfoDetail", label: "文章作者简介" },
          { value: "hiddenZhuanlanFollowButton", label: "文章作者关注按钮" }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_USER_HOME",
      name: "用户主页",
      desc: "只在用户主页隐藏相应内容",
      content: [
        [
          { value: "hiddenUserHomeOtherCard", label: "用户主页付费咨询、认证和成就" },
          { value: "hiddenUserHomePublications", label: "用户主页出版作品" },
          { value: "hiddenUserHomeCreateEntrance", label: "用户主页创作中心" },
          { value: "hiddenUserHomeFollow", label: "用户主页关注和关注者卡片" },
          { value: "hiddenUserHomeLightList", label: "用户主页关注的内容和赞助" },
          { value: "hiddenUserHomeFooterOperate", label: "用户主页右侧屏蔽·举报用户、个人主页被浏览次数" },
          { value: "hiddenUserHomeFooter", label: "用户主页知乎指南" }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_USER_COLLECTIONS",
      name: "收藏夹主页",
      desc: "只在我的收藏夹主页隐藏相应内容",
      content: [
        [
          { value: "hiddenCollectionsCreate", label: "收藏夹创作中心" },
          { value: "hiddenCollectionsRecommendFollow", label: "收藏夹推荐关注" },
          { value: "hiddenCollectionsCategory", label: "收藏夹圆桌入口" },
          { value: "hiddenCollectionsComplementary", label: "收藏夹更多分类" },
          { value: "hiddenCollectionsFooter", label: "收藏夹知乎指南" }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_TOPIC",
      name: "话题",
      desc: "只在话题隐藏相应内容",
      content: [
        [
          { value: "hiddenTopicRightNumberBoard", label: "话题主页右侧浏览/讨论量模块" },
          { value: "hiddenTopicRightParentChild", label: "话题主页右侧父子话题模块" },
          { value: "hiddenTopicRightFooter", label: "话题主页右侧知乎指南" }
        ]
      ]
    }
  ];
  var FOOTER_HTML = `<a href="https://github.com/liuyubing233/zhihu-custom" target="_blank">Github⭐</a><a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8" target="_blank">GreasyFork</a>`;
  var DEFAULT_FUNCTION = [
    '外链直接打开<div class="ctz-commit">知乎里所有外部链接的重定向去除，可以直接访问</div>',
    "移除登录提示弹窗",
    '一键移除所有屏蔽选项，点击「话题黑名单」编辑按钮出现按钮<div class="ctz-commit">知乎<a href="https://www.zhihu.com/settings/filter" target="_blank">屏蔽页面</a>每次只显示部分内容，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽标签</div>',
    '回答视频下载<div class="ctz-commit">回答内容视频左上角会生成一个下载按钮，点击即可下载视频</div>',
    '收藏夹内容导出为 PDF（需开启接口拦截）<div class="ctz-commit">点击收藏夹名称上方「生成PDF」按钮，可导出当前页码的收藏夹详细内容</div>',
    // '当前回答和文章导出为 PDF 功能（需开启接口拦截）<div class="ctz-commit">对应为内容上方的「导出当前回答」「导出当前文章」按钮</div>',
    // '回答内容按照点赞数和评论数排序' +
    //   '<div class="ctz-commit">' +
    //   '6-1. 点击回答右上角的排序按钮，点击【点赞数排序】或【评论数排序】后，页面刷新等待排序完成；<br/>' +
    //   '6-2. 因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序；<br/>' +
    //   '6-3. 为了防止页面错乱，只对前20条进行排序，后续新加载的数据不做排序处理' +
    //   '</div>',
    '个人主页「我关注的问题」、「我关注的收藏」可以一键移除或将移除的内容添加回关注<div class="ctz-commit">由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面</div>',
    "推荐页内容链接根据有新到旧进行缓存，可缓存 100 条；缓存内容在「编辑器 - 历史记录 - 推荐列表缓存」",
    "可保存 100 条浏览历史记录链接，内容为打开的问题、文章、视频；「编辑器 - 历史记录 - 浏览历史记录」",
    '静态图片弹窗观看点击键盘左右直接切换到上一张或下一张<div class="ctz-commit">查看图片点击预览大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示</div>',
    "用户主页-回答-导出当前页回答的功能（需开启接口拦截）",
    "用户主页-文章-导出当前页文章的功能（需开启接口拦截）"
  ];
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
    if (!nodeP)
      return void 0;
    if (!attrName || !attrValue)
      return nodeP;
    if (nodeP === document.body)
      return void 0;
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
  var fnLog = (...str) => console.log("%c「修改器」", "color: green;font-weight: bold;", ...str);
  var fnInitDomStyle = (id, innerHTML) => {
    const element = domById(id);
    element ? element.innerHTML = innerHTML : document.head.appendChild(domC("style", { id, type: "text/css", innerHTML }));
  };
  var fnDomReplace = (node, attrObjs) => {
    if (!node)
      return;
    for (let key in attrObjs) {
      node[key] = attrObjs[key];
    }
  };
  function throttle(fn, time = 300) {
    let tout = void 0;
    return function() {
      if (tout)
        return;
      tout = setTimeout(() => {
        tout = void 0;
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
    if (!element)
      return;
    const event = new MouseEvent("click", {
      view: window,
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
    if (!domBox)
      return;
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
  var createBtnSmallTran = (innerHTML, extraCLass = "") => domC("button", {
    innerHTML,
    className: `ctz-button ctz-button-small ctz-button-transparent ${extraCLass}`,
    style: "margin: 0 4px;"
  });
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
  var fetchGetUserinfo = () => {
    const headers = store.getStorageConfigItem("fetchHeaders");
    return new Promise((resolve) => {
      fetch(
        `https://www.zhihu.com/api/v4/me?include=is_realname%2Cad_type%2Cavailable_message_types%2Cdefault_notifications_count%2Cfollow_notifications_count%2Cvote_thank_notifications_count%2Cmessages_count%2Cemail%2Caccount_status%2Cis_bind_phone%2Cfollowing_question_count%2Cis_force_renamed%2Crenamed_fullname%2Cis_destroy_waiting`,
        {
          method: "GET",
          headers: new Headers(headers),
          credentials: "include"
        }
      ).then((response) => response.json()).then((res) => {
        resolve(res);
      });
    });
  };
  var fnHiddenDom = (lessNum, ev, log) => {
    ev.style.display = "none";
    fnLog(log);
    return ++lessNum;
  };
  var fnIndexMath = (index, i, len, lessNum) => {
    return i + 1 === len ? i - lessNum >= 0 ? i - lessNum : 0 : index;
  };
  var fnJustNum = (element) => {
    if (!element)
      return;
    const { justVoteNum, justCommitNum } = store.getConfig();
    const nodeVoteUp = element.querySelector(".VoteButton--up");
    if (justVoteNum && nodeVoteUp) {
      nodeVoteUp.style.cssText = "font-size: 14px!important;";
      nodeVoteUp.innerHTML = nodeVoteUp.innerHTML.replace("赞同 ", "");
    }
    if (justCommitNum) {
      const buttons = element.querySelectorAll(".ContentItem-actions button");
      for (let i = 0; i < buttons.length; i++) {
        const buttonThis = buttons[i];
        if (buttonThis.innerHTML.includes("条评论")) {
          buttonThis.style.cssText = "font-size: 14px!important;margin-top:-5px;";
          buttonThis.innerHTML = buttonThis.innerHTML.replace("条评论", "");
        }
      }
    }
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
      if (!cParse && !cLParse)
        return "";
      if (!cParse)
        return configLocal;
      if (!cLParse)
        return config;
      if (cParse.t < cLParse.t)
        return configLocal;
      return config;
    },
    initConfig: async function() {
      const prevConfig = store.getConfig();
      const nConfig = await this.get("pfConfig");
      const c = nConfig ? JSON.parse(nConfig) : {};
      const configSave = { ...prevConfig, ...c };
      store.setConfig(configSave);
      return Promise.resolve(configSave);
    },
    initHistory: async function() {
      const prevHistory = store.getHistory();
      const nHistory = await myStorage.get("pfHistory");
      const h = nHistory ? JSON.parse(nHistory) : prevHistory;
      store.setHistory(h);
      return Promise.resolve(h);
    },
    /** 修改配置中的值 */
    setConfigItem: async function(key, value) {
      const { getConfig, setConfig } = store;
      const prevConfig = getConfig();
      if (typeof key === "string") {
        prevConfig[key] = value;
      } else {
        for (let itemKey in key) {
          prevConfig[itemKey] = key[itemKey];
        }
      }
      setConfig(prevConfig);
      await this.set("pfConfig", prevConfig);
    },
    /** 更新配置 */
    setConfig: async function(params) {
      store.setConfig(params);
      await this.set("pfConfig", params);
    },
    setHistoryItem: async function(key, params) {
      const { getHistory, setHistory } = store;
      const pfHistory = getHistory();
      pfHistory[key] = params.slice(0, SAVE_HISTORY_NUMBER);
      setHistory(pfHistory);
      await this.set("pfHistory", pfHistory);
    },
    setHistory: async function(value) {
      store.setHistory(value);
      this.set("pfHistory", value);
    }
  };
  var BLOCK_WORDS_LIST = `#CTZ_BLOCK_WORD_LIST .ctz-block-words-content`;
  var BLOCK_WORDS_ANSWER = `#CTZ_BLOCK_WORD_CONTENT .ctz-block-words-content`;
  var NAME_BY_KEY = {
    filterKeywords: BLOCK_WORDS_LIST,
    blockWordsAnswer: BLOCK_WORDS_ANSWER
  };
  var createHTMLAboutBlockText = (w) => `<span data-title="${w}">${createHTMLAboutBlockTextContent(w)}</span>`;
  var createHTMLAboutBlockTextContent = (w) => `<span>${w}</span><i class="ctz-filter-word-remove">✗</i>`;
  var onRemove = (e, key) => {
    const target = e.target;
    if (!target.classList.contains("ctz-filter-word-remove"))
      return;
    const domItem = target.parentElement;
    const title = domItem.dataset.title;
    const config = store.getConfig();
    domItem.remove();
    myStorage.setConfigItem(
      key,
      (config[key] || []).filter((i) => i !== title)
    );
  };
  var onAddWord = async (target, key) => {
    const word = target.value;
    const configThis = store.getConfig()[key];
    if (!Array.isArray(configThis))
      return;
    configThis.push(word);
    await myStorage.setConfigItem(key, configThis);
    const domItem = domC("span", { innerHTML: createHTMLAboutBlockTextContent(word) });
    domItem.dataset.title = word;
    const nodeFilterWords = dom(NAME_BY_KEY[key]);
    nodeFilterWords && nodeFilterWords.appendChild(domItem);
    target.value = "";
  };
  var initBlockWords = () => {
    const config = store.getConfig();
    const arr = [
      { domFind: dom(BLOCK_WORDS_LIST), name: "filterKeywords", domInput: dom('[name="inputFilterWord"]') },
      { domFind: dom(BLOCK_WORDS_ANSWER), name: "blockWordsAnswer", domInput: dom('[name="inputBlockWordsAnswer"]') }
    ];
    for (let i = 0, len = arr.length; i < len; i++) {
      const { domFind, name, domInput } = arr[i];
      if (domFind) {
        const children = (config[name] || []).map((i2) => createHTMLAboutBlockText(i2)).join("");
        domFind.innerHTML = children || "";
        domFind.onclick = (e) => onRemove(e, name);
      }
      domInput && (domInput.onchange = (e) => onAddWord(e.target, name));
    }
  };
  var echoData = async () => {
    const pfConfig = await myStorage.initConfig();
    const textSameName = {
      globalTitle: (e) => e.value = pfConfig.globalTitle || document.title,
      customizeCss: (e) => e.value = pfConfig.customizeCss || ""
    };
    const echoText = (even) => {
      textSameName[even.name] ? textSameName[even.name](even) : even.value = pfConfig[even.name];
    };
    const echo = {
      radio: (even) => pfConfig.hasOwnProperty(even.name) && even.value === pfConfig[even.name] && (even.checked = true),
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
  var changeTitle = () => {
    const { getConfig, getStorageConfigItem } = store;
    const conf = getConfig();
    const cacheTitle = getStorageConfigItem("cacheTitle");
    document.title = conf.globalTitle || cacheTitle;
  };
  var changeICO = () => {
    const { getConfig } = store;
    const { titleIco = "" } = getConfig();
    const nId = "CTZ_ICO";
    if (!ICO_URL[titleIco])
      return;
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
  var myBackground = {
    init: function() {
      const { themeDark = 1 /* 深色护眼一 */, themeLight = 0 /* 默认 */ } = store.getConfig();
      const innerHTML = this.change(themeDark, themeLight);
      fnInitDomStyle("CTZ_STYLE_BACKGROUND", innerHTML);
    },
    change: function(themeDark, themeLight) {
      const getBackground = () => {
        if (this.isUseDark())
          return this.dark(themeDark);
        if (+themeLight === 0 /* 默认 */)
          return this.default();
        return this.light(themeLight);
      };
      return getBackground() + this.text();
    },
    isUseDark: () => {
      const { theme = 2 /* 自动 */ } = store.getConfig();
      if (+theme === 2 /* 自动 */) {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        return prefersDarkScheme.matches;
      }
      return +theme === 1 /* 深色 */;
    },
    default: () => ".GlobalSideBar-navList{background: #fff}",
    dark: function(darkKey) {
      const { background, background2, color, color2 } = THEME_CONFIG_DARK[darkKey];
      const cssColor1 = `#${ID_DIALOG},.${CLASS_MESSAGE},#CTZ_MAIN input,#CTZ_MAIN textarea,.ctz-footer,#CTZ_CLOSE_DIALOG,.ctz-commit,#CTZ_OPEN_BUTTON,.ctz-export-collection-box p,.Modal-content,.Modal-content div,.Menu-item.is-active,.Select-list button:active,.Select-list button:hover,.Popover-content button,.zu-main div,.modal-dialog,.zh-profile-card div,.QuestionAnswers-answerAdd div,.QuestionAnswers-answerAdd label,.Tabs-link,.toolbar-section button,.css-yd95f6,.css-g9ynb2,.css-i9srcr,.css-i9srcr div,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 label,.css-arjme8 h1,.css-13brsx3,.css-1ta275q div,.Creator-mainColumn .Card div,.Comments-container div,.SettingsMain div,.KfeCollection-PayModal-modal div,.KfeCollection-CouponCard-selectLabel,.KfeCollection-CouponCard-optionItem-text,.KfeCollection-PayModal-modal-icon,.NavItemClassName,.LinkCard-title,.Creator div,.Creator span,.Modal-wrapper textarea,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.FeedbackModal-title,.css-r38x5n div,.css-1dwlho,.LiveDetailsPage-root-aLVPj div,.css-1b0ypf8 div,.css-1b0ypf8 a,.css-np3nxw div,.css-10ub9de,.css-1wbvd3d,.css-1f4cz9u,.css-y42e6l,.PostEditor-wrapper>div:last-of-type div,.PostEditor-wrapper>div:last-of-type label,.ToolsQuestion a,.ToolsQuestion font,.utils-frostedGlassEffect-2unM div,.utils-frostedGlassEffect-2unM span,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.aria-primary-color-style.aria-secondary-background p,.aria-primary-color-style.aria-secondary-background h2,#feedLives div,#feedLives a,.Card-card-2K6v,.Card-card-2K6v div,.Card-card-2K6v h3,._Invite_container_30SP h2,._Invite_container_30SP h1,.ChatListGroup-SectionTitle .Zi,.Qrcode-container>div,.Qrcode-guide-message>div,.signQr-leftContainer button,.signQr-leftContainer a,.ExploreHomePage-square div,.ExploreHomePage-square a,.jsNavigable a,#TopstoryContent h2,[role="contentinfo"] div,.css-1e1wubc,.css-1e1wubc div,.css-12kq1qx,.css-172osot div,.css-172osot a:last-child,.css-f2jj4r,.css-10u695f,.css-wqf2py,.css-wmwsyx,.css-wmwsyx div,{color: ${color}!important}`;
      const cssC2 = `.css-o7lu8j{color: ${color2}!important}`;
      const cssCB2 = `css-1x3upj1,.PlaceHolder-inner,.PlaceHolder-mask path,.css-1kxql2v{color: ${background2}!important}`;
      const cssColorLink = `.css-1esjagr,.css-ruirke,.css-117anjg a.UserLink-link,.RichContent--unescapable.is-collapsed .ContentItem-rightButton,.css-1qap1n7,.ContentItem-more,.ContentItem-title a:hover,.Profile-lightItem:hover,.Profile-lightItem:hover .Profile-lightItemValue,.css-p54aph:hover,.PushNotifications-item a:hover,.PushNotifications-item a,.NotificationList-Item-content .NotificationList-Item-link:hover,.SettingsQA a,a.QuestionMainAction:hover,.SimilarQuestions-item .Button,.signQr-leftContainer button:hover,.signQr-leftContainer a:hover,.Profile-sideColumnItemLink:hover,.FollowshipCard-link,.css-zzimsj:hover,.NumberBoard-item.Button:hover .NumberBoard-itemName, .NumberBoard-item.Button:hover .NumberBoard-itemValue, .NumberBoard-itema:hover .NumberBoard-itemName, .NumberBoard-itema:hover .NumberBoard-itemValue,a.external,.RichContent-EntityWord,.SideBarCollectionItem-title,.Tag-content,.LabelContainer div,.LabelContainer a{color: deepskyblue!important;}.css-1tu59u4{fill: deepskyblue!important;}`;
      const cssBorderB = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
      const cssDialogBorder = `#${ID_DIALOG}{border: 1px solid ${background2}}`;
      const cssColorUseBg1 = `${this.cssNamesColorUserBackground1}{color: ${background}!important}`;
      const extraBackground1 = `.ztext pre,.ztext code{background: ${background}!important;}`;
      const darkCtzButton = `.ctz-button{background: ${background2};border-color: ${color};color: ${color};}`;
      const addPrefix = (i) => i.split(",").map((i2) => `html[data-theme=dark] ${i2}`).join(",");
      const pageLearning = `.TopNavBar-fixMode-qXKMs,.index-tabWrap-4Smyx,.index-bannerItem-3o3D7,.LearningRouteCard-pathContent-j3jVv{background: ${background}!important;}.LearningRouteCard-pathItem-xin1f .LearningRouteCard-content-kw2RW .LearningRouteCard-title-do7ND{color: ${color}!important;}`;
      const menuTopBeforeAfter = `html[data-theme=dark] .ctz-menu-top>a.target::before,html[data-theme=dark] .ctz-menu-top>a.target::after{${this.menuBeforeAfter(
        background2
      )}}`;
      return addPrefix(
        this.doSetCSS(background, background2) + cssColor1 + cssCB2 + cssC2 + cssBorderB + cssDialogBorder + pageLearning + cssColorUseBg1 + cssColorLink + extraBackground1 + darkCtzButton
      ) + menuTopBeforeAfter;
    },
    light: function(lightKey) {
      const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
      const borderColor = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
      const nodeAppHeader = dom(".AppHeader");
      const nodeTopStoryC = dom(".Topstory>div:not(.Topstory-container)");
      const elementHC = nodeAppHeader ? nodeAppHeader.classList || [] : [];
      const haveTopAD = nodeTopStoryC && nodeTopStoryC.childElementCount;
      const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : "";
      const cssHeader = `${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : ".AppHeader"}{background-color:${background2}!important;background:${background2}!important;}`;
      const cssColorUseBg1 = `${this.cssNamesColorUserBackground1}{color: ${background}!important}`;
      const menuTopBeforeAfter = `.ctz-menu-top>a.target::before,.ctz-menu-top>a.target::after{${this.menuBeforeAfter(background2)}}`;
      return this.doSetCSS(background, background2) + borderColor + cssHeader + cssColorUseBg1 + menuTopBeforeAfter;
    },
    /** 设置字体颜色 */
    text: function() {
      const { colorText1 } = store.getConfig();
      const styleColorText1 = `.ContentItem-title, body{color: ${colorText1}!important;}`;
      return colorText1 ? styleColorText1 : "";
    },
    doSetCSS: function(background, background2) {
      const cssBg = `${this.cssNamesBackground1}{background-color: ${background}!important;}`;
      const cssBg2 = `${this.cssNamesBackground2}{background-color:${background2}!important;background:${background2}!important;}`;
      const cssBgTransparent = `${this.cssNamesBackgroundTransparent}{background-color: transparent!important;background: transparent!important;}`;
      const input = `.SignContainer-content input:-webkit-autofill{-webkit-box-shadow: inset 0 0 0 30px ${background2}!important;}`;
      return cssBg + cssBg2 + cssBgTransparent + input;
    },
    /** 使用背景色1的元素名称 */
    cssNamesBackground1: `#${ID_DIALOG},.ctz-content-right>div:nth-of-type(2n),.ctz-content-left>a:hover,.ctz-black-item,.ctz-block-words-content>span,body,.Input-wrapper,.toolbar-section button:hover,.VideoAnswerPlayer-stateBar,.skeleton,.Community-ContentLayout,.css-i9srcr,.css-i9srcr div,.css-127i0sx,.css-1wi7vwy,.css-1ta275q,.css-mk7s6o,.css-1o83xzo .section div,.PostItem,.Report-list tr:nth-child(odd),.LinkCard.new,.Post-content,.Post-content .ContentItem-actions,.Messages-newItem,.Modal-wrapper textarea,.New-RightCard-Outer-Dark,.WriteIndexLayout-main,.Messages-item:hover,.Menu-item.is-active,.css-djayhh,.css-5i468k,.css-1iazx5e div,.LiveDetailsPage-root-aLVPj,.WikiLanding,.GlobalSideBar-navLink:hover,.Popover-arrow:after,.Sticky button:hover,.Sticky button:hover div,.Sticky button:hover span,.Sticky a:hover,.Sticky a:hover button,.Sticky a:hover div,.Sticky a:hover span,.Sticky li:hover,.Popover-content button:hover,.css-1j8bif6>.css-11v6bw0,.css-1e1wubc,.css-1svx44c,.css-5d3bqp,.KfeCollection-IntroCard-newStyle-mobile,.KfeCollection-IntroCard-newStyle-pc,.FeeConsultCard,.Avatar,.TextMessage-sender,.ChatUserListItem--active,.css-yoby3j,.css-wmwsyx,.css-wmwsyx button`,
    /** 使用背景色2的元素名称 */
    cssNamesBackground2: `#CTZ_MAIN input,#CTZ_MAIN textarea,.${CLASS_MESSAGE},.ctz-content,.ctz-menu-top>a.target,.ctz-menu-top>a:hover span,#CTZ_OPEN_BUTTON,#CTZ_CLOSE_DIALOG:hover,.Card,.HotItem,.AppHeader,.Topstory-content>div,.PlaceHolder-inner,.PlaceHolder-bg,.ContentItem-actions,.QuestionHeader,.QuestionHeader-footer ,.QZcfWkCJoarhIYxlM_sG,.Sticky,.SearchTabs,.Modal-inner,.Modal-content,.Modal-content div,.Select-list button:active,.Select-list button:hover,.modal-dialog,.modal-dialog-buttons,.zh-profile-card div,.QuestionAnswers-answerAdd div,.css-1j23ebo,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 h1,.css-2lvw8d,.css-1os3m0m,.css-r38x5n div,.css-1mbpn2d,.css-1yjqd5z,.Creator-mainColumn .Card>div,.Creator-mainColumn section,.Topbar,.AutoInviteItem-wrapper--desktop,.ProfileHeader-wrapper,.NotificationList,.SettingsFAQ,.SelectorField-options .Select-option.is-selected,.SelectorField-options .Select-option:focus,.KfeCollection-PayModal-modal,.KfeCollection-PayModal-modal div,.Community,.Report-header th,.Report-list tr:nth-child(2n),.Report-Pagination,.CreatorIndex-BottomBox-Item,.ColumnPageHeader,.WriteIndexLayout-main>div,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.PostEditor-wrapper>div:last-of-type div,.Select-option:focus,.ToolsQuestion div,[role="tablist"],.Topic-bar,.List-item .ZVideoToolbar button,#AnswerFormPortalContainer div,.CreatorTable-tableHead,.BalanceTransactionList-Item,.utils-frostedGlassEffect-2unM,#feedLives,#feedLives div,#feedLives a,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.css-1o83xzo,.css-1o83xzo .section,.css-1cr4989,.css-xoei2t,.css-slqtjm,.css-1615dnb div,.css-1oqbvad,.css-1oqbvad div,.css-lxxesj div:not(.css-zprod5),.Card-card-2K6v,.Card-card-2K6v div,.LiveDetailsPage-root-aLVPj div,.LiveFooter-root-rXuoG,.css-1b0ypf8 div,.css-np3nxw div,.PubIndex-CategoriesHeader,.ColumnHomeColumnCard,.Home-tabs,.Home-tabs div,.Home-swiper-container,.Home-swiper-container div,.BottomBarContainer,.ResponderPage-root div,.WikiLandingItemCard,.WikiLandingEntryCard,._Invite_container_30SP,._Invite_container_30SP div,._Coupon_intro_1kIo,._Coupon_list_2uTb div,.ExploreHomePage-square div,.ExploreHomePage-ContentSection-moreButton a,.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreColumnCard,.Notification-white,.QuestionAnswers-answerAdd .InputLike,.QuestionAnswers-answerAdd .InputLike div,.InputLike,.Popover-content,.Notifications-footer,.Messages-footer,.Popover-arrow:after,.css-97fdvh>div,.SettingsMain>div div:not(.StickerItem-Border):not(.SettingsMain-sideColumn):not(.UserHeader-VipBtn):not(.UserHeader-VipTip):not(.css-60n72z div),.css-guh6n2,.css-yqosku,.css-kt4t4n,.css-1j8bif6>div,.css-nffy12:hover,.css-1eltcns,.css-9kvgnm,.css-jd7qm7,.css-19vq0tc,.css-rzwcnm,.css-1akh9z6,.ListShortcut>div:not(.Question-mainColumn),.Chat,.ActionMenu,.Recommendations-Main,.KfeCollection-PcCollegeCard-root,.signQr-container,.signQr-rightContainer>div,.Login-options,.Input-wrapper>input,.SignFlowInput-errorMask,.Topstory-container .TopstoryTabs>a::after,.ZVideo`,
    /** 背景色透明的元素名称 */
    cssNamesBackgroundTransparent: `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn,.css-3dzt4y,.css-u4sx7k,.VideoPlaceholderContainer>section,.MoreAnswers .List-headerText,.ColumnHomeTop:before,.ColumnHomeBottom,.Popover button,.ChatUserListItem .Chat-ActionMenuPopover-Button`,
    cssNamesColorUserBackground1: `.css-z0izby`,
    menuBeforeAfter: (color, size = "12px") => `background: radial-gradient(circle at top left, transparent ${size}, ${color} 0) top left,
  radial-gradient(circle at top right, transparent ${size}, ${color} 0) top right,
  radial-gradient(circle at bottom right, transparent ${size}, ${color} 0) bottom right,
  radial-gradient(circle at bottom left, transparent ${size}, ${color} 0) bottom left;
  background-size: 50% 50%;
  background-repeat: no-repeat;`
  };
  var myCustomStyle = {
    init: function() {
      const nodeCustomStyle = dom('[name="textStyleCustom"]');
      if (!nodeCustomStyle)
        return;
      const { customizeCss = "" } = store.getConfig();
      nodeCustomStyle.value = customizeCss;
      this.change(customizeCss);
    },
    change: (innerCus) => fnInitDomStyle("CTZ_STYLE_CUSTOM", innerCus)
  };
  var onUseThemeDark = () => {
    dom("html").setAttribute("data-theme", myBackground.isUseDark() ? "dark" : "light");
  };
  var loadFindTheme = () => {
    onUseThemeDark();
    const elementHTML = dom("html");
    const muConfig = { attribute: true, attributeFilter: ["data-theme"] };
    if (!elementHTML)
      return;
    const muCallback = function() {
      const themeName = elementHTML.getAttribute("data-theme");
      const isDark2 = myBackground.isUseDark();
      if (themeName === "dark" && !isDark2 || themeName === "light" && isDark2) {
        onUseThemeDark();
      }
    };
    const muObserver = new MutationObserver(muCallback);
    muObserver.observe(elementHTML, muConfig);
  };
  var loadBackground = () => {
    myBackground.init();
  };
  var isDark = () => {
    return myBackground.isUseDark();
  };
  var addBackgroundElements = () => {
    const nodeCTZBackground = domById("CTZ_BACKGROUND");
    const nodeLight = domById("CTZ_BACKGROUND_LIGHT");
    const nodeDark = domById("CTZ_BACKGROUND_DARK");
    if (!nodeCTZBackground || !nodeLight || !nodeDark)
      return;
    const themeInner = THEMES.map(
      ({ label, value, background, color }) => `<label><input class="${CLASS_INPUT_CLICK}" name="${INPUT_NAME_THEME}" type="radio" value="${value}"/><div style="background: ${background};color: ${color}">${label}</div></label>`
    ).join("");
    const themeLight = Object.keys(THEME_CONFIG_LIGHT).map((key) => {
      const { background, color, name } = THEME_CONFIG_LIGHT[key];
      return `<label><input class="${CLASS_INPUT_CLICK}" name="${INPUT_NAME_ThEME_LIGHT}" type="radio" value="${key}"/><div style="background: ${background};color: ${color}">${name}</div></label>`;
    }).join("");
    const themeDark = Object.keys(THEME_CONFIG_DARK).map((key) => {
      const { background, color, name } = THEME_CONFIG_DARK[key];
      return `<label><input class="${CLASS_INPUT_CLICK}" name="${INPUT_NAME_THEME_DARK}" type="radio" value="${key}"/><div style="background: ${background};color: ${color}">${name}</div></label>`;
    }).join("");
    nodeCTZBackground.innerHTML = themeInner;
    nodeLight.innerHTML = themeLight;
    nodeDark.innerHTML = themeDark;
  };
  var myLock = {
    append: function(e, name) {
      if (!e)
        return;
      const { getConfig } = store;
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
      const pfConfig = getConfig();
      e.querySelector(lock).onclick = async () => {
        await myStorage.setConfigItem(name + "Fixed", true);
        e.classList.remove(classRemove);
      };
      e.querySelector(unlock).onclick = async () => {
        await myStorage.setConfigItem(name + "Fixed", false);
        e.classList.add(classRemove);
      };
      if (pfConfig[name + "Fixed"] === false) {
        e.classList.add(classRemove);
      }
    },
    remove: function(e) {
      if (!e)
        return;
      const lock = this.lock.class;
      const unlock = this.unlock.class;
      const lockMask = this.lockMask.class;
      const nodeLock = e.querySelector(lock);
      const nodeUnlock = e.querySelector(unlock);
      const nodeLockMask = e.querySelector(lockMask);
      nodeLock && nodeLock.remove();
      nodeUnlock && nodeUnlock.remove();
      nodeLockMask && nodeLockMask.remove();
    },
    lock: { class: ".ctz-lock", name: "ctz-lock" },
    unlock: { class: ".ctz-unlock", name: "ctz-unlock" },
    lockMask: { class: ".ctz-lock-mask", name: "ctz-lock-mask" }
  };
  var myMove = {
    init: function(eventName, configName, name) {
      const e = dom(eventName);
      if (e) {
        this.clicks[configName] = e.click;
        e.onmousedown = (ev) => {
          const pfConfig = store.getConfig();
          if (pfConfig[`${name}Fixed`])
            return;
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
            const isR = this.useR.find((i) => i === name);
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
              await myStorage.setConfigItem(configName, `${isR ? `right: ${evenRight}px;` : `left: ${evenLeft}px;`}top: ${evenTop}px;`);
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
    // 使用left定位的name
    useR: ["suspensionUser"]
    // 使用right定位的name
  };
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
  var initVideoDownload = (nodeFound) => {
    const { videoUseLink } = store.getConfig();
    const domVideos = findDoms(
      nodeFound,
      [".ZVideo-player>div", CLASS_VIDEO_ONE, CLASS_VIDEO_TWO].filter((i) => {
        return videoUseLink ? !NEED_LINK_CLASS.includes(i) : true;
      })
    );
    for (let i = 0, len = domVideos.length; i < len; i++) {
      const domVideoBox = domVideos[i];
      const nDomDownload = domC("i", { className: "ctz-video-download", innerHTML: "⤓" });
      const nDomLoading = domC("i", { className: "ctz-loading", innerHTML: "↻" });
      nDomDownload.onclick = () => {
        const srcVideo = domVideoBox.querySelector("video").src;
        if (srcVideo) {
          nDomDownload.style.display = "none";
          domVideoBox.appendChild(nDomLoading);
          videoDownload(srcVideo, `video${+/* @__PURE__ */ new Date()}`).then(() => {
            nDomDownload.style.display = "block";
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
    init: function() {
      fnInitDomStyle(
        "CTZ_STYLE_VERSION",
        this.versionWidth() + this.vImgSize() + this.vQuestionTitleTag() + this.vSusHomeTab() + this.vSusHeader() + this.vFixedListMore() + this.vHighlightListItem() + this.vShoppingLink() + this.vFontSizeContent() + this.vListVideoSize() + this.vVideoLink()
      );
    },
    initAfterLoad: function() {
      const pfConfig = store.getConfig();
      domById("CTZ_IMAGE_SIZE_CUSTOM").style.display = pfConfig.zoomImageType === "2" ? "block" : "none";
      domById("CTZ_LIST_VIDEO_SIZE_CUSTOM").style.display = pfConfig.zoomListVideoType === "2" ? "block" : "none";
    },
    change: function() {
      this.initAfterLoad();
      this.init();
    },
    /** 页面内容宽度修改 */
    versionWidth: function() {
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
        versionArticlePercent
      } = store.getConfig();
      const widthHome = !versionHomeIsPercent ? `${versionHome || "1000"}px` : `${versionHomePercent || "70"}vw`;
      const widthAnswer = !versionAnswerIsPercent ? `${versionAnswer || "1000"}px` : `${versionAnswerPercent || "70"}vw`;
      const widthArticle = !versionArticleIsPercent ? `${versionArticle || "1000"}px` : `${versionArticlePercent || "70"}vw`;
      const rightArticleActions = !versionArticleIsPercent ? `calc(50vw - ${+(versionArticle || "1000") / 2 + 150}px)` : `calc(50vw - ${+(versionArticlePercent || "70") / 2}vw + 150px)`;
      const CLASS_MODAL = ".css-1aq8hf9";
      const sizeModalInAnswer = fnReturnStr(`${CLASS_MODAL}{width: ${widthAnswer}!important;}`, location.pathname.includes("question"));
      const sizeModal = fnReturnStr(
        `.Topstory-body ${CLASS_MODAL}{width: ${widthHome}!important;}` + sizeModalInAnswer + `.PostIndex-body ${CLASS_MODAL}{width: ${widthArticle}!important;}`,
        commitModalSizeSameVersion
      );
      const sizeHome = `.Topstory-mainColumn,.SearchMain{width: ${widthHome}!important;}.Topstory-container,.css-knqde,.Search-container{width: fit-content!important;}`;
      const sizeAnswer = `.Question-main .Question-mainColumn,.QuestionHeader-main{flex: 1;}.Question-main .Question-sideColumn{margin-left: 12px;}.QuestionHeader .QuestionHeader-content{margin: 0 auto;padding: 0;max-width: initial!important;}.Question-main,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content{width: ${widthAnswer}!important;}.Question-main .List-item{border-bottom: 1px dashed #ddd;}`;
      const sizeArticle = `.zhuanlan .AuthorInfo{max-width: initial;}.Post-NormalMain .Post-Header,.Post-NormalMain>div,.Post-NormalSub>div{width: ${widthArticle}!important;}.zhuanlan .Post-SideActions{right: ${rightArticleActions}}`;
      const sizeMinWidth = `.Topstory-mainColumn,.SearchMain,.Question-main,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content,.Post-NormalMain .Post-Header,.Post-NormalMain>div,.Post-NormalSub>div,${CLASS_MODAL},.Topstory-body ${CLASS_MODAL},.PostIndex-body ${CLASS_MODAL}{min-width: ${VERSION_MIN_WIDTH}px!important;}`;
      return sizeHome + sizeAnswer + sizeArticle + sizeModal + sizeMinWidth;
    },
    /** 图片尺寸修改 */
    vImgSize: function() {
      const pfConfig = store.getConfig();
      const nContent = fnReturnStr(
        `width: ${pfConfig.zoomImageSize}px!important;cursor: zoom-in!important;max-width: 100%!important;`,
        pfConfig.zoomImageType === "2"
      );
      return `.GifPlayer.isPlaying img {cursor:pointer!important;}img.lazy,img.origin_image,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image,.ztext figure .origin_image,.TitleImage{${nContent}}`;
    },
    /** 列表视频回答内容尺寸修改 */
    vListVideoSize: function() {
      const pfConfig = store.getConfig();
      return `.ZVideoItem>div:first-of-type{${fnReturnStr(`width: ${pfConfig.zoomListVideoSize}px!important;`, pfConfig.zoomListVideoType === "2")}}`;
    },
    /** 列表更多按钮移动至题目右侧 */
    vFixedListMore: function() {
      const pfConfig = store.getConfig();
      return fnReturnStr(
        `.Topstory-container .ContentItem-actions .ShareMenu ~ div.ContentItem-action{visibility: visible!important;position: absolute;top: 20px;right: 10px;}`,
        pfConfig.fixedListItemMore
      );
    },
    /** 内容标题添加类别显示 */
    vQuestionTitleTag: function() {
      const pfConfig = store.getConfig();
      const cssTag = "margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff";
      return fnReturnStr(
        `.AnswerItem .ContentItem-title::before{content:'问答';background:#ec7259}.TopstoryItem .PinItem::before{content:'想法';background:#9c27b0;${cssTag}}.PinItem>.ContentItem-title{margin-top:4px;}.ZvideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}.ZVideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}.ArticleItem .ContentItem-title::before{content:'文章';background:#00965e}.ContentItem .ContentItem-title::before{margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.TopstoryQuestionAskItem .ContentItem-title::before{content:'提问';background:#533b77}`,
        pfConfig.questionTitleTag
      );
    },
    /** 首页问题列表切换模块悬浮 */
    vSusHomeTab: function() {
      const pfConfig = store.getConfig();
      const { themeDark = 1 /* 深色护眼一 */, themeLight = 0 /* 默认 */ } = pfConfig;
      const background = isDark() ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background;
      return fnReturnStr(
        `.Topstory-container .TopstoryTabs{${pfConfig.suspensionHomeTabPo}position:fixed;z-index:100;display:flex;flex-direction:column;height:initial!important;}.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}.Topstory-container .TopstoryTabs>a::after{font-size:16px !important;display:inline-block;padding:6px 8px;margin-bottom:4px;border:1px solid #999999;color:#999999;background: ${background || "transparent"};}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link {margin:0!important}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after{color:#0066ff!important;border-color:#0066ff!important;}.Topstory [aria-controls='Topstory-recommend']::after{content:'推';}.Topstory [aria-controls='Topstory-follow']::after{content:'关';border-top-left-radius:4px;border-top-right-radius:4px;}.Topstory [aria-controls='Topstory-hot']::after{content:'热';}.Topstory [aria-controls="Topstory-zvideo"]::after{content:'视';border-bottom-left-radius:4px;border-bottom-right-radius:4px}.Topstory-tabs{border-color: transparent!important;}`,
        pfConfig.suspensionHomeTab
      );
    },
    /** 顶部三大块悬浮 */
    vSusHeader: function() {
      const pfConfig = store.getConfig();
      const { themeDark = 1 /* 深色护眼一 */, themeLight = 0 /* 默认 */ } = pfConfig;
      const background = isDark() ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background;
      return `.position-suspensionFind{${pfConfig.suspensionFindPo}}.position-suspensionUser{${pfConfig.suspensionUserPo}}.position-suspensionSearch{${pfConfig.suspensionSearchPo}}.position-suspensionFind .Tabs-link{border:1px solid #999999;color:#999999;background: ${background || "transparent"};}.position-suspensionFind .Tabs-link.is-active{color:#0066ff!important;border-color:#0066ff!important;}.position-suspensionUser .css-1m60na {display: none;}.position-suspensionUser .css-1n0eufo{margin-right: 0;}`;
    },
    /** 列表内容点击高亮边框 */
    vHighlightListItem: function() {
      const pfConfig = store.getConfig();
      return fnReturnStr(
        `.List-item:focus,.TopstoryItem:focus,.HotItem:focus{box-shadow:0 0 0 2px #fff,0 0 0 5px rgba(0, 102, 255, 0.3)!important;outline:none!important;transition:box-shadow 0.3s!important;}`,
        pfConfig.highlightListItem
      );
    },
    vShoppingLink: function() {
      const pfConfig = store.getConfig();
      const cssObj = {
        0: "",
        1: '.MCNLinkCard-imageContainer,.MCNLinkCard-button,.MCNLinkCard-source,.ecommerce-ad-commodity-img,.ecommerce-ad-commodity-box-icon,.RichText-MCNLinkCardContainer .BottomInfo,.CPSCommonCard-imageBox,.RedPacketCard-imageBox,.CPSCommonCard-tool,.CPSCommonCard-subtitle,.RedPacketCard-subtitle,.RedPacketCard-tool{display: none!important;}.MCNLinkCard,.MCNLinkCard-card,.ecommerce-ad-commodity,.RichText-MCNLinkCardContainer .GoodsRecommendCard,.CPSCommonCard,.RedPacketCard-info,.RedPacketCard{min-height: 0!important;background: transparent!important;width:100%!important;max-width:100%!important;}.MCNLinkCard-cardContainer,.ecommerce-ad-commodity,.ecommerce-ad-commodity-main,.RedPacketCard,.CPSCommonCard{padding: 0!important;}.MCNLinkCard,.MCNLinkCard-info{margin: 0!important;}.MCNLinkCard-info,.ecommerce-ad-commodity-main{flex-direction: row!important;}.MCNLinkCard-price{padding-left: 12px;}.ecommerce-ad-commodity-box .ecommerce-ad-commodity{height: auto!important;}.ecommerce-ad-commodity-box-main-second{width: auto!important;}.MCNLinkCard-titleContainer,.ecommerce-ad-commodity-main-content-des span,.CPSCommonCard-title,.RedPacketCard-title{color: #fd8d55!important;justify-content: start!important;}.MCNLinkCard-titleContainer::before,.ecommerce-ad-commodity-main-content-des span::before,.CPSCommonCard-title::before,.RedPacketCard-title::before{content: "购物链接："}.MCNLinkCard-title{color: #fd8d55!important;}',
        2: "a.MCNLinkCard,.RichText-ADLinkCardContainer,.ecommerce-ad-commodity-box,.ecommerce-ad-box,.RichText-MCNLinkCardContainer{display: none!important;}"
      };
      return cssObj[pfConfig.linkShopping || "0"];
    },
    vFontSizeContent: function() {
      const { fontSizeForList, fontSizeForAnswer, fontSizeForArticle, fontSizeForListTitle, fontSizeForAnswerTitle, fontSizeForArticleTitle } = store.getConfig();
      const list = `.Topstory-body .RichContent-inner,.Topstory-body .ctz-list-item-time,.Topstory-body .CommentContent,.SearchResult-Card .RichContent-inner,.SearchResult-Card .CommentContent,.HotItem-excerpt--multiLine{font-size: ${fontSizeForList}px!important;}`;
      const answer = `.Question-main .RichContent-inner,.Question-main .ctz-list-item-time,.Question-main .CommentContent{font-size: ${fontSizeForAnswer}px}`;
      const article = `.zhuanlan .Post-RichTextContainer,.zhuanlan .ctz-article-create-time,.zhuanlan .CommentContent{font-size: ${fontSizeForArticle}px}`;
      const articleTitle = `.zhuanlan .Post-Main .Post-Title{font-size: ${fontSizeForArticleTitle}px;}`;
      const listTitle = `.ContentItem-title,.HotItem-title{font-size: ${fontSizeForListTitle}px!important;}`;
      const answerTitle = `.QuestionHeader-title{font-size: ${fontSizeForAnswerTitle}px!important;}`;
      return list + answer + article + articleTitle + listTitle + answerTitle;
    },
    vVideoLink: () => {
      const { videoUseLink } = store.getConfig();
      return fnReturnStr(
        `${CLASS_VIDEO_ONE}>div,${CLASS_VIDEO_ONE}>i{display: none;}${CLASS_VIDEO_ONE}{padding: 0!important;height:24px!important;width: fit-content!important;}${CLASS_VIDEO_ONE}::before{content: '视频链接，点击跳转 >>';cursor:pointer;color: #1677ff}${CLASS_VIDEO_ONE}:hover::before{color: #b0b0b0}${CLASS_VIDEO_TWO}::before,${CLASS_VIDEO_TWO}>i{display: none;}`,
        videoUseLink
      );
    }
  };
  var suspensionPackUp = (elements) => {
    const RIGHT = 60;
    const { themeLight = 0 /* 默认 */, themeDark = 1 /* 深色护眼一 */ } = store.getConfig();
    for (let i = 0; i < elements.length; i++) {
      const even = elements[i];
      const evenPrev = i > 0 ? elements[i - 1] : null;
      const evenBottom = even.offsetTop + even.offsetHeight;
      const evenPrevBottom = evenPrev ? evenPrev.offsetTop + evenPrev.offsetHeight : 0;
      const hST = dom("html").scrollTop;
      const evenButton = even.querySelector(".ContentItem-actions .ContentItem-rightButton");
      if (!evenButton)
        continue;
      const needStyle = evenBottom > hST + window.innerHeight && evenPrevBottom < hST;
      evenButton.style.cssText = needStyle ? `visibility:visible!important;position: fixed!important;bottom: 60px;right: ${(document.body.offsetWidth - even.offsetWidth) / 2 + RIGHT}px;box-shadow: 0 1px 3px rgb(18 18 18 / 10%);height: 40px!important;padding: 0 12px!important;background: ${isDark() ? THEME_CONFIG_DARK[themeDark].background2 : THEME_CONFIG_LIGHT[themeLight][+themeLight !== 0 /* 默认 */ ? "background2" : "background"]}!important;` : "";
    }
  };
  var changeSuspensionTab = () => {
    const name = "suspensionHomeTab";
    const pfConfig = store.getConfig();
    cSuspensionStyle(name);
    const even = dom(".Topstory-container .TopstoryTabs");
    if (!even)
      return;
    pfConfig[name] ? myLock.append(even, name) : myLock.remove(even);
  };
  var cacheHeader = () => {
    const headerEventNames = ["suspensionFind", "suspensionSearch", "suspensionUser"];
    const { getFindEventItem, setFindEventItem, setStorageConfigItem, getStorageConfigItem, getConfig } = store;
    const pfConfig = getConfig();
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
          dom(classIcon).onclick = () => even.classList.add(classNameFocus);
          dom(classPickup).onclick = () => even.classList.remove(classNameFocus);
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
  var cSuspensionStyle = (name) => {
    const cssObj = {
      suspensionHomeTab: ".Topstory-container .TopstoryTabs",
      suspensionFind: ".AppHeader-Tabs",
      suspensionSearch: ".SearchBar",
      // 搜索框使用自己添加的元素
      suspensionUser: ".AppHeader-userInfo"
    };
    const nodeCTZName = dom(`.ctz-${name}`);
    const pfConfig = store.getConfig();
    nodeCTZName && (nodeCTZName.style.cssText = pfConfig[name] ? "display: inline-block;" : "display: none;");
    if (cssObj[name]) {
      pfConfig[name] ? myMove.init(cssObj[name], `${name}Po`, name) : myMove.destroy(cssObj[name]);
    }
  };
  var initData = () => {
    store.setStorageConfigItem("cacheTitle", document.title);
    echoData();
    cacheHeader();
    changeICO();
    changeTitle();
    changeSuspensionTab();
  };
  var initHistoryView = async () => {
    const { href, origin, pathname, hash } = location;
    const { getHistory } = store;
    const question = "www.zhihu.com/question/";
    const article = "zhuanlan.zhihu.com/p/";
    const video = "www.zhihu.com/zvideo/";
    let name = href.replace(hash, "");
    setTimeout(() => {
      if (!href.includes(question) && !href.includes(article) && !href.includes(video))
        return;
      href.includes(question) && dom('.QuestionPage [itemprop="name"]') && (name = dom('.QuestionPage [itemprop="name"]').content);
      href.includes(article) && dom(".Post-Title") && (name = dom(".Post-Title").innerText);
      href.includes(video) && dom(".ZVideo .ZVideo-title") && (name = dom(".ZVideo .ZVideo-title").innerText);
      const nA = `<a href="${origin + pathname}" target="_blank">${name}</a>`;
      const { view } = getHistory();
      if (!view.includes(nA)) {
        view.unshift(nA);
        myStorage.setHistoryItem("view", view);
      }
    }, 100);
  };
  var BASIC_SHOW_CONTENT = [
    { label: "去除热词点击搜索", value: "contentRemoveKeywordSearch" },
    {
      label: `<b>列表</b>标题类别显示<span class="ctz-label-tag ctz-label-tag-Answer">问答</span><span class="ctz-label-tag ctz-label-tag-Article">文章</span><span class="ctz-label-tag ctz-label-tag-ZVideo">视频</span><span class="ctz-label-tag ctz-label-tag-Pin">想法</span>`,
      value: "questionTitleTag"
    },
    { label: "<b>列表</b>更多「···」按钮移动到最右侧", value: "fixedListItemMore" },
    { label: "<b>列表</b>点击高亮边框", value: "highlightListItem" },
    { label: "<b>推荐列表</b>「不感兴趣」按钮", value: "listOutPutNotInterested", needFetch: true },
    { label: "<b>推荐列表</b>「直达问题」按钮", value: "listOutputToQuestion" },
    { label: "<b>关注列表</b>高亮原创内容", value: "highlightOriginal" },
    { label: "<b>推荐、关注列表</b>内容置顶发布时间和最后修改时间", value: "listItemCreatedAndModifiedTime" },
    { label: "赞同按钮仅显示数字", value: "justVoteNum" },
    { label: "评论按钮仅显示数字", value: "justCommitNum" },
    { label: "<b>问题详情</b>置顶创建时间和最后修改时间", value: "questionCreatedAndModifiedTime" },
    { label: "<b>回答</b>顶部显示赞同人数", value: "topVote" },
    { label: "<b>回答</b>一键获取回答链接", value: "copyAnswerLink" },
    { label: "<b>回答</b>置顶创建时间与最后修改时间", value: "answerItemCreatedAndModifiedTime" },
    { label: "<b>文章</b>发布时间置顶", value: "articleCreateTimeToTop" },
    { label: "<b>回答、文章</b>顶部显示导出当前内容/回答按钮", value: "topExportContent" },
    { label: "<b>回答、文章</b>中视频替换为链接", value: "videoUseLink" },
    { label: "<b>用户主页</b>内容置顶发布、修改时间", value: "userHomeContentTimeTop" },
    { label: "<b>用户主页</b>置顶「屏蔽用户」按钮", value: "userHomeTopBlockUser" }
  ];
  var ID_BLOCK_LIST = "CTZ-BLOCK-LIST";
  var myBlack = {
    messageCancel: "取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。",
    /** 初始化黑名单列表 */
    init: function() {
      const me = this;
      const elementBlock = domById(ID_BLOCK_LIST);
      if (!elementBlock)
        return;
      const { removeBlockUserContentList = [] } = store.getConfig();
      elementBlock.innerHTML = removeBlockUserContentList.map((i) => this.createItem(i)).join("");
      elementBlock.onclick = (event) => {
        const target = event.target;
        if (!target || !target.classList.contains(CLASS_REMOVE_BLOCK))
          return;
        const item = target.parentElement;
        const info = item.dataset.info ? JSON.parse(item.dataset.info) : {};
        confirm(me.messageCancel) && me.serviceRemove(info);
      };
    },
    /** 黑名单元素 */
    createItem: function(info) {
      return `<div class="ctz-black-item ctz-black-id-${info.id}" data-info='${JSON.stringify(info)}'>${this.createItemContent(info)}</div>`;
    },
    createItemContent: ({ id, name, avatar }) => {
      return `<img src="${avatar}"/><a href="/people/${id}" target="_blank">${name}</a><i class="${CLASS_REMOVE_BLOCK}" style="margin-left:4px;cursor:pointer;">✗</i>`;
    },
    /** 添加「屏蔽用户」按钮，第二个参数为监听方法对象 */
    addButton: function(event, objMy) {
      const me = this;
      const classBox = "ctz-block-box";
      const nodeBlockBox = event.querySelector(`.${classBox}`);
      if (nodeBlockBox)
        return;
      const nodeUser = event.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
      if (!nodeUser || !nodeUser.offsetHeight)
        return;
      const userUrl = nodeUser.querySelector('meta[itemprop="url"]').content;
      const userName = nodeUser.querySelector('meta[itemprop="name"]').content;
      const avatar = nodeUser.querySelector('meta[itemprop="image"]').content;
      const nodeAnswerItem = event.querySelector(".AnswerItem");
      const mo = nodeAnswerItem ? nodeAnswerItem.getAttribute("data-za-extra-module") || "{}" : "{}";
      if (!JSON.parse(mo).card)
        return;
      const aContent = JSON.parse(mo).card.content;
      const userId = aContent.author_member_hash_id || "";
      if (!userUrl.replace(/https:\/\/www.zhihu.com\/people\//, ""))
        return;
      const { removeBlockUserContentList = [] } = store.getConfig();
      const isAlreadyBlack = removeBlockUserContentList.findIndex((i) => i.id === userId) >= 0;
      const message2 = `是否要屏蔽${userName}？
屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。
如果开启了「不再显示已屏蔽用户发布的内容」那么也不会看到对方发布的回答`;
      const classBlack = "ctz-black";
      const classBlackRemove = "ctz-black-remove";
      const classBlackFilter = "ctz-black-filter";
      const classJustFilter = "ctz-just-filter";
      const createClass = (value) => `${value} ctz-button ctz-button-small ctz-button-transparent`;
      const innerHTML = isAlreadyBlack ? `<button class="${createClass(classBlackRemove)}">解除屏蔽</button>` + fnReturnStr(`<button class="${createClass(classJustFilter)}">隐藏该回答</button>`, !!objMy) : `<button class="${createClass(classBlack)}">屏蔽用户</button>` + fnReturnStr(`<button class="${createClass(classBlackFilter)}">屏蔽用户并隐藏该回答</button>`, !!objMy);
      const nodeBox = domC("div", { className: classBox, innerHTML });
      nodeBox.onclick = function(ev) {
        const target = ev.target;
        const matched = userUrl.match(/(?<=people\/)[\w\W]+/);
        const urlToken = matched ? matched[0] : "";
        if (target.classList.contains(classBlack)) {
          if (!confirm(message2))
            return;
          me.serviceAdd(urlToken, userName, userId, avatar);
          fnDomReplace(this.querySelector(`.${classBlackFilter}`), { className: createClass(classJustFilter), innerText: "隐藏该回答" });
          fnDomReplace(target, { className: createClass(classBlackRemove), innerText: "解除屏蔽" });
          return;
        }
        if (target.classList.contains(classBlackRemove)) {
          if (!confirm(me.messageCancel))
            return;
          me.serviceRemove({ urlToken, id: userId, name: userName });
          fnDomReplace(target, { className: createClass(classBlack), innerText: "屏蔽用户" });
          fnDomReplace(this.querySelector(`.${classJustFilter}`), {
            className: createClass(classBlackFilter),
            innerText: "屏蔽用户并隐藏该回答"
          });
          return;
        }
        if (target.classList.contains(classBlackFilter) || target.classList.contains(classJustFilter)) {
          if (target.classList.contains(classBlackFilter)) {
            if (!confirm(message2))
              return;
            me.serviceAdd(urlToken, userName, userId, avatar);
          }
          event.style.display = "none";
          if (objMy) {
            objMy.index = objMy.index - 1 > 0 ? objMy.index - 1 : 0;
          }
          return;
        }
      };
      nodeUser.appendChild(nodeBox);
    },
    /** 添加屏蔽用户 */
    addBlackItem: function(info) {
      const pfConfig = store.getConfig();
      const nL = pfConfig.removeBlockUserContentList || [];
      nL.push(info);
      myStorage.setConfigItem("removeBlockUserContentList", nL);
      const nodeBlackItem = domC("div", { className: `ctz-black-item ctz-black-id-${info.id}`, innerHTML: this.createItemContent(info) });
      nodeBlackItem.dataset.info = JSON.stringify(info);
      domById(ID_BLOCK_LIST).appendChild(nodeBlackItem);
    },
    /** 调用「屏蔽用户」接口 */
    serviceAdd: function(urlToken, userName, userId, avatar) {
      const me = this;
      const headers = this.getHeaders();
      fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
        method: "POST",
        headers: new Headers({
          ...headers,
          "x-xsrftoken": document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0] || ""
        }),
        credentials: "include"
      }).then(() => {
        me.addBlackItem({ id: userId, name: userName, avatar, userType: "people", urlToken });
      });
    },
    /** 解除拉黑用户接口 */
    serviceRemove: function(info) {
      const { urlToken, id } = info;
      const headers = this.getHeaders();
      fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
        method: "DELETE",
        headers: new Headers({
          ...headers,
          "x-xsrftoken": document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0] || ""
        }),
        credentials: "include"
      }).then(() => {
        const { getConfig } = store;
        const pfConfig = getConfig();
        const nL = pfConfig.removeBlockUserContentList || [];
        const itemIndex = nL.findIndex((i) => i.id === info.id);
        if (itemIndex >= 0) {
          nL.splice(itemIndex, 1);
          const removeItem = dom(`.ctz-black-id-${id}`);
          removeItem && removeItem.remove();
          myStorage.setConfigItem("removeBlockUserContentList", nL);
        }
      });
    },
    /** 同步黑名单列表 */
    sync: function(offset = 0, l = []) {
      const nodeList = domById(ID_BLOCK_LIST);
      !l.length && nodeList && (nodeList.innerHTML = "");
      fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
      const limit = 20;
      const headers = this.getHeaders();
      fetch(`https://www.zhihu.com/api/v3/settings/blocked_users?offset=${offset}&limit=${limit}`, {
        method: "GET",
        headers: new Headers(headers),
        credentials: "include"
      }).then((response) => response.json()).then(({ data, paging }) => {
        data.forEach(({ id, name, avatar_url, user_type, url_token }) => {
          l.push({ id, name, avatar: avatar_url, userType: user_type, urlToken: url_token });
        });
        if (!paging.is_end) {
          this.sync((offset + 1) * limit, l);
        } else {
          myStorage.setConfigItem("removeBlockUserContentList", l);
          myBlack.init();
          fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: "同步黑名单", disabled: false });
        }
      });
    },
    getHeaders: () => store.getStorageConfigItem("fetchHeaders")
  };
  var ID_FETCH_STATUS = "CTZ_FETCH_STATUS";
  var ID_FETCH_BUTTON = "CTZ_CHANGE_FETCH";
  var commitStatusTrue = '<b style="color: green;">已开启接口拦截</b>，如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截';
  var commitStatusFalse = '<b style="color: red;">已关闭接口拦截</b>，部分功能不可用';
  var buttonContentTrue = "关闭接口拦截";
  var buttonContentFalse = "开启接口拦截";
  var messageToTrue = "开启接口拦截，确认后将刷新页面。\n如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。";
  var messageToFalse = "关闭接口拦截，确认后将刷新页面。\n「黑名单设置；外置不感兴趣；快速屏蔽用户；回答、文章和收藏夹导出」功能将不可用。";
  var CLASS_OPERATE_INTERCEPT = "ctz-fetch-intercept";
  var CLASS_CLOSE_INTERCEPT = "ctz-fetch-intercept-close";
  var initFetchInterceptStatus = () => {
    const { fetchInterceptStatus } = store.getConfig();
    changeHTML(!!fetchInterceptStatus);
    domById(ID_FETCH_BUTTON).onclick = function() {
      if (confirm(fetchInterceptStatus ? messageToFalse : messageToTrue)) {
        myStorage.setConfigItem("fetchInterceptStatus", !fetchInterceptStatus);
        window.location.reload();
      }
    };
  };
  var changeHTML = (status) => {
    domById(ID_FETCH_STATUS).innerHTML = status ? commitStatusTrue : commitStatusFalse;
    domById(ID_FETCH_BUTTON).innerHTML = status ? buttonContentTrue : buttonContentFalse;
    if (!status) {
      domA(`.${CLASS_OPERATE_INTERCEPT}`).forEach((item) => {
        item.classList.add(CLASS_CLOSE_INTERCEPT);
        item.querySelectorAll("input").forEach((it) => {
          it.disabled = true;
        });
        item.querySelectorAll("button").forEach((it) => {
          it.disabled = true;
        });
      });
    }
  };
  var myMenu = {
    init: function() {
      const { hash } = location;
      const nodeMenuTop = dom(".ctz-menu-top");
      if (!nodeMenuTop)
        return;
      const chooseId = [...nodeMenuTop.children].map((i) => i.hash).find((i) => i === hash || hash.replace(i, "") !== hash);
      if (chooseId) {
        this.click({ target: dom(`a[href="${chooseId}"]`) });
        return;
      }
      this.click({ target: dom(`a[href="${HEADER[0].href}"]`) });
    },
    click: function({ target }) {
      const targetForA = target.tagName === "A" ? target : target.parentElement;
      if (!(targetForA.hash && targetForA.tagName === "A"))
        return;
      const isThis = targetForA.hash.replace(/#/, "");
      if (!isThis)
        return;
      const nodesA = domA(".ctz-menu-top>a");
      for (let i = 0, len = nodesA.length; i < len; i++) {
        const itemA = nodesA[i];
        itemA.classList.remove("target");
      }
      targetForA.classList.add("target");
      const nodesDiv = domA(".ctz-content>div");
      for (let i = 0, len = nodesDiv.length; i < len; i++) {
        const item = nodesDiv[i];
        item.style.display = isThis === item.id ? "flex" : "none";
      }
    }
  };
  var INNER_HTML = `<div id="CTZ_DIALOG_MAIN" style="display: none"><div class="ctz-header"><span>修改器</span><span class="ctz-version"></span><div class="ctz-top-operate"><span id="CTZ_FETCH_STATUS">状态获取中...</span><button class="ctz-button" id="CTZ_CHANGE_FETCH" size="small">切换接口拦截</button></div><button id="CTZ_CLOSE_DIALOG">✗</button></div><div class="ctz-center"><div class="ctz-menu-top"></div><div class="ctz-content"><div id="CTZ_BASIS" style="display: none"><div class="ctz-content-left"><a href="#CTZ_BASIS_DEFAULT">基本设置</a><a href="#CTZ_BASIS_SHOW_CONTENT">显示修改</a><a href="#CTZ_BASIS_SIZE">页面尺寸</a><a href="#CTZ_BASIS_FLOAT">悬浮模块</a><a href="#CTZ_BASIS_COLOR">颜色设置</a><a href="#CTZ_BASIS_CONFIG">配置操作</a></div><div class="ctz-content-right"><div id="CTZ_BASIS_DEFAULT"><div class="ctz-set-title"><span>基本设置</span></div><div class="ctz-set-content"><label class="ctz-flex-wrap"><span class="ctz-label">不显示修改器唤醒图标 ⚙︎</span><input class="ctz-i" name="hiddenOpenButton" type="checkbox" value="on" /></label><label class="ctz-flex-wrap"><span class="ctz-label">快捷键唤起编辑器<span class="key-shadow">></span>(<span class="key-shadow">Shift</span>+<span class="key-shadow">.</span>)</span><input class="ctz-i" name="hotKey" type="checkbox" value="on" /></label><div><div class="ctz-label">修改网页标题</div><div class="ctz-flex-wrap"><input type="text" name="globalTitle" style="width: 250px" /><button class="ctz-button" name="buttonConfirmTitle" style="margin: 0 4px">确认</button><button class="ctz-button" name="buttonResetTitle">还原</button></div></div><div><div class="ctz-label">修改网页标题图片（图标可能会因为网络问题丢失）</div><div class="ctz-flex-wrap" id="CTZ_TITLE_ICO"></div></div></div></div><div id="CTZ_BASIS_SHOW_CONTENT"><div class="ctz-set-title"><span>显示修改<span class="ctz-desc" style="color: red">修改后刷新页面生效</span></span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><span class="ctz-label">购物链接显示设置</span><label><input class="ctz-i" name="linkShopping" type="radio" value="0" />默认</label><label><input class="ctz-i" name="linkShopping" type="radio" value="1" />仅文字</label><label><input class="ctz-i" name="linkShopping" type="radio" value="2" />隐藏</label></div><div class="ctz-flex-wrap"><span class="ctz-label">回答内容展开/收起</span><label><input class="ctz-i" type="radio" name="answerOpen" value="" />知乎默认</label><label><input class="ctz-i" type="radio" name="answerOpen" value="on" />自动展开所有回答</label><label><input class="ctz-i" type="radio" name="answerOpen" value="off" />默认收起所有长回答</label></div></div></div><div id="CTZ_BASIS_SIZE"><div class="ctz-set-title"><span>页面尺寸</span></div><div class="ctz-set-content"><div id="CTZ_VERSION_RANGE_ZHIHU"></div><label class="ctz-flex-wrap"><span class="ctz-label">评论弹窗匹配页面宽度</span><input class="ctz-i" name="commitModalSizeSameVersion" type="checkbox" value="on" /></label><div id="CTZ_FONT_SIZE_IN_ZHIHU"></div><div><div class="ctz-flex-wrap"><div class="ctz-label">回答和文章图片尺寸</div><label><input class="ctz-i" name="zoomImageType" type="radio" value="0" />默认</label><label><input class="ctz-i" name="zoomImageType" type="radio" value="1" />原图</label><label><input class="ctz-i" name="zoomImageType" type="radio" value="2" />自定义</label></div><div id="CTZ_IMAGE_SIZE_CUSTOM" style="display: none"></div></div><label class="ctz-flex-wrap"><span class="ctz-label">使用弹窗打开动图</span><input class="ctz-i" name="showGIFinDialog" type="checkbox" value="on" /></label><div><div class="ctz-flex-wrap"><div class="ctz-label">列表视频回答的视频内容尺寸</div><label><input class="ctz-i" name="zoomListVideoType" type="radio" value="0" />默认</label><label><input class="ctz-i" name="zoomListVideoType" type="radio" value="2" />自定义</label></div><div id="CTZ_LIST_VIDEO_SIZE_CUSTOM"></div></div></div></div><div id="CTZ_BASIS_FLOAT"><div class="ctz-set-title"><span>悬浮模块</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><label><span class="ctz-label">回答内容「收起」按钮悬浮</span><input class="ctz-i" name="suspensionPickUp" type="checkbox" value="on" /></label></div><div><div class="ctz-label">信息模块悬浮</div><div class="ctz-commit">拖动悬浮模块定位位置</div><div class="ctz-commit">鼠标放置显示点击 ☒ 按钮即可拖动</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="suspensionHomeTab" type="checkbox" value="on" />首页列表切换</label><label><input class="ctz-i" name="suspensionFind" type="checkbox" value="on" />顶部发现模块</label><label><input class="ctz-i" name="suspensionUser" type="checkbox" value="on" />个人中心模块</label><label><input class="ctz-i" name="suspensionSearch" type="checkbox" value="on" />搜索栏模块</label></div></div></div></div><div id="CTZ_BASIS_COLOR"><div class="ctz-set-title"><span>颜色设置</span></div><div class="ctz-set-content"><div class="ctz-set-background"><div id="CTZ_BACKGROUND"></div><div class="ctz-commit">浅色颜色选择:</div><div id="CTZ_BACKGROUND_LIGHT"></div><div class="ctz-commit">深色颜色选择:</div><div id="CTZ_BACKGROUND_DARK"></div></div><div class="ctz-set-color ctz-flex-wrap"><div class="ctz-label">修改文字颜色（例: #f7f9f9）</div><input type="text" class="ctz-i" name="colorText1" style="width: 200px" /></div></div></div><div id="CTZ_BASIS_CONFIG"><div class="ctz-set-title"><span>配置操作</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><button class="ctz-button" name="useSimple">启用极简模式</button></div><div class="ctz-config-import-export"><div class="ctz-label">配置导出导入</div><div class="ctz-config-buttons"><button class="ctz-button" name="configExport">导出配置</button><button class="ctz-button" name="configReset">恢复默认配置</button></div><div style="display: flex"><textarea name="textConfigImport" placeholder="配置可参考导出格式"></textarea><button class="ctz-button" name="configImport">导 入</button></div></div><div class="ctz-customize-css"><div class="ctz-label">自定义样式</div><div style="display: flex"><textarea name="textStyleCustom" placeholder="格式为CSS"></textarea><button class="ctz-button" name="styleCustom">确 定</button></div></div></div></div></div></div><div id="CTZ_FILTER" style="display: none"><div class="ctz-content-left"><a href="#CTZ_FILTER_LIST">列表内容屏蔽</a><a href="#CTZ_FILTER_ANSWER">回答内容屏蔽</a></div><div class="ctz-content-right"><h5 class="ctz-alert-red">此部分更改后请重新刷新页面</h5><div id="CTZ_FILTER_LIST" class="ctz-filter-block"><div class="ctz-set-title">列表内容屏蔽</div><div class="ctz-set-content"><div><label style="display: flex; align-items: center"><span class="ctz-label">屏蔽顶部活动推广</span><input class="ctz-i" name="removeTopAD" type="checkbox" value="on" /></label></div><div class="ctz-filter-follow"><div class="ctz-label">关注列表关注人操作屏蔽</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeFollowVoteAnswer" type="checkbox" value="on" />赞同回答</label><label><input class="ctz-i" name="removeFollowVoteArticle" type="checkbox" value="on" />赞同文章</label><label><input class="ctz-i" name="removeFollowFQuestion" type="checkbox" value="on" />关注问题</label></div></div><div class="ctz-filter-me"><label style="display: flex; align-items: center"><span class="ctz-label">关注列表屏蔽自己的操作</span><input class="ctz-i" name="removeMyOperateAtFollow" type="checkbox" value="on" /></label></div><div class="ctz-filter-type"><div class="ctz-label">列表类别屏蔽</div><div class="ctz-commit" style="line-height: 22px">勾选后「关注、推荐、搜索」将屏蔽所勾选的类别内容</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeItemQuestionAsk" type="checkbox" value="on" />邀请回答</label><label><input class="ctz-i" name="removeItemAboutAD" type="checkbox" value="on" />商业推广</label><label><input class="ctz-i" name="removeItemAboutArticle" type="checkbox" value="on" />文章</label><label><input class="ctz-i" name="removeItemAboutVideo" type="checkbox" value="on" />视频</label><label><input class="ctz-i" name="removeItemAboutPin" type="checkbox" value="on" />想法</label></div></div><div class="ctz-filter-list-vote"><label style="display: flex; align-items: center"><span class="ctz-label">列表低赞内容屏蔽</span><input class="ctz-i" name="removeLessVote" type="checkbox" value="on" /></label><div style="font-size: 12px; color: #999; line-height: 22px">勾选后「关注、推荐、搜索」列表屏蔽点赞量少于<input name="lessVoteNumber" class="ctz-i-change" type="number" style="width: 100px; margin: 0 4px" />的内容</div></div></div></div><div id="CTZ_FILTER_ANSWER" class="ctz-filter-block"><div class="ctz-set-title">回答内容屏蔽</div><div class="ctz-set-content"><div class="ctz-filter-defail-who"><div class="ctz-label">屏蔽以下官方账号的回答</div><div style="margin: 4px 0; border-bottom: 1px solid #ebebeb; padding-bottom: 4px"><label><input class="ctz-i" name="removeZhihuOfficial" type="checkbox" value="on" />所有知乎官方账号</label></div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeStoryAnswer" type="checkbox" value="on" />故事档案局</label><label><input class="ctz-i" name="removeYanxuanAnswer" type="checkbox" value="on" />盐选科普</label><label><input class="ctz-i" name="removeYanxuanRecommend" type="checkbox" value="on" />盐选推荐</label><label><input class="ctz-i" name="removeYanxuanCPRecommend" type="checkbox" value="on" />盐选测评室</label></div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">屏蔽「匿名用户」回答</span><input class="ctz-i" name="removeAnonymousAnswer" type="checkbox" value="on" /></label></div><div class="ctz-filter-defail-tag"><div class="ctz-label">屏蔽带有以下标签的回答</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeFromYanxuan" type="checkbox" value="on" />选自盐选专栏</label><label><input class="ctz-i" name="removeUnrealAnswer" type="checkbox" value="on" />带有虚构创作</label><label><input class="ctz-i" name="removeFromEBook" type="checkbox" value="on" />选自电子书</label></div></div><div class="ctz-filter-detail-vote"><label style="display: flex; align-items: center"><span class="ctz-label">回答内容低赞回答屏蔽</span><input class="ctz-i" name="removeLessVoteDetail" type="checkbox" value="on" /></label><div style="font-size: 12px; color: #999; line-height: 22px">勾选后问题详情页将屏蔽点赞量少于<input name="lessVoteNumberDetail" class="ctz-i-change" type="number" style="width: 100px; margin: 0 4px" />的回答</div></div></div></div></div></div><div id="CTZ_HIDDEN" style="display: none"></div><div id="CTZ_BLOCK_WORD" style="display: none"><div class="ctz-content-left"><a href="#CTZ_BLOCK_WORD_LIST">标题屏蔽词</a><a href="#CTZ_BLOCK_WORD_CONTENT">内容屏蔽词</a></div><div class="ctz-content-right"><div id="CTZ_BLOCK_WORD_LIST"><div class="ctz-set-title"><span>标题屏蔽词</span><span class="ctz-desc">匹配位置：「关注页、推荐页」列表<b>标题</b></span></div><input name="inputFilterWord" type="text" placeholder="输入后回车或失去焦点（不区分大小写）" class="input-block-words" /><div class="ctz-block-words-content"></div></div><div id="CTZ_BLOCK_WORD_CONTENT"><div class="ctz-set-title"><span>内容屏蔽词</span><span class="ctz-desc">匹配位置：「关注页、推荐页」列表<b>内容</b>，回答页<b>回答内容</b></span></div><input name="inputBlockWordsAnswer" type="text" placeholder="输入后回车或失去焦点（不区分大小写）" class="input-block-words" /><div class="ctz-block-words-content"></div></div></div></div><div id="CTZ_BLACKLIST" style="display: none"><div class="ctz-content-left"><a href="#CTZ_BASIS_BLOCK">黑名单设置</a></div><div class="ctz-content-right ctz-fetch-intercept"><h5 class="ctz-alert-red ctz-need-fetch">接口拦截已关闭，此部分功能无法使用</h5><div id="CTZ_BASIS_BLOCK"><div class="ctz-set-title"><span>黑名单设置</span></div><div class="ctz-set-content"><button id="CTZ-BUTTON-SYNC-BLOCK" name="syncBlack" class="ctz-button">同步黑名单</button><label class="ctz-flex-wrap"><span class="ctz-label">回答列表用户名后显示「屏蔽用户」按钮</span><input class="ctz-i" name="showBlockUser" type="checkbox" value="on" /></label><label class="ctz-flex-wrap"><span class="ctz-label">屏蔽黑名单用户发布的内容</span><input class="ctz-i" name="removeBlockUserContent" type="checkbox" value="on" /></label><div><div class="ctz-label">黑名单列表</div><div id="CTZ-BLOCK-LIST"></div></div></div></div></div></div><div id="CTZ_HISTORY" style="display: none"><div class="ctz-content-left"><a href="#CTZ_HISTORY_LIST">推荐列表缓存</a><a href="#CTZ_HISTORY_VIEW">浏览历史记录</a></div><div class="ctz-content-right"><div id="CTZ_HISTORY_LIST"><div class="ctz-set-title"><span>推荐列表缓存<span class="ctz-desc">最多缓存500条，包含已过滤项</span></span></div><button class="ctz-button" name="button_history_clear" data-id="list">清空推荐列表缓存</button><div class="ctz-set-content"></div></div><div id="CTZ_HISTORY_VIEW"><div class="ctz-set-title"><span>浏览历史记录<span class="ctz-desc">最多缓存500条</span></span></div><button class="ctz-button" name="button_history_clear" data-id="view">清空浏览历史记录</button><div class="ctz-set-content"></div></div></div></div><div id="CTZ_DEFAULT" style="display: none"><div class="ctz-content-left"><a href="#CTZ_DEFAULT_CONTENT">默认功能</a></div><div class="ctz-content-right"><div id="CTZ_DEFAULT_CONTENT"><div class="ctz-set-title"><span>默认功能<span class="ctz-desc">此部分功能为编辑器默认功能，不需要额外开启</span></span></div><div class="ctz-set-content"><div id="CTZ_DEFAULT_SELF"></div><div class="ctz-zhihu-self"><div class="ctz-zhihu-key">更加方便的浏览，按<span class="key-shadow">?</span>（<span class="key-shadow">Shift</span>+<span class="key-shadow">/</span>） 查看所有快捷键。<a href="/settings/preference" target="_blank">前往开启快捷键功能</a></div></div></div></div></div></div></div></div><div class="ctz-footer"><div class="ctz-footer-left"></div><div class="ctz-footer-right"></div></div></div><div id="CTZ_OPEN_BUTTON">⚙︎</div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_IMAGE"><div><img src="" /></div></div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_VIDEO"><div><video src="" autoplay loop></video></div></div><iframe class="ctz-pdf-box-content" style="display: none"></iframe><div id="CTZ_MESSAGE_BOX"></div>`;
  var INNER_CSS = `.hover-style{cursor:pointer}.hover-style:hover{color:#1677ff !important}.ctz-button{outline:none;position:relative;display:inline-block;font-weight:400;white-space:nowrap;text-align:center;border:1px solid transparent;cursor:pointer;transition:all .3s;user-select:none;touch-action:manipulation;line-height:1.5;font-size:14px;height:32px;padding:4px 15px;border-radius:6px;background-color:#ffffff;border-color:#d9d9d9;color:rgba(0,0,0,0.88);box-shadow:0 2px 0 rgba(0,0,0,0.02)}.ctz-button:hover{color:#1677ff;border-color:#1677ff}.ctz-button:active{background:rgba(0,0,0,0.08) !important}.ctz-button[size='small'],.ctz-button.ctz-button-small{padding:2px 6px;font-size:12px;height:24px}.ctz-button.ctz-button-transparent{background:transparent}.ctz-button-red{color:#e55353 !important;border:1px solid #e55353 !important}.ctz-button-red:hover{color:#ec7259 !important;border:1px solid #ec7259 !important}.ctz-button:disabled{border-color:#d0d0d0;background-color:rgba(0,0,0,0.08);color:#b0b0b0;cursor:not-allowed}.Profile-mainColumn,.Collections-mainColumn{flex:1}#root .css-1liaddi{margin-right:0}.ContentItem-title div{display:inline}.css-1acwmmj:empty{display:none !important}.css-hr0k1l::after{content:'点击键盘左、右按键切换图片';position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#fff}#CTZ_OPEN_BUTTON{position:fixed;left:0;top:100px;font-size:48px;color:rgba(0,0,0,0.8);height:48px;line-height:42px;text-align:center;width:48px;border-radius:0 12px 12px 0;background:#f5f5f5;box-shadow:0 0 8px #d0d4d6,0 0 8px #e6eaec;cursor:pointer;user-select:none;transform:translate(-30px);transition:transform .5s;z-index:200}#CTZ_OPEN_BUTTON:hover{transform:translate(0)}#CTZ_DIALOG_MAIN{position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);width:800px;height:600px;border-radius:12px;box-shadow:0 6px 16px 0 rgba(0,0,0,0.08),0 3px 6px -4px rgba(0,0,0,0.12),0 9px 28px 8px rgba(0,0,0,0.05);background:#f5f5f5;z-index:201;flex-direction:column;font-size:14px;padding:16px;transition:all .2s}#CTZ_DIALOG_MAIN input[type='text'],#CTZ_DIALOG_MAIN input[type='number']{box-sizing:border-box;margin:0;padding:4px 11px;font-size:14px;line-height:1.5;list-style:none;position:relative;display:inline-block;min-width:0;border-width:1px;border-style:solid;border-color:#d9d9d9;border-radius:6px;transition:all .2s}#CTZ_DIALOG_MAIN textarea{box-sizing:border-box;margin:0;padding:4px 11px;font-size:14px;line-height:1.5;list-style:none;position:relative;display:inline-block;min-width:0;border-width:1px;border-style:solid;border-color:#d9d9d9;border-radius:6px;transition:all .2s}#CTZ_DIALOG_MAIN label{cursor:pointer;transition:all .2s}#CTZ_DIALOG_MAIN label:hover{color:#1677ff !important}#CTZ_DIALOG_MAIN a{transition:all .2s;text-decoration:none;color:inherit}.ctz-center{flex:1;flex-direction:column;display:flex;overflow:hidden}.ctz-header{font-size:16px;margin-bottom:12px;display:flex;align-items:center}.ctz-top-operate{flex:1;padding:0 8px;font-size:12px}#CTZ_FETCH_STATUS{padding-right:8px;font-weight:bold}.ctz-version{padding-left:8px;font-size:12px}#CTZ_CLOSE_DIALOG{color:rgba(0,0,0,0.45);font-weight:600;line-height:18px;background:transparent;border-radius:6px;width:22px;height:22px;transition:all .2s}#CTZ_CLOSE_DIALOG i{font-size:8px}#CTZ_CLOSE_DIALOG:hover{background-color:#fff;text-decoration:none}.ctz-menu-top{height:36px;display:flex}.ctz-menu-top>a{border-radius:12px 12px 0 0;flex:1;text-align:center;cursor:pointer;transition:initial !important;position:relative;display:flex;align-items:center;justify-content:center}.ctz-menu-top>a span{border-radius:8px;transition:all .3s;margin:0 6px;flex:1;box-sizing:border-box;align-items:center;line-height:26px}.ctz-menu-top>a:hover span{background:#fff}.ctz-menu-top>a.target{background:#fff}.ctz-menu-top>a.target::after,.ctz-menu-top>a.target::before{position:absolute;bottom:-12px;content:' ';background:radial-gradient(circle at top left, transparent 12px, #fff 0) top left,radial-gradient(circle at top right, transparent 12px, #fff 0) top right,radial-gradient(circle at bottom right, transparent 12px, #fff 0) bottom right,radial-gradient(circle at bottom left, transparent 12px, #fff 0) bottom left;background-size:50% 50%;background-repeat:no-repeat;width:24px;height:24px}.ctz-menu-top>a.target::before{left:-12px;z-index:-1}.ctz-menu-top>a.target::after{right:-12px;z-index:-1}.ctz-content{flex:1;display:flex;overflow:hidden;background:#fff;border-radius:12px;padding:8px 0}.ctz-content>div{width:100%}.ctz-content ::-webkit-scrollbar{width:8px;height:8px}.ctz-content ::-webkit-scrollbar-track{border-radius:0}.ctz-content ::-webkit-scrollbar-thumb{background:#bbb;transition:all .2s;border-radius:8px}.ctz-content ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.ctz-content-left{width:130px;border-right:1px solid #e0e0e0}.ctz-content-left a{transition:all .2s;margin:2px 5px;height:40px;line-height:40px;display:block;font-size:14px;border-radius:12px;padding-left:24px}.ctz-content-left a:hover{background:#f5f5f5}.ctz-content-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 8px}.ctz-content-right>div:nth-of-type(2n){padding:0 8px;margin:0 -8px;box-shadow:#999 0 0 5px inset;border-radius:0 12px 12px 0}.ctz-set-title{font-weight:bold;height:36px;line-height:36px;font-size:16px;overflow:hidden;vertical-align:middle}.ctz-set-title>span{vertical-align:middle;display:inline-block}.ctz-set-content:not(.ctz-flex-wrap)>div,.ctz-set-content:not(.ctz-flex-wrap)>label{padding-bottom:8px;margin-bottom:8px;border-bottom:1px dashed #ddd}.ctz-set-content:not(.ctz-flex-wrap)>div:last-child,.ctz-set-content:not(.ctz-flex-wrap)>label:last-child{border-bottom:0}.ctz-footer{display:flex;align-items:end;font-size:14px;margin-top:12px}.ctz-footer a{margin-right:16px;cursor:pointer}.ctz-footer a:hover{color:#1677ff !important}.ctz-footer-left{flex:1}.ctz-dark{display:flex;height:28px;align-items:center}.ctz-desc,.ctz-commit{font-size:12px;color:#999}.ctz-desc b,.ctz-commit b{color:#e55353}.ctz-desc{padding-left:4px}.ctz-alert-red{text-align:center;font-size:14px;color:#e55353;height:24px;line-height:24px;background-color:#fff2f0;border:1px solid #ffccc7;border-radius:12px;margin:0;font-weight:400}.ctz-label{font-size:14px;line-height:24px}.ctz-label::after{content:'：'}#CTZ_BACKGROUND,#CTZ_BACKGROUND_LIGHT,#CTZ_BACKGROUND_DARK{display:grid;grid-template-columns:30% 30% 30%;gap:8px}#CTZ_BACKGROUND>label,#CTZ_BACKGROUND_LIGHT>label,#CTZ_BACKGROUND_DARK>label{position:relative}#CTZ_BACKGROUND>label input,#CTZ_BACKGROUND_LIGHT>label input,#CTZ_BACKGROUND_DARK>label input{position:absolute;visibility:hidden}#CTZ_BACKGROUND>label input:checked+div,#CTZ_BACKGROUND_LIGHT>label input:checked+div,#CTZ_BACKGROUND_DARK>label input:checked+div{border:4px solid #1677ff;margin:0 !important}#CTZ_BACKGROUND>label div,#CTZ_BACKGROUND_LIGHT>label div,#CTZ_BACKGROUND_DARK>label div{font-size:14px;border-radius:12px;line-height:50px;padding-left:30px;margin:4px}#CTZ_BACKGROUND_LIGHT{color:#000}.ctz-set-background .ctz-commit{line-height:24px;font-size:14px}#CTZ_BASIS_CONFIG .ctz-config-buttons{padding:8px 0}#CTZ_BASIS_CONFIG .ctz-config-buttons button{margin-right:8px}#CTZ_BASIS_CONFIG textarea{margin-right:8px;flex:1}#CTZ_BLOCK_WORD .ctz-content-right>div{padding-bottom:12px}#CTZ_BLOCK_WORD input{height:24px;width:300px;margin:4px 0;width:100%}.ctz-block-words-content{display:flex;flex-wrap:wrap;cursor:default}.ctz-block-words-content>span{padding:2px 8px;border-radius:4px;font-size:12px;background:#fafafa;border:1px solid #d9d9d9;margin:4px 4px 0 0;display:flex;align-items:center}.ctz-block-words-content>span>i{margin-left:2px;cursor:pointer}.ctz-block-words-content>span>i:hover{color:#1677ff !important}.ctz-flex-wrap{display:flex;flex-wrap:wrap;line-height:24px}.ctz-flex-wrap label{margin-right:4px;display:flex;align-items:center}.ctz-flex-wrap label input[type='radio']{margin:0 4px 0 0}.ctz-video-download,.ctz-loading{position:absolute;top:20px;left:20px;font-size:24px;color:rgba(255,255,255,0.9);cursor:pointer}.ctz-loading{animation:loadingAnimation 2s infinite}@keyframes loadingAnimation{from{transform:rotate(0)}to{transform:rotate(360deg)}}#CTZ-BLOCK-LIST{display:flex;flex-wrap:wrap;margin:0 -8px;padding:8px}.ctz-black-item{height:30px;line-height:30px;box-sizing:content-box;padding:4px 8px;margin:0 8px 8px 0;display:flex;align-items:center;background:#fff;border-radius:8px;border:1px solid #e0e0e0}.ctz-black-item img{width:30px;height:30px;margin-right:4px}.ctz-black-item .ctz-remove-block:hover,.ctz-black-item a:hover{color:#1677ff;transition:all .2s}.ctz-black-item .ctz-remove-block{width:30px;height:30px;text-align:center;border-radius:8px}.ctz-black-item .ctz-remove-block:hover{background:#d9d9d9}.ctz-block-box>button,.ctz-button-block{margin-left:8px}.ctz-preview{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;overflow-y:auto;z-index:200;background-color:rgba(18,18,18,0.4)}.ctz-preview div{display:flex;justify-content:center;align-items:center;min-height:100%;width:100%}.ctz-preview div img{cursor:zoom-out;user-select:none}#CTZ_TITLE_ICO label{margin:0 4px 4px 0}#CTZ_TITLE_ICO label input{display:none}#CTZ_TITLE_ICO label input:checked+img{border:4px solid #0461cf;border-radius:12px}#CTZ_TITLE_ICO label img{width:40px;height:40px;border:4px solid transparent}.ctz-label-tag{font-weight:normal;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff;margin:0 2px}.ctz-label-tag-Answer{background:#ec7259}.ctz-label-tag-ZVideo{background:#12c2e9}.ctz-label-tag-Article{background:#00965e}.ctz-label-tag-Pin{background:#9c27b0}.ctz-question-time{color:#999 !important;font-size:14px !important;font-weight:normal !important;line-height:24px}.ctz-stop-scroll{height:100% !important;overflow:hidden !important}#CTZ_DEFAULT_SELF>div{line-height:24px;margin-bottom:4px}#CTZ_DEFAULT_SELF>div .ctz-commit{font-weight:normal}#CTZ_DEFAULT_SELF>div a{color:#1677ff}#CTZ_DEFAULT_SELF>div a:hover{color:#bbb}.ctz-export-collection-box{float:right;text-align:right}.ctz-export-collection-box button{font-size:16px}.ctz-export-collection-box p{font-size:14px;color:#666;margin:4px 0}.ctz-pdf-dialog-item{padding:12px;border-bottom:1px solid #eee;margin:12px;background:#ffffff}.ctz-pdf-dialog-title{margin:0 0 1.4em;font-size:20px;font-weight:bold}.ctz-pdf-box-content{width:100%;background:#ffffff}.ctz-pdf-view{width:100%;background:#ffffff;word-break:break-all;white-space:pre-wrap;font-size:14px;overflow-x:hidden}.ctz-pdf-view a{color:#0066ff}.ctz-pdf-view img{max-width:100%}.ctz-pdf-view p{margin:1.4em 0}.ctz-unlock,.ctz-lock,.ctz-lock-mask{display:none;color:#999;cursor:pointer}.ctz-unlock,.ctz-lock{margin:4px}.ctz-lock-mask{position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:198}.position-suspensionSearch,.position-suspensionFind,.position-suspensionUser{position:fixed;z-index:100}.position-suspensionSearch:hover .ctz-unlock,.position-suspensionFind:hover .ctz-unlock,.position-suspensionUser:hover .ctz-unlock,.Topstory-container .TopstoryTabs:hover .ctz-unlock{display:block}.position-suspensionSearch.ctz-move-this .ctz-unlock,.position-suspensionFind.ctz-move-this .ctz-unlock,.position-suspensionUser.ctz-move-this .ctz-unlock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-unlock{display:none !important}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock,.position-suspensionSearch.ctz-move-this .ctz-lock-mask,.position-suspensionFind.ctz-move-this .ctz-lock-mask,.position-suspensionUser.ctz-move-this .ctz-lock-mask,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock-mask{display:block}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock{z-index:199;color:#cccccc}.position-suspensionFind{display:flex;flex-direction:column;margin:0 !important}.position-suspensionFind .Tabs-item{padding:0 !important;margin-bottom:4px}.position-suspensionFind .Tabs-item .Tabs-link{padding:8px !important;border-radius:4px}.position-suspensionFind .Tabs-item .Tabs-link::after{content:'' !important;display:none !important}.position-suspensionUser{width:fit-content !important;margin:0 !important;display:flex;flex-direction:column}.position-suspensionUser .AppHeader-messages,.position-suspensionUser .AppHeader-notifications,.position-suspensionUser .css-18vqx7l{margin-right:0 !important;margin-bottom:12px}.position-suspensionUser .AppHeader-login,.position-suspensionUser .AppHeader-login~button{display:none}.position-suspensionSearch{line-height:30px;border-radius:16px;width:20px;transition:width .5s}.position-suspensionSearch .ctz-search-icon{font-size:24px;transform:rotate(-60deg)}.position-suspensionSearch .SearchBar-input-focus .ctz-search-pick-up{display:none}.position-suspensionSearch.focus{width:300px}.position-suspensionSearch.focus>form,.position-suspensionSearch.focus>button,.position-suspensionSearch.focus .ctz-search-pick-up{display:block}.position-suspensionSearch.focus .ctz-search-icon{display:none}.position-suspensionSearch.focus:hover{width:324px}.position-suspensionSearch .ctz-search-icon,.position-suspensionSearch .ctz-search-pick-up{cursor:pointer;color:#0066ff}.position-suspensionSearch .ctz-search-icon:hover,.position-suspensionSearch .ctz-search-pick-up:hover{color:#005ce6}.position-suspensionSearch .ctz-search-pick-up{font-size:24px;margin-left:4px}.position-suspensionSearch>form,.position-suspensionSearch>button,.position-suspensionSearch .ctz-search-pick-up{display:none}.position-suspensionSearch .ctz-search-icon{display:block}.key-shadow{border:1px solid #e0e0e0;border-radius:4px;box-shadow:rgba(0,0,0,0.06) 0 1px 1px 0;font-weight:600;min-width:26px;height:26px;padding:0px 6px;text-align:center}#CTZ_HISTORY_LIST .ctz-set-content a,#CTZ_HISTORY_VIEW .ctz-set-content a{cursor:pointer;word-break:break-all;display:block;margin-bottom:4px;padding:6px 12px;border:1px solid #ccc;border-radius:4px}#CTZ_HISTORY_LIST .ctz-set-content a:hover,#CTZ_HISTORY_VIEW .ctz-set-content a:hover{color:#1677ff !important}#CTZ_HISTORY_LIST .ctz-set-content a:hover,#CTZ_HISTORY_VIEW .ctz-set-content a:hover{border-color:#1677ff}[name='button_history_clear'],[name='button_history_clear'],#CTZ-BUTTON-SYNC-BLOCK{min-width:88px;margin-bottom:8px}[name='button_history_clear'] i,[name='button_history_clear'] i,#CTZ-BUTTON-SYNC-BLOCK i{top:0px;left:28px;color:#909090}.ctz-zhihu-key a{color:#1677ff !important}.ctz-zhihu-key a:hover{color:#bbb !important}.ctz-video-link{border:1px solid #ccc;display:inline-block;height:98px;width:fit-content;border-radius:4px;box-sizing:border-box;overflow:hidden;transition:all .3s}.ctz-video-link img{width:98px;height:98px;vertical-align:bottom}.ctz-video-link span{padding:4px 12px;display:inline-block}.ctz-video-link:hover{border-color:#005ce6;color:#005ce6}#CTZ_VERSION_RANGE_ZHIHU,#CTZ_FONT_SIZE_IN_ZHIHU{padding-bottom:0}#CTZ_VERSION_RANGE_ZHIHU>div,#CTZ_FONT_SIZE_IN_ZHIHU>div{align-items:center;margin-bottom:8px}.ctz-fetch-intercept .ctz-need-fetch{display:none}.ctz-fetch-intercept.ctz-fetch-intercept-close{color:#b0b0b0 !important;cursor:not-allowed}.ctz-fetch-intercept.ctz-fetch-intercept-close span.ctz-need-fetch{display:inline}.ctz-fetch-intercept.ctz-fetch-intercept-close div.ctz-need-fetch{display:block}.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-remove-block{cursor:not-allowed !important}.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-black-item .ctz-remove-block:hover,.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-black-item a:hover{background:transparent !important;color:#b0b0b0 !important}#CTZ_MESSAGE_BOX{position:fixed;left:0;top:10px;width:100%;z-index:999}.ctz-message{margin:0 auto;width:500px;height:48px;display:flex;align-items:center;justify-content:center;font-size:14px;border-radius:8px;box-shadow:0 0 8px #d0d4d6,0 0 8px #e6eaec;margin-bottom:12px;background:#fff}`;
  var createHiddenItem = (arrHidden) => {
    if (!arrHidden || !arrHidden.length)
      return;
    const itemLabel = (item = []) => {
      return item.map(
        ({ label, value }) => `<label style="display: inline-flex; algin-item: center;"><input class="ctz-i" name="${value}" type="checkbox" value="on" />` + label + `</label>`
      ).join("") + `<br>`;
    };
    return `<div class="ctz-set-content">${arrHidden.map((i) => itemLabel(i)).join("")}</div>`;
  };
  var initInputRange = () => {
    const createRangeInnerHTML = (label, value, min, max) => `<div class="ctz-flex-wrap ctz-range-${value}">${label ? `<div class="ctz-label">${label}</div>` : ""}<input class="ctz-i" type="range" min="${min}" max="${max}" name="${value}" style="width: 300px" /><span id="${value}" style="margin: 0 8px">0</span><span class="ctz-commit">滑动条范围: ${min} ~ ${max}</span></div>`;
    const versionCallback = (item, index) => {
      return createRangeInnerHTML(item.label, item.value, item.min, item.max) + createRangeInnerHTML(item.percentLabel, item.percentValue, item.percentMin, item.percentMax) + `<label class="ctz-flex-wrap"><span class="ctz-label">${item.percentChooseLabel}</span><input class="ctz-i" name="${item.percentChooseValue}" type="checkbox" value="on" /></label><div class="ctz-commit" style="${index < VERSION_RANGE.length - 1 ? "border-bottom: 1px solid #e0e0e0;" : "margin:0;"}padding:8px 0;"><b>${item.desc}</b></div>`;
    };
    domById("CTZ_VERSION_RANGE_ZHIHU").innerHTML = VERSION_RANGE.map(versionCallback).join("");
    domById("CTZ_IMAGE_SIZE_CUSTOM").innerHTML = createRangeInnerHTML("", "zoomImageSize", 0, 1e3);
    domById("CTZ_LIST_VIDEO_SIZE_CUSTOM").innerHTML = createRangeInnerHTML("", "zoomListVideoSize", 0, 1e3);
  };
  var initHTML = () => {
    const { getUserinfo } = store;
    document.body.appendChild(domC("div", { id: "CTZ_MAIN", innerHTML: INNER_HTML }));
    dom(".ctz-version").innerText = `version: ${GM_info.script.version}`;
    dom(".ctz-footer-left").innerHTML = FOOTER_HTML;
    dom(".ctz-menu-top").innerHTML = HEADER.map(({ href, value }) => `<a href="${href}"><span>${value}</span></a>`).join("");
    addBackgroundElements();
    initInputRange();
    domById("CTZ_FONT_SIZE_IN_ZHIHU").innerHTML = FONT_SIZE_INPUT.map(
      (item) => `<div class="ctz-flex-wrap">` + item.map(
        (i, index) => `<span class="ctz-label" style="margin-left: ${index !== 0 ? "24px" : "0"};">${i.label}</span><input type="number" name="${i.value}" class="ctz-i-change" style="width: 80px;" />`
      ).join("") + `</div>`
    ).join("");
    domById("CTZ_HIDDEN").innerHTML = `<div class="ctz-content-left">${HIDDEN_ARRAY.map((i) => `<a href="#${i.key}">${i.name}</a>`).join("")}</div><div class="ctz-content-right">${HIDDEN_ARRAY.map(
      (i) => `<div id="${i.key}"><div class="ctz-set-title">${i.name}<span class="ctz-desc">${i.desc}</span></div>${createHiddenItem(i.content)}</div>`
    ).join("")}</div>`;
    domById("CTZ_TITLE_ICO").innerHTML = Object.keys(ICO_URL).map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`).join("");
    domById("CTZ_DEFAULT_SELF").innerHTML = DEFAULT_FUNCTION.map((elementItem, index) => `<div>${index + 1}. ${elementItem}</div>`).join("");
    dom("#CTZ_BASIS_SHOW_CONTENT .ctz-set-content").innerHTML += BASIC_SHOW_CONTENT.map(
      ({ label, value, needFetch }) => `<label class="ctz-flex-wrap ${needFetch ? "ctz-fetch-intercept" : ""}"><span class="ctz-label">${label}${needFetch ? '<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span>' : ""}</span><input class="ctz-i" name="${value}" type="checkbox" value="on" /></label>`
    ).join("");
    initFetchInterceptStatus();
    myBlack.init();
    myMenu.init();
    const userinfo = getUserinfo();
    if (!userinfo)
      return;
    const hrefUser = userinfo.url ? userinfo.url.replace("/api/v4", "") : "";
    if (!hrefUser)
      return;
    const homeLink = domC("a", {
      href: hrefUser,
      target: "_blank",
      innerText: "前往个人主页>>"
    });
    dom(".ctz-footer-right").appendChild(homeLink);
  };
  var initInviteOnce = () => {
    setTimeout(() => {
      const domInvitation = dom(".QuestionInvitation");
      if (!domInvitation || dom(".ctz-invite-once"))
        return;
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
  var fnContentRemoveKeywordSearch = (domFind) => {
    const domKeywords = domFind.querySelectorAll(".RichContent-EntityWord");
    for (let i = 0, len = domKeywords.length; i < len; i++) {
      const domItem = domKeywords[i];
      domItem.href = "javascript:;";
      domItem.style.cssText += `color: inherit!important; cursor: default!important;`;
      const domSvg = domItem.querySelector("svg");
      if (domSvg) {
        domSvg.style.display = "none";
      }
    }
  };
  var QUERY_CLASS_PDF_IFRAME = ".ctz-pdf-box-content";
  var loadIframeAndExport = (eventBtn, arrHTML, btnText) => {
    let imageNumberMax = 0;
    let imageNumberFinish = 0;
    let imageErrorsIndex = [];
    let catchImageErrorIndex = [];
    const innerHTML = arrHTML.join("");
    const domTemporary = domC("div", { innerHTML });
    imageNumberMax = domTemporary.querySelectorAll("img").length;
    domTemporary.remove();
    const iframe = dom(QUERY_CLASS_PDF_IFRAME);
    if (!iframe.contentWindow)
      return;
    const doc = iframe.contentWindow.document;
    doc.body.innerHTML = "";
    if (!doc.head.querySelector("style")) {
      doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
    }
    doc.write(`<div class="ctz-pdf-view"></div>`);
    const nodePDFView = doc.querySelector(".ctz-pdf-view");
    function drawContent(i, len, isDrawError = false) {
      setTimeout(() => {
        const indexReal = isDrawError ? catchImageErrorIndex[i] : i;
        const className = `view-${indexReal}`;
        let nextDom = null;
        if (isDrawError) {
          const prevDom = nodePDFView.querySelector(`.${className}`);
          nextDom = prevDom.nextElementSibling;
          prevDom.remove();
        }
        const nDom = domC("div", { innerHTML: arrHTML[indexReal], className });
        nextDom ? nodePDFView.insertBefore(nDom, nextDom) : nodePDFView.appendChild(nDom);
        const images = nDom.querySelectorAll("img");
        let currentFinishNumber = 0;
        for (let nIndex = 0, nLen = images.length; nIndex < nLen; nIndex++) {
          const item = images[nIndex];
          const realSrc = item.getAttribute("data-original") || item.getAttribute("data-actualsrc") || item.src;
          item.src = realSrc || "";
          item.onload = function() {
            currentFinishNumber++;
            currentFinishNumber === nLen && (imageNumberFinish += currentFinishNumber);
            eventBtn.innerText = `资源加载进度 ${Math.floor(imageNumberFinish / imageNumberMax * 100)}%：${imageNumberFinish}/${imageNumberMax}`;
            if (imageNumberFinish === imageNumberMax) {
              eventBtn.innerText = btnText;
              eventBtn.disabled = false;
              iframe.contentWindow.print();
            }
          };
          item.onerror = function() {
            !imageErrorsIndex.includes(indexReal) && imageErrorsIndex.push(indexReal);
          };
        }
        if (i === len - 1 && imageErrorsIndex.length) {
          catchImageErrorIndex = imageErrorsIndex;
          imageErrorsIndex = [];
          setTimeout(() => {
            for (let nIndex = 0, nLen = catchImageErrorIndex.length; nIndex < nLen; nIndex++) {
              drawContent(nIndex, nLen, true);
            }
          }, len * 100 + 100);
        }
      }, i * 100);
    }
    for (let i = 0, len = arrHTML.length; i < len; i++) {
      drawContent(i, len);
    }
  };
  var myCollectionExport = {
    init: function() {
      const { fetchInterceptStatus } = store.getConfig();
      if (!fetchInterceptStatus)
        return;
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
        if (!id)
          return;
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
          loadIframeAndExport(me, collectionsHTMLMap, "生成PDF");
        });
      });
      const nodePageHeaderTitle = dom(".CollectionDetailPageHeader-title");
      nodePageHeaderTitle && nodePageHeaderTitle.appendChild(elementBox);
    },
    className: "ctz-export-collection-box",
    element: `<button class="ctz-button" name="ctz-export-collection">生成PDF</button><p>仅对当前页码收藏夹内容进行导出</p><p>图片内容过多时请耐心等待</p><p>如果点击没有生成PDF请刷新页面</p>`,
    elementTypeSpan: (type) => {
      const typeObj = {
        zvideo: '<span class="ctz-label-tag" style="color: #12c2e9;">视频</span>',
        answer: '<span class="ctz-label-tag" style="color: #ec7259;">问答</span>',
        article: '<span class="ctz-label-tag" style="color: #00965e;">文章</span>'
      };
      return typeObj[type] || "";
    }
  };
  var addButtonForAnswerExportPDF = (nodeAnswerItem) => {
    const prevButton = nodeAnswerItem.querySelector(".ctz-export-answer");
    if (prevButton)
      return;
    const nodeUser = nodeAnswerItem.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
    if (!nodeUser)
      return;
    const nodeButton = createBtnSmallTran("导出当前回答", "ctz-export-answer");
    nodeButton.onclick = function() {
      const nodeAnswerUserLink = nodeAnswerItem.querySelector(".AuthorInfo-name");
      const nodeAnswerContent = nodeAnswerItem.querySelector(".RichContent-inner");
      const innerHTML = `${nodeAnswerUserLink ? nodeAnswerUserLink.innerHTML : ""}${nodeAnswerContent ? nodeAnswerContent.innerHTML : ""}`;
      pdfExport(innerHTML);
    };
    nodeUser.appendChild(nodeButton);
  };
  var addButtonForArticleExportPDF = (nodeArticleItem) => {
    const { topExportContent } = store.getConfig();
    const prevButton = nodeArticleItem.querySelector(".ctz-export-article");
    if (prevButton)
      return;
    const nodeUser = nodeArticleItem.querySelector(".ArticleItem-authorInfo>.AuthorInfo") || nodeArticleItem.querySelector(".Post-Header .AuthorInfo-content");
    if (!nodeUser || !topExportContent)
      return;
    const nodeButton = createBtnSmallTran("导出当前文章", "ctz-export-article");
    nodeButton.onclick = function() {
      const nodeAnswerUserLink = nodeArticleItem.querySelector(".AuthorInfo-name");
      const nodeAnswerContent = nodeArticleItem.querySelector(".RichContent-inner") || nodeArticleItem.querySelector(".Post-RichTextContainer");
      const innerHTML = `${nodeAnswerUserLink ? nodeAnswerUserLink.innerHTML : ""}${nodeAnswerContent ? nodeAnswerContent.innerHTML : ""}`;
      pdfExport(innerHTML);
    };
    nodeUser.appendChild(nodeButton);
  };
  var pdfExport = (content) => {
    const iframe = dom(QUERY_CLASS_PDF_IFRAME);
    if (!iframe.contentWindow || !content)
      return;
    const doc = iframe.contentWindow.document;
    doc.body.innerHTML = "";
    doc.write(content);
    iframe.contentWindow.print();
  };
  var doHomeFetch = (url, headers) => {
    return new Promise((resolve) => {
      if (!url) {
        resolve([]);
      } else {
        fetch(url, {
          method: "GET",
          headers: new Headers(headers)
        }).then((response) => response.json()).then((res) => resolve(res.data));
      }
    });
  };
  var addBtnForExportPeopleAnswer = () => {
    const { fetchInterceptStatus } = store.getConfig();
    const domListHeader = dom(".Profile-main .List-headerText");
    const domButtonOnce = dom(".ctz-people-export-answer-once");
    if (!domListHeader || domButtonOnce || !fetchInterceptStatus)
      return;
    const nDomButtonOnce = createBtnSmallTran("导出当前页回答", "ctz-people-export-answer-once");
    nDomButtonOnce.onclick = async function() {
      const eventBtn = this;
      eventBtn.innerText = "加载回答内容中...";
      eventBtn.disabled = true;
      const config = store.getHomeFetch("answer");
      if (!config)
        return;
      const data = await doHomeFetch(config.url, config.header);
      const content = data.map((item) => `<h1>${item.question.title}</h1><div>${item.content}</div>`);
      loadIframeAndExport(eventBtn, content, "导出当前页回答");
    };
    domListHeader.appendChild(nDomButtonOnce);
  };
  var addBtnForExportPeopleArticles = () => {
    const { fetchInterceptStatus } = store.getConfig();
    const domListHeader = dom(".Profile-main .List-headerText");
    const domButtonOnce = dom(".ctz-people-export-articles-once");
    if (!domListHeader || domButtonOnce || !fetchInterceptStatus)
      return;
    const nDomButtonOnce = createBtnSmallTran("导出当前页文章", "ctz-people-export-articles-once");
    nDomButtonOnce.onclick = async function() {
      const eventBtn = this;
      const { search } = location;
      const page = search.replace("?page=", "") || "1";
      eventBtn.innerText = "加载文章内容中...";
      eventBtn.disabled = true;
      const prevData = [];
      if (page === "1") {
        const domScript = dom("#js-initialData");
        if (!domScript)
          return;
        const scriptData = JSON.parse(domScript.innerText);
        const articles = scriptData.initialState.entities.articles;
        for (let key in articles) {
          prevData.push(articles[key]);
        }
      }
      const config = store.getHomeFetch("articles");
      if (!config)
        return;
      const data = await doHomeFetch(config.url, config.header);
      const content = data.map((item) => `<h1>${item.title}</h1><div>${item.content}</div>`);
      loadIframeAndExport(eventBtn, content, "导出当前页文章");
    };
    domListHeader.appendChild(nDomButtonOnce);
  };
  var myScroll = {
    stop: () => dom("body").classList.add("ctz-stop-scroll"),
    on: () => dom("body").classList.remove("ctz-stop-scroll")
  };
  var myPreview = {
    // 开启预览弹窗
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
    // 关闭预览弹窗
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
  var callbackGIF = (mutationsList) => {
    const target = mutationsList[0].target;
    const targetClassList = target.classList;
    const { showGIFinDialog } = store.getConfig();
    if (!(targetClassList.contains("isPlaying") && !targetClassList.contains("css-1isopsn") && showGIFinDialog))
      return;
    const nodeVideo = target.querySelector("video");
    const nodeImg = target.querySelector("img");
    const srcImg = nodeImg ? nodeImg.src : "";
    nodeVideo ? myPreview.open(nodeVideo.src, target, true) : myPreview.open(srcImg, target);
  };
  var observerGIF = new MutationObserver(callbackGIF);
  function previewGIF() {
    const { showGIFinDialog } = store.getConfig();
    if (showGIFinDialog) {
      const config = { attributes: true, attributeFilter: ["class"] };
      const gifPlayers = domA(".GifPlayer");
      for (let i = 0, len = gifPlayers.length; i < len; i++) {
        const event = gifPlayers[i];
        observerGIF.observe(event, config);
      }
    } else {
      observerGIF.disconnect();
    }
  }
  var keydownNextImage = (event) => {
    const { key } = event;
    const nodeImgDialog = dom(".css-ypb3io");
    if ((key === "ArrowRight" || key === "ArrowLeft") && nodeImgDialog) {
      const src = nodeImgDialog.src;
      const nodeImage = dom(`img[src="${src}"]`);
      const nodeContentInner = domP(nodeImage, "class", "RichContent-inner") || domP(nodeImage, "class", "Post-RichTextContainer") || domP(nodeImage, "class", "QuestionRichText");
      if (nodeContentInner) {
        const nodesImageList = Array.from(nodeContentInner.querySelectorAll("img"));
        const index = nodesImageList.findIndex((i) => i.src === src);
        const dialogChange = (nodeDialog, nodeImage2) => {
          const { width, height, src: src2 } = nodeImage2;
          const { innerWidth, innerHeight } = window;
          const aspectRatioWindow = innerWidth / innerHeight;
          const aspectRatioImage = width / height;
          const scale = aspectRatioImage > aspectRatioWindow ? (innerWidth - 200) / width : (innerHeight - 50) / height;
          const top = document.documentElement.scrollTop;
          const left = innerWidth / 2 - width * scale / 2;
          nodeDialog.src = src2;
          nodeDialog.style.cssText = nodeDialog.style.cssText + `width: ${width}px;height: ${height}px;top: ${top}px;left: ${left}px;transform: translateX(0) translateY(0) scale(${scale}) translateZ(0px);will-change:unset;transform-origin: 0 0;`;
        };
        if (key === "ArrowRight" && index < nodesImageList.length - 1) {
          dialogChange(nodeImgDialog, nodesImageList[index + 1]);
          return;
        }
        if (key === "ArrowLeft" && index > 0) {
          dialogChange(nodeImgDialog, nodesImageList[index - 1]);
          return;
        }
      }
    }
  };
  var initLinkChanger = () => {
    const esName = ["a.external", "a.LinkCard"];
    const operaLink = "is-link-changed";
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
  var addAnswerCopyLink = (nodeItem) => {
    const { copyAnswerLink } = store.getConfig();
    if (!copyAnswerLink)
      return;
    const prevButton = nodeItem.querySelector(`.${CLASS_COPY_LINK}`);
    prevButton && prevButton.remove();
    const nodeUser = nodeItem.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
    if (!nodeUser)
      return;
    const nDomButton = createBtnSmallTran("一键获取回答链接", CLASS_COPY_LINK);
    nDomButton.onclick = function() {
      const metaUrl = nodeItem.querySelector('.ContentItem>[itemprop="url"]');
      if (!metaUrl)
        return;
      const link = metaUrl.getAttribute("content") || "";
      if (link) {
        copy(link);
        message("链接复制成功");
        return;
      }
    };
    nodeUser.appendChild(nDomButton);
  };
  var timeFormatter = (time, formatter = "YYYY-MM-DD HH:mm:ss") => {
    if (!time)
      return "";
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    const preArr = (num) => String(num).length !== 2 ? "0" + String(num) : String(num);
    return formatter.replace(/YYYY/g, String(year)).replace(/MM/g, preArr(month)).replace(/DD/g, preArr(day)).replace(/HH/g, preArr(hour)).replace(/mm/g, preArr(min)).replace(/ss/g, preArr(sec));
  };
  var updateItemTime = (event) => {
    const nodeCreated = event.querySelector('[itemprop="dateCreated"]');
    const nodePublished = event.querySelector('[itemprop="datePublished"]');
    const nodeModified = event.querySelector('[itemprop="dateModified"]');
    const crTime = nodeCreated ? nodeCreated.content : "";
    const puTime = nodePublished ? nodePublished.content : "";
    const muTime = nodeModified ? nodeModified.content : "";
    const timeCreated = timeFormatter(crTime || puTime);
    const timeModified = timeFormatter(muTime);
    const nodeContentItemMeta = event.querySelector(".ContentItem-meta");
    if (!timeCreated || !nodeContentItemMeta)
      return;
    const innerHTML = `<div>创建时间：${timeCreated}</div><div>最后修改时间：${timeModified}</div>`;
    const domTime = event.querySelector(`.${CLASS_TIME_ITEM}`);
    if (domTime) {
      domTime.innerHTML = innerHTML;
    } else {
      nodeContentItemMeta.appendChild(
        domC("div", {
          className: CLASS_TIME_ITEM,
          innerHTML,
          style: "line-height: 24px;padding-top: 2px;font-size: 14px;"
        })
      );
    }
  };
  var addQuestionCreatedAndModifiedTime = () => {
    const { getConfig } = store;
    const className = "ctz-question-time";
    const nodeTime = dom(`.${className}`);
    nodeTime && nodeTime.remove();
    const conf = getConfig();
    const nodeCreated = dom('[itemprop="dateCreated"]');
    const nodeModified = dom('[itemprop="dateModified"]');
    if (!(conf.questionCreatedAndModifiedTime && nodeCreated && nodeModified))
      return;
    const created = timeFormatter(nodeCreated.content);
    const modified = timeFormatter(nodeModified.content);
    const nodeTitle = dom(".QuestionPage .QuestionHeader-title");
    nodeTitle && nodeTitle.appendChild(
      domC("div", {
        className,
        innerHTML: `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`
      })
    );
  };
  var addArticleCreateTimeToTop = () => {
    const { articleCreateTimeToTop } = store.getConfig();
    const className = "ctz-article-create-time";
    const nodeT = dom(`.${className}`);
    nodeT && nodeT.remove();
    const nodeContentTime = dom(".ContentItem-time");
    const nodeHeader = dom(".Post-Header");
    if (!(articleCreateTimeToTop && nodeContentTime && nodeHeader))
      return;
    nodeHeader.appendChild(
      domC("span", {
        className,
        style: "color: #8590a6;line-height: 30px;",
        innerHTML: nodeContentTime.innerText || ""
      })
    );
  };
  var updateTopVote = (nodeItem) => {
    if (!nodeItem)
      return;
    const nodeContentItemMeta = nodeItem.querySelector(".ContentItem-meta");
    const nodeMetaVote = nodeItem.querySelector('[itemprop="upvoteCount"]');
    const { topVote } = store.getConfig();
    if (!nodeMetaVote || !topVote || !nodeContentItemMeta)
      return;
    const vote = nodeMetaVote.content;
    if (+vote === 0)
      return;
    const className = "ctz-top-vote";
    const domVotePrev = nodeContentItemMeta.querySelector(`.${className}`);
    const innerHTML = `${vote} 人赞同了该回答`;
    if (domVotePrev) {
      domVotePrev.innerHTML = innerHTML;
    } else {
      const domVote = domC("div", {
        className,
        innerHTML,
        style: "font-size: 14px;padding-top: 2px;color: rgb(132, 145, 165);margin: 8px 0;"
      });
      nodeContentItemMeta.appendChild(domVote);
      const metaObserver = new MutationObserver(() => {
        updateTopVote(nodeItem);
      });
      metaObserver.observe(nodeMetaVote, {
        attributes: true,
        childList: false,
        characterData: false,
        characterDataOldValue: false,
        subtree: false
      });
    }
  };
  var myListenAnswerItem = {
    index: 0,
    init: function() {
      const { getConfig } = store;
      const conf = getConfig();
      const {
        removeLessVoteDetail,
        lessVoteNumberDetail = 0,
        answerOpen,
        removeZhihuOfficial,
        removeBlockUserContent,
        removeBlockUserContentList,
        showBlockUser,
        removeAnonymousAnswer,
        topExportContent,
        blockWordsAnswer = [],
        fetchInterceptStatus,
        answerItemCreatedAndModifiedTime
      } = conf;
      const addFnInNodeItem = (nodeItem, initThis) => {
        if (!nodeItem)
          return;
        updateTopVote(nodeItem);
        answerItemCreatedAndModifiedTime && updateItemTime(nodeItem);
        showBlockUser && fetchInterceptStatus && myBlack.addButton(nodeItem, initThis);
        if (topExportContent && fetchInterceptStatus) {
          addButtonForAnswerExportPDF(nodeItem);
          addButtonForArticleExportPDF(nodeItem);
        }
        initVideoDownload(nodeItem);
        addAnswerCopyLink(nodeItem);
      };
      addFnInNodeItem(dom(".QuestionAnswer-content"));
      const hiddenTags = Object.keys(HIDDEN_ANSWER_TAG);
      let hiddenUsers = [];
      for (let i in HIDDEN_ANSWER_ACCOUNT) {
        conf[i] && hiddenUsers.push(HIDDEN_ANSWER_ACCOUNT[i]);
      }
      removeBlockUserContent && (hiddenUsers = hiddenTags.concat((removeBlockUserContentList || []).map((i) => i.name || "")));
      const elements = domA(".AnswersNavWrapper .List-item");
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message2 = "";
        const nodeItem = elements[i];
        const nodeItemContent = nodeItem.querySelector(".ContentItem");
        if (!nodeItemContent)
          continue;
        let dataZop = {};
        let dataCardContent = {};
        try {
          dataZop = JSON.parse(nodeItemContent.getAttribute("data-zop") || "{}");
          dataCardContent = JSON.parse(nodeItemContent.getAttribute("data-za-extra-module") || "{}").card.content;
        } catch {
        }
        (dataCardContent["upvote_num"] || 0) < lessVoteNumberDetail && removeLessVoteDetail && (message2 = `过滤低赞回答: ${dataCardContent["upvote_num"]}赞`);
        if (removeZhihuOfficial && !message2) {
          const labelE = nodeItem.querySelector(".AuthorInfo-name .css-n99yhz");
          const label = labelE ? labelE.getAttribute("aria-label") || "" : "";
          /知乎[\s]*官方帐号/.test(label) && (message2 = "已删除一条知乎官方帐号的回答");
        }
        let isHiddenTag = false;
        hiddenTags.forEach((i2) => conf[i2] && (isHiddenTag = true));
        if (isHiddenTag && !message2) {
          const nodeTag1 = nodeItem.querySelector(".KfeCollection-AnswerTopCard-Container");
          const nodeTag2 = nodeItem.querySelector(".LabelContainer-wrapper");
          const text1 = nodeTag1 ? nodeTag1.innerText : "";
          const text2 = nodeTag2 ? nodeTag2.innerText : "";
          const tagText = text1 + text2;
          hiddenTags.forEach((i2) => {
            if (conf[i2]) {
              const nReg = new RegExp(HIDDEN_ANSWER_TAG[i2]);
              nReg.test(tagText) && (message2 = `已删除一条标签${HIDDEN_ANSWER_TAG[i2]}的回答`);
            }
          });
        }
        hiddenUsers.length && !message2 && hiddenUsers.includes(dataZop.authorName || "") && (message2 = `已删除${dataZop.authorName}的回答`);
        if (removeAnonymousAnswer && !message2) {
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
        if (!message2 && answerOpen) {
          const unFoldButton = nodeItem.querySelector(".ContentItem-expandButton");
          const foldButton = nodeItem.querySelector(".RichContent-collapsedText");
          const isNotOpen = !nodeItem.classList.contains(OB_CLASS_FOLD.on);
          const isNotClose = !nodeItem.classList.contains(OB_CLASS_FOLD.off);
          if (answerOpen === "on" && isNotOpen) {
            unFoldButton && unFoldButton.click();
            nodeItem.classList.add(OB_CLASS_FOLD.on);
            lessNum++;
          }
          const isF = foldButton && nodeItem.offsetHeight > 939;
          const isFC = unFoldButton;
          if (answerOpen === "off" && isNotClose && (isF || isFC)) {
            nodeItem.classList.add(OB_CLASS_FOLD.off);
            isF && foldButton && foldButton.click();
            lessNum++;
          }
        }
        fnJustNum(nodeItem);
        if (message2) {
          lessNum = fnHiddenDom(lessNum, nodeItem, message2);
        } else {
          addFnInNodeItem(nodeItem, this);
        }
        this.index = fnIndexMath(this.index, i, len, lessNum);
      }
    },
    reset: function() {
      this.index = 0;
    },
    restart: function() {
      this.reset();
      this.init();
    }
  };
  var myListenListItem = {
    index: 0,
    init: async function() {
      const { getConfig, getHistory, getUserinfo, getZhihuListTargets } = store;
      const pfConfig = getConfig();
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
        themeDark = 1 /* 深色护眼一 */,
        themeLight = 0 /* 默认 */,
        removeMyOperateAtFollow,
        listOutputToQuestion,
        fetchInterceptStatus
      } = pfConfig;
      const elements = domA(".TopstoryItem");
      let lessNum = 0;
      await myStorage.initHistory();
      const pfHistory = getHistory();
      const historyList = pfHistory.list;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message2 = "";
        let dataZop = {};
        let cardContent = {};
        const nodeItem = elements[i];
        const nodeItemContent = nodeItem.querySelector(".ContentItem");
        if (!nodeItem.scrollHeight || !nodeItemContent)
          continue;
        const isVideo = nodeItemContent.classList.contains("ZVideoItem");
        const isArticle = nodeItemContent.classList.contains("ArticleItem");
        const isTip = nodeItemContent.classList.contains("PinItem");
        const nodeContentItemTitle = nodeItem.querySelector(".ContentItem-title");
        if (listOutPutNotInterested && fetchInterceptStatus) {
          const nDomNotInterested = createBtnSmallTran("不感兴趣", CLASS_NOT_INTERESTED);
          !nodeItem.querySelector(`.${CLASS_NOT_INTERESTED}`) && nodeContentItemTitle && nodeContentItemTitle.appendChild(nDomNotInterested);
        }
        if (listOutputToQuestion) {
          const nDomToQuestion = createBtnSmallTran("直达问题", CLASS_TO_QUESTION);
          if (!isVideo && !isArticle && !isTip) {
            !nodeItem.querySelector(`.${CLASS_TO_QUESTION}`) && nodeContentItemTitle && nodeContentItemTitle.appendChild(nDomToQuestion);
          }
        }
        try {
          dataZop = JSON.parse(nodeItemContent.getAttribute("data-zop") || "{}");
          cardContent = JSON.parse(nodeItemContent.getAttribute("data-za-extra-module") || "{}").card.content;
        } catch {
        }
        const { title = "" } = dataZop || {};
        if (removeMyOperateAtFollow && nodeItem.classList.contains("TopstoryItem-isFollow")) {
          try {
            const userinfo = getUserinfo();
            const nodeUserLink = nodeItem.querySelector(".UserLink .UserLink-link");
            const findUserId = nodeUserLink.href.match(/[^\/]+$/)[0];
            const myUserId = userinfo.url.match(/[^\/]+$/)[0];
            findUserId === myUserId && (message2 = "关注列表屏蔽自己的操作");
          } catch {
          }
        }
        (isVideo && removeItemAboutVideo || isArticle && removeItemAboutArticle || isTip && removeItemAboutPin) && !message2 && (message2 = `列表种类屏蔽，${nodeItemContent.classList.value}`);
        if (removeLessVote && !message2) {
          (cardContent["upvote_num"] || 0) < lessVoteNumber && (message2 = `屏蔽低赞内容: ${title}, ${cardContent["upvote_num"]}`);
        }
        const elementQuestionAsk = nodeItem.querySelector(".TopstoryQuestionAskItem");
        if (removeItemQuestionAsk && elementQuestionAsk && !message2) {
          message2 = "屏蔽邀请回答";
        }
        const isFilterFollowerOperate = removeFollowVoteAnswer || removeFollowVoteArticle || removeFollowFQuestion;
        if (isFilterFollowerOperate && !message2 && nodeItem.classList.contains("TopstoryItem-isFollow")) {
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
        !message2 && (message2 = this.replaceBlockWord(title, nodeItemContent, filterKeywords, title, "标题"));
        if (!message2) {
          const domRichContent = nodeItem.querySelector(".RichContent");
          const innerText = domRichContent ? domRichContent.innerText : "";
          message2 = this.replaceBlockWord(innerText, nodeItemContent, blockWordsAnswer, title, "内容");
        }
        const userNameE = nodeItem.querySelector(".FeedSource-firstline .UserLink-link");
        const userName = userNameE ? userNameE.innerText : "";
        if (highlightOriginal && dataZop && dataZop.authorName === userName && !message2) {
          const highlight = `background: ${isDark() ? `${THEME_CONFIG_DARK[themeDark].background2}!important;` : +themeLight === 0 /* 默认 */ ? "#fff3d4!important;" : `${THEME_CONFIG_LIGHT[themeLight].background}!important;`}`;
          const nodeActions = nodeItem.querySelector(".ContentItem-actions");
          nodeItem.style.cssText = `${highlight}border: 1px solid #aaa;`;
          nodeActions && (nodeActions.style.cssText = highlight);
        }
        message2 && (lessNum = fnHiddenDom(lessNum, nodeItem, message2));
        if (domP(nodeItem, "class", "Topstory-recommend") && nodeItem.querySelector(".ContentItem-title a")) {
          const nodeATitle = nodeItem.querySelector(".ContentItem-title a");
          if (nodeATitle) {
            const itemHref = nodeATitle.href;
            const itemTitle = nodeATitle.innerText;
            const itemT = isVideo ? itemType.zvideo : isArticle ? itemType.article : isTip ? itemType.pin : itemType.answer;
            const itemA = `<a href="${itemHref}" target="_blank"><b style="${itemT.style}">「${itemT.name}」</b>${itemTitle}</a>`;
            if (!historyList.includes(itemA)) {
              historyList.unshift(itemA);
            }
          }
        }
        fnJustNum(nodeItem);
        if (i + 1 === len) {
          const nI = i - lessNum >= 0 ? i - lessNum : 0;
          this.index = nI;
          myStorage.setHistoryItem("list", historyList);
        }
      }
    },
    reset: function() {
      this.index = 0;
    },
    restart: function() {
      this.reset();
      this.init();
    },
    getScriptData: function() {
      try {
        const initialData = JSON.parse(domById("js-initialData")?.innerHTML ?? "{}");
        const answers = initialData.initialState.entities.answers;
        const nTargets = [];
        for (let key in answers) {
          nTargets.push(answers[key]);
        }
        store.setZhihuListTargets(nTargets);
      } catch (err) {
      }
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
  var itemType = {
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
  var myListenSearchListItem = {
    index: 0,
    init: function() {
      const { removeItemAboutVideo, removeItemAboutArticle, removeItemAboutAD, removeLessVote, lessVoteNumber = 0 } = store.getConfig();
      const elements = domA('.SearchResult-Card[role="listitem"]');
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message2 = "";
        const elementThis = elements[i];
        if (!elementThis)
          continue;
        const haveAD = removeItemAboutAD && elementThis.querySelector(".KfeCollection-PcCollegeCard-root");
        const haveArticle = removeItemAboutArticle && elementThis.querySelector(".ArticleItem");
        const haveVideo = removeItemAboutVideo && elementThis.querySelector(".ZvideoItem");
        (haveAD || haveArticle || haveVideo) && (message2 = "列表种类屏蔽");
        if (removeLessVote && !message2) {
          const elementUpvote = elementThis.querySelector(".ContentItem-actions .VoteButton--up");
          if (elementUpvote) {
            const ariaLabel = elementUpvote.getAttribute("aria-label");
            if (ariaLabel) {
              const upvoteText = ariaLabel.trim().replace(/\W+/, "");
              const upvote = upvoteText.includes("万") ? +upvoteText.replace("万", "").trim() * 1e4 : +upvoteText;
              if (upvote > -1 && upvote < lessVoteNumber) {
                message2 = `屏蔽低赞内容: ${upvote}赞`;
              }
            }
          }
        }
        fnJustNum(elementThis);
        message2 && (lessNum = fnHiddenDom(lessNum, elementThis, message2));
        this.index = fnIndexMath(this.index, i, len, lessNum);
      }
    },
    reset: function() {
      this.index = 0;
    },
    restart: function() {
      this.reset();
      this.init();
    }
  };
  var initImagePreview = () => {
    const { zoomImageType } = store.getConfig();
    const images = [domA(".TitleImage"), domA(".ArticleItem-image"), domA(".ztext figure .content_image")];
    for (let i = 0, imageLen = images.length; i < imageLen; i++) {
      const ev = images[i];
      for (let index = 0, len = ev.length; index < len; index++) {
        const nodeItem = ev[index];
        const src = nodeItem.src || nodeItem.style.backgroundImage && nodeItem.style.backgroundImage.split('("')[1].split('")')[0];
        nodeItem.onclick = () => myPreview.open(src);
      }
    }
    if (zoomImageType === "2") {
      const originImages = domA(".origin_image");
      for (let i = 0, len = originImages.length; i < len; i++) {
        const nodeItem = originImages[i];
        nodeItem.src = nodeItem.getAttribute("data-original") || nodeItem.src;
        nodeItem.style.cssText = "max-width: 100%;";
      }
    }
  };
  var initTopStoryRecommendEvent = () => {
    const nodeTopStoryRecommend = dom(".Topstory-recommend") || dom(".Topstory-follow");
    if (!nodeTopStoryRecommend)
      return;
    const classTarget = ["RichContent-cover", "RichContent-inner", "ContentItem-more", "ContentItem-arrowIcon"];
    const canFindTargeted = (e) => {
      let isFind = false;
      classTarget.forEach((item) => {
        (e.classList.contains(item) || e.parentElement.classList.contains(item)) && (isFind = true);
      });
      return isFind;
    };
    nodeTopStoryRecommend.addEventListener("click", function(event) {
      const target = event.target;
      const nodeContentItem = domP(target, "class", "ContentItem");
      if (!nodeContentItem)
        return;
      const { showBlockUser, topExportContent, fetchInterceptStatus, listItemCreatedAndModifiedTime } = store.getConfig();
      if (target.classList.contains(CLASS_NOT_INTERESTED) && fetchInterceptStatus) {
        const dataZopJson = nodeContentItem.getAttribute("data-zop");
        const { itemId = "", type = "" } = JSON.parse(dataZopJson || "{}");
        doFetchNotInterested({ id: itemId, type });
        const nodeTopStoryItem = domP(target, "class", "TopstoryItem");
        nodeTopStoryItem && (nodeTopStoryItem.style.display = "none");
      }
      if (target.classList.contains(CLASS_TO_QUESTION)) {
        const domUrl = nodeContentItem.querySelector('[itemprop="url"]');
        const pathAnswer = domUrl ? domUrl.getAttribute("content") || "" : "";
        const pathQuestion = pathAnswer.replace(/\/answer[\W\w]+/, "");
        if (pathQuestion) {
          window.open(pathQuestion);
        }
      }
      if (canFindTargeted(target)) {
        setTimeout(() => {
          updateTopVote(nodeContentItem);
          listItemCreatedAndModifiedTime && updateItemTime(nodeContentItem);
          showBlockUser && fetchInterceptStatus && myBlack.addButton(nodeContentItem.parentElement);
          initVideoDownload(nodeContentItem);
          if (topExportContent && fetchInterceptStatus) {
            addButtonForAnswerExportPDF(nodeContentItem.parentElement);
            addButtonForArticleExportPDF(nodeContentItem.parentElement);
          }
          addAnswerCopyLink(nodeContentItem);
        }, 0);
      }
    });
  };
  var initRootEvent = () => {
    const domRoot = dom("#root");
    if (!domRoot)
      return;
    const classForVideoOne = CLASS_VIDEO_ONE.replace(".", "");
    const { videoUseLink } = store.getConfig();
    domRoot.addEventListener("click", function(event) {
      const target = event.target;
      if (videoUseLink) {
        if (target.classList.contains(classForVideoOne)) {
          const domVideo = target.querySelector("video");
          const videoSrc = domVideo ? domVideo.src : "";
          if (!videoSrc)
            return;
          window.open(videoSrc, "_blank");
        }
      }
    });
  };
  var initResizeObserver = () => {
    const resizeObserver = new ResizeObserver(throttle(resizeFun, 500));
    resizeObserver.observe(document.body);
  };
  function resizeFun() {
    if (!HTML_HOOTS.includes(location.hostname))
      return;
    const { getStorageConfigItem, getConfig, setStorageConfigItem } = store;
    const { globalTitle, hiddenSearchBoxTopSearch, contentRemoveKeywordSearch } = getConfig();
    const nodeTopStoryC = domById("TopstoryContent");
    if (nodeTopStoryC) {
      const heightForList = getStorageConfigItem("heightForList");
      const heightTopStoryContent = nodeTopStoryC.offsetHeight;
      if (heightTopStoryContent < heightForList) {
        myListenListItem.restart();
        initTopStoryRecommendEvent();
      } else {
        myListenListItem.init();
      }
      heightTopStoryContent < window.innerHeight && windowResize();
      setStorageConfigItem("heightForList", heightTopStoryContent);
    }
    contentRemoveKeywordSearch && fnContentRemoveKeywordSearch(document.body);
    initLinkChanger();
    previewGIF();
    initImagePreview();
    myListenSearchListItem.init();
    myListenAnswerItem.init();
    pathnameHasFn({
      // question: () => {
      //   myListenSelect.init();
      // },
      collection: () => myCollectionExport.init()
    });
    globalTitle !== document.title && changeTitle();
    const nodeSearchBarInput = dom(".SearchBar-input input");
    if (hiddenSearchBoxTopSearch && nodeSearchBarInput) {
      nodeSearchBarInput.placeholder = "";
    }
  }
  var echoHistory = async () => {
    const history = await myStorage.initHistory();
    const { list, view } = history;
    const nodeList = dom("#CTZ_HISTORY_LIST .ctz-set-content");
    const nodeView = dom("#CTZ_HISTORY_VIEW .ctz-set-content");
    nodeList && (nodeList.innerHTML = list.join(""));
    nodeView && (nodeView.innerHTML = view.join(""));
  };
  var myDialog = {
    open: async () => {
      const nodeDialog = domById(ID_DIALOG);
      nodeDialog && (nodeDialog.style.display = "flex");
      myScroll.stop();
      echoData();
      echoHistory();
    },
    hide: () => {
      const nodeDialog = domById(ID_DIALOG);
      nodeDialog && (nodeDialog.style.display = "none");
      myScroll.on();
    }
  };
  var myHidden = {
    init: function() {
      fnInitDomStyle("CTZ_STYLE_HIDDEN", this.change() || "");
    },
    change: function() {
      const { getConfig } = store;
      const pfConfig = getConfig();
      const cssHidden = Object.keys(this.cssForKey).map((key) => pfConfig[key] ? this.cssForKey[key] : "").join("");
      let cssHiddenMore = "";
      this.cssForKeysArray.forEach(({ keys, value }) => {
        let trueNumber = 0;
        keys.forEach((key) => pfConfig[key] && trueNumber++);
        trueNumber === keys.length && (cssHiddenMore += value);
      });
      return cssHidden + cssHiddenMore;
    },
    cssForKey: {
      hiddenLogo: `.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"],.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo{display: none!important;}`,
      hiddenHeader: `.AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}`,
      hiddenHeaderScroll: `.AppHeader.is-fixed{display:none!important;}`,
      hiddenItemActions: `.Topstory-container .ContentItem-actions>span,.Topstory-container .ContentItem-actions>button,.Topstory-container .ContentItem-actions>div,.Topstory-container .ContentItem-actions>a,.TopstoryQuestionAskItem-writeAnswerButton,.TopstoryQuestionAskItem-hint{visibility:hidden!important;height:0!important;padding:0!important;}.TopstoryQuestionAskItem-hint{margin: 0!important;}.Topstory .ContentItem-actions{padding: 0!important;}.Topstory-body .ContentItem-actions{display: none;}`,
      // `.SearchResult-Card .ContentItem-actions{display: none;}`,
      hiddenAnswerText: `.ContentItem-actions{padding: 0 20px!important;line-height: 38px!important;}.ContentItem-action,.ContentItem-action button,.ContentItem-actions button{font-size: 0!important;padding: 0!important;background: none!important;line-height:inherit!important;}.ContentItem-action span,.ContentItem-actions button span{font-size: 16px!important;}.ContentItem-action svg,.ContentItem-actions svg{width: 16px!important;height:16px!important;}.VoteButton{color: #8590a6!important; }.VoteButton.is-active{color: #056de8!important;}.ContentItem-action{margin-left:8px!important;}.Search-questionFollowButton{display: none}`,
      hiddenQuestionTag: ".QuestionHeader-tags{display: none!important;}",
      hiddenQuestionShare: ".zhihu .Popover.ShareMenu{display: none!important;}",
      hiddenQuestionActions: ".QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}",
      hiddenReward: ".Reward{display: none!important;}",
      hiddenZhuanlanTag: ".Post-topicsAndReviewer{display: none!important;}",
      hiddenListImg: `.RichContent-cover,.HotItem-img,.TopstoryItem .Image-Wrapper-Preview{display:none!important;}.HotItem-metrics--bottom{position: initial!important;}`,
      hiddenReadMoreText: ".ContentItem-more{font-size:0!important;}",
      hiddenAD: ".TopstoryItem--advertCard,.Pc-card,.Pc-word,.RichText-ADLinkCardContainer{display: none!important;}",
      hiddenAnswers: `.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine,.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt,.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer{display: none;}`,
      hiddenListVideoContent: `.Topstory-recommend .ZVideoItem-video,.Topstory-recommend .VideoAnswerPlayer,.Topstory-recommend .ZVideoItem .RichContent{display: none;}`,
      hiddenZhuanlanActions: ".RichContent-actions.is-fixed>.ContentItem-actions{display: none;}",
      hiddenZhuanlanTitleImage: ".css-1ntkiwo,.TitleImage,.css-78p1r9,.ArticleItem .RichContent>div:first-of-type:not(.RichContent-cover)>div:last-of-type{display: none!important;}",
      hiddenFixedActions: `.ContentItem .RichContent-actions.is-fixed,.List-item .RichContent-actions.is-fixed{visibility: hidden!important;}`,
      hiddenHotItemMetrics: ".HotItem-content .HotItem-metrics{display: none;}",
      hiddenHotItemIndex: ".HotItem-index{display: none;}.HotItem{padding: 16px!important;}",
      hiddenHotItemLabel: ".HotItem-label{display: none;}",
      hiddenDetailAvatar: ".AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}",
      hiddenDetailBadge: ".AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}",
      hiddenDetailVoters: ".AnswerItem .css-dvccr2{display: none;}",
      hiddenWhoVoters: ".css-1vqda4a{display: none!important;}",
      hiddenDetailName: ".AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}",
      hiddenDetailFollow: ".AnswerItem .AuthorInfo .FollowButton{display: none;}",
      hiddenHomeTab: ".Topstory-container .TopstoryTabs{display: none!important;}",
      hiddenQuestionSide: ".QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}",
      hiddenQuestionFollowing: ".QuestionHeader .FollowButton{display: none;}",
      hiddenQuestionAnswer: ".QuestionHeader .FollowButton ~ a{display: none;}",
      hiddenQuestionInvite: ".QuestionHeader .QuestionHeaderActions>button:first-child{display: none;}",
      hiddenSearchPageTopSearch: ".Search-container .TopSearch{display: none;}",
      hiddenSearchPageFooter: ".Search-container .Footer,.Search-container footer{display: none;}",
      hiddenSearchBoxTopSearch: ".SearchBar-noValueMenu .AutoComplete-group:first-child{display:none;}",
      hiddenZhuanlanShare: ".zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}",
      hiddenZhuanlanVoters: ".zhuanlan .Post-SideActions .like{display: none!important;}",
      hiddenFollowAction: ".TopstoryItem-isFollow .FeedSource-firstline{display: none;}",
      hiddenFollowChooseUser: ".TopstoryItem-isFollow .AuthorInfo{display: none;}",
      hiddenAnswerRightFooter: ".Question-sideColumn{display: none!important;}.Question-main .Question-mainColumn,.ListShortcut{width: inherit;}",
      hiddenAnswerRightFooterAnswerAuthor: ".Question-sideColumn .AnswerAuthor{display: none;}",
      hiddenAnswerRightFooterFavorites: ".Question-sideColumn .AnswerAuthor + .Card{display: none;}",
      hiddenAnswerRightFooterRelatedQuestions: '.Question-sideColumn [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}',
      hiddenAnswerRightFooterContentList: '.Question-sideColumn [data-za-detail-view-path-module="ContentList"]{display: none;}',
      hiddenAnswerRightFooterFooter: ".Question-sideColumn .Footer{display: none;}",
      hidden618HongBao: '.MCNLinkCard[data-mcn-source="淘宝"],.MCNLinkCard[data-mcn-source="京东"],.MCNLinkCard[data-mcn-source="知乎"]{display:none;}',
      hiddenZhuanlanFollowButton: ".zhuanlan .FollowButton{display: none;}",
      hiddenZhuanlanAvatarWrapper: ".zhuanlan .AuthorInfo-avatarWrapper{display: none;}",
      hiddenZhuanlanAuthorInfoHead: ".zhuanlan .AuthorInfo-head{display: none;}",
      hiddenZhuanlanAuthorInfoDetail: ".zhuanlan .AuthorInfo-detail{display: none;}",
      hiddenListAnswerInPerson: ".Topstory-mainColumn .LabelContainer{display: none;}",
      hiddenQuestionSpecial: ".QuestionHeader .LabelContainer-wrapper{display: none;}",
      hiddenHomeCreatorEntrance: ".Topstory .css-19idom{display: none;}",
      hiddenHomeRecommendFollow: ".Topstory .css-173vipd{display: none;}",
      hiddenHomeCategory: ".Topstory .GlobalSideBar-category{display: none;}",
      hiddenHomeCategoryMore: '.Topstory .Card[aria-label="更多分类入口"]{display:none;}',
      hiddenHomeFooter: ".Topstory .Footer,.Topstory footer{display: none;}",
      hiddenAnswerItemActions: ".Question-main .ContentItem-actions{display: none;}",
      hiddenAnswerItemTime: ".Question-main .ContentItem-time{display: none;margin: 0;}",
      hiddenAnswerItemTimeButHaveIP: ".Question-main .ContentItem-time>a{display: none;}.Question-main .ContentItem-time:empty{display: none;margin: 0;}",
      hiddenAppHeaderTabHome: ".AppHeader-Tab:nth-of-type(1){display: none}",
      hiddenAppHeaderTabZhi: ".AppHeader-Tab:nth-of-type(2){display: none}",
      hiddenAppHeaderTabVIP: ".AppHeader-Tab:nth-of-type(3){display: none}",
      hiddenAppHeaderTabFind: ".AppHeader-Tab:nth-of-type(4){display: none}",
      hiddenAppHeaderTabWaitingForYou: ".AppHeader-Tab:nth-of-type(5){display: none}",
      hiddenHomeListTabFollow: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-follow"]{display: none}',
      hiddenHomeListTabRecommend: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-recommend"]{display: none}',
      hiddenHomeListTabHot: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-hot"]{display: none}',
      hiddenHomeListTabVideo: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-zvideo"]{display: none}',
      hiddenHomeListTab: ".Topstory-container .TopstoryTabs{display: none}",
      hiddenQuestionGoodQuestion: ".QuestionPage .QuestionHeader .GoodQuestionAction{display: none}",
      hiddenQuestionComment: ".QuestionPage .QuestionHeader .QuestionHeader-Comment{display: none}",
      hiddenQuestionMore: '.QuestionPage .QuestionHeader [aria-label="更多"]{display: none;}',
      hiddenOpenButton: "#CTZ_OPEN_BUTTON{display: none;}",
      // hiddenTopAD: '.App-main .Topstory>div:first-of-type:not(.Topstory-container){display: none}',
      hiddenCommitReply: ".Comments-container .css-140jo2 button:first-of-type{display:none;}",
      hiddenCommitVote: ".Comments-container .css-140jo2 button:last-of-type{display:none;}",
      hiddenCommitBottom: ".Comments-container .css-140jo2{display:none;}",
      hiddenUserHomeOtherCard: ".Profile-sideColumn .Card:not(.Publications):not(.FollowshipCard){display:none;}",
      hiddenUserHomePublications: ".Profile-sideColumn .Card.Publications{display:none;}",
      hiddenUserHomeCreateEntrance: ".Profile-sideColumn .CreatorEntrance{display:none;}",
      hiddenUserHomeFollow: ".Profile-sideColumn .FollowshipCard{display:none;}",
      hiddenUserHomeLightList: ".Profile-sideColumn .Profile-lightList{display:none;}",
      hiddenUserHomeFooterOperate: ".Profile-sideColumn .Profile-footerOperations{display:none;}",
      hiddenUserHomeFooter: ".Profile-sideColumn footer{display:none;}",
      hiddenCollectionsCreate: ".Collections-container .Card.CreatorEntrance{display:none;}",
      hiddenCollectionsRecommendFollow: '.Collections-container [data-za-detail-view-path-module="RightSideBar"]>div:last-of-type>.Card{display:none;}',
      hiddenCollectionsCategory: ".Collections-container .Card.GlobalSideBar-category{display:none;}",
      hiddenCollectionsComplementary: '.Collections-container .Card[aria-label="更多分类入口"]{display:none;}',
      hiddenCollectionsFooter: ".Collections-container footer{display:none;}",
      hiddenZhihuZhiShop: ".RichText-EduCardContainer{display:none;}",
      hiddenTopicRightNumberBoard: '[data-za-detail-view-path-module="TopicItem"] .Card .NumberBoard{display:none;}',
      hiddenTopicRightParentChild: '[data-za-detail-view-path-module="TopicItem"] .Card .Card-section{display:none;}',
      hiddenTopicRightFooter: '[data-za-detail-view-path-module="TopicItem"] footer{display:none;}'
    },
    cssForKeysArray: [
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
    ]
  };
  var fnChanger = async (ev) => {
    const doCssVersion = [
      "questionTitleTag",
      "fixedListItemMore",
      "linkShopping",
      "highlightListItem",
      "zoomImageType",
      "zoomImageSize",
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
      "zoomListVideoType",
      "zoomListVideoSize",
      "commitModalSizeSameVersion",
      "videoUseLink"
    ];
    const { name, value, checked, type } = ev;
    const changeBackground = () => {
      myVersion.change();
      loadBackground();
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
      suspensionHomeTab: () => {
        myVersion.change();
        changeSuspensionTab();
      },
      suspensionFind: cacheHeader,
      suspensionSearch: cacheHeader,
      suspensionUser: cacheHeader,
      titleIco: changeICO,
      showGIFinDialog: previewGIF,
      questionCreatedAndModifiedTime: addQuestionCreatedAndModifiedTime,
      highlightOriginal: () => {
        myListenListItem.restart();
      },
      listOutPutNotInterested: () => {
        myListenListItem.restart();
      },
      articleCreateTimeToTop: addArticleCreateTimeToTop,
      versionHomeIsPercent: rangeChoosePercent,
      versionAnswerIsPercent: rangeChoosePercent,
      versionArticleIsPercent: rangeChoosePercent
    };
    await myStorage.setConfigItem(name, type === "checkbox" ? checked : value);
    const nodeName = domById(name);
    type === "range" && nodeName && (nodeName.innerText = value);
    if (/^hidden/.test(name)) {
      myHidden.init();
      return;
    }
    if (doCssVersion.includes(name)) {
      myVersion.change();
      return;
    }
    ob[name] && ob[name]();
  };
  var onInitStyleExtra = () => {
    myHidden.init();
    loadBackground();
    myVersion.init();
    loadFindTheme();
  };
  var initOperate = () => {
    const myOperation = {
      [CLASS_INPUT_CLICK]: fnChanger,
      [CLASS_INPUT_CHANGE]: fnChanger,
      "ctz-button": (even) => {
        myButtonOperation[even.name] && myButtonOperation[even.name]();
      }
    };
    const operation = (even) => {
      const target = even.target;
      const classList = target.classList;
      for (let key in myOperation) {
        classList.contains(key) && myOperation[key](even.target);
      }
    };
    const nodeCTZContent = dom(".ctz-content");
    if (nodeCTZContent) {
      nodeCTZContent.onclick = operation;
      nodeCTZContent.onchange = operation;
    }
    const nodeMenuTop = dom(".ctz-menu-top");
    nodeMenuTop && (nodeMenuTop.onclick = myMenu.click);
    domA(".ctz-preview").forEach((item) => {
      item.onclick = function() {
        myPreview.hide(this);
      };
    });
    domA('[name="button_history_clear"]').forEach((item) => {
      item.onclick = async (event) => {
        const prevHistory = store.getHistory();
        const target = event.target;
        const dataId = target.getAttribute("data-id");
        const isClear = confirm(`是否清空${target.innerText}`);
        if (!isClear)
          return;
        prevHistory[dataId] = [];
        await myStorage.setHistory(prevHistory);
        echoHistory();
      };
    });
    const nodeOpenButton = domById("CTZ_OPEN_BUTTON");
    const nodeCloseDialog = domById("CTZ_CLOSE_DIALOG");
    nodeOpenButton && (nodeOpenButton.onclick = myDialog.open);
    nodeCloseDialog && (nodeCloseDialog.onclick = myDialog.hide);
    initTopStoryRecommendEvent();
    initRootEvent();
  };
  var myButtonOperation = {
    /** 导出配置 */
    configExport: async () => {
      const config = await myStorage.get("pfConfig") || "{}";
      const link = domC("a", {
        href: "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(config),
        download: `知乎编辑器配置-${+/* @__PURE__ */ new Date()}.txt`
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    /** 导入配置 */
    configImport: async function() {
      const nodeImport = dom("[name=textConfigImport]");
      const configImport = nodeImport ? nodeImport.value : "{}";
      const nConfig = JSON.parse(configImport);
      await myStorage.setConfig(nConfig);
      resetData();
    },
    configReset: async function() {
      const isUse = confirm("是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存");
      if (!isUse)
        return;
      const { getConfig, getStorageConfigItem } = store;
      const { filterKeywords = [], removeBlockUserContentList = [] } = getConfig();
      const cacheConfig = getStorageConfigItem("cachePfConfig");
      await myStorage.setConfig({
        ...cacheConfig,
        filterKeywords,
        removeBlockUserContentList
      });
      resetData();
    },
    /** 自定义样式 */
    styleCustom: async function() {
      const nodeText = dom('[name="textStyleCustom"]');
      const value = nodeText ? nodeText.value : "";
      await myStorage.setConfigItem("customizeCss", value);
      myCustomStyle.change(value);
    },
    syncBlack: () => myBlack.sync(0),
    /** 确认更改网页标题 */
    buttonConfirmTitle: async function() {
      const nodeTitle = dom('[name="globalTitle"]');
      await myStorage.setConfigItem("globalTitle", nodeTitle ? nodeTitle.value : "");
      changeTitle();
      message("网页标题修改成功");
    },
    /** 还原网页标题 */
    buttonResetTitle: async function() {
      const { getStorageConfigItem } = store;
      const nodeTitle = dom('[name="globalTitle"]');
      nodeTitle && (nodeTitle.value = getStorageConfigItem("cacheTitle"));
      await myStorage.setConfigItem("globalTitle", "");
      changeTitle();
      message("网页标题已还原");
    }
  };
  var resetData = () => {
    onInitStyleExtra();
    initData();
    onUseThemeDark();
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
  var myCtzTypeOperation = {
    init: function() {
      const params = new URLSearchParams(location.search);
      let ctzType = params.get("ctzType");
      this[ctzType] && this[ctzType]();
    },
    /** 移除、关注问题并关闭网页 */
    "1": function() {
      this.clickAndClose(".QuestionButtonGroup button");
    },
    /** 移除、关注话题并关闭网页 */
    "2": function() {
      this.clickAndClose(".TopicActions .FollowButton");
    },
    /** 移除、关注收藏夹并关闭网页 */
    "3": function() {
      this.clickAndClose(".CollectionDetailPageHeader-actions .FollowButton");
    },
    clickAndClose: (eventname) => {
      const nodeItem = dom(eventname);
      nodeItem && nodeItem.click();
      window.close();
    }
  };
  var myFollowRemove = {
    init: function() {
      const me = this;
      clearTimeout(me.timer);
      me.timer = setTimeout(() => {
        pathnameHasFn({
          questions: () => me.addButtons(this.classOb.questions),
          // topics: () => me.addButtons(this.classOb.topics), // 话题跳转页面内会重定向，暂时隐藏
          collections: () => me.addButtons(this.classOb.collections)
        });
      }, 500);
    },
    addButtons: function(initTypeOb) {
      const me = this;
      const { classNameItem, classHref, ctzType } = initTypeOb;
      domA(`.${classNameItem}`).forEach((item) => {
        const elementButton = domC("button", {
          className: `${me.className} ${me.classNameRemove} ctz-button-block`,
          innerText: "移除关注",
          style: "height: 28px;position: absolute;right: 16px;bottom: 16px;"
        });
        elementButton.onclick = function() {
          const nodeThis = this;
          const nItem = domP(nodeThis, "class", classNameItem);
          const nodeHref = nItem ? nItem.querySelector(classHref) : void 0;
          const qHref = nodeHref ? nodeHref.href : "";
          if (!qHref)
            return;
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
        // 关注的问题
        classNameItem: "List-item",
        classHref: ".QuestionItem-title a",
        ctzType: 1
      },
      topics: {
        // 关注的话题
        classNameItem: "List-item",
        classHref: ".ContentItem-title .TopicLink",
        ctzType: 2
      },
      collections: {
        // 关注的收藏夹
        classNameItem: "List-item",
        classHref: ".ContentItem-title a",
        ctzType: 3
      }
    },
    timer: void 0
  };
  var myPageFilterSetting = {
    timeout: void 0,
    init: function() {
      this.timeout && clearTimeout(this.timeout);
      if (/\/settings\/filter/.test(location.pathname)) {
        this.timeout = setTimeout(() => {
          this.addHTML();
          this.init();
        }, 500);
      }
    },
    addHTML: () => {
      const elementButton = domC("button", {
        className: "ctz-button",
        style: "margin-left: 12px;",
        innerHTML: "移除当前页所有屏蔽话题"
      });
      elementButton.onclick = () => {
        domA(".Tag button").forEach((item) => item.click());
      };
      domA(".css-j2uawy").forEach((item) => {
        if (/已屏蔽话题/.test(item.innerText) && !item.querySelector(".ctz-button")) {
          item.appendChild(elementButton);
        }
      });
    }
  };
  var timer = void 0;
  var userHomeAnswers = () => {
    const { userHomeContentTimeTop } = store.getConfig();
    if (!userHomeContentTimeTop)
      return;
    const doContent = (domList) => {
      for (let i = 0, len = domList.length; i < len; i++) {
        const nodeItem = domList[i];
        const nodeTitle = nodeItem.querySelector(".ContentItem-title");
        if (!nodeTitle || nodeItem.querySelector(`.${CLASS_TIME_ITEM}`))
          continue;
        const nodeDateCreate = nodeItem.querySelector('[itemprop="dateCreated"]');
        const nodeDatePublished = nodeItem.querySelector('[itemprop="datePublished"]');
        const nodeDateModified = nodeItem.querySelector('[itemprop="dateModified"]');
        let innerHTML = "";
        if (nodeDateCreate) {
          const dateCreate = nodeDateCreate.getAttribute("content") || "";
          const dateCreateFormatter = timeFormatter(dateCreate);
          innerHTML += `<div>创建时间：${dateCreateFormatter}</div>`;
        }
        if (nodeDatePublished) {
          const datePublished = nodeDatePublished.getAttribute("content") || "";
          const datePublishedFormatter = timeFormatter(datePublished);
          innerHTML += `<div>发布时间：${datePublishedFormatter}</div>`;
        }
        if (nodeDateModified) {
          const dateModified = nodeDateModified.getAttribute("content") || "";
          const dateModifiedFormatter = timeFormatter(dateModified);
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
  var topBlockUser = () => {
    const { userHomeTopBlockUser } = store.getConfig();
    const nodeUserHeaderOperate = dom(".ProfileHeader-contentFooter .MemberButtonGroup");
    const nodeFooterOperations = dom(".Profile-footerOperations");
    if (!nodeUserHeaderOperate || !userHomeTopBlockUser || !nodeFooterOperations)
      return;
    const isMe = nodeUserHeaderOperate.innerText.includes("编辑个人资料");
    if (isMe)
      return;
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
    if (needRedirect())
      return;
    GM_registerMenuCommand("⚙️ 设置", () => {
      myDialog.open();
    });
    const T0 = performance.now();
    const { hostname, host } = location;
    const { setStorageConfigItem, getStorageConfigItem, getConfig, setUserinfo, setHomeFetch } = store;
    let isHaveHeadWhenInit = true;
    async function onDocumentStart() {
      if (!HTML_HOOTS.includes(hostname) || window.frameElement)
        return;
      if (!document.head) {
        fnLog("not find document.head, waiting for reload...");
        isHaveHeadWhenInit = false;
        return;
      }
      fixVideoAutoPlay();
      fnInitDomStyle("CTZ_STYLE", INNER_CSS);
      const config = getConfig();
      setStorageConfigItem("cachePfConfig", config);
      await myStorage.initConfig();
      await myStorage.initHistory();
      initHistoryView();
      onInitStyleExtra();
      EXTRA_CLASS_HTML[host] && dom("html").classList.add(EXTRA_CLASS_HTML[host]);
      const { fetchInterceptStatus } = getConfig();
      if (fetchInterceptStatus) {
        fnLog("已开启 fetch 接口拦截");
        const prevHeaders = getStorageConfigItem("fetchHeaders");
        const originFetch = fetch;
        window.fetch = (url, opt) => {
          if (opt && opt.headers) {
            setStorageConfigItem("fetchHeaders", {
              ...prevHeaders,
              ...opt.headers
            });
            if (/\/api\/v4\/members\/[\w\W]+\/answers/.test(url)) {
              setHomeFetch("answer", { url, header: opt.headers });
            }
            if (/\/api\/v4\/members\/[\w\W]+\/articles/.test(url)) {
              setHomeFetch("articles", { url, header: opt.headers });
            }
          }
          return originFetch(url, opt);
        };
        setUserinfo(await fetchGetUserinfo());
      }
    }
    onDocumentStart();
    const timerLoadHead = () => {
      setTimeout(() => {
        if (!isHaveHeadWhenInit) {
          document.head ? onDocumentStart() : timerLoadHead();
        }
      }, 100);
    };
    timerLoadHead();
    const timerLoadBody = () => {
      setTimeout(() => {
        document.body ? createLoad() : timerLoadBody();
      }, 100);
    };
    timerLoadBody();
    const createLoad = async () => {
      myListenListItem.getScriptData();
      if (HTML_HOOTS.includes(hostname) && !window.frameElement) {
        const { removeTopAD } = getConfig();
        initHTML();
        initOperate();
        initData();
        loadBackground();
        myVersion.initAfterLoad();
        myCustomStyle.init();
        initBlockWords();
        initResizeObserver();
        myCtzTypeOperation.init();
        echoHistory();
        dom('[name="useSimple"]').onclick = async function() {
          const isUse = confirm("是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存");
          if (!isUse)
            return;
          myStorage.setConfig({
            ...getConfig(),
            ...CONFIG_SIMPLE
          });
          onDocumentStart();
          initData();
        };
        if (removeTopAD) {
          mouseEventClick(dom("svg.css-1p094v5"));
        }
      }
      historyToChangePathname();
      if (host === "zhuanlan.zhihu.com") {
        addArticleCreateTimeToTop();
        const nodeArticle = dom(".Post-content");
        if (nodeArticle) {
          addButtonForArticleExportPDF(nodeArticle);
          initVideoDownload(nodeArticle);
        }
      }
      fnLog(`加载完毕, 加载时长: ${Math.floor((performance.now() - T0) / 10) / 100}s, 可使用 shift + . 或点击左侧眼睛按钮唤起修改器弹窗`);
    };
    const historyToChangePathname = () => {
      pathnameHasFn({
        question: () => {
          addQuestionCreatedAndModifiedTime();
          const nodeQuestionAnswer = dom(".QuestionAnswer-content");
          nodeQuestionAnswer && fnJustNum(nodeQuestionAnswer);
          initInviteOnce();
        },
        filter: () => myPageFilterSetting.init(),
        collection: () => myCollectionExport.init(),
        following: () => myFollowRemove.init(),
        answers: () => {
          throttle(addBtnForExportPeopleAnswer)();
          userHomeAnswers();
        },
        posts: () => {
          throttle(addBtnForExportPeopleArticles)();
          userHomeAnswers();
        },
        people: () => {
          topBlockUser();
        }
      });
    };
    const changeHistory = () => {
      historyToChangePathname();
      myListenListItem.reset();
      myListenSearchListItem.reset();
      myListenAnswerItem.reset();
    };
    window.addEventListener("popstate", changeHistory);
    window.addEventListener("pushState", changeHistory);
    window.addEventListener("load", () => {
      const nodeSignModal = dom(".signFlowModal");
      const nodeSignClose = nodeSignModal && nodeSignModal.querySelector(".Modal-closeButton");
      nodeSignClose && nodeSignClose.click();
      if (host === "zhuanlan.zhihu.com") {
        const nodeArticle = dom(".Post-content");
        if (nodeArticle) {
          initVideoDownload(nodeArticle);
        }
      }
      pathnameHasFn({
        zvideo: () => {
          const domFind = dom(".ZVideo-mainColumn");
          domFind && initVideoDownload(domFind);
        }
      });
    });
    window.addEventListener("keydown", (event) => {
      const { hotKey } = getConfig();
      if (hotKey) {
        if (event.key === ">" || event.key === "》") {
          const nodeDialog = domById(ID_DIALOG);
          nodeDialog && nodeDialog.style.display === "none" ? myDialog.open() : myDialog.hide();
        }
      }
      if (event.key === "Escape") {
        myDialog.hide();
      }
      keydownNextImage(event);
    });
    document.addEventListener("copy", function(event) {
      let clipboardData = event.clipboardData || window.clipboardData;
      if (!clipboardData)
        return;
      const selection = window.getSelection();
      let text = selection ? selection.toString() : "";
      if (text) {
        event.preventDefault();
        clipboardData.setData("text/plain", text);
      }
    });
    window.addEventListener(
      "scroll",
      throttle(() => {
        const { suspensionPickUp } = getConfig();
        if (suspensionPickUp) {
          suspensionPackUp(domA(".List-item"));
          suspensionPackUp(domA(".TopstoryItem"));
          suspensionPackUp(domA(".AnswerCard"));
        }
      }, 100),
      false
    );
  })();
})();
