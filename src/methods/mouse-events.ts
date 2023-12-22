/**
 * 模拟鼠标点击
 * @param {HTMLElement} element 需要点击的元素
 */
export const doEventClickElement = (element?: HTMLElement) => {
  if (!element) return;
  const event = new MouseEvent('click', {
    view: unsafeWindow,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
};
