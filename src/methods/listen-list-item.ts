import { fnHiddenDom, fnJustNum } from '../commons/math-for-my-listens';
import { myStorage } from '../commons/storage';
import { domA, domById, domC, domP } from '../commons/tools';
import { CLASS_NOT_INTERESTED, CLASS_TO_QUESTION, FILTER_FOLLOWER_OPERATE, THEME_CONFIG_DARK, THEME_CONFIG_LIGHT } from '../configs';
import { store } from '../store';
import { EThemeDark, EThemeLight, IZhihuCardContent, IZhihuDataZop } from '../types';
import { IZhihuListTargetItem } from '../types/zhihu-list.type';
import { isDark } from './background';

/** 监听列表内容 - 过滤  */
export const myListenListItem = {
  index: 0,
  init: async function () {
    const { getConfig, getHistory, getUserinfo, getZhihuListTargets } = store;
    const pfConfig = getConfig();
    // const listTargets = getZhihuListTargets();
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
      themeDark = EThemeDark.夜间护眼一,
      themeLight = EThemeLight.默认,
      removeMyOperateAtFollow,
      listOutputToQuestion,
      fetchInterceptStatus,
    } = pfConfig;
    const elements = domA('.TopstoryItem');
    let lessNum = 0;
    await myStorage.initHistory();
    const pfHistory = getHistory();
    const historyList = pfHistory.list;
    for (let i = this.index, len = elements.length; i < len; i++) {
      let message = ''; // 屏蔽信息
      let dataZop: IZhihuDataZop = {};
      let cardContent: IZhihuCardContent = {};
      const nodeItem = elements[i];
      const nodeItemContent = nodeItem.querySelector('.ContentItem');
      if (!nodeItem.scrollHeight || !nodeItemContent) continue;
      /** 是否视频回答 */
      const isVideo = nodeItemContent.classList.contains('ZVideoItem');
      /** 是否文章 */
      const isArticle = nodeItemContent.classList.contains('ArticleItem');
      /** 是否想法 */
      const isTip = nodeItemContent.classList.contains('PinItem');
      const nodeContentItemTitle = nodeItem.querySelector('.ContentItem-title');
      // 列表外置不感兴趣按钮
      if (listOutPutNotInterested && fetchInterceptStatus) {
        const nDomNotInterested = domC('button', { innerText: '不感兴趣', className: CLASS_NOT_INTERESTED });
        !nodeItem.querySelector(`.${CLASS_NOT_INTERESTED}`) && nodeContentItemTitle && nodeContentItemTitle.appendChild(nDomNotInterested);
      }
      // 推荐列表显示「直达问题」按钮
      if (listOutputToQuestion) {
        const nDomToQuestion = domC('button', { innerText: '直达问题', className: CLASS_TO_QUESTION });
        if (!isVideo && !isArticle && !isTip) {
          !nodeItem.querySelector(`.${CLASS_TO_QUESTION}`) && nodeContentItemTitle && nodeContentItemTitle.appendChild(nDomToQuestion);
        }
      }
      try {
        dataZop = JSON.parse(nodeItemContent.getAttribute('data-zop') || '{}');
        cardContent = JSON.parse(nodeItemContent.getAttribute('data-za-extra-module') || '{}').card.content;
      } catch {}
      const { title = '' } = dataZop || {};
      // 关注列表屏蔽自己的操作
      if (removeMyOperateAtFollow && nodeItem.classList.contains('TopstoryItem-isFollow')) {
        try {
          const userinfo = getUserinfo();
          const nodeUserLink = nodeItem.querySelector('.UserLink .UserLink-link') as HTMLAnchorElement;
          const findUserId = nodeUserLink.href.match(/[^\/]+$/)![0];
          const myUserId = userinfo!.url.match(/[^\/]+$/)![0];
          findUserId === myUserId && (message = '关注列表屏蔽自己的操作');
        } catch {}
      }
      // 列表种类过滤
      ((isVideo && removeItemAboutVideo) || (isArticle && removeItemAboutArticle) || (isTip && removeItemAboutPin)) &&
        !message &&
        (message = `列表种类屏蔽，${nodeItemContent.classList.value}`);
      // 屏蔽低赞内容
      if (removeLessVote && !message) {
        (cardContent['upvote_num'] || 0) < lessVoteNumber && (message = `屏蔽低赞内容: ${title}, ${cardContent['upvote_num']}`);
      }
      // 屏蔽邀请回答
      const elementQuestionAsk = nodeItem.querySelector('.TopstoryQuestionAskItem');
      if (removeItemQuestionAsk && elementQuestionAsk && !message) {
        message = '屏蔽邀请回答';
      }
      // 关注列表屏蔽关注人操作
      const isFilterFollowerOperate = removeFollowVoteAnswer || removeFollowVoteArticle || removeFollowFQuestion;
      if (isFilterFollowerOperate && !message && nodeItem.classList.contains('TopstoryItem-isFollow')) {
        const nodeFirstLine = nodeItem.querySelector('.FeedSource-firstline') as HTMLElement;
        const textFollowerOperate = nodeFirstLine ? nodeFirstLine.innerText : '';
        for (let itemOperate of FILTER_FOLLOWER_OPERATE) {
          const thisRep = new RegExp(itemOperate.rep);
          if (pfConfig[itemOperate.key] && thisRep.test(textFollowerOperate)) {
            message = `屏蔽关注人操作: ${textFollowerOperate}`;
            break;
          }
        }
      }
      !message && (message = this.replaceBlockWord(title, nodeItemContent, filterKeywords, title, '标题'));
      if (!message) {
        const domRichContent = nodeItem.querySelector('.RichContent');
        const innerText = domRichContent ? (domRichContent as HTMLElement).innerText : '';
        message = this.replaceBlockWord(innerText, nodeItemContent, blockWordsAnswer, title, '内容');
      }
      // 高亮原创
      const userNameE = nodeItem.querySelector('.FeedSource-firstline .UserLink-link') as HTMLElement;
      const userName = userNameE ? userNameE.innerText : '';
      if (highlightOriginal && dataZop && dataZop.authorName === userName && !message) {
        const highlight = `background: ${
          isDark()
            ? `${THEME_CONFIG_DARK[themeDark].background2}!important;`
            : themeLight === EThemeLight.默认
            ? '#fff3d4!important;'
            : `${THEME_CONFIG_LIGHT[themeLight].background}!important;`
        }`;
        const nodeActions = nodeItem.querySelector('.ContentItem-actions') as HTMLElement;
        nodeItem.style.cssText = `${highlight}border: 1px solid #aaa;`;
        nodeActions && (nodeActions.style.cssText = highlight);
      }
      // 最后信息 & 起点位置处理
      message && (lessNum = fnHiddenDom(lessNum, nodeItem, message));
      // 缓存推荐列表
      if (domP(nodeItem, 'class', 'Topstory-recommend') && nodeItem.querySelector('.ContentItem-title a')) {
        const nodeATitle = nodeItem.querySelector('.ContentItem-title a') as HTMLAnchorElement;
        if (nodeATitle) {
          const itemHref = nodeATitle.href;
          const itemTitle = nodeATitle.innerText;
          const itemA = `<a href="${itemHref}" target="_blank">${itemTitle}</a>`;
          if (!historyList.includes(itemA)) {
            historyList.unshift(itemA);
          }
        }
      }
      fnJustNum(nodeItem);
      if (i + 1 === len) {
        const nI = i - lessNum >= 0 ? i - lessNum : 0;
        this.index = nI;
        myStorage.historyUpdate('list', historyList);
      }
    }
  },
  reset: function () {
    this.index = 0;
    // if (store.getZhihuListTargets().length > 25) {
    //   store.clearZhihuListTargets();
    //   this.getScriptData();
    // }
  },
  restart: function () {
    this.reset();
    this.init();
  },
  getScriptData: function () {
    try {
      const initialData = JSON.parse(domById('js-initialData')?.innerHTML ?? '{}');
      const answers = initialData.initialState.entities.answers;
      const nTargets = [];
      for (let key in answers) {
        nTargets.push(answers[key]);
      }
      store.setZhihuListTargets(nTargets as IZhihuListTargetItem[]);
    } catch (err) {}
  },
  replaceBlockWord: function (innerText: string, nodeItemContent: Element, blockWords: string[], title: string, byWhat: string) {
    if (innerText) {
      let matchedWord = '';
      for (let word of blockWords) {
        const rep = new RegExp(word.toLowerCase());
        if (rep.test(innerText.toLowerCase())) {
          matchedWord += `「${word}」`;
          break;
        }
      }
      if (matchedWord) {
        const elementItemProp = nodeItemContent.querySelector('[itemprop="url"]');
        const routeURL = elementItemProp && elementItemProp.getAttribute('content');
        return `${byWhat}屏蔽词匹配，匹配内容：${matchedWord}，《${title}》，链接：${routeURL}`;
      }
    }
    return '';
  },
};
