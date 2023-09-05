"use strict";
(() => {
  // src/inner/redirect.ts
  var needRedirect = () => {
    const { pathname, origin } = location;
    const PATHNAME_FOR_PHONE_QUESTION = "/tardis/sogou/qus/";
    const PATHNAME_FOR_PHONE_ART = "/tardis/zm/art/";
    if (pathname.includes(PATHNAME_FOR_PHONE_QUESTION)) {
      const questionId = pathname.replace(PATHNAME_FOR_PHONE_QUESTION, "");
      location.href = origin + "/question/" + questionId;
      return true;
    }
    if (pathname.includes(PATHNAME_FOR_PHONE_ART)) {
      const questionId = pathname.replace(PATHNAME_FOR_PHONE_ART, "");
      location.href = "https://zhuanlan.zhihu.com/p/" + questionId;
      return true;
    }
    return false;
  };

  // src/methods/fetch.ts
  var fetchGetUserinfo = (headers) => {
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

  // src/variable/dom-name.ts
  var HTML_HOOTS = ["www.zhihu.com", "zhuanlan.zhihu.com"];
  var ID_BLOCK_LIST = "CTZ-BLOCK-LIST";
  var ID_BUTTON_SYNC_BLOCK = "CTZ-BUTTON-SYNC-BLOCK";
  var CLASS_REMOVE_BLOCK = "ctz-remove-block";
  var OB_CLASS_FOLD = {
    on: "ctz-fold-open",
    off: "ctz-fold-close"
  };
  var EXTRA_CLASS_HTML = {
    "zhuanlan.zhihu.com": "zhuanlan",
    "www.zhihu.com": "zhihu"
  };

  // src/variable/hidden.ts
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

  // src/variable/configs.ts
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

  // src/store/index.ts
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
        colorBackground: "#ffffff",
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
        hotKey: true
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

  // src/methods/storage.ts
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
    initConfig: async function(config) {
      const nConfig = await this.get("pfConfig");
      const c = nConfig ? JSON.parse(nConfig) : {};
      return Promise.resolve({ ...config, ...c });
    },
    initHistory: async function(historyConfig) {
      const nHistory = await myStorage.get("pfHistory");
      const h = nHistory ? JSON.parse(nHistory) : historyConfig;
      return Promise.resolve(h);
    }
  };

  // src/methods/tools.ts
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
  var fnReturnStr = (str, isHave = false, strFalse = "") => isHave ? str : strFalse;
  var fnLog = (...str) => console.log("%c「修改器」", "color: green;font-weight: bold;", ...str);
  var fnDomReplace = (node, attrObjs) => {
    if (!node)
      return;
    for (let key in attrObjs) {
      node[key] = attrObjs[key];
    }
  };

  // src/methods/black.ts
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
      const { getConfig, setConfig } = store;
      const pfConfig = getConfig();
      const nL = pfConfig.removeBlockUserContentList ?? [];
      nL.push(info);
      pfConfig.removeBlockUserContentList = nL;
      setConfig(pfConfig);
      myStorage.set("pfConfig", JSON.stringify(pfConfig));
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
          "x-xsrftoken": document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)?.[0] ?? ""
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
          "x-xsrftoken": document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)?.[0] ?? ""
        }),
        credentials: "include"
      }).then(() => {
        const { getConfig, setConfig } = store;
        const pfConfig = getConfig();
        const nL = pfConfig.removeBlockUserContentList ?? [];
        const itemIndex = nL.findIndex((i) => i.id === info.id);
        if (itemIndex >= 0) {
          nL.splice(itemIndex, 1);
          pfConfig.removeBlockUserContentList = nL;
          const removeItem = dom(`.ctz-black-id-${id}`);
          removeItem && removeItem.remove();
          setConfig(pfConfig);
          myStorage.set("pfConfig", JSON.stringify(pfConfig));
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
          const { getConfig, setConfig } = store;
          const pfConfig = getConfig();
          pfConfig.removeBlockUserContentList = l;
          setConfig(pfConfig);
          myStorage.set("pfConfig", JSON.stringify(pfConfig));
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

  // src/methods/listen-math.ts
  var fnHiddenDom = (lessNum, ev, log) => {
    ev.style.display = "none";
    fnLog(log);
    return ++lessNum;
  };
  var fnIndexMath = (index, i, len, lessNum) => {
    return i + 1 === len ? i - lessNum >= 0 ? i - lessNum : 0 : index;
  };
  var fnJustNum = (element, conf) => {
    if (!element)
      return;
    const { justVoteNum, justCommitNum } = conf;
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

  // src/methods/time.ts
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

  // src/methods/listen-answer.ts
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
      }
      const hiddenTags = Object.keys(HIDDEN_ANSWER_TAG);
      let hiddenUsers = [];
      for (let i in HIDDEN_ANSWER_ACCOUNT) {
        conf[i] && hiddenUsers.push(HIDDEN_ANSWER_ACCOUNT[i]);
      }
      removeBlockUserContent && (hiddenUsers = hiddenTags.concat((removeBlockUserContentList || []).map((i) => i.name ?? "")));
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
        fnJustNum(elementThis, conf);
        if (!message) {
          conf.answerItemCreatedAndModifiedTime && addTimes(elementThis);
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

  // src/methods/listen-select.ts
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

  // src/index.ts
  (function() {
    if (needRedirect())
      return;
    const T0 = performance.now();
    const { pathname, hostname, host, origin, search, hash, href } = location;
    const { setStorageConfigItem, getStorageConfigItem, getConfig, setConfig, setHistory, getHistory, setUserinfo } = store;
    let isHaveHeadWhenInit = true;
    async function onDocumentStart() {
      if (!HTML_HOOTS.includes(hostname) || window.frameElement)
        return;
      if (!document.head) {
        fnLog("not find document.head, waiting for reload...");
        isHaveHeadWhenInit = false;
        return;
      }
      const prevConfig = getConfig();
      setStorageConfigItem("cachePfConfig", prevConfig);
      setConfig(await myStorage.initConfig(prevConfig));
      setHistory(await myStorage.initHistory(getHistory()));
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
      setUserinfo(await fetchGetUserinfo(prevHeaders));
    }
    onDocumentStart();
  })();
  console.log(myBlack);
})();
