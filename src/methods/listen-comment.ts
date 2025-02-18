import { myStorage } from '../commons/storage';
import { createButtonFontSize12, dom, domC, fnLog } from '../commons/tools';
import { store } from '../store';
import { IBlockedUser } from '../types';
import { myBlack } from './black';

/** 格式化评论区接口内的用户信息并储存 */
export const formatCommentAuthors = (data: any[]) => {
  const { setCommentAuthors, getCommentAuthors } = store;
  const commentAuthors: IBlockedUser[] = [...getCommentAuthors()];
  const fnAuthor = (data: any[]) => {
    if (!data) return;
    data.forEach((item) => {
      const author = item.author;
      if (author && !commentAuthors.find((i) => i.id === author.id)) {
        commentAuthors.push({
          id: author.id,
          name: author.name,
          urlToken: author.url_token,
          userType: author.type,
        });
      }

      if (item.child_comments) {
        fnAuthor(item.child_comments);
      }
    });
  };
  fnAuthor(data);
  setCommentAuthors(commentAuthors);
};

/** 监听评论区 */
export const doListenComment = () => {
  const { setCommentAuthors } = store;
  /** 页面中的评论容器 */
  const nodeCommentInPage = dom('.Comments-container .css-18ld3w0');
  /** 弹窗中的评论容器 */
  const nodeCommentDialog = dom('.css-18ld3w0');
  // const nodeCommentDialogChild = dom('.css-34podr');
  const nodeCommentDialogChild = dom('.css-16zdamy');

  if (!nodeCommentInPage && !nodeCommentDialog && !nodeCommentDialogChild) {
    // 不存在评论内容则清除评论用户信息
    setCommentAuthors([]);
    return;
  }
  formatComments(nodeCommentInPage);
  formatComments(nodeCommentDialog);
  formatComments(nodeCommentDialogChild);
};

/** 评论 data-id 属性 */
const ATTR_COMMENT_ID = 'data-id';
/** 黑名单用户评论标签类名 */
const CLASS_TAG = 'ctz-comment-block-tag';
/** 评论区屏蔽用户按钮 */
const CLASS_BLOCK_ADD = 'ctz-comment-block-add';
/** 评论区移除黑名单用户按钮 */
const CLASS_BLOCK_REMOVE = 'ctz-comment-block-remove';

const formatComments = async (nodeComments?: HTMLElement, commentBoxClass = '.css-jp43l4') => {
  console.log('nodeComments', nodeComments);
  if (!nodeComments) return;
  // const { getCommentAuthors } = store;
  const { showBlockUserComment, removeBlockUserComment, blockedUsers, showBlockUserCommentTag } = await myStorage.getConfig();
  // const commentAuthors = getCommentAuthors();
  /** 元素上 data-id 属性 */
  const ATTR_ID = 'data-id';
  /** 元素上 data-operate 属性，表明已经被操作过 */
  const ATTR_OPERATE = 'data-operate';
  if (nodeComments) {
    const comments = nodeComments.childNodes;
    for (let i = 0, len = comments.length; i < len; i++) {
      const item = comments[i] as HTMLElement;
      // if (item.getAttribute(ATTR_OPERATE) || !item.getAttribute(ATTR_ID)) continue;
      if (item.nodeName === 'BUTTON') {
        item.addEventListener('click', () => {
          setTimeout(() => {
            doListenComment();
          }, 500);
        });
      } else if (!item.getAttribute(ATTR_ID)) {
        continue;
      }

      // if (!item.getAttribute(ATTR_ID)) continue;
      const itemUserBox = item.querySelector(`${commentBoxClass} .css-14nvvry .css-swj9d4`) as HTMLElement;
      if (!itemUserBox) continue;
      /** 获取当前评论的用户信息，可能有两条的情况（回复评论） */
      const itemCommentUsers = itemUserBox.querySelectorAll('.css-1tww9qq');
      /** 当前 item 是否隐藏 */
      let isHidden = false;

      for (let j = 0, lenUsers = itemCommentUsers.length; j < lenUsers; j++) {
        if (isHidden) continue;
        const user = itemCommentUsers[j] as HTMLElement;
        const userLink = user.querySelector('.css-1gomreu a') as HTMLAnchorElement;
        const userId = userLink.href.replace(/[\w\W]+\/people\//, '');
        /** 匹配在黑名单的位置 */
        const findUser = (blockedUsers || []).find((i) => i.id === userId);
        /** 是否在黑名单中 */
        const isBlocked = !!findUser;

        // 屏蔽黑名单用户发布的评论
        if (removeBlockUserComment && isBlocked) {
          // item.setAttribute(ATTR_OPERATE, 'true');
          isHidden = true;
          fnLog('已隐藏一个黑名单用户的评论，' + `${findUser.name}`);
          continue;
        }

        // 黑名单用户发布的评论显示黑名单标签
        showBlockUserCommentTag && commentBlockedTag(user, isBlocked);
        // 评论用户名后显示"屏蔽用户"按钮
        showBlockUserComment && commentButtons(user, isBlocked, userId);
      }

      if (isHidden) {
        item.style.display = 'none';
        continue;
      }

      formatComments(item, '.css-1kwt8l8');
    }
  }
};

/** 评论黑名单用户标签 */
const commentBlockedTag = (nodeUser: HTMLElement, isBlocked: boolean) => {
  const prevNodeTag = nodeUser.querySelector(`.${CLASS_TAG}`);
  if (prevNodeTag && !isBlocked) {
    prevNodeTag.remove();
    return;
  }
  if (!prevNodeTag && isBlocked) {
    nodeUser.appendChild(
      domC('div', {
        innerHTML: '黑名单',
        style: 'padding: 2px 6px;background:#000;color: #fff;font-size: 12px;border-radius: 4px;margin-left: 8px;',
        className: CLASS_TAG,
      })
    );
  }
};

/** 评论用户名后显示"屏蔽用户"按钮 */
const commentButtons = (nodeUser: HTMLElement, isBlocked: boolean, userId: string) => {
  const commentAuthors = store.getCommentAuthors();
  if (!!isBlocked) {
    // 已经在黑名单中，添加解除拉黑按钮
    if (nodeUser.querySelector(`.${CLASS_BLOCK_REMOVE}`)) return;

    const nButtonRemoveBlock = createButtonFontSize12('解除屏蔽', CLASS_BLOCK_REMOVE);
    nButtonRemoveBlock.onclick = async () => {
      const commentUserInfo = commentAuthors.find((i) => i.id === userId);
      if (commentUserInfo) {
        myBlack.serviceRemove(commentUserInfo);
      }
    };

    nodeUser.appendChild(nButtonRemoveBlock);
  } else {
    // 未在黑名单中，添加拉黑按钮
    if (nodeUser.querySelector(`.${CLASS_BLOCK_ADD}`)) return;

    const nButtonAddBlock = createButtonFontSize12('屏蔽', CLASS_BLOCK_ADD);
    nButtonAddBlock.onclick = async () => {
      const commentUserInfo = commentAuthors.find((i) => i.id === userId);
      if (commentUserInfo) {
        myBlack.addBlackItem(commentUserInfo);
      }
    };
    nodeUser.appendChild(nButtonAddBlock);
  }
};
