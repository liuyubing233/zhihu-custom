import { CLASS_MESSAGE, ID_MESSAGE_BOX } from '../configs';
import { IMyElement } from '../types';

/** 获取元素 */
export const dom = (n: string): IMyElement | undefined => document.querySelector(n) as IMyElement;

/** 使用 Id 获取元素 */
export const domById = (id: string): IMyElement | undefined => document.getElementById(id) as IMyElement;

/** 获取所有元素 */
export const domA = (n: string): NodeListOf<IMyElement> => document.querySelectorAll(n);

/** 创建元素 */
export const domC = (name: string, attrObjs: Record<string, any>) => {
  const node = document.createElement(name) as IMyElement;
  for (let key in attrObjs) {
    node[key] = attrObjs[key];
  }
  return node;
};

/** 查找父级元素 */
export const domP = (node: any, attrName: string, attrValue: string): IMyElement | undefined => {
  const nodeP = node.parentElement as IMyElement;
  if (!nodeP) return undefined;
  if (!attrName || !attrValue) return nodeP;
  if (nodeP === document.body) return undefined;
  const attrValueList = (nodeP.getAttribute(attrName) || '').split(' ');
  return attrValueList.includes(attrValue) ? nodeP : domP(nodeP, attrName, attrValue);
};

export const insertAfter = (newElement: any, targetElement: any) => {
  const parent = targetElement.parentNode;
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
};

/** 判断是否返回空字符串 */
export const fnReturnStr = (str: string, isHave = false, strFalse = '') => (isHave ? str : strFalse);

/** 带前缀的 log */
export const fnLog = (...str: string[]) => console.log('%c「修改器」', 'color: green;font-weight: bold;', ...str);

/** 注入样式文件的方法 */
export const fnInitDomStyle = (id: string, innerHTML: string) => {
  const element = domById(id);
  element ? (element.innerHTML = innerHTML) : document.head.appendChild(domC('style', { id, type: 'text/css', innerHTML }));
};

/** 元素替换内容 */
export const fnDomReplace = (node: any, attrObjs: Record<string, any>) => {
  if (!node) return;
  for (let key in attrObjs) {
    node[key] = attrObjs[key];
  }
};

/** 节流, 使用时 fn 需要为 function () {} */
export function throttle(fn: Function, time = 300) {
  let tout: NodeJS.Timeout | undefined = undefined;
  return function () {
    if (tout) return;
    tout = setTimeout(() => {
      tout = undefined;
      // @ts-ignore
      fn.apply(this, arguments);
    }, time);
  };
}

/** 判断 pathname 匹配的项并运行对应方法 */
export const pathnameHasFn = (obj: Record<string, Function>) => {
  const { pathname } = location;
  for (let name in obj) {
    pathname.includes(name) && obj[name]();
  }
};

/** 手动触发页面尺寸变更方法 */
export const windowResize = () => {
  window.dispatchEvent(new Event('resize'));
};

/** Promise.all 百分比进度 */
export const promisePercent = (requests: any[] = [], callback: (index: number) => void): Promise<any[]> => {
  let index = 0;
  requests.forEach((item) => {
    item.then(() => {
      index++;
      callback(index);
    });
  });
  return Promise.all(requests);
};

/**
 * 模拟鼠标点击
 * @param {HTMLElement} element 需要点击的元素
 */
export const mouseEventClick = (element?: HTMLElement) => {
  if (!element) return;
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
};

/** 复制 */
export const copy = async (value: string) => {
  if (navigator.clipboard && navigator.permissions) {
    await navigator.clipboard.writeText(value);
  } else {
    const domTextarea = domC('textArea', {
      value,
      style: 'width: 0px;position: fixed;left: -999px;top: 10px;',
    });
    domTextarea.setAttribute('readonly', 'readonly');
    document.body.appendChild(domTextarea);
    domTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(domTextarea);
  }
};

const messageDoms: IMyElement[] = [];
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
  const domBox = domById(ID_MESSAGE_BOX);
  if (!domBox) return;
  domBox.appendChild(nDom);
  messageDoms.push(nDom);
  if (messageDoms.length > 3) {
    const prevDom = messageDoms.shift();
    prevDom && domBox.removeChild(prevDom);
  }
  setTimeout(() => {
    const nPrevDom = dom(`.${classTime}`);
    if (nPrevDom) {
      domById(ID_MESSAGE_BOX)!.removeChild(nPrevDom);
      messageDoms.shift();
    }
  }, t);
};

/**
 * 创建按钮，尺寸小，透明
 * @param {string} innerHTML 按钮内容
 * @param {string} extraCLass 按钮额外类名
 * @returns {IMyElement} 元素
 */
export const createBtnSmallTran = (innerHTML: string, extraCLass: string = ''): IMyElement =>
  domC('button', {
    innerHTML,
    className: `ctz-button ctz-button-small ctz-button-transparent ${extraCLass}`,
    style: 'margin: 0 4px;',
  });
