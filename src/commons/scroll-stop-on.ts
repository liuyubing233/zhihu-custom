import { dom } from "./tools";

/** 在打开弹窗时候停止页面滚动，只允许弹窗滚动 */
export const myScroll = {
  stop: () => dom('body')!.classList.add('ctz-stop-scroll'),
  on: () => dom('body')!.classList.remove('ctz-stop-scroll'),
};