/** 页面操作 */
import { dom, domA, domById } from '../commons/tools';
// import { HEADER } from '../configs';

/** 菜单初始化 */
export const initMenu = () => {
  const { hash } = location;
  const arrayHash = [...domA('#CTZ_DIALOG_MENU>div')].map((i: any) => i.getAttribute('data-href'))
  const chooseId = arrayHash.find((i) => i === hash || hash.replace(i, '') !== hash);
  fnChangeMenu(dom(`#CTZ_DIALOG_MENU>div[data-href="${chooseId || arrayHash[0]}"]`) as HTMLElement);
};

export const CLASS_OPENED = 'ctz-dropdown-open';

export const onChangeMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  // if (target.classList.contains('ctz-dropdown-icon')) {
  //   // 展开收起菜单
  //   const doOpen = !target.classList.contains(CLASS_OPENED); // 是否是展开操作
  //   domA('.ctz-dropdown-icon').forEach((item) => item.classList.remove(CLASS_OPENED));
  //   doOpen && target.classList.add(CLASS_OPENED); // 这个方法不能直接用上面的替换，doOpen保存了批量更改之前的的状态
  //   return;
  // }

  // if (target.classList.contains('ctz-menu-choose')) {
  //   // 点击主菜单
  //   const dataHref = target.parentElement!.getAttribute('data-href') || '';
  //   location.hash = dataHref;
  //   fnChangeMenu(target.parentElement as HTMLElement);
  //   return;
  // }

  if (target.getAttribute('data-href')) {
    const dataHref = target.getAttribute('data-href') || '';
    location.hash = dataHref;
    fnChangeMenu(target as HTMLElement);
    return;
  }

  // if (target.nodeName === 'A') {
  //   // 点击子菜单
  //   // target.parentElement!.parentElement!.querySelector('.ctz-dropdown-icon')!.classList.remove(CLASS_OPENED);
  //   const chooseHref = (target as HTMLAnchorElement).hash;
  //   location.hash = chooseHref;
  //   initMenu();
  //   return;
  // }
};

const fnChangeMenu = (target: HTMLElement) => {
  const chooseId = (target.getAttribute('data-href') || '').replace(/#/, '');
  if (!chooseId) return;
  domA('#CTZ_DIALOG_MENU>div').forEach((item) => item.classList.remove('target'));
  domA('#CTZ_DIALOG_MAIN>div').forEach((item) => (item.style.display = chooseId === item.id ? 'block' : 'none'));
  target.classList.add('target');
  domById('CTZ_DIALOG_RIGHT_TITLE')!.innerText = target.innerText
};
