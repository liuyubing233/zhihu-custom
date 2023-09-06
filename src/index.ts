import { initHistoryView } from './inner/init-history-view';
import { onInitStyleExtra } from './inner/init-style-extra';
import { needRedirect } from './inner/redirect';
import { fetchGetUserinfo } from './methods/fetch';
import { myListenSelect } from './methods/listen-select';
import { myStorage } from './methods/storage';
import { dom, fnInitDomStyle, fnLog } from './methods/tools';
import { fixVideoAutoPlay } from './methods/video';
import { store } from './store';
import { EXTRA_CLASS_HTML, HTML_HOOTS } from './variable/dom-name';
import { INNER_CSS } from './web-resources';

(function () {
  if (needRedirect()) return;
  const T0 = performance.now();
  const { pathname, hostname, host, origin, search, hash, href } = location;
  const { setStorageConfigItem, getStorageConfigItem, getConfig, setConfig, setHistory, getHistory, setUserinfo } = store;

  /** 挂载脚本时 document.head 是否渲染 */
  let isHaveHeadWhenInit = true;

  /** 在启动时注入的内容 */
  async function onDocumentStart() {
    if (!HTML_HOOTS.includes(hostname) || window.frameElement) return;
    if (!document.head) {
      fnLog('not find document.head, waiting for reload...');
      isHaveHeadWhenInit = false;
      return;
    }
    fixVideoAutoPlay();
    fnInitDomStyle('CTZ_STYLE', INNER_CSS);
    const prevConfig = getConfig();
    setStorageConfigItem('cachePfConfig', prevConfig);
    setConfig(await myStorage.initConfig(prevConfig));
    setHistory(await myStorage.initHistory(getHistory()));
    initHistoryView();
    onInitStyleExtra();
    EXTRA_CLASS_HTML[host] && dom('html')!.classList.add(EXTRA_CLASS_HTML[host]);

    const prevHeaders = getStorageConfigItem('fetchHeaders') as HeadersInit;
    // 拦截 fetch 方法, 获取 option 中的值
    const originFetch = fetch;
    unsafeWindow.fetch = (url: string, opt) => {
      if (/\/answers\?/.test(url) && (myListenSelect.keySort === 'vote' || myListenSelect.keySort === 'comment') && myListenSelect.isSortFirst) {
        // 如果是自定义排序则知乎回答页码增加到20条
        url = url.replace(/(?<=limit=)\d+(?=&)/, '20');
      }

      // 缓存 header
      if (opt && opt.headers) {
        setStorageConfigItem('fetchHeaders', {
          ...prevHeaders,
          ...opt.headers,
        });
      }
      return originFetch(url, opt);
    };

    const matched = search.match(/(?<=sort=)\w+/);
    if (/\/question/.test(pathname) && matched) {
      myListenSelect.keySort = matched[0];
    }

    setUserinfo(await fetchGetUserinfo(prevHeaders));
  }
  onDocumentStart();
})();
