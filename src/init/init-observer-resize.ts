import { canCopy } from '../components/copy';
import { previewGIF } from '../components/image';
import { fnJustNumberInAction } from '../components/just-number';
import { initLinkChanger } from '../components/link';
import { myListenAnswer } from '../components/listen-answer';
import { doListenComment } from '../components/listen-comment';
import { myListenList } from '../components/listen-list';
import { myListenSearchListItem } from '../components/listen-search-list-item';
import { changeTitle } from '../components/page-title';
import { myCollectionExport } from '../components/print';
import { changeSizeBeforeResize } from '../components/size';
import { myListenUserHomeList } from '../components/user-home';
import { HTML_HOOTS } from '../misc';
import { dom, domById, myStorage, pathnameHasFn, throttle, windowResize } from '../tools';
import { initImagePreview } from './init-image-preview';

const FAST_TRIGGER_DELAY = 120;
const HEAVY_TRIGGER_DELAY = 700;
const HEAVY_MIN_INTERVAL = 1500;
const FORCE_RESIZE_INTERVAL = 1500;

let isFastRunning = false;
let isFastPending = false;
let isHeavyRunning = false;
let isHeavyPending = false;
let heavyTimer: ReturnType<typeof setTimeout> | undefined = undefined;
let lastHeavyRunAt = 0;
let lastForceResizeAt = 0;
let wasTopstoryTiny = false;
let hasSetSearchPlaceholder = false;

/** 使用 ResizeObserver 监听body高度 */
export const initResizeObserver = () => {
  const onResize = throttle(() => {
    scheduleFast();
    scheduleHeavy();
  }, FAST_TRIGGER_DELAY);
  const resizeObserver = new ResizeObserver(() => onResize());
  resizeObserver.observe(document.body);
  scheduleFast();
  scheduleHeavy();
};

function scheduleFast() {
  if (isFastRunning) {
    isFastPending = true;
    return;
  }

  isFastRunning = true;
  runFastTasks()
    .catch(() => undefined)
    .finally(() => {
      isFastRunning = false;
      if (isFastPending) {
        isFastPending = false;
        scheduleFast();
      }
    });
}

function scheduleHeavy() {
  if (heavyTimer) return;

  const now = Date.now();
  const wait = Math.max(HEAVY_TRIGGER_DELAY, HEAVY_MIN_INTERVAL - (now - lastHeavyRunAt));
  heavyTimer = setTimeout(() => {
    heavyTimer = undefined;
    runHeavyTasks().catch(() => undefined);
  }, wait);
}

async function runFastTasks() {
  if (!HTML_HOOTS.includes(location.hostname)) return;
  // 比较列表缓存的高度是否大于当前高度，如果大于则是从 index = 0 遍历
  const nodeTopStoryC = domById('TopstoryContent');
  if (nodeTopStoryC) {
    const heightTopStoryContent = nodeTopStoryC.offsetHeight;
    if (heightTopStoryContent < 200) {
      // 小于200为自动加载数据（其实初始值为141）
      if (!wasTopstoryTiny) {
        myListenList.restart();
      }
      wasTopstoryTiny = true;
    } else {
      wasTopstoryTiny = false;
      myListenList.init();
    }
    // 如果列表模块高度小于网页高度则手动触发 resize 使其加载数据
    if (heightTopStoryContent < window.innerHeight) {
      const now = Date.now();
      if (now - lastForceResizeAt > FORCE_RESIZE_INTERVAL) {
        lastForceResizeAt = now;
        windowResize();
      }
    }
  } else {
    wasTopstoryTiny = false;
  }

  myListenSearchListItem.init();
  myListenAnswer.init();
  myListenUserHomeList.init();
}

async function runHeavyTasks() {
  if (isHeavyRunning) {
    isHeavyPending = true;
    return;
  }
  if (!HTML_HOOTS.includes(location.hostname)) return;

  isHeavyRunning = true;
  try {
    const { hiddenSearchBoxTopSearch, globalTitle } = await myStorage.getConfig();
    lastHeavyRunAt = Date.now();

    initLinkChanger();
    previewGIF();
    initImagePreview();
    doListenComment();
    fnJustNumberInAction();
    canCopy();
    changeSizeBeforeResize();
    pathnameHasFn({
      collection: () => myCollectionExport.init(),
    });
    globalTitle !== document.title && changeTitle();
    const nodeSearchBarInput = dom('.SearchBar-input input') as HTMLInputElement;
    if (hiddenSearchBoxTopSearch && nodeSearchBarInput && !hasSetSearchPlaceholder) {
      nodeSearchBarInput.placeholder = '';
      hasSetSearchPlaceholder = true;
    }
    if (!hiddenSearchBoxTopSearch) {
      hasSetSearchPlaceholder = false;
    }
  } finally {
    isHeavyRunning = false;
    if (isHeavyPending) {
      isHeavyPending = false;
      scheduleHeavy();
    }
  }
}
