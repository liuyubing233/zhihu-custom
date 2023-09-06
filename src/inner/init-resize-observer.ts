import { dom, domById, pathnameHasFn, throttle } from '../commons/tools';
import { HTML_HOOTS } from '../configs';
import { myCollectionExport } from '../methods/collection-export';
import { previewGIF } from '../methods/image';
import { myListenAnswerItem } from '../methods/listen-answer-item';
import { myListenListItem } from '../methods/listen-list-item';
import { myListenSearchListItem } from '../methods/listen-search-list-item';
import { myListenSelect } from '../methods/listen-select';
import { changeTitle } from '../methods/page-title';
import { myVideo, zoomVideos } from '../methods/video';
import { store } from '../store';
import { initImagePreview } from './init-image-preview';
import { initLinkChanger } from './init-link-changer';
import { initTopStoryRecommendEvent } from './init-top-story-recommend';

/** 使用 ResizeObserver 监听body高度 */
export const initResizeObserver = () => {
  const resizeObserver = new ResizeObserver(throttle(resizeFun, 500));
  resizeObserver.observe(document.body);
};

function resizeFun() {
  if (!HTML_HOOTS.includes(location.hostname)) return;
  const { getStorageConfigItem, getConfig, setStorageConfigItem } = store;
  const { globalTitle, hiddenSearchBoxTopSearch } = getConfig();
  // 比较列表缓存的高度是否大于当前高度，如果大于则是从 index = 0 遍历
  const nodeTopStoryC = domById('TopstoryContent');
  if (nodeTopStoryC) {
    const heightForList = getStorageConfigItem('heightForList') as number;
    const heightTopStoryContent = nodeTopStoryC.offsetHeight;
    if (heightTopStoryContent < heightForList) {
      myListenListItem.restart();
      initTopStoryRecommendEvent();
    } else {
      myListenListItem.init();
    }
    // 如果列表模块高度小于网页高度则手动触发 resize 使其加载数据
    heightTopStoryContent < window.innerHeight && window.dispatchEvent(new Event('resize'));
    setStorageConfigItem('heightForList', heightTopStoryContent);
  }

  initLinkChanger();
  previewGIF();
  initImagePreview();
  myListenSearchListItem.init();
  myListenAnswerItem.init();
  pathnameHasFn({
    question: () => {
      zoomVideos();
      myListenSelect.init();
    },
    video: () => myVideo.init(),
    collection: () => myCollectionExport.init(),
  });

  globalTitle !== document.title && changeTitle();
  const nodeSearchBarInput = dom('.SearchBar-input input');
  if (hiddenSearchBoxTopSearch && nodeSearchBarInput) {
    nodeSearchBarInput.placeholder = '';
  }
}
