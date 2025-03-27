/** 页面操作 */
import { dom, domA } from '../../tools';

/** 菜单初始化 */
export const initMenu = (domMain: HTMLElement) => {
  const { hash } = location;
  const arrayHash = [...domA('#CTZ_DIALOG_MENU>div', domMain)].map((i: any) => i.getAttribute('data-href'));
  const chooseId = arrayHash.find((i) => i === hash || hash.replace(i, '') !== hash);
  fnChangeMenu(dom(`#CTZ_DIALOG_MENU>div[data-href="${chooseId || arrayHash[0]}"]`, domMain) as HTMLElement, domMain);
};

export const onChangeMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.getAttribute('data-href')) {
    const dataHref = target.getAttribute('data-href') || '';
    location.hash = dataHref;
    fnChangeMenu(target as HTMLElement, document.body);
    return;
  }
};

const fnChangeMenu = (target: HTMLElement, domMain: HTMLElement) => {
  const chooseId = (target.getAttribute('data-href') || '').replace(/#/, '');
  if (!chooseId) return;
  domA('#CTZ_DIALOG_MENU>div', domMain).forEach((item) => item.classList.remove('target'));
  domA('#CTZ_DIALOG_MAIN>div', domMain).forEach((item) => (item.style.display = chooseId === item.id ? 'block' : 'none'));
  target.classList.add('target');
  const commit = target.getAttribute('data-commit') || '';
  dom('#CTZ_DIALOG_RIGHT_TITLE', domMain)!.innerHTML = `${target.innerText}<span>${commit}</span>`;
};
