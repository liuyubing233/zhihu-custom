import { IOptionItem, IRangeItem } from '../types';

export const HTML_HOOTS = ['www.zhihu.com', 'zhuanlan.zhihu.com'];
/** class: INPUT 点击元素类名 */
export const CLASS_INPUT_CLICK = 'ctz-i';
/** class: INPUT 修改操作元素类名 */
export const CLASS_INPUT_CHANGE = 'ctz-i-change';
/** class: 不感兴趣外置按钮 */
export const CLASS_NOT_INTERESTED = 'ctz-not-interested';
/** class: 推荐列表显示「直达问题」按钮 */
export const CLASS_TO_QUESTION = 'ctz-to-question';
/** class: 自定义的时间元素名称 */
export const CLASS_TIME_ITEM = 'ctz-list-item-time';

export const CLASS_SELECT = 'ctz-select';
/** class: 列表、回答内容已经监听的类名 */
export const CLASS_LISTENED = 'ctz-listened'

/** class: 消息提示弹窗 */
export const CLASS_MESSAGE = 'ctz-message';
export const ID_MESSAGE_BOX = 'CTZ_MESSAGE_BOX';
/** ID: 额外的弹窗 */
export const ID_EXTRA_DIALOG = 'CTZ_EXTRA_OUTPUT_DIALOG';

/** 回答收起展开插入的类名 */
export const OB_CLASS_FOLD = {
  on: 'ctz-fold-open',
  off: 'ctz-fold-close',
};

/** html 添加额外的类名 */
export const EXTRA_CLASS_HTML: Record<string, string> = {
  'zhuanlan.zhihu.com': 'zhuanlan',
  'www.zhihu.com': 'zhihu',
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
export const VERSION_RANGE: IRangeItem[] = [
  {
    label: '列表宽度',
    value: 'versionHome',
    min: VERSION_MIN_WIDTH,
    max: 1500,
    percentChooseValue: 'versionHomeIsPercent',
    percentChooseLabel: '列表宽度使用百分比',
    desc: '最小显示宽度为600像素，设置低于此值将按照600像素显示',
    percentMin: 20,
    percentMax: 100,
    percentValue: 'versionHomePercent',
  },
  {
    label: '回答宽度',
    value: 'versionAnswer',
    min: VERSION_MIN_WIDTH,
    max: 1500,
    percentChooseValue: 'versionAnswerIsPercent',
    percentChooseLabel: '回答宽度使用百分比',
    desc: '最小显示宽度为600像素，设置低于此值将按照600像素显示',
    percentMin: 20,
    percentMax: 100,
    percentValue: 'versionAnswerPercent',
  },
  {
    label: '文章宽度',
    value: 'versionArticle',
    min: VERSION_MIN_WIDTH,
    max: 1500,
    percentChooseValue: 'versionArticleIsPercent',
    percentChooseLabel: '文章宽度使用百分比',
    desc: '最小显示宽度为600像素，设置低于此值将按照600像素显示',
    percentMin: 20,
    percentMax: 100,
    percentValue: 'versionArticlePercent',
  },
];
