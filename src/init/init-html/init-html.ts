import { createHTMLBackgroundSetting } from '../../components/background';
import { BLOCKED_USER_COMMON } from '../../components/black-list';
import { createHTMLRightTitle, initMenu } from '../../components/ctz-dialog';
import { initFetchInterceptStatus } from '../../components/fetch-intercept-status-change';
import { createHTMLHiddenConfig } from '../../components/hidden';
import { createHTMLNotInterestedList } from '../../components/not-interested';
import { createHTMLTitleICOChange } from '../../components/page-title';
import { createHTMLMySelect } from '../../components/select';
import { createHTMLSizeSetting } from '../../components/size';
import { store } from '../../store';
import { dom, domC } from '../../tools';
import { INNER_HTML } from '../../web-resources';
import { createHTMLFormBoxSwitch, createHTMLFormItem } from './common-html';
import { BASIC_SHOW, DEFAULT_FUNCTION, FILTER_LIST, HIGH_PERFORMANCE } from './configs';

/** 添加修改器内元素 */
export const initHTML = () => {
  const nDomMain = domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML });
  // 版本号
  dom('.ctz-version', nDomMain)!.innerText = 'version: ' + GM_info.script.version;

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

  initFetchInterceptStatus(nDomMain);
  initMenu(nDomMain);
  createHTMLTitleICOChange(nDomMain);
  createHTMLSizeSetting(nDomMain);
  createHTMLBackgroundSetting(nDomMain);
  createHTMLHiddenConfig(nDomMain);
  createHTMLMySelect(nDomMain);
  createHTMLRightTitle(nDomMain);
  createHTMLNotInterestedList()

  dom('#CTZ_BLACKLIST_COMMON', nDomMain)!.innerHTML += createHTMLFormBoxSwitch(BLOCKED_USER_COMMON);
  // echoBlockedContent(nDomMain); // 回填（渲染）黑名单内容应在 echoData 中设置，保证每次打开弹窗都是最新内容
  appendHomeLink(nDomMain);
  document.body.appendChild(nDomMain);
};

/** 添加个人主页跳转 */
export const appendHomeLink = (domMain: HTMLElement = document.body) => {
  const userInfo = store.getUserInfo();
  const boxToZhihu = dom('.ctz-to-zhihu', domMain);
  if (dom('.ctz-home-link') || !userInfo || !boxToZhihu) return;
  const hrefUser = userInfo.url ? userInfo.url.replace('/api/v4', '') : '';
  if (!hrefUser) return;
  boxToZhihu.appendChild(
    domC('a', {
      href: hrefUser,
      target: '_blank',
      innerText: '前往个人主页',
      className: 'ctz-home-link ctz-button',
      style: 'width: 100px;',
    })
  );
};
