import { answerAddBlockButton } from '../components/blocked-users/add-block-button';
import { addAnswerCopyLink } from '../components/link';
import { printAnswer, printArticle } from '../components/print';
import { updateItemTime } from '../components/time';
import { updateTopVote } from '../components/topVote';
import { CLASS_VIDEO_ONE, CLASS_VIDEO_TWO_BOX, initVideoDownload } from '../components/video';
import { fnReplaceZhidaToSearch } from '../components/zhida-to-search';
import { IPfConfig } from '../config/types';
import { CLASS_NOT_INTERESTED, CLASS_TO_QUESTION } from '../misc';
import { doFetchNotInterested, dom, domP, myStorage } from '../tools';
import { EVideoInAnswerArticle } from './init-html/configs';

const classTarget = ['RichContent-cover', 'RichContent-inner', 'ContentItem-more', 'ContentItem-arrowIcon', 'ContentItem-expandButton', 'is-collapsed'];
/** 判断是否点击阅读全文 */
const verifyClickReadMore = (e: HTMLElement) => {
  let isFind = false;
  classTarget.forEach((item) => {
    (e.classList.contains(item) || e.parentElement!.classList.contains(item)) && (isFind = true);
  });
  return isFind;
};

/** 顶部ROOT元素点击事件 */
export const initRootEvent = async () => {
  const domRoot = dom('#root');
  if (!domRoot) return;
  domRoot.addEventListener('click', async function (event) {
    const config = await myStorage.getConfig();
    const { fetchInterceptStatus, videoInAnswerArticle } = config;
    const target = event.target as HTMLElement;
    if (videoInAnswerArticle === EVideoInAnswerArticle.修改为链接) {
      // 回答内容中的视频回答替换为视频链接
      if (target.classList.contains(CLASS_VIDEO_ONE.replace('.', '')) || target.classList.contains(CLASS_VIDEO_TWO_BOX.replace('.', ''))) {
        const domVideo = target.querySelector('video');
        const videoSrc = domVideo ? domVideo.src : '';
        if (!videoSrc) return;
        window.open(videoSrc, '_blank');
      }
    }

    // 点击「直达问题」按钮
    if (target.classList.contains(CLASS_TO_QUESTION)) {
      // @ts-ignore 自添加属性
      const { path } = target._params;
      path && window.open(path);
    }

    // 点击外置「不感兴趣」按钮
    if (target.classList.contains(CLASS_NOT_INTERESTED) && fetchInterceptStatus) {
      // @ts-ignore 自添加属性
      const { id, type } = target._params;
      doFetchNotInterested({ id, type });
      const nodeTopStoryItem = domP(target, 'class', 'TopstoryItem');
      nodeTopStoryItem && (nodeTopStoryItem.style.display = 'none');
    }

    // 点击阅读全文
    if (verifyClickReadMore(target)) {
      const nodeItem = domP(target, 'class', 'ContentItem');
      /** 是否推荐列表、关注列表、专栏推荐列表 */
      const isRecommend = !!(dom('.Topstory-recommend') || dom('.Topstory-follow') || dom('.zhuanlan .css-1voxft1'));
      /** 是否回答详情页 */
      const isQuestion = !!dom('.Question-main');
      if (isRecommend || isQuestion) {
        doContentItem(config, isRecommend, nodeItem, true);
      }
    }
  });
};

/**
 * 列表、回答模块内容添加对应内容或执行了阅读全文
 * 例如：内容顶部显示赞同数、问题添加时间、加载视频下载方法、回答内容意见分享、替换知乎直达为搜索、添加「屏蔽用户」按钮、导出当前回答、导出当前文章等
 * @param config 配置
 * @param isRecommend 是否是列表页面
 * @param nodeItem ContentItem
 * @param needTimeout 是否需要延时500ms执行
 */
export const doContentItem = async (config: IPfConfig, isRecommend: boolean, nodeItem?: HTMLElement, needTimeout = false) => {
  if (!nodeItem) return;
  const { topExportContent, fetchInterceptStatus, listItemCreatedAndModifiedTime, answerItemCreatedAndModifiedTime } = config;
  const doFun = (nodeItem: HTMLElement, parentItem: HTMLElement) => {
    updateTopVote(nodeItem);
    if (isRecommend) {
      listItemCreatedAndModifiedTime && updateItemTime(nodeItem);
    } else if (answerItemCreatedAndModifiedTime) {
      updateItemTime(nodeItem);
    }
    initVideoDownload(nodeItem);
    addAnswerCopyLink(nodeItem);
    fnReplaceZhidaToSearch(nodeItem);
    if (fetchInterceptStatus) {
      answerAddBlockButton(parentItem);
      if (topExportContent) {
        printAnswer(parentItem);
        printArticle(parentItem);
      }
    }
  };

  // 如果是回答内容，则 parentItem 设置为 nodeItem 自身
  const parentItem = isRecommend ? nodeItem.parentElement! : nodeItem;
  if (needTimeout) {
    setTimeout(() => {
      doFun(nodeItem, parentItem);
    }, 500);
  } else {
    doFun(nodeItem, parentItem);
  }
};
