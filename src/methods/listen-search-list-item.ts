import { CTZ_HIDDEN_ITEM_CLASS, fnHidden, fnJustNum } from '../commons/math-for-my-listens';
import { myStorage } from '../commons/storage';
import { domA } from '../commons/tools';

/** 监听搜索列表 - 过滤  */
export const myListenSearchListItem = {
  index: 0,
  init: async function () {
    const nodes = domA('.SearchResult-Card[role="listitem"]');
    if (this.index + 1 === nodes.length) return;
    const { removeItemAboutVideo, removeItemAboutArticle, removeItemAboutAD, removeLessVote, lessVoteNumber = 0 } = await myStorage.getConfig();
    for (let i = this.index === 0 ? 0 : this.index + 1, len = nodes.length; i < len; i++) {
      let message = ''; // 屏蔽信息
      const elementThis = nodes[i];
      if (!elementThis || elementThis.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;
      // FIRST
      // 列表种类屏蔽
      const haveAD = removeItemAboutAD && elementThis.querySelector('.KfeCollection-PcCollegeCard-root');
      const haveArticle = removeItemAboutArticle && elementThis.querySelector('.ArticleItem');
      const haveVideo = removeItemAboutVideo && elementThis.querySelector('.ZvideoItem');
      (haveAD || haveArticle || haveVideo) && (message = '列表种类屏蔽');

      // 低赞内容过滤
      if (removeLessVote && !message) {
        const elementUpvote = elementThis.querySelector('.ContentItem-actions .VoteButton--up');
        if (elementUpvote) {
          const ariaLabel = elementUpvote.getAttribute('aria-label');
          if (ariaLabel) {
            const upvoteText = ariaLabel.trim().replace(/\W+/, '');
            const upvote = upvoteText.includes('万') ? +upvoteText.replace('万', '').trim() * 10000 : +upvoteText;
            if (upvote > -1 && upvote < lessVoteNumber) {
              message = `屏蔽低赞内容: ${upvote || 0}赞`;
            }
          }
        }
      }
      fnJustNum(elementThis);
      // 最后信息 & 起点位置处理
      message && fnHidden(elementThis, message);
      if (i === len - 1) {
        this.index = i;
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
