import { fetchGetUserinfo } from './commons/fetch';
import { fnJustNum } from './commons/math-for-my-listens';
import { myStorage } from './commons/storage';
import { dom, domA, domById, fnInitDomStyle, fnLog, pathnameHasFn, throttle } from './commons/tools';
import { CONFIG_SIMPLE } from './configs';
import { EXTRA_CLASS_HTML, HTML_HOOTS, ID_DIALOG } from './configs/dom-name';
import { initData } from './inner/init-data';
import { initHistoryView } from './inner/init-history-view';
import { initHTML } from './inner/init-html';
import { initInviteOnce } from './inner/init-invite-once';
import { initOperate } from './inner/init-operate';
import { initResizeObserver } from './inner/init-resize-observer';
import { onInitStyleExtra } from './inner/init-style-extra';
import { needRedirect } from './inner/redirect';
import { loadBackground, myCustomStyle } from './methods/background';
import { myCollectionExport } from './methods/collection-export-PDF';
import { myCtzTypeOperation } from './methods/ctz-type-operate';
import { myDialog } from './methods/dialog-open-close';
import { myFilterWord } from './methods/filter-word';
import { myFollowRemove } from './methods/follow-remove';
import { echoHistory } from './methods/history';
import { keydownNextImage } from './methods/image';
import { myListenAnswerItem } from './methods/listen-answer-item';
import { myListenListItem } from './methods/listen-list-item';
import { myListenSearchListItem } from './methods/listen-search-list-item';
import { myListenSelect } from './methods/listen-select';
import { myPageFilterSetting } from './methods/page-filter-setting';
import { suspensionPackUp } from './methods/suspension';
import { addArticleCreateTimeToTop, addQuestionCreatedAndModifiedTime } from './methods/time';
import { myVersion } from './methods/version';
import { fixVideoAutoPlay, myVideo } from './methods/video';
import { store } from './store';
import { INNER_CSS } from './web-resources';

(function () {
  if (needRedirect()) return;
  const T0 = performance.now();
  const { pathname, hostname, host, search } = location;
  const { setStorageConfigItem, getStorageConfigItem, getConfig, setConfig, setHistory, setUserinfo } = store;

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
    setConfig(await myStorage.initConfig());
    setHistory(await myStorage.initHistory());
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
    setUserinfo(await fetchGetUserinfo());
  }
  onDocumentStart();

  /** 页面加载完成（不包含资源） */
  window.addEventListener(
    'DOMContentLoaded',
    async () => {
      // 如果脚本注入时 document.head 未加载完成则在页面渲染后重新进行加载
      if (!isHaveHeadWhenInit) {
        await onDocumentStart();
      }

      if (HTML_HOOTS.includes(hostname) && !window.frameElement) {
        // 不考虑在 iframe 中的情况
        initHTML();
        initOperate();
        initData();
        // 页面加载完成后再进行加载背景色, 解决存在顶部推广的 header 颜色
        loadBackground();
        myVersion.initAfterLoad();
        myCustomStyle.init();
        myFilterWord.init();
        initResizeObserver();
        myCtzTypeOperation.init();
        echoHistory();

        dom('[name="useSimple"]')!.onclick = async function () {
          const isUse = confirm('是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存');
          if (!isUse) return;
          const prevConfig = store.getConfig();
          myStorage.configUpdate({
            ...prevConfig,
            ...CONFIG_SIMPLE,
          });
          onDocumentStart();
          initData();
        };
      }

      pathnameHasFn({
        question: () => {
          myListenSelect.init();
          addQuestionCreatedAndModifiedTime();
          const nodeQuestionAnswer = dom('.QuestionAnswer-content');
          nodeQuestionAnswer && fnJustNum(nodeQuestionAnswer);
          initInviteOnce();
        },
        video: () => myVideo.init(),
        filter: () => myPageFilterSetting.init(),
        collection: () => myCollectionExport.init(),
        following: () => myFollowRemove.init(),
      });

      if (host === 'zhuanlan.zhihu.com') {
        addArticleCreateTimeToTop();
      }
      fnLog(
        `加载完毕, 加载时长: ${
          Math.floor((performance.now() - T0) / 10) / 100
        }s, 可使用 shift + . 或点击左侧眼睛按钮唤起修改器弹窗，如果快捷键不生效可以在控制台使用 window.openCtz() 唤起`
      );
    },
    false
  );

  /** 页面资源加载完成 */
  window.addEventListener('load', () => {
    // 如果存在登录弹窗则移除
    const nodeSignModal = dom('.signFlowModal');
    const nodeSignClose = nodeSignModal && (nodeSignModal.querySelector('.Modal-closeButton') as HTMLButtonElement);
    nodeSignClose && nodeSignClose.click();
  });

  window.addEventListener('keydown', (event) => {
    const { hotKey } = getConfig();
    if (hotKey) {
      // shift + . 唤醒关闭修改器弹窗
      if (event.key === '>' || event.key === '》') {
        const nodeDialog = domById(ID_DIALOG);
        nodeDialog && nodeDialog.style.display === 'none' ? myDialog.open() : myDialog.hide();
      }
    }
    // esc 关闭弹窗
    if (event.key === 'Escape') {
      myDialog.hide();
    }

    keydownNextImage(event)
  });
  unsafeWindow.openCtz = myDialog.open;

  // 复制代码块删除版权信息
  document.addEventListener('copy', function (event) {
    // @ts-ignore window.clipboardData 是存在于IE中
    let clipboardData = event.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    const selection = window.getSelection();
    let text = selection ? selection.toString() : '';
    if (text) {
      event.preventDefault();
      clipboardData.setData('text/plain', text);
    }
  });

  /** 页面路由变化, 部分操作方法 */
  const changeHistory = () => {
    pathnameHasFn({
      filter: () => myPageFilterSetting.init(),
      following: () => myFollowRemove.init(),
    });
    // 重置监听起点
    myListenListItem.reset();
    myListenSearchListItem.reset();
    myListenAnswerItem.reset();
  };
  /** history 变化 */
  window.addEventListener('popstate', changeHistory);
  window.addEventListener('pushState', changeHistory);

  /** 页面滚动方法 */
  window.addEventListener(
    'scroll',
    throttle(() => {
      const { suspensionPickUp } = getConfig();
      if (suspensionPickUp) {
        suspensionPackUp(domA('.List-item'));
        suspensionPackUp(domA('.TopstoryItem'));
        suspensionPackUp(domA('.AnswerCard'));
      }
    }, 100),
    false
  );
})();
