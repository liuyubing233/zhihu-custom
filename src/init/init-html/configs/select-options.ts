import { IOptionItem } from "../../../types";

/** 枚举: 替换知乎直达为搜索 */
export enum EReplaceZhidaToSearch {
  不替换 = 'default',
  知乎 = 'zhihu',
  百度 = 'baidu',
  谷歌 = 'google',
  必应 = 'bing',
  去除知乎直达跳转 = 'removeLink',
}

/** 枚举: 购物链接显示 */
export enum ELinkShopping {
  默认 = '0',
  仅文字 = '1',
  隐藏 = '2',
}

/** 枚举: 回答内容收起/展开状态 */
export enum EAnswerOpen {
  默认 = 'default',
  自动展开所有回答 = 'on',
  默认收起长回答 = 'off',
}

/** 枚举: 修改器弹出图标 ⚙︎ 定位方式 */
export enum ESuspensionOpen {
  左右 = '0',
  上下 = '1',
}

/** 枚举: 回答和文章图片尺寸 */
export enum EZoomImageType {
  默认尺寸 = '0',
  原图尺寸 = '1',
  自定义尺寸 = '2',
}

/** 枚举: 图片最大高度限制 */
export enum EZoomImageHeight {
  关闭 = '0',
  开启 = '1',
}

/** 枚举: 列表视频回答尺寸 */
export enum EZoomListVideoType {
  默认尺寸 = '0',
  自定义尺寸 = '2',
}

/** select 选择框 */
export const OPTIONS_MAP: Record<string, IOptionItem[]> = {
  // 替换知乎直达为搜索
  replaceZhidaToSearch: [
    { label: '不替换', value: EReplaceZhidaToSearch.不替换 },
    { label: '去除知乎直达跳转', value: EReplaceZhidaToSearch.去除知乎直达跳转 },
    { label: '知乎', value: EReplaceZhidaToSearch.知乎 },
    { label: '必应', value: EReplaceZhidaToSearch.必应 },
    { label: '百度', value: EReplaceZhidaToSearch.百度 },
    { label: '谷歌', value: EReplaceZhidaToSearch.谷歌 },
  ],
  // 购物链接显示
  linkShopping: [
    { label: '默认', value: ELinkShopping.默认 },
    { label: '仅文字', value: ELinkShopping.仅文字 },
    { label: '隐藏', value: ELinkShopping.隐藏 },
  ],
  // 回答内容收起/展开状态
  answerOpen: [
    { label: '默认', value: EAnswerOpen.默认 },
    { label: '自动展开所有回答', value: EAnswerOpen.自动展开所有回答 },
    { label: '默认收起长回答', value: EAnswerOpen.默认收起长回答 },
  ],
  // 修改器弹出图标 ⚙︎ 定位方式
  suspensionOpen: [
    { label: '左右', value: ESuspensionOpen.左右 },
    { label: '上下', value: ESuspensionOpen.上下 },
  ],
  // 回答和文章图片尺寸
  zoomImageType: [
    { label: '默认尺寸', value: EZoomImageType.默认尺寸 },
    { label: '自定义尺寸', value: EZoomImageType.自定义尺寸 },
    { label: '原图尺寸', value: EZoomImageType.原图尺寸 },
  ],
  // 图片最大高度限制
  zoomImageHeight: [
    { label: '关闭', value: EZoomImageHeight.关闭 },
    { label: '开启', value: EZoomImageHeight.开启 },
  ],
  // 列表视频回答尺寸
  zoomListVideoType: [
    { label: '默认尺寸', value: EZoomListVideoType.默认尺寸 },
    { label: '自定义尺寸', value: EZoomListVideoType.自定义尺寸 },
  ],
};
