import { answerAddBlockButton } from '../components/black-list/add-block-button';
import { addAnswerCopyLink } from '../components/link';
import { addNotInterestedItem } from '../components/not-interested';
import { printAnswer, printArticle } from '../components/print';
import { EVideoInAnswerArticle } from '../components/select';
import { updateItemTime } from '../components/time';
import { CLASS_VIDEO_ONE, CLASS_VIDEO_TWO_BOX, initVideoDownload } from '../components/video';
import { updateTopVote } from '../components/vote';
import { fnReplaceZhidaToSearch } from '../components/zhida-to-search';
import { CLASS_NOT_INTERESTED, CLASS_TO_QUESTION } from '../misc';
import { doFetchNotInterested, dom, domP, myStorage } from '../tools';

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
      const { id, type, title } = target._params;
      doFetchNotInterested({ id, type });
      const nodeTopStoryItem = domP(target, 'class', 'TopstoryItem');
      nodeTopStoryItem && (nodeTopStoryItem.style.display = 'none');
      addNotInterestedItem(title)
    }

    // 点击阅读全文
    doReadMore(target);
  });
};

/** 点击阅读全文后的操作 */
export const doReadMore = (currentDom: HTMLElement) => {
  const contentItem = currentDom.classList.contains('ContentItem') ? currentDom : currentDom.querySelector('.ContentItem') || domP(currentDom, 'class', 'ContentItem');
  if (!contentItem) return;
  // 展开
  let pageType: IPageType | undefined = undefined;

  const domPByClass = (name: string) => domP(currentDom, 'class', name);
  (domPByClass('Topstory-recommend') || domPByClass('Topstory-follow') || domPByClass('zhuanlan .css-1voxft1') || domPByClass('SearchMain')) && (pageType = 'LIST');
  domPByClass('Question-main') && (pageType = 'QUESTION');
  domPByClass('Profile-main') && (pageType = 'USER_HOME');
  doContentItem(pageType, contentItem as HTMLElement, true);
};

type IPageType = 'LIST' | 'QUESTION' | 'USER_HOME';

/**
 * 列表、回答模块内容添加对应内容或执行了阅读全文
 * 例如：内容顶部显示赞同数、问题添加时间、加载视频下载方法、回答内容意见分享、替换知乎直达为搜索、添加「屏蔽用户」按钮、导出当前回答、导出当前文章等
 * @param config 配置
 * @param isRecommend 是否是列表页面
 * @param contentItem ContentItem
 * @param needTimeout 是否需要延时500ms执行
 */
export const doContentItem = async (pageType?: IPageType, contentItem?: HTMLElement, needTimeout = false) => {
  if (!contentItem || !pageType) return;
  const { topExportContent, fetchInterceptStatus, listItemCreatedAndModifiedTime, answerItemCreatedAndModifiedTime, userHomeContentTimeTop } = await myStorage.getConfig();
  const doFun = () => {
    const doByPageType: Record<IPageType, Function> = {
      LIST: () => {
        listItemCreatedAndModifiedTime && updateItemTime(contentItem);
        if (fetchInterceptStatus) {
          answerAddBlockButton(contentItem);
        }
      },
      QUESTION: () => {
        answerItemCreatedAndModifiedTime && updateItemTime(contentItem);
        if (fetchInterceptStatus) {
          answerAddBlockButton(contentItem);
        }
      },
      USER_HOME: () => {
        userHomeContentTimeTop && updateItemTime(contentItem);
      },
    };

    doByPageType[pageType]();
    updateTopVote(contentItem);
    initVideoDownload(contentItem);
    addAnswerCopyLink(contentItem);
    fnReplaceZhidaToSearch(contentItem);
    if (fetchInterceptStatus) {
      if (topExportContent) {
        printAnswer(contentItem);
        printArticle(contentItem);
      }
    }
  };

  // 如果是回答内容，则 parentItem 设置为 nodeItem 自身
  if (needTimeout) {
    setTimeout(doFun, 500);
  } else {
    doFun();
  }
};
