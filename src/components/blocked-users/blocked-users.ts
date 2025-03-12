import { store } from '../../store';
import { dom, domA, domById, domC, fnDomReplace, myStorage } from '../../tools';
import { blackItemContent, chooseBlockedUserTags, ID_BLOCK_LIST, initHTMLBlockedUsers } from './create-html';
import { IBlockedUser } from './types';

/** 同步黑名单 */
export function syncBlackList(offset = 0, l: IBlockedUser[] = []) {
  const nodeList = domById(ID_BLOCK_LIST);
  if (!l.length && nodeList) {
    nodeList.innerHTML = '黑名单列表加载中...';
  }

  const buttonSync = dom('button[name="syncBlack"]') as HTMLButtonElement;
  if (!buttonSync.querySelector('ctz-loading')) {
    fnDomReplace(buttonSync, { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
  }

  const limit = 20;
  const headers = store.getFetchHeaders();
  fetch(`https://www.zhihu.com/api/v3/settings/blocked_users?offset=${offset}&limit=${limit}`, {
    method: 'GET',
    headers: new Headers(headers),
    credentials: 'include',
  })
    .then((response) => response.json())
    .then(async ({ data, paging }: { data: any[]; paging: any }) => {
      const prevConfig = await myStorage.getConfig();
      const { blockedUsers = [] } = prevConfig;

      data.forEach(({ id, name, url_token }) => {
        const findItem = blockedUsers.find((i) => i.id === id);
        l.push({ id, name, urlToken: url_token, tags: (findItem && findItem.tags) || [] });
      });
      if (!paging.is_end) {
        syncBlackList(offset + limit, l);
        if (nodeList) {
          nodeList.innerHTML = `黑名单列表加载中（${l.length} / ${paging.totals}）...`;
        }
      } else {
        await myStorage.updateConfigItem('blockedUsers', l);
        initHTMLBlockedUsers(document.body);
        fnDomReplace(buttonSync, { innerHTML: '同步黑名单', disabled: false });
      }
    });
}

/** 拉黑用户（屏蔽用户）方法 */
export const addBlockUser = (userInfo: IBlockedUser) => {
  const { name, urlToken } = userInfo;
  const message = `是否要屏蔽${name}？\n屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。`;
  if (!confirm(message)) return Promise.reject();
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
        chooseBlockedUserTags(nodeUserItem);
      }
      resolve();
    });
  });
};

/** 解除拉黑用户 */
export const removeBlockUser = (info: IBlockedUser, needConfirm = true) => {
  if (needConfirm) {
    const message = '取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。';
    if (!confirm(message)) return Promise.reject();
  }
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
      const { blockedUsers = [] } = await myStorage.getConfig();
      const itemIndex = blockedUsers.findIndex((i) => i.id === info.id);
      if (itemIndex >= 0) {
        blockedUsers.splice(itemIndex, 1);
        const removeItem = dom(`.ctz-black-id-${id}`);
        removeItem && removeItem.remove();
        myStorage.updateConfigItem('blockedUsers', blockedUsers);
      }
      resolve();
    });
  });
};

/** 清空黑名单列表 */
export const syncRemoveBlockedUsers = () => {
  if (!confirm('您确定要取消屏蔽所有黑名单用户吗？')) return;
  if (!confirm('确定清空所有屏蔽用户？')) return;

  const buttonSync = dom('button[name="syncBlackRemove"]') as HTMLButtonElement;
  if (!buttonSync.querySelector('ctz-loading')) {
    fnDomReplace(buttonSync, { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
  }

  const removeButtons = domA('.ctz-remove-block');
  const len = removeButtons.length;
  let finishNumber = 0;

  if (!removeButtons.length) return;
  for (let i = 0; i < len; i++) {
    const item = removeButtons[i] as HTMLElement;
    const itemParent = item.parentElement!;
    const info = itemParent.dataset.info ? JSON.parse(itemParent.dataset.info) : {};
    if (info.id) {
      removeBlockUser(info, false).then(async () => {
        finishNumber++;
        itemParent.remove();
        if (finishNumber === len) {
          fnDomReplace(buttonSync, { innerHTML: '清空黑名单列表', disabled: false });
          await myStorage.updateConfigItem('blockedUsers', []);
          initHTMLBlockedUsers(document.body);
        }
      });
    }
  }
};
