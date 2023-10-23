import { doFetchNotInterested } from '../commons/fetch';
import { dom, domP } from '../commons/tools';
import { CLASS_NOT_INTERESTED } from '../configs';
import { myBlack } from '../methods/black';
import { addButtonForAnswerExportPDF, addButtonForArticleExportPDF } from '../methods/export-PDF';
import { updateItemTime } from '../methods/time';
import { updateTopVote } from '../methods/topVote';
import { store } from '../store';

/** 推荐列表最外层绑定事件 */
export const initTopStoryRecommendEvent = () => {
  const nodeTopStoryRecommend = dom('.Topstory-recommend') || dom('.Topstory-follow');
  if (!nodeTopStoryRecommend) return;
  const classTarget = ['RichContent-cover', 'RichContent-inner', 'ContentItem-more', 'ContentItem-arrowIcon'];
  const canFindTargeted = (e: HTMLElement) => {
    let isFind = false;
    classTarget.forEach((item) => {
      (e.classList.contains(item) || e.parentElement!.classList.contains(item)) && (isFind = true);
    });
    return isFind;
  };
  nodeTopStoryRecommend.onclick = function (event) {
    const target = event.target as HTMLElement;
    const nodeContentItem = domP(target, 'class', 'ContentItem');
    if (!nodeContentItem) return;
    const { listOutPutNotInterested, showBlockUser,topExportContent } = store.getConfig();
    // 点击外置「不感兴趣」按钮
    if (listOutPutNotInterested && target.classList.contains(CLASS_NOT_INTERESTED)) {
      const dataZopJson = nodeContentItem.getAttribute('data-zop');
      const { itemId = '', type = '' } = JSON.parse(dataZopJson || '{}');
      doFetchNotInterested({ id: itemId, type });
      const nodeTopStoryItem = domP(target, 'class', 'TopstoryItem');
      nodeTopStoryItem && (nodeTopStoryItem.style.display = 'none');
    }
    // 列表内容展示更多
    if (canFindTargeted(target)) {
      setTimeout(() => {
        updateTopVote(nodeContentItem);
        updateItemTime(nodeContentItem);
        showBlockUser && myBlack.addButton(nodeContentItem.parentElement!);
        if (topExportContent) {
          addButtonForAnswerExportPDF(nodeContentItem.parentElement!);
          addButtonForArticleExportPDF(nodeContentItem.parentElement!);
        }
      }, 0);
    }
  };
};
