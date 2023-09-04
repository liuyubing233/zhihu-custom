/** 漂浮收起按钮的方法 */
export const suspensionPackUp = (elements) => {
  const RIGHT = 60;
  const { colorBackground } = pfConfig;
  for (let i = 0; i < elements.length; i++) {
    const even = elements[i];
    const evenPrev = i > 0 ? elements[i - 1] : null;
    const evenBottom = even.offsetTop + even.offsetHeight;
    const evenPrevBottom = evenPrev ? evenPrev.offsetTop + evenPrev.offsetHeight : 0;
    const hST = dom('html').scrollTop;
    // 收起按钮
    const evenButton = even.querySelector('.ContentItem-actions .ContentItem-rightButton');
    if (evenButton) {
      if (evenBottom > hST + window.innerHeight && evenPrevBottom < hST) {
        evenButton.style =
          `visibility:visible!important;position: fixed!important;bottom: 60px;` +
          `right: ${(document.body.offsetWidth - even.offsetWidth) / 2 + RIGHT}px;` +
          `box-shadow: 0 1px 3px rgb(18 18 18 / 10%);` +
          `height: 40px!important;padding: 0 12px!important;` +
          `background: ${
            myBackground.isUseDark()
              ? BACKGROUND_DARK_COLORS[colorBackground].b2
              : BACKGROUND_CONFIG[colorBackground].opacity
              ? BACKGROUND_CONFIG[colorBackground].opacity
              : colorBackground
          }!important;`;
      } else {
        evenButton.style = '';
      }
    }
  }
};

/** 改变列表切换TAB悬浮 */
export const changeSuspensionTab = () => {
  const name = 'suspensionHomeTab';
  cSuspensionStyle(name);
  const even = dom('.Topstory-container .TopstoryTabs');
  pfConfig[name] ? myLock.append(even, name) : myLock.remove(even, name);
};

/** 缓存顶部元素 */
export const cacheHeader = () => {
  const headerEventNames = ['suspensionFind', 'suspensionSearch', 'suspensionUser'];
  if (!findEvent.header.isFind) {
    findEvent.header.fun && clearTimeout(findEvent.header.fun);
    findEvent.header.fun = setTimeout(() => {
      clearTimeout(findEvent.header.fun);
      if (findEvent.header.num < 100) {
        if (dom('.AppHeader-inner')) {
          findEvent.header.isFind = true;
          storageConfig.headerDoms = {
            suspensionFind: {
              class: '.AppHeader-inner .AppHeader-Tabs',
              even: dom('.AppHeader-inner .AppHeader-Tabs'),
              index: 1,
            },
            suspensionSearch: {
              class: '.AppHeader-inner .SearchBar',
              even: dom('.AppHeader-inner .SearchBar'),
              index: 2,
            },
            suspensionUser: {
              class: '.AppHeader-inner .AppHeader-userInfo',
              even: dom('.AppHeader-inner .AppHeader-userInfo'),
              index: 3,
            },
          };
        }
        findEvent.header.num++;
        cacheHeader();
      }
    }, 100);
    return;
  }
  const classIcon = '.ctz-search-icon';
  const classPickup = '.ctz-search-pick-up';
  const classNameFocus = 'focus';
  headerEventNames.forEach((name) => {
    const { even } = storageConfig.headerDoms[name];
    if (pfConfig[name]) {
      // 如果是 suspensionSearch 则添加展开和收起按钮
      if (name === 'suspensionSearch') {
        !dom(classIcon) && even.appendChild(domC('i', { className: 'ctz-icon ctz-search-icon', innerHTML: '&#xe600;' }));
        !dom(classPickup) && even.appendChild(domC('i', { className: 'ctz-icon ctz-search-pick-up', innerHTML: '&#xe601;' }));
        dom(classIcon).onclick = () => even.classList.add(classNameFocus);
        dom(classPickup).onclick = () => even.classList.remove(classNameFocus);
      }
      myLock.append(even, name);
      even.classList.add(`position-${name}`);
      dom('#root').appendChild(even);
    } else {
      if (name === 'suspensionSearch') {
        dom(classIcon) && dom(classIcon).remove();
        dom(classPickup) && dom(classPickup).remove();
        even.classList.remove(classNameFocus);
      }
      myLock.remove(even, name);
      even.classList.remove(`position-${name}`);
      even.setAttribute('style', '');
      dom('.AppHeader-inner').appendChild(even);
    }
    cSuspensionStyle(name);
  });
  myVersion.change();
};

/** 悬浮模块切换样式 */
const cSuspensionStyle = (name) => {
  const cssObj = {
    suspensionHomeTab: '.Topstory-container .TopstoryTabs',
    suspensionFind: '.AppHeader-Tabs',
    suspensionSearch: '.SearchBar', // 搜索框使用自己添加的元素
    suspensionUser: '.AppHeader-userInfo',
  };
  if (dom(`.ctz-${name}`)) {
    dom(`.ctz-${name}`).style = pfConfig[name] ? 'display: inline-block;' : 'display: none;';
  }
  // 如果取消悬浮，则注销掉挂载的move方法
  if (cssObj[name]) {
    pfConfig[name] ? myMove.init(cssObj[name], `${name}Po`, name) : myMove.destroy(cssObj[name]);
  }
};
