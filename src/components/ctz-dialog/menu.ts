/** 页面操作 */
import { dom, domA } from '../../tools';

/** 菜单初始化 */
export const initMenu = (domMain: HTMLElement) => {
  const { hash } = location;
  const arrayHash = [...domA('#CTZ_DIALOG_MENU>div', domMain)].map((i: HTMLElement) => i.dataset.href || '');
  const chooseId = arrayHash.find((i) => i === hash || hash.replace(i, '') !== hash);
  fnChangeMenu(dom(`#CTZ_DIALOG_MENU>div[data-href="${chooseId || arrayHash[0]}"]`, domMain) as HTMLElement, domMain);
};

export const onChangeMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const dataHref = target.dataset.href || '';
  if (dataHref) {
    location.hash = dataHref;
    fnChangeMenu(target, document.body);
    return;
  }
};

const fnChangeMenu = (target: HTMLElement, domMain: HTMLElement) => {
  const currentHref = target.dataset.href || '';
  const chooseId = currentHref.replace(/#/, '');
  if (!chooseId) return;
  domA('#CTZ_DIALOG_MENU>div', domMain).forEach((item) => item.classList.remove('target'));
  domA('#CTZ_DIALOG_MAIN>div', domMain).forEach((item) => (item.style.display = chooseId === item.id ? 'block' : 'none'));
  domA('#CTZ_DIALOG_RIGHT_TITLE>div', domMain).forEach((item) => (item.style.display = currentHref === item.dataset.id ? 'block' : 'none'));
  target.classList.add('target');
};

/**
 * 通过初始创建标题，切换路由通过显示隐藏的方式显示
 * innerHTML 等设置内容的方式需要时间长会存在卡顿问题（估计是原网页冗余内容太多，导致数据泄露，时间长了之后会卡顿）
 */
export const createHTMLRightTitle = (domMain: HTMLElement = document.body) => {
  const { hash } = location;
  const arr = [...dom('#CTZ_DIALOG_MENU', domMain)!.childNodes].map((item) => {
    const itemDom = item as HTMLElement;
    return {
      name: itemDom.textContent,
      commit: itemDom.dataset.commit || '',
      href: itemDom.dataset.href || '',
    };
  });
  dom('#CTZ_DIALOG_RIGHT_TITLE', domMain)!.innerHTML = arr
    .map(
      ({ name, commit, href }, index) => `<div data-id="${href}" style="display: ${(!hash && index === 0) || hash === href ? 'block' : 'none'}">${name}<span>${commit}</span></div>`
    )
    .join('');
};
