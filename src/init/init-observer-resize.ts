import { myStorage } from '../commons/storage';
import { dom, domById, pathnameHasFn, throttle, windowResize } from '../commons/tools';
import { HTML_HOOTS } from '../configs';
import { fnContentRemoveKeywordSearch } from '../methods/content-remove-keyword-search';
import { myCollectionExport } from '../methods/export-PDF';
import { previewGIF } from '../methods/image';
import { initLinkChanger } from '../methods/link';
import { myListenAnswerItem } from '../methods/listen-answer-item';
import { myListenListItem } from '../methods/listen-list-item';
import { myListenSearchListItem } from '../methods/listen-search-list-item';
import { changeTitle } from '../methods/page-title';
import { initImagePreview } from './init-image-preview';
import { initTopStoryRecommendEvent } from './init-top-event-listener';

/** 使用 ResizeObserver 监听body高度 */
export const initResizeObserver = () => {
  const resizeObserver = new ResizeObserver(throttle(resizeFun, 500));
  resizeObserver.observe(document.body);
};

async function resizeFun() {
  if (!HTML_HOOTS.includes(location.hostname)) return;
  const { hiddenSearchBoxTopSearch, contentRemoveKeywordSearch, globalTitle } = await myStorage.getConfig()
  // 比较列表缓存的高度是否大于当前高度，如果大于则是从 index = 0 遍历
  const nodeTopStoryC = domById('TopstoryContent');
  if (nodeTopStoryC) {
    const heightTopStoryContent = nodeTopStoryC.offsetHeight;
    if (heightTopStoryContent < 200) {
      // 小于200为自动加载数据（其实初始值为141）
      myListenListItem.restart();
      initTopStoryRecommendEvent();
    } else {
      myListenListItem.init();
    }
    // 如果列表模块高度小于网页高度则手动触发 resize 使其加载数据
    heightTopStoryContent < window.innerHeight && windowResize();
  }
  contentRemoveKeywordSearch && fnContentRemoveKeywordSearch(document.body);
  initLinkChanger();
  previewGIF();
  initImagePreview();
  myListenSearchListItem.init();
  myListenAnswerItem.init();
  pathnameHasFn({
    // question: () => {
    //   myListenSelect.init();
    // },
    collection: () => myCollectionExport.init(),
  });
  globalTitle !== document.title && changeTitle();
  const nodeSearchBarInput = dom('.SearchBar-input input') as HTMLInputElement;
  if (hiddenSearchBoxTopSearch && nodeSearchBarInput) {
    nodeSearchBarInput.placeholder = '';
  }
}
