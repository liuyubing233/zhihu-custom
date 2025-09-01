import { checkThemeDarkOrLight, myBackground } from './components/background';
import { interceptResponseForBlocked, topBlockUser } from './components/black-list';
import { initBlockedWords } from './components/blocked-words';
import { canCopy, eventCopy } from './components/copy';
import { closeExtra, openChange } from './components/ctz-dialog';
import { myCtzTypeOperation } from './components/ctz-type-operate';
import { myCustomStyle } from './components/custom-style';
import { echoData } from './components/echo-data';
import { myFollowRemove } from './components/follow-remove';
import { appendHiddenStyle } from './components/hidden';
import { echoHistory } from './components/history';
import { keydownNextImage } from './components/image';
import { fnJustNumberInAction } from './components/just-number';
import { myListenAnswer } from './components/listen-answer';
import { closeCommentDialog, formatCommentAuthors } from './components/listen-comment';
import { myListenList } from './components/listen-list';
import { myListenSearchListItem } from './components/listen-search-list-item';
import { initOneClickInvitation } from './components/one-click-invitation';
import { myPageFilterSetting } from './components/page-filter-setting';
import { changeICO, changeTitle, myCachePageTitle } from './components/page-title';
import { myCollectionExport, printArticle, printPeopleAnswer, printPeopleArticles } from './components/print';
import { closeAllSelect } from './components/select';
import { changeSizeBeforeResize, mySize } from './components/size';
import { suspensionPickupAttribute } from './components/suspension';
import { addArticleTime, addQuestionTime } from './components/time';
import { myListenUserHomeList } from './components/user-home';
import { changeVideoStyle, fixVideoAutoPlay, initVideoDownload } from './components/video';
import { fnReplaceZhidaToSearch } from './components/zhida-to-search';
import { CONFIG_DEFAULT } from './config';
import { initHistoryView } from './init/init-history-view';
import { appendHomeLink, initHTML } from './init/init-html/init-html';
import { initResizeObserver } from './init/init-observer-resize';
import { initOperate } from './init/init-operate';
import { doReadMore } from './init/init-top-event-listener';
import { needRedirect } from './init/redirect';
import { EXTRA_CLASS_HTML, HTML_HOOTS, ID_EXTRA_DIALOG } from './misc';
import { store } from './store';
import { dom, domById, domP, fnAppendStyle, fnLog, formatDataToHump, interceptionResponse, isSafari, mouseEventClick, myStorage, pathnameHasFn, throttle } from './tools';
import { IZhihuAnswerTarget } from './types/zhihu/zhihu-answer.type';
import { INNER_CSS } from './web-resources';

(function () {
  if (needRedirect()) return;

  GM_registerMenuCommand('⚙️ 设置', () => {
    openChange();
  });

  const T0 = performance.now();
  const { hostname, href, pathname, hash } = location;
  const { setFetchHeaders, getFetchHeaders, findRemoveRecommends, setUserAnswer, setUserArticle, setUserInfo, findRemoveAnswers, setJsInitialData } = store;

  /** 在启动时注入的内容 */
  async function onDocumentStart() {
    if (!HTML_HOOTS.includes(hostname) || window.frameElement) return;
    if (!document.head) {
      setTimeout(onDocumentStart, 100);
      return;
    }

    fixVideoAutoPlay();
    fnAppendStyle('CTZ_STYLE', INNER_CSS);

    let config = await myStorage.getConfig();
    if (!config || config.fetchInterceptStatus === undefined) {
      fnLog('欢迎使用，初始化中...');
      config = CONFIG_DEFAULT;
    } else {
      config = {
        ...CONFIG_DEFAULT,
        ...config,
      };
    }
    await myStorage.updateConfig(config);

    initHistoryView();
    appendHiddenStyle();
    myBackground.init();
    mySize.init();
    checkThemeDarkOrLight();
    changeVideoStyle();

    dom('html')!.classList.add(/www\.zhihu\.com\/column/.test(href) ? 'zhuanlan' : EXTRA_CLASS_HTML[hostname]);

    const { fetchInterceptStatus } = config;
    if (fetchInterceptStatus) {
      fnLog('已开启接口拦截');
      const prevHeaders = getFetchHeaders();
      // 拦截 fetch 方法，获取接口内容，唯一
      const originFetch = fetch;
      const myWindow = isSafari ? window : unsafeWindow;
      myWindow.fetch = (url: any, opt) => {
        // 缓存 header
        if (opt && opt.headers) {
          setFetchHeaders({
            ...prevHeaders,
            ...opt.headers,
          });
        }

        return originFetch(url, opt).then((res) => {
          // 推荐列表
          interceptionResponse(res, /\/api\/v3\/feed\/topstory\/recommend/, (r) => {
            myListenList.dataLoad();
            findRemoveRecommends(r.data);
          });
          // 关注列表
          interceptionResponse(res, /\/api\/v3\/moments/, (r) => {
            myListenList.dataLoad();
          });

          // 用户主页回答
          interceptionResponse(res, /\api\/v4\/members\/[^/]+\/answers/, (r) => setUserAnswer(r.data));
          // 用户主页文章
          interceptionResponse(res, /\api\/v4\/members\/[^/]+\/articles/, (r) => setUserArticle(r.data));
          // 个人信息
          interceptionResponse(res, /\/api\/v4\/me\?/, (r) => {
            setUserInfo(r);
            appendHomeLink();
          });
          // 评论
          interceptionResponse(res, /\/api\/v4\/comment_v5/, (r) => formatCommentAuthors(r.data));
          // 回答内容
          interceptionResponse(res, /\/api\/v4\/questions\/[^/]+\/feeds/, (r) => {
            myListenAnswer.dataLoad();
            const answerTargets = r.data.map((i: any) => formatDataToHump(i.target));
            findRemoveAnswers(answerTargets);
          });
          interceptResponseForBlocked(res, opt);

          return res;
        });
      };
    }

    // 再加载 body 上挂载的数据
    onBodyLoad();
  }
  onDocumentStart();

  const onBodyLoad = async () => {
    if (!document.body) {
      setTimeout(onBodyLoad, 100);
      return;
    }

    if (HTML_HOOTS.includes(hostname) && !window.frameElement) {
      try {
        const JsData = JSON.parse(domById('js-initialData') ? domById('js-initialData')!.innerText : '{}');
        setJsInitialData(JsData);
        // 获取JS默认缓存的列表数据
        try {
          const prevRecommend = JsData.initialState.topstory.recommend.serverPayloadOrigin.data;
          findRemoveRecommends(prevRecommend || []);
        } catch {}

        // 获取JS默认缓存的回答数据
        try {
          const prevAnswers = JsData.initialState.entities.answers;
          const answerTargets: IZhihuAnswerTarget[] = Object.values(prevAnswers);
          answerTargets.length && findRemoveAnswers(answerTargets);
        } catch {}
      } catch {}
      const { removeTopAD } = await myStorage.getConfig();
      initHTML();
      initOperate();
      myCachePageTitle.set(document.title);
      // 以下设置都在 initHTML 之后执行
      echoData();
      changeICO();
      changeTitle();
      // changeSuspensionTab();
      suspensionPickupAttribute();
      mySize.initAfterLoad();
      myCustomStyle.init();
      initBlockedWords();
      initResizeObserver();
      myCtzTypeOperation.init();
      echoHistory();
      // initCacheHeader();
      changeSizeBeforeResize();

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

  /** 根据页面路由不同执行的对应方法 */
  const historyToChangePathname = () => {
    pathnameHasFn({
      question: () => {
        addQuestionTime();
        initOneClickInvitation();
      },
      filter: () => myPageFilterSetting.init(),
      collection: () => myCollectionExport.init(),
      following: () => myFollowRemove.init(),
      answers: () => {
        throttle(printPeopleAnswer)();
      },
      posts: () => {
        throttle(printPeopleArticles)();
      },
      people: topBlockUser,
      org: topBlockUser,
    });
  };

  let prevHash = hash;
  let prevPathname = pathname;
  /** 页面路由变化, 部分操作方法 */
  const changeHistory = () => {
    // 只改动 hash 的情况下不进行更新
    if (location.hash !== prevHash && prevPathname === location.pathname) return;
    prevHash = location.hash;
    prevPathname = location.pathname;
    historyToChangePathname();
    // 重置监听起点
    myListenList.reset();
    myListenSearchListItem.reset();
    myListenAnswer.reset();
    myListenUserHomeList.reset();
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
        fnReplaceZhidaToSearch();
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

  // 监听页面滚动
  window.addEventListener(
    'scroll',
    throttle(() => {
      fnJustNumberInAction();
      canCopy();
    })
  );

  // window.addEventListener('keyup', async (event) => {
  //   if (event.key === 'o') {
  //     myRecommendClosePosition.doPosition(document.activeElement as HTMLElement);
  //   }
  // });

  window.addEventListener('keydown', async (event) => {
    const config = await myStorage.getConfig();
    const { hotKey, keyEscCloseCommentDialog } = config;
    if (hotKey) {
      // shift + . 唤醒关闭修改器弹窗
      if (event.key === '>' || event.key === '》') {
        openChange();
      }
    }

    // esc 关闭弹窗
    if (event.key === 'Escape') {
      if (domById(ID_EXTRA_DIALOG)!.dataset.status === 'open') {
        closeExtra();
      } else if (domById('CTZ_OPEN_CLOSE')!.getAttribute('data-close') === '0') {
        openChange();
      }

      keyEscCloseCommentDialog && closeCommentDialog();
    }

    if (event.key === 'o') {
      // 是否是快捷键展开阅读全文
      const currentDom = document.activeElement;
      currentDom && doReadMore(currentDom as HTMLElement);
      // myRecommendClosePosition.savePosition(currentDom as HTMLElement);
      // myRecommendClosePosition.doPosition(document.activeElement as HTMLElement);
    }

    keydownNextImage(event);
  });

  // 复制代码块删除版权信息
  window.addEventListener('copy', function (event) {
    console.log('???????copy')
    eventCopy(event);
  });

  document.addEventListener('click', function (event) {
    const target = event.target as HTMLElement;
    // 如果不是下拉选择则关闭所有
    if (!target.classList.contains('ctz-select') && !domP(target, 'class', 'ctz-select')) {
      closeAllSelect();
    }
  });
})();
