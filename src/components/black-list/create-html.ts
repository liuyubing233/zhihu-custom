import { dom, domById, domC, message, myStorage } from '../../tools';
import { closeExtra, openExtra } from '../ctz-dialog';
import { addBlockUser, removeBlockUser } from './do-fetch';
import {
  BLOCKED_USER_LIST_CONFIG_KEY,
  BLOCKED_USER_LIST_TYPE,
  getBlockedUsersByType,
  IBlockedUser,
  mergeBlockedUser,
  TBlockedUserListType,
} from './types';

/** id：黑名单标签列表 */
const ID_BLOCKED_USERS_TAGS = 'CTZ_BLOCKED_USERS_TAGS';
/** class: 黑名单标签删除按钮 */
const CLASS_REMOVE_BLOCKED_TAG = 'ctz-remove-blocked-tag';
/** class: 黑名单用户操作菜单 */
const CLASS_BLACK_ITEM_MORE = 'ctz-black-item-more';
const CLASS_BLACK_ITEM_ACTION = 'ctz-black-item-action';
const ID_BLOCKED_USER_MENU = 'CTZ_BLOCKED_USER_MENU';
/** class: 修改标签名 */
const CLASS_EDIT_TAG = 'ctz-edit-blocked-tag';

/** id: 知乎黑名单列表 */
export const ID_BLOCK_LIST = 'CTA_BLOCKED_USERS';
/** id: 本地黑名单列表 */
export const ID_LOCAL_BLOCK_LIST = 'CTA_LOCAL_BLOCKED_USERS';
/** class: 黑名单标签 */
export const CLASS_BLACK_TAG = 'ctz-black-tag';
const REPLACE_DISABLED_SWITCH_NAMES = ['removeBlockUserContent', 'removeBlockUserComment'];
const BLOCKED_USER_LIST_ID: Record<TBlockedUserListType, string> = {
  zhihu: ID_BLOCK_LIST,
  local: ID_LOCAL_BLOCK_LIST,
};

/** 替换模式开启时，原黑名单隐藏开关不再生效 */
export const changeReplaceBlockUserSwitchDisabled = (disabled?: boolean) => {
  REPLACE_DISABLED_SWITCH_NAMES.forEach((name) => {
    const input = dom(`[name="${name}"]`) as HTMLInputElement;
    input && (input.disabled = !!disabled);
  });
};

const escapeHTML = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const encodeBlockedUserInfo = (info: IBlockedUser) => encodeURIComponent(JSON.stringify(info));

const getBlockedUserInfoFromItem = (item: HTMLElement): IBlockedUser => {
  try {
    return item.dataset.info ? JSON.parse(decodeURIComponent(item.dataset.info)) : { id: '', name: '', urlToken: '' };
  } catch {
    return { id: '', name: '', urlToken: '' };
  }
};

const getBlockedUserListTypeFromItem = (item: HTMLElement): TBlockedUserListType =>
  item.dataset.listType === BLOCKED_USER_LIST_TYPE.local ? BLOCKED_USER_LIST_TYPE.local : BLOCKED_USER_LIST_TYPE.zhihu;

export const blackItemContent = ({ id, name, urlToken, tags = [] }: IBlockedUser, listType: TBlockedUserListType = BLOCKED_USER_LIST_TYPE.zhihu) => {
  return (
    `<a href="https://www.zhihu.com/people/${escapeHTML(urlToken || id)}" target="_blank">${escapeHTML(name)}</a>` +
    tags.map((tag) => `<span class="ctz-in-blocked-user-tag">${escapeHTML(tag)}</span>`).join('') +
    `<i class="${CLASS_BLACK_ITEM_MORE}">···</i>`
  );
};

const tagContext = (i: string) =>
  escapeHTML(i) + `<span class="${CLASS_EDIT_TAG}">✎</span>` + `<i class="${CLASS_REMOVE_BLOCKED_TAG}" style="margin-left:4px;cursor:pointer;font-style: normal;font-size:12px;">✕</i>`;

const tagInputCallback = async (e: Event) => {
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
    innerHTML: tagContext(value),
    className: 'ctz-blocked-users-tag',
  });
  domItem.dataset.info = value;
  domById(ID_BLOCKED_USERS_TAGS)!.appendChild(domItem);
  target.value = '';
};

/** 初始化黑名单标签 */
const initHTMLBlockedUserTags = async (domMain: HTMLElement) => {
  const prevConfig = await myStorage.getConfig();

  // 初始化黑名单标签列表
  const nodeBlockedUsersTags = dom(`#${ID_BLOCKED_USERS_TAGS}`, domMain)!;
  nodeBlockedUsersTags.innerHTML = (prevConfig.blockedUsersTags || []).map((i) => `<span class="ctz-blocked-users-tag" data-info="${escapeHTML(i)}">${tagContext(i)}</span>`).join('');
  nodeBlockedUsersTags.onclick = async (event) => {
    const nConfig = await myStorage.getConfig();
    const { blockedUsers = [], localBlockedUsers = [], blockedUsersTags = [] } = nConfig;
    const target = event.target as HTMLElement;

    // 删除标签
    if (target.classList.contains(CLASS_REMOVE_BLOCKED_TAG)) {
      const item = target.parentElement as HTMLElement;
      const info = item.dataset.info || '';
      const isUsed = [...blockedUsers, ...localBlockedUsers].some((item) => {
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
    }

    // 修改标签名
    if (target.classList.contains(CLASS_EDIT_TAG)) {
      const { blockedUsers = [], localBlockedUsers = [], blockedUsersTags = [] } = await myStorage.getConfig();
      const item = target.parentElement as HTMLElement;
      const prevName = item.dataset.info || '';
      openExtra('changeBlockedUserTagName');

      dom('[data-type="changeBlockedUserTagName"] .ctz-title')!.innerHTML = `修改标签名（原名称： ${prevName}）`;
      (dom('[name="blocked-user-tag-name"]') as HTMLInputElement).value = prevName;

      // 确认
      dom('[name="confirm-change-blocked-user-tag-name"]')!.onclick = async function () {
        const nInfo = (dom('[name="blocked-user-tag-name"]') as HTMLInputElement).value;
        const indexTag = blockedUsersTags.findIndex((i) => i === prevName);
        blockedUsersTags.splice(indexTag, 1, nInfo);
        [...blockedUsers, ...localBlockedUsers].forEach((item) => {
          if (!item.tags) return;
          const nIndex = (item.tags || []).findIndex((i) => i === prevName);
          if (nIndex >= 0) {
            item.tags.splice(nIndex, 1, nInfo);
          }
        });
        await myStorage.updateConfig({
          ...nConfig,
          blockedUsersTags,
          blockedUsers,
          localBlockedUsers,
        });

        initHTMLBlockedUserTags(domMain);
        initHTMLBlockedUsers(domMain);
        closeExtra();
      };

      // 取消
      dom('[name="cancel-change-blocked-user-tag-name"]')!.onclick = function () {
        closeExtra();
      };
    }
  };

  dom('input[name="inputBlockedUsersTag"]', domMain)!.onchange = tagInputCallback;

  dom('input[name="inputCreateNewTag"]')!.onchange = async (e) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.toLowerCase();
    await tagInputCallback(e);
    const boxTags = dom('.ctz-choose-blocked-user-tags')!;
    const nTag = domC('span', {
      innerHTML: escapeHTML(value),
    });
    nTag.dataset.choose = 'false';
    nTag.dataset.type = 'blockedUserTag';
    nTag.dataset.name = value;
    boxTags.appendChild(nTag);
  };
};

/** 初始化黑名单列表 */
export const initHTMLBlockedUsers = async (domMain: HTMLElement) => {
  removeBlockedUserMenu();
  const { blockedUsers = [], localBlockedUsers = [] } = await myStorage.getConfig();

  dom('#CTZ_BLOCKED_NUMBER', domMain)!.innerText = blockedUsers.length ? `知乎黑名单数量：${blockedUsers.length}` : '';
  dom('#CTZ_LOCAL_BLOCKED_NUMBER', domMain)!.innerText = localBlockedUsers.length ? `本地黑名单数量：${localBlockedUsers.length}` : '';

  renderBlockedUserList(domMain, blockedUsers, BLOCKED_USER_LIST_TYPE.zhihu);
  renderBlockedUserList(domMain, localBlockedUsers, BLOCKED_USER_LIST_TYPE.local);
};

const renderBlockedUserList = (domMain: HTMLElement, list: IBlockedUser[], listType: TBlockedUserListType) => {
  const nodeBlockedUsers = dom(`#${BLOCKED_USER_LIST_ID[listType]}`, domMain)!;
  nodeBlockedUsers.innerHTML = list.map((info) => createBlockedUserItemHTML(info, listType)).join('');
  nodeBlockedUsers.onclick = (event) => onBlockedUserListClick(event, listType);
};

const createBlockedUserItemHTML = (info: IBlockedUser, listType: TBlockedUserListType) =>
  `<div class="ctz-black-item ctz-black-id-${escapeHTML(info.id)}" data-list-type="${listType}" data-info="${encodeBlockedUserInfo(info)}">${blackItemContent(
    info,
    listType
  )}</div>`;

const onBlockedUserListClick = async (event: MouseEvent, defaultListType: TBlockedUserListType) => {
  const target = event.target as HTMLElement;
  const item = target.closest('.ctz-black-item') as HTMLElement | null;
  if (!item) return;

  if (target.classList.contains(CLASS_BLACK_ITEM_MORE)) {
    const listType = item.dataset.listType ? getBlockedUserListTypeFromItem(item) : defaultListType;
    openBlockedUserMenu(target, item, listType);
    return;
  }
};

const onBlockedUserAction = async (action: string, item: HTMLElement, listType: TBlockedUserListType) => {
  const info = getBlockedUserInfoFromItem(item);
  if (!info.id) return;

  if (action === 'tags') {
    chooseBlockedUserTags(item);
    return;
  }

  if (action === 'move') {
    if (listType === BLOCKED_USER_LIST_TYPE.zhihu) {
      await moveBlockedUserToLocal(info);
    } else {
      const movedType = await addBlockUser(info, { openTagChoose: false });
      movedType === BLOCKED_USER_LIST_TYPE.zhihu && message('已移动至知乎黑名单');
    }
    return;
  }

  if (action === 'remove') {
    if (listType === BLOCKED_USER_LIST_TYPE.zhihu) {
      removeBlockUser(info);
    } else {
      await removeLocalBlockedUser(info);
    }
  }
};

const removeBlockedUserMenu = () => {
  domById(ID_BLOCKED_USER_MENU)?.remove();
};

const openBlockedUserMenu = (button: HTMLElement, item: HTMLElement, listType: TBlockedUserListType) => {
  removeBlockedUserMenu();
  const moveText = listType === BLOCKED_USER_LIST_TYPE.zhihu ? '移动至本地黑名单' : '移动至知乎黑名单';
  const nodeMenu = domC('div', {
    id: ID_BLOCKED_USER_MENU,
    className: 'ctz-black-item-menu',
    innerHTML:
      `<span class="${CLASS_BLACK_ITEM_ACTION}" data-action="tags">设置标签</span>` +
      `<span class="${CLASS_BLACK_ITEM_ACTION}" data-action="move">${moveText}</span>` +
      `<span class="${CLASS_BLACK_ITEM_ACTION}" data-action="remove">从黑名单移除</span>`,
  });

  nodeMenu.onclick = async (event) => {
    const actionNode = (event.target as HTMLElement).closest(`.${CLASS_BLACK_ITEM_ACTION}`) as HTMLElement | null;
    if (!actionNode || !actionNode.dataset.action) return;
    removeBlockedUserMenu();
    await onBlockedUserAction(actionNode.dataset.action, item, listType);
  };

  document.body.appendChild(nodeMenu);
  const rect = button.getBoundingClientRect();
  const menuRect = nodeMenu.getBoundingClientRect();
  let left = Math.min(Math.max(rect.left, 8), window.innerWidth - menuRect.width - 8);
  let top = rect.bottom + 6;
  if (top + menuRect.height > window.innerHeight - 8) {
    top = rect.top - menuRect.height - 6;
  }
  nodeMenu.style.left = `${left}px`;
  nodeMenu.style.top = `${Math.max(top, 8)}px`;
  setTimeout(() => {
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest(`#${ID_BLOCKED_USER_MENU}`) && !target.classList.contains(CLASS_BLACK_ITEM_MORE)) {
          removeBlockedUserMenu();
        }
      },
      { once: true }
    );
  });
};

const removeLocalBlockedUser = async (info: IBlockedUser) => {
  const config = await myStorage.getConfig();
  await myStorage.updateConfig({
    ...config,
    localBlockedUsers: (config.localBlockedUsers || []).filter((item) => item.id !== info.id),
  });
  initHTMLBlockedUsers(document.body);
};

const moveBlockedUserToLocal = async (info: IBlockedUser) => {
  await removeBlockUser(info, false);
  const config = await myStorage.getConfig();
  const localBlockedUsers = config.localBlockedUsers || [];
  const localUser = localBlockedUsers.find((item) => item.id === info.id);
  await myStorage.updateConfig({
    ...config,
    localBlockedUsers: [mergeBlockedUser(localUser, info), ...localBlockedUsers.filter((item) => item.id !== info.id)],
  });
  initHTMLBlockedUsers(document.body);
  message('已移动至本地黑名单');
};

/**
 * 编辑用户标签
 * @param item 黑名单列表ITEM
 */
export const chooseBlockedUserTags = async (item: HTMLElement, needCover = true) => {
  const info = getBlockedUserInfoFromItem(item);
  const listType = getBlockedUserListTypeFromItem(item);
  openExtra('chooseBlockedUserTags', needCover);
  const config = await myStorage.getConfig();
  const { blockedUsersTags = [] } = config;
  const blockedUsers = getBlockedUsersByType(config, listType);
  const currentTags = info.tags || [];

  dom('[data-type="chooseBlockedUserTags"] .ctz-title')!.innerText = `选择用户标签：${info.name}`;

  const boxTags = dom('.ctz-choose-blocked-user-tags')!;
  boxTags.innerHTML = blockedUsersTags
    .map((i) => `<span data-type="blockedUserTag" data-name="${escapeHTML(i)}" data-choose="${currentTags.includes(i)}">${escapeHTML(i)}</span>`)
    .join('');
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
    blockedUsers.forEach((i) => {
      if (i.id === info.id) {
        i.tags = chooseTags;
        info.name = i.name;
      }
    });

    item.innerHTML = blackItemContent(info, listType);
    item.dataset.info = encodeBlockedUserInfo(info);
    await myStorage.updateConfigItem(BLOCKED_USER_LIST_CONFIG_KEY[listType], blockedUsers);
    closeExtra();
  };
};

/** 初始化黑名单设置，创建黑名单设置元素 */
export const echoBlockedContent = (domMain: HTMLElement) => {
  initHTMLBlockedUserTags(domMain);
  initHTMLBlockedUsers(domMain);
};
