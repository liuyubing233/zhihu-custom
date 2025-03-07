import { createHTMLRange, createHTMLTooltip } from '../../init/init-html/common-html';
import { dom } from '../../tools';
import { IOptionItem } from '../../types';

/**
 * 尺寸设置部分元素添加
 * 页面宽度、字体大小、图片高度
 */
export const createHTMLSizeSetting = (domMain: HTMLElement) => {
  // 滑动输入条部分 START
  dom('#CTZ_VERSION_RANGE_ZHIHU', domMain)!.innerHTML = VERSION_RANGE_HAVE_PERCENT.map(
    (item) =>
      `<div class="ctz-form-box-item">${
        `<div>${item.label}${createHTMLTooltip('最小显示宽度为600像素，设置低于此值将按照600像素显示')}</div>` +
        `<div>${createHTMLRange(item.value, VERSION_MIN_WIDTH, 1500) + createHTMLRange(`${item.value}Percent`, 20, 100, '%')}</div>`
      }</div>` +
      `<div class="ctz-form-box-item">${
        `<div>${item.label}使用百分比设置</div>` + `<div><input class="ctz-i ctz-switch" name="${item.value}IsPercent" type="checkbox" value="on" /></div>`
      }</div>`
  ).join('');

  dom('#CTZ_IMAGE_SIZE_CUSTOM', domMain)!.innerHTML = `<div>回答和文章图片宽度</div>` + createHTMLRange('zoomImageSize', 0, 1000);
  dom('#CTZ_IMAGE_HEIGHT_CUSTOM', domMain)!.innerHTML = `<div>图片最大高度</div>` + createHTMLRange('zoomImageHeightSize', 0, 1000);
  dom('#CTZ_LIST_VIDEO_SIZE_CUSTOM', domMain)!.innerHTML = `<div>列表视频回答宽度</div>` + createHTMLRange('zoomListVideoSize', 0, 1000);
  // 滑动输入条部分 END

  // 文字大小调节
  dom('#CTZ_FONT_SIZE_IN_ZHIHU', domMain)!.innerHTML = FONT_SIZE_INPUT.map(
    (item) =>
      `<div class="ctz-form-box-item">${
        `<div>${item.label}</div>` +
        `<div>${
          `<input type="number" name="${item.value}" class="ctz-i-change" style="width: 100px;margin-right: 8px;" placeholder="例：18" />` +
          `<button class="ctz-button ctz-reset-font-size" name="reset-${item.value}">↺</button>`
        }</div>`
      }</div>`
  ).join('');
};

export const FONT_SIZE_INPUT: IOptionItem[] = [
  { value: 'fontSizeForListTitle', label: '列表标题文字大小' },
  { value: 'fontSizeForList', label: '列表内容文字大小' },
  { value: 'fontSizeForAnswerTitle', label: '回答标题文字大小' },
  { value: 'fontSizeForAnswer', label: '回答内容文字大小' },
  { value: 'fontSizeForArticleTitle', label: '文章标题文字大小' },
  { value: 'fontSizeForArticle', label: '文章内容文字大小' },
  { value: 'contentLineHeight', label: '内容行高' },
];

/** 版心最小宽度 */
export const VERSION_MIN_WIDTH = 600;
/** 版心宽度 */
export const VERSION_RANGE_HAVE_PERCENT: IOptionItem[] = [
  { label: '列表宽度', value: 'versionHome' },
  { label: '回答宽度', value: 'versionAnswer' },
  { label: '文章宽度', value: 'versionArticle' },
  { label: '用户主页宽度', value: 'versionUserHome' },
  { label: '收藏夹宽度', value: 'versionCollection' },
];
