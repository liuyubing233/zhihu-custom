import { CTZ_HIDDEN_ITEM_CLASS } from '../commons/math-for-my-listens';
import { myStorage } from '../commons/storage';
import { dom, domC, fnLog, fnReturnStr } from '../commons/tools';
import { store } from '../store';
import { IBlockedUser } from '../types';
import { addBlockUser, CLASS_BLACK_TAG, removeBlockUser } from './black';

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
  const nodeCommentInPage = dom('.css-18ld3w0');
  /** 弹窗中的评论容器 */
  const nodeCommentDialog = dom('.css-16zdamy');
  if (!nodeCommentInPage && !nodeCommentDialog) {
    // 不存在评论内容则清除评论用户信息
    setCommentAuthors([]);
    return;
  }

  formatComments(nodeCommentInPage);
  formatComments(nodeCommentDialog);
};

/** 评论区屏蔽用户按钮 */
const CLASS_BLOCK_ADD = 'ctz-comment-block-add';
/** 评论区移除黑名单用户按钮 */
const CLASS_BLOCK_REMOVE = 'ctz-comment-block-remove';
/** 按钮外层盒子 */
const CLASS_BLOCK_BOX = 'ctz-comment-block-box';
/** 元素上 data-id 属性 */
const ATTR_ID = 'data-id';

const formatComments = async (nodeComments?: HTMLElement, commentBoxClass = '.css-jp43l4') => {
  if (!nodeComments) return;
  if (nodeComments.querySelector('.css-1t6pvna')) {
    // 评论加载中
    setTimeout(() => {
      formatComments(nodeComments, commentBoxClass);
    }, 500);
  }

  const commentAuthors = store.getCommentAuthors();
  const { removeBlockUserComment, blockedUsers } = await myStorage.getConfig();
  const comments = nodeComments.childNodes;
  for (let i = 0, len = comments.length; i < len; i++) {
    const item = comments[i] as HTMLElement;
    if (item.nodeName === 'BUTTON') {
      item.addEventListener('click', () => {
        setTimeout(() => {
          doListenComment();
        }, 500);
      });
    } else if (!item.getAttribute(ATTR_ID) || item.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) {
      continue;
    }

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
        isHidden = true;
        fnLog('已隐藏一个黑名单用户的评论，' + `${findUser.name}`);
        continue;
      }
      if (user.querySelector(`.${CLASS_BLOCK_BOX}`)) continue;

      const commentUserInfo = commentAuthors.find((i) => i.id === userId);
      if (!commentUserInfo) continue;

      const nBox = domC('div', {
        className: CLASS_BLOCK_BOX,
        innerHTML: await changeBoxHTML(isBlocked),
      });
      nBox.onclick = async function (event) {
        const me = this as HTMLElement;
        const target = event.target as HTMLButtonElement;
        // 解除屏蔽
        if (target.classList.contains(CLASS_BLOCK_REMOVE)) {
          await removeBlockUser(commentUserInfo);
          me.innerHTML = await changeBoxHTML(false);
          return;
        }
        // 添加屏蔽
        if (target.classList.contains(CLASS_BLOCK_ADD)) {
          await addBlockUser(commentUserInfo);
          me.innerHTML = await changeBoxHTML(true);
          return;
        }
      };
      user.append(nBox);
    }

    if (isHidden) {
      item.style.display = 'none';
      item.classList.add(CTZ_HIDDEN_ITEM_CLASS);
      continue;
    }

    formatComments(item, '.css-1kwt8l8');
  }
};

const changeBoxHTML = async (isBlocked: boolean) => {
  const { showBlockUserComment, showBlockUserCommentTag } = await myStorage.getConfig();
  if (isBlocked) {
    return (
      fnReturnStr(`<div class="${CLASS_BLACK_TAG}">黑名单</div>`, showBlockUserCommentTag) +
      fnReturnStr(`<button class="${CLASS_BLOCK_REMOVE} ctz-button">解除屏蔽</button>`, showBlockUserComment)
    );
  } else {
    return fnReturnStr(`<button class="${CLASS_BLOCK_ADD} ctz-button">屏蔽</button>`, showBlockUserComment);
  }
};
