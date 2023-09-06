import { doFetchNotInterested } from '../commons/fetch';
import { fnHiddenDom, fnJustNum } from '../commons/math-for-my-listens';
import { myStorage } from '../commons/storage';
import { domA, domC, domP } from '../commons/tools';
import { BACKGROUND_DARK_COLORS, CLASS_NOT_INTERESTED, FILTER_FOLLOWER_OPERATE, SAVE_HISTORY_NUMBER } from '../configs';
import { store } from '../store';
import { IZhihuCardContent, IZhihuDataZop } from '../types';
import { myBackground } from './styles';

/** 监听列表内容 - 过滤  */
export const myListenListItem = {
  index: 0,
  init: async function () {
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
      colorBackground = '',
      removeMyOperateAtFollow,
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
      // 列表外置不感兴趣按钮
      if (listOutPutNotInterested) {
        const elementNotInterested = domC('button', { innerText: '不感兴趣', className: CLASS_NOT_INTERESTED });
        const nodeContentItemTitle = nodeItem.querySelector('.ContentItem-title');
        !nodeItem.querySelector(`.${CLASS_NOT_INTERESTED}`) && nodeContentItemTitle && nodeContentItemTitle.appendChild(elementNotInterested);
      }
      try {
        dataZop = JSON.parse(nodeItemContent.getAttribute('data-zop') || '{}');
        cardContent = JSON.parse(nodeItemContent.getAttribute('data-za-extra-module') || '{}').card.content;
      } catch {}
      const { itemId = '', title = '', type = '' } = dataZop || {};
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
      const haveVideo = nodeItemContent.classList.contains('ZVideoItem') && removeItemAboutVideo;
      const haveArticle = nodeItemContent.classList.contains('ArticleItem') && removeItemAboutArticle;
      (haveVideo || haveArticle) && !message && (message = '列表种类屏蔽');
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
      if (!message) {
        let matchedWord = ''; // 匹配到的内容, 仅匹配第一个
        for (let itemWord of filterKeywords) {
          const rep = new RegExp(itemWord.toLowerCase());
          if (rep.test(title.toLowerCase())) {
            matchedWord += `「${itemWord}」`;
            break;
          }
        }
        // 匹配到屏蔽词, 屏蔽词过滤
        if (matchedWord) {
          const elementItemProp = nodeItemContent.querySelector('[itemprop="url"]');
          const routeURL = elementItemProp && elementItemProp.getAttribute('content');
          doFetchNotInterested({ id: String(itemId), type });
          message = `屏蔽列表内容: ${title},匹配屏蔽词：${matchedWord}, 链接：${routeURL}`;
        }
      }
      // 高亮原创
      const userNameE = nodeItem.querySelector('.FeedSource-firstline .UserLink-link') as HTMLElement;
      const userName = userNameE ? userNameE.innerText : '';
      if (highlightOriginal && dataZop && dataZop.authorName === userName && !message) {
        const highlight = `background: ${
          myBackground.isUseDark()
            ? `${BACKGROUND_DARK_COLORS[colorBackground].b2}!important;`
            : colorBackground === '#ffffff'
            ? '#fff3d4!important;'
            : `${colorBackground}!important;`
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
        myStorage.set('pfHistory', JSON.stringify(pfHistory));
      }
    }
  },
  reset: function () {
    this.index = 0;
  },
  restart: function () {
    this.reset();
    this.init();
  },
};
