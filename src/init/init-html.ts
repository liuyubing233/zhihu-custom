import { dom, domById, domC } from '../commons/tools';
import { BASIC_SHOW_CONTENT, DE, FONT_SIZE_INPUT, HIDDEN_ARRAY, HIGH_PERFORMANCE, ICO_URL, ICommonContent, VERSION_RANGE } from '../configs';
import { addBackgroundSetting } from '../methods/background';
import { myBlack } from '../methods/black';
import { initFetchInterceptStatus } from '../methods/fetch-intercept-status-change';
import { initMenu } from '../methods/menu';
import { IOptionItem, IRangeItem, IZhihuUserinfo } from '../types';
import { INNER_HTML } from '../web-resources';

const commonCheckbox = (v: string) => `<input class="ctz-i" name="${v}" type="checkbox" value="on" />`;
const commonLabel = (l?: string) => (l ? `<span class="ctz-label">${l}</span>` : '');

const createHiddenItem = (arrHidden: IOptionItem[][]) => {
  if (!arrHidden || !arrHidden.length) return '';
  return `<div class="ctz-checkbox-group">${arrHidden
    .map((item) => item.map((i) => `<label style="display: inline-flex;" class="ctz-checkbox">${commonCheckbox(i.value)}<div>${i.label}</div></label>`).join(''))
    .join('<br>')}</div>`;
};

/** 滑动输入条html */
const rangeHTML = (l: string, v: string, min: number, max: number) =>
  `<div class="ctz-flex-wrap ctz-range-${v}">` +
  commonLabel(l) +
  `<input class="ctz-i" type="range" min="${min}" max="${max}" name="${v}" style="width: 300px" />` +
  `<span id="${v}" style="margin: 0 8px">0</span>` +
  `<span class="ctz-commit">设置区间: ${min} ~ ${max}</span>` +
  `</div>`;

/** 通用选项html */
const commonLabelCheckbox = (con: ICommonContent[]) =>
  con
    .map(
      ({ label, value, needFetch }) =>
        `<label class="ctz-checkbox ${needFetch ? 'ctz-fetch-intercept' : ''}">` +
        `<input class="ctz-i" name="${value}" type="checkbox" value="on" />` +
        `<div>${label + (needFetch ? '<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span>' : '')}</div>` +
        `</label>`
    )
    .join('');

/** 加载基础元素及绑定方法 */
export const initHTML = () => {
  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  dom('.ctz-version')!.innerText = GM_info.script.version;

  addBackgroundSetting();

  // 滑动输入条部分 START
  domById('CTZ_VERSION_RANGE_ZHIHU')!.innerHTML = VERSION_RANGE.map(
    (item: IRangeItem, index: number) =>
      rangeHTML(item.label, item.value, item.min, item.max) +
      rangeHTML(item.percentLabel, item.percentValue, item.percentMin, item.percentMax) +
      `<div class="ctz-range-commit">` +
      commonLabelCheckbox([{ label: item.percentChooseLabel, value: item.percentChooseValue }]) +
      `<span class="ctz-commit">${item.desc}</span></div>`
  ).join('<div class="ctz-range-line"></div>');
  domById('CTZ_IMAGE_SIZE_CUSTOM')!.innerHTML = rangeHTML('', 'zoomImageSize', 0, 1000);
  domById('CTZ_IMAGE_HEIGHT_CUSTOM')!.innerHTML = rangeHTML('', 'zoomImageHeightSize', 0, 1000);
  domById('CTZ_LIST_VIDEO_SIZE_CUSTOM')!.innerHTML = rangeHTML('', 'zoomListVideoSize', 0, 1000);
  // 滑动输入条部分 END

  // 文字大小调节
  domById('CTZ_FONT_SIZE_IN_ZHIHU')!.innerHTML = FONT_SIZE_INPUT.map(
    (item) =>
      `<div class="ctz-flex-wrap">` +
      item.map((i) => commonLabel(i.label) + `<input type="number" name="${i.value}" class="ctz-i-change" style="width: 80px;" />`).join('') +
      `</div>`
  ).join('');

  // 隐藏元素部分
  dom('[data-href="#CTZ_HIDDEN"] .ctz-dropdown')!.innerHTML = HIDDEN_ARRAY.map((i) => `<a href="#${i.key}">${i.name}</a>`).join('');
  domById('CTZ_HIDDEN')!.innerHTML = HIDDEN_ARRAY.map(
    (i) => `<div id="${i.key}"><div class="ctz-title">${i.name}<span>${i.desc}</span></div>${createHiddenItem(i.content)}</div>`
  ).join('');

  // 添加修改网页标题图片
  domById('CTZ_TITLE_ICO')!.innerHTML = Object.keys(ICO_URL)
    .map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`)
    .join('');

  // 添加更多默认设置
  domById('CTZ_DEFAULT_SELF')!.innerHTML = DE.map(
    ({ title, commit }, index) => `<div class="ctz-title">${title}</div>${commit ? `<div class="ctz-commit">${commit}</div>` : ''}`
  ).join('');

  // 添加基础设置显示修改
  dom('#CTZ_BASIS_SHOW_CONTENT .ctz-set-content')!.innerHTML += commonLabelCheckbox(BASIC_SHOW_CONTENT);
  // 高性能
  dom('#CTZ_BASIS_HIGH_PERFORMANCE .ctz-set-content')!.innerHTML += commonLabelCheckbox(HIGH_PERFORMANCE);

  initFetchInterceptStatus();
  myBlack.init();
  initMenu();
};

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
