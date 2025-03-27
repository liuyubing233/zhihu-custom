import { canCopy } from '../components/copy';
import { previewGIF } from '../components/image';
import { fnJustNumberInAction } from '../components/just-number';
import { initLinkChanger } from '../components/link';
import { myListenAnswerItem } from '../components/listen-answer-item';
import { doListenComment } from '../components/listen-comment';
import { myListenListItem } from '../components/listen-list-item';
import { myListenSearchListItem } from '../components/listen-search-list-item';
import { changeTitle } from '../components/page-title';
import { myCollectionExport } from '../components/print';
import { changeSizeBeforeResize } from '../components/size';
import { myListenUserHomeList } from '../components/user-home';
import { HTML_HOOTS } from '../misc';
import { dom, domById, myStorage, pathnameHasFn, throttle, windowResize } from '../tools';
import { initImagePreview } from './init-image-preview';

/** 使用 ResizeObserver 监听body高度 */
export const initResizeObserver = () => {
  const resizeObserver = new ResizeObserver(throttle(resizeFun));
  resizeObserver.observe(document.body);
};

async function resizeFun() {
  console.log('Timeout resizeFun')
  if (!HTML_HOOTS.includes(location.hostname)) return;
  const { hiddenSearchBoxTopSearch, globalTitle } = await myStorage.getConfig();
  // 比较列表缓存的高度是否大于当前高度，如果大于则是从 index = 0 遍历
  const nodeTopStoryC = domById('TopstoryContent');
  if (nodeTopStoryC) {
    const heightTopStoryContent = nodeTopStoryC.offsetHeight;
    if (heightTopStoryContent < 200) {
      // 小于200为自动加载数据（其实初始值为141）
      myListenListItem.restart();
    } else {
      myListenListItem.init();
    }
    // 如果列表模块高度小于网页高度则手动触发 resize 使其加载数据
    heightTopStoryContent < window.innerHeight && windowResize();
  }

  initLinkChanger();
  previewGIF();
  initImagePreview();
  doListenComment();
  fnJustNumberInAction();
  myListenSearchListItem.init();
  myListenAnswerItem.init();
  myListenUserHomeList.init();
  canCopy();
  changeSizeBeforeResize();
  pathnameHasFn({
    collection: () => myCollectionExport.init(),
  });
  globalTitle !== document.title && changeTitle();
  const nodeSearchBarInput = dom('.SearchBar-input input') as HTMLInputElement;
  if (hiddenSearchBoxTopSearch && nodeSearchBarInput) {
    nodeSearchBarInput.placeholder = '';
  }
}
