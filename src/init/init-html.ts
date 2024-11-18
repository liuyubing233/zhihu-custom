import { fetchGetUserinfo } from '../commons/fetch';
import { dom, domById, domC } from '../commons/tools';
import { DEFAULT_FUNCTION, FONT_SIZE_INPUT, FOOTER_HTML, HEADER, HIDDEN_ARRAY, ICO_URL, VERSION_RANGE } from '../configs';
import { BASIC_SHOW_CONTENT } from '../configs/basic-show';
import { addBackgroundSetting } from '../methods/background';
import { myBlack } from '../methods/black';
import { initFetchInterceptStatus } from '../methods/fetch-intercept-status-change';
import { myMenu } from '../methods/menu';
import { store } from '../store';
import { IOptionItem, IRangeItem } from '../types';
import { INNER_HTML } from '../web-resources';

const createHiddenItem = (arrHidden: IOptionItem[][]) => {
  if (!arrHidden || !arrHidden.length) return;
  const itemLabel = (item: IOptionItem[] = []) => {
    return (
      item.map((i) => `<label style="display: inline-flex; algin-item: center;"><input class="ctz-i" name="${i.value}" type="checkbox" value="on" />${i.label}</label>`).join('') +
      `<br>`
    );
  };
  return `<div class="ctz-set-content">${arrHidden.map((i) => itemLabel(i)).join('')}</div>`;
};

/** 加载滑动条输入框 */
const initInputRange = () => {
  const createRangeInnerHTML = (label: string, value: string, min: number, max: number) =>
    `<div class="ctz-flex-wrap ctz-range-${value}">` +
    `${label ? `<div class="ctz-label">${label}</div>` : ''}` +
    `<input class="ctz-i" type="range" min="${min}" max="${max}" name="${value}" style="width: 300px" />` +
    `<span id="${value}" style="margin: 0 8px">0</span>` +
    `<span class="ctz-commit">滑动条范围: ${min} ~ ${max}</span>` +
    `</div>`;

  const versionCallback = (item: IRangeItem, index: number) => {
    return (
      createRangeInnerHTML(item.label, item.value, item.min, item.max) +
      createRangeInnerHTML(item.percentLabel, item.percentValue, item.percentMin, item.percentMax) +
      `<label class="ctz-flex-wrap">` +
      `<span class="ctz-label">${item.percentChooseLabel}</span>` +
      `<input class="ctz-i" name="${item.percentChooseValue}" type="checkbox" value="on" />` +
      `</label>` +
      `<div class="ctz-commit" style="${index < VERSION_RANGE.length - 1 ? 'border-bottom: 1px solid #e0e0e0;' : 'margin:0;'}padding:8px 0;"><b>${item.desc}</b></div>`
    );
  };
  domById('CTZ_VERSION_RANGE_ZHIHU')!.innerHTML = VERSION_RANGE.map(versionCallback).join('');
  domById('CTZ_IMAGE_SIZE_CUSTOM')!.innerHTML = createRangeInnerHTML('', 'zoomImageSize', 0, 1000);
  domById('CTZ_IMAGE_HEIGHT_CUSTOM')!.innerHTML = createRangeInnerHTML('', 'zoomImageHeightSize', 0, 1000);
  domById('CTZ_LIST_VIDEO_SIZE_CUSTOM')!.innerHTML = createRangeInnerHTML('', 'zoomListVideoSize', 0, 1000);
};

/** 加载基础元素及绑定方法 */
export const initHTML = () => {
  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  dom('.ctz-version')!.innerText = `version: ${GM_info.script.version}`;
  dom('.ctz-footer-left')!.innerHTML = FOOTER_HTML;
  dom('.ctz-menu-top')!.innerHTML = HEADER.map(({ href, value }) => `<a href="${href}"><span>${value}</span></a>`).join('');

  addBackgroundSetting();
  initInputRange();

  // 文字大小调节
  domById('CTZ_FONT_SIZE_IN_ZHIHU')!.innerHTML = FONT_SIZE_INPUT.map(
    (item) =>
      `<div class="ctz-flex-wrap">` +
      item
        .map(
          (i, index) =>
            `<span class="ctz-label" style="margin-left: ${index !== 0 ? '24px' : '0'};">${i.label}</span>` +
            `<input type="number" name="${i.value}" class="ctz-i-change" style="width: 80px;" />`
        )
        .join('') +
      `</div>`
  ).join('');

  // 隐藏元素部分
  domById('CTZ_HIDDEN')!.innerHTML =
    `<div class="ctz-content-left">${HIDDEN_ARRAY.map((i) => `<a href="#${i.key}">${i.name}</a>`).join('')}</div>` +
    `<div class="ctz-content-right">${HIDDEN_ARRAY.map(
      (i) => `<div id="${i.key}"><div class="ctz-set-title">${i.name}<span class="ctz-desc">${i.desc}</span></div>${createHiddenItem(i.content)}</div>`
    ).join('')}</div>`;

  // 添加修改网页标题图片
  domById('CTZ_TITLE_ICO')!.innerHTML = Object.keys(ICO_URL)
    .map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`)
    .join('');

  // 添加更多默认设置
  domById('CTZ_DEFAULT_SELF')!.innerHTML = DEFAULT_FUNCTION.map((elementItem, index) => `<div>${index + 1}. ${elementItem}</div>`).join('');

  // 添加基础设置显示修改
  dom('#CTZ_BASIS_SHOW_CONTENT .ctz-set-content')!.innerHTML += BASIC_SHOW_CONTENT.map(
    ({ label, value, needFetch }) =>
      `<label class="ctz-flex-wrap ${needFetch ? 'ctz-fetch-intercept' : ''}">` +
      `<span class="ctz-label">${label}${needFetch ? '<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span>' : ''}</span>` +
      `<input class="ctz-i" name="${value}" type="checkbox" value="on" />` +
      `</label>`
  ).join('');

  initFetchInterceptStatus();
  myBlack.init();
  myMenu.init();

  dom('.ctz-footer-right')!.appendChild(
    domC('a', {
      href: 'https://www.zhihu.com',
      target: '_self',
      innerText: '返回主页',
    })
  );
  domAddUserinfo();
};

const domAddUserinfo = async () => {
  const { setUserinfo } = store;
  const userinfo = await fetchGetUserinfo();
  setUserinfo(userinfo);
  const hrefUser = userinfo.url ? userinfo.url.replace('/api/v4', '') : '';
  if (!hrefUser) return;
  const homeLink = domC('a', {
    href: hrefUser,
    target: '_blank',
    innerText: '前往个人主页>>',
  });
  dom('.ctz-footer-right')!.appendChild(homeLink);
};
