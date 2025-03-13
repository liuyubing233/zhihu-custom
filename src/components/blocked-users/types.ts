import { ICommonContent } from '../../init/init-html/types';

/** 黑名单 */
export interface IBlockedUser {
  id: string;
  name: string;
  urlToken: string;
  tags?: string[]; // 标签
}

export const BLOCKED_USER_COMMON: ICommonContent[][] = [
  [
    { label: '列表和回答 - 「屏蔽用户」按钮', value: 'showBlockUser' },
    { label: '用户主页 - 置顶「屏蔽用户」按钮', value: 'userHomeTopBlockUser' },
    { label: '评论区 - 「屏蔽用户」按钮', value: 'showBlockUserComment' },
    { label: '屏蔽黑名单用户发布的内容（问题、回答、文章）', value: 'removeBlockUserContent' },
    { label: '屏蔽黑名单用户发布的评论', value: 'removeBlockUserComment' },
    { label: '列表和回答 - 黑名单用户标识<div class="ctz-black-tag">黑名单</div>', value: 'showBlockUserTag' },
    { label: '评论区 - 黑名单用户标识<div class="ctz-black-tag">黑名单</div>', value: 'showBlockUserCommentTag' },
    { label: '黑名单用户标识显示标签分类<div class="ctz-black-tag">黑名单：xx</div>', value: 'showBlockUserTagType' },
  ],
];
