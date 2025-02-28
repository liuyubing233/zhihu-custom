export const DE = [
  {
    title: '外部链接直接跳转',
    commit: '知乎里所有外部链接的重定向页面去除，点击将直接跳转到外部链接，不再打开知乎外部链接提示页面',
  },
  {
    title: '移除登录提示弹窗',
  },
  {
    title: '一键移除所有屏蔽话题，点击「话题黑名单」编辑按钮出现按钮',
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
    title: '个人主页关注订阅快捷取消关注',
    commit:
      '由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面<br>目前仅支持「我关注的问题」、「我关注的收藏」一键移除或添回关注',
  },
  {
    title: '预览静态图片键盘快捷切换',
    commit: '静态图片点击查看大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示',
  },
  {
    title: '用户主页-回答-导出当前页回答的功能（需开启接口拦截）',
  },
  {
    title: '用户主页-文章-导出当前页文章的功能（需开启接口拦截）',
  },
  {
    title: '一键邀请',
    commit: '问题邀请用户添加一键邀请按钮，点击可邀请所有推荐用户',
  },
];

/** 基础设置 - 显示设置部分 */
export const BASIC_SHOW_CONTENT: ICommonContent[][] = [
  // [{ label: '去除热词点击搜索', value: 'contentRemoveKeywordSearch' }],
  [
    {
      label:
        `列表标题类别显示` +
        `<b style="color: #ec7259">「问题」</b>` +
        `<b style="color: #00965e">「文章」</b>` +
        `<b style="color: #12c2e9">「视频」</b>` +
        `<b style="color: #9c27b0">「想法」</b>`,
      value: 'questionTitleTag',
    },
    { label: '列表点击高亮边框', value: 'highlightListItem' },
    { label: '列表更多「···」按钮移动到最右侧', value: 'fixedListItemMore' },
    { label: '推荐列表「不感兴趣」按钮', value: 'listOutPutNotInterested', needFetch: true },
    { label: '推荐列表「直达问题」按钮', value: 'listOutputToQuestion' },
  ],
  [
    { label: '赞同按钮仅显示数字', value: 'justVoteNum' },
    { label: '评论按钮仅显示数字', value: 'justCommitNum' },
  ],
  [
    { label: '回答顶部显示赞同人数', value: 'topVote' },
    { label: '回答一键获取回答链接', value: 'copyAnswerLink' },
    { label: '回答、文章顶部显示导出当前内容/回答按钮', value: 'topExportContent' },
    { label: '回答、文章中视频替换为链接', value: 'videoUseLink' },
  ],
  [
    { label: '用户主页内容置顶发布、修改时间', value: 'userHomeContentTimeTop' },
    { label: '用户主页置顶「屏蔽用户」按钮', value: 'userHomeTopBlockUser' },
  ],
  [
    { label: '推荐、关注列表内容置顶发布时间和最后修改时间', value: 'listItemCreatedAndModifiedTime' },
    { label: '问题详情置顶创建时间和最后修改时间', value: 'questionCreatedAndModifiedTime' },
    { label: '回答置顶创建时间与最后修改时间', value: 'answerItemCreatedAndModifiedTime' },
    { label: '文章发布时间置顶', value: 'articleCreateTimeToTop' },
  ],
  [
    { label: '取消评论输入框自动聚焦', value: 'cancelCommentAutoFocus' },
    { label: '键盘ESC键关闭评论弹窗', value: 'keyEscCloseCommentDialog' },
    { label: '点击空白处关闭评论弹窗', value: 'clickMarkCloseCommentDialog' },
  ],
];

export const HIGH_PERFORMANCE: ICommonContent[][] = [
  [
    { label: '推荐列表高性能模式', value: 'highPerformanceRecommend', tooltip: '推荐列表内容最多保留50条，超出则删除之前内容' },
    { label: '回答页高性能模式', value: 'highPerformanceAnswer', tooltip: '回答列表最多保留30条回答，超出则删除之前回答' },
  ],
];

export interface ICommonContent {
  label: string;
  value: string;
  needFetch?: boolean;
  tooltip?: string;
}
