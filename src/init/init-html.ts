import { dom, domById, domC } from '../commons/tools';
import { BASIC_SHOW_CONTENT, DE, FONT_SIZE_INPUT, HIDDEN_ARRAY, HIGH_PERFORMANCE, ICO_URL, ICommonContent, VERSION_RANGE } from '../configs';
import { addBackgroundSetting } from '../methods/background';
import { initBlackList } from '../methods/black';
import { initFetchInterceptStatus } from '../methods/fetch-intercept-status-change';
import { initMenu } from '../methods/menu';
import { IRangeItem, IZhihuUserinfo } from '../types';
import { INNER_HTML } from '../web-resources';

const tooltipHTML = (value: string) => `<span class="ctz-tooltip"><span>?</span><span>${value}</span></span>`;

const range = (v: string, min: number, max: number, unit = '') =>
  `<div class="ctz-flex-wrap ctz-range-${v}">${
    `<span style="font-size: 12px;margin-right: 8px;">当前：<span id="${v}">0</span>${unit}</span>` +
    `<span style="margin-right: 2px;color: #757575;font-size: 12px;">${min}${unit}</span>` +
    `<input class="ctz-i" type="range" min="${min}" max="${max}" name="${v}" style="width: 200px" />` +
    `<span style="margin-left: 2px;color: #757575;font-size: 12px;">${max}${unit}</span>`
  }</div>`;

const commonFormBoxItem = (con: ICommonContent[][]) =>
  con
    .map(
      (item) =>
        `<div class="ctz-form-box">${item
          .map(
            ({ label, value, needFetch, tooltip }) =>
              `<div class="ctz-form-box-item ${needFetch ? 'ctz-fetch-intercept' : ''}">${
                `<div>${label + (needFetch ? '<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span>' : '') + (tooltip ? tooltipHTML(tooltip) : '')}</div>` +
                `<div><input class="ctz-i ctz-switch" name="${value}" type="checkbox" value="on" /></div>`
              }</div>`
          )
          .join('')}</div>`
    )
    .join('');

/** 加载基础元素及绑定方法 */
export const initHTML = () => {
  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  dom('.ctz-version')!.innerText = GM_info.script.version;

  addBackgroundSetting();

  // 滑动输入条部分 START
  domById('CTZ_VERSION_RANGE_ZHIHU')!.innerHTML = VERSION_RANGE.map(
    (item: IRangeItem) =>
      `<div class="ctz-form-box-item">${
        `<div>${item.label}${tooltipHTML(item.desc)}</div>` +
        `<div>${range(item.value, item.min, item.max) + range(item.percentValue, item.percentMin, item.percentMax, '%')}</div>`
      }</div>` +
      `<div class="ctz-form-box-item">${
        `<div>${item.percentChooseLabel}</div>` + `<div><input class="ctz-i ctz-switch" name="${item.percentChooseValue}" type="checkbox" value="on" /></div>`
      }</div>`
  ).join('');

  domById('CTZ_IMAGE_SIZE_CUSTOM')!.innerHTML = `<div>回答和文章图片宽度</div>` + range('zoomImageSize', 0, 1000);
  domById('CTZ_IMAGE_HEIGHT_CUSTOM')!.innerHTML = `<div>图片最大高度</div>` + range('zoomImageHeightSize', 0, 1000);
  domById('CTZ_LIST_VIDEO_SIZE_CUSTOM')!.innerHTML = `<div>列表视频回答宽度</div>` + range('zoomListVideoSize', 0, 1000);
  // 滑动输入条部分 END

  // 文字大小调节
  domById('CTZ_FONT_SIZE_IN_ZHIHU')!.innerHTML = FONT_SIZE_INPUT.map(
    (item) =>
      `<div class="ctz-form-box-item">${
        `<div>${item.label}</div>` +
        `<div>${
          `<input type="number" name="${item.value}" class="ctz-i-change" style="width: 100px;margin-right: 8px;" placeholder="例：18" />` +
          `<button class="ctz-button ctz-reset-font-size" name="reset-${item.value}">↺</button>`
        }</div>`
      }</div>`
  ).join('');

  // 隐藏元素部分
  domById('CTZ_HIDDEN')!.innerHTML = HIDDEN_ARRAY.map(
    (item) => (item.name ? `<div class="ctz-title">${item.name}<span>${item.desc}</span></div>` : '') + commonFormBoxItem(item.content)
  ).join('');

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
  dom('#CTZ_BASIS_SHOW_CONTENT')!.innerHTML += commonFormBoxItem(BASIC_SHOW_CONTENT);
  // 高性能
  dom('#CTZ_HIGH_PERFORMANCE')!.innerHTML += commonFormBoxItem(HIGH_PERFORMANCE);

  initFetchInterceptStatus();
  initBlackList()
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
