import { ICommonContent } from "../../init/init-html/types";

/** 黑名单 */
export interface IBlockedUser {
  id: string;
  name: string;
  urlToken: string;
  tags?: string[]; // 标签
}

export const BLOCKED_USER_COMMON: ICommonContent[][] = [
  [
    { label: '回答及列表用户名后显示"屏蔽用户"按钮', value: 'showBlockUser' },
    { label: '评论区显示"屏蔽用户"按钮', value: 'showBlockUserComment' },
    { label: '屏蔽黑名单用户发布的内容', value: 'removeBlockUserContent' },
    { label: '屏蔽黑名单用户评论', value: 'removeBlockUserComment' },
    { label: '回答及列表显示黑名单用户标识<div class="ctz-black-tag">黑名单</div>', value: 'showBlockUserTag' },
    { label: '评论区显示黑名单用户标识<div class="ctz-black-tag">黑名单</div>', value: 'showBlockUserCommentTag' },
    { label: '黑名单用户标识显示标签分类<div class="ctz-black-tag">黑名单：xx</div>', value: 'showBlockUserTagType' },
  ],
];
