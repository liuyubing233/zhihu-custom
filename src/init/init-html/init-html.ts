import { dom, domA, domById, domC } from '../../commons/tools';
import { createHTMLBackgroundSetting } from '../../components/background';
import { createHTMLBlockedUsers } from '../../components/blocked-users';
import { initFetchInterceptStatus } from '../../components/fetch-intercept-status-change';
import { createHTMLHiddenConfig } from '../../components/hidden';
import { initMenu } from '../../components/menu';
import { BASIC_SHOW_CONTENT, DE, FONT_SIZE_INPUT, HIGH_PERFORMANCE, ICO_URL, VERSION_RANGE } from '../../configs';
import { OPTIONS_MAP } from '../../configs/select-options';
import { IRangeItem } from '../../types';
import { IZhihuUserinfo } from '../../types/zhihu/zhihu.type';
import { INNER_HTML } from '../../web-resources';
import { createHTMLFormBoxSwitch, createHTMLRange, createHTMLTooltip } from './common-html';

/** 添加修改器内元素 */
export const initHTML = () => {
  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  dom('.ctz-version')!.innerText = GM_info.script.version;

  // 滑动输入条部分 START
  domById('CTZ_VERSION_RANGE_ZHIHU')!.innerHTML = VERSION_RANGE.map(
    (item: IRangeItem) =>
      `<div class="ctz-form-box-item">${
        `<div>${item.label}${createHTMLTooltip(item.desc)}</div>` +
        `<div>${createHTMLRange(item.value, item.min, item.max) + createHTMLRange(item.percentValue, item.percentMin, item.percentMax, '%')}</div>`
      }</div>` +
      `<div class="ctz-form-box-item">${
        `<div>${item.percentChooseLabel}</div>` + `<div><input class="ctz-i ctz-switch" name="${item.percentChooseValue}" type="checkbox" value="on" /></div>`
      }</div>`
  ).join('');

  domById('CTZ_IMAGE_SIZE_CUSTOM')!.innerHTML = `<div>回答和文章图片宽度</div>` + createHTMLRange('zoomImageSize', 0, 1000);
  domById('CTZ_IMAGE_HEIGHT_CUSTOM')!.innerHTML = `<div>图片最大高度</div>` + createHTMLRange('zoomImageHeightSize', 0, 1000);
  domById('CTZ_LIST_VIDEO_SIZE_CUSTOM')!.innerHTML = `<div>列表视频回答宽度</div>` + createHTMLRange('zoomListVideoSize', 0, 1000);
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

  createHTMLBackgroundSetting();
  createHTMLHiddenConfig();
  createHTMLBlockedUsers();
  initMenu();
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
