import { interceptionResponse } from './commons/fetch';
import { fnJustNum } from './commons/math-for-my-listens';
import { myStorage } from './commons/storage';
import { dom, domById, fnAppendStyle, fnLog, formatDataToHump, isSafari, mouseEventClick, pathnameHasFn, throttle } from './commons/tools';
import { CONFIG_DEFAULT } from './configs';
import { EXTRA_CLASS_HTML, HTML_HOOTS, ID_EXTRA_DIALOG } from './configs/dom-name';
import { initData } from './init/init-data';
import { initHistoryView } from './init/init-history-view';
import { appendHomeLink, initHTML } from './init/init-html';
import { initResizeObserver } from './init/init-observer-resize';
import { initOperate } from './init/init-operate';
import { needRedirect } from './init/redirect';
import { checkThemeDarkOrLight, myBackground, myCustomStyle } from './methods/background';
import { initBlockedWords } from './methods/blocked-words';
import { myCtzTypeOperation } from './methods/ctz-type-operate';
import { myFollowRemove } from './methods/follow-remove';
import { appendHiddenStyle } from './methods/hidden';
import { echoHistory } from './methods/history';
import { keydownNextImage } from './methods/image';
import { myListenAnswerItem } from './methods/listen-answer-item';
import { closeCommentDialog, formatCommentAuthors } from './methods/listen-comment';
import { myListenListItem } from './methods/listen-list-item';
import { myListenSearchListItem } from './methods/listen-search-list-item';
import { initOneClickInvitation } from './methods/one-click-invitation';
import { closeExtra, openChange } from './methods/open';
import { myPageFilterSetting } from './methods/page-filter-setting';
import { myCollectionExport, printArticle, printPeopleAnswer, printPeopleArticles } from './methods/print';
import { addArticleTime, addQuestionTime } from './methods/time';
import { topBlockUser, userHomeAnswers } from './methods/user-home-content';
import { myVersion } from './methods/version';
import { fixVideoAutoPlay, initVideoDownload } from './methods/video';
import { fnReplaceZhidaToSearch } from './methods/zhida-to-search';
import { store } from './store';
import { IZhihuAnswerTarget } from './types/zhihu/zhihu-answer.type';
import { INNER_CSS } from './web-resources';

(function () {
  if (needRedirect()) return;

  GM_registerMenuCommand('⚙️ 设置', () => {
    openChange();
  });

  const T0 = performance.now();
  const { hostname, href } = location;
  const { setStorageConfigItem, getStorageConfigItem, findRemoveRecommends, setUserAnswer, setUserArticle, setUserinfo, findRemoveAnswers } = store;

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
      fnLog('您好，欢迎使用本插件，第一次进入，初始化中...');
      config = CONFIG_DEFAULT;
    } else {
      config = {
        ...CONFIG_DEFAULT,
        ...config,
      };
    }
    await myStorage.updateConfig(config);

    // TODO: 更改黑名单列表字段，10个 feature 版本后删除(removeBlockUserContentList)，5.2.0 添加，5.12.0 删除
    if (config.removeBlockUserContentList && config.removeBlockUserContentList.length) {
      config.blockedUsers = [...config.removeBlockUserContentList];
      delete config.removeBlockUserContentList;
      await myStorage.updateConfig(config);
    }

    initHistoryView();
    appendHiddenStyle();
    myBackground.init();
    myVersion.init();
    checkThemeDarkOrLight();

    dom('html')!.classList.add(/www\.zhihu\.com\/column/.test(href) ? 'zhuanlan' : EXTRA_CLASS_HTML[hostname]);

    const { fetchInterceptStatus } = config;
    if (fetchInterceptStatus) {
      fnLog('已开启接口拦截');
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
          // 回答内容
          interceptionResponse(res, /\/api\/v4\/questions\/[^/]+\/feeds/, (r) => {
            const answerTargets = r.data.map((i: any) => formatDataToHump(i.target));
            findRemoveAnswers(answerTargets);
          });

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
      const JsData = JSON.parse(domById('js-initialData') ? domById('js-initialData')!.innerText : '{}');
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

      const { removeTopAD } = await myStorage.getConfig();
      initHTML();
      initOperate();
      initData();
      // 以下设置都在 initHTML 之后执行
      myVersion.initAfterLoad();
      myCustomStyle.init();
      initBlockedWords();
      initResizeObserver();
      myCtzTypeOperation.init();
      echoHistory();

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

  window.addEventListener('keydown', async (event) => {
    const { hotKey, keyEscCloseCommentDialog } = await myStorage.getConfig();
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
