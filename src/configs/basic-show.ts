export const BASIC_SHOW_CONTENT = [
  {
    label:
      `内容标题添加类别显示` +
      `<span class="ctz-label-tag ctz-label-tag-Answer">问答</span>` +
      `<span class="ctz-label-tag ctz-label-tag-Article">文章</span>` +
      `<span class="ctz-label-tag ctz-label-tag-ZVideo">视频</span>` +
      `<span class="ctz-label-tag ctz-label-tag-Pin">想法</span>`,
    value: 'questionTitleTag',
  },
  { label: '推荐列表显示「不感兴趣」按钮', value: 'listOutPutNotInterested', needFetch: true },
  { label: '赞同按钮仅显示数字', value: 'justVoteNum' },
  { label: '评论按钮仅显示数字', value: 'justCommitNum' },
  { label: '回答内容顶部显示赞同人数', value: 'topVote' },
  { label: '文档或回答顶部显示导出当前内容/回答按钮', value: 'topExportContent' },
  { label: '回答和文章中的视频替换为链接', value: 'videoUseLink' },
  { label: '推荐列表显示「直达问题」按钮', value: 'listOutputToQuestion' },
  { label: '列表更多「···」按钮移动到题目右侧', value: 'fixedListItemMore' },
  { label: '关注列表高亮原创内容', value: 'highlightOriginal' },
  { label: '列表内容点击高亮边框', value: 'highlightListItem' },
  { label: '列表内容显示发布时间和最后修改时间', value: 'listItemCreatedAndModifiedTime' },
  { label: '问题详情显示创建时间和最后修改时间', value: 'questionCreatedAndModifiedTime' },
  { label: '回答内容显示创建时间与最后修改时间', value: 'answerItemCreatedAndModifiedTime' },
  { label: '文章发布时间置顶', value: 'articleCreateTimeToTop' },
  { label: '用户主页内容发布、修改时间置顶', value: 'userHomeContentTimeTop' },
];
