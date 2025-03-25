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

/** 黑名单部分配置类型 */
export interface IConfigBlackList {
  /** 列表用户名后显示「屏蔽用户」按钮 */
  showBlockUser?: boolean;
  /** 用户主页置顶「屏蔽用户」按钮 */
  userHomeTopBlockUser?: boolean;
  /** 评论用户名后显示"屏蔽用户"按钮 */
  showBlockUserComment?: boolean;
  /** 屏蔽黑名单用户发布的评论 */
  removeBlockUserComment?: boolean;
  /** 黑名单用户发布的评论显示黑名单标识 */
  showBlockUserCommentTag?: boolean;
  /** 列表和回答显示黑名单用户标识 */
  showBlockUserTag?: boolean;
  /** 黑名单用户标识也显示标签分类 */
  showBlockUserTagType?: boolean;
  /** 屏蔽用户后弹出标签选择 */
  openTagChooseAfterBlockedUser?: boolean;
  /** 屏蔽不再显示黑名单用户发布的内容 */
  removeBlockUserContent?: boolean;
  /** 黑名单列表 */
  blockedUsers?: IBlockedUser[];
  /** 黑名单标签 */
  blockedUsersTags?: string[];
}

export const BLACK_LIST_CONFIG_NAMES: (keyof IConfigBlackList)[] = [
  'showBlockUser',
  'userHomeTopBlockUser',
  'showBlockUserComment',
  'removeBlockUserComment',
  'showBlockUserCommentTag',
  'showBlockUserTag',
  'showBlockUserTagType',
  'openTagChooseAfterBlockedUser',
  'removeBlockUserContent',
  'blockedUsers',
  'blockedUsersTags',
];
