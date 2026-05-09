import { ICommonContent } from '../../init/init-html/types';

/** 黑名单 */
export interface IBlockedUser {
  id: string;
  name: string;
  urlToken: string;
  tags?: string[]; // 标签
}

export const BLOCKED_USER_LIST_TYPE = {
  zhihu: 'zhihu',
  local: 'local',
} as const;

export type TBlockedUserListType = (typeof BLOCKED_USER_LIST_TYPE)[keyof typeof BLOCKED_USER_LIST_TYPE];

export const BLOCKED_USER_LIST_CONFIG_KEY: Record<TBlockedUserListType, 'blockedUsers' | 'localBlockedUsers'> = {
  zhihu: 'blockedUsers',
  local: 'localBlockedUsers',
};

const mergeTags = (a?: string[], b?: string[]) => [...new Set([...(a || []), ...(b || [])])];

export const mergeBlockedUser = (prev: IBlockedUser | undefined, next: IBlockedUser): IBlockedUser => ({
  ...prev,
  ...next,
  tags: mergeTags(prev?.tags, next.tags),
});

export const mergeBlockedUsers = (users: IBlockedUser[]) => {
  const map = new Map<string, IBlockedUser>();
  users.forEach((user) => {
    if (!user.id) return;
    map.set(user.id, mergeBlockedUser(map.get(user.id), user));
  });
  return [...map.values()];
};

export const getBlockedUsersByType = (config: IConfigBlackList, listType: TBlockedUserListType) => config[BLOCKED_USER_LIST_CONFIG_KEY[listType]] || [];

export const getAllBlockedUsers = (config: IConfigBlackList) => mergeBlockedUsers([...(config.blockedUsers || []), ...(config.localBlockedUsers || [])]);

export const findBlockedUserWithType = (config: IConfigBlackList, id: string) => {
  const zhihuUser = (config.blockedUsers || []).find((item) => item.id === id);
  if (zhihuUser) return { user: zhihuUser, listType: BLOCKED_USER_LIST_TYPE.zhihu };
  const localUser = (config.localBlockedUsers || []).find((item) => item.id === id);
  if (localUser) return { user: localUser, listType: BLOCKED_USER_LIST_TYPE.local };
};

export const isZhihuBlockListFullText = (text: string) => /(黑名单|屏蔽).*(上限|数量|已满|最多)|limit|maximum|too many/i.test(text);

export const isZhihuBlockListFullResponse = async (res: Response) => {
  if (res.ok) return false;
  try {
    return isZhihuBlockListFullText(await res.clone().text());
  } catch {
    return false;
  }
};

export const BLOCKED_USER_COMMON: ICommonContent[][] = [
  [
    { label: '列表和回答 - 「屏蔽用户」按钮', value: 'showBlockUser' },
    { label: '用户主页 - 置顶「屏蔽用户」按钮', value: 'userHomeTopBlockUser' },
    { label: '评论区 - 「屏蔽用户」按钮', value: 'showBlockUserComment' },
    { label: '屏蔽黑名单用户发布的内容（问题、回答、文章）', value: 'removeBlockUserContent' },
    { label: '屏蔽黑名单用户发布的评论', value: 'removeBlockUserComment' },
    { label: '将黑名单用户发布的内容使用 * 代替', value: 'replaceBlockUserContentWithStar' },
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
  /** 将黑名单用户发布的评论和回答内容替换为 *** */
  replaceBlockUserContentWithStar?: boolean;
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
  /** 本地黑名单列表 */
  localBlockedUsers?: IBlockedUser[];
  /** 黑名单标签 */
  blockedUsersTags?: string[];
}

export const BLACK_LIST_CONFIG_NAMES: (keyof IConfigBlackList)[] = [
  'showBlockUser',
  'userHomeTopBlockUser',
  'showBlockUserComment',
  'removeBlockUserComment',
  'replaceBlockUserContentWithStar',
  'showBlockUserCommentTag',
  'showBlockUserTag',
  'showBlockUserTagType',
  'openTagChooseAfterBlockedUser',
  'removeBlockUserContent',
  'blockedUsers',
  'localBlockedUsers',
  'blockedUsersTags',
];
