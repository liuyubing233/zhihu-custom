import { dom, myStorage } from '../../tools';
import { chooseBlockedUserTags, ID_BLOCK_LIST, ID_LOCAL_BLOCK_LIST, initHTMLBlockedUsers } from './create-html';
import { BLOCKED_USER_LIST_CONFIG_KEY, BLOCKED_USER_LIST_TYPE, IBlockedUser, mergeBlockedUser, TBlockedUserListType } from './types';

interface IUpdateItemAfterBlockOptions {
  openTagChoose?: boolean;
}

/** 屏蔽用户后修改器上的操作 */
export const updateItemAfterBlock = async (
  userInfo: IBlockedUser,
  listType: TBlockedUserListType = BLOCKED_USER_LIST_TYPE.zhihu,
  options: IUpdateItemAfterBlockOptions = {}
) => {
  const config = await myStorage.getConfig();
  const { openTagChooseAfterBlockedUser } = config;
  const listKey = BLOCKED_USER_LIST_CONFIG_KEY[listType];
  const otherListKey = listType === BLOCKED_USER_LIST_TYPE.zhihu ? BLOCKED_USER_LIST_CONFIG_KEY.local : BLOCKED_USER_LIST_CONFIG_KEY.zhihu;
  const prevList = config[listKey] || [];
  const prevUser = prevList.find((item) => item.id === userInfo.id);
  const nextUser = mergeBlockedUser(prevUser, userInfo);

  await myStorage.updateConfig({
    ...config,
    [listKey]: [nextUser, ...prevList.filter((item) => item.id !== userInfo.id)],
    [otherListKey]: (config[otherListKey] || []).filter((item) => item.id !== userInfo.id),
  });

  await initHTMLBlockedUsers(document.body);
  if (options.openTagChoose !== false && openTagChooseAfterBlockedUser) {
    const nodeUserItem = dom(`#${listType === BLOCKED_USER_LIST_TYPE.zhihu ? ID_BLOCK_LIST : ID_LOCAL_BLOCK_LIST} .ctz-black-id-${userInfo.id}`);
    nodeUserItem && chooseBlockedUserTags(nodeUserItem, false);
  }
};

/** 解除屏蔽后修改器上的操作 */
export const removeItemAfterBlock = async (userInfo: IBlockedUser, listType: TBlockedUserListType = BLOCKED_USER_LIST_TYPE.zhihu) => {
  const config = await myStorage.getConfig();
  const listKey = BLOCKED_USER_LIST_CONFIG_KEY[listType];
  const blockedUsers = config[listKey] || [];
  const itemIndex = blockedUsers.findIndex((i) => i.id === userInfo.id);
  if (itemIndex >= 0) {
    blockedUsers.splice(itemIndex, 1);
    await myStorage.updateConfigItem(listKey, blockedUsers);
  }
  initHTMLBlockedUsers(document.body);
};
