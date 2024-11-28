import { doFetchNotInterested } from '../commons/fetch';
import { myStorage } from '../commons/storage';
import { dom, domP } from '../commons/tools';
import { CLASS_NOT_INTERESTED, CLASS_TO_QUESTION } from '../configs';
import { myBlack } from '../methods/black';
import { addAnswerCopyLink } from '../methods/link';
import { addButtonForAnswerExportPDF, printArticle } from '../methods/print';
import { updateItemTime } from '../methods/time';
import { updateTopVote } from '../methods/topVote';
import { CLASS_VIDEO_ONE, initVideoDownload } from '../methods/video';

const classTarget = ['RichContent-cover', 'RichContent-inner', 'ContentItem-more', 'ContentItem-arrowIcon'];
const canFindTargeted = (e: HTMLElement) => {
  let isFind = false;
  classTarget.forEach((item) => {
    (e.classList.contains(item) || e.parentElement!.classList.contains(item)) && (isFind = true);
  });
  return isFind;
};

const cbEventListener = async (event: Event) => {
  const target = event.target as HTMLElement;
  const nodeItem = domP(target, 'class', 'ContentItem');
  if (!nodeItem) return;
  const { showBlockUser, topExportContent, fetchInterceptStatus, listItemCreatedAndModifiedTime } = await myStorage.getConfig();
  // 点击外置「不感兴趣」按钮
  if (target.classList.contains(CLASS_NOT_INTERESTED) && fetchInterceptStatus) {
    // @ts-ignore 自添加属性
    const { id, type } = target._params;
    doFetchNotInterested({ id, type });
    const nodeTopStoryItem = domP(target, 'class', 'TopstoryItem');
    nodeTopStoryItem && (nodeTopStoryItem.style.display = 'none');
  }

  // 点击「直达问题」按钮
  if (target.classList.contains(CLASS_TO_QUESTION)) {
    // @ts-ignore 自添加属性
    const { path } = target._params;
    path && window.open(path);
  }

  // 列表内容展示更多
  if (canFindTargeted(target)) {
    setTimeout(() => {
      updateTopVote(nodeItem);
      listItemCreatedAndModifiedTime && updateItemTime(nodeItem);
      initVideoDownload(nodeItem);
      addAnswerCopyLink(nodeItem);
      if (fetchInterceptStatus) {
        showBlockUser && myBlack.addButton(nodeItem.parentElement!);
        if (topExportContent) {
          addButtonForAnswerExportPDF(nodeItem.parentElement!);
          printArticle(nodeItem.parentElement!);
        }
      }
    }, 0);
  }
};

let recommendTimeout: NodeJS.Timeout;
let indexTopStoryInit = 0;
/** 推荐列表最外层绑定事件 */
export const initTopStoryRecommendEvent = () => {
  const nodeTopStoryRecommend = dom('.Topstory-recommend') || dom('.Topstory-follow') || dom('.zhuanlan .css-1voxft1');
  if (nodeTopStoryRecommend) {
    nodeTopStoryRecommend.removeEventListener('click', cbEventListener);
    nodeTopStoryRecommend.addEventListener('click', cbEventListener);
  }
  if (indexTopStoryInit < 5) {
    indexTopStoryInit++;
    clearTimeout(recommendTimeout);
    recommendTimeout = setTimeout(initTopStoryRecommendEvent, 500);
  } else {
    indexTopStoryInit = 0;
  }
};

/** 绑定顶部ROOT元素 */
export const initRootEvent = async () => {
  const domRoot = dom('#root');
  if (!domRoot) return;
  const classForVideoOne = CLASS_VIDEO_ONE.replace('.', '');
  const { videoUseLink } = await myStorage.getConfig();
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
