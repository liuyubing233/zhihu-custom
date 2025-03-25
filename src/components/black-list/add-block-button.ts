import { domC, fnReturnStr, myStorage } from '../../tools';
import { IZhihuCardContent } from '../../types/zhihu/zhihu.type';
import { CLASS_BLACK_TAG } from './create-html';
import { addBlockUser, removeBlockUser } from './do-fetch';
import { IBlockedUser } from './types';

/** class：黑名单模块盒子 */
export const CLASS_BLOCK_USER_BOX = 'ctz-block-user-box';
/** class：屏蔽用户 */
export const CLASS_BTN_ADD_BLOCKED = 'ctz-block-add-blocked';
/** class：移除屏蔽 */
export const CLASS_BTN_REMOVE_BLOCKED = 'ctz-block-remove-blocked';

/** 添加「屏蔽用户」按钮*/
export const answerAddBlockButton = async (contentItem: HTMLElement) => {
  const nodeUser = contentItem.querySelector('.AnswerItem-authorInfo>.AuthorInfo') as HTMLElement;
  if (!nodeUser || !nodeUser.offsetHeight) return;
  if (nodeUser.querySelector(`.${CLASS_BLOCK_USER_BOX}`)) return;
  const userUrl = (nodeUser.querySelector('meta[itemprop="url"]') as HTMLMetaElement).content;
  const userName = (nodeUser.querySelector('meta[itemprop="name"]') as HTMLMetaElement).content;
  const mo =  contentItem.getAttribute('data-za-extra-module') || '{}'
  if (!JSON.parse(mo).card) return;
  const aContent: IZhihuCardContent = JSON.parse(mo).card.content;
  const userId = aContent.author_member_hash_id || '';
  if (!userUrl.replace(/https:\/\/www.zhihu.com\/people\//, '')) return;

  const { blockedUsers = [], showBlockUserTag, showBlockUser, showBlockUserTagType } = await myStorage.getConfig();

  const blockedUserInfo = blockedUsers.find((i) => i.id === userId);
  const nBlackBox = domC('div', {
    className: CLASS_BLOCK_USER_BOX,
    innerHTML: changeBlockedUsersBox(!!blockedUserInfo, showBlockUser, showBlockUserTag, showBlockUserTagType, blockedUserInfo),
  });
  nBlackBox.onclick = async function (ev) {
    const target = ev.target as HTMLElement;
    const matched = userUrl.match(/(?<=people\/)[\w\W]+/);
    const urlToken = matched ? matched[0] : '';
    const me = this as HTMLElement;
    // 屏蔽用户
    if (target.classList.contains(CLASS_BTN_ADD_BLOCKED)) {
      await addBlockUser({ id: userId, name: userName, urlToken });
      me.innerHTML = changeBlockedUsersBox(true, showBlockUser, showBlockUserTag, showBlockUserTagType);
      return;
    }
    // 解除屏蔽
    if (target.classList.contains(CLASS_BTN_REMOVE_BLOCKED)) {
      await removeBlockUser({ id: userId, name: userName, urlToken });
      me.innerHTML = changeBlockedUsersBox(false, showBlockUser, showBlockUserTag, showBlockUserTagType);
      return;
    }
  };
  nodeUser.appendChild(nBlackBox);
};

/**
 * 修改黑名单盒子
 * @param isBlocked 是否是黑名单用户
 * @param showBlock 显示屏蔽用户按钮
 * @param showBlockTag 显示黑名单用户标签
 * @param showBlockTagType 黑名单用户标签显示类型
 * @param userinfo 黑名单用户信息
 */
export const changeBlockedUsersBox = (isBlocked: boolean, showBlock?: boolean, showBlockTag?: boolean, showBlockTagType?: boolean, userinfo?: IBlockedUser) => {
  if (isBlocked) {
    return (
      fnReturnStr(
        `<span class="${CLASS_BLACK_TAG}">黑名单${showBlockTagType && userinfo && userinfo.tags && userinfo.tags.length ? '：' + userinfo.tags.join('、') : ''}</span>`,
        showBlockTag
      ) + fnReturnStr(`<button class="${CLASS_BTN_REMOVE_BLOCKED} ctz-button">解除屏蔽</button>`, showBlock)
    );
  } else {
    return fnReturnStr(`<button class="${CLASS_BTN_ADD_BLOCKED} ctz-button">屏蔽用户</button>`, showBlock);
  }
};
