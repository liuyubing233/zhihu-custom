export const DE = [
  {
    title: '外部链接直接跳转',
    commit: '知乎里所有外部链接的重定向页面去除，点击将直接跳转到外部链接，不再打开知乎外部链接提示页面',
  },
  {
    title: '移除登录提示弹窗',
  },
  {
    title: '一键移除所有屏蔽选项，点击「话题黑名单」编辑按钮出现按钮',
    commit: '知乎<a href="https://www.zhihu.com/settings/filter" target="_blank">屏蔽页面</a>每次只显示部分内容，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽标签',
  },
  {
    title: '视频下载',
    commit: '可下载视频内容左上角将会生成一个下载按钮，点击即可下载视频',
  },
  {
    title: '收藏夹内容导出为 PDF（需开启接口拦截）',
    commit: '点击收藏夹名称上方「导出当前页内容」按钮，可导出当前页码的收藏夹详细内容',
  },
  {
    title: '个人主页「我关注的问题」、「我关注的收藏」一键移除或添回关注',
    commit: '由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面',
  },
  {
    title: '静态图片弹窗观看点击键盘左右直接切换到上一张或下一张',
    commit: '查看图片点击预览大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示',
  },
  {
    title: '用户主页-回答-导出当前页回答的功能（需开启接口拦截）',
  },
  {
    title: '用户主页-文章-导出当前页文章的功能（需开启接口拦截）',
  },
];

/** 基础设置 - 显示设置部分 */
export const BASIC_SHOW_CONTENT: ICommonContent[] = [
  { label: '去除热词点击搜索', value: 'contentRemoveKeywordSearch' },
  {
    label:
      `<b>列表</b>标题类别显示` +
      `<b style="color: #ec7259">「问题」</b>` +
      `<b style="color: #00965e">「文章」</b>` +
      `<b style="color: #12c2e9">「视频」</b>` +
      `<b style="color: #9c27b0">「想法」</b>`,
    value: 'questionTitleTag',
  },
  { label: '<b>列表</b>更多「···」按钮移动到最右侧', value: 'fixedListItemMore' },
  { label: '<b>列表</b>点击高亮边框', value: 'highlightListItem' },
  { label: '<b>推荐列表</b>「不感兴趣」按钮', value: 'listOutPutNotInterested', needFetch: true },
  { label: '<b>推荐列表</b>「直达问题」按钮', value: 'listOutputToQuestion' },
  { label: '<b>关注列表</b>高亮原创内容', value: 'highlightOriginal' },
  { label: '<b>推荐、关注列表</b>内容置顶发布时间和最后修改时间', value: 'listItemCreatedAndModifiedTime' },
  { label: '赞同按钮仅显示数字', value: 'justVoteNum' },
  { label: '评论按钮仅显示数字', value: 'justCommitNum' },
  { label: '<b>问题详情</b>置顶创建时间和最后修改时间', value: 'questionCreatedAndModifiedTime' },
  { label: '<b>回答</b>顶部显示赞同人数', value: 'topVote' },
  { label: '<b>回答</b>一键获取回答链接', value: 'copyAnswerLink' },
  { label: '<b>回答</b>置顶创建时间与最后修改时间', value: 'answerItemCreatedAndModifiedTime' },
  { label: '<b>文章</b>发布时间置顶', value: 'articleCreateTimeToTop' },
  { label: '<b>回答、文章</b>顶部显示导出当前内容/回答按钮', value: 'topExportContent' },
  { label: '<b>回答、文章</b>中视频替换为链接', value: 'videoUseLink' },
  { label: '<b>用户主页</b>内容置顶发布、修改时间', value: 'userHomeContentTimeTop' },
  { label: '<b>用户主页</b>置顶「屏蔽用户」按钮', value: 'userHomeTopBlockUser' },
];

export const HIGH_PERFORMANCE: ICommonContent[] = [
  { label: '推荐列表高性能模式（推荐列表内容最多保留50条，超出则删除之前内容）', value: 'highPerformanceRecommend' },
  { label: '回答页高性能模式（最多保留30条回答，超出则删除之前回答）', value: 'highPerformanceAnswer' },
];

export interface ICommonContent {
  label: string;
  value: string;
  needFetch?: boolean;
}
