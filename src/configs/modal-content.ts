export const FOOTER_HTML =
  `<a href="https://github.com/liuyubing233/zhihu-custom" target="_blank">Github⭐</a>` +
  `<a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8" target="_blank">GreasyFork</a>`;

/** 默认功能文案 */
export const DEFAULT_FUNCTION = [
  '外链直接打开<div class="ctz-commit">知乎里所有外部链接的重定向去除，可以直接访问</div>',
  '移除登录提示弹窗',
  '一键移除所有屏蔽选项，点击「话题黑名单」编辑按钮出现按钮<div class="ctz-commit">知乎<a href="https://www.zhihu.com/settings/filter" target="_blank">屏蔽页面</a>每次只显示部分内容，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽标签</div>',
  '回答视频下载<div class="ctz-commit">回答内容视频左上角会生成一个下载按钮，点击即可下载视频</div>',
  '收藏夹内容导出为 PDF（需开启接口拦截）<div class="ctz-commit">点击收藏夹名称上方「生成PDF」按钮，可导出当前页码的收藏夹详细内容</div>',
  // '当前回答和文章导出为 PDF 功能（需开启接口拦截）<div class="ctz-commit">对应为内容上方的「导出当前回答」「导出当前文章」按钮</div>',
  // '回答内容按照点赞数和评论数排序' +
  //   '<div class="ctz-commit">' +
  //   '6-1. 点击回答右上角的排序按钮，点击【点赞数排序】或【评论数排序】后，页面刷新等待排序完成；<br/>' +
  //   '6-2. 因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序；<br/>' +
  //   '6-3. 为了防止页面错乱，只对前20条进行排序，后续新加载的数据不做排序处理' +
  //   '</div>',
  '个人主页「我关注的问题」、「我关注的收藏」可以一键移除或将移除的内容添加回关注' +
    '<div class="ctz-commit">' +
    '由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面' +
    '</div>',
  '推荐页内容链接根据有新到旧进行缓存，可缓存 100 条；缓存内容在「编辑器 - 历史记录 - 推荐列表缓存」',
  '可保存 100 条浏览历史记录链接，内容为打开的问题、文章、视频；「编辑器 - 历史记录 - 浏览历史记录」',
  '静态图片弹窗观看点击键盘左右直接切换到上一张或下一张' +
    '<div class="ctz-commit">' +
    '查看图片点击预览大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示' +
    '</div>',
  '用户主页-回答-导出当前页回答的功能（需开启接口拦截）',
  '用户主页-文章-导出当前页文章的功能（需开启接口拦截）',
];
