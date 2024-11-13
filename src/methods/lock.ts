import { myStorage } from '../commons/storage';
import { domC } from '../commons/tools';

/** 悬浮模块开关锁添加移除方法 */
export const myLock = {
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
      await myStorage.setConfigItem(name + 'Fixed', true);
      e.classList.remove(classRemove);
    };
    (e.querySelector(unlock) as HTMLButtonElement).onclick = async () => {
      await myStorage.setConfigItem(name + 'Fixed', false);
      e.classList.add(classRemove);
    };
    // 如果进入页面的时候该项的 FIXED 为 false 则添加 class
    if (pfConfig[name + 'Fixed'] === false) {
      e.classList.add(classRemove);
    }
  },
  remove: function (e: HTMLElement) {
    if (!e) return;
    const lock = this.lock.class;
    const unlock = this.unlock.class;
    const lockMask = this.lockMask.class;
    const nodeLock = e.querySelector(lock);
    const nodeUnlock = e.querySelector(unlock);
    const nodeLockMask = e.querySelector(lockMask);
    nodeLock && nodeLock.remove();
    nodeUnlock && nodeUnlock.remove();
    nodeLockMask && nodeLockMask.remove();
  },
  lock: { class: '.ctz-lock', name: 'ctz-lock' },
  unlock: { class: '.ctz-unlock', name: 'ctz-unlock' },
  lockMask: { class: '.ctz-lock-mask', name: 'ctz-lock-mask' },
};
