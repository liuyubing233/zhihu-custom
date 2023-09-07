import { dom, domById, domC } from '../commons/tools';
import { DEFAULT_FUNCTION, FOOTER_HTML, HIDDEN_DIRECTION, ICO_URL } from '../configs';
import { addBackgroundElements } from '../methods/background';
import { myBlack } from '../methods/black';
import { myMenu } from '../methods/menu';
import { store } from '../store';
import { INNER_HTML } from '../web-resources';

/** 加载基础元素及绑定方法 */
export const initHTML = () => {
  const { getUserinfo } = store;

  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  myBlack.init();
  myMenu.init();

  const nodeCTZVersion = dom('.ctz-version');
  nodeCTZVersion && (nodeCTZVersion.innerText = `version: ${GM_info.script.version}`);

  // 添加弹窗底部信息
  const nodeCTZFooter = dom('.ctz-footer');
  nodeCTZFooter && (nodeCTZFooter.innerHTML = FOOTER_HTML);

  addBackgroundElements();

  for (let key in HIDDEN_DIRECTION) {
    const arrHidden = HIDDEN_DIRECTION[key];
    if (!arrHidden || !arrHidden.length) continue;
    const nodeItem = dom(`#${key}_HIDDEN>.ctz-set-content`);
    nodeItem &&
      (nodeItem.innerHTML = arrHidden
        .map(
          (i) =>
            `${i.map(({ label, value }) => `<label><input class="ctz-i" name="${value}" type="checkbox" value="on" />${label}</label>`).join('')}` +
            `<span style="width: 100%; margin: 8px 0; background: #ddd; height: 1px; display:block"></span>`
        )
        .join(''));
  }

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
