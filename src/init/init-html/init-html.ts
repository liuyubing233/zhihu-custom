import { dom, domA, domById, domC } from '../../commons/tools';
import { createHTMLBackgroundSetting } from '../../components/background';
import { createHTMLBlockedUsers } from '../../components/blocked-users';
import { initFetchInterceptStatus } from '../../components/fetch-intercept-status-change';
import { createHTMLHiddenConfig } from '../../components/hidden';
import { initMenu } from '../../components/menu';
import { createHTMLSizeSetting } from '../../components/version';
import { BASIC_SHOW_CONTENT, DE, HIGH_PERFORMANCE, ICO_URL } from '../../configs';
import { OPTIONS_MAP } from '../../configs/select-options';
import { IZhihuUserinfo } from '../../types/zhihu/zhihu.type';
import { INNER_HTML } from '../../web-resources';
import { createHTMLFormBoxSwitch } from './common-html';

/** 添加修改器内元素 */
export const initHTML = () => {
  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  dom('.ctz-version')!.innerText = GM_info.script.version;

  // 添加修改网页标题图片
  domById('CTZ_TITLE_ICO')!.innerHTML = Object.keys(ICO_URL)
    .map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`)
    .join('');

  // 添加更多默认设置
  domById('CTZ_DEFAULT_SELF')!.innerHTML = DE.map(
    ({ title, commit }) =>
      `<div class="ctz-form-box-item ctz-form-box-item-vertical">${`<div>${title}</div>` + `<div style="font-size: 12px;color:#999;">${commit || ''}</div>`}</div>`
  ).join('');

  // 添加基础设置显示修改
  dom('#CTZ_BASIS_SHOW_CONTENT')!.innerHTML += createHTMLFormBoxSwitch(BASIC_SHOW_CONTENT);
  // 高性能
  dom('#CTZ_HIGH_PERFORMANCE')!.innerHTML += createHTMLFormBoxSwitch(HIGH_PERFORMANCE);

  // 添加 select 选择框内容
  domA('.ctz-select').forEach((item) => {
    const name = (item as HTMLSelectElement).name;
    if (OPTIONS_MAP[name]) {
      item.innerHTML = OPTIONS_MAP[name].map(({ value, label }) => `<option value="${value}">${label}</option>`).join('');
    }
  });

  initFetchInterceptStatus();
  initMenu();
  createHTMLSizeSetting();
  createHTMLBackgroundSetting();
  createHTMLHiddenConfig();
  createHTMLBlockedUsers();
};

/** 添加个人主页跳转 */
export const appendHomeLink = (userinfo: IZhihuUserinfo) => {
  if (dom('.ctz-home-link')) return;
  const hrefUser = userinfo.url ? userinfo.url.replace('/api/v4', '') : '';
  if (!hrefUser) return;
  dom('.ctz-to-zhihu')!.appendChild(
    domC('a', {
      href: hrefUser,
      target: '_blank',
      innerText: '前往个人主页',
      className: 'ctz-home-link',
    })
  );
};
