import { createHTMLBackgroundSetting } from '../../components/background';
import { BLOCKED_USER_COMMON } from '../../components/blocked-users';
import { initFetchInterceptStatus } from '../../components/fetch-intercept-status-change';
import { createHTMLHiddenConfig } from '../../components/hidden';
import { initMenu } from '../../components/menu';
import { createHTMLTitleICOChange } from '../../components/page-title';
import { createHTMLSizeSetting } from '../../components/size';
import { dom, domA, domC } from '../../tools';
import { IZhihuUserinfo } from '../../types/zhihu/zhihu.type';
import { INNER_HTML } from '../../web-resources';
import { createHTMLFormBoxSwitch, createHTMLFormItem } from './common-html';
import { BASIC_SHOW, DEFAULT_FUNCTION, FILTER_LIST, HIGH_PERFORMANCE, OPTIONS_MAP, SELECT_BASIS_SHOW } from './configs';

/** 添加修改器内元素 */
export const initHTML = () => {
  const nDomMain = domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML });
  // 版本号
  dom('.ctz-version', nDomMain)!.innerText = GM_info.script.version;

  // 添加更多默认设置
  dom('#CTZ_DEFAULT_SELF', nDomMain)!.innerHTML = DEFAULT_FUNCTION.map(({ title, commit }) =>
    createHTMLFormItem({ label: title, value: commit || '', extraClass: 'ctz-form-box-item-vertical' })
  ).join('');

  // 添加基础设置显示修改
  dom('#CTZ_BASIS_SHOW_CONTENT', nDomMain)!.innerHTML = createHTMLFormBoxSwitch(BASIC_SHOW);
  // 高性能
  dom('#CTZ_HIGH_PERFORMANCE', nDomMain)!.innerHTML = createHTMLFormBoxSwitch(HIGH_PERFORMANCE);
  // 列表内容屏蔽
  dom('#CTZ_FILTER_LIST_CONTENT', nDomMain)!.innerHTML = createHTMLFormBoxSwitch(FILTER_LIST);

  // 添加下拉选择
  dom('#CTZ_BASIC_SHOW_SELECT', nDomMain)!.innerHTML = SELECT_BASIS_SHOW.map(({ label, value }) =>
    createHTMLFormItem({ label, value: `<select class="ctz-select" name="${value}"></select>` })
  ).join('');

  // 添加下拉选择内容
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

  dom('#CTZ_BLACKLIST_COMMON', nDomMain)!.innerHTML += createHTMLFormBoxSwitch(BLOCKED_USER_COMMON);
  // echoBlockedContent(nDomMain); // 回填（渲染）黑名单内容应在 echoData 中设置，保证每次打开弹窗都是最新内容
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
