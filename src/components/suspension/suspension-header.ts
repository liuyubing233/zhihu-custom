
// let timeoutChangeSuspensionTab: NodeJS.Timeout | undefined;
/** 改变列表切换TAB悬浮 */
// export const changeSuspensionTab = async (index = 0, prevDom?: HTMLElement) => {
//   const name = 'suspensionHomeTab';
//   const { suspensionHomeTab } = await myStorage.getConfig();
//   // 当前元素仍然存在于页面上，那么知乎自身已经重载完毕
//   if (prevDom && document.body.contains(prevDom)) {
//     if (suspensionHomeTab) {
//       myLock.append(prevDom, name);
//       myMove.init(prevDom, `${name}Po`, name);
//     } else {
//       myLock.remove(prevDom);
//       myMove.destroy(prevDom);
//     }
//     return;
//   }
//   if (index >= 5) return;
//   timeoutChangeSuspensionTab && clearTimeout(timeoutChangeSuspensionTab);
//   timeoutChangeSuspensionTab = setTimeout(() => changeSuspensionTab(++index, dom('.Topstory-container .TopstoryTabs')), 500);
// };

// /** 改变顶部元素的模块悬浮 */
// export const suspensionHeader = async (name: IHeaderName) => {
//   const { getHeaderCache, getHeaderFound } = storeSuspension;
//   // 如果没有 Found 到则1s后重新执行（2s内未查找到元素 Found 会为true）
//   if (!getHeaderFound(name)) {
//     setTimeout(() => suspensionHeader(name), 1000);
//     return;
//   }

//   const domCached = getHeaderCache(name);
//   if (!domCached) return;

//   const config = await myStorage.getConfig();
//   if (config[name]) {
//     // 悬浮模块
//     if (name === 'suspensionSearch') {
//       if (!domCached.querySelector('.ctz-search-icon')) {
//         const nDomSearch = domC('i', { className: 'ctz-search-icon', innerHTML: '⚲' });
//         nDomSearch.onclick = () => domCached.classList.add('focus');
//         domCached.appendChild(nDomSearch);
//       }

//       if (!domCached.querySelector('.ctz-search-pickup')) {
//         const nDomPickup = domC('i', { className: 'ctz-search-pickup', innerHTML: '⇤' });
//         nDomPickup.onclick = () => domCached.classList.remove('focus');
//         domCached.appendChild(nDomPickup);
//       }
//     }
//     myLock.append(domCached, name);
//     domCached.classList.add(`position-${name}`);
//     const nodeRoot = dom('#root');
//     nodeRoot && nodeRoot.appendChild(domCached);
//     myMove.init(domCached, `${name}Po`, name);
//   } else {
//     // 模块不悬浮
//     if (name === 'suspensionSearch') {
//       const nodeIcon = dom('.ctz-search-icon');
//       const nodePickup = dom('.ctz-search-pickup');
//       nodeIcon && nodeIcon.remove();
//       nodePickup && nodePickup.remove();
//       domCached.classList.remove('focus');
//     }
//     myLock.remove(domCached);
//     domCached.classList.remove(`position-${name}`);
//     domCached.setAttribute('style', '');
//     const nodeHeaderInner = dom('.AppHeader-inner');
//     nodeHeaderInner && nodeHeaderInner.appendChild(domCached);
//     myMove.destroy(domCached);
//   }
//   mySize.change();
// };

// /** 悬浮模块开关锁添加移除方法 */
// const myLock = {
//   append: async function (el: HTMLElement, name: string) {
//     // 悬浮模块是否固定改为鼠标放置到模块上显示开锁图标 点击即可移动模块
//     const config = await myStorage.getConfig();

//     const iLock = domC('i', { className: 'ctz-lock', innerHTML: '☑︎' });
//     const iUnlock = domC('i', { className: 'ctz-unlock', innerHTML: '☒' });
//     const dLockMask = domC('div', { className: 'ctz-lock-mask' });

//     iLock.onclick = async () => {
//       await myStorage.updateConfigItem(name + 'Fixed', true);
//       el.classList.remove('ctz-move-this');
//     };
//     iUnlock.onclick = async () => {
//       await myStorage.updateConfigItem(name + 'Fixed', false);
//       el.classList.add('ctz-move-this');
//     };

//     // 如果进入页面的时候该项的 FIXED 为 false 则添加 class
//     if (config[name + 'Fixed'] === false) {
//       el.classList.add('ctz-move-this');
//     }

//     !el.querySelector('.ctz-lock') && el.appendChild(iLock);
//     !el.querySelector('.ctz-unlock') && el.appendChild(iUnlock);
//     !el.querySelector('.ctz-lock-mask') && el.appendChild(dLockMask);
//   },
//   remove: function (el: HTMLElement) {
//     const nodeLock = el.querySelector('.ctz-lock');
//     const nodeUnlock = el.querySelector('.ctz-unlock');
//     const nodeLockMask = el.querySelector('.ctz-lock-mask');
//     nodeLock && nodeLock.remove();
//     nodeUnlock && nodeUnlock.remove();
//     nodeLockMask && nodeLockMask.remove();
//   },
// };
