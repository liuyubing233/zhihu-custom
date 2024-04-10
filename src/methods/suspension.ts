import { dom, domC } from '../commons/tools';
import { THEME_CONFIG_DARK, THEME_CONFIG_LIGHT } from '../configs';
import { store } from '../store';
import { EThemeDark, EThemeLight, IHeaderDoms, IMyElement } from '../types';
import { isDark } from './background';
import { myLock } from './lock';
import { myMove } from './move';
import { myVersion } from './version';

/** 漂浮收起按钮的方法 */
export const suspensionPackUp = (elements: NodeListOf<IMyElement>) => {
  const RIGHT = 60;
  const { themeLight = EThemeLight.默认, themeDark = EThemeDark.深色护眼一 } = store.getConfig();
  for (let i = 0; i < elements.length; i++) {
    const even = elements[i];
    const evenPrev = i > 0 ? elements[i - 1] : null;
    const evenBottom = even.offsetTop + even.offsetHeight;
    const evenPrevBottom = evenPrev ? evenPrev.offsetTop + evenPrev.offsetHeight : 0;
    const hST = dom('html')!.scrollTop;
    // 收起按钮
    const evenButton = even.querySelector('.ContentItem-actions .ContentItem-rightButton') as HTMLButtonElement;
    if (!evenButton) continue;
    const needStyle = evenBottom > hST + window.innerHeight && evenPrevBottom < hST;
    evenButton.style.cssText = needStyle
      ? `visibility:visible!important;position: fixed!important;bottom: 60px;` +
        `right: ${(document.body.offsetWidth - even.offsetWidth) / 2 + RIGHT}px;` +
        `box-shadow: 0 1px 3px rgb(18 18 18 / 10%);` +
        `height: 40px!important;padding: 0 12px!important;` +
        `background: ${
          isDark() ? THEME_CONFIG_DARK[themeDark].background2 : THEME_CONFIG_LIGHT[themeLight][+themeLight !== EThemeLight.默认 ? 'background2' : 'background']
        }!important;`
      : '';
  }
};

/** 改变列表切换TAB悬浮 */
export const changeSuspensionTab = () => {
  const name = 'suspensionHomeTab';
  const pfConfig = store.getConfig();
  cSuspensionStyle(name);
  const even = dom('.Topstory-container .TopstoryTabs');
  if (!even) return;
  pfConfig[name] ? myLock.append(even, name) : myLock.remove(even);
};

/** 缓存顶部元素 */
export const cacheHeader = () => {
  const headerEventNames = ['suspensionFind', 'suspensionSearch', 'suspensionUser'];
  const { getFindEventItem, setFindEventItem, setStorageConfigItem, getStorageConfigItem, getConfig } = store;
  const pfConfig = getConfig();
  const eventHeader = getFindEventItem('header');
  if (!eventHeader.isFind) {
    eventHeader.fun && clearTimeout(eventHeader.fun);
    eventHeader.fun = setTimeout(() => {
      if (eventHeader.num < 100) {
        if (dom('.AppHeader-inner')) {
          eventHeader.isFind = true;
          setStorageConfigItem('headerDoms', {
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
          });
        }
        eventHeader.num++;
        setFindEventItem('header', eventHeader);
        cacheHeader();
      }
    }, 100);
    return;
  }
  const classIcon = '.ctz-search-icon';
  const classPickup = '.ctz-search-pick-up';
  const classNameFocus = 'focus';
  headerEventNames.forEach((name) => {
    const headerDoms = getStorageConfigItem('headerDoms') as IHeaderDoms;
    const { even } = headerDoms[name];
    if (pfConfig[name]) {
      // 如果是 suspensionSearch 则添加展开和收起按钮
      if (name === 'suspensionSearch') {
        !dom(classIcon) && even.appendChild(domC('i', { className: 'ctz-icon ctz-search-icon', innerHTML: '&#xe600;' }));
        !dom(classPickup) && even.appendChild(domC('i', { className: 'ctz-icon ctz-search-pick-up', innerHTML: '&#xe601;' }));
        dom(classIcon)!.onclick = () => even.classList.add(classNameFocus);
        dom(classPickup)!.onclick = () => even.classList.remove(classNameFocus);
      }
      myLock.append(even, name);
      even.classList.add(`position-${name}`);
      const nodeRoot = dom('#root');
      nodeRoot && nodeRoot.appendChild(even);
    } else {
      if (name === 'suspensionSearch') {
        const nodeIcon = dom(classIcon);
        const nodePickup = dom(classPickup);
        nodeIcon && nodeIcon.remove();
        nodePickup && nodePickup.remove();
        even.classList.remove(classNameFocus);
      }
      myLock.remove(even);
      even.classList.remove(`position-${name}`);
      even.setAttribute('style', '');
      const nodeHeaderInner = dom('.AppHeader-inner');
      nodeHeaderInner && nodeHeaderInner.appendChild(even);
    }
    cSuspensionStyle(name);
  });
  myVersion.change();
};

/** 悬浮模块切换样式 */
const cSuspensionStyle = (name: string) => {
  const cssObj: Record<string, string> = {
    suspensionHomeTab: '.Topstory-container .TopstoryTabs',
    suspensionFind: '.AppHeader-Tabs',
    suspensionSearch: '.SearchBar', // 搜索框使用自己添加的元素
    suspensionUser: '.AppHeader-userInfo',
  };
  const nodeCTZName = dom(`.ctz-${name}`);
  const pfConfig = store.getConfig();
  nodeCTZName && (nodeCTZName.style.cssText = pfConfig[name] ? 'display: inline-block;' : 'display: none;');
  // 如果取消悬浮，则注销掉挂载的move方法
  if (cssObj[name]) {
    pfConfig[name] ? myMove.init(cssObj[name], `${name}Po`, name) : myMove.destroy(cssObj[name]);
  }
};
