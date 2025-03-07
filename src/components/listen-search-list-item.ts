import { CLASS_LISTENED } from '../misc';
import { CTZ_HIDDEN_ITEM_CLASS, domA, fnHidden, fnJustNum, myStorage } from '../tools';

/** 监听搜索列表 - 过滤  */
export const myListenSearchListItem = {
  initTimestamp: 0,
  init: async function () {
    const currentTime = +new Date();
    if (currentTime - this.initTimestamp < 500) {
      setTimeout(() => this.init(), 500);
      return;
    }
    const nodes = domA(`.SearchResult-Card[role="listitem"]:not(.${CLASS_LISTENED})`);
    if (this.index + 1 === nodes.length) return;
    const { removeItemAboutVideo, removeItemAboutArticle, removeItemAboutAD, removeLessVote, lessVoteNumber = 0 } = await myStorage.getConfig();
    for (let i = 0, len = nodes.length; i < len; i++) {
      let message = ''; // 屏蔽信息
      const nodeItem = nodes[i];
      nodeItem.classList.add(CLASS_LISTENED);
      if (!nodeItem || nodeItem.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;
      // FIRST
      // 列表种类屏蔽
      const haveAD = removeItemAboutAD && nodeItem.querySelector('.KfeCollection-PcCollegeCard-root');
      const haveArticle = removeItemAboutArticle && nodeItem.querySelector('.ArticleItem');
      const haveVideo = removeItemAboutVideo && nodeItem.querySelector('.ZvideoItem');
      (haveAD || haveArticle || haveVideo) && (message = '列表种类屏蔽');

      // 低赞内容过滤
      if (removeLessVote && !message) {
        const elementUpvote = nodeItem.querySelector('.ContentItem-actions .VoteButton--up');
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
      fnJustNum(nodeItem);
      // 最后信息 & 起点位置处理
      message && fnHidden(nodeItem, message);
    }
  },
  reset: function () {
    domA(`.SearchResult-Card[role="listitem"].${CLASS_LISTENED}`).forEach((item) => {
      item.classList.remove(CLASS_LISTENED);
    });
  },
  restart: function () {
    this.reset();
    this.init();
  },
};
