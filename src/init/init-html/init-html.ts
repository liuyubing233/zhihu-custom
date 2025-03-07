import { createHTMLBackgroundSetting } from '../../components/background';
import { createHTMLBlockedUsers } from '../../components/blocked-users';
import { initFetchInterceptStatus } from '../../components/fetch-intercept-status-change';
import { createHTMLHiddenConfig } from '../../components/hidden';
import { initMenu } from '../../components/menu';
import { createHTMLTitleICOChange } from '../../components/page-title';
import { createHTMLSizeSetting } from '../../components/size';
import { dom, domA, domC } from '../../tools';
import { IZhihuUserinfo } from '../../types/zhihu/zhihu.type';
import { INNER_HTML } from '../../web-resources';
import { createHTMLFormBoxSwitch } from './common-html';
import { BASIC_SHOW, DEFAULT_FUNCTION, FILTER_LIST, HIGH_PERFORMANCE, OPTIONS_MAP } from './configs';

/** 添加修改器内元素 */
export const initHTML = () => {
  const nDomMain = domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML });
  // 版本号
  dom('.ctz-version', nDomMain)!.innerText = GM_info.script.version;

  // 添加更多默认设置
  dom('#CTZ_DEFAULT_SELF', nDomMain)!.innerHTML = DEFAULT_FUNCTION.map(
    ({ title, commit }) => `<div class="ctz-form-box-item ctz-form-box-item-vertical"><div>${title}</div><div style="font-size: 12px;color:#999;">${commit || ''}</div></div>`
  ).join('');

  // 添加基础设置显示修改
  dom('#CTZ_BASIS_SHOW_CONTENT', nDomMain)!.innerHTML = createHTMLFormBoxSwitch(BASIC_SHOW);
  // 高性能
  dom('#CTZ_HIGH_PERFORMANCE', nDomMain)!.innerHTML = createHTMLFormBoxSwitch(HIGH_PERFORMANCE);
  // 列表内容屏蔽
  dom('#CTZ_FILTER_LIST_CONTENT', nDomMain)!.innerHTML = createHTMLFormBoxSwitch(FILTER_LIST);

  // 添加 select 选择框内容
  domA('.ctz-select', nDomMain).forEach((item) => {
    const name = (item as HTMLSelectElement).name;
    if (OPTIONS_MAP[name]) {
      item.innerHTML = OPTIONS_MAP[name].map(({ value, label }) => `<option value="${value}">${label}</option>`).join('');
    }
  });

  initFetchInterceptStatus(nDomMain);
  initMenu(nDomMain);
  createHTMLTitleICOChange(nDomMain);
  createHTMLSizeSetting(nDomMain);
  createHTMLBackgroundSetting(nDomMain);
  createHTMLHiddenConfig(nDomMain);
  createHTMLBlockedUsers(nDomMain);

  document.body.appendChild(nDomMain);
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
