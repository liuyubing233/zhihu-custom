import { CLASS_LISTENED, CLASS_NOT_INTERESTED, CLASS_TO_QUESTION } from '../../misc';
import { store } from '../../store';
import { CTZ_HIDDEN_ITEM_CLASS, createButtonFontSize12, doFetchNotInterested, domP, fnHidden, myStorage } from '../../tools';
import { IZhihuCardContent, IZhihuDataZop } from '../../types/zhihu';
import { EThemeDark, EThemeLight, doHighlightOriginal } from '../background';

/** 处理数据 */
export const processingData = async (nodes: NodeListOf<HTMLElement>) => {
  if (!nodes.length) return;
  const userInfo = store.getUserInfo();
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
    themeDark = EThemeDark.深色一,
    themeLight = EThemeLight.默认,
    removeMyOperateAtFollow,
    listOutputToQuestion,
    fetchInterceptStatus,
    removeBlockUserContent,
    blockedUsers = [],
    notInterestedList = [],
  } = pfConfig;
  const pfHistory = await myStorage.getHistory();
  const historyList = pfHistory.list;
  const highlight = await doHighlightOriginal(backgroundHighlightOriginal, themeDark, themeLight);

  for (let i = 0, len = nodes.length; i < len; i++) {
    const nodeItem = nodes[i];
    if (nodeItem.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;
    nodeItem.classList.add(CLASS_LISTENED);
    nodeItem.dataset.code = `${+new Date()}-${i}`; // 添加唯一标识
    const nodeContentItem = nodeItem.querySelector('.ContentItem');
    if (!nodeItem.scrollHeight || !nodeContentItem) continue;
    let message = ''; // 屏蔽信息
    let dataZop: IZhihuDataZop = {};
    let cardContent: IZhihuCardContent = {};
    /** 是否视频回答 */
    const isVideo = nodeContentItem.classList.contains('ZVideoItem');
    /** 是否文章 */
    const isArticle = nodeContentItem.classList.contains('ArticleItem');
    /** 是否想法 */
    const isTip = nodeContentItem.classList.contains('PinItem');
    try {
      dataZop = JSON.parse(nodeContentItem.getAttribute('data-zop') || '{}');
      cardContent = JSON.parse(nodeContentItem.getAttribute('data-za-extra-module') || '{}').card.content;
    } catch {}
    const { title = '', itemId } = dataZop || {};
    // 未隐藏的元素需添加的内容
    /** 存在 .FeedSource 元素为关注列表内容 */
    const domFeedSource = nodeItem.querySelector('.FeedSource');
    if (domFeedSource) {
      // 关注列表屏蔽自己的操作
      if (removeMyOperateAtFollow && nodeItem.classList.contains('TopstoryItem-isFollow')) {
        try {
          const findUserId = (nodeItem.querySelector('.UserLink .UserLink-link') as HTMLAnchorElement).href.match(/[^\/]+$/)![0];
          const myUserId = userInfo!.url.match(/[^\/]+$/)![0];
          findUserId === myUserId && (message = '关注列表屏蔽自己的操作');
        } catch {}
      }

      // 关注人操作
      if (nodeItem.classList.contains('TopstoryItem-isFollow')) {
        const textFeed = domFeedSource.textContent || '';
        !message && removeFollowVoteAnswer && textFeed.includes('赞同了回答') && (message = '屏蔽关注人赞同的回答操作');
        !message && removeFollowVoteArticle && textFeed.includes('赞同了文章') && (message = '屏蔽关注人赞同了文章操作');
        !message && removeFollowFQuestion && textFeed.includes('关注了问题') && (message = '屏蔽关注人关注了问题操作');
      }
    }

    // 屏蔽不感兴趣内容
    if (!message) {
      notInterestedList.find((i) => i === title) && (message = `屏蔽不感兴趣的内容：${title}`);
    }

    // 屏蔽盐选等...
    if (!message) {
      const removeItem = removeRecommends.find((i) => i.id === String(itemId));
      removeItem && (message = `推荐列表已屏蔽${removeItem.message}: ${title}`);
    }

    // 屏蔽用户的内容
    if (!message && removeBlockUserContent && blockedUsers && blockedUsers.length) {
      const findBlocked = blockedUsers.find((i) => i.id === cardContent.author_member_hash_id);
      findBlocked && (message = `已删除黑名单用户${findBlocked.name}发布的内容：${title}`);
    }

    // 列表种类过滤
    !message && isVideo && removeItemAboutVideo && (message = `列表屏蔽视频：${title}`);
    !message && isArticle && removeItemAboutArticle && (message = `列表屏蔽文章：${title}`);
    !message && isTip && removeItemAboutPin && (message = `列表屏蔽想法`);

    // 屏蔽低赞内容
    if (!message && removeLessVote && (cardContent['upvote_num'] || 0) < lessVoteNumber) {
      message = `屏蔽低赞内容: ${title}, ${cardContent['upvote_num'] || 0}`;
    }
    // 屏蔽邀请回答
    if (!message && removeItemQuestionAsk && nodeItem.querySelector('.TopstoryQuestionAskItem')) {
      message = '屏蔽邀请回答';
    }

    // 标题屏蔽词过滤
    !message && (message = replaceBlockWord(title, nodeContentItem, filterKeywords, title, '标题'));
    // 内容屏蔽词过滤
    if (!message) {
      const domRichContent = nodeItem.querySelector('.RichContent');
      const innerText = domRichContent ? (domRichContent as HTMLElement).innerText : '';
      message = replaceBlockWord(innerText, nodeContentItem, blockWordsAnswer, title, '内容');
    }

    if (message) {
      // 是否需要隐藏元素
      fnHidden(nodeItem, message);
      const { itemId, type } = dataZop;
      doFetchNotInterested({ id: `${itemId || ''}`, type: `${type}` });
    } else {
      // 存在 domFeedSource 元素为关注列表
      if (domFeedSource) {
        const textFeed = domFeedSource.textContent || '';
        const domUserLink = nodeItem.querySelector('.FeedSource-firstline .UserLink-link') as HTMLElement;
        const userName = domUserLink ? domUserLink.innerText : '';
        // 高亮原创
        if (textFeed.includes('发布了想法') || (dataZop && dataZop.authorName === userName)) {
          const nodeActions = nodeItem.querySelector('.ContentItem-actions') as HTMLElement;
          nodeItem.style.cssText = highlightOriginal ? `${highlight}border: 1px solid #aaa;` : '';
          nodeActions && (nodeActions.style.cssText = highlightOriginal ? highlight : '');
        }
      }

      const nodeItemTitle = nodeItem.querySelector('.ContentItem-title');
      if (nodeItemTitle) {
        // 列表外置不感兴趣按钮
        if (listOutPutNotInterested && fetchInterceptStatus && !nodeItem.querySelector(`.${CLASS_NOT_INTERESTED}`)) {
          nodeItemTitle.appendChild(createButtonFontSize12('不感兴趣', CLASS_NOT_INTERESTED, { _params: { id: dataZop.itemId, type: dataZop.type, title } }));
        }
        // 推荐列表显示「直达问题」按钮
        if (listOutputToQuestion && !isVideo && !isArticle && !isTip && !nodeItem.querySelector(`.${CLASS_TO_QUESTION}`)) {
          const domUrl = nodeContentItem.querySelector('[itemprop="url"]');
          const pathAnswer = domUrl ? domUrl.getAttribute('content') || '' : '';
          nodeItemTitle.appendChild(createButtonFontSize12('直达问题', CLASS_TO_QUESTION, { _params: { path: pathAnswer.replace(/\/answer[\W\w]+/, '') } }));
        }
      }
    }
    // 缓存推荐列表
    if (domP(nodeItem, 'class', 'Topstory-recommend') && nodeItem.querySelector('.ContentItem-title a')) {
      const nodeA = nodeItem.querySelector('.ContentItem-title a') as HTMLAnchorElement;
      if (nodeA) {
        const typeObj = isVideo ? RECOMMEND_TYPE.zvideo : isArticle ? RECOMMEND_TYPE.article : isTip ? RECOMMEND_TYPE.pin : RECOMMEND_TYPE.answer;
        const historyItem = `<a href="${nodeA.href}" target="_blank"><b style="${typeObj.style}">「${typeObj.name}」</b>${nodeA.innerText}</a>`;
        !historyList.includes(historyItem) && historyList.unshift(historyItem);
      }
    }
    if (i === len - 1) {
      myStorage.updateHistoryItem('list', historyList);
    }
  }
};

const RECOMMEND_TYPE = {
  answer: {
    name: '问题',
    style: 'color: #ec7259',
  },
  article: {
    name: '文章',
    style: 'color: #00965e',
  },
  zvideo: {
    name: '视频',
    style: 'color: #12c2e9',
  },
  pin: {
    name: '想法',
    style: 'color: #9c27b0',
  },
};

const replaceBlockWord = (innerText: string, nodeItemContent: Element, blockWords: string[], title: string, byWhat: string) => {
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
};
