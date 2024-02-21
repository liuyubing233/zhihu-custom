/** 基础设置 - 显示设置部分 */
export const BASIC_SHOW_CONTENT = [
  {
    label:
      `<b>列表</b>标题类别显示` +
      `<span class="ctz-label-tag ctz-label-tag-Answer">问答</span>` +
      `<span class="ctz-label-tag ctz-label-tag-Article">文章</span>` +
      `<span class="ctz-label-tag ctz-label-tag-ZVideo">视频</span>` +
      `<span class="ctz-label-tag ctz-label-tag-Pin">想法</span>`,
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
  { label: '<b>回答、文章</b>中去除热词点击搜索', value: 'contentRemoveKeywordSearch' },
  { label: '<b>用户主页</b>内容置顶发布、修改时间', value: 'userHomeContentTimeTop' },
  { label: '<b>用户主页</b>置顶「屏蔽用户」按钮', value: 'userHomeTopBlockUser' },
];
