/** 获取元素 */
export const dom = (n) => document.querySelector(n);

/** 使用 Id 获取元素 */
export const domById = (id) => document.getElementById(id);

/** 获取所有元素 */
export const domA = (n) => document.querySelectorAll(n);

/** 创建元素 */
export const domC = (name, attrObjs) => {
  const node = document.createElement(name);
  for (let key in attrObjs) {
    node[key] = attrObjs[key];
  }
  return node;
};

/** 查找父级元素 */
export const domP = (node, attrName, attrValue) => {
  const nodeP = node.parentElement;
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
export const fnReturnStr = (str, isHave = false, strFalse = '') => (isHave ? str : strFalse);

/** 带前缀的 log */
export const fnLog = (...str) => console.log('%c「修改器」', 'color: green;font-weight: bold;', ...str);

/** 注入样式文件的方法 */
export const fnInitDomStyle = (id, innerHTML) => {
  const element = domById(id);
  element ? (element.innerHTML = innerHTML) : document.head.appendChild(domC('style', { id, type: 'text/css', innerHTML }));
};

/** 元素替换内容 */
export const fnDomReplace = (node, attrObjs) => {
  if (!node) return;
  for (let key in attrObjs) {
    node[key] = attrObjs[key];
  }
};

/** 节流, 使用时 fn 需要为 function () {} */
export function throttle(fn, time = 300) {
  let tout = null;
  return function () {
    if (tout) return;
    tout = setTimeout(() => {
      tout = null;
      fn.apply(this, arguments);
    }, time);
  };
}
