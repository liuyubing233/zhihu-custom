import { interceptionResponse } from './commons/fetch';
import { fnJustNum } from './commons/math-for-my-listens';
import { myStorage } from './commons/storage';
import { dom, domById, fnAppendStyle, fnLog, isSafari, mouseEventClick, pathnameHasFn, throttle } from './commons/tools';
import { CONFIG_DEFAULT, CONFIG_SIMPLE } from './configs';
import { EXTRA_CLASS_HTML, HTML_HOOTS } from './configs/dom-name';
import { initData } from './init/init-data';
import { initFirstUse } from './init/init-fisrt-use';
import { initHistoryView } from './init/init-history-view';
import { appendHomeLink, initHTML } from './init/init-html';
import { initResizeObserver } from './init/init-observer-resize';
import { initOperate } from './init/init-operate';
import { onInitStyleExtra } from './init/init-style-extra';
import { needRedirect } from './init/redirect';
import { myBackground, myCustomStyle } from './methods/background';
import { initBlockedWords } from './methods/blocked-words';
import { myCtzTypeOperation } from './methods/ctz-type-operate';
import { myFollowRemove } from './methods/follow-remove';
import { echoHistory } from './methods/history';
import { keydownNextImage } from './methods/image';
import { myListenAnswerItem } from './methods/listen-answer-item';
import { formatCommentAuthors } from './methods/listen-comment';
import { myListenListItem } from './methods/listen-list-item';
import { myListenSearchListItem } from './methods/listen-search-list-item';
import { initOneClickInvitation } from './methods/one-click-invitation';
import { openChange } from './methods/open';
import { myPageFilterSetting } from './methods/page-filter-setting';
import { myCollectionExport, printArticle, printPeopleAnswer, printPeopleArticles } from './methods/print';
import { addArticleTime, addQuestionTime } from './methods/time';
import { topBlockUser, userHomeAnswers } from './methods/user-home-content';
import { myVersion } from './methods/version';
import { fixVideoAutoPlay, initVideoDownload } from './methods/video';
import { store } from './store';
import { INNER_CSS } from './web-resources';

(function () {
  if (needRedirect()) return;

  GM_registerMenuCommand('⚙️ 设置', () => {
    openChange();
  });

  const T0 = performance.now();
  const { hostname, href } = location;
  const { setStorageConfigItem, getStorageConfigItem, findRemoveRecommends, setUserAnswer, setUserArticle, setUserinfo, setCommentAuthors } = store;

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
    fnAppendStyle('CTZ_STYLE', INNER_CSS);

    let config = await myStorage.getConfig();
    if (!config || config.fetchInterceptStatus === undefined) {
      fnLog('您好，欢迎使用本插件，第一次进入，初始化中...');
      await myStorage.updateConfig({
        ...CONFIG_DEFAULT,
        isUsed2: false,
      });
      config = CONFIG_DEFAULT;
    } else {
      await myStorage.updateConfig({
        ...CONFIG_DEFAULT,
        ...config,
        isUsed2: !!config.isUsed2
      })
    }

    // TODO: 更改黑名单列表字段，10个 feature 版本后删除，5.2.0 添加，5.12.0 删除
    if (config.removeBlockUserContentList && config.removeBlockUserContentList.length) {
      config.blockedUsers = [...config.removeBlockUserContentList];
      delete config.removeBlockUserContentList;
      await myStorage.updateConfig(config)
    }

    await myStorage.getHistory();
    initHistoryView();
    onInitStyleExtra();

    dom('html')!.classList.add(/www\.zhihu\.com\/column/.test(href) ? 'zhuanlan' : EXTRA_CLASS_HTML[hostname]);

    // 获取最新的配置需要在此以后
    const { fetchInterceptStatus } = config;
    if (fetchInterceptStatus) {
      fnLog('已开启 fetch 接口拦截');
      const prevHeaders = getStorageConfigItem('fetchHeaders') as HeadersInit;
      // 拦截 fetch 方法，获取接口内容，唯一
      const originFetch = fetch;
      const myWindow = isSafari ? window : unsafeWindow;
      myWindow.fetch = (url: any, opt) => {
        // 缓存 header
        if (opt && opt.headers) {
          setStorageConfigItem('fetchHeaders', {
            ...prevHeaders,
            ...opt.headers,
          });
        }

        return originFetch(url, opt).then((res) => {
          // 推荐列表
          interceptionResponse(res, /\/api\/v3\/feed\/topstory\/recommend/, (r) => findRemoveRecommends(r.data));
          // 用户主页回答
          interceptionResponse(res, /\api\/v4\/members\/[^/]+\/answers/, (r) => setUserAnswer(r.data));
          // 用户主页文章
          interceptionResponse(res, /\api\/v4\/members\/[^/]+\/articles/, (r) => setUserArticle(r.data));
          // 个人信息
          interceptionResponse(res, /\/api\/v4\/me\?/, (r) => {
            appendHomeLink(r);
            setUserinfo(r);
          });
          // 评论
          interceptionResponse(res, /\/api\/v4\/comment_v5/, (r) => formatCommentAuthors(r.data));

          return res;
        });
      };
    }
  }
  onDocumentStart();

  const timerLoadHead = () => {
    setTimeout(() => {
      if (!isHaveHeadWhenInit) {
        document.head ? onDocumentStart() : timerLoadHead();
      }
    }, 100);
  };
  timerLoadHead();

  const timerLoadBody = () => {
    setTimeout(() => {
      document.body ? createLoad() : timerLoadBody();
    }, 100);
  };
  timerLoadBody();

  const createLoad = async () => {
    if (HTML_HOOTS.includes(hostname) && !window.frameElement) {
      try {
        const JsData = JSON.parse(domById('js-initialData') ? domById('js-initialData')!.innerText : '{}');
        const prevData = JsData.initialState.topstory.recommend.serverPayloadOrigin.data;
        findRemoveRecommends(prevData || []);
      } catch {}

      const { removeTopAD } = await myStorage.getConfig();
      // 不考虑在 iframe 中的情况
      initHTML();
      initOperate();
      initData();
      // 页面加载完成后再进行加载背景色, 解决存在顶部推广的 header 颜色
      myBackground.init();
      myVersion.initAfterLoad();
      myCustomStyle.init();
      initBlockedWords();
      initResizeObserver();
      myCtzTypeOperation.init();
      echoHistory();

      initFirstUse();

      dom('[name="useSimple"]')!.onclick = async function () {
        const isUse = confirm('是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存');
        if (!isUse) return;
        const prevConfig = await myStorage.getConfig();
        myStorage.updateConfig({
          ...prevConfig,
          ...CONFIG_SIMPLE,
        });
        onDocumentStart();
        initData();
      };

      if (removeTopAD) {
        setTimeout(() => {
          mouseEventClick(dom('svg.css-1p094v5'));
        }, 300);
      }
    }

    historyToChangePathname();
    if (hostname === 'zhuanlan.zhihu.com') {
      addArticleTime();
      const nodeArticle = dom('.Post-content');
      if (nodeArticle) {
        printArticle(nodeArticle);
        initVideoDownload(nodeArticle);
      }
    }
    fnLog(`加载完毕, 加载时长: ${Math.floor((performance.now() - T0) / 10) / 100}s, 可使用 shift + . 或点击左侧眼睛按钮唤起修改器弹窗`);
  };

  const historyToChangePathname = () => {
    pathnameHasFn({
      question: () => {
        addQuestionTime();
        const nodeQuestionAnswer = dom('.QuestionAnswer-content');
        nodeQuestionAnswer && fnJustNum(nodeQuestionAnswer);
        initOneClickInvitation();
      },
      filter: () => myPageFilterSetting.init(),
      collection: () => myCollectionExport.init(),
      following: () => myFollowRemove.init(),
      answers: () => {
        throttle(printPeopleAnswer)();
        userHomeAnswers();
      },
      posts: () => {
        throttle(printPeopleArticles)();
        userHomeAnswers();
      },
      people: topBlockUser,
    });
  };

  /** 页面路由变化, 部分操作方法 */
  const changeHistory = () => {
    historyToChangePathname();
    // 重置监听起点
    myListenListItem.reset();
    myListenSearchListItem.reset();
    myListenAnswerItem.reset();
  };
  /** history 变化 */
  window.addEventListener('popstate', throttle(changeHistory));
  window.addEventListener('pushState', throttle(changeHistory));

  /** 页面资源加载完成 */
  window.addEventListener('load', () => {
    // 如果存在登录弹窗则移除
    const nodeSignModal = dom('.signFlowModal');
    const nodeSignClose = nodeSignModal && (nodeSignModal.querySelector('.Modal-closeButton') as HTMLButtonElement);
    nodeSignClose && nodeSignClose.click();

    if (hostname === 'zhuanlan.zhihu.com') {
      setTimeout(() => {
        initVideoDownload(dom('.Post-content'));
      }, 500);
    }

    pathnameHasFn({
      zvideo: () => {
        setTimeout(() => {
          initVideoDownload(dom('.ZVideo-mainColumn'));
        }, 500);
      },
    });
  });

  window.addEventListener('keydown', async (event) => {
    const { hotKey } = await myStorage.getConfig();
    if (hotKey) {
      // shift + . 唤醒关闭修改器弹窗
      if (event.key === '>' || event.key === '》') {
        openChange();
      }
    }
    // esc 关闭弹窗
    if (event.key === 'Escape' && domById('CTZ_OPEN_CLOSE')!.getAttribute('data-close') === '0') {
      openChange();
    }
    keydownNextImage(event);
  });
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
})();
