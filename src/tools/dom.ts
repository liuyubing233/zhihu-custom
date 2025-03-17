/** 获取元素 */
export const dom = (n: string, find: HTMLElement | Document = document): HTMLElement | undefined => (find ? (find.querySelector(n) as HTMLElement) : undefined);
/** 使用 Id 获取元素 */
export const domById = (id: string): HTMLElement | undefined => document.getElementById(id) as HTMLElement;
/** 获取所有元素 */
export const domA = (n: string, find: HTMLElement | Document = document): NodeListOf<HTMLElement> => find.querySelectorAll(n);
/**
 * 创建元素
 * attrObjs - className
 */
export const domC = (name: string, attrObjs: Record<string, any>) => {
  const node = document.createElement(name);
  for (let key in attrObjs) {
    // @ts-ignore
    node[key] = attrObjs[key];
  }
  return node;
};

/**
 * 查找父级元素
 * @param node 元素
 * @param attrName 例如 'class'
 * @param attrValue 例如 class 名
 * @returns HTMLElement | undefined
 */
export const domP = (node: any, attrName: string, attrValue: string): HTMLElement | undefined => {
  const nodeP = node.parentElement as HTMLElement;
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
export const fnLog = (...str: string[]) => console.log('%c「知乎修改器」', 'color: green;font-weight: bold;', ...str);

/** 注入样式文件的方法 */
export const fnAppendStyle = (id: string, innerHTML: string) => {
  const element = domById(id);
  element ? (element.innerHTML = innerHTML) : document.head.appendChild(domC('style', { id, type: 'text/css', innerHTML }));
};

/** 元素属性替换 */
export const fnDomReplace = (node: any, attrObjs: Record<string, any>) => {
  if (!node) return;
  for (let key in attrObjs) {
    node[key] = attrObjs[key];
  }
};

/**
 * 创建按钮，font-size: 12px
 * @param {string} innerHTML 按钮内容
 * @param {string} extraCLass 按钮额外类名
 * @returns {HTMLElement} 元素
 */
export const createButtonFontSize12 = (innerHTML: string, extraCLass: string = '', extra: Record<string, any> = {}): HTMLElement =>
  domC('button', {
    innerHTML,
    className: `ctz-button ${extraCLass}`,
    style: 'margin-left: 8px;font-size: 12px;',
    ...extra,
  });
