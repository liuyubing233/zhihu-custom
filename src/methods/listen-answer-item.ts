import { fnHiddenDom, fnIndexMath, fnJustNum } from '../commons/math-for-my-listens';
import { dom, domA } from '../commons/tools';
import { HIDDEN_ANSWER_ACCOUNT, HIDDEN_ANSWER_TAG, OB_CLASS_FOLD } from '../configs';
import { store } from '../store';
import { IMyListenAnswerItem, IZhihuCardContent, IZhihuDataZop } from '../types';
import { myBlack } from './black';
import { addButtonForAnswerExportPDF, addButtonForArticleExportPDF } from './export-PDF';
import { addAnswerCopyLink } from './link';
import { updateItemTime } from './time';
import { updateTopVote } from './topVote';
import { initVideoDownload } from './video';

/** 监听详情回答 - 过滤 */
export const myListenAnswerItem: IMyListenAnswerItem = {
  index: 0,
  init: function () {
    const { getConfig } = store;
    const conf = getConfig();
    // myListenSelect.addSort();
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
      answerItemCreatedAndModifiedTime,
    } = conf;

    /** 添加功能 */
    const addFnInNodeItem = (nodeItem?: HTMLElement, initThis?: any) => {
      if (!nodeItem) return;
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

    addFnInNodeItem(dom('.QuestionAnswer-content'));
    const hiddenTags = Object.keys(HIDDEN_ANSWER_TAG);
    // 屏蔽用户名称列表
    let hiddenUsers = [];
    for (let i in HIDDEN_ANSWER_ACCOUNT) {
      conf[i] && hiddenUsers.push(HIDDEN_ANSWER_ACCOUNT[i]);
    }
    removeBlockUserContent && (hiddenUsers = hiddenTags.concat((removeBlockUserContentList || []).map((i) => i.name || '')));
    const elements = domA('.AnswersNavWrapper .List-item');
    let lessNum = 0;
    for (let i = this.index, len = elements.length; i < len; i++) {
      let message = '';
      const nodeItem = elements[i];
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
      // 屏蔽知乎官方账号回答
      if (removeZhihuOfficial && !message) {
        const labelE = nodeItem.querySelector('.AuthorInfo-name .css-n99yhz');
        const label = labelE ? labelE.getAttribute('aria-label') || '' : '';
        /知乎[\s]*官方帐号/.test(label) && (message = '已删除一条知乎官方帐号的回答');
      }
      // 屏蔽带有选中标签的回答
      let isHiddenTag = false;
      hiddenTags.forEach((i) => conf[i] && (isHiddenTag = true));
      if (isHiddenTag && !message) {
        const nodeTag1 = nodeItem.querySelector('.KfeCollection-AnswerTopCard-Container') as HTMLElement;
        const nodeTag2 = nodeItem.querySelector('.LabelContainer-wrapper') as HTMLElement;
        const text1 = nodeTag1 ? nodeTag1.innerText : '';
        const text2 = nodeTag2 ? nodeTag2.innerText : '';
        const tagText = text1 + text2;
        hiddenTags.forEach((i) => {
          if (conf[i]) {
            const nReg = new RegExp(HIDDEN_ANSWER_TAG[i]);
            nReg.test(tagText) && (message = `已删除一条标签${HIDDEN_ANSWER_TAG[i]}的回答`);
          }
        });
      }
      // 屏蔽用户 | 知乎账号的回答
      hiddenUsers.length && !message && hiddenUsers.includes(dataZop.authorName || '') && (message = `已删除${dataZop.authorName}的回答`);
      // 屏蔽「匿名用户」回答
      if (removeAnonymousAnswer && !message) {
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
      // 自动展开回答 和 默认收起长回答
      if (!message && answerOpen) {
        const unFoldButton = nodeItem.querySelector('.ContentItem-expandButton') as HTMLButtonElement;
        const foldButton = nodeItem.querySelector('.RichContent-collapsedText') as HTMLButtonElement;
        const isNotOpen = !nodeItem.classList.contains(OB_CLASS_FOLD.on);
        const isNotClose = !nodeItem.classList.contains(OB_CLASS_FOLD.off);
        if (answerOpen === 'on' && isNotOpen) {
          unFoldButton && unFoldButton.click();
          nodeItem.classList.add(OB_CLASS_FOLD.on);
          lessNum++;
        }
        const isF = foldButton && nodeItem.offsetHeight > 939;
        const isFC = unFoldButton; // 已经收起的回答
        if (answerOpen === 'off' && isNotClose && (isF || isFC)) {
          nodeItem.classList.add(OB_CLASS_FOLD.off);
          isF && foldButton && foldButton.click();
          lessNum++;
        }
      }
      fnJustNum(nodeItem);

      if (message) {
        // 最后信息 & 起点位置处理
        lessNum = fnHiddenDom(lessNum, nodeItem, message);
      } else {
        addFnInNodeItem(nodeItem, this);
      }

      this.index = fnIndexMath(this.index, i, len, lessNum);
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
