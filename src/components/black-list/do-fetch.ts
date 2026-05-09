import { store } from '../../store';
import { message } from '../../tools';
import { BLOCKED_USER_LIST_TYPE, IBlockedUser, isZhihuBlockListFullResponse, TBlockedUserListType } from './types';
import { removeItemAfterBlock, updateItemAfterBlock } from './update';

const getXSRFToken = () => document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)?.[0] || '';

interface IAddBlockUserOptions {
  openTagChoose?: boolean;
}

/** 拉黑用户（屏蔽用户）方法 */
export const addBlockUser = (userInfo: IBlockedUser, options: IAddBlockUserOptions = {}) => {
  const { name, urlToken } = userInfo;
  // const message = `是否要屏蔽${name}？\n屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。`;
  // if (!confirm(message)) return Promise.reject();
  return new Promise<TBlockedUserListType | undefined>((resolve) => {
    const headers = store.getFetchHeaders();
    fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
      method: 'POST',
      headers: new Headers({
        ...headers,
        'x-xsrftoken': getXSRFToken(),
      }),
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          await updateItemAfterBlock(userInfo, BLOCKED_USER_LIST_TYPE.zhihu, options);
          resolve(BLOCKED_USER_LIST_TYPE.zhihu);
          return;
        }
        if (await isZhihuBlockListFullResponse(res)) {
          await updateItemAfterBlock(userInfo, BLOCKED_USER_LIST_TYPE.local, options);
          message('知乎黑名单已满，已添加至本地黑名单');
          resolve(BLOCKED_USER_LIST_TYPE.local);
          return;
        }
        message(`屏蔽用户失败：${name}`);
        resolve(undefined);
      })
      .catch(() => {
        message(`屏蔽用户失败：${name}`);
        resolve(undefined);
      });
  });
};

/** 解除拉黑用户 */
export const removeBlockUser = (info: IBlockedUser, needConfirm = true) => {
  // if (needConfirm) {
  //   const message = '取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。';
  //   if (!confirm(message)) return Promise.reject();
  // }
  return new Promise<void>((resolve) => {
    const { urlToken } = info;
    const headers = store.getFetchHeaders();
    fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
      method: 'DELETE',
      headers: new Headers({
        ...headers,
        'x-xsrftoken': getXSRFToken(),
      }),
      credentials: 'include',
    }).then(async () => {
      await removeItemAfterBlock(info, BLOCKED_USER_LIST_TYPE.zhihu);
      resolve();
    });
  });
};
