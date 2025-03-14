import { dom, domById, domC, myStorage } from '../../tools';
import { blackItemContent, chooseBlockedUserTags, ID_BLOCK_LIST } from './create-html';
import { IBlockedUser } from './types';

/** 屏蔽用户后修改器上的操作 */
export const updateItemAfterBlock = async (userInfo: IBlockedUser) => {
  const { blockedUsers = [], openTagChooseAfterBlockedUser } = await myStorage.getConfig();
  blockedUsers.unshift(userInfo);
  await myStorage.updateConfigItem('blockedUsers', blockedUsers);
  const nodeUserItem = domC('div', {
    className: `ctz-black-item ctz-black-id-${userInfo.id}`,
    innerHTML: blackItemContent(userInfo),
  });
  nodeUserItem.dataset.info = JSON.stringify(userInfo);
  const nodeUsers = domById(ID_BLOCK_LIST)!;
  nodeUsers.insertBefore(nodeUserItem, nodeUsers.children[0]);
  if (openTagChooseAfterBlockedUser) {
    chooseBlockedUserTags(nodeUserItem, false);
  }
};

/** 解除屏蔽后修改器上的操作 */
export const removeItemAfterBlock = async (userInfo: IBlockedUser) => {
  const { blockedUsers = [] } = await myStorage.getConfig();
  const itemIndex = blockedUsers.findIndex((i) => i.id === userInfo.id);
  if (itemIndex >= 0) {
    blockedUsers.splice(itemIndex, 1);
    const removeItem = dom(`.ctz-black-id-${userInfo.id}`);
    removeItem && removeItem.remove();
    myStorage.updateConfigItem('blockedUsers', blockedUsers);
  }
};
