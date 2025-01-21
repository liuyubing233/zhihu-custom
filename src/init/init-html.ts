import { dom, domById, domC } from '../commons/tools';
import { BASIC_SHOW_CONTENT, DEFAULT_FUNCTION, FONT_SIZE_INPUT, HIDDEN_ARRAY, HIGH_PERFORMANCE, ICO_URL, ICommonContent, VERSION_RANGE } from '../configs';
import { addBackgroundSetting } from '../methods/background';
import { myBlack } from '../methods/black';
import { initFetchInterceptStatus } from '../methods/fetch-intercept-status-change';
import { initMenu } from '../methods/menu';
import { IOptionItem, IRangeItem, IZhihuUserinfo } from '../types';
import { INNER_HTML } from '../web-resources';

const commonCheckbox = (v: string) => `<input class="ctz-i" name="${v}" type="checkbox" value="on" />`;
const commonLabel = (l?: string) => (l ? `<span class="ctz-label">${l}</span>` : '');
const commonText = (l?: string) => (l ? `<span class="ctz-checkbox-text">${l}</span>` : '');

const createHiddenItem = (arrHidden: IOptionItem[][]) => {
  if (!arrHidden || !arrHidden.length) return '';
  return `<div class="ctz-set-content">${arrHidden
    .map((item) => item.map((i) => `<label style="display: inline-flex; algin-item: center;">${commonCheckbox(i.value)}${i.label}</label>`).join(''))
    .join('<br>')}</div>`;
};

/** 滑动输入条html */
const rangeHTML = (l: string, v: string, min: number, max: number) =>
  `<div class="ctz-flex-wrap ctz-range-${v}">` +
  commonLabel(l) +
  `<input class="ctz-i" type="range" min="${min}" max="${max}" name="${v}" style="width: 300px" />` +
  `<span id="${v}" style="margin: 0 8px">0</span>` +
  `<span class="ctz-commit">滑动条范围: ${min} ~ ${max}</span>` +
  `</div>`;

/** 通用选项html */
const commonLabelCheckbox = (con: ICommonContent[]) =>
  con
    .map(
      ({ label, value, needFetch }) =>
        `<label class="ctz-flex-wrap ${needFetch ? 'ctz-fetch-intercept' : ''}">` +
        commonCheckbox(value) +
        commonText(label + (needFetch ? '<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span>' : '')) +
        `</label>`
    )
    .join('');

/** 加载基础元素及绑定方法 */
export const initHTML = () => {
  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  dom('.ctz-version')!.innerText = GM_info.script.version;
  // dom('.ctz-version')!.innerText = `版本号: ${GM_info.script.version}`;
  // dom('.ctz-footer-left')!.innerHTML = FOOTER_HTML;
  // dom('.ctz-menu-top')!.innerHTML = HEADER.map(({ href, value }) => `<a href="${href}"><span>${value}</span></a>`).join('');

  addBackgroundSetting();

  // 滑动输入条部分 START
  domById('CTZ_VERSION_RANGE_ZHIHU')!.innerHTML = VERSION_RANGE.map(
    (item: IRangeItem, index: number) =>
      rangeHTML(item.label, item.value, item.min, item.max) +
      rangeHTML(item.percentLabel, item.percentValue, item.percentMin, item.percentMax) +
      commonLabelCheckbox([{ label: item.percentChooseLabel, value: item.percentChooseValue }]) +
      `<div class="ctz-commit" style="${index < VERSION_RANGE.length - 1 ? 'border-bottom: 1px solid #e0e0e0;' : 'margin:0;'}padding:8px 0;"><b>${item.desc}</b></div>`
  ).join('');
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
  domById('CTZ_HIDDEN')!.innerHTML = HIDDEN_ARRAY.map(
    (i) => `<div id="${i.key}"><div class="ctz-title">${i.name}<span>${i.desc}</span></div>${createHiddenItem(i.content)}</div>`
  ).join('');
  dom('[data-href="#CTZ_HIDDEN"] .ctz-dropdown')!.innerHTML = HIDDEN_ARRAY.map((i) => `<a href="#${i.key}">${i.name}</a>`).join('');
  // `<div class="ctz-content-left">${HIDDEN_ARRAY.map((i) => `<a href="#${i.key}">${i.name}</a>`).join('')}</div>` +
  // `<div class="ctz-content-right"></div>`;

  // 添加修改网页标题图片
  domById('CTZ_TITLE_ICO')!.innerHTML = Object.keys(ICO_URL)
    .map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`)
    .join('');

  // 添加更多默认设置
  domById('CTZ_DEFAULT_SELF')!.innerHTML = DEFAULT_FUNCTION.map((elementItem, index) => `<div>${index + 1}. ${elementItem}</div>`).join('');

  // 添加基础设置显示修改
  dom('#CTZ_BASIS_SHOW_CONTENT .ctz-set-content')!.innerHTML += commonLabelCheckbox(BASIC_SHOW_CONTENT);
  // 高性能
  dom('#CTZ_BASIS_HIGH_PERFORMANCE .ctz-set-content')!.innerHTML += commonLabelCheckbox(HIGH_PERFORMANCE);

  initFetchInterceptStatus();
  myBlack.init();
  // myMenu.init();
  // myMenuDrawer.init();
  initMenu();

  // dom('.ctz-footer-right')!.appendChild(
  //   domC('a', {
  //     href: 'https://www.zhihu.com',
  //     target: '_self',
  //     innerText: '返回主页',
  //   })
  // );
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
