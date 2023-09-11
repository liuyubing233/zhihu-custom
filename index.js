// ==UserScript==
// @name         知乎修改器🤜持续更新🤛努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      4.1.0
// @description  页面模块自定义隐藏，列表及回答内容过滤，保存浏览历史记录，推荐页内容缓存，一键邀请，复制代码块删除版权信息，列表种类和关键词强过滤并自动调用「不感兴趣」接口，屏蔽用户回答，回答视频下载，回答内容按照点赞数和评论数排序，设置自动收起所有长回答或自动展开所有回答，移除登录提示弹窗，设置过滤故事档案局和盐选科普回答等知乎官方账号回答，手动调节文字大小，切换主题及夜间模式调整，隐藏知乎热搜，列表添加标签种类，去除广告，设置购买链接显示方式，收藏夹内容导出为PDF，一键移除所有屏蔽选项，外链直接打开，更多功能请在插件里体验...
// @compatible   edge Violentmonkey
// @compatible   edge Tampermonkey
// @compatible   chrome Violentmonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Violentmonkey
// @compatible   firefox Tampermonkey
// @author       liuyubing
// @license      MIT
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-start
// ==/UserScript==

"use strict";
(() => {
  var CONFIG_HIDDEN_DEFAULT = {
    hiddenAnswerRightFooter: true,
    hiddenReadMoreText: true,
    hiddenAD: true,
    hiddenDetailFollow: true,
    hidden618HongBao: true
  };
  var CONFIG_FILTER_DEFAULT = {
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
    removeBlockUserContentList: [],
    removeItemAboutAD: false,
    removeItemAboutArticle: false,
    removeItemAboutVideo: false,
    removeItemQuestionAsk: false,
    removeLessVote: false,
    lessVoteNumber: 100,
    removeLessVoteDetail: false,
    lessVoteNumberDetail: 100,
    removeAnonymousAnswer: false,
    removeMyOperateAtFollow: false
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
    linkShopping: "1",
    linkAnswerVideo: "1",
    hiddenAnswerItemActions: true,
    hiddenAnswerItemTime: true
  };
  var SAVE_HISTORY_NUMBER = 500;
  var Store = class {
    constructor() {
      /** 修改器配置 */
      this.pfConfig = {
        ...CONFIG_HIDDEN_DEFAULT,
        ...CONFIG_FILTER_DEFAULT,
        ...CONFIG_SUSPENSION,
        customizeCss: "",
        answerOpen: "",
        filterKeywords: [],
        showBlockUser: true,
        versionHome: "1000",
        versionAnswer: "1000",
        versionArticle: "690",
        zoomImageType: "0",
        zoomImageSize: "600",
        showGIFinDialog: true,
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
        linkAnswerVideo: "0",
        fontSizeForList: 15,
        fontSizeForAnswer: 15,
        fontSizeForArticle: 16,
        zoomListVideoType: "0",
        zoomListVideoSize: "500",
        hotKey: true,
        theme: "2" /* 自动 */,
        themeLight: "0" /* 默认 */,
        themeDark: "1" /* 夜间护眼一 */
      };
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
      this.setConfig = this.setConfig.bind(this);
      this.getConfig = this.getConfig.bind(this);
      this.setHistory = this.setHistory.bind(this);
      this.setHistoryItem = this.setHistoryItem.bind(this);
      this.getHistory = this.getHistory.bind(this);
      this.getHistoryItem = this.getHistoryItem.bind(this);
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
    }
    setConfig(inner) {
      this.pfConfig = inner;
    }
    getConfig() {
      return this.pfConfig;
    }
    setHistory(inner) {
      this.pfHistory = inner;
    }
    setHistoryItem(key, content) {
      this.pfHistory[key] = content;
    }
    getHistory() {
      return this.pfHistory;
    }
    getHistoryItem(key) {
      return this.pfHistory[key];
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
  };
  var store = new Store();
  var doFetchNotInterested = ({ id, type }) => {
    const nHeader = store.getStorageConfigItem("fetchHeaders");
    delete nHeader["vod-authorization"];
    delete nHeader["content-encoding"];
    delete nHeader["Content-Type"];
    delete nHeader["content-type"];
    fetch("/api/v3/feed/topstory/uninterestv2", {
      body: `item_brief=${encodeURIComponent(JSON.stringify({ source: "TS", type, id }))}`,
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
    if (!nodeP) {
      return void 0;
    }
    if (!attrName || !attrValue) {
      return nodeP;
    }
    if (nodeP === document.body) {
      return void 0;
    }
    const attrValueList = (nodeP.getAttribute(attrName) || "").split(" ");
    return attrValueList.includes(attrValue) ? nodeP : domP(nodeP, attrName, attrValue);
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
      const valueParse = JSON.parse(value);
      valueParse.t = +/* @__PURE__ */ new Date();
      const v = JSON.stringify(valueParse);
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
      return Promise.resolve({ ...prevConfig, ...c });
    },
    initHistory: async function() {
      const prevHistory = store.getHistory();
      const nHistory = await myStorage.get("pfHistory");
      const h = nHistory ? JSON.parse(nHistory) : prevHistory;
      return Promise.resolve(h);
    },
    configUpdateItem: (
      /** 修改配置中的值 */
      async function(key, value) {
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
        await myStorage.set("pfConfig", JSON.stringify(prevConfig));
      }
    ),
    configUpdate: (
      /** 更新配置 */
      async function(params) {
        store.setConfig(params);
        await myStorage.set("pfConfig", JSON.stringify(params));
      }
    )
  };
  var THEMES = [
    { label: "浅色", value: "0" /* 浅色 */, background: "#fff", color: "#000" },
    { label: "深色", value: "1" /* 深色 */, background: "#000", color: "#fff" },
    { label: "自动", value: "2" /* 自动 */, background: "linear-gradient(to right, #fff, #000)", color: "#000" }
  ];
  var THEME_CONFIG_LIGHT = {
    ["0" /* 默认 */]: { name: "默认", background: "#ffffff", background2: "" },
    ["1" /* 护眼红 */]: { name: "护眼红", background: "#ffe4c4", background2: "#fff4e7" },
    ["2" /* 杏仁黄 */]: { name: "杏仁黄", background: "#faf9de", background2: "#fdfdf2" },
    ["3" /* 青草绿 */]: { name: "青草绿", background: "#cce8cf", background2: "#e5f1e7" },
    ["4" /* 极光灰 */]: { name: "极光灰", background: "#eaeaef", background2: "#f3f3f5" },
    ["5" /* 葛巾紫 */]: { name: "葛巾紫", background: "#e9ebfe", background2: "#f2f3fb" }
  };
  var THEME_CONFIG_DARK = {
    ["0" /* 夜间模式默认 */]: { name: "默认", color: "#fff", color2: "#999", background: "#121212", background2: "#333333" },
    ["1" /* 夜间护眼一 */]: { name: "夜间护眼一", color: "#f7f9f9", color2: "#161d23", background: "#15202b", background2: "#38444d" },
    ["2" /* 夜间护眼二 */]: { name: "夜间护眼二", color: "#f7f9f9", color2: "#161d23", background: "#1f1f1f", background2: "#303030" },
    ["3" /* 夜间护眼三 */]: { name: "夜间护眼三", color: "#f7f9f9", color2: "#161d23", background: "#272822", background2: "#383932" }
  };
  var INPUT_NAME_THEME = "theme";
  var INPUT_NAME_THEME_DARK = "themeDark";
  var INPUT_NAME_ThEME_LIGHT = "themeLight";
  var HTML_HOOTS = ["www.zhihu.com", "zhuanlan.zhihu.com"];
  var ID_DIALOG = "CTZ_DIALOG_MAIN";
  var ID_FILTER_WORDS = "CTZ_FILTER_WORDS";
  var ID_BLOCK_LIST = "CTZ-BLOCK-LIST";
  var ID_BUTTON_SYNC_BLOCK = "CTZ-BUTTON-SYNC-BLOCK";
  var CLASS_INPUT_CLICK = "ctz-i";
  var CLASS_INPUT_CHANGE = "ctz-i-change";
  var CLASS_REMOVE_BLOCK = "ctz-remove-block";
  var CLASS_NOT_INTERESTED = "ctz-not-interested";
  var OB_CLASS_FOLD = {
    on: "ctz-fold-open",
    off: "ctz-fold-close"
  };
  var EXTRA_CLASS_HTML = {
    "zhuanlan.zhihu.com": "zhuanlan",
    "www.zhihu.com": "zhihu"
  };
  var FILTER_FOLLOWER_OPERATE = [
    { key: "removeFollowVoteAnswer", rep: "赞同了回答" },
    { key: "removeFollowVoteArticle", rep: "赞同了文章" },
    { key: "removeFollowFQuestion", rep: "关注了问题" }
  ];
  var HIDDEN_DIRECTION = {
    /** 基础设置 */
    CTZ_BASIS: [
      [{ value: "hiddenAD", label: "广告" }],
      [{ value: "hiddenTopAD", label: "顶部推广（只能物理隐藏，会存在颜色错误）" }],
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
        { value: "justVoteNum", label: "回答操作 - 赞同按钮仅显示赞同数" },
        { value: "justCommitNum", label: "回答操作 - 评论按钮仅显示评论数" }
      ],
      [
        { value: "hiddenCommitReply", label: "评论「回复」按钮" },
        { value: "hiddenCommitVote", label: "评论「点赞」按钮" },
        { value: "hiddenCommitBottom", label: "评论底部信息" }
      ]
    ],
    /** 首页列表设置 */
    CTZ_LIST: [
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
    ],
    /** 回答详情设置 */
    CTZ_ANSWER: [
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
        { value: "hiddenAnswerItemTime", label: "回答底部发布编辑时间" },
        { value: "hiddenReward", label: "赞赏按钮" },
        { value: "hidden618HongBao", label: "618红包链接" }
      ],
      [
        { value: "hiddenAnswerRightFooter", label: "详情右侧信息栏" },
        { value: "hiddenAnswerRightFooterAnswerAuthor", label: "信息栏关于作者" },
        { value: "hiddenAnswerRightFooterFavorites", label: "信息栏被收藏次数" },
        { value: "hiddenAnswerRightFooterRelatedQuestions", label: "信息栏相关问题" },
        { value: "hiddenAnswerRightFooterContentList", label: "信息栏相关推荐" },
        { value: "hiddenAnswerRightFooterFooter", label: "信息栏知乎指南" }
      ]
    ],
    /** 文章专栏设置 */
    CTZ_ARTICLE: [
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
  };
  var HIDDEN_ANSWER_TAG = {
    removeFromYanxuan: "盐选专栏",
    removeUnrealAnswer: "虚构创作"
  };
  var HIDDEN_ANSWER_ACCOUNT = {
    removeStoryAnswer: "故事档案局",
    removeYanxuanAnswer: "盐选科普",
    removeYanxuanRecommend: "盐选推荐",
    removeYanxuanCPRecommend: "盐选测评室"
  };
  var FOOTER_HTML = `<a href="https://github.com/superPufferfish/custom-zhihu" target="_blank">Github⭐</a><a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8" target="_blank">GreasyFork</a>`;
  var DEFAULT_FUNCTION = [
    '外链直接打开<div class="ctz-commit">知乎里所有外部链接的重定向去除，可以直接访问</div>',
    "移除登录提示弹窗",
    '一键移除所有屏蔽选项，点击「话题黑名单」编辑按钮出现按钮<div class="ctz-commit">知乎屏蔽标签每次只显示部分，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽标签</div><a href="/settings/filter" target="_blank">前往屏蔽页</a>',
    '回答视频下载<div class="ctz-commit">回答内容视频左上角会生成一个下载按钮，点击即可下载视频</div>',
    '收藏夹内容导出为 PDF<div class="ctz-commit">点击收藏夹名称上方「生成PDF」按钮，可导出当前页码的收藏夹详细内容</div>',
    '回答内容按照点赞数和评论数排序<div class="ctz-commit">6-1. 点击回答右上角的排序按钮，点击【点赞数排序】或【评论数排序】后，页面刷新等待排序完成；<br/>6-2. 因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序；<br/>6-3. 为了防止页面错乱，只对前20条进行排序，后续新加载的数据不做排序处理</div>',
    '个人主页「我关注的问题」、「我关注的收藏」可以一键移除或将移除的内容添加回关注<div class="ctz-commit">由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面</div>',
    "推荐页内容链接根据有新到旧进行缓存，可缓存 100 条；缓存内容在「编辑器 - 历史记录 - 推荐列表缓存」",
    "可保存 100 条浏览历史记录链接，内容为打开的问题、文章、视频；「编辑器 - 历史记录 - 浏览历史记录」"
  ];
  var ICO_URL = {
    zhihu: "https://static.zhihu.com/heifetz/favicon.ico",
    github: "https://github.githubassets.com/pinned-octocat.svg",
    juejin: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png",
    csdn: "https://g.csdnimg.cn/static/logo/favicon32.ico",
    runoob: "https://static.runoob.com/images/favicon.ico",
    vue: "https://cli.vuejs.org/icons/apple-touch-icon-152x152.png",
    bilibili: "https://www.bilibili.com/favicon.ico",
    lanhu: "https://sso-cdn.lanhuapp.com/ssoweb/favicon.ico",
    yuque: "https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*vMxOQIh4KBMAAAAAAAAAAAAADvuFAQ/original",
    mailQQ: "https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_96h.png",
    mail163: "https://mail.163.com/favicon.ico",
    weibo: "https://weibo.com/favicon.ico",
    qzone: "https://qzonestyle.gtimg.cn/aoi/img/logo/favicon.ico?max_age=31536000",
    baidu: "https://www.baidu.com/favicon.ico"
  };
  var echoData = () => {
    const pfConfig = store.getConfig();
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
    domA(`.${CLASS_INPUT_CLICK}`).forEach(doEcho);
    domA(`.${CLASS_INPUT_CHANGE}`).forEach(doEcho);
    echo.text(dom('[name="globalTitle"]'));
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
      const { themeDark = "1" /* 夜间护眼一 */, themeLight = "0" /* 默认 */ } = store.getConfig();
      const innerHTML = this.change(themeDark, themeLight);
      fnInitDomStyle("CTZ_STYLE_BACKGROUND", innerHTML);
    },
    change: function(themeDark, themeLight) {
      if (this.isUseDark())
        return this.dark(themeDark);
      if (themeLight === "0" /* 默认 */)
        return this.default();
      return this.light(themeLight);
    },
    isUseDark: () => {
      const { theme = "2" /* 自动 */ } = store.getConfig();
      if (theme === "2" /* 自动 */) {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        return prefersDarkScheme.matches;
      }
      return theme === "1" /* 深色 */;
    },
    default: () => ".GlobalSideBar-navList{background: #fff}",
    dark: (darkKey) => {
      const { background, background2, color, color2 } = THEME_CONFIG_DARK[darkKey];
      const cssBg = `#${ID_DIALOG},.ctz-set-title>span,#CTZ-BLOCK-LIST .ctz-black-item,.css-ul9l2m,.css-mq2czy,.css-1da4iq8,.css-oqge09,.css-lpo24q,.css-16zrry9,.css-u8y4hj,.css-805ti0,.css-12yl4eo,.css-1117lk0:hover,.css-1yq3jl6,.css-mzh2tk,.css-6mdg56,.css-mjg7l1,.css-q2yfd6,.css-1ggwojn,.css-xqep55,.css-1vtgv04,.css-1ulkprw,.Modal-modal-wf58,.css-1j5d3ll,.css-ovbogu,.css-1v840mj,.css-huwkhm,.css-akuk2k,.css-1ne387d,.css-ygii7h,.css-1h84h63,.css-1bwzp6r,.css-w215gm,.css-iebf30,.css-1qjzmdv,.css-g3xs10,.css-jlyj5p,.Card,.ContentItem-actions,.QuestionHeader,.ShelfTopNav-root-eb3BX,.Modal-inner,.zhi,.Notifications-footer,.QuestionHeader-footer,.MoreAnswers .List-headerText,.EQvEDwRqICOvs_x_kUWW,.ProfileHeader-wrapper,.SettingsFAQ,.QuestionWaiting-types,.Popover-content,.Post-content,.KfeCollection-PcCollegeCard-root,.SearchTabs,.GlobalSideBar-navList,.WebPage-root-g7WXc,.KfeCollection-FeedBlockSetting,.AnswerForm-footer,.CreatorRecruitFooter--fix,body .Recruit-buttonFix-placeholder,.CreatorIndex-BottomBox-Item,.Recommendations-Main,.QZcfWkCJoarhIYxlM_sG,.Sticky{background: ${background}!important;}`;
      const cssBg2 = `.ctz-content-right>div:nth-of-type(2n),.ctz-content-right>div:nth-of-type(2n) .ctz-set-title > span,.css-1vwmxb4:hover,.css-1xegbra,.css-xevy9w tbody tr:nth-of-type(odd),.css-r9mkgf,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1gnqr8i,.css-1stnbni:hover,.css-5abu0r,.css-n7efg0,.css-ssvpr2,.css-m9gn5f,.FeedbackForm-inputBox-15yJ,.css-106u01g,.css-c29erj,.css-1xk2o8d,.FeedbackForm-canvasContainer-mrde,._Invite_container_30SP,.utils-frostedGlassEffect-2unM,.css-16eulm,.index-root-3h4H5,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.PubIndex-CategoriesHeader,.AppHeader,body,.UserPageItem--withButton,.QuestionWaiting-typesTopper,.PostItem,.LinkCard.new,.signQr-container,.css-16h0l39{background:${background2}!important;}`;
      const cssBgTransparent = `._AccountSettings_accountLine_3HJS,.css-1gfpqrv,.css-13dk2dh,.css-u6lvao,.css-u6lvao:before,.css-u6lvao:after,.Community-ContentLayout{background: transparent!important;}`;
      const cssC = `.ctz-footer,.css-k49mnn,.css-qj3urb,.css-1bdtll5,.css-x9rxz4,.css-1iubajs,.css-186oz3i,.css-7v0haq,.css-1yj4z27,.css-1204lgo,.css-1ng3oge,.css-5abu0r,.css-p52k8h,.css-1dpmqsl,.css-1myqwel,.css-1ykn8va,.css-1117lk0,.css-m9gn5f,.css-oqge09,.css-8u7moq,.css-k0fmhp,css-bc6idi,.css-nsw6sf,.css-25wprl,.css-294ohd,.css-1nmddht,.css-11nn00q,.css-1c4skpi,.GlobalSidebar-appDownloadTip-33iw,.css-pgcb4h,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-jwse5c,.css-hd7egx,.css-1zcaix,.css-4a3k6y,.css-eonief,.css-dy7bva,.css-sthon2,.css-teb1rp,.css-uq88u1,.css-nymych,.css-1gomreu,.css-tnsaxh,.css-jt1vdv,.css-tfs9zi,.css-1m2h1o9,.css-16p5ii9,.css-kkim14,.css-1mx84bz,.css-74475r,.css-3dzvwq,.css-1ab1nhi,.css-1l1sy07,.css-1bbvash,.css-1stnbni:hover,.css-tad50r,.css-1rd0h6f,.css-1k10w8f,.css-195d1c3,.css-1bfi5pu,.css-kk7b9z,.CopyrightSettings h2,.CopyrightSettings,.LiveItem-title-2qes,.GlobalSidebar-introItem-24PB h3,.Card-card-2K6v,.LiveItem-description-Tliw,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.zu-main-content,.zu-main-sidebar,.FeedbackForm-form-1uUg,.CopyrightSettings h1,.index-root-3h4H5,.TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7,.ZVideo-body .UserLink,.ZVideo-body .CommentRichText,.CommentContent,.TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f,.RichContent-collapsedText,.ContentItem-arrowIcon,.TopNavBar-inner-baxks .TopNavBar-tab-hBAaU a,.UserHeader-Info,.NavItemClassName,#creator-statistic,#creator-task-dayTask,#creator-task-creatorTask,#creator-manual{color: ${color}!important}`;
      const cssC2 = `.css-o7lu8j{color: ${color2}!important}`;
      const cssCB2 = `css-1x3upj1,.ctz-content-left>a:hover,.ctz-button{color: ${background2}!important}`;
      const cssBorderB = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
      const cssDialogBorder = `#${ID_DIALOG}{border: 1px solid ${background2}}.ctz-menu-top>a.target{border-bottom: 4px solid ${color};color: ${color};}`;
      const addPrefix = (i) => i.split(",").map((i2) => `html[data-theme=dark] ${i2}`).join(",");
      const pageLearning = `.TopNavBar-fixMode-qXKMs,.index-tabWrap-4Smyx,.index-bannerItem-3o3D7,.LearningRouteCard-pathContent-j3jVv{background: ${background}!important;}.LearningRouteCard-pathItem-xin1f .LearningRouteCard-content-kw2RW .LearningRouteCard-title-do7ND{color: ${color}!important;}`;
      return addPrefix(cssBg + cssBg2 + cssBgTransparent + cssC + cssCB2 + cssC2 + cssBorderB + cssDialogBorder + pageLearning);
    },
    light: (
      /** 浅色背景色 */
      (lightKey) => {
        const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
        const cssBg = `.ctz-content-right>div:nth-of-type(2n),.ctz-content-right>div:nth-of-type(2n) .ctz-set-title > span,body,.Post-content,.HotList,.HotListNavEditPad,.ColumnPageHeader,.ZVideoToolbar,.position-suspensionSearch.focus,.Modal-modal-wf58,.Community-ContentLayout,.App-root-8rX7N,.MenuBar-root-rQeFm,.TopNavBar-fixMode-4nQmh,.App-active-dPFhH,.CategorySection-categoryList-mrt3Z,.zhuanlan .Post-content .ContentItem-actions,.zhuanlan .ContentItem-actions,.LinkCard.new,.WebPage-root-g7WXc,.KfeCollection-FeedBlockSetting,.ShelfTopNav-root-eb3BX,.signQr-container,.css-16h0l39{background-color: ${background}!important;}`;
        const cssBg2 = `#${ID_DIALOG},.ctz-set-title>span,#${ID_DIALOG} select,#${ID_DIALOG} input,#${ID_DIALOG} textarea,#CTZ_SET_FILTER,.QuestionHeader,.Card,.HotItem,.Recommendations-Main,.GlobalSideBar-navList,.SearchSubTabs,.CommentsV2-withPagination,.QuestionHeader-footer,.HoverCard,.ContentItem-actions,.MoreAnswers .List-headerText,.Topbar,.CommentsV2-footer,.Select-plainButton,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreSpecialCard,.ExploreColumnCard,.ExploreHomePage-ContentSection-moreButton a,.QuestionWaiting-types,.AutoInviteItem-wrapper--desktop,.Popover-content,.Notifications-footer,.SettingsFAQ,.Popover-arrow:after,.Messages-footer,.Modal-inner,.RichContent-actions,.KfeCollection-FeedBlockSetting,.CommentListV2-header-divider,.Input-wrapper:not(.Input-wrapper--grey),.TopstoryItem .ZVideoToolbar,.SearchTabs,.Topic-bar,.VotableTopicCard,textarea.FeedbackForm-inputBox-15yJ,.FeedbackForm-canvasContainer-mrde,.css-mq2czy,.css-lpo24q,.css-16zrry9,.css-1v840mj,.css-ovbogu,.css-1h84h63,.css-u8y4hj,.css-1bwzp6r,.css-w215gm,.InputLike,.AnswerForm-footer,.Editable-toolbar,.Chat,.css-ul9l2m,.Balance-Main .Tabs,.Community,.Report-list tr:nth-child(2n),.Report-Pagination,.Report-list,.Report-header th,._Invite_container_30SP,.css-ssvpr2,.css-1p1lrh0,.zu-main,.utils-frostedGlassEffect-2unM,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.PubIndex-CategoriesHeader,.css-r9mkgf,.CornerButton,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1vtgv04,.WikiLandingHeader,.WikiLanding,.WikiLandingItemCard,.WikiLandingEntryCard,.SideNavs-navContainer-6VkAT,.App-root-cPFwn,.TopNavs-root-rwAr7,.App-root-qzkuH,.App-actionTrigger-cCyD7,.ProductTrigger-root-amaSi,.App-infiniteContainer-nrxGj,.ActionTrigger-content-dPn6H,.App-card-pkbhv,.css-zvnmar,.Login-options,.SignFlowInput-errorMask,.ColumnHomeColumnCard,.KfeCollection-PcCollegeCard-root,.KfeCollection-PcCollegeCard-wrapper,.css-1j5d3ll,.css-iebf30,.css-1qjzmdv,.AnswerForm-footer,.css-g3xs10,.css-jlyj5p,.CommentEditorV2-inputUpload,.css-805ti0,.css-10fqe38,.css-n9os37,.css-sdgtgb,.css-f955pw,.css-6tr06j,.css-pslzz3,.css-10rrwst,.css-1ne387d,.css-1bmbu2d,.css-mjg7l1,.css-1ulkprw,.css-1k8sxfm,.css-a9sbyu,.CreatorIndex-BottomBox-Item,.css-1r9j229,.css-wgpue5,.css-1hwwfws,.css-1clwviw,.css-ndqbqd,.css-19v79p5,.css-f7rzgf,.css-106u01g,.css-c29erj,.Modal-content,.Sticky,.css-2i2hyg,.css-1sz5gzk,.css-vvikez{background-color:${background2}!important;background:${background2}!important;}`;
        const cssBgTransparent = `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn{background-color: transparent!important;}`;
        const borderColor = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
        const nodeAppHeader = dom(".AppHeader");
        const nodeTopStoryC = dom(".Topstory>div:not(.Topstory-container)");
        const elementHC = nodeAppHeader ? nodeAppHeader.classList || [] : [];
        const haveTopAD = nodeTopStoryC && nodeTopStoryC.childElementCount;
        const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : "";
        const cssHeader = `${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : ".AppHeader"}{background-color:${background2}!important;background:${background2}!important;}`;
        return cssBg + cssBg2 + cssBgTransparent + borderColor + cssHeader;
      }
    )
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
      const { getConfig, setConfig } = store;
      const lock = this.lock.class;
      const unlock = this.unlock.class;
      const lockMask = this.lockMask.class;
      const classRemove = "ctz-move-this";
      const iLock = domC("i", { className: `ctz-icon ${this.lock.name}`, innerHTML: "&#xe700;" });
      const iUnlock = domC("i", { className: `ctz-icon ${this.unlock.name}`, innerHTML: "&#xe688;" });
      const dLockMask = domC("div", { className: this.lockMask.name });
      !e.querySelector(lock) && e.appendChild(iLock);
      !e.querySelector(unlock) && e.appendChild(iUnlock);
      !e.querySelector(lockMask) && e.appendChild(dLockMask);
      const pfConfig = getConfig();
      e.querySelector(lock).onclick = async () => {
        await myStorage.configUpdateItem(name + "Fixed", true);
        e.classList.remove(classRemove);
      };
      e.querySelector(unlock).onclick = async () => {
        await myStorage.configUpdateItem(name + "Fixed", false);
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
        const { getConfig, setConfig } = store;
        this.clicks[configName] = e.click;
        e.onmousedown = (ev) => {
          const pfConfig = getConfig();
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
              await myStorage.configUpdateItem(configName, `${isR ? `right: ${evenRight}px;` : `left: ${evenLeft}px;`}top: ${evenTop}px;`);
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
  var myVersion = {
    init: function() {
      fnInitDomStyle(
        "CTZ_STYLE_VERSION",
        this.versionWidth() + this.vImgSize() + this.vQuestionTitleTag() + this.vSusHomeTab() + this.vSusHeader() + this.vFixedListMore() + this.vHighlightListItem() + this.vShoppingLink() + this.vAnswerVideo() + this.vFontSizeContent() + this.vListVideoSize()
      );
    },
    initAfterLoad: function() {
      const pfConfig = this.getConfig();
      domById("CTZ_IMAGE_SIZE_CUSTOM").style.display = pfConfig.zoomImageType === "2" ? "block" : "none";
      domById("CTZ_LIST_VIDEO_SIZE_CUSTOM").style.display = pfConfig.zoomListVideoType === "2" ? "block" : "none";
    },
    change: function() {
      this.initAfterLoad();
      this.init();
    },
    /** 版心大小修改 */
    versionWidth: function() {
      const pfConfig = this.getConfig();
      const versionHome = `.Topstory-mainColumn,.Search-container{width: ${pfConfig.versionHome || "1000"}px!important;}.SearchMain{flex: 1}.Topstory-container,.css-knqde{width: fit-content!important;}`;
      const versionAnswer = `.Question-main .Question-mainColumn,.QuestionHeader-main{flex: 1;}.Question-main .Question-sideColumn{margin-left: 12px;}.QuestionHeader .QuestionHeader-content{margin: 0 auto;padding: 0;max-width: initial!important;}.Question-main,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content{width: ${pfConfig.versionAnswer || "1000"}px!important;}.Question-main .List-item{border-bottom: 1px dashed #ddd;}`;
      const versionArticle = `.zhuanlan .AuthorInfo{max-width: initial;}.Post-NormalMain .Post-Header,.Post-NormalMain>div,.Post-NormalSub>div{width: ${pfConfig.versionArticle || "690"}px!important;}.zhuanlan .Post-SideActions{right: calc(50vw - ${+(pfConfig.versionArticle || "690") / 2 + 150}px)}`;
      return versionHome + versionAnswer + versionArticle;
    },
    /** 图片尺寸修改 */
    vImgSize: function() {
      const pfConfig = this.getConfig();
      const nContent = fnReturnStr(
        `width: ${pfConfig.zoomImageSize}px!important;cursor: zoom-in!important;max-width: 100%!important;`,
        pfConfig.zoomImageType === "2"
      );
      return `.GifPlayer.isPlaying img {cursor:pointer!important;}img.lazy,img.origin_image,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image,.ztext figure .origin_image,.TitleImage{${nContent}}`;
    },
    /** 列表视频回答内容尺寸修改 */
    vListVideoSize: function() {
      const pfConfig = this.getConfig();
      return `.ZVideoItem>div:first-of-type{${fnReturnStr(`width: ${pfConfig.zoomListVideoSize}px!important;`, pfConfig.zoomListVideoType === "2")}}`;
    },
    /** 列表更多按钮移动至题目右侧 */
    vFixedListMore: function() {
      const pfConfig = this.getConfig();
      return fnReturnStr(
        `.Topstory-container .ContentItem-actions .ShareMenu ~ div.ContentItem-action{visibility: visible!important;position: absolute;top: 20px;right: 10px;}`,
        pfConfig.fixedListItemMore
      );
    },
    /** 内容标题添加类别显示 */
    vQuestionTitleTag: function() {
      const pfConfig = this.getConfig();
      return fnReturnStr(
        `.AnswerItem .ContentItem-title::before{content:'问答';background:#ec7259}.ZVideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}.ZvideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}.ArticleItem .ContentItem-title::before{content:'文章';background:#00965e}.ContentItem .ContentItem-title::before{margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.TopstoryQuestionAskItem .ContentItem-title::before{content:'提问';background:#533b77}`,
        pfConfig.questionTitleTag
      );
    },
    /** 首页问题列表切换模块悬浮 */
    vSusHomeTab: function() {
      const pfConfig = this.getConfig();
      const { themeDark = "1" /* 夜间护眼一 */, themeLight = "0" /* 默认 */ } = pfConfig;
      const background = isDark() ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background;
      return fnReturnStr(
        `.Topstory-container .TopstoryTabs{${pfConfig.suspensionHomeTabPo}position:fixed;z-index:100;display:flex;flex-direction:column;height:initial!important;}.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}.Topstory-container .TopstoryTabs>a::after{font-size:16px !important;display:inline-block;padding:6px 8px;margin-bottom:4px;border:1px solid #999999;color:#999999;background: ${background || "transparent"};}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link {margin:0!important}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after{color:#0066ff!important;border-color:#0066ff!important;}.Topstory [aria-controls='Topstory-recommend']::after{content:'推';}.Topstory [aria-controls='Topstory-follow']::after{content:'关';border-top-left-radius:4px;border-top-right-radius:4px;}.Topstory [aria-controls='Topstory-hot']::after{content:'热';}.Topstory [aria-controls="Topstory-zvideo"]::after{content:'视';border-bottom-left-radius:4px;border-bottom-right-radius:4px}.Topstory-tabs{border-color: transparent!important;}`,
        pfConfig.suspensionHomeTab
      );
    },
    /** 顶部三大块悬浮 */
    vSusHeader: function() {
      const pfConfig = this.getConfig();
      const { themeDark = "1" /* 夜间护眼一 */, themeLight = "0" /* 默认 */ } = pfConfig;
      const background = isDark() ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background;
      return `.position-suspensionFind{${pfConfig.suspensionFindPo}}.position-suspensionUser{${pfConfig.suspensionUserPo}}.position-suspensionSearch{${pfConfig.suspensionSearchPo}}.position-suspensionFind .Tabs-link{border:1px solid #999999;color:#999999;background: ${background || "transparent"};}.position-suspensionFind .Tabs-link.is-active{color:#0066ff!important;border-color:#0066ff!important;}.position-suspensionUser .css-1m60na {display: none;}.position-suspensionUser .css-1n0eufo{margin-right: 0;}`;
    },
    /** 列表内容点击高亮边框 */
    vHighlightListItem: function() {
      const pfConfig = this.getConfig();
      return fnReturnStr(
        `.List-item:focus,.TopstoryItem:focus,.HotItem:focus{box-shadow:0 0 0 2px #fff,0 0 0 5px rgba(0, 102, 255, 0.3)!important;outline:none!important;transition:box-shadow 0.3s!important;}`,
        pfConfig.highlightListItem
      );
    },
    vShoppingLink: function() {
      const pfConfig = this.getConfig();
      const cssObj = {
        0: "",
        1: '.MCNLinkCard-imageContainer,.MCNLinkCard-button,.MCNLinkCard-source,.ecommerce-ad-commodity-img,.ecommerce-ad-commodity-box-icon,.RichText-MCNLinkCardContainer .BottomInfo,.CPSCommonCard-imageBox,.RedPacketCard-imageBox,.CPSCommonCard-tool,.CPSCommonCard-subtitle,.RedPacketCard-subtitle,.RedPacketCard-tool{display: none!important;}.MCNLinkCard,.MCNLinkCard-card,.ecommerce-ad-commodity,.RichText-MCNLinkCardContainer .GoodsRecommendCard,.CPSCommonCard,.RedPacketCard-info,.RedPacketCard{min-height: 0!important;background: transparent!important;width:100%!important;max-width:100%!important;}.MCNLinkCard-cardContainer,.ecommerce-ad-commodity,.ecommerce-ad-commodity-main,.RedPacketCard,.CPSCommonCard{padding: 0!important;}.MCNLinkCard,.MCNLinkCard-info{margin: 0!important;}.MCNLinkCard-info,.ecommerce-ad-commodity-main{flex-direction: row!important;}.MCNLinkCard-price{padding-left: 12px;}.ecommerce-ad-commodity-box .ecommerce-ad-commodity{height: auto!important;}.ecommerce-ad-commodity-box-main-second{width: auto!important;}.MCNLinkCard-titleContainer,.ecommerce-ad-commodity-main-content-des span,.CPSCommonCard-title,.RedPacketCard-title{color: #fd8d55!important;justify-content: start!important;}.MCNLinkCard-titleContainer::before,.ecommerce-ad-commodity-main-content-des span::before,.CPSCommonCard-title::before,.RedPacketCard-title::before{content: "购物链接："}.MCNLinkCard-title{color: #fd8d55!important;}',
        2: "a.MCNLinkCard,.RichText-ADLinkCardContainer,.ecommerce-ad-commodity-box,.ecommerce-ad-box,.RichText-MCNLinkCardContainer{display: none!important;}"
      };
      return cssObj[pfConfig.linkShopping || "0"];
    },
    vAnswerVideo: function() {
      const pfConfig = this.getConfig();
      const cssObj = {
        0: "",
        1: `.VideoAnswerPlayer-video{display: none;}.VideoAnswerPlayer .VideoAnswerPlayer-stateBar::before{content: '视频链接';color: #f77a2d;margin-right: 12px}.VideoAnswerPlayer:hover{opacity: 0.8}.ZVideoLinkCard-playerContainer, .VideoContributionAnswer-video,.css-ujtn9j,.ZVideoLinkCard-info{display: none;}.RichText-video .VideoCard{opacity: 0;height: 1px;overflow:hidden;}.ZVideoLinkCard::before,.VideoContributionAnswer-container::before,.RichText-video::before{content:'「视频 - 点击播放」';color: #f77a2d;cursor:pointer;}.ZVideoLinkCard,.VideoContributionAnswer-container{cursor:pointer;padding: 4px 0}.ZVideoLinkCard:hover,.VideoContributionAnswer-container:hover{background: #eee}`,
        2: ".VideoAnswerPlayer,.RichText-video{display: none;}"
      };
      return cssObj[pfConfig.linkAnswerVideo || "0"];
    },
    vFontSizeContent: function() {
      const pfConfig = this.getConfig();
      const { fontSizeForList, fontSizeForAnswer, fontSizeForArticle } = pfConfig;
      const list = `.Topstory-body .RichContent-inner,.Topstory-body .HotItem-title,.Topstory-body .ctz-list-item-time,.Topstory-body .CommentContent,.SearchResult-Card .RichContent-inner,.SearchResult-Card .CommentContent{font-size: ${fontSizeForList}px!important;}`;
      const answer = `.Question-main .RichContent-inner,.Question-main .ctz-list-item-time,.Question-main .CommentContent{font-size: ${fontSizeForAnswer}px}`;
      const article = `.zhuanlan .Post-RichTextContainer,.zhuanlan .ctz-article-create-time,.zhuanlan .CommentContent{font-size: ${fontSizeForArticle}px}`;
      return list + answer + article;
    },
    getConfig: () => {
      const { getConfig } = store;
      return getConfig();
    }
  };
  var suspensionPackUp = (elements) => {
    const RIGHT = 60;
    const { themeLight = "0" /* 默认 */, themeDark = "1" /* 夜间护眼一 */ } = store.getConfig();
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
      evenButton.style.cssText = needStyle ? `visibility:visible!important;position: fixed!important;bottom: 60px;right: ${(document.body.offsetWidth - even.offsetWidth) / 2 + RIGHT}px;box-shadow: 0 1px 3px rgb(18 18 18 / 10%);height: 40px!important;padding: 0 12px!important;background: ${isDark() ? THEME_CONFIG_DARK[themeDark].background2 : THEME_CONFIG_LIGHT[themeLight][themeLight !== "0" /* 默认 */ ? "background2" : "background"]}!important;` : "";
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
          !dom(classIcon) && even.appendChild(domC("i", { className: "ctz-icon ctz-search-icon", innerHTML: "&#xe600;" }));
          !dom(classPickup) && even.appendChild(domC("i", { className: "ctz-icon ctz-search-pick-up", innerHTML: "&#xe601;" }));
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
    const { href, origin, pathname } = location;
    const { getHistory, setHistory } = store;
    const question = "www.zhihu.com/question/";
    const article = "zhuanlan.zhihu.com/p/";
    const video = "www.zhihu.com/zvideo/";
    let name = href;
    setTimeout(() => {
      if (!href.includes(question) && !href.includes(article) && !href.includes(video))
        return;
      href.includes(question) && dom('.QuestionPage [itemprop="name"]') && (name = dom('.QuestionPage [itemprop="name"]').content);
      href.includes(article) && dom(".Post-Title") && (name = dom(".Post-Title").innerText);
      href.includes(video) && dom(".ZVideo .ZVideo-title") && (name = dom(".ZVideo .ZVideo-title").innerText);
      const nA = `<a href="${origin + pathname}" target="_blank">${name}</a>`;
      const browseHistory = getHistory();
      const { view } = browseHistory;
      if (nA !== view[0]) {
        view.unshift(nA);
        browseHistory.view = view.slice(0, SAVE_HISTORY_NUMBER);
        setHistory(browseHistory);
        myStorage.set("pfHistory", JSON.stringify(browseHistory));
      }
    }, 100);
  };
  var myBlack = {
    messageCancel: "取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。",
    /** 初始化黑名单列表 */
    init: function() {
      const me = this;
      const elementBlock = domById(ID_BLOCK_LIST);
      if (!elementBlock)
        return;
      const { getConfig } = store;
      const { removeBlockUserContentList = [] } = getConfig();
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
      return `<img src="${avatar}"/><a href="/people/${id}" target="_blank">${name}</a><i class="ctz-icon ${CLASS_REMOVE_BLOCK}" style="margin-left:4px;cursor:pointer;">&#xe607;</i>`;
    },
    /** 添加「屏蔽用户」按钮，第二个参数为监听方法对象 */
    addButton: function(event, objMy) {
      const me = this;
      const classBox = "ctz-block-box";
      const nodeBlockBox = event.querySelector(`.${classBox}`);
      nodeBlockBox && nodeBlockBox.remove();
      const nodeUser = event.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
      if (!nodeUser || !nodeUser.offsetHeight)
        return;
      const userUrl = nodeUser.querySelector('meta[itemprop="url"]').content;
      const userName = nodeUser.querySelector('meta[itemprop="name"]').content;
      const avatar = nodeUser.querySelector('meta[itemprop="image"]').content;
      const nodeAnswerItem = event.querySelector(".AnswerItem");
      const mo = nodeAnswerItem ? nodeAnswerItem.getAttribute("data-za-extra-module") || "{}" : "{}";
      const aContent = JSON.parse(mo).card.content;
      const userId = aContent.author_member_hash_id || "";
      if (!userUrl.replace(/https:\/\/www.zhihu.com\/people\//, ""))
        return;
      const { getConfig } = store;
      const { removeBlockUserContentList = [] } = getConfig();
      const isAlreadyBlack = removeBlockUserContentList.findIndex((i) => i.id === userId) >= 0;
      const message = `是否要屏蔽${userName}？
屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。
如果开启了「不再显示已屏蔽用户发布的内容」那么也不会看到对方发布的回答`;
      const classBlack = "ctz-black";
      const classBlackRemove = "ctz-black-remove";
      const classBlackFilter = "ctz-black-filter";
      const classJustFilter = "ctz-just-filter";
      const innerHTML = isAlreadyBlack ? `<button class="${classBlackRemove}">解除屏蔽</button>` + fnReturnStr(`<button class="${classJustFilter}">隐藏该回答</button>`, !!objMy) : `<button class="${classBlack}">屏蔽用户</button>` + fnReturnStr(`<button class="${classBlackFilter}">屏蔽用户并隐藏该回答</button>`, !!objMy);
      const nodeBox = domC("div", { className: classBox, innerHTML });
      nodeBox.onclick = function(ev) {
        const target = ev.target;
        const matched = userUrl.match(/(?<=people\/)[\w\W]+/);
        const urlToken = matched ? matched[0] : "";
        if (target.classList.contains(classBlack)) {
          if (!confirm(message))
            return;
          me.serviceAdd(urlToken, userName, userId, avatar);
          fnDomReplace(this.querySelector(`.${classBlackFilter}`), { className: classJustFilter, innerText: "隐藏该回答" });
          fnDomReplace(target, { className: classBlackRemove, innerText: "解除屏蔽" });
          return;
        }
        if (target.classList.contains(classBlackRemove)) {
          if (!confirm(me.messageCancel))
            return;
          me.serviceRemove({ urlToken, id: userId, name: userName });
          fnDomReplace(target, { className: classBlack, innerText: "屏蔽用户" });
          fnDomReplace(this.querySelector(`.${classJustFilter}`), { className: classBlackFilter, innerText: "屏蔽用户并隐藏该回答" });
          return;
        }
        if (target.classList.contains(classBlackFilter) || target.classList.contains(classJustFilter)) {
          if (target.classList.contains(classBlackFilter)) {
            if (!confirm(message))
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
      const { getConfig } = store;
      const pfConfig = getConfig();
      const nL = pfConfig.removeBlockUserContentList || [];
      nL.push(info);
      myStorage.configUpdateItem("removeBlockUserContentList", nL);
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
          myStorage.configUpdateItem("removeBlockUserContentList", nL);
        }
      });
    },
    /** 同步黑名单列表 */
    sync: function(offset = 0, l = []) {
      const nodeList = domById(ID_BLOCK_LIST);
      !l.length && nodeList && (nodeList.innerHTML = "");
      fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: '<i class="ctz-icon ctz-loading">&#xe605;</i>', disabled: true });
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
          myStorage.configUpdateItem("removeBlockUserContentList", l);
          myBlack.init();
          fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: "同步黑名单", disabled: false });
        }
      });
    },
    getHeaders: () => {
      const { getStorageConfigItem } = store;
      return getStorageConfigItem("fetchHeaders");
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
      this.click({ target: dom('a[href="#CTZ_BASIS"]') });
    },
    click: function({ target }) {
      if (!(target.hash && target.tagName === "A"))
        return;
      const isThis = target.hash.replace(/#/, "");
      if (!isThis)
        return;
      domA(".ctz-menu-top>a").forEach((itemA) => itemA.classList.remove("target"));
      target.classList.add("target");
      domA(".ctz-content>div").forEach((item) => item.style.display = isThis === item.id ? "flex" : "none");
    }
  };
  var INNER_HTML = `<div id="CTZ_DIALOG_MAIN" style="display: none"><div class="ctz-header"><span>修改器</span><span class="ctz-version"></span><i id="CTZ_CLOSE_DIALOG" class="ctz-icon">&#xe602;</i></div><div class="ctz-menu-top"><a href="#CTZ_BASIS">基础设置</a><a href="#CTZ_LIST">首页列表</a><a href="#CTZ_ANSWER">回答详情</a><a href="#CTZ_ARTICLE">文章专栏</a><a href="#CTZ_HISTORY">历史记录</a><a href="#CTZ_BLACKLIST">黑名单设置</a></div><div class="ctz-content"><div id="CTZ_BASIS" style="display: none"><div class="ctz-content-left"><a href="#CTZ_BASIS_DEFAULT">基本设置</a><a href="#CTZ_BASIS_FLOAT">悬浮模块</a><a href="#CTZ_BASIS_HIDDEN">通用模块隐藏</a><a href="#CTZ_BASIS_COLOR">颜色设置</a><a href="#CTZ_BASIS_CONFIG">配置操作</a><a href="#CTZ_BASIS_MORE">默认功能</a></div><div class="ctz-content-right"><div class="ctz-commit-top">当前设置为通用设置，设置完成后在所有页面生效</div><div id="CTZ_BASIS_DEFAULT"><div class="ctz-set-title"><span>基本设置</span></div><div class="ctz-set-content"><div><label><span class="ctz-label">不显示修改器唤醒图标<span class="ctz-icon" style="margin: 0 6px">&#xe603;</span></span><input class="ctz-i" name="hiddenOpenButton" type="checkbox" value="on" /></label></div><div><label><span class="ctz-label">快捷键唤起编辑器<span class="key-shadow">></span>(<span class="key-shadow">Shift</span>+<span class="key-shadow">.</span>)</span><input class="ctz-i" name="hotKey" type="checkbox" value="on" /></label></div><div><div class="ctz-label">全局修改网页标题</div><div class="ctz-flex-wrap"><input type="text" name="globalTitle" style="width: 250px" /><button class="ctz-button" name="buttonConfirmTitle" style="margin: 0 4px">确认</button><button class="ctz-button" name="buttonResetTitle">还原</button></div></div><div><div class="ctz-label">全局修改网页标题图片（图标可能会因为网络问题丢失）</div><div class="ctz-flex-wrap" id="CTZ_TITLE_ICO"></div></div><div><div class="ctz-flex-wrap"><div class="ctz-label">回答和文章图片尺寸</div><label><input class="ctz-i" name="zoomImageType" type="radio" value="0" />默认</label><label><input class="ctz-i" name="zoomImageType" type="radio" value="1" />原图</label><label><input class="ctz-i" name="zoomImageType" type="radio" value="2" />自定义</label></div><div id="CTZ_IMAGE_SIZE_CUSTOM" style="display: none"><div class="ctz-flex-wrap"><div class="ctz-label">自定义图片尺寸</div><input class="ctz-i" type="range" min="0" max="1000" name="zoomImageSize" style="width: 300px" /><span id="zoomImageSize" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 0 ~ 1000</div></div></div><div class="ctz-flex-wrap"><span class="ctz-label">使用弹窗打开动图</span><input class="ctz-i" name="showGIFinDialog" type="checkbox" value="on" /></div></div></div><div id="CTZ_BASIS_FLOAT"><div class="ctz-set-title"><span>悬浮模块</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><label><span class="ctz-label">回答内容「收起」按钮悬浮</span><input class="ctz-i" name="suspensionPickUp" type="checkbox" value="on" /></label></div><div><div class="ctz-label">信息模块悬浮</div><div class="ctz-commit">拖动悬浮模块定位位置</div><div class="ctz-commit">鼠标放置显示解锁按钮解锁即可拖动<i class="ctz-icon" style="margin-left: 4px">&#xe688;</i></div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="suspensionHomeTab" type="checkbox" value="on" />首页列表切换</label><label><input class="ctz-i" name="suspensionFind" type="checkbox" value="on" />顶部发现模块</label><label><input class="ctz-i" name="suspensionUser" type="checkbox" value="on" />个人中心模块</label><label><input class="ctz-i" name="suspensionSearch" type="checkbox" value="on" />搜索栏模块</label></div></div></div></div><div id="CTZ_BASIS_HIDDEN"><div class="ctz-set-title"><span>通用模块隐藏<span class="ctz-desc">勾选隐藏相应模块内容</span></span></div><div class="ctz-set-content ctz-flex-wrap"></div></div><div id="CTZ_BASIS_COLOR"><div class="ctz-set-title"><span>颜色设置</span></div><div class="ctz-set-content"><div class="ctz-set-background"><div id="CTZ_BACKGROUND"></div><div class="ctz-commit">浅色颜色选择:</div><div id="CTZ_BACKGROUND_LIGHT"></div><div class="ctz-commit">深色颜色选择:</div><div id="CTZ_BACKGROUND_DARK"></div></div></div></div><div id="CTZ_BASIS_CONFIG"><div class="ctz-set-title"><span>配置操作</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><button class="ctz-button" name="useSimple">启用极简模式</button></div><div class="ctz-config-import-export"><div class="ctz-label">配置导出导入</div><div class="ctz-config-buttons"><button class="ctz-button" name="configExport">导出配置</button><button class="ctz-button" name="configReset">恢复默认配置</button></div><div class="ctz-content"><textarea name="textConfigImport" placeholder="配置可参考导出格式"></textarea><button class="ctz-button" name="configImport">导 入</button></div></div><div class="ctz-customize-css"><div class="ctz-label">自定义样式</div><div class="ctz-content"><textarea name="textStyleCustom" placeholder="格式为CSS"></textarea><button class="ctz-button" name="styleCustom">确 定</button></div></div></div></div><div id="CTZ_BASIS_MORE"><div class="ctz-set-title"><span>默认功能<span class="ctz-desc">此部分功能为编辑器默认功能，不需要额外开启</span></span></div><div class="ctz-set-content"><div id="CTZ_DEFAULT_SELF"></div><div class="ctz-zhihu-self"><div class="ctz-zhihu-key"><div>更加方便的浏览，按<span class="key-shadow">?</span>（<span class="key-shadow">Shift</span>+<span class="key-shadow">/</span>） 查看所有快捷键</div><a href="/settings/preference" target="_blank">前往开启快捷键功能</a></div></div></div></div></div></div><div id="CTZ_LIST" style="display: none"><div class="ctz-content-left"><a href="#CTZ_LIST_DEFAULT">基础设置</a><a href="#CTZ_LIST_FILTER">屏蔽内容</a><a href="#CTZ_LIST_HIDDEN">隐藏模块</a></div><div class="ctz-content-right"><div class="ctz-commit-top">当前设置完成后在问题列表、关注列表、热搜列表、搜索列表页面生效</div><div id="CTZ_LIST_DEFAULT"><div class="ctz-set-title"><span>基础设置</span></div><div class="ctz-set-content"><div><div class="ctz-flex-wrap"><div class="ctz-label">列表版心宽度</div><input class="ctz-i" type="range" min="600" max="1500" name="versionHome" style="width: 300px" /><span id="versionHome" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 600 ~ 1500</div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">内容标题添加类别显示<span class="ctz-label-tag ctz-label-tag-Answer">问答</span><span class="ctz-label-tag ctz-label-tag-Article">文章</span><span class="ctz-label-tag ctz-label-tag-ZVideo">视频</span></span><input class="ctz-i" name="questionTitleTag" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">推荐列表显示「不感兴趣」按钮</span><input class="ctz-i" name="listOutPutNotInterested" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">列表更多「···」按钮移动到题目右侧</span><input class="ctz-i" name="fixedListItemMore" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">关注列表高亮原创内容</span><input type="checkbox" name="highlightOriginal" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">列表内容点击高亮边框</span><input type="checkbox" name="highlightListItem" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">列表内容显示发布时间和最后修改时间</span><input type="checkbox" name="listItemCreatedAndModifiedTime" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><span class="ctz-label">列表内容标准文字大小</span><input type="number" name="fontSizeForList" class="ctz-i-change" /></div><div><div class="ctz-flex-wrap"><div class="ctz-label">列表视频回答内容尺寸</div><label><input class="ctz-i" name="zoomListVideoType" type="radio" value="0" />默认</label><label><input class="ctz-i" name="zoomListVideoType" type="radio" value="2" />自定义</label></div><div id="CTZ_LIST_VIDEO_SIZE_CUSTOM"><div class="ctz-flex-wrap"><input class="ctz-i" type="range" min="0" max="1000" name="zoomListVideoSize" style="width: 300px" /><span id="zoomListVideoSize" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 0 ~ 1000</div></div></div></div></div><div id="CTZ_LIST_FILTER" class="ctz-filter-block"><div class="ctz-set-title"><span>屏蔽内容<span class="ctz-desc" style="color: red">此部分更改后请重新刷新页面</span></span></div><div class="ctz-set-content"><div class="ctz-filter-follow"><div class="ctz-label">关注列表关注人操作屏蔽</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeFollowVoteAnswer" type="checkbox" value="on" />赞同回答</label><label><input class="ctz-i" name="removeFollowVoteArticle" type="checkbox" value="on" />赞同文章</label><label><input class="ctz-i" name="removeFollowFQuestion" type="checkbox" value="on" />关注问题</label></div></div><div class="ctz-filter-me"><label style="display: flex; align-items: center"><span class="ctz-label">关注列表屏蔽自己的操作</span><input class="ctz-i" name="removeMyOperateAtFollow" type="checkbox" value="on" /></label></div><div class="ctz-filter-type"><div class="ctz-label">列表类别屏蔽</div><div class="ctz-commit" style="line-height: 22px">勾选后「关注、推荐、搜索」将屏蔽所勾选的类别内容</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeItemQuestionAsk" type="checkbox" value="on" />邀请回答</label><label><input class="ctz-i" name="removeItemAboutAD" type="checkbox" value="on" />商业推广</label><label><input class="ctz-i" name="removeItemAboutArticle" type="checkbox" value="on" />文章</label><label><input class="ctz-i" name="removeItemAboutVideo" type="checkbox" value="on" />视频</label></div></div><div class="ctz-filter-list-vote"><label style="display: flex; align-items: center"><span class="ctz-label">列表低赞内容屏蔽</span><input class="ctz-i" name="removeLessVote" type="checkbox" value="on" /></label><div style="font-size: 12px; color: #999; line-height: 22px">勾选后「关注、推荐、搜索」列表屏蔽点赞量少于<input name="lessVoteNumber" class="ctz-i-change" type="number" style="width: 50px" />的内容</div></div><div class="ctz-filter-word"><div class="ctz-label">列表屏蔽词，[关注、推荐]将屏蔽包含题目屏蔽词的内容</div><input name="inputFilterWord" type="text" placeholder="输入后回车或失去焦点（不区分大小写）" /><div id="CTZ_FILTER_WORDS"></div></div></div></div><div id="CTZ_LIST_HIDDEN"><div class="ctz-set-title"><span>隐藏模块<span class="ctz-desc">勾选隐藏相应模块内容</span></span></div><div class="ctz-set-content ctz-flex-wrap"></div></div></div></div><div id="CTZ_ANSWER" style="display: none"><div class="ctz-content-left"><a href="#CTZ_ANSWER_DEFAULT">基础设置</a><a href="#CTZ_ANSWER_FILTER">屏蔽内容</a><a href="#CTZ_ANSWER_HIDDEN">隐藏模块</a><a href="#CTZ_ANSWER_OPEN">回答展开收起</a></div><div class="ctz-content-right"><div class="ctz-commit-top">当前设置完成后问答内容页面生效</div><div id="CTZ_ANSWER_DEFAULT"><div class="ctz-set-title"><span>基础设置</span></div><div class="ctz-set-content"><div><div class="ctz-flex-wrap"><div class="ctz-label">回答版心宽度</div><input class="ctz-i" type="range" min="600" max="1500" name="versionAnswer" style="width: 300px" /><span id="versionAnswer" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 600 ~ 1500</div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">问题详情显示创建时间和最后修改时间</span><input type="checkbox" name="questionCreatedAndModifiedTime" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">回答内容显示创建时间与最后修改时间</span><input type="checkbox" name="answerItemCreatedAndModifiedTime" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><span class="ctz-label">购物链接显示设置</span><label><input class="ctz-i" name="linkShopping" type="radio" value="0" />默认</label><label><input class="ctz-i" name="linkShopping" type="radio" value="1" />仅文字</label><label><input class="ctz-i" name="linkShopping" type="radio" value="2" />隐藏</label></div><div class="ctz-flex-wrap"><span class="ctz-label">回答视频显示设置</span><label><input class="ctz-i" name="linkAnswerVideo" type="radio" value="0" />默认</label><label><input class="ctz-i" name="linkAnswerVideo" type="radio" value="1" />仅链接</label><label><input class="ctz-i" name="linkAnswerVideo" type="radio" value="2" />隐藏</label></div><div class="ctz-flex-wrap"><span class="ctz-label">回答内容标准文字大小</span><input type="number" name="fontSizeForAnswer" class="ctz-i-change" /></div></div></div><div id="CTZ_ANSWER_FILTER" class="ctz-filter-block"><div class="ctz-set-title"><span>屏蔽内容 <span class="ctz-desc" style="color: red">此部分更改后请重新刷新页面</span></span></div><div class="ctz-set-content"><div class="ctz-filter-defail-who"><div class="ctz-label">屏蔽以下官方账号的回答</div><div style="margin-bottom: 8px; border-bottom: 1px solid #ebebeb; padding-bottom: 4px"><label><input class="ctz-i" name="removeZhihuOfficial" type="checkbox" value="on" />所有知乎官方账号</label></div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeStoryAnswer" type="checkbox" value="on" />故事档案局</label><label><input class="ctz-i" name="removeYanxuanAnswer" type="checkbox" value="on" />盐选科普</label><label><input class="ctz-i" name="removeYanxuanRecommend" type="checkbox" value="on" />盐选推荐</label><label><input class="ctz-i" name="removeYanxuanCPRecommend" type="checkbox" value="on" />盐选测评室</label></div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">屏蔽「匿名用户」回答</span><input class="ctz-i" name="removeAnonymousAnswer" type="checkbox" value="on" /></label></div><div class="ctz-filter-defail-tag"><div class="ctz-label">屏蔽带有以下标签的回答</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeFromYanxuan" type="checkbox" value="on" />选自盐选专栏</label><label><input class="ctz-i" name="removeUnrealAnswer" type="checkbox" value="on" />带有虚构创作</label></div></div><div class="ctz-filter-detail-vote"><label style="display: flex; align-items: center"><span class="ctz-label">详情低赞回答屏蔽</span><input class="ctz-i" name="removeLessVoteDetail" type="checkbox" value="on" /></label><div style="font-size: 12px; color: #999; line-height: 22px">勾选后问题详情页将屏蔽点赞量少于<input name="lessVoteNumberDetail" class="ctz-i-change" type="number" style="width: 50px" />的回答</div></div></div></div><div id="CTZ_ANSWER_HIDDEN"><div class="ctz-set-title"><span>隐藏模块<span class="ctz-desc">勾选隐藏相应模块内容</span></span></div><div class="ctz-set-content ctz-flex-wrap"></div></div><div id="CTZ_ANSWER_OPEN"><div class="ctz-set-title"><span>回答展开收起</span></div><div class="ctz-set-content ctz-flex-wrap"><label><input class="ctz-i" type="radio" name="answerOpen" value="" />知乎默认</label><label><input class="ctz-i" type="radio" name="answerOpen" value="on" />自动展开所有回答</label><label><input class="ctz-i" type="radio" name="answerOpen" value="off" />默认收起所有长回答</label></div></div></div></div><div id="CTZ_ARTICLE" style="display: none"><div class="ctz-content-left"><a href="#CTZ_ARTICLE_DEFAULT">基础设置</a><a href="#CTZ_ARTICLE_HIDDEN">隐藏模块</a></div><div class="ctz-content-right"><div class="ctz-commit-top">当前设置完成后在专栏文章页面生效</div><div id="CTZ_ARTICLE_DEFAULT"><div class="ctz-set-title"><span>基础设置</span></div><div class="ctz-set-content"><div><div class="ctz-flex-wrap"><div class="ctz-label">文章版心宽度</div><input class="ctz-i" type="range" min="600" max="1500" name="versionArticle" style="width: 300px" /><span id="versionArticle" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 600 ~ 1500</div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">文章发布时间置顶</span><input type="checkbox" name="articleCreateTimeToTop" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><span class="ctz-label">文章内容标准文字大小</span><input type="number" name="fontSizeForArticle" class="ctz-i-change" /></div></div></div><div id="CTZ_ARTICLE_HIDDEN"><div class="ctz-set-title"><span>隐藏模块<span class="ctz-desc">勾选隐藏相应模块内容</span></span></div><div class="ctz-set-content ctz-flex-wrap"></div></div></div></div><div id="CTZ_HISTORY" style="display: none"><div class="ctz-content-left"><a href="#CTZ_HISTORY_LIST">推荐列表缓存</a><a href="#CTZ_HISTORY_VIEW">浏览历史记录</a></div><div class="ctz-content-right"><div id="CTZ_HISTORY_LIST"><div class="ctz-set-title"><span>推荐列表缓存<span class="ctz-desc">最多缓存500条，包含已过滤项</span></span></div><button class="ctz-button" name="button_history_clear" data-id="list">清空推荐列表缓存</button><div class="ctz-set-content"></div></div><div id="CTZ_HISTORY_VIEW"><div class="ctz-set-title"><span>浏览历史记录<span class="ctz-desc">最多缓存500条</span></span></div><button class="ctz-button" name="button_history_clear" data-id="view">清空浏览历史记录</button><div class="ctz-set-content"></div></div></div></div><div id="CTZ_BLACKLIST" style="display: none"><div class="ctz-content-left"><a href="#CTZ_BASIS_BLOCK">黑名单设置</a></div><div class="ctz-content-right"><div id="CTZ_BASIS_BLOCK"><div class="ctz-set-title"><span>黑名单设置</span></div><div class="ctz-set-content"><button id="CTZ-BUTTON-SYNC-BLOCK" name="syncBlack" class="ctz-button">同步黑名单</button><div class="ctz-flex-wrap"><label><span class="ctz-label">回答列表用户名后显示「屏蔽用户」按钮</span><input class="ctz-i" name="showBlockUser" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">屏蔽黑名单用户发布的内容</span><input class="ctz-i" name="removeBlockUserContent" type="checkbox" value="on" /></label></div><div><div class="ctz-label">黑名单列表</div><div id="CTZ-BLOCK-LIST"></div></div></div></div></div></div></div><div class="ctz-footer"></div></div><div id="CTZ_OPEN_BUTTON" class="ctz-icon">&#xe603;</div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_IMAGE"><div><img src="" /></div></div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_VIDEO"><div><video src="" autoplay loop></video></div></div><iframe class="ctz-pdf-box-content" style="display: none"></iframe>`;
  var INNER_CSS = `@font-face{font-family:'tp-icon';src:url('//at.alicdn.com/t/c/font_2324733_3w6h6fk5917.woff2?t=1670580424651') format('woff2'),url('//at.alicdn.com/t/c/font_2324733_3w6h6fk5917.woff?t=1670580424651') format('woff'),url('//at.alicdn.com/t/c/font_2324733_3w6h6fk5917.ttf?t=1670580424651') format('truetype')}.hover-style{cursor:pointer}.hover-style:hover{color:#056de8 !important}.ctz-icon{font-family:'tp-icon' !important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:.2px;-moz-osx-font-smoothing:grayscale}#CTZ_OPEN_BUTTON{position:fixed;left:0;top:100px;font-size:18px;height:48px;line-height:48px;text-align:center;width:48px;border-radius:0 8px 8px 0;background:rgba(255,255,255,0.6);cursor:pointer;user-select:none;transform:translate(-30px);transition:transform .5s;z-index:200}#CTZ_OPEN_BUTTON:hover{transform:translate(0)}#CTZ_DIALOG_MAIN{position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);width:600px;height:500px;border-radius:4px;background:#fff;z-index:201;flex-direction:column;font-size:14px;box-shadow:5px 5px 10px #ababab,-5px -5px 10px #ffffff;border:1px solid #ccc}#CTZ_DIALOG_MAIN input[type='text'],#CTZ_DIALOG_MAIN input[type='number']{border-radius:4px}#CTZ_DIALOG_MAIN label{cursor:pointer}#CTZ_DIALOG_MAIN label:hover{color:#056de8 !important}#CTZ_DIALOG_MAIN a{text-decoration:none;color:inherit}.ctz-header{height:28px;line-height:28px;padding:0 8px;text-align:center}.ctz-version{padding-left:8px;font-size:12px}#CTZ_CLOSE_DIALOG{float:right;cursor:pointer}#CTZ_CLOSE_DIALOG:hover{color:#056de8 !important}.ctz-menu-top{height:28px;border-bottom:1px solid #bbb;display:flex}.ctz-menu-top a{flex:1;line-height:28px;text-align:center}.ctz-menu-top a:hover{border-bottom:4px solid #bbb}.ctz-menu-top a.target{border-bottom:4px solid #121212}.ctz-content{flex:1;display:flex;overflow:hidden}.ctz-content>div{width:100%}.ctz-content ::-webkit-scrollbar{width:8px;height:24px;background:#eee}.ctz-content ::-webkit-scrollbar-track{border-radius:0}.ctz-content ::-webkit-scrollbar-thumb{border-radius:0;background:#bbb;transition:all .2s;border-radius:8px}.ctz-content ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.ctz-content-left{width:100px;border-right:1px solid #bbb}.ctz-content-left a{padding:0 8px;height:32px;line-height:32px;display:flex;font-size:14px}.ctz-content-left a:hover{background:#ededed}.ctz-content-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 8px}.ctz-content-right>div:nth-of-type(2n){background:#efefef;padding:0 8px;margin:0 -8px}.ctz-content-right>div:nth-of-type(2n) .ctz-set-title>span{background:#efefef}.ctz-set-content>div{padding-bottom:8px;margin-bottom:8px;border-bottom:1px dashed #ddd}.ctz-set-content>div:last-of-type{border-bottom:0}.ctz-footer{height:28px;line-height:28px;padding:0 16px;border-top:1px solid #bbb;font-size:14px;color:rgba(0,0,0,0.65)}.ctz-footer a{margin-right:16px;cursor:pointer}.ctz-footer a:hover{color:#056de8 !important}.ctz-dark{display:flex;height:28px;align-items:center}.ctz-desc,.ctz-commit{color:#666;font-size:12px}.ctz-desc{padding-left:4px}.ctz-commit-top{text-align:center;font-size:14px;color:red}.ctz-label{font-size:14px;line-height:24px;font-weight:bold}.ctz-label::after{content:'：'}.ctz-set-title{font-weight:bold;height:32px;line-height:32px;font-size:16px;overflow:hidden;position:relative}.ctz-set-title::before{content:'----------------------------------------------------------------------';font-weight:normal}.ctz-set-title>span{position:absolute;padding:4px 8px;left:50%;top:50%;transform:translate(-50%, -50%);background:#ffffff;word-break:keep-all;white-space:pre}#CTZ_BACKGROUND,#CTZ_BACKGROUND_LIGHT,#CTZ_BACKGROUND_DARK{display:grid;grid-template-columns:30% 30% 30%;gap:8px}#CTZ_BACKGROUND>label,#CTZ_BACKGROUND_LIGHT>label,#CTZ_BACKGROUND_DARK>label{position:relative}#CTZ_BACKGROUND>label input,#CTZ_BACKGROUND_LIGHT>label input,#CTZ_BACKGROUND_DARK>label input{position:absolute;visibility:hidden}#CTZ_BACKGROUND>label input:checked+div,#CTZ_BACKGROUND_LIGHT>label input:checked+div,#CTZ_BACKGROUND_DARK>label input:checked+div{border:4px solid #056de8;margin:0 !important}#CTZ_BACKGROUND>label div,#CTZ_BACKGROUND_LIGHT>label div,#CTZ_BACKGROUND_DARK>label div{font-size:14px;border-radius:8px;line-height:50px;padding-left:30px;margin:4px}.ctz-set-background .ctz-commit{line-height:24px;font-size:14px}#CTZ_BASIS_CONFIG .ctz-config-buttons{width:80%;margin-bottom:8px;display:grid;grid-template-columns:50% 50%;gap:8px}#CTZ_BASIS_CONFIG .ctz-content{width:80%}#CTZ_BASIS_CONFIG .ctz-content textarea{flex:1;margin-right:8px;border-radius:4px}[name='inputFilterWord']{height:24px;width:300px;border-radius:4px}#CTZ_FILTER_WORDS{display:flex;flex-wrap:wrap;cursor:default}#CTZ_FILTER_WORDS>span{padding:2px 4px;border-radius:2px;font-size:12px;background-color:#999;margin:4px 4px 0 0;color:#fff;display:flex;align-items:center}#CTZ_FILTER_WORDS>span>i{font-size:14px;margin-left:2px;cursor:pointer}#CTZ_FILTER_WORDS>span>i:hover{color:#056de8 !important}.ctz-flex-wrap{display:flex;flex-wrap:wrap}.ctz-flex-wrap label{margin-right:4px;display:flex;align-items:center}.ctz-flex-wrap label input[type='radio']{margin:0 4px 0 0}.ctz-button{padding:4px 8px;font-size:14px;border-radius:2px;background:#ddd;border:1px solid #bbb;text-align:center}.ctz-button:hover{background:#eee}.ctz-not-interested{color:#999;font-size:12px;border:1px solid #999;border-radius:4px;padding:0 4px;margin-left:6px}.ctz-not-interested:hover{border-color:#056de8 !important;color:#056de8 !important}.ctz-video-download,.ctz-loading{position:absolute;top:20px;left:20px;font-size:24px;color:rgba(255,255,255,0.9);cursor:pointer}.ctz-loading{animation:loadingAnimation 2s infinite}@keyframes loadingAnimation{from{transform:rotate(0)}to{transform:rotate(360deg)}}#CTZ-BLOCK-LIST{display:flex;flex-wrap:wrap;margin:0 -8px;padding:8px}.ctz-black-item{height:30px;line-height:30px;box-sizing:content-box;padding:4px;margin:0 8px 8px 0;display:flex;align-items:center;background:#fff;border-radius:4px;border:1px solid #bbb}.ctz-black-item img{width:30px;height:30px;margin-right:4px}.ctz-black-item .ctz-remove-block:hover,.ctz-black-item a:hover{color:#056de8}.ctz-block-box>button,.ctz-button-block{padding:2px 8px;color:#666;border:1px solid #666;border-radius:4px;font-size:12px;margin-left:12px}.ctz-block-box>button:hover,.ctz-button-block:hover{border-color:#0461cf;color:#0461cf}.ctz-button-red{color:#e55353 !important;border:1px solid #e55353 !important}.ctz-button-red:hover{color:#ec7259 !important;border:1px solid #ec7259 !important}.ctz-preview{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;overflow-y:auto;z-index:200;background-color:rgba(18,18,18,0.4)}.ctz-preview div{display:flex;justify-content:center;align-items:center;min-height:100%;width:100%}.ctz-preview div img{cursor:zoom-out;user-select:none}#CTZ_TITLE_ICO label{margin:0 4px 4px 0}#CTZ_TITLE_ICO label input{display:none}#CTZ_TITLE_ICO label input:checked+img{border:4px solid #0461cf}#CTZ_TITLE_ICO label img{width:40px;height:40px;border:4px solid transparent}.ctz-label-tag{font-weight:normal;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.ctz-label-tag-Answer{background:#ec7259}.ctz-label-tag-ZVideo{background:#12c2e9}.ctz-label-tag-Article{background:#00965e}.ctz-question-time{color:#999 !important;font-size:14px !important;font-weight:normal !important;line-height:24px}.ctz-stop-scroll{height:100% !important;overflow:hidden !important}#CTZ_DEFAULT_SELF>div{line-height:24px;margin-bottom:4px}#CTZ_DEFAULT_SELF>div a{color:#056de8}#CTZ_DEFAULT_SELF>div a:hover{color:#bbb}.ctz-export-collection-box{float:right;text-align:right}.ctz-export-collection-box button{font-size:16px}.ctz-export-collection-box p{font-size:14px;color:#666;margin:4px 0}.ctz-pdf-dialog-item{padding:12px;border-bottom:1px solid #eee;margin:12px;background:#ffffff}.ctz-pdf-dialog-title{margin:0 0 1.4em;font-size:20px;font-weight:bold}.ctz-pdf-box-content{width:100%;background:#ffffff}.ctz-pdf-view{width:100%;background:#ffffff;word-break:break-all;white-space:pre-wrap;font-size:14px;overflow-x:hidden}.ctz-pdf-view a{color:#0066ff}.ctz-pdf-view img{max-width:100%}.ctz-pdf-view p{margin:1.4em 0}.ctz-unlock,.ctz-lock,.ctz-lock-mask{display:none;color:#999;cursor:pointer}.ctz-unlock,.ctz-lock{margin:4px}.ctz-lock-mask{position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:198}.position-suspensionSearch,.position-suspensionFind,.position-suspensionUser{position:fixed;z-index:100}.position-suspensionSearch:hover .ctz-unlock,.position-suspensionFind:hover .ctz-unlock,.position-suspensionUser:hover .ctz-unlock,.Topstory-container .TopstoryTabs:hover .ctz-unlock{display:block}.position-suspensionSearch.ctz-move-this .ctz-unlock,.position-suspensionFind.ctz-move-this .ctz-unlock,.position-suspensionUser.ctz-move-this .ctz-unlock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-unlock{display:none !important}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock,.position-suspensionSearch.ctz-move-this .ctz-lock-mask,.position-suspensionFind.ctz-move-this .ctz-lock-mask,.position-suspensionUser.ctz-move-this .ctz-lock-mask,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock-mask{display:block}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock{z-index:199;color:#cccccc}.position-suspensionFind{display:flex;flex-direction:column;margin:0 !important}.position-suspensionFind .Tabs-item{padding:0 !important;margin-bottom:4px}.position-suspensionFind .Tabs-item .Tabs-link{padding:8px !important;border-radius:4px}.position-suspensionFind .Tabs-item .Tabs-link::after{content:'' !important;display:none !important}.position-suspensionUser{width:fit-content !important;margin:0 !important;display:flex;flex-direction:column}.position-suspensionUser .AppHeader-messages,.position-suspensionUser .AppHeader-notifications{margin-right:0 !important;margin-bottom:12px}.position-suspensionUser .AppHeader-login,.position-suspensionUser .AppHeader-login~button{display:none}.SearchBar{flex:1}.position-suspensionSearch{line-height:30px;border-radius:16px;width:20px;transition:width .5s}.position-suspensionSearch .SearchBar-input-focus .ctz-search-pick-up{display:none}.position-suspensionSearch.focus{width:300px}.position-suspensionSearch.focus>form,.position-suspensionSearch.focus>button,.position-suspensionSearch.focus .ctz-search-pick-up{display:block}.position-suspensionSearch.focus .ctz-search-icon{display:none}.position-suspensionSearch.focus:hover{width:324px}.position-suspensionSearch .ctz-search-icon,.position-suspensionSearch .ctz-search-pick-up{cursor:pointer;color:#0066ff}.position-suspensionSearch .ctz-search-icon:hover,.position-suspensionSearch .ctz-search-pick-up:hover{color:#005ce6}.position-suspensionSearch .ctz-search-pick-up{font-size:24px;margin-left:4px}.position-suspensionSearch>form,.position-suspensionSearch>button,.position-suspensionSearch .ctz-search-pick-up{display:none}.position-suspensionSearch .ctz-search-icon{display:block}.key-shadow{border:1px solid #eee;border-radius:4px;box-shadow:rgba(0,0,0,0.06) 0 1px 1px 0;font-weight:600;min-width:26px;height:26px;padding:0px 6px;text-align:center}.ctz-zhihu-key a{color:#056de8}.ctz-zhihu-key a:hover{color:#bbb}.ContentItem-title div{display:inline}#CTZ_HISTORY_LIST .ctz-set-content,#CTZ_HISTORY_VIEW .ctz-set-content{word-break:break-all}#CTZ_HISTORY_LIST .ctz-set-content a,#CTZ_HISTORY_VIEW .ctz-set-content a{cursor:pointer}#CTZ_HISTORY_LIST .ctz-set-content a:hover,#CTZ_HISTORY_VIEW .ctz-set-content a:hover{color:#056de8 !important}#CTZ-BUTTON-SYNC-BLOCK{height:30px;width:88px;position:relative}#CTZ-BUTTON-SYNC-BLOCK i{top:2px;left:28px}`;
  var initHTML = () => {
    const { getUserinfo } = store;
    document.body.appendChild(domC("div", { id: "CTZ_MAIN", innerHTML: INNER_HTML }));
    myBlack.init();
    myMenu.init();
    const nodeCTZVersion = dom(".ctz-version");
    nodeCTZVersion && (nodeCTZVersion.innerText = `version: ${GM_info.script.version}`);
    const nodeCTZFooter = dom(".ctz-footer");
    nodeCTZFooter && (nodeCTZFooter.innerHTML = FOOTER_HTML);
    addBackgroundElements();
    for (let key in HIDDEN_DIRECTION) {
      const arrHidden = HIDDEN_DIRECTION[key];
      if (!arrHidden || !arrHidden.length)
        continue;
      const nodeItem = dom(`#${key}_HIDDEN>.ctz-set-content`);
      nodeItem && (nodeItem.innerHTML = arrHidden.map(
        (i) => `${i.map(({ label, value }) => `<label><input class="ctz-i" name="${value}" type="checkbox" value="on" />${label}</label>`).join("")}<span style="width: 100%; margin: 8px 0; background: #ddd; height: 1px; display:block"></span>`
      ).join(""));
    }
    const nodeCTZIcon = domById("CTZ_TITLE_ICO");
    nodeCTZIcon && (nodeCTZIcon.innerHTML = Object.keys(ICO_URL).map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`).join(""));
    const nodeCTZSelf = domById("CTZ_DEFAULT_SELF");
    nodeCTZSelf && (nodeCTZSelf.innerHTML = DEFAULT_FUNCTION.map((elementItem, index) => `<div>${index + 1}. ${elementItem}</div>`).join(""));
    const userinfo = getUserinfo();
    if (!userinfo)
      return;
    const hrefUser = userinfo.url ? userinfo.url.replace("/api/v4", "") : "";
    if (!hrefUser)
      return;
    const homeLink = domC("a", {
      href: hrefUser,
      target: "_blank",
      innerText: "个人主页"
    });
    const nodeCTZLeft = dom("#CTZ_BASIS .ctz-content-left");
    nodeCTZLeft && nodeCTZLeft.appendChild(homeLink);
  };
  var initInviteOnce = () => {
    const domInvitation = dom(".QuestionInvitation");
    if (!domInvitation)
      return;
    const nButton = domC("button", {
      className: "ctz-button",
      innerHTML: "一键邀请"
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
  };
  var myScroll = {
    stop: () => dom("body").classList.add("ctz-stop-scroll"),
    on: () => dom("body").classList.remove("ctz-stop-scroll")
  };
  var echoHistory = () => {
    const { list, view } = store.getHistory();
    const nodeList = dom("#CTZ_HISTORY_LIST .ctz-set-content");
    const nodeView = dom("#CTZ_HISTORY_VIEW .ctz-set-content");
    nodeList && (nodeList.innerHTML = list.join("<br/>"));
    nodeView && (nodeView.innerHTML = view.join("<br/>"));
  };
  var myDialog = {
    open: async () => {
      const nodeDialog = domById(ID_DIALOG);
      nodeDialog && (nodeDialog.style.display = "flex");
      myScroll.stop();
      const isChangeConfig = await myStorage.initConfig();
      isChangeConfig && echoData();
      const isChangeHistory = await myStorage.initHistory();
      isChangeHistory && echoHistory();
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
      hiddenItemActions: `.Topstory-container .ContentItem-actions>span,.Topstory-container .ContentItem-actions>button,.Topstory-container .ContentItem-actions>div,.Topstory-container .ContentItem-actions>a,.TopstoryQuestionAskItem-writeAnswerButton,.TopstoryQuestionAskItem-hint{visibility:hidden!important;height:0!important;padding:0!important;}.TopstoryQuestionAskItem-hint{margin: 0!important;}.Topstory .ContentItem-actions{padding: 0!important;}.SearchResult-Card .ContentItem-actions{display: none;}`,
      hiddenAnswerText: `.ContentItem-actions{padding: 0 20px!important;line-height: 38px!important;}.ContentItem-action,.ContentItem-action button,.ContentItem-actions button{font-size: 0!important;padding: 0!important;background: none!important;line-height:inherit!important;}.ContentItem-action span,.ContentItem-actions button span{font-size: 16px!important;}.ContentItem-action svg,.ContentItem-actions svg{width: 16px!important;height:16px!important;}.VoteButton{color: #8590a6!important; }.VoteButton.is-active{color: #056de8!important;}.ContentItem-action{margin-left:8px!important;}.Search-questionFollowButton{display: none}`,
      hiddenQuestionTag: ".QuestionHeader-tags{display: none!important;}",
      hiddenQuestionShare: ".zhihu .Popover.ShareMenu{display: none!important;}",
      hiddenQuestionActions: ".QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}",
      hiddenReward: ".Reward{display: none!important;}",
      hiddenZhuanlanTag: ".Post-topicsAndReviewer{display: none!important;}",
      hiddenListImg: `.RichContent-cover,.HotItem-img{display:none!important;}.HotItem-metrics--bottom{position: initial!important;}`,
      hiddenReadMoreText: ".ContentItem-more{font-size:0!important;}",
      hiddenAD: ".TopstoryItem--advertCard,.Pc-card,.Pc-word{display: none!important;}",
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
      hiddenDetailVoters: ".AnswerItem .Voters button{display: none;}",
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
      hiddenTopAD: ".App-main .Topstory>div:first-of-type:not(.Topstory-container){display: none}",
      hiddenCommitReply: ".Comments-container .css-140jo2 button:first-of-type{display:none;}",
      hiddenCommitVote: ".Comments-container .css-140jo2 button:last-of-type{display:none;}",
      hiddenCommitBottom: ".Comments-container .css-140jo2{display:none;}"
    },
    cssForKeysArray: [
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
      }
    ]
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
      domA(".GifPlayer").forEach((event) => observerGIF.observe(event, config));
    } else {
      observerGIF.disconnect();
    }
  }
  var keydownNextImage = (event) => {
    const { key } = event;
    const nodeImgDialog = dom(".css-ypb3io");
    if ((key === "ArrowRight" || key === "ArrowLeft") && nodeImgDialog) {
      const src = nodeImgDialog.src;
      const nodeImage = dom(`.origin_image[src="${src}"]`);
      const nodeContentInner = domP(nodeImage, "class", "RichContent-inner") || domP(nodeImage, "class", "Post-RichTextContainer");
      if (nodeContentInner) {
        const nodesImageList = Array.from(nodeContentInner.querySelectorAll(".origin_image"));
        const index = nodesImageList.findIndex((i) => i.src === src);
        if (key === "ArrowRight" && index < nodesImageList.length - 1) {
          nodeImgDialog.src = nodesImageList[index + 1].src;
          return;
        }
        if (key === "ArrowLeft" && index > 0) {
          nodeImgDialog.src = nodesImageList[index - 1].src;
          return;
        }
      }
    }
  };
  var myListenListItem = {
    index: 0,
    init: async function() {
      const { getConfig, getHistory, setHistory, getUserinfo } = store;
      const pfConfig = getConfig();
      const {
        filterKeywords = [],
        removeItemAboutVideo,
        removeItemAboutArticle,
        removeLessVote,
        lessVoteNumber = 0,
        removeItemQuestionAsk,
        removeFollowVoteAnswer,
        removeFollowVoteArticle,
        removeFollowFQuestion,
        listOutPutNotInterested,
        highlightOriginal,
        themeDark = "1" /* 夜间护眼一 */,
        themeLight = "0" /* 默认 */,
        removeMyOperateAtFollow
      } = pfConfig;
      const elements = domA(".TopstoryItem");
      let lessNum = 0;
      await myStorage.initHistory();
      const pfHistory = getHistory();
      const historyList = pfHistory.list;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = "";
        let dataZop = {};
        let cardContent = {};
        const nodeItem = elements[i];
        const nodeItemContent = nodeItem.querySelector(".ContentItem");
        if (!nodeItem.scrollHeight || !nodeItemContent)
          continue;
        if (listOutPutNotInterested) {
          const elementNotInterested = domC("button", { innerText: "不感兴趣", className: CLASS_NOT_INTERESTED });
          const nodeContentItemTitle = nodeItem.querySelector(".ContentItem-title");
          !nodeItem.querySelector(`.${CLASS_NOT_INTERESTED}`) && nodeContentItemTitle && nodeContentItemTitle.appendChild(elementNotInterested);
        }
        try {
          dataZop = JSON.parse(nodeItemContent.getAttribute("data-zop") || "{}");
          cardContent = JSON.parse(nodeItemContent.getAttribute("data-za-extra-module") || "{}").card.content;
        } catch {
        }
        const { itemId = "", title = "", type = "" } = dataZop || {};
        if (removeMyOperateAtFollow && nodeItem.classList.contains("TopstoryItem-isFollow")) {
          try {
            const userinfo = getUserinfo();
            const nodeUserLink = nodeItem.querySelector(".UserLink .UserLink-link");
            const findUserId = nodeUserLink.href.match(/[^\/]+$/)[0];
            const myUserId = userinfo.url.match(/[^\/]+$/)[0];
            findUserId === myUserId && (message = "关注列表屏蔽自己的操作");
          } catch {
          }
        }
        const haveVideo = nodeItemContent.classList.contains("ZVideoItem") && removeItemAboutVideo;
        const haveArticle = nodeItemContent.classList.contains("ArticleItem") && removeItemAboutArticle;
        (haveVideo || haveArticle) && !message && (message = "列表种类屏蔽");
        if (removeLessVote && !message) {
          (cardContent["upvote_num"] || 0) < lessVoteNumber && (message = `屏蔽低赞内容: ${title}, ${cardContent["upvote_num"]}`);
        }
        const elementQuestionAsk = nodeItem.querySelector(".TopstoryQuestionAskItem");
        if (removeItemQuestionAsk && elementQuestionAsk && !message) {
          message = "屏蔽邀请回答";
        }
        const isFilterFollowerOperate = removeFollowVoteAnswer || removeFollowVoteArticle || removeFollowFQuestion;
        if (isFilterFollowerOperate && !message && nodeItem.classList.contains("TopstoryItem-isFollow")) {
          const nodeFirstLine = nodeItem.querySelector(".FeedSource-firstline");
          const textFollowerOperate = nodeFirstLine ? nodeFirstLine.innerText : "";
          for (let itemOperate of FILTER_FOLLOWER_OPERATE) {
            const thisRep = new RegExp(itemOperate.rep);
            if (pfConfig[itemOperate.key] && thisRep.test(textFollowerOperate)) {
              message = `屏蔽关注人操作: ${textFollowerOperate}`;
              break;
            }
          }
        }
        if (!message) {
          let matchedWord = "";
          for (let itemWord of filterKeywords) {
            const rep = new RegExp(itemWord.toLowerCase());
            if (rep.test(title.toLowerCase())) {
              matchedWord += `「${itemWord}」`;
              break;
            }
          }
          if (matchedWord) {
            const elementItemProp = nodeItemContent.querySelector('[itemprop="url"]');
            const routeURL = elementItemProp && elementItemProp.getAttribute("content");
            doFetchNotInterested({ id: String(itemId), type });
            message = `屏蔽列表内容: ${title},匹配屏蔽词：${matchedWord}, 链接：${routeURL}`;
          }
        }
        const userNameE = nodeItem.querySelector(".FeedSource-firstline .UserLink-link");
        const userName = userNameE ? userNameE.innerText : "";
        if (highlightOriginal && dataZop && dataZop.authorName === userName && !message) {
          const highlight = `background: ${isDark() ? `${THEME_CONFIG_DARK[themeDark].background2}!important;` : themeLight === "0" /* 默认 */ ? "#fff3d4!important;" : `${THEME_CONFIG_LIGHT[themeLight].background}!important;`}`;
          const nodeActions = nodeItem.querySelector(".ContentItem-actions");
          nodeItem.style.cssText = `${highlight}border: 1px solid #aaa;`;
          nodeActions && (nodeActions.style.cssText = highlight);
        }
        message && (lessNum = fnHiddenDom(lessNum, nodeItem, message));
        if (domP(nodeItem, "class", "Topstory-recommend") && nodeItem.querySelector(".ContentItem-title a")) {
          const nodeATitle = nodeItem.querySelector(".ContentItem-title a");
          if (nodeATitle) {
            const itemHref = nodeATitle.href;
            const itemTitle = nodeATitle.innerText;
            const itemA = `<a href="${itemHref}" target="_blank">${itemTitle}</a>`;
            if (historyList[0] !== itemA) {
              historyList.unshift(itemA);
              pfHistory.list = historyList.slice(0, SAVE_HISTORY_NUMBER);
            }
          }
        }
        fnJustNum(nodeItem);
        if (i + 1 === len) {
          const nI = i - lessNum >= 0 ? i - lessNum : 0;
          this.index = nI;
          setHistory(pfHistory);
          myStorage.set("pfHistory", JSON.stringify(pfHistory));
        }
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
  var addTimes = (event) => {
    const className = "ctz-list-item-time";
    const node = event.querySelector(`.${className}`);
    node && node.remove();
    const nodeCreated = event.querySelector('[itemprop="dateCreated"]');
    const nodePublished = event.querySelector('[itemprop="datePublished"]');
    const nodeModified = event.querySelector('[itemprop="dateModified"]');
    const crTime = nodeCreated ? nodeCreated.content : "";
    const puTime = nodePublished ? nodePublished.content : "";
    const muTime = nodeModified ? nodeModified.content : "";
    const created = timeFormatter(crTime || puTime);
    const modified = timeFormatter(muTime);
    const nodeMeta = event.querySelector(".ContentItem-meta");
    if (!created || !nodeMeta)
      return;
    nodeMeta.appendChild(
      domC("div", {
        className,
        style: "line-height: 24px;padding-top: 6px;",
        innerHTML: `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`
      })
    );
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
    const { getConfig } = store;
    const className = "ctz-article-create-time";
    const nodeT = dom(`.${className}`);
    nodeT && nodeT.remove();
    const conf = getConfig();
    const nodeContentTime = dom(".ContentItem-time");
    const nodeHeader = dom(".Post-Header");
    if (!(conf.articleCreateTimeToTop && nodeContentTime && nodeHeader))
      return;
    nodeHeader.appendChild(
      domC("span", {
        className,
        style: "color: #8590a6;line-height: 30px;",
        innerHTML: nodeContentTime.innerText || ""
      })
    );
  };
  var myVideo = {
    index: 0,
    timeout: null,
    init: function() {
      this.timeout && clearTimeout(this.timeout);
      if (this.index < 30) {
        this.timeout = setTimeout(() => {
          if (domA("#player video").length) {
            this.index = 0;
            domA("#player>div").forEach((even) => {
              const elementDownload = domC("i", { className: "ctz-icon ctz-video-download", innerHTML: "&#xe608;" });
              const elementLoading = domC("i", { className: "ctz-icon ctz-loading", innerHTML: "&#xe605;" });
              elementDownload.onclick = () => {
                const url = elementDownload.parentElement.parentElement.querySelector("video").src;
                if (url) {
                  elementDownload.style.display = "none";
                  even.appendChild(elementLoading);
                  const name = url.match(/(?<=\/)[\d\w-\.]+(?=\?)/)[0];
                  videoDownload(url, name).then(() => {
                    elementDownload.style.display = "block";
                    elementLoading.remove();
                  });
                }
              };
              const nodeDownload = even.querySelector(".ctz-video-download");
              nodeDownload && nodeDownload.remove();
              even.appendChild(elementDownload);
            });
          } else {
            this.init();
            this.index++;
          }
        }, 500);
      }
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
  var zoomVideos = () => {
    const { getConfig } = store;
    const { linkAnswerVideo } = getConfig();
    if (linkAnswerVideo !== "1")
      return;
    const itemClick = (item) => {
      item.onclick = () => {
        const itemParent = domP(item, "class", "VideoAnswerPlayer");
        if (itemParent) {
          const nodeVideo = itemParent.querySelector(".VideoAnswerPlayer-video video");
          const videoLink = nodeVideo ? nodeVideo.src : "";
          videoLink && window.open(videoLink);
        } else {
          const nodeVideoCard = item.querySelector(".VideoCard");
          nodeVideoCard && (nodeVideoCard.style.cssText = `opacity: 1;height: auto;`);
        }
      };
    };
    domA(".VideoContributionAnswer-container").forEach(itemClick);
    domA(".RichText-video").forEach(itemClick);
    domA(".VideoAnswerPlayer-stateBar").forEach(itemClick);
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
      "fontSizeForList",
      "fontSizeForAnswer",
      "fontSizeForArticle",
      "zoomListVideoType",
      "zoomListVideoSize"
    ];
    const { name, value, checked, type } = ev;
    const changeBackground = () => {
      myVersion.change();
      loadBackground();
      myListenListItem.restart();
      onUseThemeDark();
    };
    const ob = {
      [INPUT_NAME_THEME]: changeBackground,
      [INPUT_NAME_ThEME_LIGHT]: changeBackground,
      [INPUT_NAME_THEME_DARK]: changeBackground,
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
      linkAnswerVideo: () => {
        myVersion.change();
        zoomVideos();
      }
    };
    await myStorage.configUpdateItem(name, type === "checkbox" ? checked : value);
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
  var initTopStoryRecommendEvent = () => {
    const nodeTopStoryRecommend = dom(".Topstory-recommend");
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
    nodeTopStoryRecommend.onclick = function(event) {
      const target = event.target;
      const nodeContentItem = domP(target, "class", "ContentItem");
      if (!nodeContentItem)
        return;
      const { listOutPutNotInterested, listItemCreatedAndModifiedTime, showBlockUser } = store.getConfig();
      if (listOutPutNotInterested && target.classList.contains(CLASS_NOT_INTERESTED)) {
        const dataZopJson = nodeContentItem.getAttribute("data-zop");
        const { itemId = "", type = "" } = JSON.parse(dataZopJson || "{}");
        doFetchNotInterested({ id: itemId, type });
        const nodeTopStoryItem = domP(target, "class", "TopstoryItem");
        nodeTopStoryItem && (nodeTopStoryItem.style.display = "none");
      }
      if (canFindTargeted(target)) {
        setTimeout(() => {
          listItemCreatedAndModifiedTime && addTimes(nodeContentItem);
          showBlockUser && myBlack.addButton(nodeContentItem.parentElement);
        }, 0);
      }
    };
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
        await myStorage.set("pfHistory", JSON.stringify(prevHistory));
        echoHistory();
      };
    });
    const nodeOpenButton = domById("CTZ_OPEN_BUTTON");
    const nodeCloseDialog = domById("CTZ_CLOSE_DIALOG");
    nodeOpenButton && (nodeOpenButton.onclick = myDialog.open);
    nodeCloseDialog && (nodeCloseDialog.onclick = myDialog.hide);
    initTopStoryRecommendEvent();
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
      await myStorage.configUpdate(nConfig);
      resetData();
    },
    configReset: async function() {
      const isUse = confirm("是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存");
      if (!isUse)
        return;
      const { getConfig, getStorageConfigItem } = store;
      const { filterKeywords = [], removeBlockUserContentList = [] } = getConfig();
      const cacheConfig = getStorageConfigItem("cachePfConfig");
      await myStorage.configUpdate({
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
      await myStorage.configUpdateItem("customizeCss", value);
      myCustomStyle.change(value);
    },
    syncBlack: () => myBlack.sync(0),
    /** 确认更改网页标题 */
    buttonConfirmTitle: async function() {
      const nodeTitle = dom('[name="globalTitle"]');
      await myStorage.configUpdateItem("globalTitle", nodeTitle ? nodeTitle.value : "");
      changeTitle();
    },
    /** 还原网页标题 */
    buttonResetTitle: async function() {
      const { getStorageConfigItem } = store;
      const nodeTitle = dom('[name="globalTitle"]');
      nodeTitle && (nodeTitle.value = getStorageConfigItem("cacheTitle"));
      await myStorage.configUpdateItem("globalTitle", "");
      changeTitle();
    }
  };
  var resetData = () => {
    onInitStyleExtra();
    initData();
    onUseThemeDark();
  };
  var myCollectionExport = {
    init: function() {
      const { pathname } = location;
      const elementBox = domC("div", { className: this.className, innerHTML: this.element });
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
          const iframe = dom(".ctz-pdf-box-content");
          if (iframe.contentWindow) {
            const collectionsHTML = collectionsHTMLMap.join("");
            const doc = iframe.contentWindow.document;
            doc.body.innerHTML = "";
            if (!doc.head.querySelector("style")) {
              doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
            }
            doc.write(`<div class="ctz-pdf-view">${collectionsHTML}</div>`);
            const imgLoadPromises = [];
            doc.querySelectorAll("img").forEach((item) => {
              imgLoadPromises.push(
                new Promise((resolve, reject) => {
                  item.onload = function() {
                    resolve(true);
                  };
                })
              );
            });
            Promise.all(imgLoadPromises).then(() => {
              me.innerText = "生成PDF";
              me.disabled = false;
              iframe.contentWindow && iframe.contentWindow.print();
            });
          }
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
  var myListenSelect = {
    isSortFirst: true,
    observer: void 0,
    keySort: "default",
    /** 添加回答排序 */
    answerSortIds: {
      "Select1-0": { key: "default", name: "默认排序" },
      "Select1-1": { key: "update", name: "按时间排序" },
      "Select1-2": { key: "vote", name: "点赞数排序" },
      "Select1-3": { key: "comment", name: "评论数排序" }
    },
    sortKeys: { vote: "点赞数排序", comment: "评论数排序" },
    /** 加载监听问题详情里的.Select-button按钮 */
    init: function() {
      const classSelectButton = ".Select-button";
      const { href } = location;
      if (this.keySort === "vote" || this.keySort === "comment") {
        const elementBtn = dom(classSelectButton);
        elementBtn && (elementBtn.innerHTML = elementBtn.innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, this.sortKeys[this.keySort]));
      }
      const clickSort = (id) => {
        myListenAnswerItem.reset();
        const { key, name } = this.answerSortIds[id];
        this.keySort = key;
        const elementBtn = dom(classSelectButton);
        elementBtn && (elementBtn.innerHTML = elementBtn.innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, name));
        if (key === "vote" || key === "comment") {
          location.href = href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, "") + "?sort=" + key;
        } else if (key === "default") {
          /\?sort=/.test(href) && (location.href = href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, ""));
        }
      };
      const btn = dom(classSelectButton);
      if (btn) {
        try {
          this.observer?.disconnect();
        } catch {
        }
        const buConfig = { attribute: true, attributeFilter: ["aria-expanded"] };
        this.observer = new MutationObserver(() => {
          const elementSelect = dom(".Answers-select");
          if (btn.getAttribute("aria-expanded") === "true" && elementSelect) {
            elementSelect.appendChild(domC("button", { className: "Select-option", tabindex: "-1", role: "option", id: "Select1-2", innerHTML: "点赞数排序" }));
            elementSelect.appendChild(domC("button", { className: "Select-option", tabindex: "-1", role: "option", id: "Select1-3", innerHTML: "评论数排序" }));
            domA(".Select-option").forEach((ev) => {
              ev.onclick = () => clickSort(ev.id);
            });
          }
        });
        this.observer.observe(btn, buConfig);
      }
    },
    addSort: function() {
      const keySort = this.keySort;
      if ((keySort === "vote" || keySort === "comment") && this.isSortFirst) {
        const element = dom(".List>div:nth-child(2)>div");
        if (!element)
          return;
        const arrElement = Array.from(element.querySelectorAll(".List-item:not(.PlaceHolder)")).sort((a, b) => {
          const answerItemA = a.querySelector(".AnswerItem");
          const extraA = answerItemA ? answerItemA.getAttribute("data-za-extra-module") || "{}" : "{}";
          const contentA = JSON.parse(extraA).card.content;
          const answerItemB = b.querySelector(".AnswerItem");
          const extraB = answerItemB ? answerItemB.getAttribute("data-za-extra-module") || "{}" : "{}";
          const contentB = JSON.parse(extraB).card.content;
          switch (keySort) {
            case "vote":
              return contentA.upvote_num - contentB.upvote_num;
            case "comment":
              return contentA.comment_num - contentB.comment_num;
            default:
              return 1;
          }
        });
        const listItem = element.querySelector(".List-item:not(.PlaceHolder)");
        listItem && listItem.remove();
        const eleFirst = element.querySelector(":first-child");
        arrElement.forEach((item, index) => {
          element.insertBefore(item, index === 0 ? eleFirst : arrElement[index - 1]);
        });
        this.isSortFirst = false;
      }
    }
  };
  var myListenAnswerItem = {
    index: 0,
    init: function() {
      const { getConfig } = store;
      const conf = getConfig();
      myListenSelect.addSort();
      const {
        removeLessVoteDetail,
        lessVoteNumberDetail = 0,
        answerOpen,
        removeZhihuOfficial,
        removeBlockUserContent,
        removeBlockUserContentList,
        showBlockUser,
        removeAnonymousAnswer,
        answerItemCreatedAndModifiedTime
      } = conf;
      const nodeQuestionAnswer = dom(".QuestionAnswer-content");
      if (nodeQuestionAnswer) {
        answerItemCreatedAndModifiedTime && addTimes(nodeQuestionAnswer);
        showBlockUser && myBlack.addButton(nodeQuestionAnswer);
      }
      const hiddenTags = Object.keys(HIDDEN_ANSWER_TAG);
      let hiddenUsers = [];
      for (let i in HIDDEN_ANSWER_ACCOUNT) {
        conf[i] && hiddenUsers.push(HIDDEN_ANSWER_ACCOUNT[i]);
      }
      removeBlockUserContent && (hiddenUsers = hiddenTags.concat((removeBlockUserContentList || []).map((i) => i.name || "")));
      const elements = domA(".AnswersNavWrapper .List-item");
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = "";
        const elementThis = elements[i];
        const elementInfo = elementThis.querySelector(".ContentItem");
        if (!elementInfo)
          continue;
        let dataZop = {};
        let dataCardContent = {};
        try {
          dataZop = JSON.parse(elementInfo.getAttribute("data-zop") || "{}");
          dataCardContent = JSON.parse(elementInfo.getAttribute("data-za-extra-module") || "{}").card.content;
        } catch {
        }
        (dataCardContent["upvote_num"] || 0) < lessVoteNumberDetail && removeLessVoteDetail && (message = `过滤低赞回答: ${dataCardContent["upvote_num"]}赞`);
        if (removeZhihuOfficial && !message) {
          const labelE = elementThis.querySelector(".AuthorInfo-name .css-n99yhz");
          const label = labelE ? labelE.getAttribute("aria-label") || "" : "";
          /知乎[\s]*官方帐号/.test(label) && (message = "已删除一条知乎官方帐号的回答");
        }
        let isHiddenTag = false;
        hiddenTags.forEach((i2) => conf[i2] && (isHiddenTag = true));
        if (isHiddenTag && !message) {
          const nodeTag1 = elementThis.querySelector(".KfeCollection-AnswerTopCard-Container");
          const nodeTag2 = elementThis.querySelector(".LabelContainer-wrapper");
          const text1 = nodeTag1 ? nodeTag1.innerText : "";
          const text2 = nodeTag2 ? nodeTag2.innerText : "";
          const tagText = text1 + text2;
          hiddenTags.forEach((i2) => {
            if (conf[i2]) {
              const nReg = new RegExp(HIDDEN_ANSWER_TAG[i2]);
              nReg.test(tagText) && (message = `已删除一条标签${HIDDEN_ANSWER_TAG[i2]}的回答`);
            }
          });
        }
        hiddenUsers.length && !message && hiddenUsers.includes(dataZop.authorName || "") && (message = `已删除${dataZop.authorName}的回答`);
        if (removeAnonymousAnswer && !message) {
          const userName = elementThis.querySelector('[itemprop="name"]').content;
          userName === "匿名用户" && (message = `已屏蔽一条「匿名用户」回答`);
        }
        if (!message && answerOpen) {
          const unFoldButton = elementThis.querySelector(".ContentItem-expandButton");
          const foldButton = elementThis.querySelector(".RichContent-collapsedText");
          const isNotOpen = !elementThis.classList.contains(OB_CLASS_FOLD.on);
          const isNotClose = !elementThis.classList.contains(OB_CLASS_FOLD.off);
          if (answerOpen === "on" && isNotOpen) {
            unFoldButton && unFoldButton.click();
            elementThis.classList.add(OB_CLASS_FOLD.on);
            lessNum++;
          }
          const isF = foldButton && elementThis.offsetHeight > 939;
          const isFC = unFoldButton;
          if (answerOpen === "off" && isNotClose && (isF || isFC)) {
            elementThis.classList.add(OB_CLASS_FOLD.off);
            isF && foldButton && foldButton.click();
            lessNum++;
          }
        }
        fnJustNum(elementThis);
        if (!message) {
          conf.answerItemCreatedAndModifiedTime && addTimes(elementThis);
          showBlockUser && myBlack.addButton(elementThis, this);
        }
        message && (lessNum = fnHiddenDom(lessNum, elementThis, message));
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
  var myListenSearchListItem = {
    index: 0,
    init: function() {
      const { removeItemAboutVideo, removeItemAboutArticle, removeItemAboutAD, removeLessVote, lessVoteNumber = 0 } = store.getConfig();
      const elements = domA('.SearchResult-Card[role="listitem"]');
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = "";
        const elementThis = elements[i];
        if (!elementThis)
          continue;
        const haveAD = removeItemAboutAD && elementThis.querySelector(".KfeCollection-PcCollegeCard-root");
        const haveArticle = removeItemAboutArticle && elementThis.querySelector(".ArticleItem");
        const haveVideo = removeItemAboutVideo && elementThis.querySelector(".ZvideoItem");
        (haveAD || haveArticle || haveVideo) && (message = "列表种类屏蔽");
        if (removeLessVote && !message) {
          const elementUpvote = elementThis.querySelector(".ContentItem-actions .VoteButton--up");
          const ariaLabel = elementUpvote ? elementUpvote.getAttribute("aria-label") : "";
          const upvoteText = ariaLabel ? ariaLabel.trim().replace(/\W+/, "") : "0";
          const upvote = upvoteText.includes("万") ? +upvoteText.replace("万", "").trim() * 1e4 : +upvoteText;
          if (upvote > -1 && upvote < lessVoteNumber) {
            message = `屏蔽低赞内容: ${upvote}赞`;
          }
        }
        fnJustNum(elementThis);
        message && (lessNum = fnHiddenDom(lessNum, elementThis, message));
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
    images.forEach((events) => {
      events.forEach((e) => {
        const src = e.src || e.style.backgroundImage && e.style.backgroundImage.split('("')[1].split('")')[0];
        e.onclick = () => myPreview.open(src);
      });
    });
    if (zoomImageType === "2") {
      domA(".origin_image").forEach((item) => {
        item.src = item.getAttribute("data-original") || item.src;
        item.style.cssText = "max-width: 100%;";
      });
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
    esName.forEach((name) => {
      domA(`${name}:not(.${operaLink})`).forEach(hrefChanger);
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
    const { globalTitle, hiddenSearchBoxTopSearch } = getConfig();
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
      heightTopStoryContent < window.innerHeight && window.dispatchEvent(new Event("resize"));
      setStorageConfigItem("heightForList", heightTopStoryContent);
    }
    initLinkChanger();
    previewGIF();
    initImagePreview();
    myListenSearchListItem.init();
    myListenAnswerItem.init();
    pathnameHasFn({
      question: () => {
        zoomVideos();
        myListenSelect.init();
      },
      video: () => myVideo.init(),
      collection: () => myCollectionExport.init()
    });
    globalTitle !== document.title && changeTitle();
    const nodeSearchBarInput = dom(".SearchBar-input input");
    if (hiddenSearchBoxTopSearch && nodeSearchBarInput) {
      nodeSearchBarInput.placeholder = "";
    }
  }
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
    "1": (
      /** 移除、关注问题并关闭网页 */
      function() {
        this.clickAndClose(".QuestionButtonGroup button");
      }
    ),
    "2": (
      /** 移除、关注话题并关闭网页 */
      function() {
        this.clickAndClose(".TopicActions .FollowButton");
      }
    ),
    "3": (
      /** 移除、关注收藏夹并关闭网页 */
      function() {
        this.clickAndClose(".CollectionDetailPageHeader-actions .FollowButton");
      }
    ),
    clickAndClose: (eventname) => {
      const nodeItem = dom(eventname);
      nodeItem && nodeItem.click();
      window.close();
    }
  };
  var myFilterWord = {
    add: (
      /** 添加屏蔽词 */
      async function(target) {
        const word = target.value;
        const { filterKeywords = [] } = store.getConfig();
        filterKeywords.push(word);
        await myStorage.configUpdateItem("filterKeywords", filterKeywords);
        const item = domC("span", { innerHTML: this.evenText(word) });
        item.dataset.title = word;
        const nodeFilterWords = domById(ID_FILTER_WORDS);
        nodeFilterWords && nodeFilterWords.appendChild(item);
        target.value = "";
      }
    ),
    remove: (
      /** 删除屏蔽词 */
      (event) => {
        const title = event.dataset.title;
        const { filterKeywords = [] } = store.getConfig();
        event.remove();
        myStorage.configUpdateItem(
          "filterKeywords",
          filterKeywords.filter((i) => i !== title)
        );
      }
    ),
    init: (
      /** 初始化 */
      function() {
        const { filterKeywords = [] } = store.getConfig();
        const children = (filterKeywords || []).map((i) => this.evenTextBlock(i)).join("");
        const nodeFilterWords = domById(ID_FILTER_WORDS);
        if (nodeFilterWords) {
          nodeFilterWords.innerHTML = children || "";
          nodeFilterWords.onclick = (e) => {
            const target = e.target;
            target.classList.contains("ctz-filter-word-remove") && this.remove(target.parentElement);
          };
        }
        const nodeInput = dom('[name="inputFilterWord"]');
        nodeInput && (nodeInput.onchange = (e) => this.add.call(this, e.target));
      }
    ),
    evenText: (w) => `<span>${w}</span><i class="ctz-icon ctz-filter-word-remove">&#xe602;</i>`,
    evenTextBlock: function(w) {
      return `<span data-title="${w}">${this.evenText(w)}</span>`;
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
  (function() {
    if (needRedirect())
      return;
    const T0 = performance.now();
    const { pathname, hostname, host, search } = location;
    const { setStorageConfigItem, getStorageConfigItem, getConfig, setConfig, setHistory, setUserinfo } = store;
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
      const prevConfig = getConfig();
      setStorageConfigItem("cachePfConfig", prevConfig);
      setConfig(await myStorage.initConfig());
      setHistory(await myStorage.initHistory());
      initHistoryView();
      onInitStyleExtra();
      EXTRA_CLASS_HTML[host] && dom("html").classList.add(EXTRA_CLASS_HTML[host]);
      const prevHeaders = getStorageConfigItem("fetchHeaders");
      const originFetch = fetch;
      unsafeWindow.fetch = (url, opt) => {
        if (/\/answers\?/.test(url) && (myListenSelect.keySort === "vote" || myListenSelect.keySort === "comment") && myListenSelect.isSortFirst) {
          url = url.replace(/(?<=limit=)\d+(?=&)/, "20");
        }
        if (opt && opt.headers) {
          setStorageConfigItem("fetchHeaders", {
            ...prevHeaders,
            ...opt.headers
          });
        }
        return originFetch(url, opt);
      };
      const matched = search.match(/(?<=sort=)\w+/);
      if (/\/question/.test(pathname) && matched) {
        myListenSelect.keySort = matched[0];
      }
      setUserinfo(await fetchGetUserinfo());
    }
    onDocumentStart();
    window.addEventListener(
      "DOMContentLoaded",
      async () => {
        if (!isHaveHeadWhenInit) {
          await onDocumentStart();
        }
        if (HTML_HOOTS.includes(hostname) && !window.frameElement) {
          initHTML();
          initOperate();
          initData();
          loadBackground();
          myVersion.initAfterLoad();
          myCustomStyle.init();
          myFilterWord.init();
          initResizeObserver();
          myCtzTypeOperation.init();
          echoHistory();
          dom('[name="useSimple"]').onclick = async function() {
            const isUse = confirm("是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存");
            if (!isUse)
              return;
            const prevConfig = store.getConfig();
            myStorage.configUpdate({
              ...prevConfig,
              ...CONFIG_SIMPLE
            });
            onDocumentStart();
            initData();
          };
        }
        pathnameHasFn({
          question: () => {
            myListenSelect.init();
            addQuestionCreatedAndModifiedTime();
            const nodeQuestionAnswer = dom(".QuestionAnswer-content");
            nodeQuestionAnswer && fnJustNum(nodeQuestionAnswer);
            initInviteOnce();
          },
          video: () => myVideo.init(),
          filter: () => myPageFilterSetting.init(),
          collection: () => myCollectionExport.init(),
          following: () => myFollowRemove.init()
        });
        if (host === "zhuanlan.zhihu.com") {
          addArticleCreateTimeToTop();
        }
        fnLog(
          `加载完毕, 加载时长: ${Math.floor((performance.now() - T0) / 10) / 100}s, 可使用 shift + . 或点击左侧眼睛按钮唤起修改器弹窗，如果快捷键不生效可以在控制台使用 window.openCtz() 唤起`
        );
      },
      false
    );
    window.addEventListener("load", () => {
      const nodeSignModal = dom(".signFlowModal");
      const nodeSignClose = nodeSignModal && nodeSignModal.querySelector(".Modal-closeButton");
      nodeSignClose && nodeSignClose.click();
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
    unsafeWindow.openCtz = myDialog.open;
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
    const changeHistory = () => {
      pathnameHasFn({
        filter: () => myPageFilterSetting.init(),
        following: () => myFollowRemove.init()
      });
      myListenListItem.reset();
      myListenSearchListItem.reset();
      myListenAnswerItem.reset();
    };
    window.addEventListener("popstate", changeHistory);
    window.addEventListener("pushState", changeHistory);
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
