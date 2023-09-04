import { pfConfig } from '../variable/configs';
import { fnHiddenDom, fnIndexMath, fnJustNum } from './listen-math';

/** 监听详情回答 - 过滤 */
export const myListenAnswerItem = {
  index: 0,
  init: function () {
    myListenSelect.addSort();
    const {
      removeLessVoteDetail,
      lessVoteNumberDetail,
      answerOpen,
      removeZhihuOfficial,
      removeBlockUserContent,
      removeBlockUserContentList,
      showBlockUser,
      removeAnonymousAnswer,
    } = pfConfig;
    if (dom('.QuestionAnswer-content')) {
      pfConfig.answerItemCreatedAndModifiedTime && addTimes(dom('.QuestionAnswer-content'));
      showBlockUser && myBlack.addButton(dom('.QuestionAnswer-content'));
    }
    const hiddenTags = Object.keys(HIDDEN_ANSWER_TAG);
    // 屏蔽用户名称列表
    let hiddenUsers = [];
    for (let i in HIDDEN_ANSWER_ACCOUNT) {
      pfConfig[i] && hiddenUsers.push(HIDDEN_ANSWER_ACCOUNT[i]);
    }
    removeBlockUserContent && (hiddenUsers = hiddenTags.concat(removeBlockUserContentList.map((i) => i.name)));
    const elements = domA('.AnswersNavWrapper .List-item');
    let lessNum = 0;
    for (let i = this.index, len = elements.length; i < len; i++) {
      let message = '';
      const elementThis = elements[i];
      const elementInfo = elementThis.querySelector('.ContentItem');
      let dataZop = {};
      let dataCardContent = {}; // 回答扩展信息
      try {
        dataZop = JSON.parse(elementInfo.getAttribute('data-zop'));
        dataCardContent = JSON.parse(elementInfo.getAttribute('data-za-extra-module')).card.content;
      } catch {}
      // FIRST
      // 低赞回答过滤
      dataCardContent['upvote_num'] < lessVoteNumberDetail && removeLessVoteDetail && (message = `过滤低赞回答: ${dataCardContent['upvote_num']}赞`);
      // 屏蔽知乎官方账号回答
      if (removeZhihuOfficial && !message) {
        const labelE = elementThis.querySelector('.AuthorInfo-name .css-n99yhz');
        const label = labelE ? labelE.getAttribute('aria-label') : '';
        /知乎[\s]*官方帐号/.test(label) && (message = '已删除一条知乎官方帐号的回答');
      }
      // 屏蔽带有选中标签的回答
      let isHiddenTag = false;
      hiddenTags.forEach((i) => pfConfig[i] && (isHiddenTag = true));
      if (isHiddenTag && !message) {
        const nodeTag1 = elementThis.querySelector('.KfeCollection-AnswerTopCard-Container');
        const nodeTag2 = elementThis.querySelector('.LabelContainer-wrapper');
        const text1 = nodeTag1 ? nodeTag1.innerText : '';
        const text2 = nodeTag2 ? nodeTag2.innerText : '';
        const tagText = text1 + text2;
        hiddenTags.forEach((i) => {
          if (pfConfig[i]) {
            const nReg = new RegExp(HIDDEN_ANSWER_TAG[i]);
            nReg.test(tagText) && (message = `已删除一条标签${HIDDEN_ANSWER_TAG[i]}的回答`);
          }
        });
      }
      // 屏蔽用户 | 知乎账号的回答
      hiddenUsers.length && !message && hiddenUsers.includes(dataZop.authorName) && (message = `已删除${dataZop.authorName}的回答`);
      // 屏蔽「匿名用户」回答
      if (removeAnonymousAnswer && !message) {
        const userName = elementThis.querySelector('[itemprop="name"]').content;
        userName === '匿名用户' && (message = `已屏蔽一条「匿名用户」回答`);
      }
      // 自动展开回答 和 默认收起长回答
      if (!message && answerOpen) {
        const unFoldButton = elementThis.querySelector('.ContentItem-expandButton');
        const foldButton = elementThis.querySelector('.RichContent-collapsedText');
        const isNotOpen = !elementThis.classList.contains(OB_CLASS_FOLD.on);
        const isNotClose = !elementThis.classList.contains(OB_CLASS_FOLD.off);
        if (answerOpen === 'on' && isNotOpen) {
          unFoldButton.click();
          elementThis.classList.add(OB_CLASS_FOLD.on);
          lessNum++;
        }
        const isF = foldButton && elementThis.offsetHeight > 939;
        const isFC = unFoldButton; // 已经收起的回答
        if (answerOpen === 'off' && isNotClose && (isF || isFC)) {
          elementThis.classList.add(OB_CLASS_FOLD.off);
          isF && foldButton.click();
          lessNum++;
        }
      }
      fnJustNum(elementThis);
      if (!message) {
        // 添加回答时间
        pfConfig.answerItemCreatedAndModifiedTime && addTimes(elementThis);
        // 添加「屏蔽用户」按钮
        showBlockUser && myBlack.addButton(elementThis, this);
      }

      // 最后信息 & 起点位置处理
      message && (lessNum = fnHiddenDom(lessNum, elementThis, message));
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
