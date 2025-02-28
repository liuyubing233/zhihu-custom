import { myStorage } from '../commons/storage';
import { dom, domA, domById, domC, fnDomReplace, fnReturnStr, message } from '../commons/tools';
import { store } from '../store';
import { IBlockedUser } from '../types/blocked-users.type';
import { IZhihuCardContent } from '../types/zhihu/zhihu.type';
import { closeExtra, openExtra } from './open';

/** class: 黑名单元素删除按钮类名 */
const CLASS_REMOVE_BLOCK = 'ctz-remove-block';
/** id: 黑名单列表 */
const ID_BLOCK_LIST = 'CTA_BLOCKED_USERS';
/** id：黑名单标签列表 */
const ID_BLOCKED_USERS_TAGS = 'CTZ_BLOCKED_USERS_TAGS';
/** class: 黑名单标签删除按钮 */
const CLASS_REMOVE_BLOCKED_TAG = 'ctz-remove-blocked-tag';
/** class: 编辑用户标签 */
const CLASS_EDIT_USER_TAG = 'ctz-edit-user-tag';

export const CLASS_BLACK_TAG = 'ctz-black-tag';

/** 初始化黑名单标签 */
export const initBlockedUserTags = async () => {
  const config = await myStorage.getConfig();

  // 初始化黑名单标签列表
  const nodeBlockedUsersTags = domById(ID_BLOCKED_USERS_TAGS)!;
  nodeBlockedUsersTags.innerHTML = (config.blockedUsersTags || [])
    .map(
      (i) =>
        `<span class="ctz-blocked-users-tag" data-info="${i}">${
          i + `<i class="${CLASS_REMOVE_BLOCKED_TAG}" style="margin-left:4px;cursor:pointer;font-style: normal;font-size:12px;">✕</i>`
        }</span>`
    )
    .join('');
  nodeBlockedUsersTags.onclick = async (event) => {
    const { blockedUsers = [], blockedUsersTags = [] } = await myStorage.getConfig();
    const target = event.target as HTMLElement;
    if (!target || !target.classList.contains(CLASS_REMOVE_BLOCKED_TAG)) return;
    const item = target.parentElement as HTMLElement;
    const info = item.dataset.info || '';
    const isUsed = blockedUsers.some((item) => {
      if (item.tags && item.tags.length) {
        return item.tags.some((i) => i === info);
      }
      return false;
    });

    if (isUsed) {
      message('此标签有黑名单用户正在使用');
      return;
    }
    item.remove();
    const index = blockedUsersTags.findIndex((i) => i === info);
    blockedUsersTags.splice(index, 1);
    myStorage.updateConfigItem('blockedUsersTags', blockedUsersTags);
  };

  dom('input[name="inputBlockedUsersTag"]')!.onchange = async (e) => {
    const { blockedUsersTags = [] } = await myStorage.getConfig();
    const target = e.target as HTMLInputElement;
    const value = target.value.toLowerCase();
    if (blockedUsersTags.includes(value)) {
      message('该标签已经存在');
      return;
    }
    blockedUsersTags.push(value);
    await myStorage.updateConfigItem('blockedUsersTags', blockedUsersTags);
    const domItem = domC('span', {
      innerHTML: value + `<i class="${CLASS_REMOVE_BLOCKED_TAG}" style="margin-left:4px;cursor:pointer;font-style: normal;font-size:12px;">✕</i>`,
      className: 'ctz-blocked-users-tag',
    });
    domItem.dataset.info = value;
    domById(ID_BLOCKED_USERS_TAGS)!.appendChild(domItem);
    target.value = '';
  };
};

const blackItemContent = ({ id, name, tags = [] }: IBlockedUser) =>
  `<a href="https://www.zhihu.com/people/${id}" target="_blank">${name}</a>` +
  tags.map((tag) => `<span class="ctz-in-blocked-user-tag">${tag}</span>`).join('') +
  `<span class="${CLASS_EDIT_USER_TAG}">✎</span>` +
  `<i class="${CLASS_REMOVE_BLOCK}">✕</i>`;

/** 初始化黑名单列表 */
export const initBlockedUsers = async () => {
  const config = await myStorage.getConfig();
  // 初始化黑名单列表
  const nodeBlockedUsers = domById(ID_BLOCK_LIST)!;
  nodeBlockedUsers.innerHTML = (config.blockedUsers || [])
    .map((info) => `<div class="ctz-black-item ctz-black-id-${info.id}" data-info='${JSON.stringify(info)}'>${blackItemContent(info)}</div>`)
    .join('');

  nodeBlockedUsers.onclick = async (event) => {
    // 黑名单列表点击
    const target = event.target as HTMLElement;
    const item = target.parentElement as HTMLElement;
    const info = item.dataset.info ? JSON.parse(item.dataset.info) : {};

    // 删除黑名单用户
    if (target.classList.contains(CLASS_REMOVE_BLOCK)) {
      removeBlockUser(info);
      return;
    }

    // 编辑用户标签
    if (target.classList.contains(CLASS_EDIT_USER_TAG)) {
      openExtra('chooseBlockedUserTags');
      const { blockedUsers = [], blockedUsersTags = [] } = await myStorage.getConfig();
      const currentTags = info.tags || [];
      dom('[data-type="chooseBlockedUserTags"] .ctz-title')!.innerText = `设置标签：${info.name}`;

      const boxTags = dom('.ctz-choose-blocked-user-tags')!;
      boxTags.innerHTML = blockedUsersTags.map((i) => `<span data-type="blockedUserTag" data-name="${i}" data-choose="${currentTags.includes(i)}">${i}</span>`).join('');
      boxTags.onclick = (event) => {
        const target = event.target as HTMLElement;
        if (target.dataset.type === 'blockedUserTag') {
          target.dataset.choose = target.dataset.choose === 'true' ? 'false' : 'true';
        }
      };

      dom('[name="choose-blocked-user-tags-finish"]')!.onclick = async () => {
        const chooseTags: string[] = [...dom('.ctz-choose-blocked-user-tags')!.children]
          .filter((i) => (i as HTMLElement).dataset.choose === 'true')
          .map((i) => (i as HTMLElement).dataset.name!);

        info.tags = chooseTags;
        blockedUsers.forEach((item) => {
          if (item.id === info.id) {
            item.tags = chooseTags;
          }
        });
        item.innerHTML = blackItemContent(info);
        await myStorage.updateConfigItem('blockedUsers', blockedUsers);
        closeExtra();
      };
      return;
    }
  };
};

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
  const headers = store.getStorageConfigItem('fetchHeaders') as HeadersInit;
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
        initBlockedUsers();
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
    const headers = store.getStorageConfigItem('fetchHeaders') as HeadersInit;
    fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
      method: 'POST',
      headers: new Headers({
        ...headers,
        'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)![0] || '',
      }),
      credentials: 'include',
    }).then(async () => {
      const blockedUsers = (await myStorage.getConfig()).blockedUsers || [];
      blockedUsers.unshift(userInfo);
      myStorage.updateConfigItem('blockedUsers', blockedUsers);
      const nodeUserItem = domC('div', {
        className: `ctz-black-item ctz-black-id-${userInfo.id}`,
        innerHTML: blackItemContent(userInfo),
      });
      nodeUserItem.dataset.info = JSON.stringify(userInfo);
      const nodeUsers = domById(ID_BLOCK_LIST)!;
      nodeUsers.insertBefore(nodeUserItem, nodeUsers.children[0]);
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
    const headers = store.getStorageConfigItem('fetchHeaders') as HeadersInit;
    fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
      method: 'DELETE',
      headers: new Headers({
        ...headers,
        'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)![0] || '',
      }),
      credentials: 'include',
    }).then(async () => {
      const blockedUsers = (await myStorage.getConfig()).blockedUsers || [];
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

const CLASS_ANSWER_BLACK_BOX = 'ctz-answer-black-box';
const CLASS_BTN_BLACK = 'ctz-answer-black-add';
const CLASS_BTN_BLACK_REMOVE = 'ctz-answer-black-remove';
const CLASS_BTN_BLACK_FILTER = 'ctz-answer-black-filter';

/** 添加「屏蔽用户」按钮，第二个参数为监听方法对象 */
export const answerAddBlockButton = async (event: HTMLElement, objMy?: any) => {
  if (event.querySelector(`.${CLASS_ANSWER_BLACK_BOX}`)) return;
  const nodeUser = event.querySelector('.AnswerItem-authorInfo>.AuthorInfo') as HTMLElement;
  if (!nodeUser || !nodeUser.offsetHeight) return;
  const userUrl = (nodeUser.querySelector('meta[itemprop="url"]') as HTMLMetaElement).content;
  const userName = (nodeUser.querySelector('meta[itemprop="name"]') as HTMLMetaElement).content;
  const nodeAnswerItem = event.querySelector('.AnswerItem');
  const mo = nodeAnswerItem ? nodeAnswerItem.getAttribute('data-za-extra-module') || '{}' : '{}';
  if (!JSON.parse(mo).card) return;
  const aContent: IZhihuCardContent = JSON.parse(mo).card.content;
  const userId = aContent.author_member_hash_id || '';
  if (!userUrl.replace(/https:\/\/www.zhihu.com\/people\//, '')) return;
  const { blockedUsers = [] } = await myStorage.getConfig();
  const isBlocked = blockedUsers.findIndex((i) => i.id === userId) >= 0;

  const nBlackBox = domC('div', { className: CLASS_ANSWER_BLACK_BOX, innerHTML: await changeBoxHTML(isBlocked, !!objMy) });
  nBlackBox.onclick = async function (ev) {
    const target = ev.target as HTMLElement;
    const matched = userUrl.match(/(?<=people\/)[\w\W]+/);
    const urlToken = matched ? matched[0] : '';
    const me = this as HTMLElement;
    // 屏蔽用户
    if (target.classList.contains(CLASS_BTN_BLACK)) {
      await addBlockUser({ id: userId, name: userName, urlToken });
      me.innerHTML = await changeBoxHTML(true, !!objMy);
      return;
    }
    // 解除屏蔽
    if (target.classList.contains(CLASS_BTN_BLACK_REMOVE)) {
      await removeBlockUser({ id: userId, name: userName, urlToken });
      me.innerHTML = await changeBoxHTML(false, !!objMy);
      return;
    }
    // 屏蔽并隐藏回答
    if (target.classList.contains(CLASS_BTN_BLACK_FILTER)) {
      await addBlockUser({ id: userId, name: userName, urlToken });
      event.style.display = 'none';
      if (objMy) {
        objMy.index = objMy.index - 1 > 0 ? objMy.index - 1 : 0;
      }
      return;
    }
  };
  nodeUser.appendChild(nBlackBox);
};

const changeBoxHTML = async (isBlocked: boolean, showHidden?: boolean) => {
  const { showBlockUserTag, showBlockUser } = await myStorage.getConfig();
  if (isBlocked) {
    return (
      fnReturnStr(`<span class="${CLASS_BLACK_TAG}">黑名单</span>`, showBlockUserTag) +
      fnReturnStr(`<button class="${CLASS_BTN_BLACK_REMOVE} ctz-button">解除屏蔽</button>`, showBlockUser)
    );
  } else {
    return fnReturnStr(
      `<button class="${CLASS_BTN_BLACK} ctz-button">屏蔽</button>` + fnReturnStr(`<button class="${CLASS_BTN_BLACK_FILTER} ctz-button">屏蔽并隐藏回答</button>`, showHidden),
      showBlockUser
    );
  }
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
          initBlockedUsers();
        }
      });
    }
  }
};
