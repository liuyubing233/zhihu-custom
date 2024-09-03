import { doFetchNotInterested } from '../commons/fetch';
import { dom, domP } from '../commons/tools';
import { CLASS_NOT_INTERESTED, CLASS_TO_QUESTION } from '../configs';
import { myBlack } from '../methods/black';
import { addButtonForAnswerExportPDF, addButtonForArticleExportPDF } from '../methods/export-PDF';
import { addAnswerCopyLink } from '../methods/link';
import { updateItemTime } from '../methods/time';
import { updateTopVote } from '../methods/topVote';
import { CLASS_VIDEO_ONE, initVideoDownload } from '../methods/video';
import { store } from '../store';

const classTarget = ['RichContent-cover', 'RichContent-inner', 'ContentItem-more', 'ContentItem-arrowIcon'];
const canFindTargeted = (e: HTMLElement) => {
  let isFind = false;
  classTarget.forEach((item) => {
    (e.classList.contains(item) || e.parentElement!.classList.contains(item)) && (isFind = true);
  });
  return isFind;
};

const callbackEventListener = (event: Event) => {
  const target = event.target as HTMLElement;
  const domContent = domP(target, 'class', 'ContentItem');
  if (!domContent) return;
  const { showBlockUser, topExportContent, fetchInterceptStatus, listItemCreatedAndModifiedTime } = store.getConfig();
  // 点击外置「不感兴趣」按钮
  if (target.classList.contains(CLASS_NOT_INTERESTED) && fetchInterceptStatus) {
    const dataZopJson = domContent.getAttribute('data-zop');
    const { itemId = '', type = '' } = JSON.parse(dataZopJson || '{}');
    doFetchNotInterested({ id: itemId, type });
    const nodeTopStoryItem = domP(target, 'class', 'TopstoryItem');
    nodeTopStoryItem && (nodeTopStoryItem.style.display = 'none');
  }

  // 点击「直达问题」按钮
  if (target.classList.contains(CLASS_TO_QUESTION)) {
    const domUrl = domContent.querySelector('[itemprop="url"]');
    const pathAnswer = domUrl ? domUrl.getAttribute('content') || '' : '';
    const pathQuestion = pathAnswer.replace(/\/answer[\W\w]+/, '');
    if (pathQuestion) {
      window.open(pathQuestion);
    }
  }

  // 列表内容展示更多
  if (canFindTargeted(target)) {
    setTimeout(() => {
      updateTopVote(domContent);
      listItemCreatedAndModifiedTime && updateItemTime(domContent);
      showBlockUser && fetchInterceptStatus && myBlack.addButton(domContent.parentElement!);
      initVideoDownload(domContent);
      if (topExportContent && fetchInterceptStatus) {
        addButtonForAnswerExportPDF(domContent.parentElement!);
        addButtonForArticleExportPDF(domContent.parentElement!);
      }
      addAnswerCopyLink(domContent);
    }, 0);
  }
};

let indexTopStoryInit = 0;
/** 推荐列表最外层绑定事件 */
export const initTopStoryRecommendEvent = () => {
  const nodeTopStoryRecommend = dom('.Topstory-recommend') || dom('.Topstory-follow');
  if (!nodeTopStoryRecommend) return;
  nodeTopStoryRecommend.removeEventListener('click', callbackEventListener);
  nodeTopStoryRecommend.addEventListener('click', callbackEventListener);
  if (indexTopStoryInit < 5) {
    indexTopStoryInit++;
    setTimeout(initTopStoryRecommendEvent, 500);
  } else {
    indexTopStoryInit = 0;
  }
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
