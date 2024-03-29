/** 页面操作 */
import { dom, domA } from '../commons/tools';
import { HEADER } from '../configs';

/** 设置菜单方法 */
export const myMenu = {
  init: function () {
    // 匹配顶部菜单项或者匹配菜单子项
    const { hash } = location;
    const nodeMenuTop = dom('.ctz-menu-top');
    if (!nodeMenuTop) return;
    const chooseId = [...nodeMenuTop.children].map((i: any) => i.hash).find((i) => i === hash || hash.replace(i, '') !== hash);
    if (chooseId) {
      this.click({ target: dom(`a[href="${chooseId}"]`) });
      return;
    }
    this.click({ target: dom(`a[href="${HEADER[0].href}"]`) });
  },
  click: function ({ target }: any) {
    const targetForA = target.tagName === 'A' ? target : target.parentElement;
    if (!(targetForA.hash && targetForA.tagName === 'A')) return;
    const isThis = targetForA.hash.replace(/#/, '');
    if (!isThis) return;
    const nodesA = domA('.ctz-menu-top>a');
    for (let i = 0, len = nodesA.length; i < len; i++) {
      const itemA = nodesA[i];
      itemA.classList.remove('target');
    }
    targetForA.classList.add('target');
    const nodesDiv = domA('.ctz-content>div');
    for (let i = 0, len = nodesDiv.length; i < len; i++) {
      const item = nodesDiv[i];
      item.style.display = isThis === item.id ? 'flex' : 'none';
    }
  },
};
