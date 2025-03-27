import { dom, domById, domC } from './dom';

/** class: 消息提示弹窗 */
export const CLASS_MESSAGE = 'ctz-message';

const messageDoms: HTMLElement[] = [];
/**
 * 信息提示框
 * @param {string} value 信息内容
 * @param {number} t 存在时间
 */
export const message = (value: string, t: number = 3000) => {
  const time = +new Date();
  const classTime = `ctz-message-${time}`;
  const nDom = domC('div', {
    innerHTML: value,
    className: `${CLASS_MESSAGE} ${classTime}`,
  });
  const domBox = domById('CTZ_MESSAGE_BOX');
  if (!domBox) return;
  domBox.appendChild(nDom);
  messageDoms.push(nDom);
  if (messageDoms.length > 3) {
    const prevDom = messageDoms.shift();
    prevDom && domBox.removeChild(prevDom);
  }
  setTimeout(() => {
    console.log('Timeout message', value)
    const nPrevDom = dom(`.${classTime}`);
    if (nPrevDom) {
      domById('CTZ_MESSAGE_BOX')!.removeChild(nPrevDom);
      messageDoms.shift();
    }
  }, t);
};
