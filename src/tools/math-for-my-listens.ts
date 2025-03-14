import { fnLog } from './dom';

export const CTZ_HIDDEN_ITEM_CLASS = 'ctz-hidden-item';

export const fnHidden = (ev: HTMLElement, msg: string) => {
  ev.style.display = 'none';
  ev.classList.add(CTZ_HIDDEN_ITEM_CLASS);
  fnLog(msg);
};
