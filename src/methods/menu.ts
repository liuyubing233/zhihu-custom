/** 页面操作 */
import { dom, domA } from '../commons/tools';

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
    this.click({ target: dom('a[href="#CTZ_BASIS"]') });
  },
  click: function ({ target }: any) {
    if (!(target.hash && target.tagName === 'A')) return;
    const isThis = target.hash.replace(/#/, '');
    if (!isThis) return;
    domA('.ctz-menu-top>a').forEach((itemA) => itemA.classList.remove('target'));
    target.classList.add('target');
    domA('.ctz-content>div').forEach((item) => (item.style.display = isThis === item.id ? 'flex' : 'none'));
  },
};
