import { dom, domById, domC } from '../commons/tools';
import { DEFAULT_FUNCTION, FOOTER_HTML, HEADER, HIDDEN_ARRAY, ICO_URL } from '../configs';
import { addBackgroundElements } from '../methods/background';
import { myBlack } from '../methods/black';
import { myMenu } from '../methods/menu';
import { store } from '../store';
import { IContentItem } from '../types';
import { INNER_HTML } from '../web-resources';

const createHiddenItemLabel = (item: IContentItem[] = []) => {
  return (
    item
      .map(({ label, value }) => `<label style="display: inline-block;"><input class="ctz-i" name="${value}" type="checkbox" value="on" />${label}</label>`)
      .join('') + `<br>`
  );
};

const createHiddenItem = (arrHidden: IContentItem[][]) => {
  if (!arrHidden || !arrHidden.length) return;
  return `<div class="ctz-set-content">${arrHidden.map((i) => createHiddenItemLabel(i)).join('')}</div>`;
};

/** 加载基础元素及绑定方法 */
export const initHTML = () => {
  const { getUserinfo } = store;
  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  dom('.ctz-version')!.innerText = `version: ${GM_info.script.version}`;
  dom('.ctz-footer')!.innerHTML = FOOTER_HTML;
  dom('.ctz-menu-top')!.innerHTML = HEADER.map(({ href, value }) => `<a href="${href}"><span>${value}</span></a>`).join('');

  myBlack.init();
  myMenu.init();
  addBackgroundElements();

  domById('CTZ_HIDDEN')!.innerHTML =
    `<div class="ctz-content-left">${HIDDEN_ARRAY.map((i) => `<a href="#${i.key}">${i.name}</a>`).join('')}</div>` +
    `<div class="ctz-content-right">${HIDDEN_ARRAY.map(
      (i) => `<div id="${i.key}"><div class="ctz-set-title">${i.name}<span class="ctz-desc">${i.desc}</span></div>${createHiddenItem(i.content)}</div>`
    ).join('')}</div>`;

  // 添加修改网页标题图片
  const nodeCTZIcon = domById('CTZ_TITLE_ICO');
  nodeCTZIcon &&
    (nodeCTZIcon.innerHTML = Object.keys(ICO_URL)
      .map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`)
      .join(''));

  // 添加更多默认设置
  const nodeCTZSelf = domById('CTZ_DEFAULT_SELF');
  nodeCTZSelf && (nodeCTZSelf.innerHTML = DEFAULT_FUNCTION.map((elementItem, index) => `<div>${index + 1}. ${elementItem}</div>`).join(''));

  // 保存个人主页位置
  const userinfo = getUserinfo();
  if (!userinfo) return;
  const hrefUser = userinfo.url ? userinfo.url.replace('/api/v4', '') : '';
  if (!hrefUser) return;
  const homeLink = domC('a', {
    href: hrefUser,
    target: '_blank',
    innerText: '个人主页',
  });
  const nodeCTZLeft = dom('#CTZ_BASIS .ctz-content-left');
  nodeCTZLeft && nodeCTZLeft.appendChild(homeLink);
};
