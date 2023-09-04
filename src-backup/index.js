(function () {
  const { pathname, hostname, host, origin, search, hash, href } = location;
  const PATHNAME_FOR_PHONE_QUESTION = '/tardis/sogou/qus/';
  const PATHNAME_FOR_PHONE_ART = '/tardis/zm/art/';
  // 重定向页面
  if (pathname.includes(PATHNAME_FOR_PHONE_QUESTION)) {
    const questionId = pathname.replace(PATHNAME_FOR_PHONE_QUESTION, '');
    location.href = origin + '/question/' + questionId;
    return;
  }

  if (pathname.includes(PATHNAME_FOR_PHONE_ART)) {
    const questionId = pathname.replace(PATHNAME_FOR_PHONE_ART, '');
    location.href = 'https://zhuanlan.zhihu.com/p/' + questionId;
    return;
  }

  const T0 = performance.now();

  /** 挂载脚本时 document.head 是否渲染 */
  let isHaveHeadWhenInit = true;

  /** 使用极简模式 */
  const useSimple = async () => {
    const isUse = confirm('是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存');
    if (!isUse) return;
    pfConfig = { ...pfConfig, ...CONFIG_SIMPLE };
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    onDocumentStart();
    initData();
  };


  /** 判断 pathname 匹配的项并运行对应方法 */
  const pathnameHasFn = (obj) => {
    for (let name in obj) {
      pathname.includes(name) && obj[name]();
    }
  };

  /** 使用 ResizeObserver 监听body高度 */
  const resizeObserver = new ResizeObserver(throttle(resizeFun, 500));
  function resizeFun() {
    if (!HTML_HOOTS.includes(hostname)) return;
    // 比较列表缓存的高度是否大于当前高度，如果大于则是从 index = 0 遍历
    if (domById('TopstoryContent')) {
      const heightTopstoageContent = domById('TopstoryContent').offsetHeight;
      if (heightTopstoageContent < storageConfig.heightForList) {
        myListenListItem.restart();
        initTopStoryRecommendEvent();
      } else {
        myListenListItem.init();
      }
      // 如果列表模块高度小于网页高度则手动触发 resize 使其加载数据
      heightTopstoageContent < window.innerHeight && window.dispatchEvent(new Event('resize'));
      storageConfig.heightForList = heightTopstoageContent;
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

    pfConfig.globalTitle !== document.title && changeTitle();
    if (pfConfig.hiddenSearchBoxTopSearch && dom('.SearchBar-input input')) {
      dom('.SearchBar-input input').placeholder = '';
    }
  }

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
    storageConfig.cachePfConfig = pfConfig;
    await myStorage.initConfig();
    await myStorage.initHistory();
    initHistoryView();
    onInitStyleExtra();
    EXTRA_CLASS_HTML[host] && dom('html').classList.add(EXTRA_CLASS_HTML[host]);

    // 拦截 fetch 方法, 获取 option 中的值
    const originFetch = fetch;
    unsafeWindow.fetch = (url, opt) => {
      if (/\/answers\?/.test(url) && (myListenSelect.keySort === 'vote' || myListenSelect.keySort === 'comment') && myListenSelect.isSortFirst) {
        // 如果是自定义排序则知乎回答页码增加到20条
        url = url.replace(/(?<=limit=)\d+(?=&)/, '20');
      }

      // 缓存 header
      if (opt && opt.headers) {
        storageConfig.fetchHeaders = {
          ...storageConfig.fetchHeaders,
          ...opt.headers,
        };
      }
      return originFetch(url, opt);
    };

    if (/\/question/.test(pathname) && search.match(/(?<=sort=)\w+/)) {
      myListenSelect.keySort = search.match(/(?<=sort=)\w+/)[0];
    }

    initUserInfo();
  }
  onDocumentStart();

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
      if (pfConfig.suspensionPickUp) {
        suspensionPackUp(domA('.List-item'));
        suspensionPackUp(domA('.TopstoryItem'));
        suspensionPackUp(domA('.AnswerCard'));
      }
    }, 100),
    false
  );

  /** 页面加载完成 */
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
        myBackground.init();
        myVersion.initAfterLoad();
        myCustomStyle.init();
        myFilterWord.init();
        resizeObserver.observe(document.body);
        myCtzTypeOperation.init();
        echoHistory();
      }

      pathnameHasFn({
        question: () => {
          myListenSelect.init();
          addQuestionCreatedAndModifiedTime();
          fnJustNum(dom('.QuestionAnswer-content'));
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
          (performance.now() - T0) / 1000
        }s, 可使用 shift + . 或点击左侧眼睛按钮唤起修改器弹窗，如果快捷键不生效可以在控制台使用 window.openCtz() 唤起`
      );
    },
    false
  );

  window.addEventListener('load', () => {
    // 如果存在登录弹窗则移除
    dom('.signFlowModal') && dom('.signFlowModal').querySelector('.Modal-closeButton').click();
  });

  window.addEventListener('keydown', (event) => {
    if (pfConfig.hotKey) {
      // shift + . 唤醒关闭修改器弹窗
      if (event.key === '>' || event.key === '》') {
        domById(ID_DIALOG).style.display === 'none' ? myDialog.open() : myDialog.hide();
      }
    }
    // esc 关闭弹窗
    if (event.key === 'Escape') {
      myDialog.hide();
    }
  });
  unsafeWindow.openCtz = myDialog.open;

  // 复制代码块删除版权信息
  document.addEventListener('copy', function (event) {
    let clipboardData = event.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    let text = window.getSelection().toString();
    if (text) {
      event.preventDefault();
      clipboardData.setData('text/plain', text);
    }
  });
})();
