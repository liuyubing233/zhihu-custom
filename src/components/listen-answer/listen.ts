import { doContentItem } from '../../init/init-top-event-listener';
import { CLASS_LISTENED } from '../../misc';
import { store } from '../../store';
import { CTZ_HIDDEN_ITEM_CLASS, dom, domA, fnHidden, fnLog, myStorage } from '../../tools';
import { IZhihuCardContent, IZhihuDataZop } from '../../types/zhihu/zhihu.type';
import { EAnswerOpen } from '../select';

/** 监听详情回答 - 过滤 */
export const myListenAnswer = {
  initTimestamp: 0,
  loaded: true,
  init: async function () {
    if (!location.pathname.includes('/question/') || !this.loaded) return;
    const currentTime = +new Date();
    if (currentTime - this.initTimestamp < 500) {
      setTimeout(() => this.init(), 500);
      return;
    }
    this.loaded = false;

    const questionAnswerContent = dom('.QuestionAnswer-content');
    questionAnswerContent && doContentItem('QUESTION', questionAnswerContent.querySelector('.ContentItem') as HTMLElement);
    processingData(domA(`.AnswersNavWrapper .List-item:not(.${CLASS_LISTENED})`));
  },
  reset: function () {
    this.dataLoad();
    domA(`.AnswersNavWrapper .List-item.${CLASS_LISTENED}`).forEach((item) => {
      item.classList.remove(CLASS_LISTENED);
    });
  },
  restart: function () {
    this.reset();
    this.init();
  },
  dataLoad: function () {
    this.loaded = true;
  },
};

const OB_CLASS_FOLD = {
  on: 'ctz-fold-open',
  off: 'ctz-fold-close',
};

const processingData = async (nodes: NodeListOf<HTMLElement>) => {
  const removeAnswers = store.getRemoveAnswers();
  const config = await myStorage.getConfig();
  const {
    removeFromYanxuan,
    removeUnrealAnswer,
    removeFromEBook,
    removeAnonymousAnswer,
    removeLessVoteDetail,
    lessVoteNumberDetail = 0,
    answerOpen = EAnswerOpen.默认,
    removeBlockUserContent,
    blockedUsers,
    blockWordsAnswer = [],
    highPerformanceAnswer,
  } = config;

  for (let i = 0, len = nodes.length; i < len; i++) {
    let message = '';
    const nodeItem = nodes[i];
    nodeItem.classList.add(CLASS_LISTENED);
    nodeItem.dataset.code = `${+new Date()}-${i}`; // 添加唯一标识
    if (nodeItem.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;
    const nodeItemContent = nodeItem.querySelector('.ContentItem');
    if (!nodeItemContent) continue;
    let dataZop: IZhihuDataZop = {};
    let dataCardContent: IZhihuCardContent = {}; // 回答扩展信息
    try {
      dataZop = JSON.parse(nodeItemContent.getAttribute('data-zop') || '{}');
      dataCardContent = JSON.parse(nodeItemContent.getAttribute('data-za-extra-module') || '{}').card.content;
    } catch {}
    // FIRST
    // 低赞回答过滤
    (dataCardContent['upvote_num'] || 0) < lessVoteNumberDetail && removeLessVoteDetail && (message = `过滤低赞回答: ${dataCardContent['upvote_num']}赞`);

    // 屏蔽接口过滤的回答，如盐选专栏...
    if (!message && removeFromYanxuan) {
      const itemId = String(dataZop.itemId || '');
      const findItem = removeAnswers.find((i) => i.id === itemId);
      findItem && (message = findItem.message);
    }

    // 屏蔽带有选中标签的回答
    if (!message) {
      const nodeTag1 = nodeItem.querySelector('.KfeCollection-AnswerTopCard-Container') as HTMLElement;
      const nodeTag2 = nodeItem.querySelector('.LabelContainer-wrapper') as HTMLElement;
      const tagNames = (nodeTag1 ? nodeTag1.innerText : '') + (nodeTag2 ? nodeTag2.innerText : '');
      if (removeUnrealAnswer) {
        tagNames.includes('虚构创作') && (message = '已删除一条虚构创作的回答');
      }

      if (removeFromEBook) {
        tagNames.includes('电子书') && (message = '已删除一条来自电子书的回答');
      }
    }

    // 屏蔽用户的回答
    if (!message && removeBlockUserContent && blockedUsers && blockedUsers.length) {
      const findBlocked = blockedUsers.find((i) => i.id === dataCardContent.author_member_hash_id);
      findBlocked && (message = `已删除黑名单用户${findBlocked.name}的回答`);
    }

    // 屏蔽「匿名用户」回答
    if (!message && removeAnonymousAnswer) {
      const userName = (nodeItem.querySelector('[itemprop="name"]') as HTMLMetaElement).content;
      userName === '匿名用户' && (message = `已屏蔽一条「匿名用户」回答`);
    }

    // 屏蔽词
    if (!message) {
      const domRichContent = nodeItem.querySelector('.RichContent');
      const innerText = domRichContent ? (domRichContent as HTMLElement).innerText : '';
      if (innerText) {
        let matchedWord = '';
        for (let itemWord of blockWordsAnswer) {
          const rep = new RegExp(itemWord.toLowerCase());
          if (rep.test(innerText.toLowerCase())) {
            matchedWord += `「${itemWord}」`;
            break;
          }
        }
        if (matchedWord) {
          message = `匹配到屏蔽词${matchedWord}，已屏蔽该回答内容`;
        }
      }
    }

    if (message) {
      // 最后信息 & 起点位置处理
      fnHidden(nodeItem, message);
    } else {
      doContentItem('QUESTION', nodeItemContent as HTMLElement);
      // 自动展开回答 和 默认收起长回答
      if (answerOpen !== EAnswerOpen.默认) {
        const buttonUnfold = nodeItem.querySelector('.ContentItem-expandButton') as HTMLButtonElement;
        const buttonFold = nodeItem.querySelector('.RichContent-collapsedText') as HTMLButtonElement;
        if (answerOpen === EAnswerOpen.自动展开所有回答 && !nodeItem.classList.contains(OB_CLASS_FOLD.on)) {
          buttonUnfold && buttonUnfold.click();
          nodeItem.classList.add(OB_CLASS_FOLD.on);
        }
        const isF = buttonFold && nodeItem.offsetHeight > 939;
        const isFC = buttonUnfold; // 已经收起的回答
        if (answerOpen === EAnswerOpen.收起长回答 && !nodeItem.classList.contains(OB_CLASS_FOLD.off) && (isF || isFC)) {
          nodeItem.classList.add(OB_CLASS_FOLD.off);
          isF && buttonFold && buttonFold.click();
        }
      }
    }
  }

  if (highPerformanceAnswer) {
    setTimeout(() => {
      console.log('Timeout highPerformanceAnswer');
      const nodes = domA('.AnswersNavWrapper .List-item');
      if (nodes.length > 30) {
        const nIndex = nodes.length - 30;
        nodes.forEach((item, index) => {
          if (index < nIndex) {
            item.remove();
          }
        });
        fnLog(`已开启高性能模式，删除${nIndex}条回答`);
      }
    }, 500);
  }
};
