import { myStorage } from '../../commons/storage';
import { dom, domC } from '../../commons/tools';
import { store } from '../../store';
import { IHeaderDoms } from '../../types';
import { myMove } from '../move';
import { myVersion } from '../version';

/** 修改唤起修改器弹窗按钮的悬浮方式 */
export const suspensionPickupAttribute = async () => {
  const { suspensionPickUp } = await myStorage.getConfig();
  if (suspensionPickUp) {
    dom('body')!.setAttribute('data-suspension-pickup', 'true');
  } else {
    dom('body')!.removeAttribute('data-suspension-pickup');
  }
  myVersion.change();
};

/** 改变列表切换TAB悬浮 */
export const changeSuspensionTab = async () => {
  const name = 'suspensionHomeTab';
  const pfConfig = await myStorage.getConfig();
  cSuspensionStyle(name);
  const even = dom('.Topstory-container .TopstoryTabs');
  if (!even) return;
  pfConfig[name] ? myLock.append(even, name) : myLock.remove(even);
};

/** 缓存顶部元素 */
export const cacheHeader = async () => {
  const headerEventNames = ['suspensionFind', 'suspensionSearch', 'suspensionUser'];
  const { getFindEventItem, setFindEventItem, setStorageConfigItem, getStorageConfigItem } = store;
  const pfConfig = await myStorage.getConfig();
  const eventHeader = getFindEventItem('header');
  if (!eventHeader.isFind) {
    eventHeader.fun && clearTimeout(eventHeader.fun);
    eventHeader.fun = setTimeout(() => {
      if (eventHeader.num < 100) {
        const prevFind = dom('.AppHeader-inner .AppHeader-Tabs');
        const prevSearch = dom('.AppHeader-inner .SearchBar');
        const prevUser = dom('.AppHeader-inner .AppHeader-userInfo');

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
        if (!even.querySelector(classIcon)) {
          const nDomSearch = domC('i', { className: 'ctz-search-icon', innerHTML: '⚲' });
          nDomSearch.onclick = () => even.classList.add(classNameFocus);
          even.appendChild(nDomSearch);
        }

        if (!even.querySelector(classPickup)) {
          const nDomPickup = domC('i', { className: 'ctz-search-pick-up', innerHTML: '⇤' });
          nDomPickup.onclick = () => even.classList.remove(classNameFocus);
          even.appendChild(nDomPickup);
        }
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
const cSuspensionStyle = async (name: string) => {
  const cssObj: Record<string, string> = {
    suspensionHomeTab: '.Topstory-container .TopstoryTabs',
    suspensionFind: '.AppHeader-Tabs',
    suspensionSearch: '.SearchBar', // 搜索框使用自己添加的元素
    suspensionUser: '.AppHeader-userInfo',
  };
  const nodeCTZName = dom(`.ctz-${name}`);
  const pfConfig = await myStorage.getConfig();
  nodeCTZName && (nodeCTZName.style.cssText = pfConfig[name] ? 'display: inline-block;' : 'display: none;');
  // 如果取消悬浮，则注销掉挂载的move方法
  if (cssObj[name]) {
    pfConfig[name] ? myMove.init(cssObj[name], `${name}Po`, name) : myMove.destroy(cssObj[name]);
  }
};

/** 悬浮模块开关锁添加移除方法 */
const myLock = {
  append: async function (e: HTMLElement, name: string) {
    // 悬浮模块是否固定改为鼠标放置到模块上显示开锁图标 点击即可移动模块
    if (!e) return;
    const lock = this.lock.class;
    const unlock = this.unlock.class;
    const lockMask = this.lockMask.class;
    const classRemove = 'ctz-move-this';
    const iLock = domC('i', { className: `${this.lock.name}`, innerHTML: '☑︎' });
    const iUnlock = domC('i', { className: `${this.unlock.name}`, innerHTML: '☒' });
    const dLockMask = domC('div', { className: this.lockMask.name });
    !e.querySelector(lock) && e.appendChild(iLock);
    !e.querySelector(unlock) && e.appendChild(iUnlock);
    !e.querySelector(lockMask) && e.appendChild(dLockMask);

    const pfConfig = await myStorage.getConfig();
    (e.querySelector(lock) as HTMLButtonElement).onclick = async () => {
      await myStorage.updateConfigItem(name + 'Fixed', true);
      e.classList.remove(classRemove);
    };
    (e.querySelector(unlock) as HTMLButtonElement).onclick = async () => {
      await myStorage.updateConfigItem(name + 'Fixed', false);
      e.classList.add(classRemove);
    };
    // 如果进入页面的时候该项的 FIXED 为 false 则添加 class
    if (pfConfig[name + 'Fixed'] === false) {
      e.classList.add(classRemove);
    }
  },
  remove: function (e: HTMLElement) {
    if (!e) return;
    const nodeLock = e.querySelector(this.lock.class);
    const nodeUnlock = e.querySelector(this.unlock.class);
    const nodeLockMask = e.querySelector(this.lockMask.class);
    nodeLock && nodeLock.remove();
    nodeUnlock && nodeUnlock.remove();
    nodeLockMask && nodeLockMask.remove();
  },
  lock: { class: '.ctz-lock', name: 'ctz-lock' },
  unlock: { class: '.ctz-unlock', name: 'ctz-unlock' },
  lockMask: { class: '.ctz-lock-mask', name: 'ctz-lock-mask' },
};
