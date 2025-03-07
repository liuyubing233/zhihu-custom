import { isSafari } from "./browser";

/**
 * 模拟鼠标点击
 * @param {HTMLElement} element 需要点击的元素
 */
export const mouseEventClick = (element?: HTMLElement) => {
  if (!element) return;
  const myWindow = isSafari ? window : unsafeWindow;
  const event = new MouseEvent('click', {
    view: myWindow,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
};
