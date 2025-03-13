import { ICommonContent } from '../types';

/** 基础设置 - 显示设置部分 */
export const BASIC_SHOW: ICommonContent[][] = [
  [
    {
      label:
        `列表 - 标题类别显示` +
        `<b style="color: #ec7259">「问题」</b>` +
        `<b style="color: #00965e">「文章」</b>` +
        `<b style="color: #12c2e9">「视频」</b>` +
        `<b style="color: #9c27b0">「想法」</b>`,
      value: 'questionTitleTag',
    },
    { label: '列表和回答 - 点击高亮边框', value: 'highlightListItem' },
    { label: '列表 -「···」按钮移动到最右侧', value: 'fixedListItemMore' },
    { label: '列表 - 「不感兴趣」按钮', value: 'listOutPutNotInterested', needFetch: true },
    { label: '列表 - 「直达问题」按钮', value: 'listOutputToQuestion' },
  ],
  [
    { label: '赞同按钮仅显示数字', value: 'justVoteNum' },
    { label: '评论按钮仅显示数字', value: 'justCommitNum' },
  ],
  [
    { label: '问题详情 - 回答顶部显示赞同人数', value: 'topVote' },
    { label: '问题详情 - 一键获取回答链接', value: 'copyAnswerLink' },
    { label: '回答、文章顶部显示导出当前内容/回答按钮', value: 'topExportContent' },
  ],
  [
    { label: '用户主页 - 内容发布、修改时间', value: 'userHomeContentTimeTop' },
    { label: '列表 - 发布、修改时间', value: 'listItemCreatedAndModifiedTime' },
    { label: '问题详情 - 问题 - 发布、修改时间', value: 'questionCreatedAndModifiedTime' },
    { label: '问题详情 - 回答 - 发布、修改时间', value: 'answerItemCreatedAndModifiedTime' },
    { label: '文章 - 发布时间', value: 'articleCreateTimeToTop' },
  ],
  [
    { label: '取消评论输入框自动聚焦', value: 'cancelCommentAutoFocus' },
    { label: '键盘ESC键关闭评论弹窗', value: 'keyEscCloseCommentDialog' },
    { label: '点击空白处关闭评论弹窗', value: 'clickMarkCloseCommentDialog' },
  ],
];
