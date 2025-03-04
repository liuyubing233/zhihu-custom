/** 页面操作 */
import { dom, domA, domById } from '../commons/tools';

/** 菜单初始化 */
export const initMenu = () => {
  const { hash } = location;
  const arrayHash = [...domA('#CTZ_DIALOG_MENU>div')].map((i: any) => i.getAttribute('data-href'));
  const chooseId = arrayHash.find((i) => i === hash || hash.replace(i, '') !== hash);
  fnChangeMenu(dom(`#CTZ_DIALOG_MENU>div[data-href="${chooseId || arrayHash[0]}"]`) as HTMLElement);
};

export const CLASS_OPENED = 'ctz-dropdown-open';

export const onChangeMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.getAttribute('data-href')) {
    const dataHref = target.getAttribute('data-href') || '';
    location.hash = dataHref;
    fnChangeMenu(target as HTMLElement);
    return;
  }
};

const fnChangeMenu = (target: HTMLElement) => {
  const chooseId = (target.getAttribute('data-href') || '').replace(/#/, '');
  if (!chooseId) return;
  domA('#CTZ_DIALOG_MENU>div').forEach((item) => item.classList.remove('target'));
  domA('#CTZ_DIALOG_MAIN>div').forEach((item) => (item.style.display = chooseId === item.id ? 'block' : 'none'));
  target.classList.add('target');
  const commit = target.getAttribute('data-commit') || '';
  domById('CTZ_DIALOG_RIGHT_TITLE')!.innerHTML = `${target.innerText}<span>${commit}</span>`;
};
