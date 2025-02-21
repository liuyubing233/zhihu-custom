import { CTZ_HIDDEN_ITEM_CLASS, fnHidden, fnJustNum } from '../commons/math-for-my-listens';
import { myStorage } from '../commons/storage';
import { dom, domA, fnLog } from '../commons/tools';
import { CLASS_LISTENED, HIDDEN_ANSWER_TAG, OB_CLASS_FOLD } from '../configs';
import { IZhihuCardContent, IZhihuDataZop } from '../types';
import { answerAddBlockButton } from './black';
import { addAnswerCopyLink } from './link';
import { printAnswer, printArticle } from './print';
import { updateItemTime } from './time';
import { updateTopVote } from './topVote';
import { initVideoDownload } from './video';

/** 监听详情回答 - 过滤 */
export const myListenAnswerItem = {
  initTimestamp: 0,
  init: async function () {
    const currentTime = +new Date();
    if (currentTime - this.initTimestamp < 500) {
      setTimeout(() => this.init(), 500);
      return;
    }

    const nodes = domA(`.AnswersNavWrapper .List-item:not(.${CLASS_LISTENED})`);
    const config = await myStorage.getConfig();
    const {
      removeLessVoteDetail,
      lessVoteNumberDetail = 0,
      answerOpen,
      removeBlockUserContent,
      blockedUsers,
      removeAnonymousAnswer,
      topExportContent,
      blockWordsAnswer = [],
      fetchInterceptStatus,
      answerItemCreatedAndModifiedTime,
      highPerformanceAnswer,
    } = config;

    /** 添加功能 */
    const addFnInNodeItem = (nodeItem?: HTMLElement, initThis?: any) => {
      if (!nodeItem) return;
      updateTopVote(nodeItem);
      answerItemCreatedAndModifiedTime && updateItemTime(nodeItem);
      initVideoDownload(nodeItem);
      addAnswerCopyLink(nodeItem);
      if (fetchInterceptStatus) {
        answerAddBlockButton(nodeItem, initThis);
        if (topExportContent) {
          printAnswer(nodeItem);
          printArticle(nodeItem);
        }
      }
    };

    addFnInNodeItem(dom('.QuestionAnswer-content'));
    const hiddenTags = Object.keys(HIDDEN_ANSWER_TAG);
    // 屏蔽用户名称列表
    let removeUsernames: string[] = [];
    removeBlockUserContent && (removeUsernames = (blockedUsers || []).map((i) => i.name || ''));
    for (let i = 0, len = nodes.length; i < len; i++) {
      let message = '';
      const nodeItem = nodes[i];
      nodeItem.classList.add(CLASS_LISTENED);
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

      // 屏蔽带有选中标签的回答
      if (!message) {
        const nodeTag1 = nodeItem.querySelector('.KfeCollection-AnswerTopCard-Container') as HTMLElement;
        const nodeTag2 = nodeItem.querySelector('.LabelContainer-wrapper') as HTMLElement;
        const tagNames = (nodeTag1 ? nodeTag1.innerText : '') + (nodeTag2 ? nodeTag2.innerText : '');
        for (let i of hiddenTags) {
          if (config[i]) {
            const nReg = new RegExp(HIDDEN_ANSWER_TAG[i]);
            nReg.test(tagNames) && (message = `已删除一条标签${HIDDEN_ANSWER_TAG[i]}的回答`);
          }
        }
      }
      // 屏蔽用户的回答
      if (!message) {
        removeUsernames.includes(dataZop.authorName || '') && (message = `已删除${dataZop.authorName}的回答`);
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
        addFnInNodeItem(nodeItem, this);
        fnJustNum(nodeItem);
        // 自动展开回答 和 默认收起长回答
        if (answerOpen) {
          const buttonUnfold = nodeItem.querySelector('.ContentItem-expandButton') as HTMLButtonElement;
          const buttonFold = nodeItem.querySelector('.RichContent-collapsedText') as HTMLButtonElement;
          if (answerOpen === 'on' && !nodeItem.classList.contains(OB_CLASS_FOLD.on)) {
            buttonUnfold && buttonUnfold.click();
            nodeItem.classList.add(OB_CLASS_FOLD.on);
          }
          const isF = buttonFold && nodeItem.offsetHeight > 939;
          const isFC = buttonUnfold; // 已经收起的回答
          if (answerOpen === 'off' && !nodeItem.classList.contains(OB_CLASS_FOLD.off) && (isF || isFC)) {
            nodeItem.classList.add(OB_CLASS_FOLD.off);
            isF && buttonFold && buttonFold.click();
          }
        }
      }
    }

    if (highPerformanceAnswer) {
      setTimeout(() => {
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
  },
  reset: function () {
    domA(`.AnswersNavWrapper .List-item.${CLASS_LISTENED}`).forEach((item) => {
      item.classList.remove(CLASS_LISTENED);
    });
  },
  restart: function () {
    this.reset();
    this.init();
  },
};
