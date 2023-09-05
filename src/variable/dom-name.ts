export const HTML_HOOTS = ['www.zhihu.com', 'zhuanlan.zhihu.com'];
/** 设置弹窗 */
export const ID_DIALOG = 'CTZ_DIALOG_MAIN';
/** 屏蔽词 ID */
export const ID_FILTER_WORDS = 'CTZ_FILTER_WORDS';
/** 黑名单列表 ID */
export const ID_BLOCK_LIST = 'CTZ-BLOCK-LIST';
/** 同步黑名单 按钮 ID */
export const ID_BUTTON_SYNC_BLOCK = 'CTZ-BUTTON-SYNC-BLOCK';
/** INPUT 点击元素类名 */
export const CLASS_INPUT_CLICK = 'ctz-i';
/** INPUT 修改操作元素类名 */
export const CLASS_INPUT_CHANGE = 'ctz-i-change';
/** 黑名单元素删除按钮类名 */
export const CLASS_REMOVE_BLOCK = 'ctz-remove-block';
/** 不感兴趣外置按钮 */
export const CLASS_NOT_INTERESTED = 'ctz-not-interested';

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
