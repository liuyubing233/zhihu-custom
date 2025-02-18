import { myStorage } from '../commons/storage';
import { dom, domById, domC, fnDomReplace, fnReturnStr } from '../commons/tools';
import { store } from '../store';
import { IBlockedUser, IZhihuCardContent } from '../types';

/** id: 同步黑名单按钮 */
const ID_BUTTON_SYNC_BLOCK = 'CTZ-BUTTON-SYNC-BLOCK';
/** class: 黑名单元素删除按钮类名 */
const CLASS_REMOVE_BLOCK = 'ctz-remove-block';
/** id: 黑名单列表 */
const ID_BLOCK_LIST = 'CTZ-BLACK-LIST';

export const CLASS_BLACK_TAG = 'ctz-black-tag';

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
      blockedUsers.push(userInfo);
      myStorage.updateConfigItem('blockedUsers', blockedUsers);
      const nodeBlackItem = domC('div', {
        className: `ctz-black-item ctz-black-id-${userInfo.id}`,
        innerHTML: blackItemContent(userInfo),
      });
      nodeBlackItem.dataset.info = JSON.stringify(userInfo);
      domById(ID_BLOCK_LIST)!.appendChild(nodeBlackItem);
      resolve();
    });
  });
};

/** 解除拉黑用户 */
export const removeBlockUser = (info: IBlockedUser) => {
  const message = '取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。';
  if (!confirm(message)) return Promise.reject();
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

const blackItem = (info: IBlockedUser) => `<div class="ctz-black-item ctz-black-id-${info.id}" data-info='${JSON.stringify(info)}'>${blackItemContent(info)}</div>`;
const blackItemContent = ({ id, name }: IBlockedUser) =>
  `<a href="https://www.zhihu.com/people/${id}" target="_blank">${name}</a><i class="${CLASS_REMOVE_BLOCK}" style="margin-left:4px;cursor:pointer;font-style: normal;">✕</i>`;

/** 初始化黑名单列表 */
export const initBlackList = async () => {
  const nodeBlank = domById(ID_BLOCK_LIST);
  if (!nodeBlank) return;
  const { blockedUsers = [] } = await myStorage.getConfig();
  nodeBlank.innerHTML = blockedUsers.map((i) => blackItem(i)).join('');
  nodeBlank.onclick = (event) => {
    const target = event.target as HTMLElement;
    if (!target || !target.classList.contains(CLASS_REMOVE_BLOCK)) return;
    const item = target.parentElement as HTMLElement;
    const info = item.dataset.info ? JSON.parse(item.dataset.info) : {};
    removeBlockUser(info);
  };
};

/** 同步黑名单 */
export function syncBlackList(offset = 0, l: IBlockedUser[] = []) {
  const nodeList = domById(ID_BLOCK_LIST);
  if (!l.length && nodeList) {
    nodeList.innerHTML = '黑名单列表加载中...';
  }

  const buttonSync = domById(ID_BUTTON_SYNC_BLOCK) as HTMLButtonElement;
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
    .then(({ data, paging }: { data: any[]; paging: any }) => {
      data.forEach(({ id, name, url_token }) => {
        l.push({ id, name, urlToken: url_token });
      });
      if (!paging.is_end) {
        syncBlackList(offset + limit, l);
        if (nodeList) {
          nodeList.innerHTML = `黑名单列表加载中（${l.length} / ${paging.totals}）...`;
        }
      } else {
        myStorage.updateConfigItem('blockedUsers', l);
        initBlackList();
        fnDomReplace(buttonSync, { innerHTML: '同步黑名单', disabled: false });
      }
    });
}

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
      await addBlockUser({ urlToken, name: userName, id: userId });
      me.innerHTML = await changeBoxHTML(true, !!objMy);
      return;
    }
    // 解除屏蔽
    if (target.classList.contains(CLASS_BTN_BLACK_REMOVE)) {
      await removeBlockUser({ urlToken, name: userName, id: userId });
      me.innerHTML = await changeBoxHTML(false, !!objMy);
      return;
    }
    // 屏蔽并隐藏回答
    if (target.classList.contains(CLASS_BTN_BLACK_FILTER)) {
      await addBlockUser({ urlToken, name: userName, id: userId });
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
