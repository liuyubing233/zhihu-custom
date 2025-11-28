import { store } from '../../store';
import { IBlockedUser } from './types';
import { removeItemAfterBlock, updateItemAfterBlock } from './update';

/** 拉黑用户（屏蔽用户）方法 */
export const addBlockUser = (userInfo: IBlockedUser) => {
  const { name, urlToken } = userInfo;
  // const message = `是否要屏蔽${name}？\n屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。`;
  // if (!confirm(message)) return Promise.reject();
  return new Promise<void>((resolve) => {
    const headers = store.getFetchHeaders();
    fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
      method: 'POST',
      headers: new Headers({
        ...headers,
        'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)![0] || '',
      }),
      credentials: 'include',
    }).then(async () => {
      await updateItemAfterBlock(userInfo);
      resolve();
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
    const { urlToken, id } = info;
    const headers = store.getFetchHeaders();
    fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
      method: 'DELETE',
      headers: new Headers({
        ...headers,
        'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)![0] || '',
      }),
      credentials: 'include',
    }).then(async () => {
      await removeItemAfterBlock(info);
      resolve();
    });
  });
};
