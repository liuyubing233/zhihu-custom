import { dom, domById, domC, message, myStorage } from '../../tools';
import { closeExtra, openExtra } from '../open';
import { removeBlockUser } from './do-fetch';
import { IBlockedUser } from './types';

/** id：黑名单标签列表 */
const ID_BLOCKED_USERS_TAGS = 'CTZ_BLOCKED_USERS_TAGS';
/** class: 黑名单标签删除按钮 */
const CLASS_REMOVE_BLOCKED_TAG = 'ctz-remove-blocked-tag';
/** class: 黑名单元素删除按钮类名 */
const CLASS_REMOVE_BLOCK = 'ctz-remove-block';
/** class: 编辑用户标签 */
const CLASS_EDIT_USER_TAG = 'ctz-edit-user-tag';
/** class: 修改标签名 */
const CLASS_EDIT_TAG = 'ctz-edit-blocked-tag';

/** id: 黑名单列表 */
export const ID_BLOCK_LIST = 'CTA_BLOCKED_USERS';
/** class: 黑名单标签 */
export const CLASS_BLACK_TAG = 'ctz-black-tag';

export const blackItemContent = ({ id, name, tags = [] }: IBlockedUser) =>
  `<a href="https://www.zhihu.com/people/${id}" target="_blank">${name}</a>` +
  tags.map((tag) => `<span class="ctz-in-blocked-user-tag">${tag}</span>`).join('') +
  `<span class="${CLASS_EDIT_USER_TAG}">✎</span>` +
  `<i class="${CLASS_REMOVE_BLOCK}">✕</i>`;

/** 初始化黑名单标签 */
const initHTMLBlockedUserTags = async (domMain: HTMLElement) => {
  const prevConfig = await myStorage.getConfig();

  // 初始化黑名单标签列表
  const nodeBlockedUsersTags = dom(`#${ID_BLOCKED_USERS_TAGS}`, domMain)!;
  nodeBlockedUsersTags.innerHTML = (prevConfig.blockedUsersTags || [])
    .map(
      (i) =>
        `<span class="ctz-blocked-users-tag" data-info="${i}">${
          i + `<span class="${CLASS_EDIT_TAG}">✎</span>` + `<i class="${CLASS_REMOVE_BLOCKED_TAG}" style="margin-left:4px;cursor:pointer;font-style: normal;font-size:12px;">✕</i>`
        }</span>`
    )
    .join('');
  nodeBlockedUsersTags.onclick = async (event) => {
    const nConfig = await myStorage.getConfig();
    const { blockedUsers = [], blockedUsersTags = [] } = nConfig;
    const target = event.target as HTMLElement;

    // 删除标签
    if (target.classList.contains(CLASS_REMOVE_BLOCKED_TAG)) {
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
    }

    // 修改标签名
    if (target.classList.contains(CLASS_EDIT_TAG)) {
      const { blockedUsers = [], blockedUsersTags = [] } = await myStorage.getConfig();
      const item = target.parentElement as HTMLElement;
      const info = item.dataset.info || '';
      openExtra('changeBlockedUserTagName');

      dom('[data-type="changeBlockedUserTagName"] .ctz-title')!.innerHTML = `修改标签名（原名称： ${info}）`;
      (dom('[name="blocked-user-tag-name"]') as HTMLInputElement).value = info;

      // 确认
      dom('[name="confirm-change-blocked-user-tag-name"]')!.onclick = async function () {
        const nInfo = (dom('[name="blocked-user-tag-name"]') as HTMLInputElement).value;
        const indexTag = blockedUsersTags.findIndex((i) => i === info);
        blockedUsersTags.splice(indexTag, 1, nInfo);
        blockedUsers.forEach((item) => {
          if (!item.tags) return;
          const nIndex = (item.tags || []).findIndex((i) => i === info);
          if (nIndex >= 0) {
            item.tags.splice(indexTag, 1, nInfo);
          }
        });
        await myStorage.updateConfig({
          ...nConfig,
          blockedUsersTags,
          blockedUsers,
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

  dom('input[name="inputBlockedUsersTag"]', domMain)!.onchange = async (e) => {
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

/** 初始化黑名单列表 */
export const initHTMLBlockedUsers = async (domMain: HTMLElement) => {
  const { blockedUsers = [] } = await myStorage.getConfig();

  dom('#CTZ_BLOCKED_NUMBER', domMain)!.innerText = blockedUsers.length ? `黑名单数量：${blockedUsers.length}` : '';

  const nodeBlockedUsers = dom(`#${ID_BLOCK_LIST}`, domMain)!;
  nodeBlockedUsers.innerHTML = blockedUsers
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
      chooseBlockedUserTags(item);
      return;
    }
  };
};

/**
 * 编辑用户标签
 * @param item 黑名单列表ITEM
 */
export const chooseBlockedUserTags = async (item: HTMLElement, needCover = true) => {
  const info = item.dataset.info ? JSON.parse(item.dataset.info) : {};
  openExtra('chooseBlockedUserTags', needCover);
  const { blockedUsers = [], blockedUsersTags = [] } = await myStorage.getConfig();
  const currentTags = info.tags || [];

  dom('[data-type="chooseBlockedUserTags"] .ctz-title')!.innerText = `选择用户标签：${info.name}`;

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
    blockedUsers.forEach((i) => {
      if (i.id === info.id) {
        i.tags = chooseTags;
      }
    });

    item.innerHTML = blackItemContent(info);
    item.dataset.info = JSON.stringify(info);
    await myStorage.updateConfigItem('blockedUsers', blockedUsers);
    closeExtra();
  };
};

/** 初始化黑名单设置，创建黑名单设置元素 */
export const echoBlockedContent = (domMain: HTMLElement) => {
  initHTMLBlockedUserTags(domMain);
  initHTMLBlockedUsers(domMain);
};
