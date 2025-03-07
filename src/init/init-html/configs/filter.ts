import { ICommonContent } from '../types';

/** 列表内容屏蔽 */
export const FILTER_LIST: ICommonContent[][] = [
  [{ label: '屏蔽顶部活动推广', value: 'removeTopAD' }],
  [{ label: '屏蔽匿名用户提问', value: 'removeAnonymousQuestion', needFetch: true }],
  [
    { label: '关注列表屏蔽自己的操作', value: 'removeMyOperateAtFollow' },
    { label: '关注列表过滤关注人赞同回答', value: 'removeFollowVoteAnswer' },
    { label: '关注列表过滤关注人赞同文章', value: 'removeFollowVoteArticle' },
    { label: '关注列表过滤关注人关注问题', value: 'removeFollowFQuestion' },
  ],
  [
    { label: '列表过滤邀请回答', value: 'removeItemQuestionAsk' },
    { label: '列表过滤商业推广', value: 'removeItemAboutAD' },
    { label: '列表过滤文章', value: 'removeItemAboutArticle' },
    { label: '列表过滤视频', value: 'removeItemAboutVideo' },
    { label: '列表过滤想法', value: 'removeItemAboutPin' },
  ],
];
