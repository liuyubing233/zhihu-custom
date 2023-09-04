/** 悬浮模块开关锁添加移除方法 */
export const myLock = {
  append: function (e, name) {
    // 悬浮模块是否固定改为鼠标放置到模块上显示开锁图标 点击即可移动模块
    if (!e) return;
    const lock = this.lock.class;
    const unlock = this.unlock.class;
    const lockMask = this.lockMask.class;
    const classRemove = 'ctz-move-this';
    const iLock = domC('i', { className: `ctz-icon ${this.lock.name}`, innerHTML: '&#xe700;' });
    const iUnlock = domC('i', { className: `ctz-icon ${this.unlock.name}`, innerHTML: '&#xe688;' });
    const dLockMask = domC('div', { className: this.lockMask.name });
    !e.querySelector(lock) && e.appendChild(iLock);
    !e.querySelector(unlock) && e.appendChild(iUnlock);
    !e.querySelector(lockMask) && e.appendChild(dLockMask);
    e.querySelector(lock).onclick = async () => {
      pfConfig[name + 'Fixed'] = true;
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      e.classList.remove(classRemove);
    };
    e.querySelector(unlock).onclick = async () => {
      pfConfig[name + 'Fixed'] = false;
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      e.classList.add(classRemove);
    };
    // 如果进入页面的时候该项的 FIXED 为 false 则添加 class
    if (pfConfig[name + 'Fixed'] === false) {
      e.classList.add(classRemove);
    }
  },
  remove: function (e) {
    if (!e) return;
    const lock = this.lock.class;
    const unlock = this.unlock.class;
    const lockMask = this.lockMask.class;
    e.querySelector(lock) && e.querySelector(lock).remove();
    e.querySelector(unlock) && e.querySelector(unlock).remove();
    e.querySelector(lockMask) && e.querySelector(lockMask).remove();
  },
  lock: { class: '.ctz-lock', name: 'ctz-lock' },
  unlock: { class: '.ctz-unlock', name: 'ctz-unlock' },
  lockMask: { class: '.ctz-lock-mask', name: 'ctz-lock-mask' },
};
