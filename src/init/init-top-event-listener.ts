import { doFetchNotInterested } from '../commons/fetch';
import { dom, domP } from '../commons/tools';
import { CLASS_NOT_INTERESTED, CLASS_TO_QUESTION } from '../configs';
import { myBlack } from '../methods/black';
import { addButtonForAnswerExportPDF, addButtonForArticleExportPDF } from '../methods/export-PDF';
import { updateItemTime } from '../methods/time';
import { updateTopVote } from '../methods/topVote';
import { CLASS_VIDEO_ONE, initVideoDownload } from '../methods/video';
import { store } from '../store';

/** 推荐列表最外层绑定事件 */
export const initTopStoryRecommendEvent = () => {
  const { fetchInterceptStatus } = store.getConfig();
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

  nodeTopStoryRecommend.addEventListener('click', function (event) {
    const target = event.target as HTMLElement;
    const nodeContentItem = domP(target, 'class', 'ContentItem');
    if (!nodeContentItem) return;
    const { showBlockUser, topExportContent, fetchInterceptStatus } = store.getConfig();
    // 点击外置「不感兴趣」按钮
    if (target.classList.contains(CLASS_NOT_INTERESTED) && fetchInterceptStatus) {
      const dataZopJson = nodeContentItem.getAttribute('data-zop');
      const { itemId = '', type = '' } = JSON.parse(dataZopJson || '{}');
      doFetchNotInterested({ id: itemId, type });
      const nodeTopStoryItem = domP(target, 'class', 'TopstoryItem');
      nodeTopStoryItem && (nodeTopStoryItem.style.display = 'none');
    }

    // 点击「直达问题」按钮
    if (target.classList.contains(CLASS_TO_QUESTION)) {
      const domUrl = nodeContentItem.querySelector('[itemprop="url"]');
      const pathAnswer = domUrl ? domUrl.getAttribute('content') || '' : '';
      const pathQuestion = pathAnswer.replace(/\/answer[\W\w]+/, '');
      if (pathQuestion) {
        window.open(pathQuestion);
      }
    }

    // 列表内容展示更多
    if (canFindTargeted(target)) {
      setTimeout(() => {
        updateTopVote(nodeContentItem);
        updateItemTime(nodeContentItem);
        showBlockUser && fetchInterceptStatus && myBlack.addButton(nodeContentItem.parentElement!);
        initVideoDownload(nodeContentItem);
        if (topExportContent && fetchInterceptStatus) {
          addButtonForAnswerExportPDF(nodeContentItem.parentElement!);
          addButtonForArticleExportPDF(nodeContentItem.parentElement!);
        }
      }, 0);
    }
  });
};

/** 绑定顶部ROOT元素 */
export const initRootEvent = () => {
  const domRoot = dom('#root');
  if (!domRoot) return;
  const classForVideoOne = CLASS_VIDEO_ONE.replace('.', '');
  const { videoUseLink } = store.getConfig();
  domRoot.addEventListener('click', function (event) {
    const target = event.target as HTMLElement;
    if (videoUseLink) {
      if (target.classList.contains(classForVideoOne)) {
        const domVideo = target.querySelector('video');
        const videoSrc = domVideo ? domVideo.src : '';
        if (!videoSrc) return;
        window.open(videoSrc, '_blank');
      }
    }
  });
};
