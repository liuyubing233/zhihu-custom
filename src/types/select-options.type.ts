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
