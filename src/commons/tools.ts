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
  if (!nodeP) {
    return undefined;
  }

  if (!attrName || !attrValue) {
    return nodeP;
  }
  if (nodeP === document.body) {
    return undefined;
  }
  const attrValueList = (nodeP.getAttribute(attrName) || '').split(' ');
  return attrValueList.includes(attrValue) ? nodeP : domP(nodeP, attrName, attrValue);
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
