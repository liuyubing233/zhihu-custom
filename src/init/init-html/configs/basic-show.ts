import { ICommonContent } from '../types';

/** 基础设置 - 显示设置部分 */
export const BASIC_SHOW: ICommonContent[][] = [
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
