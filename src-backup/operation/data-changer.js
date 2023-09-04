/** 回填数据，供每次打开使用 */
export const echoData = () => {
  const textSameName = {
    globalTitle: (e) => (e.value = pfConfig.globalTitle || document.title),
    customizeCss: (e) => (e.value = pfConfig['customizeCss']),
  };
  const echoText = (even) => {
    textSameName[even.name] ? textSameName[even.name](even) : (even.value = pfConfig[even.name]);
  };
  const echo = {
    radio: (even) => pfConfig.hasOwnProperty(even.name) && even.value === pfConfig[even.name] && (even.checked = true),
    checkbox: (even) => (even.checked = pfConfig[even.name] || false),
    'select-one': (even) => {
      if (pfConfig[even.name]) {
        for (let i = 0; i < even.length; i++) {
          if (even[i].value === pfConfig[even.name]) {
            even[i].selected = true;
          }
        }
      }
    },
    text: echoText,
    number: echoText,
    range: (even) => {
      const nValue = pfConfig[even.name];
      const rangeNum = isNaN(+nValue) || !(+nValue > 0) ? dom(`[name="${even.name}"]`).min : nValue;
      even.value = rangeNum;
      domById(even.name).innerText = rangeNum;
    },
  };
  const doEcho = (item) => {
    echo[item.type] && echo[item.type](item);
  };
  domA(`.${CLASS_INPUT_CLICK}`).forEach(doEcho);
  domA(`.${CLASS_INPUT_CHANGE}`).forEach(doEcho);
  echo.text(dom('[name="globalTitle"]'));
};

/** 回填历史记录 */
export const echoHistory = () => {
  const { list, view } = pfHistory;
  dom('#CTZ_HISTORY_LIST .ctz-set-content').innerHTML = list.join('<br/>');
  dom('#CTZ_HISTORY_VIEW .ctz-set-content').innerHTML = view.join('<br/>');
};

/** 更改编辑器方法 */
export const fnChanger = async (ev) => {
  // onchange 时只调用 myVersion 的 name
  const doCssVersion = [
    'questionTitleTag',
    'fixedListItemMore',
    'linkShopping',
    'highlightListItem',
    'zoomImageType',
    'zoomImageSize',
    'versionHome',
    'versionAnswer',
    'versionArticle',
    'fontSizeForList',
    'fontSizeForAnswer',
    'fontSizeForArticle',
    'zoomListVideoType',
    'zoomListVideoSize',
  ];
  const { name, value, checked, type } = ev;
  const ob = {
    colorBackground: () => {
      myVersion.change();
      myBackground.init();
      myListenListItem.restart();
      onUseThemeDark();
    },
    suspensionHomeTab: () => {
      myVersion.change();
      changeSuspensionTab();
    },
    suspensionFind: cacheHeader,
    suspensionSearch: cacheHeader,
    suspensionUser: cacheHeader,
    titleIco: changeICO,
    showGIFinDialog: previewGIF,
    questionCreatedAndModifiedTime: addQuestionCreatedAndModifiedTime,
    highlightOriginal: () => {
      myListenListItem.restart();
    },
    listOutPutNotInterested: () => {
      myListenListItem.restart();
    },
    articleCreateTimeToTop: addArticleCreateTimeToTop,
    linkAnswerVideo: () => {
      myVersion.change();
      zoomVideos();
    },
  };

  pfConfig[name] = type === 'checkbox' ? checked : value;
  await myStorage.set('pfConfig', JSON.stringify(pfConfig));
  type === 'range' && domById(name) && (domById(name).innerText = value);
  if (/^hidden/.test(name)) {
    myHidden.init();
    return;
  }
  if (doCssVersion.includes(name)) {
    myVersion.change();
    return;
  }
  ob[name] && ob[name]();
};
