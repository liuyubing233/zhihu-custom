import { IOptionItem, IRangeItem } from '../types';

export const HTML_HOOTS = ['www.zhihu.com', 'zhuanlan.zhihu.com'];
/** id: 设置弹窗 */
export const ID_DIALOG = 'CTZ_DIALOG_MAIN';
/** id: 同步黑名单按钮 */
export const ID_BUTTON_SYNC_BLOCK = 'CTZ-BUTTON-SYNC-BLOCK';
/** class: INPUT 点击元素类名 */
export const CLASS_INPUT_CLICK = 'ctz-i';
/** class: INPUT 修改操作元素类名 */
export const CLASS_INPUT_CHANGE = 'ctz-i-change';
/** class: 黑名单元素删除按钮类名 */
export const CLASS_REMOVE_BLOCK = 'ctz-remove-block';
/** class: 不感兴趣外置按钮 */
export const CLASS_NOT_INTERESTED = 'ctz-not-interested';
/** class: 推荐列表显示「直达问题」按钮 */
export const CLASS_TO_QUESTION = 'ctz-to-question';
/** class: 自定义的时间元素名称 */
export const CLASS_TIME_ITEM = 'ctz-list-item-time';

/** class: 消息提示弹窗 */
export const CLASS_MESSAGE = 'ctz-message';
export const ID_MESSAGE_BOX = 'CTZ_MESSAGE_BOX';

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

export const HEADER = [
  { href: '#CTZ_BASIS', value: '基础设置' },
  { href: '#CTZ_HIDDEN', value: '隐藏模块设置' },
  { href: '#CTZ_FILTER', value: '屏蔽内容设置' },
  { href: '#CTZ_BLOCK_WORD', value: '屏蔽词设置' },
  { href: '#CTZ_BLACKLIST', value: '黑名单设置' },
  { href: '#CTZ_HISTORY', value: '历史记录' },
  { href: '#CTZ_DEFAULT', value: '默认功能' },
];

export const FONT_SIZE_INPUT: IOptionItem[][] = [
  [
    { value: 'fontSizeForListTitle', label: '列表标题文字大小' },
    { value: 'fontSizeForList', label: '列表内容文字大小' },
  ],
  [
    { value: 'fontSizeForAnswerTitle', label: '回答标题文字大小' },
    { value: 'fontSizeForAnswer', label: '回答内容文字大小' },
  ],
  [
    { value: 'fontSizeForArticleTitle', label: '文章标题文字大小' },
    { value: 'fontSizeForArticle', label: '文章内容文字大小' },
  ],
  [{ value: 'contentLineHeight', label: '内容行高' }],
];

/** 版心最小宽度 */
export const VERSION_MIN_WIDTH = 600;
export const VERSION_RANGE: IRangeItem[] = [
  {
    label: '列表页内容宽度',
    value: 'versionHome',
    min: VERSION_MIN_WIDTH,
    max: 1500,
    percentChooseValue: 'versionHomeIsPercent',
    percentChooseLabel: '列表页内容宽度用百分比设置',
    desc: '列表页内容宽度最小为600像素，设置宽度小于此则会用600像素显示',
    percentMin: 20,
    percentMax: 100,
    percentLabel: '列表页内容宽度（百分比）',
    percentValue: 'versionHomePercent',
  },
  {
    label: '回答页内容宽度',
    value: 'versionAnswer',
    min: VERSION_MIN_WIDTH,
    max: 1500,
    percentChooseValue: 'versionAnswerIsPercent',
    percentChooseLabel: '回答页内容宽度用百分比设置',
    desc: '回答页内容宽度最小为600像素，设置宽度小于此则会用600像素显示',
    percentMin: 20,
    percentMax: 100,
    percentLabel: '回答页内容宽度（百分比）',
    percentValue: 'versionAnswerPercent',
  },
  {
    label: '文章页内容宽度',
    value: 'versionArticle',
    min: VERSION_MIN_WIDTH,
    max: 1500,
    percentChooseValue: 'versionArticleIsPercent',
    percentChooseLabel: '文章页内容宽度用百分比设置',
    desc: '文章页内容宽度最小为600像素，设置宽度小于此则会用600像素显示',
    percentMin: 20,
    percentMax: 100,
    percentLabel: '文章页内容宽度（百分比）',
    percentValue: 'versionArticlePercent',
  },
];
